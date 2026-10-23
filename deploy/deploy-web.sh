#!/usr/bin/env bash

set -Eeuo pipefail

IFS=$' \t\n'
umask 027
export PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
export HOME='/root'
unset BASH_ENV CDPATH COMPOSE_FILE COMPOSE_PROJECT_NAME DOCKER_CONTEXT DOCKER_HOST \
  ENV GIT_CONFIG_COUNT GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE IMAGE_TAG

readonly REPO_DIR='/opt/eth-web'
readonly REPO_URL='git@github.com:ETH-APPS/eth-web.git'
readonly RELEASE_ROOT='/var/lib/eth-web-deploy/releases'
readonly COMPOSE_FILE='/etc/eth-web/web.compose.yaml'
readonly DEPLOY_KEY='/home/ethapps/.ssh/eth-web-deploy'
readonly KNOWN_HOSTS='/home/ethapps/.ssh/known_hosts'
readonly PROJECT_NAME='eth-web'
readonly NETWORK_NAME='eth-web_default'
readonly IMAGE_NAME='eth-web-web'
readonly LOCK_FILE='/run/lock/eth-web-deploy.lock'

log() {
  printf '[deploy-web] %s\n' "$*"
}

fail() {
  printf '[deploy-web] ERROR: %s\n' "$*" >&2
  exit 1
}

