---
idea: "split classify from ship. /risk-score labels PRs, /ship gates on tier and auto-investigates failures. two-stage pipeline only works if the classifier is honest, so /classifier-audit scores the scorer."
date: 2026-04-19
sprouted: false
updated_at: 2026-04-19 05:43 MDT
---

---

## fleshed out design (2026-04-19)

### thesis
if shipping is the learning mechanism, reducing friction on shipping is the highest-leverage move. the ship system is BFF applied to BFF itself: iterating on the act of iteration.

### register/energy
MEB spine (measured, model-building, "let me think through this with you") with three-little-workflows texture (matter-of-fact, "here's what i built, take or leave"). not BFF's manic energy. not hiyaaa's quiet arrival.

### audience
no audience-shaping moves. anchor is authenticity, not reader persona.

### post arc

#### 1. the question
open on the real question: "how do i ship with confidence, fast?" one sentence naming the drive (build to learn, ship to learn, keep moving). one sentence naming the friction (shipping has friction, friction compounds). name the question directly. short. whitespace. no hook-performance.

#### 2. decompose the question
not a friction catalog (that would follow BFF-template and flatten the thesis). instead: take the question apart. "confidence" and "fast" pull opposite directions by default. confidence = knowing what kind of change you're shipping (judgment). fast = not involving yourself where you don't need to (execution). two different jobs. most tooling fuses them. that fusion is the actual bottleneck, not "CI is slow."

#### 3. the split
the split as consequence of the decomposition, not reveal of a built thing. one command labels (judgment). one command executes (action), reading the label the first committed to. the second doesn't re-decide. if it re-decided, jobs fused again. ascii diagram. mechanical close line: "the label is the decision. /ship is the action." no aphorism.

#### 4. the gates
show how the label drives behavior. code block quoting tier block from ship.md (em dashes swapped silently, no meta-commentary). then notes on what each tier feels like in practice: green invisible, yellow loud in final report, red hard-stop requiring --ack-red, unscored also hard-stop. punchline: "the gate's job is to calibrate friction to blast radius, not to prevent merges."

#### 5. the failure path
most important section. other half of the thesis. the split removes judgment-bleed from execution; auto-investigation removes human-bleed from failure handling. name old default ("want me to look?" punt). block-quote the principle from ship.md. then mechanic in plain prose (pull log, name root cause, classify, check if blocking, flake-or-real, act). real terminal example pulled from actual /ship history if possible; cut the block otherwise. close: "the split is only real if execution handles its own failures. otherwise you're back to babysitting." no fart-sniffing about re-fusing.

#### 6. the honest tension
the limit before the thesis lands. split + gates + auto-investigation rest on classifier honesty. if /risk-score mislabels a schema migration as green, /ship merges it silently. honest framing: the classifier is the one spot where a bad call propagates silently. everything else in the pipeline has a check. green labels don't. introduce /classifier-audit as compensation for that asymmetry. quote the "tier labels are theater" principle from classifier-audit.md.

#### 7. the close
thesis lands. three beats. (1) you build to learn, shipping is the mechanism, anything that slows shipping slows learning, the split is one cut at friction-reduction in a loop that matters more than the tools. (2) explicit BFF callout with link: this is build friction fix pointed at the act of shipping itself. build the workflow, notice friction (babysitting PRs), fix it (split + gates + auto-investigate), notice the next friction (is the classifier honest?), fix that too (classifier-audit). the loop doesn't stop at the first fix. (3) close on honesty: "this isn't the answer. it's where i am." quiet. whitespace.

### constants across all sections
- no em dashes.
- lowercase headings + title.
- first person "i".
- no "you" for marshall's experience.
- no prescribing to reader.
- no LinkedIn-shaped openers.
- no aphorism-traps. mechanical > philosophical.
- real artifacts, not fabricated ones.

### open questions for publish
- ship.md / classifier-audit.md currently live in preach-hub. for readers to use, they may need to be generalized and published in cosmic-farmland/plugins/marshall-tools/. not a blocker for draft, but flag before publish.
- section 5 terminal example: needs real /ship output pulled from history. if none available, cut the block rather than fabricate.
