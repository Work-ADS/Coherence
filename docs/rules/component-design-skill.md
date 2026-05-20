# Component design skill — agent rules for the front-half of the component lifecycle

> Consulted BEFORE Figma, BEFORE the build prompt, BEFORE the first line of code.
> Owns the design-side process: "I see a UI need" → "spec is ready for Builder."
> When the build prompt lands, [component-skill.md](./component-skill.md) takes over.

---

## 1. Purpose & scope (LOCKED 2026-05-20)

This skill is the upstream half of the component lifecycle. It covers **how a designer (or an AI co-thinker) decides what becomes a component, what shape it takes, and what it needs before the spec leaves the studio**.

The downstream half — file structure, signal inputs, tokens, motion tiers, a11y — lives in [component-skill.md](./component-skill.md). That document is LOCKED and does not move because a screen is in motion. This one starts upstream and ends at the same handoff line.

### Why this split exists

AI vibe-coding produces whole screens at once. When the model can spit out a 300-line sidebar in 10 seconds, the temptation is to skip atomic-design discipline — and the result is exactly what shows up in our codebase today: planner sidebars that inline 200 lines of markup while `<afi-button>`, `<afi-sidebar>`, `<coherence-logo>` sit unused in `libs/ui/`. The fix is not "more AI" — it's **rails that force the conversation at the component level first, screen level second.**

---

## 2. What this skill is NOT

- **Not coding rules.** All implementation lives in [component-skill.md](./component-skill.md): file shape, signal inputs/outputs, BEM, motion tiers, a11y checklist.
- **Not token rules.** [token-skill.md](./token-skill.md) owns primitive / semantic / brand. [dimension-tokens.md](./dimension-tokens.md) owns the responsive scale.
- **Not a Figma tutorial.** Knowing *how* to build a variant set in Figma is upstream of this skill; Figma fluency is assumed. This skill captures *which* variants belong in Figma at all.

---

## 3. Mental model

**Atomic design at the component level, even when we're not building a full product.** The DS exists to be composed into screens later; if we let AI generate the screens before the primitives are real, we re-inherit the mess we are trying to escape.

**"Micro moments of beauty."** A focus ring that lands in 120ms with the right easing. A loading state that does not shift layout. A disabled button that still communicates *why*. These are not decoration — they are the unit-level UX work that compounds when 30 of them ship inside a single screen.

**AI is a co-thinker, not a one-shot generator.** The five stages below are structured so each stage has a small, recoverable decision. The AI's job is to widen options at each stage; the designer's job is to close them. If the AI is producing whole components in one shot, the process has been skipped.

---

## 4. Stage 1 — Choose the component

### 4.1 Frame the noun

Write one sentence: **"This is a {noun} that {one job}."** If you cannot write that sentence in 12 words, the component is the wrong shape. Pressure-test it:

- *StatusChip — a compact label that communicates a single discrete state.* ✓
- *Sidebar — the persistent left rail that holds primary navigation and account info.* ✓
- *ThingWithStuff — handles a few different cases for users.* ✗ (vague noun, plural job, no constraint)

The noun is role-based, not visual. "DangerButton" is wrong; "Button with `variant='danger'`" is right.

### 4.2 Map the shape

Once the noun is locked, enumerate **variants × sizes × content slots** — the dimensions along which the component varies on purpose.

- **Variants** = intent dimension (`primary`, `secondary`, `ghost`, `danger`). Named for purpose, not color.
- **Sizes** = density dimension (`sm`, `md`, `lg`). Match the existing scale; do not invent `xs` because one screen needs it once.
- **Slots** = content dimension (`iconStart`, `iconEnd`, `default`). Named semantically (`rail`, not `leftThing`).

Canonical example: **icon button** is one noun but two real variants — *plain icon button* and *icon button with dropdown indicator*. Both ship. The dropdown is not a separate component; it is a variant.

### 4.3 Enumerate the states

Every interactive component answers all of these or explicitly opts out with a reason:

| State | Apply? | Notes |
|---|---|---|
| Default | Always | Resting appearance |
| Hover | Most | Skip for non-pointer-only components |
| Focus-visible | Always | 2px ring per [component-skill.md §10](./component-skill.md) |
| Active / pressed | Most | Brief — 80–150ms |
| Disabled | When applicable | Native `disabled` attr where possible |
| Loading | When async | Does not shift layout |
| Error | Form controls | `aria-invalid="true"` + message region |
| Empty | Data display | Do not let the component look broken when empty |

If a state is skipped, write down *why* — that note becomes part of the spec.

### 4.4 Context — what's around it and what's inside it (LOCKED 2026-05-20)

Once the noun, shape, and states are clear, capture three lines of context. This is **not** full information architecture — it is the minimum to stop you from copying a Figma sidebar 1:1 and discovering on integration that your four actions do not match its five nav items.

- **Shell:** where does this component live? *App shell? Modal? Standalone canvas? A data-table cell?*
- **Adjacent components:** what sits next to it? *Names, not diagrams.* "Top bar above, content area to the right, no rail."
- **This instance's specific actions / content:** the verbs and labels THIS use needs. Not "navigation items" — list them: *Inicio, Cartera, Simulaciones, Configuración.* Not "user info" — *avatar + name + role.*

The output is three lines. If filling them takes more than five minutes, the component is too abstract — re-scope.

---

## 5. Stage 2 — Inspiration for visual

Components do not get designed in a blank canvas. Before opening Figma, build a **reference folder** the AI co-thinker (and the human) can look at.

### Screenshot folder convention

