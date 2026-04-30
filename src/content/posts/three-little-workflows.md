---
title: three little workflows
date: 2026-04-13
updated_at: 2026-04-13 06:22 MDT
tags: [claude-code, workflow]
slug: three-little-workflows
---

a friend asked what i've been building recently, and it's mostly a collection of random things to get swings and reps and build the habit of building. an app for a friend to build community, digital reading library, digital cosmic farmland, one stop golf starting point. writing repo. little tools.

as workflows emerge, i'm throwing them into [github.com/marshallhouston/cosmic-farmland](https://github.com/marshallhouston/cosmic-farmland).

let's take a look at three pieces.

if any of this plants a seed for others, great; please take the ideas and run with them. warning: know that this isn't ready for primetime and should not be relied on for stability. i will change and break these unexpectedly.

## `/handoff`

[`/handoff`](https://github.com/marshallhouston/cosmic-farmland/tree/main/plugins/cosmic-farmland/skills/handoff) generates a self-contained resumption prompt. five parts: goal, frozen decisions, key constraints, current state, next step. it gets copied to clipboard. `/clear`, paste, keep going.

the fresh session picks up where things left off. here's where we are, here's what's next, go.

why? i kept finding myself in a "ok, context window is filling up, give me a prompt to pick up in a new session" loop. this makes it easier.

## `/feedback` & `/interactive-review-doc`

two entry points, same idea. could it be a single one? probably. [`/interactive-review-doc`](https://github.com/marshallhouston/cosmic-farmland/tree/main/plugins/cosmic-farmland/skills/interactive-review-doc) came out of claude desktop, and [`/feedback`](https://github.com/marshallhouston/cosmic-farmland/tree/main/plugins/cosmic-farmland/skills/feedback) came from claude code in the terminal. take any file with sections and turn it into a three-panel HTML review page: navigation sidebar on the left, content in the center, feedback panel on the right.

`/feedback` runs a script that generates the HTML and opens it. `/interactive-review-doc` builds the same format on the fly from whatever content claude just produced. both output the same thing: a page where i can add feedback in the way i learn directly.

fill in section-by-section feedback. hit "copy all feedback." paste back into claude. changes applied.

works on drafts, synthesized docs, app ideas, brainstorm dumps. everything is a candidate for this flow.

## direct user feedback in qa / test mode

a good friend from back home reached out with an idea for an app he wanted to explore. the email had eight bullet points, so i took the prompt, added some notes, and then generated a lovable prompt to build a prototype within 15 minutes.

as i've been building out the mvp ([justpreach.app](https://justpreach.app)), i wanted to get feedback directly from admin and early users. getting random texts of feedback is nice, but i wanted something more streamlined.

added a qa/test mode directly into the project. tag specific users to have access to the functionality. they'll now see a feedback box on any page with categories: bug, thought, or consideration. once the feedback is submitted, the app auto-posts a github issue with all the metadata: route, viewport dimensions, user, timestamp.

every piece of feedback includes a variety of metadata to enable easier triaging.

very early days here, and i think this has promise as a feedback loop broadly. it meets users where they're at and removes friction on getting direct feedback. will pair this with product analytics and system observability for a richer understanding of what's actually happening, where the friction lies, and how to keep improving the product.

## speed seeds, not polish

i'm leaning into fast iterations and shipping before things are ready. i'm having so, so much fun :)
