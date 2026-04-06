---
name: date-only-frontmatter
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: _posts/.*\.md$|_drafts/.*\.md$
  - field: new_text
    operator: regex_match
    pattern: "date: \\d{4}-\\d{2}-\\d{2}[^\\s]|date: \\d{4}-\\d{2}-\\d{2} ."
action: block
---

**Date-only format required in post front matter.**

Use `date: YYYY-MM-DD` without time or timezone components.

Bad: `date: 2026-03-29 06:00:00 -0600`
Good: `date: 2026-03-29`
