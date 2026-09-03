#!/usr/bin/env bash
# Exercise the Caddyfile's content negotiation against the real built site.
#
# The playwright suite runs against `astro preview`, which knows nothing about
# Accept headers, so the negotiation rules (markdown, Vary, 406, q=0) can only
# regress silently. This boots the actual Caddyfile over ./dist and asserts
# the four acceptmarkdown.com checks plus the 404 status.
#
# Usage: scripts/check-negotiation.sh   (requires `caddy` and a built ./dist)

set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
PORT="${CADDY_TEST_PORT:-8199}"
BASE="http://127.0.0.1:$PORT"

command -v caddy >/dev/null || { echo "caddy not installed" >&2; exit 1; }
[ -d "$DIST" ] || { echo "no dist/. run \`bun run build\` first" >&2; exit 1; }
# Caddy binds with SO_REUSEPORT, so a leaked server from an earlier run keeps
# answering instead of the one we just started. Clear the port first.
stop_caddy() {
  local p
  for p in $(lsof -ti "tcp:$PORT" 2>/dev/null); do
    ps -p "$p" -o command= 2>/dev/null | grep -q caddy && kill "$p" 2>/dev/null
  done
}
stop_caddy
sleep 0.3
if lsof -ti "tcp:$PORT" >/dev/null 2>&1; then
  echo "port $PORT busy and not ours; set CADDY_TEST_PORT" >&2
  exit 1
fi

CFG="$(mktemp)"
sed "s#root \* /srv#root * $DIST#" "$ROOT/Caddyfile" > "$CFG"

PORT="$PORT" caddy run --config "$CFG" --adapter caddyfile >/dev/null 2>&1 &
CADDY_PID=$!
trap 'kill "$CADDY_PID" 2>/dev/null; stop_caddy; rm -f "$CFG"' EXIT

for _ in $(seq 1 40); do
  curl -sf -o /dev/null "$BASE/" && break
  sleep 0.25
done

fails=0
check() { # check <name> <expected> <actual>
  if [ "$2" = "$3" ]; then
    echo "ok   $1"
  else
    echo "FAIL $1: expected [$2] got [$3]"
    fails=$((fails + 1))
  fi
}

ctype() { curl -s -o /dev/null -w '%{content_type}' "$@"; }
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
vary() { curl -sI "$@" | tr -d '\r' | awk 'tolower($1) == "vary:" { $1=""; print }' | tr -d ' ' | paste -sd, -; }

MD='Accept: text/markdown'
HTML='Accept: text/html'

# 1. serves markdown when asked
check "post negotiates markdown" "text/markdown; charset=utf-8" "$(ctype -H "$MD" "$BASE/unpromptable")"
check "homepage negotiates markdown" "text/markdown; charset=utf-8" "$(ctype -H "$MD" "$BASE/")"
check "prose page negotiates markdown" "text/markdown; charset=utf-8" "$(ctype -H "$MD" "$BASE/privacy")"
check "html stays html" "text/html; charset=utf-8" "$(ctype -H "$HTML" "$BASE/unpromptable")"
check "homepage html stays html" "text/html; charset=utf-8" "$(ctype -H "$HTML" "$BASE/")"

# 2. Vary: Accept on every negotiable response
for p in "" unpromptable about contact privacy; do
  case "$(vary -H "$HTML" "$BASE/$p")" in
    *Accept,*|*Accept) echo "ok   /$p varies on Accept" ;;
    *) echo "FAIL /$p Vary missing Accept: [$(vary -H "$HTML" "$BASE/$p")]"; fails=$((fails + 1)) ;;
  esac
done

# 3. 406 for an Accept that allows neither markdown nor html
check "406 on unsupported type" "406" "$(status -H 'Accept: application/json' "$BASE/unpromptable")"
check "406 on unsupported type (root)" "406" "$(status -H 'Accept: application/json' "$BASE/")"
check "wildcard is acceptable" "200" "$(status -H 'Accept: */*' "$BASE/unpromptable")"
check "browser Accept is acceptable" "200" \
  "$(status -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' "$BASE/")"
check "assets are never 406" "200" "$(status -H 'Accept: application/rss+xml' "$BASE/feed.xml")"

# 4. q-values: an explicit q=0 refuses markdown
check "markdown q=0 gets html" "text/html; charset=utf-8" \
  "$(ctype -H 'Accept: text/html,text/markdown;q=0' "$BASE/unpromptable")"
check "markdown q=0 gets html (root)" "text/html; charset=utf-8" \
  "$(ctype -H 'Accept: text/html,text/markdown;q=0' "$BASE/")"
check "markdown q=0.8 still served" "text/markdown; charset=utf-8" \
  "$(ctype -H 'Accept: text/markdown;q=0.8' "$BASE/unpromptable")"

# 5. nonexistent paths are a real 404 with the recovery page body
check "missing path is 404" "404" "$(status "$BASE/definitely-not-a-page")"
curl -s "$BASE/definitely-not-a-page" | grep -q '/llms.txt' \
  && echo "ok   404 body points at llms.txt" \
  || { echo "FAIL 404 body missing llms.txt"; fails=$((fails + 1)); }

echo
[ "$fails" -eq 0 ] && echo "all negotiation checks passed" || echo "$fails check(s) failed"
exit $((fails > 0))
