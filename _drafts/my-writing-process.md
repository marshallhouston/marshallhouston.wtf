---
title: "on ai-augmented writing. just for me."
tags: [ai-augmented-engineering, writing, process, creative-expression]
classes: wide
updated_at: 2026-04-03 02:59 MDT
---

i read ethan mollick's [co-intelligence](https://www.goodreads.com/book/show/198678162-co-intelligence) twice in 2025 and led a small bookclub on it.

his ideas on human + ai together in concert as co-intelligence shape my ai-augmented writing process.

i've had periods of immense creativity (documentary film, photography, blogging), but i haven't always identified as a creative.

this site feels like both a return to explicit creativity and yet something new and different.

here's the current flow.

## the pipeline

> notebook -> kernel -> idea -> refine -> draft -> revision cycles -> publish

<!-- TODO: photo of notebook page -->

it happens over days or weeks. ideas emerge, sit, breathe, shift shapes.

<!-- TODO: add repo structure here as markdown block showing the one example (meb?) we'll use throughout the entire post -->

**notebook.** pen to paper, noodling and doodling. no structure. fragments. quick thoughts. furious scribbles. unlined paper means no lines to confine, and i can turn it 90 degrees, 180 degrees, off kilter. write tiny, write huge.

**kernel.** first shift out of the notebook. claude code in repo and wispr flow to talk directly about the kernel. goes into the `_kernels` directory. a few sentences, maybe some threads to pull. lightweight. often add many kernels at once and then keep moving onto other things, and let these ferment.

<!-- TODO: kernel examples - directory structure and one example (same post used throughout) -->

**idea.** kernels that keep pulling at me get some more focus. claude code & wispr flow again to go into `_ideas` directory. why do i find this interesting? what's the framing? what's the arc? what's the energy? what's the crux? this is where the shape of the post starts to sprout. more formed than kernel but not a full draft at all. more fermentation.

<!-- TODO: directory structure of _ideas and an example (same post) -->

**refine.** refine is a structured q&a: why this post, why now? what am i trying to accomplish? what emotional resonance am i going for? main purpose is to clarify my thinking and intent. claude code & wispr flow. sometimes let ferment further but others straight into next step if i'm feeling the creative urge.

<!-- TODO: examples - what directory? common prompts or skills? separate directory or append on ideas? -->

**draft.** claude code in `_drafts` directory. see what emerges from the thinking i've put in from notebook -> kernel -> idea -> refine. i will hate this first draft. it's terrible. inaccurate. definitely _not_ what i want, and it's a starting point to launch from. purposeful friction, visceral reactions... no no no, this is trash; ok cool, let's curate. i've now got something to see and feel and interact with.

**revision cycles.** `/feedback` skill that creates local html file with draft on the left and feedback input section on the right. wispr flow brain dump first few cycles that are focused on high level feelings, structure. not focused on words. eventually transitions into granular changes with specific words and phrasing on subsequent revisions. all feedback is fed back directly into claude code with a simple "copy all feedback as markdown" approach. could it be automatic? yeah, i bet. but good enough for now.

<!-- TODO: screenshots and videos here. show _drafts dir with multiple iterations after each revision cycle -->

**published post.** when it's ready, claude code moves it from `_drafts/` to `_posts/`. commit and push and github site automatically updates. "ready" is a feeling more than a checklist. ship it earlier than i want to get it out there.

<!-- TODO: another step in the flow? worklog updates? apply bff (link to post) and see if there are hooks or skills to add and improve the overall system? -->

## evolution

<!-- TODO: screen recording of bff-era side-by-side workflow -->

