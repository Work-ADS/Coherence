# Build — Coherence DS Site (`apps/site/`)

**Source:** `docs/plan.md`
**Surface:** the design system's public face — lives + documents the primitives, ships the MD artifacts for download into consumer projects, and is the ONE place in the ecosystem where decorative motion is authorized (motion context rule, locked 2026-04-16).
**Prereqs:** scaffolding + tokens + all 14 primitives (the site consumes them, so it ships last).

## Scope

One Angular app, `apps/site/`, organized as the **Coherence docs umbrella** with **six top-level sections** (IA locked 2026-04-17-rev2, superseding the earlier 4-section framing):

- **Design at Coherence** (`/`) — home. Welcome + manifesto + working style + team. Single page, no children.
- **Foundations** (`/fundamentos`) — principles, color, type, space, motion, accessibility, copy, **tokens**. Shared across every domain.
- **Components** (`/componentes`) — all 17 primitives with playground + tokens table + tabs.
- **Patterns** (`/patrones`) — the 5 shell types + composed flujos + chart primitives.
- **Resources** (`/recursos`) — descargas, changelog, roadmap, FAQ.
- **Blog** (`/blog`) — propuesta-framed release posts written at ship time. Template in `docs/blog-template.md`.

Plus one feature component: `<afi-download-md-button>`.

## What's in v1 vs later

- **v1:** all six top-level sections live. Foundations populated with principles + every skill MD + the surface tonal ladder + tokens visualized. Components populated with every shipped primitive (each on its own detail page via `coherence-primitive-page.md`). Patterns populated with the 3 shipping shells (Workspace / Docs / Auth) + reserved-but-documented Focus + Canvas + the flujos + the 4 chart primitives. Resources surfaces descargas/changelog/roadmap. Blog launches with the first release post at the v1 milestone.
- **v1.1:** Blog cadence established (one post per meaningful release); site-level search.
- **v2:** Flujos expanded to multi-step interactive walkthroughs; keyboard cheat sheet overlay; the Feature-Kanban surfacing retrospective case studies in dossier views.

## Required reads

