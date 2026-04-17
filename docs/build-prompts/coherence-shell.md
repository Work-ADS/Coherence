# Build — Coherence Shell primitive (`libs/ui/shell/`)

**Source:** `docs/plan.md`
**Surface:** the top-level layout composer. Reads the route's `data.shell` and renders one of five locked shell types. Every AFI product uses `<afi-shell>` at its root.
**Prereqs:** scaffolding + tokens + Sidebar + PageHeader + Button + Input + Card.

## Scope

One composition primitive: `<afi-shell>`. Five named types, each a fixed composition of existing primitives. No ad-hoc layouts.

**Ships in v1:** `workspace`, `docs`, `auth`.
**Reserved in v1 (contract documented, build parked):** `focus`, `canvas`.

**Not in scope:** marketing shells, email layouts, PDF templates. Tokens-only consumers.

## Required reads

1. `docs/clean-code.md`
2. `docs/accessibility.md` — landmark structure per shell type
3. `docs/component-skill.md`
4. `docs/copy-skill.md`
5. `docs/token-skill.md` — Surface tonal ladder (`base` / `quiet` / `muted` / `elevated` / `overlay`)
6. `docs/plan.md` — Pure-C chrome lock; shell catalog lock
7. `docs/build-prompts/coherence-sidebar.md` — shell composes Sidebar in workspace/docs/canvas types
8. `docs/build-prompts/coherence-page-header.md` — shell composes PageHeader in workspace/canvas/docs types

## When to use

- Root of every route in every AFI product. Exactly once per route, at the app-component level.
- The `type` is route-data driven — products declare it, shell reads it, zero product-side logic.

## When NOT to use

- Inside modals, drawers, or popovers. Those primitives own their own layout.
- On marketing or static-content sites. Those aren't Coherence's scope.
- To compose sub-sections inside a page — that's grid / flex / Card, not Shell.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `type` | `ShellType` | `'workspace'` | One of the five; usually sourced from `route.data.shell` |
| `sidebarMode` | `'static' \| 'collapsible' \| 'hover-expand'` | `'hover-expand'` | Forwarded to `<afi-sidebar>` (workspace/docs/canvas only) |
| `rightRail` | `boolean` | `false` | Reserves the right-rail slot (workspace only); consumer fills via `[slot=rail]` |

**`ShellType` union:**

```ts
export type ShellType = 'workspace' | 'focus' | 'canvas' | 'auth' | 'docs';
```

**Outputs:** none.

**Slots:**

Shell's slots vary per type — see the per-type spec below.

## Composition patterns per shell type

### 1. `workspace` (data/operator — AWM default)

```
<afi-shell type="workspace" [rightRail]="true">
  <!-- sidebar slot -->
  <afi-nav-item slot="sidebar-top"    icon="..."  label="Personas" />
  <afi-nav-item slot="sidebar"        icon="..."  label="Propuestas" />
  <afi-nav-item slot="sidebar-bottom" icon="..."  label="Cuenta" />

  <!-- page header slot -->
  <afi-page-header slot="page-header"
    title="Nombre de propuesta 2"
    estado="pendiente"
    [sticky]="true">
    <afi-breadcrumb slot="breadcrumb">...</afi-breadcrumb>
    <afi-button slot="primaryAction">Enviar ajuste</afi-button>
    <afi-tabs slot="tabs">...</afi-tabs>
  </afi-page-header>

  <!-- main content -->
  <router-outlet />

  <!-- right rail -->
  <aside slot="rail">
    <!-- aportaciones, restricciones, etc. -->
  </aside>
</afi-shell>
```

**Structure:**
- Sidebar (left, persistent icon-rail, expandable) on `surface-quiet`.
- Main column: PageHeader (sticky) + content, `surface-base`.
- Optional right rail (enabled via `rightRail=true`) on `surface-quiet`, 320-360px default width.
- Grid: `[sidebar] [main] [rail?]` with `min-content 1fr min-content`.

### 2. `focus` (guided flow — RESERVED v1)

```
<afi-shell type="focus">
  <header slot="focus-header">
    <afi-button variant="ghost" iconStart="arrow-left">Volver</afi-button>
    <span>Paso 2 de 4</span>
    <afi-button variant="ghost" iconEnd="x" ariaLabel="Cerrar" />
  </header>
  <router-outlet />
</afi-shell>
```

