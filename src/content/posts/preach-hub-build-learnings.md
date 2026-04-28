---
title: "proving grounds (1/3)"
date: 2026-04-19
slug: proving-grounds
draft: true
updated_at: 2026-04-19 15:18 MDT
---

i've never been someone who builds outside day-to-day work. over the last three weeks, that's changed, and it's been incredibly fun to have a personal proving ground for what agentic engineering actually looks like.

not vibe coding. not "ai wrote a function." the whole system, wired end to end, with me as the architect and the agents doing most of the typing.

## the qa loop

every page has a feedback button.

click it. panel slides in. pick bug, idea, or note. type one line. the system grabs a screenshot, the current route, the viewport, the user agent, the session id, my user. one submit.

a github issue opens with all of it pre-populated. screenshot attached. labels applied. metadata in a collapsible block. then a triage agent reads the issue, pattern-matches it against the repo and the roadmap, and files it into **now**, **next**, or **later**.

i never leave the app to log a bug. i never paraphrase what i saw. the report is structured the way a triage agent can act on it, because a triage agent is the first reader.

## ptv on tests and maintainability

every test has to name the bug, behavior, or refactor it protects. if it can't, it does not get written. the test suite is small on purpose and every file earns its line count.

every abstraction gets the same question. one caller? kill it. speculative flexibility with no current consumer? kill it. the codebase stays legible because agents are enforcing ptv alongside me.

this one is easy to miss. agentic engineering makes it trivial to produce code. the discipline that matters now is deleting code. the agents are better at writing than at knowing what not to write. that's my job.

## the gap

now the uncomfortable part.

none of this lifts cleanly into my actual job. solo app, no legacy, no compliance surface, no shared infra, no other humans coordinating against each other. the incubator has zero constraint cost. real work does not.

the qa panel code doesn't transfer. the triage agent doesn't transfer. the fifteen-minute lovable prototype doesn't transfer to a system with real users and real risk.

the habits carry. structured intake beats paraphrase. friction teaches if you let it. agents will hold a line of discipline that humans drift off of. those travel into any codebase, any team size, any compliance regime.

the shape of the gap carries too. seeing what's possible with zero friction shows me which friction at work is essential and which is incidental. compliance review before a deploy is essential. a human paraphrasing a bug into a ticket and losing half the context is not. the incubator lets me tell them apart.

i don't walk into work monday with a qa panel and a triage agent. i walk in with a clearer sense of what good looks like now, and a willingness to let the next piece of friction teach me where to apply it. bff at the system level, not just the commit level.

## the through-line

the app isn't the point. the way of working is. once you've watched friction drop to zero in one place, you start asking, everywhere else, which friction is the job and which is just habit.

***

*part 1 of 3.*

*next: [the ship system](/the-ship-system/). one subsystem from above, deep-dive.*

*then: [no perfect prompt](/no-perfect-prompt/). raw inputs from the same 72 hours.*
