# Blog post template — propuesta-framed release

> Every Coherence blog post is a release narrative written **at ship time**, not after. It articulates what we were thinking when we built it — the propuesta — while the thinking is still fresh.
>
> Consumed by `docs/agents/case-study.md` in `mode: release`. Rendered at `/blog/{slug}` on the Coherence site.

---

## Frontmatter (YAML)

```yaml
---
title: "{Release or feature name}"
slug: "{kebab-case-slug}"
date: "{YYYY-MM-DD}"            # ship date
author: "{Name or 'AFI design team'}"
release: "{optional — version tag or milestone label}"
summary: "{One sentence, < 140 chars — used as meta description and teaser card}"
tags:                             # free-form but keep short; at least one
  - {primitivos|shells|tokens|motion|flujos|infraestructura|proceso}
---
```

---

## Body structure

### 1. One-sentence lead

Opens the post. Italicized blockquote. Says what shipped in plain language. No adjectives.

```
> {What just shipped. One sentence. Present tense.}
```

### 2. La propuesta

Three questions, verbatim. Every post answers all three.

```markdown
## La propuesta

### ¿Cuál es el objetivo?

{2–4 sentences. The outcome the user should walk away with — NOT the
feature description. If the objective is "ship a better button," the
post isn't done; dig until the objective is an outcome like "every
product in AFI uses the same click target so asesores stop second-
guessing which action is primary."}

### ¿Cómo cambia la vida del usuario?

{2–4 sentences. The before → after transformation. Specific. Name the
user, the context, the old friction, the new path. "An asesor used to
reopen three tabs to check a proposal's restrictions; now they stay
on the ajuste page." Not "improves workflow efficiency."}

### ¿En qué momento lo abren?

{2–4 sentences. The anchor moment in the user's day. Tuesday 9:15 a.m.,
coffee still hot, client on the phone. Monday morning portfolio review.
Thursday night reconciliation. The moment tells you the emotional stakes
and the acceptable friction budget. Grounds the feature in real time,
real place, real mood.}
```

### 3. Qué se envió

```markdown
## Qué se envió

{2–4 paragraphs. Concrete: what's now in the product. One screenshot
or short GIF if it helps — not decorative. Link out to the primitive
or pattern detail pages on the Coherence site. Link out to the build
prompt for engineers. Do not summarize the build prompt — the link
IS the summary.}
```

### 4. Cómo lo decidimos

```markdown
## Cómo lo decidimos

{1–3 paragraphs. The trade-off that mattered. Usually the most interesting
section — the alternative we didn't take and why. Examples:

- "We considered a global top-strip mode switcher. AFI doesn't have a
  product-wide lens; propuesta state is page-scoped. Pure C won."
- "Cards could have shipped with shadow. The docs register reads flat,
  so we used hairline dividers. Business-app surfaces keep the elevation."

Name the alternative. Name the signal that decided it. No 'best practice'
hand-waving.}
```

### 5. Qué sigue

```markdown
## Qué sigue

{1 paragraph. The next related work, or what opens up because of this.
Keep it short. Not a roadmap — a direction.}
```

### 6. Closing note (constant across every post)

```markdown
---

*Este artículo se escribió al momento del envío. No es una descripción
retrospectiva — es la propuesta que se estaba articulando cuando se
construyó.*
```

---

## Length target

- **600–1200 words** total, excluding frontmatter and code blocks.
- **Hard cap: 1500.** Longer than that and it becomes a manifesto essay, which is a different artifact.
- Propuesta section is usually 250–400 words on its own (three questions × 2–4 sentences each).

---

## Voice

Operator. Present tense. Concrete nouns. Active verbs. No emoji. No exclamation points. No marketing adjectives (*innovative*, *robust*, *seamless*, *cutting-edge*). Register matches `docs/manifesto.md`.

A reader who doesn't work at AFI should finish the piece knowing:
1. What was built.
2. Who it's for and when they'll use it.
3. Why it was built this way and not another.

Without feeling sold to.

---

## What this template is NOT

- **Not a retrospective case study.** Retrospectives mine PRs, logs, and iteration screenshots weeks or months after ship — different artifact, produced by `case-study` agent in `mode: retrospective`, filed at `/case-studies/{slug}`.
- **Not a release-note changelog.** Changelog is terse and mechanical (`docs/recursos/changelog.md` — title + date + links). The blog post is the narrative companion.
- **Not a marketing launch post.** No landing-page rhetoric. This is operator-to-operator communication.

---

## Cadence

One post per meaningful release. Not one per primitive (17 nearly-identical posts is noise). Examples of "meaningful release":

- A wave of work (`"Fundamentos live"`, `"Primitivos v1 shipped"`, `"Shells live"`).
- A composed-flow proof (`"Diagnóstico rebuilt on Coherence"`).
- A proven pattern (`"How we shipped brand-swap without touching a line of product code"`).
- A meta-decision (`"Why Coherence is Pure C"`).

Rule of thumb: if the propuesta section would be the same as the last post, combine them.

---

## Example skeleton (for reference — do not reuse literally)

```markdown
---
title: "Shells: una palabra, cinco layouts"
slug: "shells-cinco-layouts"
date: "2026-05-03"
author: "AFI design team"
release: "v1 step 19"
summary: "Coherence ships con cinco tipos de shell: Workspace, Focus, Canvas, Auth, Docs."
tags: [shells, primitivos]
---

> Coherence ships con cinco tipos de shell. Cada producto elige uno por ruta; el resto queda en contrato documentado.

## La propuesta

### ¿Cuál es el objetivo?

Que cada nuevo producto de AFI — y cada nueva marca en white-label — reciba su layout resuelto en una línea de ruta, sin re-inventar la composición app-shell / sidebar / page-header / contenido / rail.

### ¿Cómo cambia la vida del usuario?

[…]

### ¿En qué momento lo abren?

[…]

## Qué se envió

[…]

## Cómo lo decidimos

[…]

## Qué sigue

[…]

---

*Este artículo se escribió al momento del envío. No es una descripción retrospectiva — es la propuesta que se estaba articulando cuando se construyó.*
```