[[ "$EUID" -eq 0 ]] || fail 'this helper must run as root'
[[ $# -eq 0 ]] || fail 'this helper does not accept arguments'
[[ -d "$REPO_DIR/.git" ]] || fail "repository not found at ${REPO_DIR}"
[[ -f "$COMPOSE_FILE" && ! -L "$COMPOSE_FILE" ]] || fail "fixed Compose file is missing or unsafe: ${COMPOSE_FILE}"
[[ -f "$DEPLOY_KEY" ]] || fail "deploy key not found at ${DEPLOY_KEY}"
[[ -f "$KNOWN_HOSTS" ]] || fail "SSH known_hosts not found at ${KNOWN_HOSTS}"
docker network inspect "$NETWORK_NAME" >/dev/null

exec 9>"$LOCK_FILE"
flock -n 9 || fail 'another web deployment is already running'

git_as_ethapps() {
  local workdir="$1"
  shift

  runuser -u ethapps -- env -i \
    HOME='/home/ethapps' \
    PATH='/usr/bin:/bin' \
    GIT_SSH_COMMAND="ssh -i ${DEPLOY_KEY} -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=${KNOWN_HOSTS}" \
    git -C "$workdir" "$@"
}

compose() {
  local tag="$1"
  shift

  env -i \
    HOME='/root' \
    PATH="$PATH" \
    COMPOSE_IGNORE_ORPHANS='true' \
    IMAGE_TAG="$tag" \
    docker compose \
      --project-name "$PROJECT_NAME" \
      --env-file /dev/null \
      --file "$COMPOSE_FILE" \
      "$@"
}

single_container_id() {
  local service="$1"
  local -a ids=()

  mapfile -t ids < <(
    docker ps \
      --no-trunc \
      --quiet \
      --filter "label=com.docker.compose.project=${PROJECT_NAME}" \
      --filter "label=com.docker.compose.service=${service}"
  )

  [[ "${#ids[@]}" -eq 1 ]] || fail "expected exactly one running ${service} container, found ${#ids[@]}"
  printf '%s\n' "${ids[0]}"
}

wait_healthy() {
  local container_id="$1"
  local timeout="$2"
  local state health
  local deadline=$((SECONDS + timeout))

  while ((SECONDS < deadline)); do
    read -r state health < <(
      docker inspect --format \
        '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' \
        "$container_id"
    )

    if [[ "$state" == 'running' && "$health" == 'healthy' ]]; then
      return 0
    fi
    if [[ "$state" == 'exited' || "$state" == 'dead' || "$health" == 'unhealthy' || "$health" == 'missing' ]]; then
      return 1
    fi
    sleep 2
  done

  return 1
}

gateway_ok() {
  local attempt

  for attempt in {1..15}; do
    if curl --fail --silent --show-error --max-time 10 \
      http://127.0.0.1:8080/ >/dev/null; then
      return 0
    fi
    sleep 2
  done

  return 1
}

OLD_WEB_ID="$(single_container_id web)"
readonly OLD_WEB_ID
GATEWAY_ID="$(single_container_id gateway)"
readonly GATEWAY_ID
CLOUDFLARED_ID="$(single_container_id cloudflared)"
readonly CLOUDFLARED_ID

[[ "$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$OLD_WEB_ID")" == 'healthy' ]] \
  || fail 'the current web container is not healthy'
gateway_ok || fail 'the existing site is not reachable through Caddy'

OLD_IMAGE="$(docker inspect --format '{{.Config.Image}}' "$OLD_WEB_ID")"
readonly OLD_IMAGE
[[ "$OLD_IMAGE" == "${IMAGE_NAME}:"* ]] || fail "unexpected current web image: ${OLD_IMAGE}"
readonly OLD_TAG="${OLD_IMAGE#${IMAGE_NAME}:}"
[[ "$OLD_TAG" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]] || fail "unsafe current web image tag: ${OLD_TAG}"
docker image inspect "$OLD_IMAGE" >/dev/null

log 'fetching the latest origin/main with the read-only deploy key'
git_as_ethapps "$REPO_DIR" fetch --force --no-tags \
  "$REPO_URL" \
  '+refs/heads/main:refs/remotes/origin/main'

TARGET_SHA="$(git_as_ethapps "$REPO_DIR" rev-parse --verify 'refs/remotes/origin/main^{commit}')"
readonly TARGET_SHA
[[ "$TARGET_SHA" =~ ^[0-9a-f]{40}$ ]] || fail 'origin/main did not resolve to a 40-character commit SHA'
TARGET_TAG="$(git_as_ethapps "$REPO_DIR" rev-parse --short=12 "$TARGET_SHA")"
readonly TARGET_TAG
[[ "$TARGET_TAG" =~ ^[0-9a-f]{12,40}$ ]] || fail 'Git did not produce a safe unique image tag'
readonly TARGET_IMAGE="${IMAGE_NAME}:${TARGET_TAG}"
readonly RELEASE_DIR="${RELEASE_ROOT}/${TARGET_SHA}"

install -d -o ethapps -g ethapps -m 0750 "$RELEASE_ROOT"

if [[ -e "$RELEASE_DIR" ]]; then
  [[ -d "$RELEASE_DIR" && -f "$RELEASE_DIR/.git" ]] || fail "unsafe release path: ${RELEASE_DIR}"
  [[ "$(git_as_ethapps "$RELEASE_DIR" rev-parse --verify HEAD)" == "$TARGET_SHA" ]] \
    || fail 'existing release worktree points to the wrong commit'
  [[ -z "$(git_as_ethapps "$RELEASE_DIR" status --porcelain --untracked-files=all)" ]] \
    || fail 'existing release worktree has local changes'
else
  log "creating clean worktree for ${TARGET_SHA}"
  git_as_ethapps "$REPO_DIR" worktree add --detach "$RELEASE_DIR" "$TARGET_SHA"
fi

if [[ "$OLD_IMAGE" == "$TARGET_IMAGE" ]] && \
  [[ "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$TARGET_IMAGE")" == "$TARGET_SHA" ]]; then
  log "${TARGET_SHA} is already deployed"
  exit 0
fi

swap_started=false

rollback_on_exit() {
  local exit_code="$1"
  local rollback_id
  local rollback_ok=false

  trap - EXIT INT TERM
  set +e

  if [[ "$swap_started" == true ]]; then
    log "deployment failed; rolling web back to ${OLD_IMAGE}"
    compose "$OLD_TAG" up --detach --no-build --no-deps web
    if [[ $? -eq 0 ]]; then
      rollback_id="$(single_container_id web)"
      if wait_healthy "$rollback_id" 150 && gateway_ok && \
        [[ "$(single_container_id gateway)" == "$GATEWAY_ID" ]] && \
        [[ "$(single_container_id cloudflared)" == "$CLOUDFLARED_ID" ]]; then
        rollback_ok=true
      fi
    fi

    if [[ "$rollback_ok" == true ]]; then
      log 'rollback succeeded; the workflow remains failed'
    else
      log 'URGENT: automatic rollback failed'
    fi
  fi

  exit "$exit_code"
}

trap 'rollback_on_exit $?' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

log "building ${TARGET_IMAGE}; the running site remains online during the build"
docker build \
  --label "org.opencontainers.image.revision=${TARGET_SHA}" \
  --tag "$TARGET_IMAGE" \
  --file "${RELEASE_DIR}/apps/web/Dockerfile" \
  "$RELEASE_DIR"

BUILT_REVISION="$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$TARGET_IMAGE")"
readonly BUILT_REVISION
[[ "$BUILT_REVISION" == "$TARGET_SHA" ]] || fail 'built image revision label does not match origin/main'

compose "$TARGET_TAG" config --quiet

swap_started=true
log 'replacing only web; gateway and cloudflared remain running'
compose "$TARGET_TAG" up --detach --no-build --no-deps web

NEW_WEB_ID="$(single_container_id web)"
readonly NEW_WEB_ID
wait_healthy "$NEW_WEB_ID" 150 || fail 'new web container did not become healthy'
gateway_ok || fail 'new web container is not reachable through Caddy'

[[ "$(single_container_id gateway)" == "$GATEWAY_ID" ]] || fail 'gateway container changed during deployment'
[[ "$(single_container_id cloudflared)" == "$CLOUDFLARED_ID" ]] || fail 'cloudflared container changed during deployment'

swap_started=false
log "successfully deployed ${TARGET_SHA} as ${TARGET_IMAGE}; gateway and cloudflared are unchanged"