1. `docs/clean-code.md`
2. `docs/accessibility.md` — the site itself must pass the same checks as the primitives
3. `docs/component-skill.md`
4. `docs/copy-skill.md` — all labels RAE, `usted` register
5. `docs/plan.md` — site IA + motion context rule (DS site = decorative motion's only authorized home)
6. `docs/build-prompts/coherence-sidebar.md` — site shell uses Sidebar (hover-expand)
7. `docs/build-prompts/coherence-loading-badge.md` — site init uses LoadingOverlay `line-reveal` variant
8. `docs/build-prompts/coherence-tabs.md` — each primitive page uses Tabs (Demo / API / Accesibilidad / Do & Don't)

## When to use (the site itself)

- Designer or engineer wants to see a primitive in action before using it
- Consumer product team wants to download a build prompt MD to seed their own brand app
- New hire wants to read the foundations / skills
- AFI team wants a source of truth for "how we build UI"

## When NOT to use

- API reference for anything outside the DS — the site documents Coherence primitives, not AFI's business APIs
- Product flows with real data — that's AWM, not the DS site

## Site IA (LOCKED 2026-04-17-rev2)

```
/                                     Design at Coherence (home — welcome + manifesto)
│
├── /primeros-pasos                   Primeros pasos (landing: teaser cards per workflow page)
│   ├── /nuevo-proyecto               Iniciar un proyecto (plan-one / brief-template workflow)
│   ├── /nueva-marca                  Crear una marca nueva (manifest workflow)
│   ├── /clonar-producto              Clonar un producto o cambiar su marca
│   ├── /git-ramas                    Ramas de Git: crear, enviar, eliminar
│   └── /actualizar-ds                Actualizar el DS en tu proyecto (pull latest)
│
├── /fundamentos                      Foundations (landing: editorial hero + teaser grid)
│   ├── /principios                   (intro + manifesto-flavored prose)
│   ├── /color                        Color landing (Wise-style editorial + bucket teaser grid)
│   │   └── /{bucket}/{tokenName}     Per-token detail — uses coherence-token-page.md template.
│   │                                 Buckets: canvas / surface / action / control-neutral / system /
│   │                                 status / border / data-viz. Invalid combos → 404.
│   ├── /tipografia                   (7-role scale, AWM reference)
│   ├── /espacio                      (base-4 ladder + semantic t-shirt scale)
│   ├── /movimiento                   (motion discipline + tokens + reduced-motion examples)
│   ├── /accesibilidad                (renders accessibility.md + per-primitive checklists)
│   ├── /copy                         (renders copy-skill.md + RAE glossary)
│   └── /tokens                       (primitive → semantic → brand visualized; surface tonal ladder)
│
├── /componentes                      Components (landing: teaser grid of all 17 primitives)
│   ├── /button
│   ├── /input
│   ├── /select
│   ├── /checkbox
│   ├── /switch
│   ├── /card
│   ├── /modal
│   ├── /drawer
│   ├── /table
│   ├── /tabs
│   ├── /sidebar
│   ├── /nav-item
│   ├── /loading-overlay
│   ├── /badge
│   ├── /page-header
│   ├── /status-chip
│   └── /shell                        (5-type composition primitive; sub-pages below under /patrones/shells/*)
│
├── /patrones                         Patterns (landing: shells + flujos + gráficos teaser grid)
│   ├── /shells
│   │   ├── /workspace                (data/operator — AWM)
│   │   ├── /docs                     (this site itself — meta)
│   │   ├── /auth                     (login/signup)
│   │   ├── /focus                    (guided flow — RESERVED, contract documented)
│   │   └── /canvas                   (read/consume — RESERVED, contract documented)
│   ├── /flujos
│   │   ├── /importacion              (Table + Drawer + Badge + LoadingOverlay composition)
│   │   └── /edicion-de-fila          (Drawer inline-edit pattern)
│   ├── /tarjetas                     Card patterns (content variants of <afi-card>, LOCKED rev8)
│   │   ├── /metrica                  Number + label + trend chip
│   │   ├── /grafico                  Chart container with title + value + range tabs
│   │   ├── /fila-de-lista            Thumbnail + title + meta + trailing action
│   │   ├── /accion                   Prose + primary CTA
│   │   ├── /entidad                  Business object visual + key facts
│   │   ├── /lista-de-indicadores     Rows with inline sparklines or bars
│   │   ├── /composicion              Donut + legend + deltas
│   │   ├── /convertidor              Input → transform → output + CTA
│   │   ├── /estado                   Status label + optional confirmation visual
│   │   └── /editorial                Kicker + serif title + decorative flourish
│   │                                 (ONLY decorative-flourish pattern; restricted to
│   │                                 DS site + Blog + Primeros pasos + marketing surfaces.
│   │                                 NOT for AWM operator views.)
│   └── /graficos                     (live Chart primitives: bar, line, heatmap, dumbbell)
│
├── /recursos                         Resources (landing: downloads + changelog + roadmap + FAQ)
│   ├── /descargas                    (bundled MD zip of every build prompt + skill)
│   ├── /changelog
│   ├── /roadmap
│   └── /faq
│
└── /blog                             Blog (chronological feed of propuesta-framed release posts)
    └── /{slug}                       (one route per post; content sourced from docs/blog/{slug}.md)
```

**Sidebar mechanics:** Claude/Linear-style persistent sidebar with six top-level items; sections expand/collapse. Only the active section's children are visible by default. Preserves the Pure-C chrome lock (no top strip).

**Section landings:** Wise-style editorial — `text-title` (or `text-display` on Design at Coherence) big serif hero, generous vertical rhythm, then a teaser-tile grid of children. Each tile shows a *real visual* of the child (color swatches on Color, focus-ring example on Accesibilidad, Button preview on Button tile). Tiles link to detail pages. This is the showcase moment; chrome stays quiet.

## Per-page shape

### Fundamentos pages

- H1 + 1-sentence promise
- Prose rendered from the underlying MD (markdown → HTML at build or render time)
- `<afi-download-md-button src="clean-code.md" />` at top + bottom
- "Temas relacionados" link list to adjacent foundations

### Token pages

- H1 + short intro
- Visual swatch / scale rendered from live CSS vars (so they auto-update if tokens update — no hardcoded hex)
- Three-column mapping table: primitive → semantic → used-by
- Download token artifacts: `tokens.json`, `tokens.css`

### Primitivo pages

Each page uses `<afi-tabs>` with four tabs:

1. **Demo** — live interactive example + variants side-by-side. Uses the real primitive from `libs/ui`, not a synthetic clone.
2. **API** — inputs / outputs tables. Manual for v1; auto-gen is v2.
3. **Accesibilidad** — excerpt from `accessibility.md` + primitive-specific rules + keyboard map.
4. **Do & Don't** — When-to-use / When-not-to-use rendered as paired cards.

`<afi-download-md-button src="build-prompts/coherence-button.md" label="Descargar build prompt" />` at top.

### Shell pages

One page per shell type (Workspace, Focus, Canvas, Auth, Docs). Same four-tab pattern as Primitivos:

1. **Demo** — iframe-embedded live example of the shell type with a placeholder route inside.
2. **API** — shell type's `type`, `sidebarMode`, `rightRail` inputs + per-type slot list.
3. **Accesibilidad** — landmark structure per shell; skip-link; focus-order diagram.
4. **Do & Don't** — when each shell earns its place; anti-patterns.

Focus + Canvas pages render a "Reservado en v1 — contrato documentado, build activo cuando surja primer consumidor" notice in the Demo tab. API + A11y + Do/Don't still render fully so the contract is legible.

### Gráficos page

- H1 + 1 paragraph framing grounded in `data-viz-skill.md`.
- Live demo of each chart primitive: bar, line, heatmap, dumbbell.
- Each chart demo links to its build prompt download.

### Flujos pages

- H1 + problem statement
- Live embedded composition (real primitives, real state, real motion)
- Annotated steps ("1. Clic en fila → 2. Se abre el Drawer → 3. Flecha derecha navega a la fila siguiente…")
- "Primitivos utilizados" list with links back to each component page

## `<afi-download-md-button>` feature component

Not a DS primitive — site-local, lives in `apps/site/src/app/components/download-md-button/`.

### API

| Input | Type | Default | Notes |
|---|---|---|---|
| `src` | `string` | *(required)* | Path relative to `apps/site/src/assets/docs/` |
| `filename` | `string \| null` | `null` | Download filename; defaults to `src`'s basename |
| `label` | `string \| null` | `null` | Button text; defaults to `Descargar {filename}` |

### Behavior

1. Renders `<afi-button variant="secondary" iconStart="download">{label}</afi-button>`.
2. On click, fetches the MD from `/assets/docs/{src}`, creates a Blob, triggers browser download.
3. Shows inline `<afi-badge intent="success">Descargado</afi-badge>` for 2s on success.
4. On fetch failure, shows `<afi-badge intent="error">Error al descargar</afi-badge>`.
5. Badge region uses `aria-live="polite"` so screen readers hear the outcome.

### Accessibility

- Wrapping `<afi-button>` inherits its a11y (focus ring, keyboard activation, disabled semantics).
- The live-region badge is the only site-level a11y addition.

## Site shell

The DS site uses `<afi-shell type="docs">` (static-expanded sidebar + slim page-header + right-rail TOC). Sidebar IA mirrors the four top-level sections of the docs umbrella:

```
<afi-shell type="docs">
  <afi-sidebar slot="sidebar" mode="static">
    <div slot="top">
      <!-- brand mark (quiet, small — not a hero) -->
      <h2 class="text-body-md-600">Coherence</h2>
      <p class="text-body-sm text-neutral-500">Sistema de diseño AFI</p>
    </div>

    <!-- Six top-level sections. Claude/Linear-style collapsible. -->

    <afi-nav-item
      icon="compass"
      label="Design at Coherence"
      routerLink="/" />

    <afi-nav-section label="Primeros pasos" routerLink="/primeros-pasos">
      <afi-nav-item label="Iniciar un proyecto"                  routerLink="/primeros-pasos/nuevo-proyecto" />
      <afi-nav-item label="Crear una marca nueva"                routerLink="/primeros-pasos/nueva-marca" />
      <afi-nav-item label="Clonar un producto o cambiar su marca" routerLink="/primeros-pasos/clonar-producto" />
      <afi-nav-item label="Ramas de Git"                         routerLink="/primeros-pasos/git-ramas" />
      <afi-nav-item label="Actualizar el DS en tu proyecto"      routerLink="/primeros-pasos/actualizar-ds" />
    </afi-nav-section>

    <afi-nav-section label="Foundations" routerLink="/fundamentos">
      <afi-nav-item label="Principios"      routerLink="/fundamentos/principios" />
      <afi-nav-item label="Color"           routerLink="/fundamentos/color" />
      <afi-nav-item label="Tipografía"      routerLink="/fundamentos/tipografia" />
      <afi-nav-item label="Espacio"         routerLink="/fundamentos/espacio" />
      <afi-nav-item label="Movimiento"      routerLink="/fundamentos/movimiento" />
      <afi-nav-item label="Accesibilidad"   routerLink="/fundamentos/accesibilidad" />
      <afi-nav-item label="Copy"            routerLink="/fundamentos/copy" />
      <afi-nav-item label="Tokens"          routerLink="/fundamentos/tokens" />
    </afi-nav-section>

    <afi-nav-section label="Components" routerLink="/componentes">
      <!-- Populated from a PrimitiveIndex service; one nav-item per primitive -->
      <afi-nav-item label="Button"          routerLink="/componentes/button" />
      <afi-nav-item label="Input"           routerLink="/componentes/input" />
      <!-- ... one per primitive, 17 total -->
    </afi-nav-section>

    <afi-nav-section label="Patterns" routerLink="/patrones">
      <afi-nav-item label="Shells"          routerLink="/patrones/shells" />
      <afi-nav-item label="Flujos"          routerLink="/patrones/flujos" />
      <afi-nav-item label="Gráficos"        routerLink="/patrones/graficos" />
    </afi-nav-section>

    <afi-nav-section label="Resources" routerLink="/recursos">
      <afi-nav-item label="Descargas"       routerLink="/recursos/descargas" />
      <afi-nav-item label="Changelog"       routerLink="/recursos/changelog" />
      <afi-nav-item label="Roadmap"         routerLink="/recursos/roadmap" />
      <afi-nav-item label="FAQ"             routerLink="/recursos/faq" />
    </afi-nav-section>

    <afi-nav-section label="Blog" routerLink="/blog">
      <!-- Populated dynamically from docs/blog/*.md files -->
    </afi-nav-section>

    <div slot="bottom">
      <afi-nav-item icon="sun-moon" label="Tema" (clicked)="toggleTheme()" />
    </div>
  </afi-sidebar>

  <afi-page-header slot="page-header" [title]="currentPageTitle()">
    <afi-breadcrumb slot="breadcrumb">...</afi-breadcrumb>
  </afi-page-header>

  <afi-loading-overlay variant="line-reveal" [(visible)]="appInit" />
  <router-outlet />

  <aside slot="toc">
    <!-- auto-generated from page h2/h3s -->
  </aside>
</afi-shell>
```

**`<afi-nav-section>` is a DS primitive** (LOCKED 2026-04-17-rev3, lives at `libs/ui/nav-section/`; see `docs/build-prompts/coherence-nav-section.md`). Renders a collapsible parent nav-item + its children; expand/collapse by default based on active route (match the active section's prefix → expanded); composes `<afi-nav-item>` for both parent and children. Calibration: Granola workspace hierarchy.

Graduated from site-local to DS primitive in rev3 — AWM and future products need the same pattern, so it belongs in `libs/ui/`, not `apps/site/`.

## Motion context (site-specific)

- **First paint:** `line-reveal` LoadingOverlay plays once on app init — the decorative motion the manifesto describes. Not on route changes.
- **Route transitions:** subtle fade (120ms). No slide, no scale.
- **Hover states:** gentle (150ms).
- **Reduced-motion:** `line-reveal` collapses to fade; route transitions become instant; hover states remain functional but near-instant.

This is the ONE place in the ecosystem where decorative motion is explicitly authorized. Consumer products (AWM and future banks) stay spare per the locked motion context rule.

## File structure

```
apps/site/src/app/
├── app.component.ts                   # root — renders <afi-shell type="docs">
├── app.routes.ts                      # top-level routes set route data `{ shell: 'docs' }`
├── pages/
│   ├── home/                          # "Design at Coherence" — the / route
│   │   └── home.page.ts               # welcome + manifesto + working-style + team
│   ├── fundamentos/
│   │   ├── fundamentos.routes.ts
│   │   ├── fundamentos.landing.ts     # editorial hero + teaser grid (Wise-style)
│   │   ├── principios.page.ts
│   │   ├── color.page.ts
│   │   ├── tipografia.page.ts
│   │   ├── espacio.page.ts
│   │   ├── movimiento.page.ts
│   │   ├── accesibilidad.page.ts
│   │   ├── copy.page.ts
│   │   └── tokens.page.ts             # includes surface tonal ladder
│   ├── componentes/
│   │   ├── componentes.routes.ts
│   │   ├── componentes.landing.ts     # editorial hero + 17 primitive teaser tiles
│   │   ├── primitive-page.layout.ts   # shared tab-shell (Demo/API/A11y/Do&Don't) per coherence-primitive-page.md
│   │   ├── button.page.ts
│   │   ├── input.page.ts
│   │   ├── page-header.page.ts
│   │   ├── status-chip.page.ts
│   │   ├── shell.page.ts
│   │   └── … (one per primitive)
│   ├── patrones/
│   │   ├── patrones.routes.ts
│   │   ├── patrones.landing.ts        # teaser grid: Shells + Flujos + Gráficos
│   │   ├── shells/
│   │   │   ├── shells.routes.ts
│   │   │   ├── shells.landing.ts
│   │   │   ├── shell-page.layout.ts
│   │   │   ├── workspace.page.ts
│   │   │   ├── docs.page.ts
│   │   │   ├── auth.page.ts
│   │   │   ├── focus.page.ts          # RESERVED — renders contract + reserved notice
│   │   │   └── canvas.page.ts         # RESERVED — same pattern
│   │   ├── flujos/
│   │   │   ├── flujos.routes.ts
│   │   │   ├── flujos.landing.ts
│   │   │   ├── importacion.page.ts
│   │   │   └── edicion-de-fila.page.ts
│   │   └── graficos/
│   │       ├── graficos.routes.ts
│   │       ├── graficos.landing.ts
│   │       ├── bar.page.ts
│   │       ├── line.page.ts
│   │       ├── heatmap.page.ts
│   │       └── dumbbell.page.ts
│   ├── recursos/
│   │   ├── recursos.routes.ts
│   │   ├── recursos.landing.ts
│   │   ├── descargas.page.ts
│   │   ├── changelog.page.ts
│   │   ├── roadmap.page.ts
│   │   └── faq.page.ts
│   └── blog/
│       ├── blog.routes.ts
│       ├── blog.landing.ts            # chronological feed of release posts
│       └── post.page.ts               # renders docs/blog/{slug}.md via md-excerpt utility
├── components/
│   ├── download-md-button/
│   ├── component-playground/          # from coherence-primitive-page.md
│   ├── tokens-table/                  # from coherence-primitive-page.md
│   ├── code-toggle/                   # from coherence-primitive-page.md
│   └── teaser-tile/                   # NEW — Wise-style square tile used on every landing
│   # Note: nav-section graduated to DS primitive in 2026-04-17-rev3 — import from libs/ui/nav-section/
├── lib/
│   └── md-excerpt.ts                  # shared MD-section-to-HTML utility
└── assets/
    └── docs/
        ├── clean-code.md
        ├── accessibility.md
        ├── copy-skill.md
        ├── component-skill.md
        ├── token-skill.md
        ├── data-viz-skill.md
        ├── blog-template.md           # NEW — rendered on the Blog landing as "How we write these"
        ├── blog/                      # NEW — every release post lives here
        │   └── {slug}.md
        └── build-prompts/
            ├── coherence-button.md
            ├── coherence-page-header.md
            ├── coherence-status-chip.md
            ├── coherence-shell.md
            └── … (all primitive + shell + chart prompts + scaffolding + tokens)
```

Notes:
- `apps/site/` is itself a consumer of `<afi-shell type="docs">` — it does not implement its own shell wrapper. The shell primitive lives in `libs/ui/shell/`; the site uses it.
- Each `*.landing.ts` renders the section's **Wise-style** editorial hero + teaser-tile grid. The landing page is the showcase moment; detail pages are the density moment.
- Blog post routing: `/blog/{slug}` loads the corresponding MD from `/assets/docs/blog/{slug}.md` via the md-excerpt utility. No per-post route file — one dynamic route handles all posts.

MDs in `/assets/docs/` are copied at build time from `/docs/` via an Angular CLI `assets` entry in `angular.json` or a simple `scripts/copy-docs.sh` pre-build step. One source of truth (`/docs/`), one mirror (`/assets/docs/`).

## Copy (hardcoded, RAE, formal `usted`)

- Top-level nav: `Design at Coherence`, `Primeros pasos`, `Foundations`, `Components`, `Patterns`, `Resources`, `Blog`
- Primeros pasos sub-nav: `Iniciar un proyecto`, `Crear una marca nueva`, `Clonar un producto o cambiar su marca`, `Ramas de Git`, `Actualizar el DS en tu proyecto`
- Foundations sub-nav: `Principios`, `Color`, `Tipografía`, `Espacio`, `Movimiento`, `Accesibilidad`, `Copy`, `Tokens`
- Patterns sub-nav: `Shells`, `Flujos`, `Tarjetas`, `Gráficos`
- Tarjetas sub-nav (10 patterns): `Métrica`, `Gráfico`, `Fila de lista`, `Acción`, `Entidad`, `Lista de indicadores`, `Composición`, `Convertidor`, `Estado`, `Editorial`
- Resources sub-nav: `Descargas`, `Changelog`, `Roadmap`, `FAQ`
- Theme toggle: `Tema`
- Download button default: `Descargar {filename}`
- Download success: `Descargado`
- Download error: `Error al descargar`
- Reserved shell notice (Focus / Canvas pages): `Reservado en v1. Contrato documentado; la implementación se activa cuando surja el primer consumidor.`
- Primitivo / Shell tabs: `Demo`, `API`, `Accesibilidad`, `Do & Don't`
- Blog landing kicker: `BLOG`
- Blog landing subtitle: `Notas de producto escritas al momento del envío.`
- Blog post closing disclaimer (constant): `Este artículo se escribió al momento del envío. No es una descripción retrospectiva — es la propuesta que se estaba articulando cuando se construyó.`
- 404 page heading: `Página no encontrada`
- Footer: `Coherence — Sistema de diseño interno de AFI`

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `site` (treat the site itself as the subject).

Site-specific additions:
- Verify `line-reveal` LoadingOverlay plays on first paint only (not on route changes).
- Verify route transitions respect `prefers-reduced-motion`.
- Verify every shipped primitive has its own page under `/producto/primitivos`.
- Verify every shipped shell type has its own page under `/producto/shells` (Focus + Canvas render the reserved notice honestly).
- Verify every chart primitive has its own page under `/producto/graficos`.
- Verify every foundation MD has a working `<afi-download-md-button>`.
- Verify the site runs inside `<afi-shell type="docs">` — no custom shell wrapper.
- Verify sidebar static-expanded mode works (docs shell default) + keyboard nav through sections.
- Verify no hex / rgba / hardcoded px anywhere in `apps/site/` (same token discipline as primitives).
- Verify MDs in `/assets/docs/` are in sync with `/docs/` (build step runs, no drift).
- Verify Marketing stub renders the honest `Próximamente` message (no fake placeholder content).
- Verify Recursos/Descargas bundles every build prompt + skill MD into a single zip.

## What success looks like

- Designer opens the site → line-reveal sweeps in → static sidebar already expanded with Fundamentos / Producto / Marketing / Recursos sections → clicks `Producto → Primitivos → Button` → lands on Button's Demo tab → switches to API → clicks `Descargar build prompt` → receives `coherence-button.md` to drop into a future brand project.
- New AFI hire reads `/fundamentos/clean-code`, downloads the MD, pins it in their IDE.
- A year from now AWM engineers reach for `/producto/shells/workspace` instead of Slack-messaging the DS team about layout.
- Marketing section clicked: honest `Próximamente` page with a sentence explaining when it ships. No fake skeleton content.
- Reduced-motion user: `line-reveal` collapses to fade, sidebar still works, tabs still animate their underline with near-zero duration, everything stays usable.

## If stuck

- **MD rendering:** don't pull a heavy Markdown parser. `marked` + a sanitizer is plenty for v1. Revisit if we need syntax highlighting beyond basic.
- **Route lazy-load:** lazy-load each top-level route group (`loadChildren` on `fundamentos`, `tokens`, `componentes`, `graficos`, `flujos`). Keeps first paint fast.
- **Live demos:** render the real primitive from `libs/ui`. Do NOT build "isolated demo boxes" with synthetic props — dogfood the real thing; bugs surface faster that way.
- **Don't auto-generate API tables from TypeDoc in v1.** Manual tables are fine and less brittle. Revisit when the DS stabilizes.
- **Gráficos stub:** leave it honest. No fake placeholder SVGs. Say "v1.1", link Visa, move on.
- **MD sync:** if `/docs/clean-code.md` changes, `/assets/docs/clean-code.md` must update too. The copy step is one script. Don't let these drift.
- **Sidebar logo slot:** keep the logo simple in v1 — wordmark or single glyph. Animation is backlog.
