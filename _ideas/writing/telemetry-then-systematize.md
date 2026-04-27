---
title: cosmic-farmland updates
captured: 2026-04-27
kernel: telemetry-then-systematize
updated_at: 2026-04-27 05:45 MDT
---

hey, made some updates to cosmic-farmland. here's what landed.

---

## fleshed out design (2026-04-27)

### register / energy

straightforward. "hey, i made some updates." casual, dry-ish. no manifesto. no gonzo. no porch story. short intro, four functional groups, short close. fragments fine. lowercase. no em dashes. repo link does the work, post is the pointer.

not a full one-line-per-commit changelog. grouped by what the work does, short paragraph per group, what + why.

### audience

people following along. anyone using claude code who might find a pattern useful. no audience optimization beyond "make it scannable."

### post arc

#### 1. open
one or two lines. shipped a bunch in cosmic-farmland this week. here's what landed, grouped by what it does. repo link.

#### 2. telemetry + friction mining
instrumented my own claude code sessions to figure out what to systematize. four scripts in `bin/`:
- `cc-session-export` walks `~/.claude/projects/*/*.jsonl`, dumps per-msg usage to csv. worktree-scoped by default.
- `cc-friction-peek` inspects one session: user msgs, tool sequences, top output-token msgs.
- `cc-friction-scan` runs heuristic regex taxonomy across an N-day window. taxonomy v0: re_asking, short_yes, copy_clarity, rule_drift, stall, status_begging, interrupt. 2d preach-hub baseline turned up 84 re_asking and 76 short_yes across 19 sessions.
- `cc-pattern-mine` n-grams tool calls and slash command sequences. ranks by frequency × distinct-session count so chatty single sessions don't dominate. surfaced `/ship → /ship` (49 hits, 27 sessions) and `/ship → /handoff` (13 hits, 13 sessions).

scanner finds weakness. miner finds strength. both feed `/systematize`.

#### 3. first things shipped from that data
the miner pointed at patterns. shipped them as glue:
- `no-reasking` Stop hook. detects "want me to / should i / would you like" in last assistant text. whitelists destructive op confirmations. warns to stderr + appends to `~/.claude/cc-friction-log.jsonl`. non-blocking on purpose. measure first, tighten later.
- `/wrap` command. ships current PR then writes handoff prompt. replaces the `/ship → /handoff` chain (13/13).
- `/ship-all` command. lists `author=@me` open PRs, single confirmation, drains the queue via `/ship` per PR. auto-cd to matching worktree. replaces `/ship → /ship` (49/27).

closed loop. instrumentation → patterns → glue.

#### 4. /ship hardening
`/ship` got a rewrite earlier in the week. replaced `gh pr checks --watch` with a polling snapshot loop. `--watch` blocks on every check reaching terminal state, so one slow gate (preview deploy, classifier waiting on LLM) hangs the whole skill for 10-15 min with zero output. indistinguishable from a frozen assistant.

new loop prints a snapshot per tick only when state changes. hard 20 min cap. stall detector bails after 5 min of no change and reports which check is hung. bails immediately on any failure so the auto-investigate step fires right away. risk-tier gate w/ `--ack-yellow` / `--ack-red` overrides. graceful skip when no risk classifier exists.

also a fall-through fix: when state is OPEN with all checks green and no failures, break out of poll and let the manual merge step run. caught a case where native auto-merge didn't fire (incident: PR #319 sat for 5 min waiting for a merged state that wasn't coming).

#### 5. token diet
skill descriptions load every turn. compressed 8 of them 50-80% each. saves ~5-7k chars per session.

also promoted a memory entry (auto-open review docs) into the `interactive-review-doc` skill body. kills one memory entry permanently. memory also loads every turn. tier ladder: hook > CI > script > skill > doc > memory. moving things up the ladder pays compounding rent.

`caveman:compress` skill exists for the same reason. compresses memory files into caveman format, keeps a backup at `.original.md`.

#### 6. close
one or two lines. repo's at github.com/marshallhouston/cosmic-farmland. plug it in, pick what's useful, change what isn't.

### influences

three-little-workflows energy. less unhinged than BFF, less manifesto than cosmic-farmland origin post, less guided-tour than tools-repo-tour. closer to a casual project log. show the artifacts (commands, file paths, real numbers from the scan), don't oversell.

### length target

short. probably ~400-600 words rendered. could go shorter. not a deep dive on any one piece. each group can spawn its own deeper post later if it has legs.
