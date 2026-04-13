---
title: first time registering a domain
date: 2026-04-12
updated_at: 2026-04-12 04:36 MDT
---

i've been a software engineer for over a decade. i've deployed services, configured infrastructure, debugged production incidents at 2am. i have never registered a domain.

github pages gave me `marshallhouston.github.io` for free. it worked. i didn't need anything else. then the site started becoming something i actually cared about, and i wanted it to feel like mine. not github's subdomain. mine.

so i bought one. `marshallhouston.wtf`.

## the part i thought would be hard

dns. always felt like black magic from the outside. A records, CNAME records, propagation, nameservers. words i'd seen in docs and immediately scrolled past.

i set it up with claude's help. not "claude did it for me" — i asked questions, understood the answers, made the changes myself. the whole dns configuration took maybe ten minutes. i kept waiting for the hard part. it never came.

propagation? i refreshed the browser a couple times. there it was.

## the migration

the site had been on github pages since day one. moving it to railway meant writing a dockerfile, a caddyfile, pointing the domain, and running a smoke test. one session. the kind of thing that sounds like a project but is actually just... a few files.

the fiddliest part was the cleanup after. setting up a redirect stub at the old `marshallhouston.github.io` url so existing links don't break. disabling the github pages build that was now deploying to nowhere. removing the `CNAME` file that github pages used to need. small loose ends, each one a two-minute fix.

## .wtf

i picked `.wtf` because it's on brand. lowerchaos energy. when i found out it was a real tld i didn't deliberate.

there's a whole thread here about picking domains that match the vibe of the thing — i also grabbed `cosmicfarmland.com` and `cosmicfarmland.wtf` — but that's a different post.

## what i actually learned

the gap between "i build software professionally" and "i've never registered a domain" is more common than i expected. we work on massive distributed systems and have never bought a url. it's like being a chef who's never been to a farmers market. the food is fine. but there's a layer you're missing.

dns is less scary than its reputation. the concepts are simple. point a name at an address. wait a minute. done. the jargon makes it feel harder than it is.

and doing this with ai help was exactly the right learning mode. not outsourcing the work. accelerating the understanding. i asked "what's an A record actually doing?" and got an answer i could act on immediately. that's the part that's changed — the time between "i don't know this" and "now i do" has collapsed.

first domain. first migration. one evening. felt good.
