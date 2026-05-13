#!/bin/sh
# Block internal markdown links with trailing slashes.
# Site config has `trailingSlash: 'never'` — `/path/` 404s.

set -e

STAGED=$(git diff --cached --name-only --diff-filter=ACM \
  | grep -E '\.(md|mdx|astro)$' || true)

if [ -z "$STAGED" ]; then exit 0; fi

# Match: ](/something/) or href="/something/" or href='/something/' or href=`/something/`
# Skip external links (anything containing :// before the /).
HITS=""
for f in $STAGED; do
  # Markdown: ](/path/) where path doesn't start with http
  MD=$(grep -nE '\]\(/[^)]*/\)' "$f" 2>/dev/null || true)
  # Astro/HTML hrefs ending with / before quote or backtick
  AS=$(grep -nE 'href=["\x27`]/[^"\x27`]*/["\x27`]' "$f" 2>/dev/null || true)
  COMBINED=""
  [ -n "$MD" ] && COMBINED="$MD"
  [ -n "$AS" ] && COMBINED="$COMBINED
$AS"
  if [ -n "$COMBINED" ]; then
    HITS="$HITS
$f:
$COMBINED
"
  fi
done

if [ -n "$HITS" ]; then
  printf "\ninternal links with trailing slash (will 404; site has \`trailingSlash: 'never'\`):\n%s\n" "$HITS"
  printf "fix: strip the trailing slash. e.g. \`](/boosting-builders/)\` → \`](/boosting-builders)\`\n\n"
  exit 1
fi

exit 0