**Structure:**
- No sidebar. No PageHeader.
- Compact 48px header row: back button (left) + progress meta (center) + close button (right).
- Single centered content column, max-width 640px, `surface-base`.
- Bottom-fixed action bar slot (`[slot=focus-actions]`) for primary/secondary buttons.

**v1 status:** contract documented here; actual implementation parked. When the first Focus flow product appears, this spec is the brief.

### 3. `canvas` (read/consume — RESERVED v1)

```
<afi-shell type="canvas">
  <!-- sidebar for nav context only -->
  <afi-nav-item slot="sidebar" icon="..." label="..." />

  <afi-page-header slot="page-header" title="...">
    <afi-breadcrumb slot="breadcrumb">...</afi-breadcrumb>
  </afi-page-header>

  <router-outlet />
</afi-shell>
```

**Structure:**
- Sidebar (left) — nav only, no global actions.
- Slim PageHeader (breadcrumb + title + optional actions) — no filters, no tabs by default.
- Main content fills canvas width (no max-width constraint).
- No right rail.

**v1 status:** contract documented; build parked.

### 4. `auth` (login/signup — SHIPS v1)

```
<afi-shell type="auth">
  <main>
    <img src="/assets/brands/afi/logo-light.svg" alt="AFI" />
    <afi-card>
      <router-outlet />   <!-- login form, signup, 2FA, etc. -->
    </afi-card>
  </main>
</afi-shell>
```

**Structure:**
- No sidebar. No PageHeader.
- Centered single column, max-width 400px.
- Brand logo above the card (the ONE place in the product where the logo persists).
- Card on `surface-elevated`, page background `surface-quiet`.
- Bottom-fixed footer slot for legal/help links (`[slot=auth-footer]`).

**Consumer responsibility:** renders the actual form inside `<router-outlet />` or via nested `<afi-card>` content. Shell just frames it.

### 5. `docs` (the Coherence site + future help center — SHIPS v1)

```
<afi-shell type="docs">
  <afi-sidebar slot="sidebar" mode="static">
    <afi-nav-item slot="sidebar-top"  icon="..." label="Fundamentos" />
    <afi-nav-item slot="sidebar"      icon="..." label="Producto" />
    <afi-nav-item slot="sidebar"      icon="..." label="Marketing" />
    <afi-nav-item slot="sidebar"      icon="..." label="Recursos" />
  </afi-sidebar>

  <afi-page-header slot="page-header" title="...">
    <afi-breadcrumb slot="breadcrumb">...</afi-breadcrumb>
  </afi-page-header>

  <router-outlet />

  <aside slot="toc">
    <!-- right-side table of contents for the current doc -->
  </aside>
</afi-shell>
```

