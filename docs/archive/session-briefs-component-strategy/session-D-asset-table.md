# Session D — Iteración 2: Asset table

**You are starting a fresh Claude Code session in the Coherence DS repo. Read this brief fully, then enter plan mode (the user will trigger it), draft a plan, and get user approval before executing. Verify at the end.**

## Goal

Iterate the asset table on the wealth planner per the 4 tasks captured in Iteración 2 — explicit column names, simplified wording, chevron reposition, expanded row options.

## Prerequisites

**Session A must have landed.** Confirm at session start:
- 3-file Angular convention is the rule
- Pre-commit hook is active
- [`libs/ui/src/table/`](../../libs/ui/src/table/) is in 3-file shape

## Scope

### IN — 4 specific tasks

Exact wording lives in [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts). Read it first. Summary:

1. **Explicit column names** — column headers state what they mean concretely (units, basis, currency), not abbreviated labels.
2. **Simplified wording** — cell content avoids jargon; numbers + units are immediately legible.
3. **Chevron reposition** — the expand/collapse chevron is in the position users expect (typically leading or trailing edge, consistent across rows).
4. **Expanded row options** — when a row is expanded, the actions/options surface (edit, delete, view detail, etc.) are present and discoverable.

### OUT

- Modifying [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts).
- Sidebar (Session B), wealth chart (Session C), add-asset dialog (Session E), widget (Session F).

## Files

**Editing:**
- [`apps/site/src/app/pages/novedades/novedades.page.ts`](../../apps/site/src/app/pages/novedades/novedades.page.ts) — add new card
- Routing config — add new route

**Creating:**
- New surface page at `apps/site/src/app/pages/novedades/{slug}/` (slug e.g. `patrimonial-v4` if continuing the existing version sequence, or a new name)
- If table primitive needs new variants or row-expansion features: extend [`libs/ui/src/table/`](../../libs/ui/src/table/) with new inputs / sub-components, 3-file shape

**Not touching:**
- [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) (versioned)
- The existing [`patrimonial`](../../apps/site/src/app/pages/novedades/patrimonial/) page (kept as baseline)

## Constraints

- **3-file Angular convention.**
- **DS primitives + tokens only.** Table colors + spacing come from tokens.
- **Tabular figures** for numeric columns — `font-variant-numeric: tabular-nums` (this is locked in plan.md as a register rule).
- **Iteration page rule** — new page + new card, do not modify `iteracion-2`.
- **Pre-commit hook** must pass.

## How to start

1. Enter plan mode.
2. Read:
   - [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) for the exact 4 task descriptions.
   - [`apps/site/src/app/pages/novedades/patrimonial/`](../../apps/site/src/app/pages/novedades/patrimonial/) for the current asset table implementation.
   - [`libs/ui/src/table/`](../../libs/ui/src/table/) for the table primitive API.
   - [`docs/strategy/plan.md`](../plan.md) Table references section ("Notion + Stripe — interactive, hover-rich, flexible columns — editable / sortable / row-hover actions / tabular figures / inline detail expansion").
3. Draft the plan: which tasks to bundle, what primitive changes are needed, what the new surface page looks like.
4. Get approval. Execute.

## Verification

- New page renders at `/novedades/{slug}`.
- All 4 tasks visibly addressed — capture before/after screenshots.
- Column headers are explicit (units / basis stated).
- Row expansion works on click; chevron is consistently positioned across rows.
- Expanded rows show actions/options in a consistent location.
- Numeric columns use tabular figures (test by checking that digit columns align vertically).
- [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) unchanged.
- Pre-commit hook passes.

## Reference

- Master plan: `~/.claude/plans/okay-i-need-your-swirling-shell.md`
- Iteración 2 source-of-truth: [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts)
- Memory: "Iteration pages are versioned snapshots."
