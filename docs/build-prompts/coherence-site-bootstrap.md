# Build — Coherence site bootstrap (`apps/site/`, minimal)

**Source:** `docs/strategy/plan.md` (v1 build-order step 4, LOCKED 2026-04-17)
**Surface:** a minimal Angular site that exists *only* to render every shipped primitive in one gallery route, so the user can see each primitive at `localhost:4200/preview` as Builder ships it.
**Prereqs:** `coherence-scaffolding.md` + `coherence-tokens.md` + at least one primitive shipped (Button, shipped 2026-04-17).

## Scope

Ship a minimal `apps/site/` Angular app with:
- `<afi-shell type="docs">` at the root (the shell primitive's docs type is not yet built — use a temporary inline implementation; when `<afi-shell>` ships at step 19, replace the inline with the real primitive).
- **One route only:** `/preview`.
- `/preview` renders a gallery of every shipped primitive, each in an `<afi-primitive-card>` wrapper (a site-local component — NOT a DS primitive).
- `app.routes.ts` has a `redirectTo: 'preview'` for `/`.

**Explicitly NOT in scope (full site ships as v1 step 22):**
- Fundamentos / Producto / Marketing / Recursos IA.
- Per-primitive pages with Demo/API/A11y/Do&Don't tabs.
- MD rendering.
- `<afi-download-md-button>`.
- TOC right-rail.
- Line-reveal loading overlay.
- Route transitions with fade.

Do not build any of the above here. They come back in v1 step 22 when the full site replaces this bootstrap.

## Required reads

1. `docs/rules/clean-code.md`
2. `docs/rules/accessibility.md` — the site still respects a11y even in bootstrap form
3. `docs/rules/copy-skill.md` — all labels RAE, `usted`
4. `docs/strategy/plan.md` — **Session locks 2026-04-17**, specifically the "Build sequence amendment" item explaining why this bootstrap exists
5. `docs/build-prompts/coherence-site.md` — the full-site prompt; **do not implement it here**. It's the endgame. This file is the staging ground.

## File structure

```
apps/site/
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── styles.css                    # imports libs/tokens/dist/tokens.css
│   └── app/
│       ├── app.component.ts           # root — uses <afi-shell type="docs"> or inline temp shell
│       ├── app.routes.ts              # { path: '', redirectTo: 'preview' } + { path: 'preview' }
│       └── preview/
│           ├── preview.page.ts        # lists every shipped primitive card
│           └── primitive-card.component.ts   # site-local gallery card
└── angular.json                       # (project entry added by scaffolding prompt)
```

## `<afi-primitive-card>` (site-local, NOT a DS primitive)

Lives in `apps/site/src/app/preview/primitive-card.component.ts`.

### API

| Input | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | *(required)* | e.g., `"Button"` |
| `description` | `string` | *(required)* | One-line RAE Spanish description |

Default slot = the live primitive demo.

### Template

```html
<section class="py-space-8 first:pt-0 border-b border-border-hairline last:border-b-0">
  <header class="mb-space-5">
    <h2 class="text-subtitle-body text-canvas-fg mb-space-1">{{ name() }}</h2>
    <p class="text-body-md text-neutral-600 max-w-[640px]">{{ description() }}</p>
  </header>
  <div class="flex flex-wrap items-start gap-space-4 max-w-[720px]">
    <ng-content />
  </div>
</section>
```

Tokens only. No hex. No emoji. No card shadows (docs-register is flat, not business-app elevated). Sections separate via hairline. Content flow constrained to `max-w-[720px]` so form inputs don't spread across the page.

## `/preview` page

`apps/site/src/app/preview/preview.page.ts`:

```html
<main class="px-space-10 py-space-10 max-w-[920px] mx-auto">
  <header class="mb-space-10 pb-space-8 border-b border-border-hairline">
    <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-3">
      Coherence DS
    </p>
    <h1 class="text-subtitle text-canvas-fg mb-space-3">Galería de primitivos</h1>
    <p class="text-body text-neutral-600 max-w-[640px]">
      Vista previa de todos los primitivos enviados hasta la fecha. Cada tarjeta
      muestra un componente con sus variantes principales.
    </p>
  </header>

  <div class="flex flex-col">
    <afi-primitive-card
      name="Button"
      description="Acción primaria. Cuatro variantes (primary, secondary, ghost, danger) y tres tamaños (sm, md, lg).">
      <afi-button variant="primary">Guardar</afi-button>
      <afi-button variant="secondary">Cancelar</afi-button>
      <afi-button variant="ghost">Descartar</afi-button>
      <afi-button variant="danger">Eliminar</afi-button>
    </afi-primitive-card>

    <!-- Each new primitive adds its <afi-primitive-card> here as it ships -->
  </div>
</main>
```

**Typography notes (intentional, matches Granola/Linear docs register):**
- Page kicker (`Coherence DS`) uses `text-body-sm` uppercase + tracked — subtle brand mark, not a big logo.
- Page title uses `text-subtitle` (24/32), NOT `text-title` (32/40) or `text-display` (96/112). A gallery page is *docs*, not a hero. Display typography reads as marketing on an internal tool; avoid.
- Section titles use `text-subtitle-body` (20/20) — grounded, not shouty.
- Body copy on `max-w-[640px]` for readability. Primitives row on `max-w-[720px]` so they breathe without spreading.

## App shell (temporary — Granola/Linear docs register)

Until `<afi-shell type="docs">` ships (v1 step 19), the root `app.component.ts` renders this shell. Calibration: Linear's static-expanded sidebar on `surface-quiet`, Granola's generous padding. No `border-right` on the sidebar — the tonal step IS the separator (surface ladder rule: tonal = context, shadow = elevation, they don't mix with extra borders).

```html
<div class="flex min-h-screen bg-surface-base text-canvas-fg">
  <nav class="w-[260px] shrink-0 bg-surface-quiet px-space-6 py-space-8 flex flex-col gap-space-6"
       aria-label="Navegación principal">

    <!-- Brand mark (small, quiet — not a logo headline) -->
    <div>
      <h2 class="text-body-md-600 text-canvas-fg">Coherence</h2>
      <p class="text-body-sm text-neutral-500 mt-space-1">Sistema de diseño AFI</p>
    </div>

    <!-- Six-section IA preview (2026-04-17-rev2).
         Only /preview is wired in bootstrap. The other five
         render "Próximamente en v1" stubs and hint at the future shape. -->
    <ul class="flex flex-col gap-space-1">

      <!-- Active section: Bootstrap preview. Will migrate to /componentes when v1 step 22 lands. -->
      <li>
        <a routerLink="/preview"
           routerLinkActive="bg-surface-muted text-canvas-fg font-medium"
           class="flex items-center px-space-3 py-space-2 rounded-sm
                  text-body-md text-canvas-fg
                  hover:bg-surface-muted
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
                  transition-colors duration-fast">
          Galería de primitivos
        </a>
      </li>

      <!-- Six top-level sections as disabled placeholders previewing the final IA -->
      <li class="mt-space-4">
        <p class="px-space-3 text-body-sm uppercase tracking-wider text-neutral-500">
          Próximamente
        </p>
      </li>

      <li><span class="flex items-center px-space-3 py-space-2 text-body-md text-neutral-400 cursor-not-allowed">Design at Coherence</span></li>
      <li><span class="flex items-center px-space-3 py-space-2 text-body-md text-neutral-400 cursor-not-allowed">Foundations</span></li>
      <li><span class="flex items-center px-space-3 py-space-2 text-body-md text-neutral-400 cursor-not-allowed">Components</span></li>
      <li><span class="flex items-center px-space-3 py-space-2 text-body-md text-neutral-400 cursor-not-allowed">Patterns</span></li>
      <li><span class="flex items-center px-space-3 py-space-2 text-body-md text-neutral-400 cursor-not-allowed">Resources</span></li>
      <li><span class="flex items-center px-space-3 py-space-2 text-body-md text-neutral-400 cursor-not-allowed">Blog</span></li>
    </ul>

    <!-- Status chip pinned to bottom -->
    <div class="mt-auto">
      <p class="text-body-sm text-neutral-500">Bootstrap · una sola ruta activa</p>
    </div>
  </nav>

  <main class="flex-1 min-w-0" id="main-content">
    <router-outlet />
  </main>
</div>
```

**Why the disabled placeholders are worth showing:**
- The user previewing `/preview` immediately sees the shape Coherence is headed toward (six sections, Wise-inspired IA, Claude-style sidebar).
- Honest about state — "Próximamente" kicker makes it clear only one route works today.
- When each section lights up at v1 step 22, the placeholder becomes the real link — same visual language, no surprise.
- No dead links in the bootstrap (disabled `<span>` beats a broken `<a>`).

**Do NOT** try to wire the other sections in the bootstrap. Wait for step 22. The bootstrap exists only to get Button visible at `/preview` without scope-creeping into the full site.

**Visual spec (non-negotiable — Builder does not deviate):**
- Sidebar width: `260px`. Narrower feels cramped; wider eats content.
- Sidebar background: `surface-quiet`. **No border-right.** Tonal step carries the separation.
- Sidebar padding: `px-space-6 py-space-8` (generous, Granola-style).
- Nav item: `px-space-3 py-space-2`, `rounded-sm`, `text-body-md`, hover → `surface-muted` fill.
- Active nav item: `surface-muted` fill + `canvas-fg` text (no blue fill — restrained, quiet).
- Main content area: `surface-base`, no padding on the main container (padding lives in the page).
- Page container: `max-w-[920px] mx-auto`. Not 1200+ — docs read narrower than business apps.
- Page padding: `px-space-10 py-space-10`.
- Focus-visible ring on every interactive element (`ring-border-focus`, 2px offset).
- Reduced motion: `transition-colors duration-fast` collapses to 0–80ms automatically via the OS toggle + Tailwind's `motion-safe:`/`motion-reduce:` utilities where relevant.

**What NOT to do (the failure modes that produced the "looks gross" render):**
- ❌ `text-title` / `text-display` on the page heading (reads as hero / marketing).
- ❌ Card shadows on primitive sections (flat docs register; hairline dividers only).
- ❌ Border-right on the sidebar (tonal step already separates).
- ❌ No max-width on content (inputs span full page — broken rhythm).
- ❌ `bg-surface-elevated` on every `<afi-primitive-card>` (every section reads as "lifted card" — visually noisy).

Swap this inline shell for `<afi-shell type="docs">` once the Shell primitive ships. The inline version's visual spec is the brief for the real Shell's docs type.

## Routes

`apps/site/src/app/app.routes.ts`:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'preview' },
  {
    path: 'preview',
    loadComponent: () =>
      import('./preview/preview.page').then(m => m.PreviewPage),
  },
];
```

## Copy (hardcoded, RAE, formal `usted`)

- Page H1: `Vista previa de primitivos`
- Page lead: `Galería mínima de todos los primitivos enviados hasta la fecha. La documentación completa se activará al final de v1.`
- Sidebar brand line: `Coherence`
- Sidebar status line: `Sitio en bootstrap — una sola ruta.`
- 404 (if added): `Página no encontrada`

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `site-bootstrap`.

Bootstrap-specific additions:
- Verify `ng serve apps/site` starts on port 4200 without errors.
- Verify `localhost:4200/` redirects to `/preview`.
- Verify `localhost:4200/preview` renders every `<afi-primitive-card>` with the shipped primitive inside.
- Verify no hex / rgba / hardcoded px anywhere in `apps/site/src/` (same token discipline as primitives).
- Verify tokens from `libs/tokens/dist/tokens.css` resolve (the sidebar reads `bg-surface-quiet`; confirm it renders with the calibrated off-white, not pure white).
- Verify keyboard focus visible on every `<afi-button>` in the gallery.
- Verify the site uses standalone components + OnPush + signal inputs throughout.

## What success looks like

- `ng serve apps/site` → browser opens `localhost:4200/preview` → narrow left sidebar with "Coherence" + "Sitio en bootstrap" → main area shows one `<afi-primitive-card>` titled "Button" → inside it, four buttons render with AFI blue + correct sizes + focus rings.
- When Builder ships the next primitive (Input), they add one new `<afi-primitive-card>` to `preview.page.ts` in the same PR. User reloads the page, sees Input immediately. No other plumbing needed.
- When `<afi-shell>` ships (step 19), the inline temp shell in `app.component.ts` is replaced by `<afi-shell type="docs">` in a one-file swap.
- When the full site IA ships (step 22), `/preview` is removed and replaced by the real Fundamentos / Producto / Marketing / Recursos routes. The gallery has served its purpose.

## Handoff to the next primitive

After this bootstrap lands and Button's card is visible:
- Builder returns to the per-primitive build order (Step 6: Input).
- Each primitive PR includes TWO things: the primitive itself in `libs/ui/{name}/`, AND the addition of one `<afi-primitive-card>` to `apps/site/src/app/preview/preview.page.ts`.
- The pre-flight for each subsequent primitive gains one line: "Verify the primitive's card renders in `/preview` and the primitive is interactable there."

## If stuck

- **Angular CLI plain (not Nx):** `ng generate application site --routing --style=css --standalone` (or the non-interactive equivalent the scaffolding prompt wired up).
- **Token CSS import:** `apps/site/src/styles.css` does `@import '../../libs/tokens/dist/tokens.css';` — confirm Style Dictionary emitted the file before `ng serve`.
- **Missing primitive imports:** `<afi-button>` is exported from `libs/ui/button/index.ts` → imported in `preview.page.ts` via the workspace path alias.
- **Don't over-build.** If you're adding a second route, rendering MDs, wiring downloads, or building tabs — stop. That's v1 step 22, not this one. This prompt exists *only* to give the user eyes on primitives as they ship. Keep it minimal.
