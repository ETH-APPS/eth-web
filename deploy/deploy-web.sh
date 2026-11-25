#!/usr/bin/env bash

# ==============================================================================
# deploy-web
#
# Invoked by GitHub Actions through /usr/local/sbin/deploy-eth-web on the VM.
#
# Flow:
#   STAGE 1  Prepare the environment and check VM prerequisites
#   STAGE 2  Verify the running services are healthy and record the version
#            we can restore
#   STAGE 3  Fetch the latest main and prepare an isolated release directory
#   STAGE 4  Build the new image (or reuse the image for the same commit)
#   STAGE 5  Replace only the web service and verify the new one is reachable
# ==============================================================================


# ==============================================================================
# STAGE 1: Prepare the environment and check VM prerequisites
# ==============================================================================

set -Eeuo pipefail

IFS=$' \t\n'
umask 027
export PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
export HOME='/root'

# Drop any inherited variables that could change how git/docker/compose behave.
unset BASH_ENV CDPATH COMPOSE_FILE COMPOSE_PROJECT_NAME DOCKER_CONTEXT DOCKER_HOST \
  ENV GIT_CONFIG_COUNT GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE IMAGE_TAG \
  NUXT_PUBLIC_SITE_URL NUXT_DUCKING_SIGNING_SECRET

# --- Fixed paths and names ----------------------------------------------------
readonly REPO_DIR='/opt/eth-web'
readonly REPO_URL='git@github.com:ETH-APPS/eth-web.git'
readonly RELEASE_ROOT='/var/lib/eth-web-deploy/releases'
readonly COMPOSE_FILE='/etc/eth-web/web.compose.yaml'
readonly SITE_URL_FILE='/etc/eth-web/site-url'
readonly SIGNING_SECRET_FILE='/etc/eth-web/ducking-signing-secret'
readonly DEPLOY_KEY='/home/ethapps/.ssh/eth-web-deploy'
readonly KNOWN_HOSTS='/home/ethapps/.ssh/known_hosts'
readonly PROJECT_NAME='eth-web'
readonly TUNNEL_PROJECT_NAME='eth-web-named-tunnel'
readonly NETWORK_NAME='eth-web_default'
readonly IMAGE_NAME='eth-web-web'
readonly LOCK_FILE='/run/lock/eth-web-deploy.lock'

# --- Logging helpers ----------------------------------------------------------
log() {
  printf '[deploy-web] %s\n' "$*"
}

fail() {
  printf '[deploy-web] ERROR: %s\n' "$*" >&2
  exit 1
}