the first post i wrote with this flow was [build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}). the setup was simple: claude code on the left, locally served blog post on the right, [wispr flow](https://www.wispr.ai/) for voice input.

the loop was read the rendered post in the browser, talk through what wasn't working via wispr flow, bring that feedback into claude code, get a new draft, look again.

it worked. the feedback was mostly structural. "is the arc right? does this section flow into the next one? am i losing energy here?" big-picture stuff.

i was frustrated with the friction because i couldn't distinguish between "rewrite this whole section, the framing is off" and "change this specific phrase exactly." structural feedback and line-level feedback were tangled together, and claude code happily guessed at entire rewrites... oof.

it was good enough though, and i finally wrote a thing! yayayayayay

<!-- TODO: screenshots of review.html with structured feedback sections -->

the second post, [mental experimentation budgets]({{ site.baseurl }}{% post_url 2026-03-29-mental-experimentation-budgets %}), took two weekends.

the big friction from bff: overall feedback and specific wording feedback getting tangled in conversation. the fix was `review.html`, a split-pane tool. the rendered post on the left, structured feedback sections on the right. each section of the post got its own feedback panel with placeholders tailored to what kind of feedback that section needed.

the feedback loop became: read a section, add feedback in its panel, hit "copy all feedback as markdown," paste into claude code. structured, repeatable, no more guessing what altitude i was at.

### wispr flow as cognitive routing

wispr flow has been awesome to harness co-intelligence. i braindump and riff with the quickness. ~170 wpm of pure chaos.

when i'm typing feedback, i go too quickly to wordsmithing. i start editing sentences, fiddling with phrasing, chasing rabbit holes. typing pulls me down to the word level whether i want to be there or not.

talking keeps me at the right altitude. when wispr flowing feedback on overall structure, i stay in the structural realm. i'm not tempted to rewrite a sentence. i can go to the granular level if i want. the medium shapes the message.

wispr flow isn't a convenience tool. it's cognitive routing to stay at the right level of granularity. it keeps the main thing the main thing.

## the current system

<!-- TODO: screen recording of highlighting and "instead x -> do y" on this post -->

the system i'm using now on this actual post adds another layer. the structured feedback sections from meb were good for big-picture notes. but for specific wording, i was using `instead: "copied text" do: "revision"` repeatedly. type instead:, highlight to copy & paste, type do:, copy & paste.

the fix: inline text selection. highlight any text in the rendered post and the feedback textarea auto-populates with:

```
instead: "the text you highlighted"
do: ""
```

cursor lands right on the empty `do:` line, ready for the replacement. precise, fast, no ambiguity about what you're referring to.

<!-- TODO: update this revision cycle list based on current flow -->

each layer came from friction in the previous one. loose conversation feedback became structured feedback sections became highlighting with direct substitution. the system is building itself.

## the thread

at the core, this is just a bff fractal.

none of this was planned. i didn't sit down and design a writing system. i wrote a post, named the friction, and fixed it. wrote another post, noticed new friction, fixed that too. [build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}) isn't just the name of a post. it's the system.

the ai-augmented co-intelligence is essential but it's not the entire point. with claude code + wispr flow, it makes the revision loop fast enough that i can actually iterate on voice, on structure, on whether something lands. the bottleneck was never "can i write?"

turns out, yes i can.

## not just me

i keep seeing versions of this pattern out in the wild. people finding their own way to use ai as co-intelligence for exactly what they want and need.

jeff casimir, founder of turing school, shared his experience using ai to prepare for a technical assessment in python:

> We researched likely interview problems, wrote test suites, I built implementation, Claude gave feedback, and we distilled it into a PDF "Python for Rubyists" that I could print and have on my desk for the assessment.

> I think the real value is in using AI as a coach and collaborator. It can be the hub of a conversation that mixes the learner, the work, research, outside expertise (like a teacher), experience/context (like your past work/success/struggle), requirements/constraints, etc. The answer is the least interesting part of the process.

not "ai do this for me" vibe thinking but "ai as co-intelligence to own my own learning." the specific tools and workflows are different, but the relationship is the same.

## come along

this process will keep evolving. i'll hit new friction, build new fixes, and the system will look different in a month.

i'd love to hear what co-intelligence looks like for you. how are you using ai in your creative work, your learning, your daily practice? the tools are neat, but i'm more interested in the co-intelligence you've developed with it.

let's chat :)
