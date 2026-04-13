---
title: tools repo tour
captured: 2026-04-12
status: kernel
updated_at: 2026-04-12 23:30 MDT
---

## the kernel

sharing the tools repo. "random personal things to get swings. digital library, digital cosmic farmland, one stop golf starting point. all about the reps." not a product launch. just: here's what i'm building with, here's what i find interesting. putting it back out into the world. if it plants a seed for someone else, cool.

---

## fleshed out design (2026-04-12)

### register / energy

measured, explanatory, showing-the-workflow. like MEB but grounded in the actual setup rather than a mental model. casual, not selling. "hey, i found this interesting. i want to share."

### audience

mix of: claude code power users building their own skills/plugins, developers curious about AI-assisted workflows generally, people who've hit the context window ceiling and are looking for patterns.

### post arc

#### 1. the open
the energy from the conversation with a friend. random personal things to get swings. all about the reps. these aren't polished products, they're batting practice. repo link drops here: https://github.com/marshallhouston/tools

no preamble. no throat-clearing. no "let me tell you about my journey with AI tools."

#### 2. `/handoff` — the context window beat
what it is: you're building something, context fills up (~60%), you hit `/handoff`, get a self-contained resumption prompt, `/clear`, paste, keep going in a fresh session.

show the actual prompt it generates. the interesting part isn't the skill mechanics, it's how natural the beat becomes. not dramatic. just a breath in the workflow.

the five parts of a handoff prompt: goal, frozen decisions, key constraints, current state, next step. the fresh session never re-discovers what the last one already decided.

#### 3. `/feedback` + `/interactive-review-doc` — the review loop
two entry points, same format. `/feedback <file>` runs a ruby script that generates a three-panel HTML review page. `/interactive-review-doc` is the skill that builds the same format on the fly.

the flow: file goes in, three-panel HTML comes out (nav sidebar, content, feedback panel). fill in reactions section by section. hit "copy all feedback." paste back into claude. changes applied.

show a screenshot of the review page. the gesture is: react to the thing in the thing, not in a separate conversation thread. section-by-section beats global hand-waving.

works on drafts, synthesized docs, app ideas, brainstorm dumps. anything with sections.

#### 4. the QA system (preach-hub)
different project, same energy. building an app from a friend's email idea. added a QA/test mode: tag users via allowlist, they see a feedback box on any page, pick a category (bug / thought / consideration), submit, and it auto-posts a github issue with all the metadata (route, viewport, user, timestamp).

the interesting bit: every piece of feedback is geotagged to where it was submitted. triage happens in github, not in slack threads or text messages.

still early. getting feedback. trying something.

#### 5. close
short. seeds, not products. still early. try something. change it. the repo is there if any of it is useful.

### additional notes

- no linkedin hook. no "let me tell you about a skill that changed everything."
- show the thing (screenshots, code blocks, actual commands) rather than describing it.
- the tools repo link does the heavy lifting. the post is the guided tour.
- this is a sharing post, not a problem/solution post.
- the friend quote ("all about the reps") is the spine.
