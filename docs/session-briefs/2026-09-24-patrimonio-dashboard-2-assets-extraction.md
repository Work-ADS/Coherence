# Patrimonio asset block extraction — session brief

**Status:** ready to plan · **Branch:** `refactor/patrimonio-assets`
**Project:** [Patrimonio dashboard](2026-09-24-patrimonio-dashboard-0-index.md), chunk 2 of 5
**Prerequisite reading:** full AGENTS.md required-read order, then this brief.

## Why this exists

The new dashboard pages keep Patrimonio's asset tables and filter bar under the dashboard top. At the moment that block lives inline in `patrimonial-proposal.page.{ts,html}`, which is about 2,400 lines of TS and 1,775 of HTML. If we copied it, three pages would drift apart. So we lift it into `site-patrimonio-assets` and use it on all three.

This is a **behaviour-preserving refactor**. The existing Patrimonio must look and behave exactly the same afterwards.

## What moves

All paths are relative to `apps/site/src/app/pages/demos/patrimonial/`.

**HTML** (from `patrimonial-proposal.page.html`):

| Block | Lines today |
|---|---|
| Search | 153–253 |
| Tipo chip, with drag-reorder | 260–439 |
| Entidad | 441–578 |
| Min / Max | 580–896 |
| Limpiar filtros | 898–919 |
| Bulk bar | 930–952 |
| Section-table loop | 965–1027 |
| Empty state | 1028–1058 |
| Delete confirms | 1692–1750 |
| Delete / undo toast | 1766–1773 |

**TS:**

- the tables block (about 1252–1678)
- the filters block (1681–2068)
- the helpers `formatEuroCompact` and `niceStep`

**Data:**

- the types (71–102) and `sections` (830–1152) go into `patrimonio-assets/patrimonio-assets.data.ts`
- the mappers used on both sides (`sectionKeyToTipoTop`, `tipoTopToSectionKey`, `tipoToTipoTop`, `tipoTopToTipo`, `formatEuro`) go into a utils file

## Component API

`patrimonio-assets/patrimonio-assets.component.{ts,html,scss}`:

- **Inputs:** `sections`, `addedAssets`, `highlightId` (the row that was just added), `sectionGap: 'wide' | 'compact'` (v1 uses wide, v2 and v3 compact)
- **Output:** `editRequested(row)`. The host resolves it to `editingAsset`.
- **`model()`s:** `selectedTipos` and `expandedRows`, so the host's `saveNewActivo` can still reveal the new row.

## Watch out

- **Slot projection.** Today the filter bar and bulk bar are projected into the page-header's `filters` and `filterActions` slots. The component can't be dropped between slots, so it renders its own filter row.
  - Match the spacing the header slot gives it now, using tokens.
  - Check it side by side in v1, v2 and v3.
  - Don't move the tables out of a section header. They stay `afi-page-header level="section"` + `afi-table`.
- **Delete and undo stay inside the component**, including the ⌘Z listener. Deletes are local today and never call `store.removeAsset`. Keep it that way.
- **`filteredRows` always lets the latest added asset through** (2031). That behaviour has to survive.
- **The "a" shortcut sets `addDialogOpen` even in v3**, where that modal is hidden, so it does nothing there. It's a pre-existing bug. Log it, don't fix it here.

## Cleanup while we're in there

- **Dead tabs code:** `activeTab`, `measureTabs`, `indicatorStyle`, `assetRowRefs`, and `tableExplainer`'s read of `activeTab`.
- **Dead SCSS:** `.tabs-scroll`, `.tab-indicator` and its keyframes, `.tt-pop`, `.new-asset-row`.
- **`onDialogSave`** at 455 looks unused. Delete it if grep confirms.

## Verification

- `/demos/wealth-planner-2026/patrimonial` in v1, v2 and v3: search, Tipo filter and reorder, Entidad, Min/Max, clear, bulk select and delete, row delete, undo, ⌘Z, add, and edit on both a seed row and an added row.
- Screenshots before and after.
- clean-code check, tsc, build.

## Out of scope

- Any visual change.
- The new pages.
- A v2 asset block with table-v2 (follow-up).
