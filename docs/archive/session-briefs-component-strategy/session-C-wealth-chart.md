# Session C — Iteración 2: Wealth evolution chart

**You are starting a fresh Claude Code session in the Coherence DS repo. Read this brief fully, then enter plan mode (the user will trigger it), draft a plan, and get user approval before executing. Verify at the end.**

## Goal

Iterate the wealth evolution chart on the wealth planner per the 6 tasks captured in Iteración 2 — monochrome palette, contrast, accessibility, interactive legend, dynamic title, scenarios fix.

## Prerequisites

**Session A must have landed.** Confirm at session start:
- 3-file Angular convention is the rule (`docs/rules/component-skill.md` § 2)
- Pre-commit hook is active
- [`libs/ui/src/chart/`](../../libs/ui/src/chart/) is in 3-file shape

## Scope

### IN — 6 specific tasks

The exact wording lives in [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts). Read it first. Summary:

1. **Monochrome palette iteration** — the chart should iterate within one hue family, not rainbow per scenario.
2. **Contrast fixes** — ensure scenario lines / fills meet WCAG AA against background.
3. **Accessibility** — keyboard navigation between data points, screen reader labels for series and values.
4. **Interactive legend** — click a series to toggle visibility; visual feedback for active/inactive states.
5. **Dynamic title** — title reflects the current scenario / time window / filter state instead of being static.
6. **Scenarios fix** — exact behavior captured in the iteración 2 page; read it for the concrete bug.

### OUT

- Modifying [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts).
- Sidebar (Session B), asset table (Session D), add-asset dialog (Session E), widget (Session F).
- Building entirely new chart types — this is an iteration on the existing wealth-evolution chart.

## Files

**Editing:**
- [`apps/site/src/app/pages/novedades/novedades.page.ts`](../../apps/site/src/app/pages/novedades/novedades.page.ts) — add new card
- Routing config — add new route

**Creating:**
- New surface page at `apps/site/src/app/pages/novedades/{slug}/` (slug e.g. `evolucion-patrimonial-v2`)
- If chart primitive needs new variants or features: extend [`libs/ui/src/chart/`](../../libs/ui/src/chart/) with new inputs / sub-components, 3-file shape

**Not touching:**
- [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) (versioned)
- The existing [`evolucion-patrimonial`](../../apps/site/src/app/pages/novedades/evolucion-patrimonial/) page (kept as baseline if it exists)

## Constraints

- **3-file Angular convention** for every component.
- **DS primitives + tokens only** — chart colors come from `libs/tokens/`. No raw hex.
- **Accessibility is a hard gate** — keyboard nav + screen reader labels must work. Verify with an actual screen reader or browser a11y devtools, not just by code review.
- **Iteration page rule** — new page + new card, do not modify `iteracion-2`.
- **Pre-commit hook** must pass.

## How to start

1. Enter plan mode.
2. Read:
   - [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) for the exact 6 task descriptions.
   - [`apps/site/src/app/pages/novedades/evolucion-patrimonial/`](../../apps/site/src/app/pages/novedades/evolucion-patrimonial/) for the current chart implementation.
   - [`libs/ui/src/chart/`](../../libs/ui/src/chart/) for the chart primitive API.
   - [`libs/tokens/`](../../libs/tokens/) for the available color tokens (especially monochrome scales).
3. Draft the plan: which tasks to bundle, what primitive changes are needed, what the new surface page looks like.
4. Get approval. Execute.

## Verification

- New page renders at `/novedades/{slug}`.
- All 6 tasks visibly addressed — capture before/after screenshots for the user.
- Keyboard navigation works: Tab into the chart, arrow keys move between data points, focus indicator is visible.
- Screen reader announces series name + value at each focus.
- Click a legend item → series toggles visibility with a clear active/inactive visual state.
- Title updates dynamically based on selected scenario / window.
- Contrast: run an accessibility audit (browser devtools or Lighthouse) — no contrast failures on chart elements.
- [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) unchanged.
- Pre-commit hook passes for all new files.

## Reference

- Master plan: `~/.claude/plans/okay-i-need-your-swirling-shell.md`
- Iteración 2 source-of-truth: [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts)
- Memory: "Iteration pages are versioned snapshots."
