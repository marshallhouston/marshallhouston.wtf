---
title: "on ai-augmented writing. just for me."
tags: [ai-augmented-engineering, writing, process, creative-expression]
classes: wide
updated_at: 2026-04-03 03:10 MDT
---

i read ethan mollick's [co-intelligence](https://www.goodreads.com/book/show/198678162-co-intelligence) twice in 2025 and led a small bookclub on it.

his ideas on human + ai together in concert as co-intelligence shape my ai-augmented writing process.

i've had periods of immense creativity (documentary film, photography, blogging), but i haven't always identified as a creative.

this site feels like both a return to explicit creativity and yet something new and different.

here's the current flow.

## the pipeline

> notebook -> kernel -> idea -> refine -> draft -> revision cycles -> publish

<!-- TODO: photo of notebook page -->

days. weeks. ideas emerge, sit, breathe, shift shapes. ferment.

<!-- TODO: add repo structure here as markdown block showing the one example (meb?) we'll use throughout the entire post -->

**notebook.** pen to paper, noodling and doodling. no structure. fragments. quick thoughts. furious scribbles. unlined paper means no lines to confine, and i can turn it 90 degrees, 180 degrees, off kilter. write tiny, write huge.

**kernel.** first shift out of the notebook. claude code in repo and wispr flow to talk directly about the kernel. goes into the `_kernels` directory. a few sentences, maybe some threads to pull. lightweight. often add many kernels at once and then keep moving onto other things, and let these ferment.

<!-- TODO: kernel examples - directory structure and one example (same post used throughout) -->

**idea.** kernels that keep pulling at me get some more focus. claude code & wispr flow again to go into `_ideas` directory. why do i find this interesting? what's the framing? what's the arc? what's the energy? what's the crux? this is where the shape of the post starts to sprout. more formed than kernel but not a full draft at all. more fermentation.

<!-- TODO: directory structure of _ideas and an example (same post) -->

**refine.** structured q&a. why this post, why now? what am i trying to accomplish? what emotional resonance am i going for? clarify thinking and intent. claude code & wispr flow. sometimes let ferment further. sometimes the creative urge says go.

<!-- TODO: examples - what directory? common prompts or skills? separate directory or append on ideas? -->

**draft.** claude code in `_drafts` directory. see what emerges from notebook -> kernel -> idea -> refine. i will hate this first draft. terrible. inaccurate. definitely _not_ what i want. good. purposeful friction. visceral reactions. no no no, this is trash. ok cool, let's curate. now i've got something to see and feel and push against.

**revision cycles.** `/feedback` skill creates local html. draft on the left, feedback input on the right. wispr flow brain dump. first few cycles: high level feelings, structure. not words. then it shifts. granular. specific phrasing. "copy all feedback as markdown" into claude code. could it be automatic? yeah, probably. good enough for now.

<!-- TODO: screenshots and videos here. show _drafts dir with multiple iterations after each revision cycle -->

**publish.** claude code moves it from `_drafts/` to `_posts/`. commit. push. github site updates. "ready" is a feeling more than a checklist. ship it earlier than i want to.

<!-- TODO: another step in the flow? worklog updates? apply bff (link to post) and see if there are hooks or skills to add and improve the overall system? -->

## evolution

<!-- TODO: screen recording of bff-era side-by-side workflow -->

[build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}) was the first one. claude code on the left, locally served blog post on the right, [wispr flow](https://www.wispr.ai/) for voice. read the rendered post, talk through what's not working, bring that into claude code, new draft, look again.

mostly structural. "is the arc right? does this flow? am i losing energy here?"

but i couldn't tell claude code the difference between "rewrite this whole section" and "change this exact phrase." everything tangled. structural feedback and line-level feedback in the same breath. claude code happily guessed at entire rewrites... oof.

good enough though. i finally wrote a thing! yayayayayay

<!-- TODO: screenshots of review.html with structured feedback sections -->

[mental experimentation budgets]({{ site.baseurl }}{% post_url 2026-03-29-mental-experimentation-budgets %}) took two weekends. the friction from bff was clear: feedback at different altitudes getting tangled. so i built `review.html`. split-pane. rendered post on the left, feedback sections on the right. each section gets its own panel. read, add feedback, "copy all feedback as markdown," paste into claude code. structured. repeatable. no more altitude confusion.

### wispr flow as cognitive routing

~170 wpm of pure chaos. braindump and riff with the quickness.

typing pulls me to the word level. i start editing sentences, fiddling with phrasing, chasing rabbit holes. whether i want to be there or not.

talking keeps me at the right altitude. wispr flowing on structure, i stay structural. wispr flowing on feeling, i stay in feeling. i _can_ go granular. but only when i choose to. the medium shapes the message.

cognitive routing. keeps the main thing the main thing.

## the current system

<!-- TODO: screen recording of highlighting and "instead x -> do y" on this post -->

this actual post. another layer. structured feedback sections were good for big-picture. but specific wording was clunky: `instead: "copied text" do: "revision"`, type it, highlight, copy, paste, type, copy, paste.

now: highlight any text in the rendered post. feedback textarea auto-populates:

```
instead: "the text you highlighted"
do: ""
```

cursor on `do:`. type. done.

<!-- TODO: update this revision cycle list based on current flow -->

each layer from friction in the previous one. conversation -> structured sections -> inline highlighting. the system building itself. bff all the way down.

## the thread

bff fractal.

didn't plan this. didn't design a writing system. wrote a post, named the friction, fixed it. wrote another, new friction, fixed that. [build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}) isn't just a post. it's the system.

the co-intelligence is essential. claude code + wispr flow make the revision loop fast enough to actually iterate on voice, on structure, on whether something lands. the bottleneck was never "can i write?"

yes i can.

## not just me

this pattern keeps showing up. people finding their own co-intelligence for exactly what they want and need.

jeff casimir, founder of turing school, preparing for a technical assessment in python:

> We researched likely interview problems, wrote test suites, I built implementation, Claude gave feedback, and we distilled it into a PDF "Python for Rubyists" that I could print and have on my desk for the assessment.

> I think the real value is in using AI as a coach and collaborator. It can be the hub of a conversation that mixes the learner, the work, research, outside expertise (like a teacher), experience/context (like your past work/success/struggle), requirements/constraints, etc. The answer is the least interesting part of the process.

not "do this for me." co-intelligence to own your own learning. different tools, different workflows, same relationship.

## come along

this will look different in a month. new friction, new fixes.

i'd love to hear what co-intelligence looks like for you. the tools are neat but i'm more interested in the relationship you've developed with it.

let's chat :)
