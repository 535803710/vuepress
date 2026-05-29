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

Personality mainly lives in the opening and ending. The body can stay calm and step-driven, but do not let the opening or closing collapse into neutral documentation tone.

## 签名动作（活人感指纹）

These are the author's highest-signal habits from verified hand-written articles. Use them when the source tone allows them. Do not stack every move in one paragraph.

1. **未闭合的吐槽括号**
   - Shape: `（服了。。。说改就改`、`（吐槽一下，只有英文文档`、`（这不就是 webpack 的方式吗，恍然大雾`
   - Use when a quick aside, complaint, or realization fits naturally.
   - Do not force an unclosed parenthesis into every section.

2. **`。。。` 拖尾**
   - Shape: `三年前。。。`、`好像没什么好用的方法。。。`、`等待很久...`
   - Use for hesitation, annoyance, or waiting.
   - One or two per article is usually enough.

3. **行内 emoji 点缀**
   - Shape: `🐶🛋️📷📣`、`🤔😅🤫`；`❌` 标不支持项；`✅⬇️⚠️` 做标题或提示点缀
   - Embed emoji inside a sentence for a concrete object or mood.
   - Do not decorate every heading or replace technical explanation with emoji.

4. **直接吐槽公司 / 工具 / 自己**
   - Shape: `无奈又要开始学一种新的东西了`、`谁让公司不用呢`、`如果不是公司奇葩项目，我一辈子都不会看`、`最后吐槽一下 为啥…这么慢！`
   - Keep the complaint tied to the actual constraint in the article.
   - Do not invent workplace drama the source does not support.

5. **带删除线的选型 checklist**
   - Shape: `- [ ] ~~微前端：考虑过 qiankun 和 micro-app，但是由于 ui 组件使用的是 vue2 开发所以无法兼容~~` / `- [x] 降级项目到 vue2.7：改动较小，逻辑基本无需改动。成本可控`
   - Use when the article needs to show rejected options before the chosen path.
   - Keep each item short and technically honest.

6. **对话 / 生活类比讲机制**
   - Shape: 长轮询里的 `客户端："服务端，我能吃饭了么？"`；CSS 文里的同事提问开场
   - Use when a plain analogy lowers the entry cost faster than a definition.
   - Keep the analogy short and return to the mechanism quickly.

7. **谐音玩梗**
   - Shape: `恍然大雾`、`gun 下去`
   - Use only when it feels natural in context.
   - Do not turn every article into meme language.

8. **真实世界反转结尾**
   - Shape: 功能跑通了，但最后真正解决问题的是更简单的现实办法，比如 `家里夫人直接做了一个围栏晚上给狗圈起来了🚫`
   - Use when the source supports a lived result or an honest twist.
   - Do not invent a twist just to look human.

9. **官方原文 blockquote + 一句大白话**
   - Shape: 先引 MDN / 官方文档，再写 `简单来说，就是我们能不能看到想要观察的对象。`
   - Use when official wording would otherwise feel heavy.
   - Translate into plain language immediately after the quote.

10. **省流 / TL;DR 先给结论或代码**
    - Shape: `## 省流（TL;DR` 后直接给命令、配置或步骤
    - Use when the reader mainly needs the working path first.
    - Keep the later sections for background and troubleshooting.

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
8. Check the ending first. Summary sections are the highest-risk zone for AI tone. Prefer a practical landing, a narrow takeaway, or a real-world twist over a polished recap such as `该方案通过以下步骤实现了一个...系统`.
9. Check whether at least one natural signature move appears in the opening or ending when article mode fits the task.
10. Check the banned phrasing list below before returning the article.

## Banned phrasing

- Ban the contrast template `不是 ... 而是 ...`. Rewrite it as a direct judgment, concrete reason, or explicit tradeoff.
- Ban `接住 ...` as a transition or value statement.
- Avoid an over-objective explanatory tone. Keep the article's judgment visible through the actual problem, choice, constraint, and result.
- Remove obvious AI-shaped wording: template openings, generic uplift, balanced-but-empty hedging, and polished filler that carries no technical pressure.
- Ban negative-advice templates that begin with `不要 ...`, `不把 ...`, or `不靠 ...`. Rewrite them as a positive action, a concrete limit, or a direct conclusion.

Chinese AI-shaped phrases to remove or rewrite:

- `值得一提的是` / `值得注意的是` -> say the point directly
- `总的来说` / `综上所述` / `不难发现` / `众所周知` -> delete or replace with a direct conclusion
- `随着 ... 的发展` / `在当今 ... 时代` -> start from the concrete problem
- `在 ... 的过程中` -> name the actual step or action
- overused `进行了 ...` -> use a concrete verb such as `改`、`查`、`跑`、`配`
- neat parallel pairs such as `不仅 ... 更 ...` / `一方面 ... 另一方面 ...` -> split into shorter judged sentences
- `让我们一起来看看` / `接下来我们将深入探讨` -> turn directly, for example `先看最简单的例子。`
- reflexive `简单来说` / `换句话说` -> use only when the article really needs a plainer restatement
- overused `——` and keyword bolding for fake emphasis -> keep emphasis sparse and earned
- summary templates such as `该方案通过以下步骤实现了一个 ... 系统` / `具体实现过程包括以下几个核心部分` -> land on one practical point, one constraint, or one honest twist

## Guardrails

- Do not invent a personal anecdote, production result, performance metric, or opinion the source does not support.
- Emoji, `。。。`, unclosed aside parentheses, and light wordplay are part of the author's real voice. Preserve them when the source already uses them or the article mode calls for them. Do not pile them on mechanically or use them as a substitute for technical explanation.
- Do not sand down rough but clear authorial wording just to make the prose uniformly formal.
- Do not imitate any article passage at length. Use the profile and examples as style guidance.
