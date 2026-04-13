---
title: first time registering a domain
captured: 2026-04-09
kernel: mullet-domains
updated_at: 2026-04-09 02:28 MDT
---

short, informative post. "trying something new to learn" energy. not a tutorial, not a flex. just the experience.

## what happened

i've had marshallhouston.github.io for a while. github pages, free, fine. but the site was turning into something i cared about. cosmic farmland was becoming a thing. so i registered my first domain. marshallhouston.wtf.

never done this before. never needed to. github pages just works. but i wanted to understand the thing underneath.

## the arc

1. **registering the domain.** first time at a registrar. picking a tld. .wtf exists and that's on brand.
2. **DNS setup.** the part that always felt like black magic from the outside. A records, CNAME, propagation. did it with claude's help, and it was... surprisingly fast? like, anticlimactically fast.
3. **migrating the site.** github pages → railway. dockerfile, caddyfile, custom domain config. the actual hosting move.
4. **the cleanup.** redirect stub for the old github.io url. disabling pages. removing the CNAME file. loose ends.

## tone

light. informative. "hey, i'd never done this and now i have." not a tutorial (don't prescribe tools). not bragging. just: this was opaque to me, and then it wasn't.

the vibe is "i've been a software engineer for years and never registered a domain. that's fine. now i have."

## threads to pull

- the gap between "i build software" and "i've never bought a domain." how many of us are like this?
- dns being less scary than expected. demystifying without tutorializing.
- doing it with ai help as a learning accelerant, not a crutch. asked questions, understood the answers, did the thing.
- the whole migration happened in one session. dockerfile, caddyfile, dns, smoke test, done.
- .wtf as a tld choice. lowerchaos energy. the mullet kernel connects here (cosmicfarmland.com for normal, cosmicfarmland.wtf for weird) but that's a sidebar, not the point.

## what this post is NOT

- not a step-by-step guide
- not "you should use railway" or "you should use X registrar"
- not a deep dive on dns
- not about the mullet domain concept (that's a different post if it sprouts)

## length

short. maybe 400-600 words published. this doesn't need to be an essay. closer to lowerchaos than experimentation-budget in weight.
