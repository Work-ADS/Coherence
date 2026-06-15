# Design — Coherence

> The entry-point overview for AFI's Coherence design system.
> What Coherence is, what it looks and sounds like, and where the rules for each surface live.
> This file is the map. The deep rules live in the skills linked from each section — never duplicate them here.

---

## 1. What Coherence is

Coherence is the design system AFI ships to its consultancy and product teams. It is white-labelable from day one (brand soul defaults to AFI; brand manifests swap accent, fonts, and a small set of semantic slots without touching component code). The deliverable is three things at once: tokens consumed by code, primitives consumed by builders, and skill files consumed by both humans and agents.

---

## 2. Why Coherence exists

Pulled from [docs/strategy/plan.md](docs/strategy/plan.md) — the systemic pains we exist to fix:

- Variables get mistaken in design→dev handoff.
- Weak communication between designer and developers.
- Solo-designer bottleneck — knowledge decays, nothing gets documented.
- Rushed projects with no accountability.
- **The systemic killer:** devs don't consume the current handoff at all — not Figma, not DevMode, not components, not written docs.

Coherence is designed so a builder doesn't *need* to ask: the primitive enforces the rule, the skill explains the rule, the site renders the rule. One source, three readers.

---

## 3. North star (LOCKED 2026-04-16)

> A design system developers actually use — because it's built for how *they* consume information, not how designers wish they would.

The longer-form articulation lives in [docs/strategy/manifesto.md](docs/strategy/manifesto.md). Use that as the source for outward-facing language; this line is the operational compass.

---

## 4. Brand soul

> **Innovative but classy. Modern but educated.**

A modern AI tool with a traditional typographic foundation — tool-precise but typographically grounded. Editorial register: **New Yorker / Monocle / Kinfolk applied to software.** Confidence through typography and rhythm, not SaaS flash.

**Tiebreaker.** When a visual decision is ambiguous, ask: *"What would a monthly magazine do?"* Typography-first, color-sparingly, horizontal-rules-over-boxes, weight-and-tracking-over-size. This bias applies universally except where finance-specific density (dense tables, scanning-heavy admin) overrides it — there, Notion / Stripe pragmatism wins.

| Layer | Source | Role |
|---|---|---|
| Structure / density | Figma | Compact, spatially disciplined. |
| Typography / soul | Granola | Roboto Serif only — single family across the entire hierarchy. |
| Color | Wise | Monochromatic neutral base + strategic accents. Few shades per brand. |
| Information architecture | Linear | Clean IA mechanics. |
| Motion | — | Smooth subtle microanimations. Container-first. |
| Framework | — | Angular (hard constraint). |

Source-of-truth: [docs/strategy/plan.md § Visual identity](docs/strategy/plan.md) and [docs/strategy/manifesto.md](docs/strategy/manifesto.md).

---

## 5. Principles

Six craft rules that show up across every skill and every primitive. Each is a one-liner here; the deep version lives in the linked skill.

- **Build once, variants for the rest** — one file per primitive, variants via signals + class binding. No duplicate component files. See [docs/rules/component-skill.md § Core principle](docs/rules/component-skill.md).
- **Single-writer / dual-reader** — the MD skill files are the source of truth. The site renders from them, agents read them, builders cite them. One edit propagates. See [docs/strategy/plan.md § Single-writer / dual-reader rule](docs/strategy/plan.md).
- **Reuse before building** — before writing new UI, search `libs/ui/src/` and the shared chrome. If a primitive exists, use it; if it falls short, document the gap before rolling your own. Locked in [AGENTS.md § Reuse before building](AGENTS.md).
- **Container-first motion** — animate the object, not its contents. Fewest properties (transform + opacity by default). Match duration to weight. Respect reduced-motion as respect, not disable. See [docs/rules/motion-skill.md](docs/rules/motion-skill.md).
- **Persistent alignment is the anchor** — the resting label/title is the alignment source of truth. Hover/expanded containers grow around the anchor; they don't redefine it. Locked in [AGENTS.md § Persistent label alignment](AGENTS.md); generalized for pages in [docs/rules/page-structure-skill.md § 13](docs/rules/page-structure-skill.md).
- **Container queries over `@media` for layout** — pages and components respond to their rendered area, not the window. See [docs/rules/page-structure-skill.md § 11](docs/rules/page-structure-skill.md).
- **Destructive actions confirm** — every delete / archive / discard requires an explicit `<afi-modal size="sm">` confirmation with a danger-variant primary button, the consequence stated in one sentence (`Esta acción no se puede deshacer.`), and the safe default (Cancelar) holding focus. No silent deletes, no `window.confirm()`. See [docs/rules/destructive-actions.md](docs/rules/destructive-actions.md).

