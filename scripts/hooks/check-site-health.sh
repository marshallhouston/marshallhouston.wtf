#!/bin/bash
# Pre-commit check: validates Jekyll build and checks all links
# Only runs when content files are staged. Blocks commit on failures.

STAGED_CONTENT=$(git diff --cached --name-only --diff-filter=ACM | grep -E "^(_posts|_drafts|_pages|_includes|_layouts|_config.yml|assets/)" )

if [ -z "$STAGED_CONTENT" ]; then
  exit 0
fi

echo "content files changed — running site health check..."

# 1. Jekyll build check (catches invalid layouts, liquid errors, etc.)
BUILD_OUTPUT=$(bundle exec jekyll build 2>&1)
BUILD_EXIT=$?

WARNINGS=$(echo "$BUILD_OUTPUT" | grep -i "warning\|error" | grep -v "Faraday\|deprecat\|verbose mode\|repetitive deprecation")

if [ $BUILD_EXIT -ne 0 ]; then
  echo ""
  echo "✗ Jekyll build failed:"
  echo "$BUILD_OUTPUT" | tail -20
  exit 1
fi

if [ -n "$WARNINGS" ]; then
  echo ""
  echo "━━━ Jekyll build warnings ━━━"
  echo "$WARNINGS"
  echo ""
  exit 1
fi

# 2. Check all internal links, theme rendering, and structural consistency
python3 << 'PYEOF'
import os, re, sys, glob

site_dir = "_site"
errors = []

# standalone utility pages — skip theme/component checks
standalone = ["/comparison.html", "/feedback.html", "/review.html"]

# collect all HTML files and their internal links
html_files = glob.glob(os.path.join(site_dir, "**/*.html"), recursive=True)

for html_file in html_files:
    with open(html_file) as f:
        content = f.read()

    rel_path = html_file.replace(site_dir, "")

    # skip feed.xml and other non-page files
    if "/assets/" in rel_path:
        continue

    # check theme rendering: pages should have doctype and masthead
    if "<!doctype html>" not in content.lower() and "<!DOCTYPE" not in content:
        errors.append(f"  ✗ {rel_path}: missing theme (no doctype)")
        continue

    # structural consistency checks (themed pages only)
    if rel_path not in standalone:
        if "capitalize-toggle" not in content:
            errors.append(f"  ✗ {rel_path}: missing capitalize toggle")
        if "masthead" not in content:
            errors.append(f"  ✗ {rel_path}: missing masthead navigation")
        title_match = re.search(r"<title>(.*?)</title>", content)
        if not title_match or not title_match.group(1).strip():
            errors.append(f"  ✗ {rel_path}: empty or missing <title> tag")

    # check internal links
    internal_links = re.findall(r'href="(/[^"#]*)"', content)
    for link in internal_links:
        # normalize: /foo/ -> _site/foo/index.html
        link_path = link.rstrip("/")
        candidates = [
            os.path.join(site_dir, link_path.lstrip("/"), "index.html"),
            os.path.join(site_dir, link_path.lstrip("/")),
        ]
        if not any(os.path.exists(c) for c in candidates):
            errors.append(f"  ✗ {rel_path}: broken link {link}")

if errors:
    print("\n━━━ site health check ━━━")
    for e in errors:
        print(e)
    print()
    sys.exit(1)
else:
    page_count = len([f for f in html_files if "/assets/" not in f])
    print(f"✓ site health: {page_count} pages built, all links valid, all themes applied")
PYEOF

if [ $? -ne 0 ]; then
  exit 1
fi
