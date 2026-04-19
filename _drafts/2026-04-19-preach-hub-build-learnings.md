---
layout: post
title: "proving grounds"
date: 2026-04-19
updated_at: 2026-04-19 01:54 MDT
---

i'm building a small app on the side. no real users yet. no revenue. that's the point.

it's a proving ground. an incubator for what agentic engineering actually looks like when you let it off the leash. not vibe coding. not "ai wrote a function." the whole system, wired end to end, with me as the architect and the agents doing most of the typing.

when i've shown engineers, leaders, and builders i respect what's running in here, the response is the same: "didn't know that was possible."

here's what's in it.

## the qa loop

every page has a feedback button.

click it. panel slides in. pick bug, idea, or note. type one line. the system grabs a screenshot, the current route, the viewport, the user agent, the session id, my user. one submit.

a github issue opens with all of it pre-populated. screenshot attached. labels applied. metadata in a collapsible block. then a triage agent reads the issue, pattern-matches it against the repo and the roadmap, and files it into **now**, **next**, or **later**.

i never leave the app to log a bug. i never paraphrase what i saw. the report is structured the way a triage agent can act on it, because a triage agent is the first reader.

## the rapid prototype loop

someone emails me an idea.

i read it, write back one prompt that captures the shape, paste it into lovable. fifteen minutes later there's a working prototype. i send it back. they click. they react.

the cycle from idea to clickable artifact collapsed from weeks to an afternoon. the feedback is against a real thing they can use, not a mock, not a wireframe, not a paragraph. the artifact is what unlocks the next round of thinking.

the reason i can is the scaffolding, the stack, the conventions, and the agents are all already wired. the fifteen minutes is what the rest of the system enables.

## the invite system

auto-personalization is loud and obvious. template variables stitched into a boilerplate email. everyone can smell it.

so i went the other way.

custom invites are written by me, per person. the system handles the delivery, the bible reference parsing, the preview, the tracking. what it does not do is generate the words. those are mine. the artifact is systematic. the authenticity is not.

ai-augmented does not mean ai-generated. the leverage is in the mechanics around the message, not the message.

## ptv on tests and maintainability

every test has to name the bug, behavior, or refactor it protects. if it can't, it does not get written. the test suite is small on purpose and every file earns its line count.

every abstraction gets the same question. one caller? kill it. speculative flexibility with no current consumer? kill it. the codebase stays legible because agents are enforcing ptv alongside me.

this one is easy to miss. agentic engineering makes it trivial to produce code. the discipline that matters now is deleting code. the agents are better at writing than at knowing what not to write. that's my job.

## the ship system

there's also a `/ship` command that runs the whole pipeline. pr classifier, llm rubric, deploy, marker, health check. [own post coming][ship-post].

[ship-post]: #

## the gap

now the uncomfortable part.

none of this lifts cleanly into my actual job. solo app, no legacy, no compliance surface, no shared infra, no other humans coordinating against each other. the incubator has zero constraint cost. real work does not.

the `/ship` command doesn't transfer. the qa panel code doesn't transfer. the fifteen-minute lovable prototype doesn't transfer to a system with real users and real risk.

so what does?

**mindsets, not artifacts.** structured intake beats paraphrase. artifacts beat specs. friction is the teacher. ptv on every abstraction. fix the system, not the symptom. agents enforce discipline humans won't. these carry. they carry into any codebase, any team size, any compliance regime.

**the shape of the gap itself.** seeing what's possible with zero friction shows me which friction at work is essential and which is incidental. compliance review before a deploy is essential. a human paraphrasing a bug into a ticket and losing half the context is not. the incubator lets me tell them apart.

**build friction fix, not lift and shift.** i don't walk into work monday with a `/ship` command and a qa panel. i walk in with a clearer sense of what good looks like now and a willingness to let the next piece of friction teach me where to apply it. bff at the system level, not just the commit level.

the transferable layer is how i think, not what i built.

## the through-line

a small app with no users is the wrong thing to build if the app is the point. it is the right thing to build if what you are proving is a way of working.

proving grounds are not a template to copy. they are a lens to see with. once you've seen what's possible when the friction drops out, you can't unsee it. you start asking, at work, in every meeting, which parts of our friction are the job and which parts are just habit.

the incubator is the lens. bff is how i apply it. the app is almost incidental.

that's the whole post.
