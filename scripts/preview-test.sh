#!/usr/bin/env bash
# Run the playwright suite against `astro preview`.
#
# Astro 7's preview server is awkward to drive from a script in two ways, and
# both bite the *next* run rather than the current one:
#
# 1. It sometimes daemonizes and returns immediately, and sometimes stays in
#    the foreground. Playwright's own `webServer` reads the first case as
#    "Process from config.webServer exited early", and a bare `astro preview
#    && playwright test` never reaches playwright in the second. So start it
#    in the background here and wait for the port either way;
#    `reuseExistingServer: true` lets playwright adopt it.
# 2. `astro preview stop` hangs indefinitely, so stop the server by port.
#    Left running, it outlives teardown and fails the following run.
#
# Only astro processes are killed, so a `bun run dev` on the same port is
# never collateral damage.

set -uo pipefail

PORT="${PORT:-4321}"
URL="http://127.0.0.1:$PORT/"

stop_preview() {
  local pids p
  pids=$(lsof -ti "tcp:$PORT" 2>/dev/null) || return 0
  for p in $pids; do
    if ps -p "$p" -o command= 2>/dev/null | grep -q astro; then
      kill "$p" 2>/dev/null || true
    fi
  done

  # Wait for the port to actually free before handing it to the next start.
  for _ in 1 2 3 4 5; do
    lsof -ti "tcp:$PORT" >/dev/null 2>&1 || return 0
    sleep 1
  done
  return 0
}

stop_preview

bunx astro preview --port "$PORT" --host 127.0.0.1 &

ready=""
for _ in $(seq 1 60); do
  if curl -sf -o /dev/null "$URL"; then
    ready=1
    break
  fi
  sleep 1
done

if [ -z "$ready" ]; then
  echo "preview server never came up at $URL" >&2
  stop_preview
  exit 1
fi

bunx playwright test "$@"
e=$?
stop_preview
exit $e