# --- Basic sanity checks ------------------------------------------------------
[[ "$EUID" -eq 0 ]] || fail 'this helper must run as root'
[[ $# -eq 0 ]] || fail 'this helper does not accept arguments'
[[ -d "$REPO_DIR/.git" ]] || fail "repository not found at ${REPO_DIR}"
[[ -f "$COMPOSE_FILE" && ! -L "$COMPOSE_FILE" ]] || fail "fixed Compose file is missing or unsafe: ${COMPOSE_FILE}"

# --- Validate the site URL file ----------------------------------------------
[[ -f "$SITE_URL_FILE" && ! -L "$SITE_URL_FILE" ]] || fail "site URL file is missing or unsafe: ${SITE_URL_FILE}"
[[ "$(stat -c '%U:%G' "$SITE_URL_FILE")" == 'root:root' ]] || fail "site URL file must be owned by root:root: ${SITE_URL_FILE}"
SITE_URL_MODE="$(stat -c '%a' "$SITE_URL_FILE")"
readonly SITE_URL_MODE
[[ "$SITE_URL_MODE" == '600' || "$SITE_URL_MODE" == '644' ]] || fail "site URL file mode must be 600 or 644: ${SITE_URL_FILE}"

mapfile -t SITE_URL_LINES < "$SITE_URL_FILE"
readonly -a SITE_URL_LINES
[[ "${#SITE_URL_LINES[@]}" -eq 1 ]] || fail "site URL file must contain exactly one line: ${SITE_URL_FILE}"
SITE_URL="${SITE_URL_LINES[0]}"
readonly SITE_URL
[[ "$SITE_URL" =~ ^https://[A-Za-z0-9.-]+(:[0-9]{1,5})?$ ]] \
  || fail 'site URL must be an HTTPS origin without a path, query, fragment, or trailing slash'

# --- Validate the signing secret file ----------------------------------------
[[ -f "$SIGNING_SECRET_FILE" && ! -L "$SIGNING_SECRET_FILE" ]] || fail 'Ducking signing secret file is missing or unsafe'
[[ "$(stat -c '%U:%G' "$SIGNING_SECRET_FILE")" == 'root:root' ]] || fail 'Ducking signing secret file must be owned by root:root'
[[ "$(stat -c '%a' "$SIGNING_SECRET_FILE")" == '600' ]] || fail 'Ducking signing secret file mode must be 600'
mapfile -t SIGNING_SECRET_LINES < "$SIGNING_SECRET_FILE"
[[ "${#SIGNING_SECRET_LINES[@]}" -eq 1 && -n "${SIGNING_SECRET_LINES[0]}" ]] || fail 'Ducking signing secret file must contain one nonempty line'
SIGNING_SECRET="${SIGNING_SECRET_LINES[0]}"
readonly SIGNING_SECRET
unset SIGNING_SECRET_LINES

# --- Validate SSH material and the Docker network ----------------------------
[[ -f "$DEPLOY_KEY" ]] || fail "deploy key not found at ${DEPLOY_KEY}"
[[ -f "$KNOWN_HOSTS" ]] || fail "SSH known_hosts not found at ${KNOWN_HOSTS}"
docker network inspect "$NETWORK_NAME" >/dev/null

# --- Prevent concurrent deployments ------------------------------------------
exec 9>"$LOCK_FILE"
flock -n 9 || fail 'another web deployment is already running'

# --- Helper functions ---------------------------------------------------------

# Run git as the unprivileged "ethapps" user with a clean environment and a
# strict, key-only SSH configuration (SSH over port 443 via ssh.github.com).
git_as_ethapps() {
  local workdir="$1"
  shift

  runuser -u ethapps -- env -i \
    HOME='/home/ethapps' \
    PATH='/usr/bin:/bin' \
    GIT_SSH_COMMAND="ssh -p 443 -o Hostname=ssh.github.com -o HostKeyAlias=github.com -o ConnectTimeout=15 -i ${DEPLOY_KEY} -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes -o UserKnownHostsFile=${KNOWN_HOSTS}" \
    git -C "$workdir" "$@"
}

# Run docker compose with a clean environment; the image tag, site URL and
# signing secret are passed explicitly instead of being inherited.
compose() {
  local tag="$1"
  shift

  env -i \
    HOME='/root' \
    PATH="$PATH" \
    COMPOSE_IGNORE_ORPHANS='true' \
    IMAGE_TAG="$tag" \
    NUXT_PUBLIC_SITE_URL="$SITE_URL" \
    NUXT_DUCKING_SIGNING_SECRET="$SIGNING_SECRET" \
    docker compose \
      --project-name "$PROJECT_NAME" \
      --env-file /dev/null \
      --file "$COMPOSE_FILE" \
      "$@"
}

# Print the ID of one running service container in the requested Compose project.
single_container_id() {
  local service="$1"
  local project="${2:-$PROJECT_NAME}"
  local -a ids=()

  mapfile -t ids < <(
    docker ps \
      --no-trunc \
      --quiet \
      --filter "label=com.docker.compose.project=${project}" \
      --filter "label=com.docker.compose.service=${service}"
  )

  [[ "${#ids[@]}" -eq 1 ]] || fail "expected exactly one running ${service} container in ${project}, found ${#ids[@]}"
  printf '%s\n' "${ids[0]}"
}

# Wait until a container is running and its healthcheck reports "healthy".
# Returns 1 on timeout or if the container is exited/dead/unhealthy/has no healthcheck.
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

# Check that the site is reachable through the Caddy gateway (up to 15 tries).
gateway_ok() {
  local attempt

  for attempt in {1..15}; do
    if curl --fail --silent --show-error --max-time 10 \
      http://127.0.0.1:8080/favicon-eth.png >/dev/null; then
      return 0
    fi
    sleep 2
  done

  return 1
}


# ==============================================================================
# STAGE 2: Verify the current services are healthy and record the version
#          that can be restored (used for rollback)
# ==============================================================================

OLD_WEB_ID="$(single_container_id web)"
readonly OLD_WEB_ID
GATEWAY_ID="$(single_container_id gateway)"
readonly GATEWAY_ID
NAMED_TUNNEL_ID="$(single_container_id cloudflared "$TUNNEL_PROJECT_NAME")"
readonly NAMED_TUNNEL_ID

[[ "$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$OLD_WEB_ID")" == 'healthy' ]] \
  || fail 'the current web container is not healthy'
gateway_ok || fail 'the existing site is not reachable through Caddy'

# Record the image and runtime config currently running.
OLD_IMAGE="$(docker inspect --format '{{.Config.Image}}' "$OLD_WEB_ID")"
readonly OLD_IMAGE
[[ "$OLD_IMAGE" == "${IMAGE_NAME}:"* ]] || fail "unexpected current web image: ${OLD_IMAGE}"
CURRENT_SITE_URL="$(
  docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$OLD_WEB_ID" \
    | sed -n 's/^NUXT_PUBLIC_SITE_URL=//p'
)"
readonly CURRENT_SITE_URL
CURRENT_SIGNING_SECRET="$(
  docker inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$OLD_WEB_ID" \
    | sed -n 's/^NUXT_DUCKING_SIGNING_SECRET=//p'
)"
readonly CURRENT_SIGNING_SECRET
readonly OLD_TAG="${OLD_IMAGE#${IMAGE_NAME}:}"
[[ "$OLD_TAG" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]] || fail "unsafe current web image tag: ${OLD_TAG}"
docker image inspect "$OLD_IMAGE" >/dev/null


# ==============================================================================
# STAGE 3: Fetch the latest main and prepare an isolated release directory
# ==============================================================================

log 'fetching the latest origin/main with the read-only deploy key'
git_as_ethapps "$REPO_DIR" fetch --force --no-tags \
  "$REPO_URL" \
  '+refs/heads/main:refs/remotes/origin/main'

# Resolve the target commit and derive a short, safe image tag from it.
TARGET_SHA="$(git_as_ethapps "$REPO_DIR" rev-parse --verify 'refs/remotes/origin/main^{commit}')"
readonly TARGET_SHA
[[ "$TARGET_SHA" =~ ^[0-9a-f]{40}$ ]] || fail 'origin/main did not resolve to a 40-character commit SHA'
TARGET_TAG="$(git_as_ethapps "$REPO_DIR" rev-parse --short=12 "$TARGET_SHA")"
readonly TARGET_TAG
[[ "$TARGET_TAG" =~ ^[0-9a-f]{12,40}$ ]] || fail 'Git did not produce a safe unique image tag'
readonly TARGET_IMAGE="${IMAGE_NAME}:${TARGET_TAG}"
readonly RELEASE_DIR="${RELEASE_ROOT}/${TARGET_SHA}"

install -d -o ethapps -g ethapps -m 0750 "$RELEASE_ROOT"

# Reuse the release worktree if it already exists and is clean;
# otherwise create a fresh detached worktree for this commit.
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

# Stop early if the same code and the same runtime config are already live.
if [[ "$OLD_IMAGE" == "$TARGET_IMAGE" ]] && \
  [[ "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$TARGET_IMAGE")" == "$TARGET_SHA" ]] && \
  [[ "$CURRENT_SITE_URL" == "$SITE_URL" ]] && \
  [[ "$CURRENT_SIGNING_SECRET" == "$SIGNING_SECRET" ]]; then
  log "${TARGET_SHA} is already deployed"
  exit 0
fi


# ------------------------------------------------------------------------------
# ROLLBACK SETUP: arm the rollback handler BEFORE the web container is replaced.
# If anything fails after swap_started=true, attempt to restore the previous
# web image; the rollback itself can also fail.
# ------------------------------------------------------------------------------
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
        [[ "$(single_container_id cloudflared "$TUNNEL_PROJECT_NAME")" == "$NAMED_TUNNEL_ID" ]]; then
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


# ==============================================================================
# STAGE 4: Build the new image, or reuse the existing image for the same commit
# ==============================================================================

if docker image inspect "$TARGET_IMAGE" >/dev/null 2>&1 && \
  [[ "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$TARGET_IMAGE")" == "$TARGET_SHA" ]]; then
  log "reusing existing image ${TARGET_IMAGE}"
else
  log "building ${TARGET_IMAGE}; the running site remains online during the build"
  docker build \
    --label "org.opencontainers.image.revision=${TARGET_SHA}" \
    --tag "$TARGET_IMAGE" \
    --file "${RELEASE_DIR}/apps/web/Dockerfile" \
    "$RELEASE_DIR"
fi

# Confirm the image revision label matches the commit we intend to deploy.
BUILT_REVISION="$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$TARGET_IMAGE")"
readonly BUILT_REVISION
[[ "$BUILT_REVISION" == "$TARGET_SHA" ]] || fail 'built image revision label does not match origin/main'


# ==============================================================================
# STAGE 5: Replace only the web service and verify the new one is reachable
# ==============================================================================

# Validate the Compose configuration before touching anything that is running.
compose "$TARGET_TAG" config --quiet

# From this point on, any failure triggers the rollback handler above.
swap_started=true
log 'replacing only web; gateway and named tunnel remain running'

# The compose() helper reads /etc/eth-web/web.compose.yaml on the VM.
# It validates that configuration before replacing the web container.
compose "$TARGET_TAG" up --detach --no-build --no-deps web

NEW_WEB_ID="$(single_container_id web)"
readonly NEW_WEB_ID
wait_healthy "$NEW_WEB_ID" 150 || fail 'new web container did not become healthy'
gateway_ok || fail 'new web container is not reachable through Caddy'

# Make sure the other services were not recreated during the deployment.
[[ "$(single_container_id gateway)" == "$GATEWAY_ID" ]] || fail 'gateway container changed during deployment'
[[ "$(single_container_id cloudflared "$TUNNEL_PROJECT_NAME")" == "$NAMED_TUNNEL_ID" ]] || fail 'named tunnel container changed during deployment'

# Success: disarm the rollback.
swap_started=false
log "successfully deployed ${TARGET_SHA} as ${TARGET_IMAGE}; gateway and named tunnel are unchanged"

