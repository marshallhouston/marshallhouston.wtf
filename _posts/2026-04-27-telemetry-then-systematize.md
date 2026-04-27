---
title: telemetry then systematize
date: 2026-04-27
updated_at: 2026-04-27 10:58 MDT
tags: [workflow, experimentation, ai-augmented-engineering, claude-code, cosmic-farmland]
---

added a variety of skills in [cosmic-farmland](https://github.com/marshallhouston/cosmic-farmland) based on usage. theme is roughly: add telemetry for everything, find the patterns (friction, use cases), and then systematize it aggressively.

## telemetry + friction mining

four scripts in `bin/` that point claude code at itself.

[`cc-session-export`](https://github.com/marshallhouston/cosmic-farmland/blob/main/bin/cc-session-export) walks `~/.claude/projects/*/*.jsonl` and dumps per-message token usage to csv. auto-scopes to the current repo.

[`cc-friction-peek`](https://github.com/marshallhouston/cosmic-farmland/blob/main/bin/cc-friction-peek) inspects a single session: user messages, tool sequences, top output-token messages. useful to see "what was actually happening in this session."

[`cc-friction-scan`](https://github.com/marshallhouston/cosmic-farmland/blob/main/bin/cc-friction-scan) runs heuristic regexes across an N-day window. taxonomy v0: re-asking, short-yes, copy-clarity, rule-drift, stall, status-begging, interrupt. a 2-day baseline on [justpreach.app](https://justpreach.app/) turned up 84 re-asking and 76 short-yes across 19 sessions. that's a lot of "want me to do x?" followed by me typing "yes."

[`cc-pattern-mine`](https://github.com/marshallhouston/cosmic-farmland/blob/main/bin/cc-pattern-mine) n-grams tool calls and slash command sequences, ranked by frequency times distinct-session count so one chatty session doesn't dominate. it surfaced `/ship` → `/ship` (49 hits, 27 sessions) and `/ship` → `/handoff` (13 hits, 13 sessions), among others.

scanner finds weakness. miner finds strength. both feed [`/systematize`](https://github.com/marshallhouston/cosmic-farmland/tree/main/plugins/cosmic-farmland/skills/systematize).

## things shipped from that data

the friction and usage patterns get systematized.

[`no-reasking`](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/hooks/no-reasking.py) is a Stop hook. checks the last assistant text for "want me to / should i / would you like." allowlists destructive op confirmations (delete, drop table, force push). warns to stderr and appends to `~/.claude/cc-friction-log.jsonl`. non-blocking on purpose. measure first, tighten later.

[`/wrap`](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/wrap.md) ships the current PR then writes a handoff prompt. replaces the `/ship → /handoff` chain.

[`/ship-all`](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/ship-all.md) lists my open PRs, single confirmation, drains the queue via `/ship` per PR. auto-cd into the matching worktree. replaces `/ship → /ship`.

closed loop. instrument, see, ship. relies on the entire ship system being trustworthy.

## /ship hardening

[`/ship`](https://github.com/marshallhouston/cosmic-farmland/blob/main/plugins/cosmic-farmland/commands/ship.md) had a larger rewrite. `gh pr checks --watch` was blocking on every check reaching a terminal state, so one slow gate (preview deploy, classifier waiting on an llm) hung the whole skill for ten or fifteen minutes with zero output. a lot of, "is this still working?" questions.

now i can see what's happening, it bails fast on failures, and falls through cleanly when github's auto-merge ghosts me.

getting closer to just using [gastown](https://github.com/gastownhall/gastown), but i'm not quite there yet. `:sweating-excitedly:`

## token optimizing

i hit the 5hr token window a few times. whoops. actual friction here, so now it's time to focus on addressing the bloat and inefficiencies. i'm glad i waited because now i had weeks of actual data and usage to extract patterns from.

skill descriptions load every turn. compressed eight of them by 50-80%. saves around 5-7k characters per session.

slimmed down skill files and claude.md across the board. cut almost all memories. cut all mcps unless absolutely necessary. basically ran ptv on every part of the system: if it's loading every turn and not earning its keep, it goes.

promoted a memory entry (auto-open review docs) directly into the [`interactive-review-doc`](https://github.com/marshallhouston/cosmic-farmland/tree/main/plugins/cosmic-farmland/skills/interactive-review-doc) skill body. kills the memory entry permanently. memory loads every turn too, so moving things up the tier ladder (hook > CI > script > skill > doc > memory) pays compounding rent.

related: [`caveman:compress`](https://github.com/JuliusBrussee/caveman) compresses memory files into caveman format and keeps a backup. same idea, different surface.

---

repo's at [github.com/marshallhouston/cosmic-farmland](https://github.com/marshallhouston/cosmic-farmland). still moving fast, still breaking things on purpose. take what's useful.

are these overkill? probably. is it fun? yes. telemetry for everything! bff bff bff :)
