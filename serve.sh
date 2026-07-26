#!/usr/bin/env bash
#
# Serve the site locally in Docker, so you don't need a working Ruby/Jekyll
# toolchain on your machine. See README.md for details.
#
#   ./serve.sh            # http://localhost:4000/aigamstat.github.io/
#   PORT=8080 ./serve.sh  # http://localhost:8080/aigamstat.github.io/
#
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-4000}"
IMAGE="${IMAGE:-ruby:3.1}"
GEM_VOLUME="aigamstat-gems"

if ! docker info >/dev/null 2>&1; then
  echo "Docker isn't running. Start Docker Desktop and try again." >&2
  exit 1
fi

# Gems live in a named volume so they survive between runs -- the first run
# takes a few minutes, subsequent ones start in seconds.
docker volume create "$GEM_VOLUME" >/dev/null

BASEURL="$(grep -E '^baseurl:' _config.yml | head -1 | sed 's/^baseurl:[[:space:]]*//')"

echo "Starting Jekyll -- the site will be at http://localhost:${PORT}${BASEURL}/"
echo "(The bare http://localhost:${PORT}/ will 404; that's expected with a baseurl set.)"
echo

exec docker run --rm -it \
  -v "$PWD":/site \
  -v "${GEM_VOLUME}":/usr/local/bundle \
  -w /site \
  -p "${PORT}:4000" \
  "$IMAGE" \
  bash -lc "bundle install && exec bundle exec jekyll serve --host 0.0.0.0 --port 4000 --force_polling"
