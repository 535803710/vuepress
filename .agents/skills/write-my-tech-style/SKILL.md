---
name: write-my-tech-style
description: Draft and rewrite Chinese technical long-form articles in the author's personal frontend writing style with strong de-AI editing. Use when Codex needs to create a technical article from a topic, notes, outline, or research material; rewrite an existing technical draft to sound like the author; propose or revise article titles in that voice; or reduce template-like AI tone while preserving concrete technical claims.
---

# Write My Tech Style

Write technical articles in the author's frontend-blog voice. Favor a concrete problem, a direct explanation path, short question-led turns, examples, code, and visible personal judgment over balanced generic exposition.

Read [references/style-profile.md](references/style-profile.md) before writing. Read [references/priority-samples.md](references/priority-samples.md) before using generalized style examples; these are the user's highest-weight local samples for calibrating voice. Read [references/style-examples.md](references/style-examples.md) when shaping titles, openings, transitions, explanation blocks, or endings.

## Workflow

1. Classify the task as `draft`, `rewrite`, or `title`.
2. Collect the source material that constrains the technical content.
   - Use the user's notes, outline, code, links, or draft first.
   - Keep technical claims inside the supplied or verified material.
   - Leave a short TODO or ask for the missing fact when an invented detail would change the article.
3. Load the style profile, priority samples, and examples in that order.
4. Shape the article around one concrete reader problem.
5. Write in the author's voice, then run the de-AI pass in the style profile.
6. Return the deliverable first. Add brief unresolved-fact notes only when they matter.

## Draft

When drafting from a topic, outline, or notes:

1. Pick the article promise: what problem the reader will understand or solve after reading.
2. Propose a title if the user did not provide one. Prefer a title with a hook, judgment, scene, or explicit technique instead of a neutral handbook title.
3. Open from the real problem, a quick background scene, or a direct question.
4. Move from plain-language explanation to technical detail.
   - Use short sections.
   - Explain the reason for a mechanism before dumping a definition table.
   - Use bullets, steps, code, and examples when they make the topic easier to execute.
5. End by bringing the article back to the actual use case or practical takeaway. Avoid a generic "in summary" paragraph.

## Rewrite

When rewriting an existing draft:

1. Preserve the author's technical intent, code, facts, and useful roughness.
2. Remove AI-shaped filler:
   - ceremonial openings
   - over-complete transitions
   - evenly sized paragraphs with the same cadence
   - safe but empty conclusions
   - stacked labels such as "firstly", "secondly", "finally" when the article can move more naturally
3. Rebuild the title and opening when they are the main source of template tone.
4. Add personal pressure only where the source supports it: a real objection, a quick analogy, a direct question, a strong takeaway, or a "why this matters" sentence.
5. Keep the rewrite readable. Do not add slang, emojis, jokes, or forceful titles mechanically.

## Title Work

For title-only tasks, return a small set of options grouped by intent when helpful:

- `strong hook`: more personal and clickable
- `problem first`: names the pain point or scenario
- `technique first`: names the implementation or concept clearly

Keep titles technically honest. Do not turn a narrow note into a grand promise.

## Output Checks

Before returning an article or rewrite, check:

- Does the title sound chosen by a writer, not generated from a keyword list?
- Does the opening reach the problem quickly?
- Does the article explain through examples, steps, or code where the topic needs them?
- Do section sizes and sentence rhythm vary?
- Did the rewrite remove generic AI filler without inventing technical claims?
- Does the ending land on a practical point instead of a padded recap?