---

## 6. Foundations

Brief intros only — the rules live in the linked skill.

### 6.1 Color

Three-layer token architecture (Primitive → Semantic → Brand). Six semantic buckets: Canvas, Surface, Action, Control-neutral, System, Data-viz. The Action slot is the primary brand-swappable color; everything else inherits the default manifest unless a brand overrides it. AFI is the only brand where action/CTA resolves to brand-*secondary* — every other brand uses primary.

→ [docs/rules/token-skill.md](docs/rules/token-skill.md) for the layering, naming, and the six-bucket rule.

### 6.2 Typography

**Roboto Serif only — single family across the entire hierarchy** (display, body, buttons, inputs, labels, data, tables). Hierarchy is delivered entirely through weight + size + letter-spacing + tabular figures — never through a second family. This is the editorial-software register (Medium pre-redesign / NYT web / Bloomberg Terminal / Stripe long-form docs), not the SaaS default (display-serif + body-sans). Distinctive, harder to execute, stronger signal.

→ [docs/rules/token-skill.md](docs/rules/token-skill.md) for type-scale tokens.

### 6.3 Spacing

Base-4 scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. No odd pixel values. No spacing-by-feel. The scale is the scale.

→ [docs/rules/token-skill.md § Base-4 spacing scale](docs/rules/token-skill.md).

### 6.4 Motion

Three durations (`--duration-fast` 150ms, `--duration-base` 200ms, `--duration-slow` 300ms) paired with three easings (`--easing-standard`, `--easing-enter`, `--easing-exit`). Six named patterns: `hover-tint`, `opacity-fade`, `focus-ring`, `slide-fade-enter`, `panel-slide`, `reduced-motion-collapse`. Brand swaps inherit motion automatically.

→ [docs/rules/motion-skill.md](docs/rules/motion-skill.md) for the catalog + reduced-motion rule.

### 6.5 Iconography

Monoline icons sourced from a single set; no decorative variants. (Specific set + sizing tokens are settled inside the component skills that use icons; not duplicated here.)

---

## 7. Components

V1 ships ~10 core primitives that compose every shipping flow: Button, Input, Select, Checkbox, Switch, Card, Modal, Drawer, Table, Tabs — plus the composers (Shell, Sidebar, Page-header, Status-chip, Empty-state, etc.) needed to assemble the Wealth Planner reference flow.

Every primitive answers to two skills:

- **Build:** [docs/rules/component-skill.md](docs/rules/component-skill.md) — Angular structure (standalone, OnPush, signals), the 3-file convention, BEM + CSS custom properties, the persistent-trigger alignment rule, the dimension-token rule.
- **Design:** [docs/rules/component-design-skill.md](docs/rules/component-design-skill.md) — the design-side process upstream of build (choose component, variants, states, context, handoff).

Browse the live primitives at `/componentes` and the composed patterns at `/patrones`.

---

## 8. Page layout & responsive

Every page in the system is the same shape: a shared content wrapper hosting `<afi-page-header level="page">` (title + slotted actions + optional cards / tabs / filters) above a body — 1-section, multi-section, or empty state.

