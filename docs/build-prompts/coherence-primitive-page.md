# Build — Coherence primitive-page template (site-local)

**Source:** `docs/strategy/plan.md` (LOCKED 2026-04-17-rev5 — Animate UI layout calibration)
**Surface:** the reusable page template at `/componentes/{name}` on the Coherence site. **Two page-level tabs (Code / Design), right-rail playground controls, right-rail "On this page" TOC, actions row (Edit on GitHub + Copy Markdown + Descargar prompt).** Calibration: Animate UI's Files doc page, adjusted to Coherence's operator register.
**Prereqs:** scaffolding + tokens + Button + Tabs + Table + Card + Switch + the site bootstrap.

## Scope

One page template + five site-local components. Every primitive fills this template with its own controls, tokens, and content.

**Not in scope:**
- Shell pages (same template family but richer — `/patrones/shells/*`)
- Foundation landing pages (Wise-style editorial — different template)
- Brand-asset playgrounds (v1.1+)

## Required reads (in order)

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md`
3. `docs/rules/component-skill.md` — this template is itself composed of primitives per those rules
4. `docs/rules/copy-skill.md`
5. `docs/rules/token-skill.md`
6. `docs/build-prompts/coherence-site.md` — the full-site spec this template plugs into
7. `docs/build-prompts/coherence-site-bootstrap.md` — the bootstrap this template eventually supersedes for primitive pages
8. `docs/build-prompts/coherence-tabs.md` — powers both page-level and nested tabs

## When to use

- Every primitive in `libs/ui/*` gets a page built from this template.
- Each primitive PR now ships **three** artifacts: primitive code + page fill-in + route entry in `componentes.routes.ts`.

## When NOT to use

- Foundation pages (Color, Tipografía, etc.) — Wise-style editorial hero + teaser grid; different template.
- Shell pages — sibling template documented alongside primitive-page; richer slot set.
- Chart pages — chart-specific template (backlog).

---

## Page composition (LOCKED 2026-04-17-rev5)

Every `/componentes/{name}` page has this structure:

```
┌─────────────────────────────────────────────────────────────┬───────────────┐
│ Breadcrumb · Components / Button                  [← →]      │ On this page  │
│                                                              ├───────────────┤
│ COMPONENTS                                                   │ Importar      │
│ Button                                                       │ Uso           │
│ Acción primaria. Cuatro variantes, tres tamaños.             │ API Reference │
│                                                              │  > Entradas   │
│ Made by · AFI design team                                    │  > Salidas    │
│                                                              │               │
│ [Edit on GitHub] [Copy Markdown] [Descargar prompt ▾]        │ (updates when │
│                                                              │  Design tab   │
│ ┌─────────────────────────────────────────┐                  │  is active:   │
│ │  Code    Design    ← PAGE-LEVEL TABS    │                  │  Tokens       │
│ └─────────────────────────────────────────┘                  │  Accesibili.  │
│                                                              │  Motion       │
│ ─────────────────── CODE TAB (default) ─────────────────     │  Do & Don't)  │
│                                                              │               │
│ ┌─────────────────────────────┬──────────────────────┐       │               │
│ │  Preview | Code  ← nested   │ Configurar           │       │               │
│ │ ─────────── toggle          │ Variante  ●◯◯◯       │       │               │
│ │                             │ Tamaño    ◯●◯        │       │               │
│ │  [ Guardar ]                │ Estado    ☐ disabled │       │               │
│ │                             │           ☐ loading  │       │               │
│ │                             │ Etiqueta  [Guardar]  │       │               │
│ └─────────────────────────────┴──────────────────────┘       │               │
│                                                              │               │
│ ## Importar                                                  │               │
│  import { ButtonComponent } from '@coherence/ui/button';     │               │
│                                                              │               │
│ ## Uso                                                       │               │
│  Cuándo usar  ·  Cuándo NO usar  ·  Composiciones            │               │
│  ### Ejemplo real                                            │               │
│                                                              │               │
│ ## API Reference                                             │               │
│  ### Entradas                                                │               │
│  [table, rows expand to live examples]                       │               │
│  ### Salidas                                                 │               │
└──────────────────────────────────────────────────────────────┴───────────────┘
```

### Page-level tabs — Code / Design

Two tabs, two audiences, same primitive:

- **Code** (default) — engineer view: import, use, reference the API.
- **Design** — designer view: tokens, accessibility language, motion, correct usage.

The page-level tabs use `<afi-tabs variant="secondary">` (underline-on-active). Right-rail TOC **updates per active tab** — showing the H2s of whatever tab is visible.

### Code tab content (in order)

1. **Playground panel** — `<afi-component-playground>` with `[slot=preview]` on the left, `[slot=controls]` on the right. Nested `[Preview | Code]` toggle at the top of the panel.
2. **`## Importar`** — `<afi-code-block>` with the single import line. One-click copy.
3. **`## Uso`** — four subsections, each prose + visual:
   - `### Cuándo usar` (bullets)
   - `### Cuándo NO usar` (bullets)
   - `### Composiciones` (common patterns — e.g., Button inside Modal inside Drawer)
   - `### Ejemplo real` — `<afi-code-block>` with AWM-flavored Angular template (click handler + `| translate` pipe)
4. **`## API Reference`** — two `<afi-table>`s:
   - `### Entradas` — columns: `Nombre · Tipo · Predeterminado · Descripción`. Each row has a `<details>` expander labeled `Ver ejemplo` revealing a live micro-demo for that input.
   - `### Salidas` — columns: `Nombre · Carga útil · Descripción`. Same expander pattern.

### Design tab content (in order)

1. **`## Tokens consumidos`** — `<afi-tokens-table>` — two columns `Propiedad · Token`. Every visual property the primitive reads.
2. **`## Accesibilidad`** — three sub-sections, each MD-sourced + visual:
   - `### Reglas` — excerpt from `accessibility.md` via `md-excerpt`
   - `### Mapa de teclado` — visual row per key; includes a live focused primitive the user can Tab into
   - `### Demostración lectora de pantalla` — live instance + the SR announcement copy beside it
3. **`## Motion`** — duration + easing tokens used, reduced-motion fallback, a live animation demo with a "Reduced motion" toggle.
4. **`## Do & Don't`** — paired **live** primitive rows (not screenshots), 3–5 pairs.

---

## Actions row (LOCKED 2026-04-17-rev5)

Three operator actions, left-to-right, under the page header:

1. **`Edit on GitHub`** — `<afi-button variant="secondary" iconStart="pencil">` — opens `docsSource` MD file on GitHub in a new tab. For Button: `https://github.com/{org}/coherence/edit/main/docs/build-prompts/coherence-button.md`.
2. **`Copy Markdown`** — `<afi-button variant="secondary" iconStart="clipboard">` — copies the **entire rendered page** as Markdown to clipboard (prose + code blocks + tokens as MD table). Shows `<afi-badge intent="success">Markdown copiado</afi-badge>` for 2s with `aria-live="polite"`.
3. **`Descargar prompt ▾`** — `<afi-button variant="secondary" iconStart="download">` with `<afi-menu>` dropdown:
   - `Descargar coherence-button.md` (the build prompt)
   - `Descargar component-skill.md` (the author skill)
   - `Descargar accessibility.md` (the a11y contract)

Actions stay visible on scroll via the sticky page-header's scroll-fade.

---

## Site-local components (five — all in `apps/site/src/app/components/`)

### `<afi-doc-page-layout>`

Shell for every primitive page. Renders page header + actions row + page-level tabs + right-rail TOC.

| Input | Type | Default | Notes |
|---|---|---|---|
| `kicker` | `string` | *(required)* | e.g., `'COMPONENTS'` |
| `title` | `string` | *(required)* | Primitive display name |
| `subtitle` | `string` | *(required)* | One-line role description |
| `author` | `string \| null` | `'AFI design team'` | Renders as "Made by · {author}" |
| `docsSource` | `string` | *(required)* | Path for "Edit on GitHub" + "Descargar prompt" (relative to repo root) |
| `buildPromptSlug` | `string` | *(required)* | e.g., `'coherence-button'` — used for the prompt download link |

Slots: `[slot=code-tab]` · `[slot=design-tab]`.

Behavior: reads route data to build the breadcrumb; passes `buildPromptSlug` and `docsSource` to the actions row; provides the page-level `<afi-tabs>` wrapping the two slots; mounts the right-rail TOC component.

### `<afi-component-playground>`

Preview panel with nested Preview/Code sub-toggle + right-side controls.

**Preview/Code toggle (LOCKED 2026-04-17-rev9):** rendered as `<afi-tabs variant="pill">`. Tier 1 CSS sliding indicator (a `surface-base` pill with `shadow-sm` that translates between the two triggers on `--indicator-x` + `--indicator-w` custom properties, 220 ms `easing-enter`). Content crossfade between Vista previa and Código: 150 ms opacity + 4 px translateY. Reduced-motion collapses the slide to an instant color swap. See `coherence-tabs.md §Variants + sliding indicator` for the full spec.

**Page-level Code/Design tabs** (separate surface, not inside playground): `<afi-tabs variant="underline">`. Same sliding indicator mechanism, different visual — 2 px `action-500` bar along the bottom hairline of the tab list.

| Input | Type | Default | Notes |
|---|---|---|---|
| `code` | `string` | *(required)* | Current computed source code string |
| `language` | `string` | `'html'` | Highlight hint |

Slots: `[slot=preview]` · `[slot=controls]`.

Behavior:
1. Top of panel: nested `[Preview | Code]` toggle (segmented control, not tabs).
2. Preview sub-state shows `[slot=preview]` content.
3. Code sub-state shows the `code` input inside `<afi-code-block>` with syntax highlight.
4. Controls panel renders `[slot=controls]` always visible on the right.
5. Below `md` breakpoint: controls collapse into a `<afi-button iconStart="sliders-horizontal">Configurar</afi-button>` that opens a CDK BottomSheet.
6. Controls changes update the computed `code` string live via signal reactivity (consumer responsibility).

### `<afi-tokens-table>`

(Unchanged from prior spec — two columns `Propiedad` / `Token`, monospace for token values, optional `note` per row.)

### `<afi-code-block>`

Syntax-highlighted code with a copy button in the top-right. Used in `## Importar`, `## Ejemplo real`, and inside `<afi-component-playground>` when Code is selected.

| Input | Type | Default | Notes |
|---|---|---|---|
| `code` | `string` | *(required)* | The source |
| `language` | `'html' \| 'ts' \| 'css' \| 'json' \| 'bash'` | `'html'` | |
| `filename` | `string \| null` | `null` | Optional label above the block |
| `copyLabel` | `string` | `'Copiar'` | Copy button aria-label (becomes `Copiado` for 2s on success) |

### `<afi-toc>` ("On this page")

Right-rail auto-generated table of contents.

| Input | Type | Default | Notes |
|---|---|---|---|
| `containerRef` | `ElementRef` | *(required)* | The content region to scan for `<h2>` / `<h3>` |
| `title` | `string` | `'En esta página'` | Rail heading |

Behavior:
1. Queries H2/H3 elements within `containerRef` on mount + on tab change (consumer re-invokes via a signal).
2. Renders a nested list of links. Clicking a link smooth-scrolls to that heading (respects `prefers-reduced-motion` → jumps instantly).
3. `IntersectionObserver` tracks which heading is currently in view → applies `is-active` class.
4. Landmark: `<aside role="complementary" aria-label="Índice de la página">`.
5. Mobile: collapses to a bottom-fixed "Índice" button that opens a CDK BottomSheet of the same list.

---

## Playground controls per primitive family

(Same as prior spec — Button / Input / Checkbox / Switch / Card / Modal / Drawer / Table / Tabs / Sidebar / PageHeader / Shell / Menu / NavSection.)

Controls bind to local `signal()` state in the page component. The `<afi-component-playground>`'s `code` input is a `computed()` that stringifies the current state into a realistic Angular template.

---

## File structure

```
apps/site/src/app/
├── components/
│   ├── doc-page-layout/
│   ├── component-playground/
│   ├── tokens-table/
│   ├── code-block/
│   ├── toc/
│   └── teaser-tile/              (from coherence-site.md — Wise-style landings)
├── pages/componentes/
│   ├── componentes.routes.ts
│   ├── componentes.landing.ts
│   ├── button.page.ts
│   ├── input.page.ts
│   ├── page-header.page.ts
│   ├── status-chip.page.ts
│   ├── shell.page.ts
│   ├── menu.page.ts              (NEW — rev3)
│   ├── nav-section.page.ts       (NEW — rev3)
│   └── … (one per primitive)
└── lib/
    ├── md-excerpt.ts
    └── markdown-renderer.ts       (for Copy Markdown full-page rendering)
```

Each `{name}.page.ts` is ~80–140 lines: defines control-state signals, computed `code` string, `tokenRows` array, and composes `<afi-doc-page-layout>` with the two-tab content.

---

## Accessibility

- **Page-level tabs** — `<afi-tabs>` handles WAI-ARIA tabs pattern (Arrow keys switch, Home/End, active-descendant).
- **Nested Preview/Code toggle** — `role="tablist"` + `role="tab"` per pill + `aria-selected`. Live-region announces state change.
- **Controls panel** — radio groups with Arrow key nav (CDK `FocusKeyManager`); text inputs with labels.
- **TOC right rail** — `role="complementary"` + `aria-label="Índice de la página"`; links are `<a>` with smooth-scroll behavior.
- **Skip-link** — "Saltar al contenido" at page top, targets the first H2 of the active tab.
- **Reduced motion** — every transition collapses: tab switch instant, controls update instant, TOC smooth-scroll becomes jump.
- **Contrast** — every state passes WCAG AA. Actions row buttons, TOC active state, tab underline all verified.

---

## Copy (hardcoded, RAE, formal `usted`)

- Page-level tabs: `Code` · `Design`
- Nested toggle inside playground: `Vista previa` · `Código`
- Actions: `Edit on GitHub` · `Copy Markdown` · `Descargar prompt`
- Descargar prompt dropdown items: `Descargar {slug}.md`, `Descargar component-skill.md`, `Descargar accessibility.md`
- Copy success badge: `Markdown copiado`
- Copy error badge: `Error al copiar`
- Controls panel heading: `Configurar`
- Mobile controls toggle: `Configurar`
- Section H2s: `Importar` · `Uso` · `API Reference` · `Tokens consumidos` · `Accesibilidad` · `Motion` · `Do & Don't`
- Uso sub-H3s: `Cuándo usar` · `Cuándo NO usar` · `Composiciones` · `Ejemplo real`
- API Reference sub-H3s: `Entradas` · `Salidas`
- A11y sub-H3s: `Reglas` · `Mapa de teclado` · `Demostración lectora de pantalla`
- Row expander (API tables): `Ver ejemplo` / `Ocultar ejemplo`
- TOC heading: `En esta página`
- Mobile TOC button: `Índice`
- Made-by default: `AFI design team`
- Skip-link: `Saltar al contenido`
- Breadcrumb root: `Components`

---

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `primitive-page` (site-level composition).

Template-specific additions:
- Verify Code tab and Design tab both render correctly for Button (reference implementation).
- Verify right-rail TOC updates when switching page-level tabs.
- Verify Copy Markdown produces a valid MD file with all sections inline (open in a viewer and confirm structure).
- Verify actions row is sticky on scroll (via page-header scroll-fade rule).
- Verify mobile: controls panel collapses to BottomSheet; TOC collapses to Índice button.
- Verify keyboard-walk through every interactive element (tabs, controls, code-toggle, TOC links, actions, copy button).
- Verify RAE copy on every string (glossary check per `copy-skill.md`).
- Verify reduced-motion collapses every transition on the page.
- Verify downloads in `Descargar prompt ▾` fetch the correct MD files.
- Verify "Edit on GitHub" link points at the correct GitHub edit URL.

---

## What success looks like

- Designer opens `/componentes/button` → Breadcrumb + kicker + title + subtitle render; actions row visible. **Code tab active by default**; playground shows a live primary Button with controls panel on the right (variant/size/state/label). Scrolling reveals Importar → Uso → API Reference. Right-rail TOC tracks scroll position and highlights current section. Clicks **Design tab** → TOC rebuilds to show Tokens / Accesibilidad / Motion / Do & Don't; content swaps. Keyboard-walks the whole page without encountering a single skip-able or un-focusable element.
- Engineer copies the `import` line from Importar, the real-world snippet from Uso > Ejemplo real, pastes into AWM. Uses the API Reference expandable rows to validate input types.
- Designer on Design tab: inspects tokens → sees every CSS variable the Button reads → confirms the `action-500` is from their brand manifest. Keyboard map shows Tab / Space / Enter behavior; Tabs into the live instance and feels the focus ring.
- Reduced-motion user: every transition instant; no delay on tab switch, TOC jump, copy badge. Fully usable.
- Mobile (<md breakpoint): controls collapse to a `Configurar` button bottom-sheet; TOC collapses to `Índice` button bottom-sheet. Preview panel scales to full width.

---

## If stuck

- **Syntax highlighter:** `highlight.js/es/core` + grammars for `html`, `typescript`, `css`, `json`, `bash`. Under 30kb total.
- **Markdown rendering (tabs + Copy Markdown):** `marked` + DOMPurify sanitizer. Keep simple; no custom plugins for v1.
- **Copy Markdown composition:** walk the Code tab + Design tab's rendered H2/H3 tree → produce MD. Include tokens table as an MD table (pipe syntax). Include code blocks with fences + language tags.
- **TOC scroll-spy:** `IntersectionObserver` with `rootMargin: '-20% 0px -70% 0px'` so the "active" heading lights up when it's ~20% from the top.
- **Controls → code computed string:** a single `computed()` per page. Don't over-engineer with template AST — string interpolation over current signal state is fine because the templates are small.
- **Sticky actions row:** lives inside the page-header per `coherence-page-header.md` scroll-fade rule. Don't re-implement sticky.
- **Don't revert to the 4-tab layout.** If the spec feels like it wants Demo / API / A11y / Do-Don't back, stop — rev5 explicitly locked the 2-tab (Code / Design) consolidation. Ask Planner if a real ambiguity surfaces.
- **Don't put controls on the left.** Locked right-rail per rev5. Matches the right-rail TOC for spatial consistency.
