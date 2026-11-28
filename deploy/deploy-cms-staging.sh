#!/usr/bin/env bash

# Deploy one exact commit from origin/staging into the isolated CMS staging
# Compose project. The requested commit is read from stdin so sudo can keep this
# helper no-argument and narrowly scoped.

set -Eeuo pipefail

IFS=$' \t\n'
umask 027
export PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'

unset BASH_ENV CDPATH COMPOSE_FILE COMPOSE_PROJECT_NAME DOCKER_CONTEXT DOCKER_HOST \
  ENV GIT_CONFIG_COUNT GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE IMAGE_TAG \
  POSTGRES_ENV_FILE API_ENV_FILE CMS_ENV_FILE CMS_NETWORK_ALIAS

readonly REPO_DIR='/opt/eth-web'
readonly REPO_URL='git@github.com:ETH-APPS/eth-web.git'
readonly RELEASE_ROOT='/var/lib/eth-cms-deploy/staging/releases'
readonly HELPER_PATH='/usr/local/sbin/deploy-eth-cms-staging'
readonly COMPOSE_FILE_PATH='/etc/eth-cms/staging/cms.compose.yaml'
readonly POSTGRES_ENV_PATH='/etc/eth-cms/staging/postgres.env'
readonly API_ENV_PATH='/etc/eth-cms/staging/api.env'
readonly CMS_ENV_PATH='/etc/eth-cms/staging/cms.env'
readonly DEPLOY_KEY='/home/ethapps/.ssh/eth-web-deploy'
readonly KNOWN_HOSTS='/home/ethapps/.ssh/known_hosts'
readonly PROJECT_NAME='eth-cms-staging'
readonly WEB_PROJECT_NAME='eth-web'
readonly TUNNEL_PROJECT_NAME='eth-web-named-tunnel'
readonly GATEWAY_NETWORK='eth-web_default'
readonly CMS_NETWORK_ALIAS='cms-staging'
readonly API_IMAGE_NAME='eth-cms-api'
readonly MIGRATION_IMAGE_NAME='eth-cms-api-migrate'
readonly CMS_IMAGE_NAME='eth-cms-web'
readonly LOCK_FILE='/run/lock/eth-cms-staging-deploy.lock'

log() {
  printf '[deploy-cms-staging] %s\n' "$*"
}

fail() {
  printf '[deploy-cms-staging] ERROR: %s\n' "$*" >&2
  exit 1
}

validate_root_file() {
  local path="$1"
  local mode="$2"

  [[ -f "$path" && ! -L "$path" ]] || fail "required file is missing or unsafe: ${path}"
  [[ "$(stat -c '%U:%G' "$path")" == 'root:root' ]] || fail "file must be owned by root:root: ${path}"
  [[ "$(stat -c '%a' "$path")" == "$mode" ]] || fail "file must have mode ${mode}: ${path}"
}

git_as_ethapps() {
  local workdir="$1"
  shift

  runuser -u ethapps -- env -i \
    HOME='/home/ethapps' \
    PATH='/usr/bin:/bin' \
    GIT_SSH_COMMAND="ssh -p 443 -o Hostname=ssh.github.com -o HostKeyAlias=github.com -o ConnectTimeout=15 -i ${DEPLOY_KEY} -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=${KNOWN_HOSTS}" \
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
    POSTGRES_ENV_FILE="$POSTGRES_ENV_PATH" \
    API_ENV_FILE="$API_ENV_PATH" \
    CMS_ENV_FILE="$CMS_ENV_PATH" \
    CMS_NETWORK_ALIAS="$CMS_NETWORK_ALIAS" \
    docker compose \
      --project-name "$PROJECT_NAME" \
      --env-file /dev/null \
      --file "$COMPOSE_FILE_PATH" \
      "$@"
}

container_ids() {
  local service="$1"
  local project="$2"

  docker ps \
    --no-trunc \
    --quiet \
    --filter "label=com.docker.compose.project=${project}" \
    --filter "label=com.docker.compose.service=${service}"
}

single_container_id() {
  local service="$1"
  local project="$2"
  local -a ids=()

  mapfile -t ids < <(container_ids "$service" "$project")
  [[ "${#ids[@]}" -eq 1 ]] || fail "expected one running ${service} container in ${project}, found ${#ids[@]}"
  printf '%s\n' "${ids[0]}"
}

