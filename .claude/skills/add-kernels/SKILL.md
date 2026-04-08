---
name: add-kernels
description: Use when marshall wants to add kernel ideas, plant new seeds, capture one-liner ideas for the site, or says things like "I have some kernel ideas", "let's add kernels", "new seeds", "plant some ideas". Triggers on any mention of adding/capturing/planting kernels or seed ideas.
---

# Add Kernels

Capture one-sentence idea seeds and add them to the `_kernels/` collection on the site.

## What Kernels Are

Kernels are one-sentence ideas that live on the public `/kernels/` page. They're seeds, not posts. Raw, punchy, intriguing. The kind of thing that makes someone go "oh, I want to read that."

They're different from `_ideas/writing/` docs (which are private brainstorming with threads and structure). Kernels are the public-facing teaser.

## Process

1. **Ask what's bouncing around.** Open-ended. Let marshall brain dump. He might have one idea or twelve.
2. **Capture each as a one-liner.** Distill to one sentence. Keep marshall's voice and energy. Don't clean up rawness.
3. **Check for duplicates (loose, same-vibe).** Read all existing `_kernels/*.md` files. For each new idea, judge loosely whether it matches the underlying thought of an existing kernel (also check any `variants` lists). Not exact phrasing, same vibe. When uncertain, ask marshall.
4. **Show the list.** Present the one-liners back before writing files, clearly labeled as NEW or REVISIT (pointing at the matched slug). Let marshall edit, cut, reword, or override the match.
5. **Write / update the files.**
   - **NEW:** Create `_kernels/<slug>.md` with the fresh format below.
   - **REVISIT:** Update the matched kernel file in place. Do not create a new file. Do not change the canonical `idea` or `date`. Add or bump `count`, append to `revisits`, append the new phrasing to `variants`.
6. **Report what happened.** Tell marshall which kernels were planted new and which got bumped ("bumped pain-cycle to 3, planted 2 new").

## Kernel File Format

**Fresh kernel:**
```yaml
---
idea: "the one-sentence idea, in marshall's voice."
date: YYYY-MM-DD
sprouted: false
---
```

**After one or more revisits:**
```yaml
---
idea: "the original canonical phrasing, never overwrite."
date: 2026-03-15
sprouted: false
count: 3
revisits:
  - 2026-03-15
  - 2026-04-08
  - 2026-05-02
variants:
  - "phrasing from the first revisit"
  - "phrasing from the second revisit"
---
```

Rules:
- `idea` is the canonical phrasing. Never overwrite it on a revisit.
- `date` is the original capture date. Never changes.
- `count` starts at 1 implicit (absent field = 1). First revisit sets `count: 2` and seeds `revisits` with both the original `date` and the new date.
- `count`, `revisits`, `variants` are private tracking fields, not rendered on the site. The `/kernels/` page only uses `idea`, `date`, `sprouted`.

## Voice

- Lowercase. Always.
- Fragments are fine. Periods doing structural work.
- If it sounds like a LinkedIn headline, burn it down.
- Raw > polished. The kernel should feel like a thought that just landed, not a pitch.
- Don't add more than what marshall gives you. One sentence means one sentence.

## Anti-Patterns

- Don't create a kernel AND an `_ideas/writing/` doc. Kernels are just the public one-liner.
- Don't add `sprouted: true` on new kernels. They haven't sprouted yet.
- Don't editorialize or expand. If marshall says "tattoos", the kernel is about tattoos, not "how body art reflects inner philosophy."
- Don't create a new kernel file when a loose-vibe duplicate exists. Bump the existing one.
- Don't overwrite the canonical `idea` field on a revisit. New phrasing goes into `variants`.
- Don't surface `count` / `revisits` / `variants` on the site. They're private tracking.
