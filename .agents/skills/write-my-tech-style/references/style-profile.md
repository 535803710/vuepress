# Style Profile

## Evidence status

This profile is evidence-backed but not yet Juejin-page-complete.

The user has explicitly marked a small local corpus as nearly fully hand-written and high-signal for personal voice. Treat [priority-samples.md](priority-samples.md) as stronger evidence than generalized style examples when they disagree.

Verified in the creation pass:

- Local VuePress writing repository with dozens of Markdown articles across `JS基础`, `最佳实践`, `心得`, `HTTP`, `React`, `Vue`, `TS指南`, browser notes, algorithms, and engineering notes
- Local long-form samples including async/event loop, lexical environments and closures, Web Workers polling, browser camera recognition, avoid-overdesign, frontend tools, and the AI development workflow practice article
- Juejin article body and search result material for `我不允许还有人不理解异步编程和事件循环！`
- Juejin `js基础` column listing with article titles and excerpts
- Public Juejin snippets for high-visibility titles such as `喂！不用这些网站，你哪来的时间摸鱼？`, `完蛋，我被好用的网站包围了！`, and the browser-recognition project about keeping a pet off the sofa
- The author's public blog mirror pages for state machines, debounce/throttle, functional programming, resumable upload, interceptor design, Web Workers polling, and generating an HTML file with native JS

TODO: Compare this profile with every accessible post from the Juejin profile page once the Chrome corpus path is available. Treat any Juejin-only rule as unverified until that pass supports it.

## Core voice

- Write as a frontend practitioner explaining a topic because it became useful, confusing, or worth trying.
- Prefer "make the reader see it" over "sound comprehensive".
- Keep a visible personal hand on the article: a judgment, a quick aside, a rhetorical question, a concrete scene, or a reason this implementation matters.
- Stay technical. Personality comes from framing and rhythm, not from flooding the article with decoration.

## Two modes

The local repository shows two related but different modes.

### Article mode

Use this by default for Juejin drafts and rewrites:

- stronger title and opening
- reader problem or concrete scene early
- visible stance, aside, small joke, or practical pressure
- a publishable path through the topic instead of a note dump

### Knowledge-note mode

Use only when the user asks for notes, docs, or compact study material:

- plain concept title
- mechanism-first outline
- dense definitions, diagrams, steps, and references
- less personality pressure

Do not accidentally rewrite a public article into a dry repository note. Do not inflate a note into a dramatic article unless the user asks for publication-ready prose.

## Titles

The verified title set falls into several recognizable shapes:

- Hook plus pressure: a direct challenge, warning, or scene.
- Practical result plus technique: name the optimization, browser feature, API, or implementation target.
- Learning path title: name the concept and signal that the article starts from zero or from a concrete use case.
- Playful reference when the topic allows it.

Prefer:

- one strong promise
- technical nouns the article really covers
- punctuation or a small expressive marker only when the title benefits from it

Avoid:

- flat SEO titles that read like a catalog entry
- overpromising "ultimate", "complete", or "must-read" language unless the article actually carries that weight
- pushing every title into the same exclamation-heavy hook

## Openings

Common opening moves in the verified material:

- Start with the problem before the definition.
- Use a quick scene or analogy to lower the entry cost.
- Ask the reader-facing question explicitly, then answer it in plain language.
- Use a short quote or one-line setup when the implementation is narrow.
- For process or opinion pieces, use a compact `省流` or stance block before the main explanation when it saves the reader real time.

Good article openings should reach one of these quickly:

- what problem exists
- why the topic matters
- what implementation is being attempted
- what common misunderstanding is being cleared up

## Explanation pattern

The writing often moves through a practical ladder:

1. Name the thing plainly.
2. Give the simplest example or analogy.
3. Break the mechanism into steps, bullets, or small sections.
4. Show code or implementation detail.
5. Call out the reason, tradeoff, or failure case that makes the detail matter.

Use questions as pivots when they help:

- what is this solving
- why does the obvious method fail
- how should the next step work

Do not turn every paragraph into a question-answer block. The rhythm should remain authored, not templated.

## Paragraph and sentence rhythm

- Favor short and medium sentences around definitions and judgments.
- Allow denser code-adjacent passages when walking through steps.
- Use lists freely for procedures, conditions, and concept breakdowns.
- Mix section depth: a quick note can stay quick; a core mechanism can get code and subheads.
- Let a blunt sentence stand alone when it earns emphasis.
- Accept article roughness when it carries the author: an honest aside, a direct complaint, a practical shortcut, or a small ending twist can matter more than perfectly even polish.

## Language habits to preserve

- Concrete verbs: use, solve, create, judge, send, wait, change, resume.
- Reader-facing phrasing: "我们", "如果", "比如", "这时候", "为什么".
- Mild colloquial turns when the source tone allows them.
- Strong but local claims: explain why a method matters in this article instead of making grand industry claims.
- Scene words and practical nouns from the actual problem: phone, page, main thread, worker, fence, document, requirement, test.

## Technical writing habits

- Introduce concepts from execution pressure, not abstract taxonomy alone.
- Prefer a small implementation or failure case over broad hand-waving.
- Explain code in the order the reader will reason through it.
- Highlight the wrong turn when it teaches the mechanism.
- Keep references and definitions close to the operation they support.
- For implementation stories, separate `背景`, `需求分析`, `技术要点`, `实现效果`, and `总结` when that shape fits the material.
- For workflow or experience essays, let the opening take a stance first, then use a numbered chain and explicit rollback points.

## De-AI pass

Run this pass after drafting or rewriting:

1. Delete abstract throat-clearing that delays the real topic.
2. Replace generic benefit language with the actual problem, constraint, or failure case.
3. Break paragraph symmetry. Vary length, density, and transition style.
4. Remove summary padding that says the article is useful instead of proving it.
5. Rebuild titles that sound like neutral documentation.
6. Check whether every polished sentence still sounds like a human choice.
7. Check the mode. Publication drafts should not collapse into a dry encyclopedia outline.
8. Check the banned phrasing list below before returning the article.

## Banned phrasing

- Ban the contrast template `不是 ... 而是 ...`. Rewrite it as a direct judgment, concrete reason, or explicit tradeoff.
- Ban `接住 ...` as a transition or value statement.
- Avoid an over-objective explanatory tone. Keep the article's judgment visible through the actual problem, choice, constraint, and result.
- Remove obvious AI-shaped wording: template openings, generic uplift, balanced-but-empty hedging, and polished filler that carries no technical pressure.
- Ban negative-advice templates that begin with `不要 ...`, `不把 ...`, or `不靠 ...`. Rewrite them as a positive action, a concrete limit, or a direct conclusion.

## Guardrails

- Do not invent a personal anecdote, production result, performance metric, or opinion the source does not support.
- Do not add emojis or dramatic hooks as a substitute for voice.
- Do not sand down rough but clear authorial wording just to make the prose uniformly formal.
- Do not imitate any article passage at length. Use the profile and examples as style guidance.
