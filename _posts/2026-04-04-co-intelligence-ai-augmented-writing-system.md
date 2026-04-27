---
title: "co-intelligence & ai-augmented writing system"
tags: [ai-augmented-engineering, writing, process, creative-expression, workflow, claude-code, cosmic-farmland]
classes: wide
updated_at: 2026-04-07 04:42 MDT
---

i read ethan mollick's [co-intelligence](https://www.penguinrandomhouse.com/books/741805/co-intelligence-by-ethan-mollick/) twice in 2025. his ideas on co-intelligence with human + ai together have heavily influenced my ai-augmented writing process.

writing again publicly feels the same and vastly different. 15 years is a long time.

## the pipeline

> notebook <-> kernel <-> idea <-> refine <-> draft <-> revision cycles <-> publish

<!-- TODO: photo of notebook page -->

this flow often takes days or weeks. ideas emerge, sit, breathe, shift shapes. though it's represented here as linear, it's decidedly nonlinear. porous, amoebic, adhd chaos with multiple parallel sessions all in various stages at the same time.

<!-- TODO: add repo structure here as markdown block showing the one example (meb?) we'll use throughout the entire post -->

**notebook.** pen to paper. noodling and doodling without any structure. fragments, quick thoughts, lists and bullets that then expand wide. furious scribbles. the feeling of pen on paper unlocks flow. this is _not_ editing time. i really like my moleskine cahier xl notebook with unlined pages; unlined is magical because there are no lines to confine. infrequently, i'll grab a legal pad lying around or one of those black and white composition notebooks (downside here is that i lose the plot and try to write as small as possible within a single line... partner says it looks serial-killerish, so yeah lol). love rotating the notebook randomly to write at 90 / 135 / 180 degrees. off kilter. write tiny, write huge.

