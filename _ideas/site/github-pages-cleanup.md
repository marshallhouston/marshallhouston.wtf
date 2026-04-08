---
title: github pages cleanup
status: done
updated_at: 2026-04-08 03:57 MDT
completed_at: 2026-04-08
---

> **done 2026-04-08** - GH Pages disabled via API, `CNAME` removed in `a1726c6`. only railway builds from here.

loose ends from the 2026-04-08 github pages → railway migration. both quick, both safe, both deferred to keep the migration session focused.

## 1. delete the `CNAME` file

`CNAME` at repo root contains `marshallhouston.wtf`. it was the github pages marker that told GH Pages "this repo serves on this custom domain." railway doesn't read it, and the cutover is complete. file is inert.

- `git rm CNAME && git commit -m "remove github pages CNAME marker"`
- no visible site change

## 2. disable github pages in repo settings

github pages is still technically enabled on `marshallhouston/marshallhouston.wtf`. every push to main rebuilds a Pages deployment that no traffic ever reaches. harmless, but:

- burns CI minutes for nothing
- noise in the repo's deployments tab
- stale "deployed" status on commits that might confuse future-me

to disable: github.com → repo → Settings → Pages → Source → "None" (or "Deploy from a branch" → pick a non-existent branch, or unset source entirely depending on current github UI).

sanity check after: push a small change and confirm only railway shows activity.

## order

doesn't matter. do them together when next touching the repo. probably 2 min total.

## related

see also `marshallhouston/marshallhouston.github.io-stub` redirect repo (tracked elsewhere) — that one should KEEP its GH Pages enabled, since it's the whole point of that repo. don't disable GH Pages indiscriminately.
