# Session B — Iteración 2: Sidebar redesign

**You are starting a fresh Claude Code session in the Coherence DS repo. Read this brief fully, then enter plan mode (the user will trigger it), draft a plan, and get user approval before executing. Verify at the end.**

## Goal

Redesign the wealth-planner sidebar — the #1 priority of Iteración 2 per the May 4 meeting note: *"yo empezaría cambiando el menú ese lo primero."*

## Prerequisites

**Session A must have landed.** This is the first from-scratch surface using the new 3-file Angular convention + enforcement hook. If Session A hasn't run, stop and ask the user to run it first.

Verify quickly at session start:
- `docs/rules/component-skill.md` § 2 mandates 3 files
- `.husky/pre-commit` exists and blocks hex/px in component files
- `libs/ui/src/` primitives have been refactored to 3-file shape

## Why this exists

The current sidebar at [`apps/site/src/app/pages/novedades/shared/planner-sidebar.component.ts`](../../apps/site/src/app/pages/novedades/shared/planner-sidebar.component.ts) needs a redesign per the May 4 meeting decisions and v1 anchored review feedback. The user has explicitly flagged this as the gating task — everything else in Iteración 2 builds against this navigation shell.

Also: there's an existing [`libs/ui/src/sidebar/`](../../libs/ui/src/sidebar/) primitive. The executing session needs to decide: extend the existing primitive, replace it, or leave it untouched and build at the app level. Resolve in plan mode based on what's there.

## Scope

### IN

1. **New surface page** at `/novedades/sidebar-v2` (or similar — pick the slug in plan mode). This becomes the demo / proposal page for the new sidebar.
2. **New `/novedades` card** linking to the new surface page.
3. **Sidebar component(s)** built in 3-file shape:
   - Either extends `libs/ui/src/sidebar/` with new variants
   - Or builds new menu item / section components in `libs/ui/src/` if missing
   - Or lives at the app level under `apps/site/src/app/pages/novedades/{slug}/` if app-specific
4. Consume existing DS primitives ([`nav-item`](../../libs/ui/src/nav-item/), [`nav-section`](../../libs/ui/src/nav-section/), [`menu`](../../libs/ui/src/menu/), etc.) — do not duplicate.

### OUT

- Modifying [`apps/site/src/app/pages/novedades/iteracion-2/`](../../apps/site/src/app/pages/novedades/iteracion-2/) — versioned snapshot.
- Modifying the existing [`planner-sidebar.component.ts`](../../apps/site/src/app/pages/novedades/shared/planner-sidebar.component.ts) — the old version stays as the v1 baseline for comparison.
- Wealth evolution chart (Session C), asset table (Session D), add-asset dialog (Session E), widget (Session F).

## Files

**Editing:**
- [`apps/site/src/app/pages/novedades/novedades.page.ts`](../../apps/site/src/app/pages/novedades/novedades.page.ts) — add new card linking to the new surface
- Routing config (likely in `apps/site/src/app/app.routes.ts` or equivalent) — add new route

**Creating:**
- New surface page directory under `apps/site/src/app/pages/novedades/{slug}/` with `{slug}.page.ts` + `{slug}.page.html` + `{slug}.page.scss`
- If new DS primitives are needed: new directories under `libs/ui/src/{primitive}/` with the 4-file pattern

**Not touching:**
- [`apps/site/src/app/pages/novedades/iteracion-2/`](../../apps/site/src/app/pages/novedades/iteracion-2/) (versioned)
- Existing `planner-sidebar.component.ts` (kept as baseline)

## Constraints

- **3-file Angular convention** for every component.
- **No bare HTML / hex / px** — DS primitives + tokens only. Missing primitive? Add it to `libs/ui/src/` first.
- **Iteration page rule** — new design = new page + new `/novedades` card. Do not modify `iteracion-2`.
- **Pre-commit hook** must pass — no `--no-verify`.

## How to start

1. Enter plan mode.
2. Read:
   - [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) for the specific sidebar changes requested.
   - [`apps/site/src/app/pages/novedades/shared/planner-sidebar.component.ts`](../../apps/site/src/app/pages/novedades/shared/planner-sidebar.component.ts) for the current state.
   - [`libs/ui/src/sidebar/`](../../libs/ui/src/sidebar/) (and `nav-item`, `nav-section`, `menu`) to know what already exists.
3. Decide: extend DS sidebar primitive, replace it, or build at app level. Surface the trade-off to the user.
4. Draft the plan with the chosen surface slug, file list, and design decisions.
5. Get approval. Execute.

## Verification

- New page renders at `/novedades/{slug}` in the dev server.
- New `/novedades` card appears and links to the new page.
- Old [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) is unchanged (`git diff` shows no modifications to that file).
- All new files pass the pre-commit hook (no hex, no rgba, no raw px outside tokens).
- All new components are 3-file shape.
- Sidebar visually matches the design direction the user describes (interactive verification: load the page, screenshot, share with user for visual review).

## Reference

- Master plan: `~/.claude/plans/okay-i-need-your-swirling-shell.md`
- Iteración 2 source-of-truth: [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts)
- Memory: "Iteration pages are versioned snapshots — never modify `/novedades/iteracion-N` mid-flight; new work gets its own page + a new `/novedades` card."
