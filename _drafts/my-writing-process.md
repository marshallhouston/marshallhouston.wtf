---
title: "my writing process"
tags: [ai-augmented-engineering, writing, process, creative-expression]
classes: wide
updated_at: 2026-04-01 02:49 MDT
---

a few weeks ago i picked up ethan mollick's [co-intelligence](https://www.goodreads.com/book/show/198678162-co-intelligence). the core idea that stuck: AI isn't a replacement for thinking. it's a thinking partner. not the thing that does the work for you, but the thing that makes your thinking sharper, faster, more honest.

i'd been experimenting with claude code for a while at that point, but something clicked. i started applying that frame to writing. not "generate me a blog post" but "help me figure out what i'm actually trying to say."

a few weeks later, i've published three posts and have more ideas than i know what to do with. the process i've landed on is genuinely fascinating to me. when i show people how it works, the reaction is usually some version of "oh shit, i didn't know you could do that."

so here's how it works. come along if you want.

## the pipeline

before zooming in, here's the full shape of the thing:

**notebook** -> **kernel** -> **idea** -> **refine** -> **draft** -> **revision cycles** -> **published post**

<!-- TODO: photo of notebook page -->

it happens over days or weeks. ideas emerge, sit, breathe, get pressure-tested. the stages aren't bureaucracy. each one exists because i kept running into friction without it.

let me walk through each one.

**notebook.** everything starts here. pen, paper, noodling. no structure, no audience, no pressure. just whatever's bouncing around. i call these "noodle doodle" sessions because that's the energy. doodling with ideas.

**kernel.** a notebook riff that has some gravity gets captured as a kernel. a few sentences, maybe some threads to pull. enough to remember the spark, not enough to constrain it.

<!-- TODO: screenshot of a kernel doc -->

**idea.** kernels that keep pulling at me get fleshed out. what's the framing? what's the arc? who's this for? what's the energy? this is where the shape of the post starts to form, but i'm still not writing the post itself.

<!-- TODO: screenshot of idea doc -->

**refine.** this step didn't exist at first. i added it because i kept jumping from idea to draft and losing the thread. refine is a Q&A: why this post, why now? what am i trying to accomplish? what do i want readers to feel? no wordsmithing. just clarity on intent before i start writing actual sentences.

**draft.** now i'm writing. first drafts are loose, fast, getting-it-down. the quality of the draft is directly proportional to how well i did the refine step.

**revision cycles.** this is where it gets interesting, and where the process has evolved the most. more on this below.

**published post.** when it's ready, it moves from `_drafts/` to `_posts/` and goes live. "ready" is a feeling more than a checklist.

## the BFF era

<!-- TODO: screen recording of BFF-era side-by-side workflow -->

the first post i wrote with this flow was [build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}). the setup was simple: claude code on the left, locally served blog post on the right, [wispr flow](https://www.wispr.ai/) for voice input.

the loop looked like this: read the rendered post in the browser, talk through what wasn't working via wispr flow, bring that feedback into claude code, get a new draft, look again.

it worked. the feedback was mostly structural. "is the arc right? does this section flow into the next one? am i losing energy here?" big-picture stuff.

but the friction was real. everything lived in conversation. i couldn't distinguish between "rewrite this whole section, the framing is off" and "change this specific phrase, it doesn't sound like me." structural feedback and line-level feedback were tangled together, and claude code had to guess which altitude i was operating at.

it was a start. and it got the post out.

## the MEB evolution

<!-- TODO: screenshots of review.html with structured feedback sections -->

the second post, [mental experimentation budgets]({{ site.baseurl }}{% post_url 2026-03-29-mental-experimentation-budgets %}), took two weekends. not because the writing was harder, but because i was also building the next version of the process while using it.

the big friction from BFF: overall feedback and specific wording feedback getting tangled in conversation. the fix was `review.html`, a split-pane tool. the rendered post on the left, structured feedback sections on the right. each section of the post got its own feedback panel with placeholders tailored to what kind of feedback that section needed.

the feedback loop became: read a section, type feedback in its panel, hit "copy all feedback as markdown," paste into claude code. structured, repeatable, no more guessing what altitude i was at.

### wispr flow as cognitive routing

here's something i didn't expect: voice input changed how i thought, not just how fast i typed.

when i'm typing feedback, i drift into wordsmithing. i start editing sentences, fiddling with phrasing, chasing rabbit holes. typing pulls you down to the word level whether you want to be there or not.

talking keeps you at the right altitude. when i'm voice-dictating feedback on overall structure, i stay structural. i'm not tempted to rewrite a sentence because i'm not looking at a cursor in a text field. the medium shapes the message.

wispr flow isn't a convenience tool. it's cognitive routing. it keeps the main thing the main thing.

## the current system

<!-- TODO: screen recording of highlighting and "instead X -> do Y" on this post -->

the system i'm using right now (on this actual post) added another layer. the structured feedback sections from MEB were good for big-picture notes. but for specific wording, i was still writing things like "the phrase in paragraph 3 that says X should say Y" which is clunky.

the fix: inline text selection. highlight any text in the rendered post and the feedback textarea auto-populates with:

```
instead: "the text you highlighted"
do: ""
```

cursor lands right on the empty `do:` line, ready for the replacement. precise, fast, no ambiguity about what you're referring to.

combined with skills and commands i've built in claude code, the full revision cycle is now:

1. render the post locally
2. open `review.html` with the post loaded
3. read through section by section
4. structural feedback goes in section panels
5. specific wording: highlight text, type the replacement
6. copy all feedback as markdown
7. paste into claude code
8. new draft renders, repeat

each layer came from friction in the previous one. loose conversation feedback became structured feedback sections became highlighting with direct substitution. the system is building itself.

## the thread

i want to zoom out for a second.

none of this was planned. i didn't sit down and design a writing system. i wrote a post, noticed what was hard, and fixed it. wrote another post, noticed new friction, fixed that too. [build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}) isn't just the name of a post. it's the loop that built the process you're reading about.

the AI piece is essential but it's not the point. claude code doesn't write my posts. it makes the revision loop fast enough that i can actually iterate on voice, on structure, on whether something lands. the bottleneck was never "can i write?" it was "can i close the feedback loop fast enough to actually improve?"

turns out, yes. with the right setup, you can.

## not just me

i keep seeing versions of this pattern in the wild. people finding their own way to use AI as a thinking partner rather than a replacement.

jeff casimir, founder of turing school, shared his experience using AI to prepare for a technical assessment in python (a language he was learning, coming from deep ruby expertise):

> We researched likely interview problems, wrote test suites, I built implementation, Claude gave feedback, and we distilled it into a PDF "Python for Rubyists" that I could print and have on my desk for the assessment.

> I think the real value is in using AI as a coach and collaborator. It can be the hub of a conversation that mixes the learner, the work, research, outside expertise (like a teacher), experience/context (like your past work/success/struggle), requirements/constraints, etc. The answer is the least interesting part of the process.

same principle. not "AI do this for me" but "AI help me think through this." the specific tools and workflows are different, but the relationship is the same.

## come along

this process will keep evolving. i'll hit new friction, build new fixes, and the system will look different in a month. that's the point.

if this resonates, i'd love to hear what you're building. how are you using AI in your creative work, your learning, your daily practice? not the tool itself, but the relationship you've developed with it.

come find me. let's compare notes.
