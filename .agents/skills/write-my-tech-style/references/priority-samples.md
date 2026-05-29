# Priority Samples

The user explicitly marked these local articles as nearly fully hand-written and strong evidence of personal voice. Read them before generalized examples when a task needs close voice calibration.

Use these samples as evidence, not copy targets. Do not lift passages at length or invent personal stories just to match them.

## High-weight corpus

- `docs/最佳实践/纯CSS实现文字环绕/README.md`
  - The first 12 lines are especially high-signal: a remembered question, a delayed answer, and a fast turn into the implementation.
  - Use this sample for short scene hooks, `省流`-style code-first delivery, and a path that moves from a discovered API or document back to the original problem.
- `docs/最佳实践/实践-vue3项目降级vue2/README.md`
  - Use this sample for engineering tradeoff writing: state the environment, list real constraints, rule out options with strikethrough checklists, then walk through dependency and code changes.
  - Preserve the practical pressure in the ending. The point is not framework ideology; it is the cost of changing a real project.
- `docs/最佳实践/手机开启摄像头识别后做出行为/README.md`
  - Use this sample for implementation stories that start from a concrete life scene, break the requirement into steps, show runnable code, then land on the actual effect and an honest final turn.
  - It is strong evidence for section shapes such as `背景`, `需求分析`, `技术要点`, `实现效果`, and `实现总结` when the project itself is the story.
  - Treat the long `实现总结` recap as a negative example. Prefer the fence twist ending over polished system-summary prose.
- `docs/最佳实践/StoryBook开启https/README.md`
  - Use this sample for `省流（TL;DR` first, troubleshooting path, screenshots, and unclosed aside parentheses such as `（服了。。。说改就改`.
  - Strong for workplace constraint writing and ending with a direct complaint about the tool.
- `docs/小程序/小程序监听页面滚动/README.md`
  - Use this sample for compact problem-to-documentation explanations: name the work scenario, simplify the concept in plain language, show the API, then mention alternatives by scene.
  - It is useful when an article should stay close to a knowledge note without becoming an encyclopedia entry.
  - Strong for official quote + plain-language translation.
- `docs/HTTP/长轮询/README.md`
  - Use this sample for dialogue-style analogies that explain a mechanism without sounding like a textbook.
  - Strong for short article mode with a practical landing and a narrow final judgment.
- `docs/Vue/Pug语法/README.md`
  - Use this sample for knowledge-note mode that still keeps a personal opening and a blunt ending complaint.
  - Strong for `无奈`、`谁让公司不用呢` style workplace framing without turning the whole article into a rant.
- `docs/Vue/快速diff算法/README.md`
  - Use this sample for step-driven knowledge notes: numbered phases, diagrams, dense bullets, and minimal personality in the body.
  - Keep the opening and ending calm; do not inflate this shape into a dramatic article.
- `docs/Vue/双端diff算法/README.md`
  - Use this sample for pseudo-code style walkthroughs and flow-driven algorithm notes.
  - Strong when the article is mostly mechanism, comparison, and implementation steps.
- `docs/Vue/vue2.7注意事项/README.md`
  - Use this sample for `问题 / 原因 / 解决` structure, screenshots, code fixes, and `❌` markers for unsupported behavior.
  - Strong for compatibility and migration notes with a clear technical landing.
- `docs/guide/README.md`
  - Reference only for blog self-introduction tone.
  - Do not use it as a template for technical article openings or endings.

## Weighting rules

1. Let these samples decide the article's human feel first: opening pressure, section rhythm, where code appears, how direct the ending is, and how much roughness to preserve.
2. Use `style-profile.md` to generalize across the broader corpus after checking these samples.
3. Use `style-examples.md` as shape help, not as a higher authority than this corpus.
4. For scenario-driven drafts, favor the CSS, camera-recognition, and Storybook samples.
5. For migration, debugging, API-note, or workplace-constraint drafts, favor the Vue downgrade, mini-program scroll, vue2.7, and Storybook samples.
6. For algorithm or syntax notes, favor the diff and Pug samples, but still preserve a human opening or ending when the source supports it.

## Stable signals from this corpus

- The article often begins from a specific reason to write: a colleague's question, a work need, a real constraint, or a small scene.
- Practical structure matters more than polished symmetry. Checklists, short setup paragraphs, code blocks, screenshots, and compact callouts can sit next to each other.
- The author is willing to expose the route to the answer: what was considered, what failed, what document or API changed the direction, and what still has a limitation.
- A technical point can be made in plain language immediately after official wording or a code example.
- Endings should return to the use case, constraint, or result. Keep the lived judgment when the source supports it.
- Personality mainly lives in the opening and ending. The body can stay calm, especially in knowledge-note mode.
