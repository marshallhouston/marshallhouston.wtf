---
title: "the ship system (2/3)"
date: 2026-04-19
tags: [workflow, ai-augmented-engineering, ci]
updated_at: 2026-04-19 06:05 MDT
permalink: /the-ship-system/
series: preach-hub-learnings
---

*part 2 of 3. previous: [proving grounds](/proving-grounds/). this post zooms into one subsystem from that incubator.*


## the question

the question i kept coming back to while working on [preach-hub](https://github.com/marshallhouston/preach-hub): how do i ship with confidence, fast?

## decompose the question

"with confidence" and "fast" pull opposite directions by default.

confidence requires knowing what kind of change i'm shipping. a README tweak is not a schema migration. treating them the same means either over-caution on trivial things, or under-caution on load-bearing ones. that's a judgment problem.

fast requires not involving myself in the parts i don't need to. every manual refresh of the PR page, every "want me to investigate this failed check?" prompt, every context switch back to babysit a merge, is time spent on execution instead of the next thing. that's a motion problem.

most tooling fuses them. one command does both. that fusion is the bottleneck, not the speed of CI.

## the split

if judgment and execution are different jobs, run them as different commands.

```
/risk-score        ->  labels PR (green|blue|yellow|red)
                              |
                              v
/ship              ->  reads label, decides gate,
                       watches checks, merges, cleans up
```

`/risk-score` looks at the diff and commits to a label. `/ship` reads that label and acts on it. `/ship` does not re-judge. if it re-judged, the jobs would be fused again.

## the gates

the label drives how much friction `/ship` applies. here's the tier block from `ship.md` verbatim:

```
- risk:green - proceed silently.
- risk:blue - proceed, note tier in final report.
- risk:yellow - proceed, but call out "yellow tier" in final report so the user sees it wasn't green.
- risk:red - STOP. Print the red reason (pull from latest classifier comment) and require explicit ack. Tell user: "Re-invoke with /ship [pr] --ack-red to proceed."
- risk:needs-scoring or no risk label - STOP. Tell user: "PR has no resolved risk tier. Run /risk-score [pr] first, then re-run /ship."
```

the piece the quote doesn't capture:

- yellow is loud in the final report. i shipped it, but i know i shipped yellow.
- unscored is a hard stop. refusing to guess is the point. the pipeline is theater if `/ship` merges unscored PRs.

the gate's job is to calibrate friction to blast radius, not to prevent merges.

## the failure path

old default, from me and from most agents: check fails, agent pastes the URL, says "want me to look?" and waits. every failure becomes a hop back to the human.

the principle from the bottom of `ship.md`:

> A failing check is a signal, not a dead-end. if it failed, look.

the mechanic: pull the failing job's log with `gh run view --job [job-id] --log-failed`. name the root cause in one sentence. classify: code issue, infra, flake, upstream. check whether the failure is actually blocking the merge, or a cosmetic non-required check. if flake, re-run once. if real, report root cause with file and line, stop.

a real one from last week. PR on the `kelsey-regression-guards` branch. CI check `test-value-gate` failed. `/ship` pulled the log:

```
TEST VALUE GATE: 1 new test(s) missing justification comment.

Every new it()/test() call needs a // Bug: / // Contract: / // Refactor:
comment within the 3 non-blank lines above it.

Violations:
  e2e/verse-panel.spec.ts:12  verse deeper panel returns 200 with sermons shape for a seeded verse

See: docs/TESTING.md -> Justification Comment Format
```

root cause: new test case missing the required justification comment. code issue on this PR. file and line named. fix is obvious. stop.

the split is only real if execution handles its own failures. otherwise i'm back to babysitting.

## the honest tension

the split, the gates, the auto-investigation all rest on one assumption: the classifier is honest.

if `/risk-score` mis-labels a schema migration as green, `/ship` cheerfully merges it silently.

the classifier is the one spot where a bad call propagates silently. everything else in the pipeline has a check. green does not.

so there's a third command: `/classifier-audit`. score the scorer. pull recent merges, cross-reference reverts and hotfixes, find greens that rolled back and reds that merged clean. principle at the bottom of `classifier-audit.md`:

> The classifier is only useful if its decisions track reality. Without this feedback loop, tier labels are theater.

i run it monthly. before tuning, always.

## the loop

this is [build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}) pointed at the act of shipping itself.

build the workflow. notice friction (babysitting PRs). fix it (split plus gates plus auto-investigate). notice the next friction (is the classifier honest?). fix that too (classifier-audit). the loop does not stop at the first fix.

this isn't the answer. it's where i am.

***

*part 2 of 3.*

*previous: [proving grounds](/proving-grounds/). the frame this subsystem lives in.*

*next: [no perfect prompt](/no-perfect-prompt/). what actually feeds commands like /ship.*
