# Priority Samples

The user explicitly marked these local articles as nearly fully hand-written and strong evidence of personal voice. Read them before generalized examples when a task needs close voice calibration.

Use these samples as evidence, not copy targets. Do not lift passages at length or invent personal stories just to match them.

## High-weight corpus

- `docs/最佳实践/纯CSS实现文字环绕/README.md`
  - The first 12 lines are especially high-signal: a remembered question, a delayed answer, and a fast turn into the implementation.
  - Use this sample for short scene hooks, `省流`-style code-first delivery, and a path that moves from a discovered API or document back to the original problem.
- `docs/最佳实践/实践-vue3项目降级vue2/README.md`
  - Use this sample for engineering tradeoff writing: state the environment, list real constraints, rule out options, then walk through dependency and code changes.
  - Preserve the practical pressure in the ending. The point is not framework ideology; it is the cost of changing a real project.
- `docs/最佳实践/手机开启摄像头识别后做出行为/README.md`
  - Use this sample for implementation stories that start from a concrete life scene, break the requirement into steps, show runnable code, then land on the actual effect and an honest final turn.
  - It is strong evidence for section shapes such as `背景`, `需求分析`, `技术要点`, `实现效果`, and `实现总结` when the project itself is the story.
- `docs/小程序/小程序监听页面滚动/README.md`
  - Use this sample for compact problem-to-documentation explanations: name the work scenario, simplify the concept in plain language, show the API, then mention alternatives by scene.
  - It is useful when an article should stay close to a knowledge note without becoming an encyclopedia entry.

## Weighting rules

1. Let these samples decide the article's human feel first: opening pressure, section rhythm, where code appears, how direct the ending is, and how much roughness to preserve.
2. Use `style-profile.md` to generalize across the broader corpus after checking these samples.
3. Use `style-examples.md` as shape help, not as a higher authority than this corpus.
4. For scenario-driven drafts, favor the CSS and camera-recognition samples.
5. For migration, debugging, API-note, or workplace-constraint drafts, favor the Vue downgrade and mini-program scroll samples.

## Stable signals from this corpus

- The article often begins from a specific reason to write: a colleague's question, a work need, a real constraint, or a small scene.
- Practical structure matters more than polished symmetry. Checklists, short setup paragraphs, code blocks, screenshots, and compact callouts can sit next to each other.
- The author is willing to expose the route to the answer: what was considered, what failed, what document or API changed the direction, and what still has a limitation.
- A technical point can be made in plain language immediately after official wording or a code example.
- Endings should return to the use case, constraint, or result. Keep the lived judgment when the source supports it.
