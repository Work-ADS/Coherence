# AWP 2026 — Chore: Shell refactor (pages own their `afi-page-header`)

**Status:** ✅ complete — landed on `main` in `<this commit>`. Unblocks Briefs I / J / K / L.
**Branch:** `chore/shell-refactor-header-slot` → merged + deleted
**Created:** 2026-05-26
**Completed:** 2026-05-26
**Plan reference:** [`/Users/richardgriner/.claude/plans/add-the-flow-to-robust-cherny.md`](../../.claude/plans/add-the-flow-to-robust-cherny.md) — Deliverable 0

## Completion notes (2026-05-26)

- Shell shrunk to: demo-shell + sidebar + top-bar + (banner if `showBanner`) + scroll container + `<ng-content />` + (globally hidden) version-toggle anchor. `[title]` / `[subtitle]` / `[breadcrumb]` inputs dropped; `PageHeaderComponent` no longer in the shell's imports.
- All 5 consuming pages updated: legado-retiro, inversiones-futuras, desinversiones-futuras (list + detail), proteccion-familiar. Each now renders its own `<afi-page-header>` inline with native `slot="breadcrumb"` and (where applicable) `slot="actions"`. F's `.if-toolbar`, G-list's `.df-toolbar`, G-detail's `.dd-toolbar` divs + their SCSS rules all deleted.
- Breadcrumbs standardized on the sociedades-pattern Tailwind utilities: `uppercase tracking-wider text-action-700`. Token-bound, no raw values.
- Brief completion notes in E / F / G / H amended to record the resolution.
- Verified live at 1440 wide across all 5 routes — page-header actions slot renders the right CTA in each case, sidebar chips unchanged, banner gating unchanged, console clean.
- One commit on `chore/shell-refactor-header-slot`; merged via fast-forward and branch deleted.

---

## What this session ships

A focused refactor that shrinks the shared `<site-objetivos-page-shell>` so it no longer wraps `<afi-page-header>`. Each consuming page renders its own page-header inline, gaining direct access to the primitive's full slot API (`slot="breadcrumb"`, `slot="actions"`, `slot="primaryAction"`, `slot="cards"`, `slot="filters"`, `slot="tabs"`).

**Why now**: F / G / H worked around a multi-level `<ng-content>` projection limitation by putting their `+ Añadir` / `← Volver` CTAs in body-level toolbars instead of the page-header's actions slot. The next four pages (Patrimonio previsto, Estrategias, Optimización liquidez, Optimización asset allocation) want header actions too. Refactor now → all 8 planner pages get clean, idiomatic header usage in one pass.

## Pre-flight reads

1. The current shell: [`apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-page-shell.component.{ts,html,scss}`](../../apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-page-shell.component.ts)
2. The DS primitive: [`libs/ui/src/page-header/page-header.component.html`](../../libs/ui/src/page-header/page-header.component.html) — note `<ng-content select="[slot=actions],[slot=primaryAction]" />` at line 25
3. Reference for inline page-header usage (no shell): [`apps/site/src/app/pages/demos/sociedades/sociedades.page.html`](../../apps/site/src/app/pages/demos/sociedades/sociedades.page.html) — uses `<afi-page-header>` directly with `slot="actions"`
4. Each page currently consuming the shell:
   - [`legado-retiro/`](../../apps/site/src/app/pages/demos/legado-retiro/) (Brief E)
   - [`inversiones-futuras/`](../../apps/site/src/app/pages/demos/inversiones-futuras/) (Brief F)
   - [`desinversiones-futuras/`](../../apps/site/src/app/pages/demos/desinversiones-futuras/) (Brief G — list + detail)
   - [`proteccion-familiar/`](../../apps/site/src/app/pages/demos/proteccion-familiar/) (Brief H)

## Shell — before vs after

**Before** (current state, `objetivos-page-shell.component.html`):

```html
<site-demo-shell>
  <div class="ops">
    <site-planner-sidebar [activeKey]="activeKey()" />
    <div class="ops__main">
      <site-planner-top-bar … />
      @if (showBanner()) { <site-objetivos-banner /> }
      <main class="ops__scroll">
        <div class="ops__page">
          <div class="ops__header">
            <afi-page-header [title]="title()" [subtitle]="subtitle()" …>
              <span slot="breadcrumb">{{ breadcrumb() }}</span>
            </afi-page-header>
            <div class="ops__version-toggle">
              <site-version-toggle … />
            </div>
          </div>
          <div class="ops__body">
            <ng-content />
          </div>
        </div>
      </main>
    </div>
  </div>
</site-demo-shell>
```

**After**:

```html
<site-demo-shell>
  <div class="ops">
    <site-planner-sidebar [activeKey]="activeKey()" />
    <div class="ops__main">
      <site-planner-top-bar … />
      @if (showBanner()) { <site-objetivos-banner /> }
      <main class="ops__scroll">
        <div class="ops__page">
          <ng-content />
          <div class="ops__version-toggle-floating">
            <site-version-toggle … />
          </div>
        </div>
      </main>
    </div>
  </div>
</site-demo-shell>
```

