---
title: footer rework
updated_at: 2026-04-08 03:31 MDT
---

the default minimal-mistakes footer ("© 2026 marshall houston. Powered by Jekyll & Minimal Mistakes.") isn't doing it for me.

- the "powered by" line is free advertising for the theme, not me
- the copyright line is mechanical
- the icon row above it (github / linkedin / feed) duplicates the sidebar

options:
- override `_data/ui-text.yml` key `powered_by` to blank or custom text
- or: copy `_includes/footer.html` from the theme into the repo and rewrite it end-to-end — full control, more code to own
- think about what the footer is actually for. terminal line? tagline? colophon?

not urgent. capture when drafting.
