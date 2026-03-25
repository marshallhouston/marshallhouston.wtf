---
name: brainstorm-post
description: Use when Marshall wants to brainstorm, flesh out, or develop a blog post idea from a kernel in _ideas/writing/. Triggers on "brainstorm a post", "flesh out this idea", "let's talk through a post", or referencing an idea doc for development.
---

# Brainstorm Post

Turn a raw idea kernel into a fleshed-out post design through conversational exploration.

## Overview

Marshall captures post ideas as raw kernels in `_ideas/writing/`. This skill takes a kernel and develops it into a full post arc through one-question-at-a-time dialogue. The output is an updated idea doc with the design appended (not overwritten) below the original, showing evolution of thinking.

## Process

```dot
digraph brainstorm_post {
    "Read idea doc + reference post (BFF)" [shape=box];
    "Clarifying questions (one at a time)" [shape=box];
    "Propose 2-3 approaches with recommendation" [shape=box];
    "Present design section by section" [shape=box];
    "User approves?" [shape=diamond];
    "Append design to idea doc" [shape=box];

    "Read idea doc + reference post (BFF)" -> "Clarifying questions (one at a time)";
    "Clarifying questions (one at a time)" -> "Propose 2-3 approaches with recommendation";
    "Propose 2-3 approaches with recommendation" -> "Present design section by section";
    "Present design section by section" -> "User approves?";
    "User approves?" -> "Present design section by section" [label="revise"];
    "User approves?" -> "Append design to idea doc" [label="yes"];
}
```

## Step 1: Context

- Read the idea doc in `_ideas/writing/`
- Read the BFF post (`_posts/2026-03-22-build-friction-fix.md`) as voice reference
- Check CLAUDE.md for voice and anti-patterns
- Note what's already captured vs what needs exploring

## Step 2: Clarifying Questions

Ask one question at a time. Prefer multiple choice when possible. Key areas:

- **Audience:** who is this for?
- **Current thinking:** has the mental model shifted since capture?
- **Central story/hook:** what's the entry point?
- **Relationship to other posts:** standalone, companion, extension?
- **Tone:** prescriptive vs exploratory vs somewhere in between?

Let Marshall brain dump. When he does, listen for the threads and reflect them back before asking the next question. Don't rush to structure.

## Step 3: Propose Approaches

Present 2-3 different structural approaches with trade-offs. Lead with your recommendation and why. These are about the overall shape and entry point of the post, not the content.

## Step 4: Present Design Section by Section

Walk through each section of the post arc. After each section, check: does this land? Revise before moving on.

Sections should name:
- What the section does (its job in the post)
- The key content/ideas in it
- The tone and energy

## Step 5: Append to Idea Doc

**Append, never overwrite.** The original kernel stays. Add a dated separator and the fleshed-out design below it.

Format:
```markdown
---

## fleshed out design (YYYY-MM-DD)

### post arc
#### 1. section name
content...

### tone
### additional influences
### audience
```

## Voice Reminders

- Read and follow CLAUDE.md voice guidance strictly
- The BFF post is the reference point for Marshall's voice
- No em dashes. Ever.
- If it could have been written by any AI, it's wrong
- Exploratory > conclusive. Ship the thinking.
- Let Marshall's brain dumps stay raw. Reflect and shape, don't sanitize.
