---
name: no-layout-frontmatter
enabled: true
event: file
tool_matcher: Edit|Write|MultiEdit
conditions:
  - field: file_path
    operator: regex_match
    pattern: _posts/.*\.md$|_drafts/.*\.md$
  - field: content
    operator: regex_match
    pattern: ^layout:
action: block
---

**Don't set `layout:` in post/draft frontmatter.**

The theme default (`layout: single`) is configured in `_config.yml` and applies automatically. Setting `layout: post` or any other value overrides it and breaks the page styling (no sidebar, no navigation, no comments).

Remove the `layout:` line from the frontmatter, then retry.