- Path: `docs/inspiration/{component-noun}/`
- One subfolder per noun. Drop screenshots in. Filename hints at source (`linear-button-primary.png`, `vercel-toast-success.png`). No magic naming — humans and AI both read filenames.
- Three screenshots is plenty. Six is the cap. More than that and you are researching, not designing.

The folder is referenced by name in the build prompt later. The AI does not crawl Dribbble — it looks at *your* curated examples and reasons from them.

### Memorisely

The Figma side of this process is **Memorisely-style component construction**: variants driven by named properties, every value linked to a token, no raw values in fills/strokes/spacing. If a designer has not worked that way before, the Memorisely course is the standard reference (no link locked here — added when we settle on the canonical lesson).

### Translate, not copy (LOCKED 2026-05-20)

The reference shows you a pattern; the **context from §4.4 is the spec**. If a Figma sidebar has 5 nav items and yours has 4, edit it before the Figma component lands — not after. The inspiration folder is a thinking aid, not a source of truth.

---

## 6. Stage 3 — Use cases for animations

Animation is not a polish stage tacked on at the end. It is a use case that needs to be named at design time.

### When motion happens

- **State transitions** — default → hover, default → loading.
- **Content changes** — a button that turns into a spinner; a chip whose label updates.
- **Entry / exit** — modal opens, toast appears.

For each animated state, write one sentence: *"When {trigger}, {what moves} {how} over {duration}."*

### Sourcing animations

**Check [motion-skill.md](./motion-skill.md) first.** If your animation matches a named pattern in the catalog (`hover-lift`, `focus-ring`, `sidebar-slide`, etc.), use the catalog version — do not re-invent.

If it does NOT match any named pattern, React component libraries are the largest open animation library on the planet. When pulling motion from one (Radix, Headless UI, Aceternity, etc.):

1. Identify the keyframe / transition / easing curve.
2. Translate to the Angular tier per [component-skill.md §11](./component-skill.md). Tier 1 (pure CSS) is the default; only escalate to `@angular/animations` or Motion One when the choreography genuinely needs it.
3. The React source is reference, not a copy-paste pipeline.
4. **If the new motion is likely to recur,** add it to [motion-skill.md](./motion-skill.md) as a named pattern as part of the same PR — that is how the catalog grows.

---

## 7. Stage 4 — Create the Figma component

The Figma component is the *visual spec* the build prompt references.

- **Built with tokens only.** Every fill, stroke, radius, spacing value maps to a published token. If you find yourself reaching for a hex color, stop — define the token first ([token-skill.md](./token-skill.md)).
- **Every state from §4.3 is a Figma variant.** Hover, focus, disabled, loading — all of it. If a state is not in Figma, it does not ship.
- **Naming matches code.** Figma variant names match the TypeScript `*.variants.ts` types — `primary`/`secondary`/`ghost`/`danger` in Figma is `primary`/`secondary`/`ghost`/`danger` in the type.

---

## 8. Dependency check — the gate between Figma and code (LOCKED 2026-05-20)

Before the build prompt is written, walk this list. **A missing primitive blocks the pattern** — file the gap and resolve it before the build prompt leaves the studio.

| Check | If missing |
|---|---|
| Every token used in Figma exists in `libs/tokens/` | File a token brief; resolve before continuing |
| Every primitive composed inside this component exists in `libs/ui/` | File a primitive brief; resolve before continuing |
| Every icon used exists in the icon set | Source the icon; if licensed, document the source |
| Every state from §4.3 has a Figma frame | Build the missing frame |
| Copy passes [copy-skill.md](./copy-skill.md) | Edit the copy |
| A11y intent is named (role, name, keyboard pattern) | Specify it before code starts |

Output of this gate is a list of zero unresolved items, OR a list of resolved gaps with links to the briefs that closed them. **There is no "we'll fix it in code" option.**

---

## 9. Stage 5 — Handoff to code

When the dependency check passes, write the build prompt and hand it to Builder. **From here, [component-skill.md](./component-skill.md) owns the build.** This skill stops at the handoff line.

---

## 10. Spec checklist — the artifact handoff receives

The build prompt must include or reference:

- **Noun + one-sentence job** (§4.1)
- **Variants × sizes × slots** (§4.2)
- **State table** — which states apply, which opt out, and why (§4.3)
- **Figma frame link** (§7) — direct URL to the variant set
- **Animation table** — one row per animated state (§6)
- **Dependency check output** (§8) — zero open items
- **Copy** — RAE Spanish, glossary-verified ([copy-skill.md](./copy-skill.md))
- **A11y intent** — role, name, keyboard pattern, focus order

Inline-in-the-build-prompt for v1. If this template stabilizes, extract to `docs/workflow/component-spec-template.md` later.

---

## 11. Open questions / parked

- **Spec-checklist artifact** — kept inline (§10) for v1; extract to its own template when shape stabilizes.
- **Memorisely canonical reference** — add when we settle on the specific course / lesson.
- **First proving ground** — side-panel components. That work lands in its own next branch; if this process breaks down when applied to the side panel, fixes come back into this skill.
- **Atomic-design vocabulary** — should "primitive / pattern / shell" be standardized as the Coherence atomic layers? Parked until a case where the vocabulary causes confusion.

---

## 12. Changelog

- **2026-05-20** — V1 LOCKED. Five-stage spine from the FigJam V1 board. Dependency check promoted to its own H2 between stages 4 and 5. State enumeration explicit in stage 1. Atomic-design framing, "micro moments of beauty", and AI-as-co-thinker pattern named in §3.
