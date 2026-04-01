---
title: add comments with giscus
captured: 2026-04-01
updated_at: 2026-04-01 02:22 MDT
---

jekyll has no built-in comment support. giscus is the best option for this site.

## why giscus

- uses github discussions as the backend. comments live in your repo, you own the data.
- requires github auth to comment. not anonymous, every commenter has a real profile.
- zero maintenance. no server to run. it's a script tag in the post layout.
- free, no ads, no tracking. open source.
- threaded replies, reactions, lazy loading. mature feature set.
- actively maintained (11.5k stars, regular commits as of early 2026).

## setup

1. enable discussions on the repo
2. install the giscus github app
3. generate config at giscus.app (map pages by pathname)
4. add the script tag to the post layout

should take ~10 minutes.

## why not the alternatives

- **utterances** - same concept but uses issues (clutters tracker), abandoned since 2023. giscus is the successor.
- **disqus** - forced ads on free tier, gdpr fines, heavy tracking, you don't own data. antithetical to a minimal static site.
- **staticman** - abandoned (no commits since 2020), complex setup, no auth.
- **remark42** - excellent but requires self-hosting. overkill for github pages.

## connection, not just comments

this ties into the "bid for connection" energy in posts. end posts with a question, comment box is right there. people can reply on the blog or in the github discussion directly (same thread). reactions (thumbs up, heart, etc.) lower the bar for engagement without requiring a full comment.

github auth is a feature, not a bug. filters for people in the dev/builder space. their profile gives context on who they are.

## open questions

- do comments go on every post or just new ones going forward?
- any custom styling to match the site's minimal feel?
- related to the make-following-easy idea. comments + rss + subscribe = a lightweight engagement layer without platform dependency.
