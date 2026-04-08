---
title: bug — tags page chips don't capitalize
updated_at: 2026-04-08 03:33 MDT
---

noticed 2026-04-08 while smoke-testing the railway deploy.

on `/tags/`, when the capitalize toggle is in capitalize mode:
- ✅ group headings like "Workflow" render capitalized
- ✅ post titles in the list render capitalized
- ❌ the tag list *at the top* (workflow, experimentation, ruminating, ai-culture, etc.) stays lowercase

likely cause: the capitalize JS text-walker is skipping whatever wrapper the minimal-mistakes `tag_archive` template uses for the tag chips. probably a selector miss — the chips may be inside a `<strong>`, `<a>`, or nested element the walker doesn't descend into. or the text node is inside an attribute instead of the DOM text.

fix: inspect one of the chips in devtools, find the element/attribute the text lives in, extend the walker or add a targeted transform.

related: see `capitalized-version-toggle.md` for the broader toggle design.
