---
title: "no perfect prompt (3/3)"
date: 2026-04-19
slug: no-perfect-prompt
draft: true
updated_at: 2026-04-19 06:15 MDT
---

pulled every prompt i sent claude code while building preach-hub over the last 72 hours. 377 of them. 54 sessions.

the [proving ground](/proving-grounds/) and the [ship system](/the-ship-system/) were the output. these are the inputs.

in those 72 hours: 38 PRs merged. sermon catalog (37 sermons, 22 reading plan passages), invite email flow, feedback from three testers triaged and shipped, soft-launch infra for friday's friends-and-family.

one caveat: these are prompts i sent. not ones i typed and retyped. not ones where the model got it wrong and i course-corrected three turns later. send-side only.

people write threads about prompt engineering. here's what mine actually look like.

## the one-letter replies

```
b
y
a
C
1
2
yes
fix
push
all
skip
keep
do it
ok do it
yes kill
create PR
looks good
ship it fully
```

17 were one word. 15 were four characters or less. half the "work" is picking from a menu the model already laid out.

not cold starts. replies inside a running session where the model just proposed something.

## the question i ask most

```
what's next?
what's next here?
what's next for the launch?
what's next? is this on main now?
what's now?
so what's next?
ok, what's next in this kels feedback flow?
```

"what's next" or a variant. not directing. asking.

## the typos i didn't fix

```
yes cleanup anythign
do 1+2 first
we dont' need to exist to do 1
so on worktree but able to have latest main in worktree and move forward on next remaining bugs
the feedback triage needs to follow the feedback structure html doc i like
```

none of these got re-written. they all worked.

## the long ones

92 prompts over 1000 characters. about half are slash commands expanding into skill files. the other half are me pasting something i already had: a plan doc, review notes, a kernel dump from obsidian.

like this one, paraphrased:

```
# Kelsey Feedback -- Marshall's Notes

## 0. Overview
google sign in should work here.
...
## 5. "Come and See" rename
trud wanted come and see. we gotta figure out what this actually shows.
i like sermons. let's go with that and tell trud why.
```

i wasn't prompting. i was forwarding. pasting a doc i wrote three weeks ago and saying "implement this."

## the meta work

not all 38 PRs are features. the mix is the point: features, dev-loop, observability, reliability, feedback-driven fixes. five flavors, one 72-hour window.

two patterns inside the mix:

**the feedback loop is the observability loop.** posthog tells me what kelsey did. kelsey tells me what didn't work. fix lands. session replay confirms. 16 PRs, same motion.

**dev-loop tooling compounds.** 11 PRs on the dev loop itself. 72 hours of loose prompts didn't just produce features. they produced the apparatus for the next 72.

the breakdown:

- 11 dev-loop tooling: CI speedup, the [ship system](/the-ship-system/) (classifier + /ship + audit), test value gate, classifier migrated to claude code action.
- 10 feedback acted on: bug passes, kelsey tier 0/1/2, tyler+leah nav/scroll/search.
- 8 product features: home page real signals, invite email flow, sermon catalog (schema + 37 seeded), bookmark notes.
- 6 product observability: posthog event splits, session replay with PII masking, feature flag infra, cohort tagging for soft launch.
- 3 system reliability: signup 500 postmortem, tier 0 regression guards, verification email defensive catch.

## the distribution

- 1-10 chars: 36
- 11-50: 134
- 51-200: 94
- 201-1000: 21
- 1000+: 92

bimodal. micro-decisions on one end, paste-dumps on the other. nothing in the middle.

no perfect prompt. just a lot of imperfect ones, one after the other, fast.

***

*part 3 of 3.*

*back to [proving grounds](/proving-grounds/). the frame.*

*or [the ship system](/the-ship-system/). one subsystem these prompts were building.*
