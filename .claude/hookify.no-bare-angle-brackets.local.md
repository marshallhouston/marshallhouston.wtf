---
name: no-bare-angle-brackets
enabled: true
event: file
tool_matcher: Edit|Write|MultiEdit
conditions:
  - field: file_path
    operator: regex_match
    pattern: _posts/.*\.md$|_drafts/.*\.md$|_pages/.*\.md$
  - field: content
    operator: regex_match
    pattern: (?<!`)<[a-z_][a-z0-9_]*>(?!`)
action: block
---

**Bare angle brackets detected. These will be swallowed by HTML rendering.**

Wrap `<word>` in backticks so it renders as visible text: `` `<word>` ``

Or use HTML entities: `&lt;word&gt;`

Bare `<angle_brackets>` in markdown content get parsed as HTML tags and disappear from the rendered page.
