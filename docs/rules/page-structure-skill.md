# Page structure skill — page-level composition rules

> Consulted BEFORE any work that adds, edits, or reviews a page.
> Every page under `apps/site/src/app/pages/demos/` and `apps/site/src/app/pages/patrones/` answers to this document.
> Companion skills are primitive-altitude (component, token, motion, a11y, copy). This skill is the altitude above them: anatomy, sectioning, responsive baseline, the shared content wrapper.
> If this skill conflicts with another skill on slot placement or page-level composition, this skill wins.
> The entry-point overview (principles, brand, foundations index) lives in [Design.md](../../Design.md) at the repo root.

---

## 1. Purpose & scope (LOCKED 2026-06-15)

Pages keep diverging despite the primitives doing their job. The recurring failures are not primitive bugs — they are composition bugs: title not aligned with the content underneath, page actions floated next to the header instead of inside it, sidebar drawer "hanging out" at 375px because the page uses `@media` instead of `@container`, sections wrapped in bespoke `.pf-section` divs because nobody wrote down which container to use.

This skill names the rules that prevent those bugs:

- The single shared content wrapper.
- Where page-level actions go.
- When a section needs a container (and when it doesn't).
- The responsive baseline (`@container viewport`, not `@media`).
- The token rhythm between sections.
- The empty-state shape when a body has no rows yet.

If a page follows these rules, the title aligns, actions sit in the right place, and the 375px preview behaves the same as production.

---

## 2. What this skill is NOT

- **Not the tokens themselves.** Token taxonomy lives in [token-skill.md](token-skill.md). This skill names the tokens it depends on; it does not redefine them.
- **Not Angular structure.** OnPush, signals, the 3-file convention, BEM, `templateUrl` rules — [component-skill.md](component-skill.md).
- **Not a11y.** Focus rings, keyboard, ARIA — [accessibility.md](accessibility.md).
- **Not motion.** Durations, easings, named patterns — [motion-skill.md](motion-skill.md).
- **Not copy.** Voice, tone, register — [copy-skill.md](copy-skill.md).
- **Not a primitive spec.** The `<afi-page-header>` API lives in [libs/ui/src/page-header/](../../libs/ui/src/page-header/). This skill governs the *use of* the primitive, not its internals.
- **Not a grid framework.** Form layout, table internals, chart composition — those have their own pattern docs.

---

## 3. Page anatomy (LOCKED 2026-06-15)

Every page is the same stack, from top to bottom:

```
[ outer shell — site-demo-shell or site-objetivos-page-shell ]
  [ planner-top-bar (when present) ]
  [ planner-sidebar (when present) ]
  [ shared content wrapper ]               ← §4 rule
    [ <afi-page-header level="page"> ]
      [ title + subtitle ]
      [ slot="actions" — right of title ]  ← §5 rule
      [ slot="cards"   ]                   ← §8 rule
      [ slot="tabs"    ]
      [ slot="filters" + slot="filterActions" ]  ← §9 rule
    [ body — 1-section, multi-section, or empty state ]  ← §6, §7, §10 rules
```

Slot stacking order inside `<afi-page-header>` is **cards → tabs → filters → body**, locked by Richard in [page-header.component.html:84](../../libs/ui/src/page-header/page-header.component.html:84). Don't fight it.

| Level | Heading | Box chrome | Padding | When |
|---|---|---|---|---|
| `level="page"` | `<h1>` | none | 0 | Top of the page; sticky-capable; one per page. |
| `level="section"` | `<h2>` | outline box, `--section-radius` (12px) | `--space-lg` (16px) | A sibling block on a multi-section page that owns its own actions/cards/filters. |
| `level="subsection"` | `<h3>` | outline box | `--space-lg` (16px) | A logical group inside a section that owns its own actions or is collapsible. |

Density and slot APIs are documented in the primitive itself; this skill governs the *which level, and when*.

---

## 4. The single shared content wrapper (LOCKED 2026-06-15)

Two rules work together:

### 4a. One wrapper, header + body together

**The content-width constraint wraps both the `<afi-page-header>` and the body. Never wrap the page-header alone.** Wrapping only the header puts the title in a different positioning context from the body and the left edge drifts.

Canonical pattern, mirroring [patrimonial-proposal.page.scss:34-50](../../apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.scss:34):

```scss
.page__wrap {
  max-inline-size: var(--content-xl);   // 1140px
  margin-inline: auto;
  padding-block: var(--space-xl);

  @container viewport (max-width: 40rem) {
    padding-block: var(--space-md);
    padding-inline: var(--space-md);
  }
}
```

Use `--content-xl` (1140px) for product pages, `--content-lg` (960px) for reading-dense pages, `--content-md` (100%) for full-bleed surfaces. Don't reach for raw `max-w-[1180px]` Tailwind values — that 1180px is not a token, it's a 40px drift from `--content-xl` that nobody planned.

### 4b. Title + body inline-padding parity (LOCKED)

**The body's first content column must sit at the same x as the title's left edge.**

The mechanic: at `level="page"` the page-header host carries `padding-inline: var(--space-lg)` (16px — see [page-header.component.scss:42](../../libs/ui/src/page-header/page-header.component.scss:42)). The title is inset 16px from the host's left edge. The body underneath must match that inset, or the title drifts right of the body content.

Two valid shapes:

**Shape A — body projected as default content (preferred when `[sticky]="false"`):**

```html
<div class="page__wrap">
  <afi-page-header title="Sociedades" subtitle="…" [sticky]="false">
    <afi-button slot="actions" …>+ Añadir sociedad</afi-button>
    <!-- body lives HERE — inherits the 16px inline padding -->
    <afi-table [columns]="cols" [rows]="rows()" />
  </afi-page-header>
</div>
```

**Shape B — body as sibling (only when the page-header must stick and the body scrolls independently):**

```html
<div class="page__wrap">
  <afi-page-header title="…" [sticky]="true">…</afi-page-header>
  <div class="page__body">
    <afi-table … />
  </div>
</div>
```

```scss
.page__body { padding-inline: var(--space-lg); }  // matches the host's inline pad
```

Shape A is the default. Shape B only when sticky behaviour requires it — and the matching `padding-inline: var(--space-lg)` is mandatory, not optional.

**What this rule catches.** [sociedades.page.html:19-49](../../apps/site/src/app/pages/demos/sociedades/sociedades.page.html:19) wraps the page-header in `<div class="relative">` and then renders the table in a sibling `<div class="mt-space-6">` outside the page-header. The table skips the 16px inline padding while the title carries it, so the title sits 16px to the right of "Nombre" / "Inversiones Siglo XXI, SL". Fix: drop the table into the page-header's default slot (Shape A), and remove the absolute-positioned version toggle by projecting it into `[slot="actions"]` per §5.

---

## 5. Page-level actions placement (LOCKED 2026-06-15)

**All page-level actions are projected into `<afi-page-header level="page">` via `slot="actions"`. Never below the title, never in a sibling `<div>`, never `position: absolute`.**

```html
<afi-page-header title="Sociedades" subtitle="…">
  <site-version-toggle slot="actions" … />
  <afi-button slot="actions" variant="primary" size="sm" (clicked)="openAdd()">
    + Añadir sociedad
  </afi-button>
</afi-page-header>
```

Multiple action elements all go in `slot="actions"`. The primitive warns in dev mode when more than `maxInlineActions` (default 3) are projected — wrap overflow into an `afi-menu` instead of stacking. See [page-header.component.ts:149](../../libs/ui/src/page-header/page-header.component.ts:149).

A `slot="primaryAction"` exists for the rare case where one CTA must visually outrank the rest; it renders alongside `slot="actions"` and counts toward the same overflow rule.

**What this rule catches:**

- Sociedades' version toggle floated with `position: absolute` over the header.
- Protección familiar's establish switch dropped in a sibling `<section class="pf-gate">` below the page-header. The switch is a page-level action — it belongs in the slot.

---

## 6. 1-section vs multi-section pages (LOCKED 2026-06-15)

| Shape | Wrapping | Example |
|---|---|---|
| **1-section** — title + a single body surface (table, form, empty state) | No section container. Title sits directly above the body, separated by `--section-gap` (24px). | Sociedades (title → table). |
| **Multi-section** — two or more independent surfaces, each with its own actions/cards/filters | Each section wrapped in `<afi-page-header level="section">`. Siblings separated by `--section-gap` (24px) by default. | Patrimonial (filters + table + drag-to-reorder). |

**Trigger question.** When you reach for a section container, ask: *does this surface need its own actions, cards, or filters?* If no, the surface is body content — no container. If yes, `level="section"` is right.

A single-section page with no body actions and no body cards never needs a section container. Wrapping it adds visual noise (an outline box) without earning it.

---

## 7. Section vs subsection containers (LOCKED 2026-06-15)

`level="subsection"` is for logical groups *inside* a `level="section"` body when one of three things is true:

1. The group owns its own actions, cards, or filters (e.g. `Cónyuge` form group with its own header-actions row).
2. The group needs to be collapsible (`collapsible` input on the primitive).
3. The group is visually distinct from its siblings and benefits from the outline box.

If none of those hold, the content stays inline in the parent section's body. Don't reach for a subsection container just to introduce a heading — use the body's own typography.

Inside dialogs, `level="subsection" borderless` removes the outline since the surrounding modal panel already defines the visual boundary. Patrimonial's add-modal is the canonical example.

**Banned: bespoke section divs.** `<section class="pf-section">`, `<section class="pf-gate">` and other hand-rolled divs styled to mimic a section — all banned. If you reach for one, the primitive you're avoiding is `<afi-page-header level="section">` or `<afi-section>`. Use it, or document the gap in a session brief before rolling your own. (Note: `.{prefix}-empty` divs are not section masquerades — they are the placeholder for the missing `<afi-empty-state>` primitive. See §10.)

---

## 8. Cards row (LOCKED 2026-06-15)

Page-level summary / KPI cards go in `[slot="cards"]` of the page-header. The slot renders above filters and above the body (the locked order, §3).

Layout uses a container-query-driven grid. The canonical pattern, from [patrimonial-proposal.page.scss:18-32](../../apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.scss:18):

```scss
.kpi-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--gap-card-to-card);
}

@container viewport (min-width: 48rem) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Adjacent metric cards use `--gap-card-to-card` (8px), not `--space-*` raw. Single-column under 48rem; 3-up above. If you need 4-up, justify it in the brief — the row composition rule lives at `/patrones/tarjetas/metrica`.

---

## 9. Filters row (LOCKED 2026-06-15)

Controls go in `[slot="filters"]`. Bulk affordances that only appear when selection is non-empty go in `[slot="filterActions"]`. The primitive renders them on the same row, controls left, actions right.

Filters never live in a sibling `<div>` above or below the page-header — that breaks the locked slot order and decouples the filter from the surface it scopes. If a page has filters that scope multiple sections at once, lift them to the page-level header; if each section has its own filters, project them into that section's `level="section"` header.

---

## 10. Empty state (LOCKED 2026-06-15)

When a 1-section page (§6) has no rows yet — no sociedades registered, no inversiones futuras planned, no planificaciones in the list — the body becomes an empty state. The empty state lives in the same place the populated body would: inside the page-header's default content slot (Shape A in §4b) so it inherits the same `--space-lg` inline padding and aligns with the title.

### Anatomy

| Element | Tag | Typography | Content rule |
|---|---|---|---|
| `__title` | `<h2>` | `--type-section` (or `--type-body-lg-500` for compact density) | Declarative, not interrogative. "Aún no hay X registradas." Not "¿Sin X?" — that puts the question on the user. |
| `__hint` | `<p>` | `--type-body` (color `--foreground-secondary-default`) | One sentence explaining when this surface applies. When the surface is optional, include the opt-out: "Es opcional — déjalo en blanco si no aplica." |
| `__action` | `<afi-button variant="primary" size="md">` | — | Verb + noun: "+ Añadir sociedad", not "Empezar". The label matches the page-header's `[slot="actions"]` button if there is one. |

Centered column, body-text max-width ~`var(--content-md)` reading width (~520px), base-4 vertical rhythm between the three elements (`--space-sm` title→hint, `--space-md` hint→action).

### Primitive

`<afi-empty-state>` does not exist yet. Three pages have converged on the same `.{prefix}-empty` / `__title` / `__hint` / `__action` BEM shape:

- [sociedades.page.scss:7-37](../../apps/site/src/app/pages/demos/sociedades/sociedades.page.scss:7) — `.sociedades-empty`
- [desinversiones-futuras.page.scss:7-37](../../apps/site/src/app/pages/demos/desinversiones-futuras/desinversiones-futuras.page.scss:7) — `.df-empty`
- [inversiones-futuras.page.scss:20-50](../../apps/site/src/app/pages/demos/inversiones-futuras/inversiones-futuras.page.scss:20) — `.if-empty`

Until the primitive lands, copy one of those three (they're identical except for the prefix). Once `<afi-empty-state>` ships, all three migrate as part of the primitive's first PR — the de-facto shape is already locked in by convergence. Primitive build is queued as a separate session brief; see §16.

### Multi-section pages

Don't drop the full title-hint-action block into a section's body — that visually outranks the page's own title. Show the section's own header (`<afi-page-header level="section">`) and a thinner inline cue inside its body ("Sin movimientos en este periodo."), with an action button in the section's own `[slot="actions"]` when adding rows is the next step. Reserve the full empty state for surfaces that own the whole page body.

---

## 11. Responsive baseline (LOCKED 2026-06-15)

**Page-level layout decisions use `@container viewport` queries on the page wrapper. `@media` is banned for layout.**

Rationale. The demo-shell preview renders pages inside a constrained viewport sizer. `@media` queries respond to the *window* width, not the *preview* width — so a page that "works at 375px" in production looks fine in DevTools and broken in the demo-shell. Container queries answer the right question: *is the rendered area at least N wide?*

Canonical breakpoints — already used by the planner-sidebar drawer and Patrimonial's KPI grid:

| Breakpoint | rem | Use |
|---|---|---|
| `40rem` | 640px | Switch page wrapper from desktop to compact padding (see §4). |
| `48rem` | 768px | Collapse multi-column grids to single column. Switch sidebar to drawer mode (see [planner-sidebar.component.scss:35](../../apps/site/src/app/pages/demos/shared/planner-sidebar.component.scss:35)). |
| `64rem` | 1024px | Optional intermediate for 3-up grids that have a 2-up middle tier. |

`@media` remains valid for non-layout concerns: `prefers-reduced-motion`, `prefers-color-scheme`, `print`. Anything that shifts sidebar/drawer visibility, grid columns, section padding, or the content wrapper goes through `@container`.

**What this rule catches.** [familia.page.scss](../../apps/site/src/app/pages/demos/familia/familia.page.scss) uses `@media (max-width: 1023px)` / `@media (max-width: 767px)` for grid collapse. Inside the demo-shell preview at 375px, those queries do not fire — the page renders as desktop and the planner-sidebar "hangs out" instead of collapsing to a drawer.

Patrimonial uses **both** `@media (max-width: 640px)` and `@container viewport (max-width: 40rem)` deliberately, so the page responds in both production and the demo-shell preview. The `@container` block is required; the `@media` block is an opt-in production refinement. If you only have one, make it `@container`.

---

## 12. Spacing rhythm (LOCKED 2026-06-15)

All page-level spacing comes from the base-4 token scale ([token-skill.md](token-skill.md) §3). No raw px, no Tailwind arbitrary values, no `gap: 18px`.

| Token | Value | Use |
|---|---|---|
| `--section-gap` | 24px | Between sibling sections on a multi-section page. Between page-header and first body element on a 1-section page. |
| `--section-padding-inline` | 16px | Inside a `level="section"` / `level="subsection"` box. (Set on the primitive — don't override.) |
| `--section-padding-block` | 16px | Inside a section box, block axis. |
| `--section-radius` | 12px | Section box corner radius. (Set on the primitive — don't override.) |
| `--space-xl` | (see token) | Vertical padding inside the page wrapper. |
| `--space-md` | (see token) | Compact padding inside the page wrapper at `@container viewport (max-width: 40rem)`. |
| `--gap-card-to-card` | 8px | Between sibling metric cards in the cards row (§8). |

Pick one rhythm per page. Don't mix `--space-lg` (16px) gaps with `--section-gap` (24px) gaps in the same stack — the eye reads the change as a hierarchy that isn't there.

---

## 13. Persistent alignment (LOCKED 2026-06-15)

Generalizes the rule already locked in [AGENTS.md](../../AGENTS.md) under "Persistent label alignment": the always-visible element is the alignment anchor.

For pages, the **title's left edge** is the anchor for every persistent element below it: section headings, table left padding, filter-row first control, body text. If anything resting in the page can't trace its left edge back to the title's left edge through the shared wrapper (§4a) and the page-header host's inline padding (§4b), the alignment is wrong. The Sociedades screenshot — title visibly inset right of "Nombre" / "Inversiones Siglo XXI, SL" — is the failure mode this rule exists to prevent.

Temporary visual containers — hover panels, expanded reveal triggers, dialog overlays — may grow or offset around the anchor. They don't get to redefine it.

---

## 14. Pre-build checklist

Before opening a PR that touches a page, walk this:

- [ ] Page-header is `<afi-page-header level="page">`. Not a hand-rolled header.
- [ ] Page actions are in `[slot="actions"]`. No sibling `<div>`, no `position: absolute`, no row below the title.
- [ ] The content wrapper (`.page__wrap` / `.patrimonial-page__wrap` / shared shell wrapper) encloses **both** the page-header and the body.
- [ ] If 1-section: no section container around the body.
- [ ] If multi-section: each section is `<afi-page-header level="section">`, no `.pf-section`-style hand-rolled divs.
- [ ] Subsections (`level="subsection"`) only when the group owns actions/cards/filters or is collapsible.
- [ ] Cards in `[slot="cards"]`. Grid uses `@container viewport` + `--gap-card-to-card`.
- [ ] Filters in `[slot="filters"]`, bulk affordances in `[slot="filterActions"]`.
- [ ] If the body can be empty: empty state uses the §10 anatomy (h2 title declarative, p hint with opt-out, primary action button), lives inside the page-header's default slot, copy uses the canonical `<afi-empty-state>` primitive (or one of the converged `.{prefix}-empty` hand-rolls until the primitive ships).
- [ ] Layout responds at 375px inside the demo-shell preview. Sidebar collapses to drawer at `@container viewport (max-width: 48rem)`. No `@media` query is driving sidebar/grid/padding decisions.
- [ ] Spacing scale is base-4. No raw px, no `max-w-[1180px]`, no `gap: 18px`.
- [ ] Title's left edge aligns with everything persistent below it.

---

## 15. Known violations (LOCKED 2026-06-15)

Migration is a separate session brief — this list captures the starting backlog.

| Page | File | Rule | Fix sketch |
|---|---|---|---|
| **Sociedades** | [sociedades.page.html:21-86](../../apps/site/src/app/pages/demos/sociedades/sociedades.page.html:21) | §4a, §4b, §5 | Delete `<div class="relative">` wrapper and `<div class="absolute top-0 right-space-8">`. Project `<site-version-toggle>` into `[slot="actions"]` next to the existing button. Move the table + empty-state block from the sibling `<div class="mt-space-6">` into the page-header's default content slot so it inherits the host's `--space-lg` inline padding (Shape A in §4b). Title and "Nombre"/"Inversiones Siglo XXI, SL" then share the same left edge. |
| **Protección familiar** | [proteccion-familiar.page.html:9-24](../../apps/site/src/app/pages/demos/proteccion-familiar/proteccion-familiar.page.html:9) | §5, §7 | Move `<afi-switch>` "¿Has establecido…" into `[slot="actions"]` of the page-header. Replace `<section class="pf-section">` blocks with `<afi-page-header level="section">`. |
| **Familia** | [familia.page.scss](../../apps/site/src/app/pages/demos/familia/familia.page.scss) | §11 | Replace `@media (max-width: 1023px)` / `@media (max-width: 767px)` with `@container viewport (max-width: 64rem)` / `(max-width: 48rem)`. Mirror Patrimonial's dual-block if production refinement is also wanted. |
| **Hardcoded `max-w-[1180px]`** | Multiple demo pages | §4, §12 | Migrate to `max-inline-size: var(--content-xl)` (1140px) in a shared `.page__wrap` SCSS class, or codify the 1180px drift as a new token. Pick one; don't leave both. |
| **Triplicated empty state** | sociedades, desinversiones-futuras, inversiones-futuras (`.sociedades-empty`, `.df-empty`, `.if-empty`) | §10 | Three pages hand-rolled the same shape with different prefixes. Build `<afi-empty-state>` in `libs/ui/src/empty-state/` (slots: `title`, `hint`, `action`). All three migrate in the primitive's first PR. |

Audit candidates (not yet confirmed): `evolucion-patrimonial`, `listado-planificaciones`, `clientes`. They use the same Tailwind wrapper pattern and may need a §4 + §11 pass.

---

## 16. Open questions / parked

- **`<afi-empty-state>` primitive build** — three pages have converged on the shape; the primitive is the next session brief. Slots: `title`, `hint`, `action`. Open: does `__action` accept only `<afi-button>` or also link patterns? Decide when scoping.
- **Canonical wrapper class** — codify `.page__wrap` as a shared SCSS class shipped from `libs/ui/`, or keep page-local? Lock in v2 once the migration brief lands.
- **Page wrapper width drift** — `--content-xl` is 1140px; pages currently use 1180px. Pick one and migrate. Default recommendation: 1140px (the existing token wins).
- **Dense vs relaxed section rhythm** — Patrimonial uses `--space-sm` (12px) between dense sections; default here is `--section-gap` (24px). Decide whether "dense" is an opt-in mode or a per-page choice.
- **Drawer / dialog anatomy** — currently out of scope. When the dialog refactor lands, add a §17 for floating-surface composition.
- **Figma companion** — out of scope for v1; this skill is canonical. Revisit when a Figma source-of-truth is set up.

---

## 17. Changelog

- **2026-06-15 (v1.2)** — Renamed from root-level `Design.md` to `docs/rules/page-structure-skill.md`. Root-level `Design.md` is now the traditional design overview (principles, brand soul, foundations index) and links here for the deep page-composition rules.
- **2026-06-15 (v1.1)** — Added §10 *Empty state* (LOCKED) with anatomy table, primitive gap note, and multi-section guidance. Updated §3 anatomy to mention empty state alongside 1-section / multi-section. Renumbered §10→§11 onward. Added triplicated empty-state row to §15 known violations and the missing-primitive item to §16 open questions.
- **2026-06-15** — V1 LOCKED. Twelve rules (§4–§13), pre-build checklist (§14), four known violations (§15). Inserted into AGENTS.md required-read order, immediately after the index.