**Inputs to drop from the shell** (`objetivos-page-shell.component.ts`): `title`, `subtitle`, `breadcrumb`. Keep: `views`, `demoSlug`, `demoRoute`, `activeKey`, `clientName`, `showBanner`, `versionAriaLabel`.

## Per-page updates

Each consuming page renders its own `<afi-page-header>` as the first child of the shell's `<ng-content />`.

**Legado y retiro** — no action button; just inline header.

```html
<site-objetivos-page-shell …>
  <afi-page-header title="Legado y retiro"
    subtitle="Define qué quieres preservar y cuándo quieres retirarte. Este apartado es obligatorio."
    [sticky]="false" [scrollFade]="false">
    <span slot="breadcrumb" class="ops__breadcrumb">OBJETIVOS</span>
  </afi-page-header>
  …gate + sections…
</site-objetivos-page-shell>
```

Import `PageHeaderComponent` into the page's `imports[]`.

**Inversiones futuras** — `.if-toolbar` div is removed; the button moves into the header. The empty-state CTA stays where it is (it's the primary action when the table is empty).

```html
<afi-page-header title="Inversiones futuras" …>
  <span slot="breadcrumb">OBJETIVOS</span>
  <afi-button slot="actions" variant="primary" size="sm" (clicked)="openAdd()">
    + Añadir inversión futura
  </afi-button>
</afi-page-header>
```

Delete the `.if-toolbar` rule from `inversiones-futuras.page.scss` (or leave as dead code with a TODO).

**Desinversiones futuras list** — same shape, `+ Añadir desinversión` moves to `slot="actions"`. Delete `.df-toolbar` rule.

**Desinversiones futuras detail** — `← Volver al listado` moves to `slot="actions"` with `variant="ghost"`. Delete `.dd-toolbar` rule.

**Protección familiar** — adds the inline header, no action button.

## Updates to existing briefs

After the refactor lands, edit the completion notes in:
- `docs/session-briefs/2026-05-25-awp-objetivos-inversiones-futuras.md` — note that the slot=actions deviation is resolved
- `docs/session-briefs/2026-05-25-awp-objetivos-desinversiones-futuras.md` — same
- `docs/session-briefs/2026-05-25-awp-objetivos-proteccion-familiar.md` — same (mention recap line)

Each gets a 1-2 line addendum like: *"2026-05-26: shell refactor lifted the slot=actions ceiling. CTAs now live in the page-header's actions slot. See `chore-shell-refactor-header-slot` brief."*

## Verification

1. **Build clean** — `apps/site` compiles with zero new errors. Pre-existing errors elsewhere (familia, sociedades, app.component) are unrelated.
2. **Live preview at 1440 wide**, one route per refactored page:
   - `/demos/wealth-planner-2026/legado-retiro` — title + subtitle render, no actions
   - `/demos/wealth-planner-2026/inversiones-futuras` — `+ Añadir inversión futura` button visible top-right of the header
   - `/demos/wealth-planner-2026/desinversiones-futuras` — `+ Añadir desinversión` top-right
   - `/demos/wealth-planner-2026/desinversiones-futuras/desinv-seed-1` — `← Volver al listado` top-right
   - `/demos/wealth-planner-2026/proteccion-familiar` — title + subtitle render
3. **Sidebar chips** unchanged (sidebar wiring not touched)
4. **Banner** still gates on `legadoRetiroEstablished()` unchanged
5. **No console errors** on any of the 5 routes

## Open decisions

- **Version-toggle slot position** — currently absolute-positioned top-right of `.ops__header`. After the refactor the header is now inside `<ng-content />` from the shell's perspective, so the slot needs a new anchor. Options: (a) leave the floating positioning hint in the shell, (b) make `<site-version-toggle>` a sibling of the page-header that consumers render themselves. Default proposal: (a) keep the shell anchoring the toggle near the top of the page area, since it's already globally hidden anyway.
- **Should the version-toggle slot stay at all?** It's globally `display: none !important` (styles.scss:17–22). Removing it from the shell is harmless. Default: keep for now; remove in a follow-up when we delete the v2/v3 review machinery.

## Exit criteria

- [ ] `objetivos-page-shell.{ts,html,scss}` shrunk to just demo-shell + sidebar + top-bar + banner + main + scroll + (optional) version-toggle slot
- [ ] All 5 consuming pages render their own `<afi-page-header>` inline
- [ ] F/G/H CTAs visible in the page-header's actions slot (no more body toolbars)
- [ ] All deleted toolbar SCSS rules cleaned up
- [ ] Brief completion notes for E/F/G/H updated with the recap line
- [ ] Single focused commit on `chore/shell-refactor-header-slot`; verified live; merged + branch deleted
