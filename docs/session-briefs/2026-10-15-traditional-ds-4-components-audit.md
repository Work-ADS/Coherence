# Chunk 4 — Components: audit every existing primitive against the zip

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Branch:** `traditional-ds-components-audit` · **Depends on:** [chunk 2](2026-10-14-traditional-ds-2-semantic-update-existing.md) and [chunk 3](2026-10-14-traditional-ds-3-semantic-create-cross-cutting.md) (read their "Findings from the session" first)
**Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip`, extracted into a fresh empty directory outside the repo.

## Goal

A read-only report that says, for every v1 primitive in `libs/ui/src/`, what the zip's matching component does differently, so chunk 5 (update existing) is sized from evidence. The report also sharpens the chunk 6a-6d lists by naming every zip component that has no equivalent here.

## Out of scope

- Any code, token or doc-site change. The only files this chunk writes are this brief, the audit report and the index row.
- All `*-v2` primitives (modern foundation, untouched) and `foundations-modern/`.
- The white-label brand files (frozen). We audit AFI only.
- Building anything from the zip's list of ~35 missing components. They are listed, not designed.

## Carry-overs (from chunks 2 and 3)

- `--control-h-*` (desktop sm/md/lg 28/32/40, mobile 40/44/48), `--control-size-*` and `--icon-button-size-*` (the zip shrinks icon buttons to 24/28/32) are deferred to chunk 5. The audit records which primitives read them.
- Decide in chunk 5: `--radius-section` (12px) vs `--section-radius` (16px). The audit lists every consumer of each so the decision has inputs.
- Component-scoped tokens (sidebar, table, insight, tour, statuspill, button, checkbox, menu, meter) wait for chunk 6. The audit flags which existing primitives depend on one.
- Compare mixin-aware: the responsive-token mixin hides names from a plain regex.
- The one brand check is the segmented-control playground: after any chunk that touches that primitive, switching to Unicaja must still render radio cards.

## Method

Per primitive: map it to its zip component(s), then read the zip `.jsx`, `.prompt.md`, `.d.ts`, the matching `*.card.html` and `tools/*-tests.html` against our `.ts`, `.html`, `.scss` and `.variants.ts`. Record one row with:

1. **API gap:** inputs, outputs, variants, sizes, slots that are missing or renamed.
2. **Look gap:** tokens consumed vs the zip's, sizes, radius, type roles, states.
3. **Behaviour and a11y gap:** keyboard, focus, ARIA, touch target, and the regressions the zip's test pages encode (these become chunk 5 acceptance criteria).
4. **Verdict and size:** `match`, `restyle` (SCSS and token swaps only), `API gap` (needs an input or variant), `structural`, or `no zip equivalent`; S/M/L effort; tokens it depends on, flagging any that do not exist yet.

Rules:
- Restyle means SCSS and token swaps. API growth is a separate finding, per the visual-parity rule.
- A one-brand structural difference goes behind `[data-brand]` in the primitive SCSS, never a variant input.
- Reuse before building: where a zip component maps onto an existing primitive with a different name, say so instead of listing it as missing.

## Work

1. Write this brief, then extract the zip into a fresh scratch directory.
2. Fan out four read-only audits by family (buttons and forms; display and feedback; navigation, shell and page; data, charts and table).
3. Merge, spot-check at least five rows against source, and resolve cross-cutting findings.
4. Write `2026-10-15-traditional-ds-4-components-audit-report.md`: summary table, per-primitive detail, cross-cutting findings, unmatched zip components, proposed chunk 5 sub-chunking, acceptance criteria mined from the zip tests.
5. Update the index row and add "Findings from the session" below.

## Done when

- Every v1 folder in `libs/ui/src/` appears in the report table exactly once.
- Every zip export is either mapped to a primitive or listed as unmatched.
- The report proposes a chunk 5 split with order.
- `git status` shows only docs changes.

## Open decisions (Richard)

1. Primitives with no or partial zip equivalent (`shell`, `copy`, `styles`, `logo`, `kbd`, `download-md-button`, `editable-text`, `inline-edit`) get one-line rows, not deep dives. Default: yes.

## Findings from the session

Full synthesis: [audit report](2026-10-15-traditional-ds-4-components-audit-report.md). Detail appendices A to D sit beside it.

- **41 v1 folders audited. Zero matches, zero pure token swaps.** Every mapped primitive needs at least one new input, variant or size. 2 restyle, 15 API gap, 2 restyle + API, 10 structural, 11 no zip equivalent, 1 mixed (chart).
- **Fix-first token hygiene.** `--focus-ring` and eight other tokens are referenced but defined nowhere, so icon-button has no visible focus ring and toast loses its animation, shadow and font. These go into the first chunk 5 step.
- **Chart is not a restyle.** The zip has one ~45-prop multi-mode `Chart`; we have five unrelated components. Needs its own brief and a decision on `data-viz-skill.md`.
- **Chunk 5 split into 5a to 5f** (foundations, controls, display, overlays, navigation, table). Chart moves out to a 6a-sized brief. Unicaja check closes 5b.
- **Chunk 6 lists grow:** Accordion, DataList, Leaving, InsightTrigger, ChartPanel, SidebarIcon set, FieldHelp and MultiSelect (the last two must land before select and filter-chip can finish).
- **Chunk 7 is not a 1:1 swap.** Our top-bar, shell and sidebar differ from the zip's planner bar and shell; a PlannerShell composite comes first.
- **Decided (Richard, 2026-10-15):** component tokens for button, checkbox, menu, sidebar and table move into chunk 5; `--radius-section` (12px) stays and `--section-radius` (16px) is retired with the `afi-section` deprecation in 5c.
- **9 open decisions for Richard** are listed at the bottom of the report. Next to settle: chart strategy, sidebar hover-expand and pin, touch floor.
- **Verified:** spot-checked against source (dead `--focus-ring`, badge `role=status`, 56px top bar, nine undefined tokens). Not run: the zip's test pages.