**kernel.** first shift out of the notebook and into digital realm. claude code session in local repo using wispr flow to talk directly about the kernel. goes into the `_kernels` directory and ends up in [kernels](https://marshallhouston.wtf/kernels/). extract it down to one sentence, the thread to pull and pull. lightweight. often add many kernels at once and then keep moving onto other things, and let these ferment. i don't want to lose the context around the kernel, so that automatically gets thrown into the ideas section.

<!-- TODO: kernel examples - directory structure and one example (same post used throughout) -->

**idea.** all the random connections and thoughts related to a kernel from the initial planting. when inspiration strikes, i'll add more thoughts about the kernel. claude code & wispr flow again. broad framing: why do i find this interesting? what's the framing? what's the arc? what's the energy? what's the crux? this is where the shape starts to take form. more details and looser than the tightly scoped one-sentence kernel but not a full draft. append only. not editing. i don't look at what's collected in the ideas file. that would trigger the urge to edit, and we *do not* edit ideas :P then, i step away. the fermentation magic happens. let it simmer. blue smoke's rolling and temp has settled, nom bbq.

<!-- TODO: directory structure of _ideas and an example (same post) -->

**refine.** refine is a more structured. usually q&a: why this post, why now? what am i trying to accomplish? what emotional resonance am i going for? main purpose is to further clarify thinking and intent. claude code & wispr flow again. can oscillate back to more free-flowing ideas stage. sometimes let ferment further but others straight into next step if i'm feeling the creative urge.

<!-- TODO: examples - what directory? common prompts or skills? separate directory or append on ideas? -->

**draft.** we're finally ready to throw it into a draft state. claude code _without_ wispr flow. take what we've got from ideas and see what happens. i will hate this first draft. it is guaranteed. it's terrible. inaccurate. definitely not what i want, not what i said, not the voice or point... THE KERNEL IS CLEAR. visceral reaction expected... "no no no, this is trash. how in the hell is _that_ what was produced". but it's a launching point, and i feel the immediate shift. "ok cool, let's curate. i'm going to tear this shit to pieces and make it mine!". i've now got something to see and feel and interact with, and this shift matters.

**revision cycles.** the english major comes out. the tinkerer, the tweaker. there will be many, many revision cycles. claude code paired back up with wispr flow. `/feedback` skill creates a local html file with the draft on the left side and open feedback sections on the right. the first few cycles are focused on high level thinking, structure, feelings as i read it. we are not focused at the granular word and sentence level. once this is dialed, i get more detailed and make changes with specific words and sentences. all feedback is fed back directly into claude code with "copy all feedback as markdown" button. could this be automatic? yeah. but system's good enough for now. can always build it in the future. tbd on how many times this `/feedback` skill gets run. precision, intent. an extra grain of finishing salt. another squeeze of lemon or splash of vinegar.

<!-- TODO: screenshots and videos here. show _drafts dir with multiple iterations after each revision cycle -->

**published post.** holy shit, we're finally here! it's ready. claude code moves it from `_drafts/` to `_posts/`. commit and push, and the simple github site automatically updates. "ready" is a feeling; it is not a checklist. ship it earlier than i want to get it out there. by this time, dinner companions are starving, but that's what apps are for ;)

<!-- TODO: another step in the flow? worklog updates? apply bff (link to post) and see if there are hooks or skills to add and improve the overall system? -->

## evolution

<!-- TODO: screen recording of bff-era side-by-side workflow -->

the first post i wrote with this flow was [build friction fix]({{ site.baseurl }}{% post_url 2026-03-22-build-friction-fix %}). the setup was very simple. claude code on the left, locally served blog post on the right, wispr flow for voice input.

the loop: read the rendered post in the browser, talk through what wasn't working via wispr flow to bring that feedback into claude code, get a new draft, look again. over and over again.

the feedback was mostly structural at the outset. "is the arc right? does this section flow into the next one? am i losing energy here?" big-picture stuff.

since i wasn't distinguishing between "rewrite this whole section, the framing is off" and "change this specific phrase exactly," i got frustrated with the changes in the next draft when i told claude to incorporate the feedback. it felt like three steps back. structural feedback and line-level feedback were tangled together, and claude code happily gave me entire rewrites... oof.

however, the system was good enough. i finally wrote a thing! the cosmic farmland was BACK UP! yayayayayay

<!-- TODO: screenshots of review.html with structured feedback sections -->

the second post, [mental experimentation budgets]({{ site.baseurl }}{% post_url 2026-03-29-mental-experimentation-budgets %}), took shape over a few weeks.

i addressed the friction from writing bff where high-level general feedback tangled with specific wording feedback. the fix was `review.html`, an early version of the `/feedback` skill.

now, the feedback loop became read a section, add feedback, hit "copy all feedback as markdown," paste into claude code. structured, repeatable, and no more confusion level of granularity.

### wispr flow as granularity guardrail

wispr flow has been awesome to harness co-intelligence. i braindump and riff with the quickness. ~170 wpm of pure chaos.

when i'm typing feedback, i go too quickly to wordsmithing. i edit and re-edit sentences, fiddle with phrasing, chase rabbits. typing pulls me down to the word level whether i want to be there or not.

talking lets me stay at the right level of granularity. when feedbacking on overall structure, i stay in the structural realm. i'm not tempted to rewrite a sentence. yes, i can go to the granular level if i absolutely must, but it is easier to stay in the feedback lane i want.

wispr flow helps me stay at the right level of granularity, & it keeps the main thing the main thing.

## the current system

<!-- TODO: screen recording of highlighting and "instead x -> do y" on this post -->

the system i've got in place for this post adds another layer. the structured feedback sections from meb were good for big-picture notes. for specific wording, i was using `instead: "copied text" do: "revision"` over and over again. type `instead:`, highlight text to copy & then paste it in feedback box, type `do:`, copy & paste, edit specific wording.

that was annoying. i fixed. now, i highlight any text in the draft and the feedback text area auto-populates with:

> ```
> instead: "<selected_text>"
> do: "<selected_text>"
> ```

cursor lands right on the empty do: line, ready for the replacement. quick & easy.

<!-- TODO: update this revision cycle list based on current flow -->

bffing the system. at the core, this entire flow is a bff fractal.

## the thread

i like that the patterns emerged naturally through action. write, name the friction, and fix it. again and again.

this ai-augmented writing flow co-intelligence is bonkers for me. moving from notebook through ideas happens much quicker and in parallel; friction to start costs less neuron-watts. the revision loop is fast enough that i actually iterate on voice and structure.

`tangent` i throw away a ton of shit. the experimental weird `wtf is this, oh yes catharsis` [probabilistically perfect piggies]({{ site.baseurl }}{% post_url 2026-04-03-probabilistically-perfect-piggies %}) emerged after jamming on a lengthy diatribe about authenticity, hunter s thompson, creatives responses to authoritarianism and fascism, and homemade mullet energy + jbs&tdc's mutiny after midnight. late, late stages on it. about to ship. but i didn't love it. felt off, forced a bit. so i went old-school, straight writing, no co-intelligence. oink oink motherfuckers. `end tangent`

the bottleneck has never been "can i write?" i've done that before (tracked down a blog from 15 years ago when i was moving out to colorado. hilarious trip into nostalgia land).

the last 15 years it's been everything else.

## not just me

widening out, i love seeing versions of this pattern out in the wild from all sorts of folks. people finding their own way to use ai as co-intelligence for exactly what they want and need and then sharing it.

one example i love is from [jeff casimir](https://www.linkedin.com/posts/jcasimir_last-week-i-did-an-online-technical-challenge-activity-7444432840060133376-6MjV/) who shared his experience using ai to prepare for a technical assessment in python:

> We researched likely interview problems, wrote test suites, I built implementation, Claude gave feedback, and we distilled it into a PDF "Python for Rubyists" that I could print and have on my desk for the assessment.

> I think the real value is in using AI as a coach and collaborator. It can be the hub of a conversation that mixes the learner, the work, research, outside expertise (like a teacher), experience/context (like your past work/success/struggle), requirements/constraints, etc. The answer is the least interesting part of the process.

not "ai do this for me" vibe thinking but "ai as co-intelligence to own my own learning." the specific tools and workflows are different, but the relationship is the same. own your learning. own it!

## come along

this process will keep evolving. i'll bff and bff again. maybe there's a bff'd writing gastown out there.

weird times we live in y'all. keep learning and building :)
