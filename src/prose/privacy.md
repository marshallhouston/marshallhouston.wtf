---
title: privacy
description: what this site collects (almost nothing) and which third parties see you.
---

short version: this site is static html on a box. i don't run analytics, i don't set cookies, and i don't have a database with your name in it.

## what i collect

nothing, directly. there is no analytics script, no tag manager, no pixel, no session recorder, no a/b framework, no advertising network. no account to make, so no account to leak. the pages are prebuilt files served by caddy. loading one leaves an entry in a standard web server log (ip, timestamp, path, user agent) that exists so the server can be debugged and is not joined to anything else, not sold, and not shared.

## what your browser stores

a couple of `sessionStorage` keys, and only if you touch the thing they belong to: whether you flipped the capitalization toggle in the header, and which lens you picked in the interactive widget on the builders-vs-naysayers page. they live for the tab and die with it, never leave your browser, and i never see them. no cookies at all.

## third parties

- **comments.** post pages embed [giscus](https://giscus.app), which is github discussions in an iframe. it loads from `giscus.app` and, if you comment, you're signing in to github and github's privacy policy applies. don't want it? don't comment; the iframe still loads the thread, so block `giscus.app` if you'd rather it didn't.
- **search.** the search page runs [pagefind](https://pagefind.app), which is a static index shipped with the site. queries run in your browser. nothing is sent anywhere.
- **hosting.** the site runs on railway, which sees the request the way any host does.

that's the whole list. no fonts loaded from google, no cdn scripts, no embedded video, no trackers riding along inside them.

## rss and markdown

the feed at [/feed.xml](/feed.xml) and the markdown sources (append `.md` to any post url, or send `Accept: text/markdown`) are plain files. reading the site that way touches nothing but the web server log.

## changes

if this ever changes, the change lands in git before it lands in production, and this page changes with it. the repo is [public](https://github.com/marshallhouston/marshallhouston.wtf) if you want to check rather than take my word for it.
