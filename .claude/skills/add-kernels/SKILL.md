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
3. **Check for duplicates.** Read existing `_kernels/` files before creating new ones. If an idea already has a kernel, say so.
4. **Show the list.** Present the one-liners back before writing files. Let marshall edit, cut, reword.
5. **Write the files.** Create `_kernels/<slug>.md` for each approved kernel.

## Kernel File Format

```yaml
---
idea: "the one-sentence idea, in marshall's voice."
date: YYYY-MM-DD
sprouted: false
---
```

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