optional_container_id() {
  local service="$1"
  local project="$2"
  local -a ids=()

  mapfile -t ids < <(container_ids "$service" "$project")
  [[ "${#ids[@]}" -le 1 ]] || fail "expected at most one running ${service} container in ${project}, found ${#ids[@]}"
  [[ "${#ids[@]}" -eq 1 ]] && printf '%s\n' "${ids[0]}"
  return 0
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

revision_matches() {
  local image="$1"
  local revision="$2"

  docker image inspect "$image" >/dev/null 2>&1 \
    && [[ "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$image")" == "$revision" ]]
}

build_image() {
  local image="$1"
  local dockerfile="$2"
  local target="$3"

  if revision_matches "$image" "$TARGET_SHA"; then
    log "reusing ${image}"
    return
  fi

  log "building ${image}"
  docker build \
    --label "org.opencontainers.image.revision=${TARGET_SHA}" \
    --target "$target" \
    --tag "$image" \
    --file "${RELEASE_DIR}/${dockerfile}" \
    "$RELEASE_DIR"
}

production_unchanged() {
  [[ "$(single_container_id web "$WEB_PROJECT_NAME")" == "$PRODUCTION_WEB_ID" ]] \
    && [[ "$(single_container_id gateway "$WEB_PROJECT_NAME")" == "$PRODUCTION_GATEWAY_ID" ]] \
    && [[ "$(single_container_id cloudflared "$TUNNEL_PROJECT_NAME")" == "$PRODUCTION_TUNNEL_ID" ]]
}

[[ "$EUID" -eq 0 ]] || fail 'this helper must run as root'
[[ $# -eq 0 ]] || fail 'this helper does not accept arguments'
IFS= read -r REQUESTED_SHA || fail 'expected one commit SHA on stdin'
[[ "$REQUESTED_SHA" =~ ^[0-9a-f]{40}$ ]] || fail 'requested revision must be a 40-character lowercase commit SHA'
if IFS= read -r _; then
  fail 'expected exactly one line on stdin'
fi
readonly REQUESTED_SHA

[[ -d "$REPO_DIR/.git" ]] || fail "repository not found at ${REPO_DIR}"
validate_root_file "$COMPOSE_FILE_PATH" 644
validate_root_file "$POSTGRES_ENV_PATH" 600
validate_root_file "$API_ENV_PATH" 600
validate_root_file "$CMS_ENV_PATH" 600
[[ -f "$DEPLOY_KEY" ]] || fail "deploy key not found at ${DEPLOY_KEY}"
[[ -f "$KNOWN_HOSTS" ]] || fail "SSH known_hosts not found at ${KNOWN_HOSTS}"
docker network inspect "$GATEWAY_NETWORK" >/dev/null

exec 9>"$LOCK_FILE"
flock -n 9 || fail 'another CMS staging deployment is already running'

PRODUCTION_WEB_ID="$(single_container_id web "$WEB_PROJECT_NAME")"
readonly PRODUCTION_WEB_ID
PRODUCTION_GATEWAY_ID="$(single_container_id gateway "$WEB_PROJECT_NAME")"
readonly PRODUCTION_GATEWAY_ID
PRODUCTION_TUNNEL_ID="$(single_container_id cloudflared "$TUNNEL_PROJECT_NAME")"
readonly PRODUCTION_TUNNEL_ID
wait_healthy "$PRODUCTION_WEB_ID" 1 || fail 'production web is not healthy before staging deployment'
wait_healthy "$PRODUCTION_GATEWAY_ID" 1 || fail 'production gateway is not healthy before staging deployment'

log 'fetching origin/staging with the read-only deploy key'
git_as_ethapps "$REPO_DIR" fetch --force --no-tags \
  "$REPO_URL" \
  '+refs/heads/staging:refs/remotes/origin/staging'

TARGET_SHA="$(git_as_ethapps "$REPO_DIR" rev-parse --verify 'refs/remotes/origin/staging^{commit}')"
readonly TARGET_SHA
[[ "$TARGET_SHA" == "$REQUESTED_SHA" ]] \
  || fail "origin/staging moved: workflow requested ${REQUESTED_SHA}, current head is ${TARGET_SHA}"
TARGET_TAG="$(git_as_ethapps "$REPO_DIR" rev-parse --short=12 "$TARGET_SHA")"
readonly TARGET_TAG
[[ "$TARGET_TAG" =~ ^[0-9a-f]{12,40}$ ]] || fail 'Git did not produce a safe image tag'
readonly RELEASE_DIR="${RELEASE_ROOT}/${TARGET_SHA}"
readonly API_IMAGE="${API_IMAGE_NAME}:${TARGET_TAG}"
readonly MIGRATION_IMAGE="${MIGRATION_IMAGE_NAME}:${TARGET_TAG}"
readonly CMS_IMAGE="${CMS_IMAGE_NAME}:${TARGET_TAG}"

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

cmp --silent "$HELPER_PATH" "${RELEASE_DIR}/deploy/deploy-cms-staging.sh" \
  || fail 'installed staging helper does not match the requested release'
cmp --silent "$COMPOSE_FILE_PATH" "${RELEASE_DIR}/deploy/cms.compose.yaml" \
  || fail 'installed staging Compose file does not match the requested release'

compose "$TARGET_TAG" config --quiet
build_image "$API_IMAGE" 'apps/api/Dockerfile' runtime
build_image "$MIGRATION_IMAGE" 'apps/api/Dockerfile' migration
build_image "$CMS_IMAGE" 'apps/cms/Dockerfile' runtime
revision_matches "$API_IMAGE" "$TARGET_SHA" || fail 'API image revision label is invalid'
revision_matches "$MIGRATION_IMAGE" "$TARGET_SHA" || fail 'migration image revision label is invalid'
revision_matches "$CMS_IMAGE" "$TARGET_SHA" || fail 'CMS image revision label is invalid'
production_unchanged || fail 'production containers changed during the staging build'

OLD_API_ID="$(optional_container_id api "$PROJECT_NAME")"
readonly OLD_API_ID
OLD_CMS_ID="$(optional_container_id cms "$PROJECT_NAME")"
readonly OLD_CMS_ID
if [[ -n "$OLD_API_ID" && -z "$OLD_CMS_ID" ]] \
  || [[ -z "$OLD_API_ID" && -n "$OLD_CMS_ID" ]]; then
  fail 'staging API and CMS must either both be running or both be absent'
fi

OLD_TAG=''
if [[ -n "$OLD_API_ID" ]]; then
  OLD_API_IMAGE="$(docker inspect --format '{{.Config.Image}}' "$OLD_API_ID")"
  OLD_CMS_IMAGE="$(docker inspect --format '{{.Config.Image}}' "$OLD_CMS_ID")"
  [[ "$OLD_API_IMAGE" == "${API_IMAGE_NAME}:"* ]] || fail "unexpected existing staging API image: ${OLD_API_IMAGE}"
  [[ "$OLD_CMS_IMAGE" == "${CMS_IMAGE_NAME}:"* ]] || fail "unexpected existing staging CMS image: ${OLD_CMS_IMAGE}"
  OLD_TAG="${OLD_API_IMAGE#${API_IMAGE_NAME}:}"
  [[ "${OLD_CMS_IMAGE#${CMS_IMAGE_NAME}:}" == "$OLD_TAG" ]] || fail 'existing staging API and CMS tags differ'
  wait_healthy "$OLD_API_ID" 1 || fail 'existing staging API is not healthy'
  wait_healthy "$OLD_CMS_ID" 1 || fail 'existing staging CMS is not healthy'
fi
readonly OLD_TAG

log 'starting only the staging PostgreSQL service'
compose "$TARGET_TAG" up --detach --no-build postgres
POSTGRES_ID="$(single_container_id postgres "$PROJECT_NAME")"
readonly POSTGRES_ID
wait_healthy "$POSTGRES_ID" 180 || fail 'staging PostgreSQL did not become healthy'

log 'applying committed migrations to the staging database'
compose "$TARGET_TAG" run --rm --no-deps migrate
production_unchanged || fail 'production containers changed before the staging application swap'

swap_started=false
rollback_on_exit() {
  local exit_code="$1"
  local rollback_api_id rollback_cms_id

  trap - EXIT INT TERM
  set +e

  if [[ "$swap_started" == true ]]; then
    if [[ -n "$OLD_TAG" ]]; then
      log "deployment failed; restoring staging applications to ${OLD_TAG}"
      compose "$OLD_TAG" up --detach --no-build --no-deps --force-recreate api cms
      rollback_api_id="$(optional_container_id api "$PROJECT_NAME")"
      rollback_cms_id="$(optional_container_id cms "$PROJECT_NAME")"
      if [[ -n "$rollback_api_id" && -n "$rollback_cms_id" ]] \
        && wait_healthy "$rollback_api_id" 180 \
        && wait_healthy "$rollback_cms_id" 180; then
        log 'staging application rollback succeeded; workflow remains failed'
      else
        log 'URGENT: staging application rollback failed'
      fi
    else
      log 'first staging deployment failed; removing only new staging application containers'
      compose "$TARGET_TAG" stop api cms
      compose "$TARGET_TAG" rm --force api cms
    fi
  fi

  production_unchanged || log 'URGENT: production container identity changed unexpectedly'
  exit "$exit_code"
}

trap 'rollback_on_exit $?' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

swap_started=true
log 'replacing only the staging API and CMS containers'
compose "$TARGET_TAG" up --detach --no-build --no-deps --force-recreate api
API_ID="$(single_container_id api "$PROJECT_NAME")"
readonly API_ID
wait_healthy "$API_ID" 180 || fail 'staging API did not become healthy'

compose "$TARGET_TAG" up --detach --no-build --no-deps --force-recreate cms
CMS_ID="$(single_container_id cms "$PROJECT_NAME")"
readonly CMS_ID
wait_healthy "$CMS_ID" 180 || fail 'staging CMS did not become healthy'
production_unchanged || fail 'production containers changed during staging deployment'

swap_started=false
log "successfully deployed ${TARGET_SHA}; production web, gateway, and tunnel are unchanged"