Responsive decisions use `@container viewport` queries on the page wrapper. Canonical breakpoints: `40rem` (page wrapper padding), `48rem` (multi-column collapse, sidebar→drawer), `64rem` (3-up grid intermediate). `@media` is banned for layout; reserved for `prefers-reduced-motion`, `prefers-color-scheme`, `print`.

→ [docs/rules/page-structure-skill.md](docs/rules/page-structure-skill.md) for the full anatomy, the single-shared-wrapper rule, the title/body inline-padding parity rule, empty-state composition, and the known-violations migration backlog.

---

## 9. Voice & copy

Spanish-first, RAE conventions. Afi house style: claridad, intencionalidad, eficiencia, orientación al destinatario, primera persona del plural. Editorial register over SaaS marketing. Declarative over interrogative ("Aún no hay sociedades registradas." not "¿Sin sociedades?").

→ [docs/rules/copy-skill.md](docs/rules/copy-skill.md) for tone, register, and per-surface conventions.

---

## 10. Accessibility

WCAG 2.2 AA is the baseline, not the ceiling. Touch targets, focus rings, keyboard reach, ARIA labelling — every primitive has its own checklist; the cross-cutting rules live in the skill.

→ [docs/rules/accessibility.md](docs/rules/accessibility.md) for the baseline + per-primitive checklists.

---

## 11. Where things live

The map. Update when a new skill or surface lands.

| Surface | File | Owns |
|---|---|---|
| Entry-point overview | `Design.md` (this file) | Principles, brand, foundations index — never the rules themselves. |
| Page composition | [docs/rules/page-structure-skill.md](docs/rules/page-structure-skill.md) | Anatomy, sections, wrapper, slot placement, responsive baseline, empty state. |
| Tokens | [docs/rules/token-skill.md](docs/rules/token-skill.md) | Three-layer architecture, six semantic buckets, base-4 scale, brand manifest. |
| Component build | [docs/rules/component-skill.md](docs/rules/component-skill.md) | Standalone + OnPush + signals, 3-file convention, BEM, styling rules. |
| Component design | [docs/rules/component-design-skill.md](docs/rules/component-design-skill.md) | Upstream of build — choose, variant, state, context, handoff. |
| Motion | [docs/rules/motion-skill.md](docs/rules/motion-skill.md) | Duration / easing tokens, six named patterns, reduced motion. |
| Accessibility | [docs/rules/accessibility.md](docs/rules/accessibility.md) | WCAG 2.2 AA baseline, per-primitive checklists. |
| Copy / voice | [docs/rules/copy-skill.md](docs/rules/copy-skill.md) | Spanish, RAE, Afi register. |
| Clean code | [docs/rules/clean-code.md](docs/rules/clean-code.md) | Pre-commit hook constraints, no-`any`, no-`@ts-ignore`, token-only styling. |
| Strategy / roadmap | [docs/strategy/plan.md](docs/strategy/plan.md) | V1 scope, roadmap, build sequence, session locks. |
| Manifesto | [docs/strategy/manifesto.md](docs/strategy/manifesto.md) | Brand soul and case-study language. |
| Planner agent | [docs/agents/planner.md](docs/agents/planner.md) | Session harness over the brief template. |
| Builder agent | [docs/agents/builder.md](docs/agents/builder.md) | Implementation harness; invoked after scope is locked. |
| Tester agent | [docs/agents/tester.md](docs/agents/tester.md) | Verifies against the brief + pre-flight + skills. |
| Token Guardian agent | [docs/agents/ds-token-guardian.md](docs/agents/ds-token-guardian.md) | Reviews token additions / references. |
| Session briefs | [docs/session-briefs/](docs/session-briefs/) | Dated, immutable per-chunk briefs. New work gets a new file. |

---

## 12. Changelog

- **2026-06-15** — Created as the traditional design overview. Replaces the earlier draft (which scoped only to page composition and has been moved to [docs/rules/page-structure-skill.md](docs/rules/page-structure-skill.md)). Wired into [AGENTS.md](AGENTS.md) as the entry-point read.