**Structure:**
- Sidebar (left, static-expanded by default on docs — readers don't want to hover-expand to read nav).
- Slim PageHeader with breadcrumb + doc title.
- Main content column, max-width 720-800px (readability), `surface-base`.
- Right-rail TOC (`[slot=toc]`), sticky, auto-generated from content h2/h3s.
- Grid: `[sidebar] [main] [toc]` at `min-content 1fr 220px`.

## Route integration

The shell is driven by route data:

```ts
// app.routes.ts
{
  path: 'propuestas/:id',
  component: PropuestasDetailComponent,
  data: { shell: 'workspace' }
},
{
  path: 'onboarding/cliente',
  component: OnboardingComponent,
  data: { shell: 'focus' }
},
{
  path: 'login',
  component: LoginComponent,
  data: { shell: 'auth' }
},
```

Root `app.component.html`:

```html
<afi-shell [type]="(shellType$ | async) ?? 'workspace'">
  <router-outlet />
</afi-shell>
```

The `shellType$` observable reads `ActivatedRoute.data` on navigation end. A utility in `libs/ui/shell/shell.util.ts` exposes this as a pure function for product apps.

## File structure

```
libs/ui/shell/
├── shell.component.ts           # main dispatcher — reads `type`, renders correct layout
├── shell.workspace.ts           # workspace-specific layout template
├── shell.focus.ts               # (reserved — stub for v1)
├── shell.canvas.ts              # (reserved — stub for v1)
├── shell.auth.ts                # auth layout template
├── shell.docs.ts                # docs layout template
├── shell.util.ts                # route-data shell-type reader
├── shell.component.spec.ts
└── index.ts                     # exports ShellComponent + ShellType + shellTypeFromRoute util
```

Each per-type file exports a standalone template component (e.g., `ShellWorkspaceComponent`) that the dispatcher renders via Angular's `@switch` block. This keeps each type's template focused and makes adding Focus/Canvas later a one-file add.

## Accessibility

- Every shell type uses correct landmark structure:
  - Workspace: `<nav>` (sidebar) + `<main>` (content) + `<aside>` (rail).
  - Focus: `<main>` only (header is part of main).
  - Canvas: `<nav>` + `<main>`.
  - Auth: `<main>` only.
  - Docs: `<nav>` + `<main>` + `<aside>` (TOC).
- Skip-link: every shell type renders a `<a class="sr-only focus:not-sr-only">Saltar al contenido</a>` as its first focusable element, targeting `#main-content` (the `<main>` id).
- Focus order: sidebar (if present) → page-header (if present) → main content → rail/toc (if present).
- Reduced-motion: shell-level transitions (sidebar expand, page-header fade) respect the OS toggle.

## Copy (hardcoded, RAE)

- Skip-link: `Saltar al contenido`
- Workspace sidebar default aria-label: `Navegación principal` (passed to `<afi-sidebar>`)
- Docs sidebar default aria-label: `Navegación de documentación`
- Auth shell logo alt: consumer provides via brand manifest; convention is the brand name (`AFI`).
- Right-rail aria-label (workspace): `Panel lateral`
- TOC aria-label (docs): `Índice de la página`

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `shell` (five sub-runs, one per type — only Workspace, Docs, Auth need to pass in v1).

Shell-specific additions:
- Verify each shipping type (workspace / docs / auth) renders the correct landmark structure.
- Verify route-data reader picks up `data.shell` on navigation and updates `<afi-shell [type]>`.
- Verify the wrong `type` (e.g., a typo `'workspaces'`) logs a dev-mode warning and falls back to `'workspace'`.
- Verify skip-link targets `#main-content` and becomes visible on keyboard focus.
- Verify reserved types (`focus`, `canvas`) render a parked placeholder in v1 instead of throwing — the product can navigate to them without a crash.
- Verify right-rail (`rightRail=true`) in workspace type renders and reserves grid space.
- Verify auth shell centers the brand logo + card; page background is `surface-quiet`, card on `surface-elevated`.
- Verify docs shell renders static-expanded sidebar + TOC rail.

## What success looks like

- **AWM:** `/propuestas/123` route has `data: { shell: 'workspace' }` → sidebar (hover-expand) + page header (with estado chip) + main + right rail for aportaciones/restricciones. Pure C, no top strip, one landmark set.
- **Coherence site:** `/producto/primitivos/button` has `data: { shell: 'docs' }` → static sidebar + slim page header + main (readable max-width) + TOC rail.
- **AFI login:** `/login` has `data: { shell: 'auth' }` → centered AFI logo, card with login form, nothing else. Legal link in footer slot.
- **Reserved types (Focus/Canvas):** navigating to a route that requests them in v1 renders a polite "Este layout se habilitará próximamente" placeholder. No crash. The route works; only the shell type is parked.

## If stuck

- **Dispatcher pattern:** use Angular 17 `@switch` in the shell template to render the per-type sub-component. Keeps routing logic out of per-type files.
- **Route-data reactivity:** subscribe to `router.events` filtered to `NavigationEnd` + read `route.snapshot.firstChild.data.shell`. Easier than threading through resolvers.
- **Grid vs flexbox:** use CSS Grid for the outer shell layout (sidebar + main + rail). `grid-template-columns: min-content 1fr min-content;` — the `min-content` lets the sidebar + rail size themselves, main takes what remains.
- **Right-rail scroll independence:** the rail gets its own `overflow-y: auto` so it scrolls independently of main content. Same for the TOC in docs shell.
- **Auth brand logo:** don't import the brand file directly — read from the brand manifest (`libs/tokens/brand/afi.ts`'s `logoLight`). This keeps brand-swap working.
- **Focus/Canvas stubs:** render `<main class="p-space-8 text-center"><p>Este layout se habilitará próximamente.</p></main>`. Honest stub. When the first consumer shows up, it becomes that consumer's brief.
