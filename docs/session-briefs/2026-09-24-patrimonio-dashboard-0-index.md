# Patrimonio dashboard — project index

**Status:** planned 2026-09-24 · **Reference:** [assets/2026-09-24-patrimonio-dashboard-reference.jpg](assets/2026-09-24-patrimonio-dashboard-reference.jpg)
**Prerequisite reading for every chunk:** full AGENTS.md required-read order, then this index, then the chunk's brief.

## What we're making

Two versions of Patrimonio in the layout of the reference dashboard. The reference has:

- a header with a period control, a metric dropdown and one action
- a big figure with small decimals and a delta
- a dense daily bar chart with a highlighted date range, a brush under the axis and a readout for the range
- three KPI cards below

We make it twice:

- `/demos/wealth-planner-2026/patrimonio-resumen`: traditional brand (v1)
- `/demos/wealth-planner-2026/patrimonio-resumen-moderno`: modern brand (`[data-foundation="modern"]`)

Both pages keep Patrimonio's asset tables and filter bar below the dashboard top. Only our tokens and DS primitives. The existing `/demos/wealth-planner-2026/patrimonial` stays as it is.

## Decisions locked (Richard, 2026-09-24)

1. **The chart:** we extend `afi-chart-bar` with a range-select mode rather than hand-rolling a chart in page code.
2. **The asset block:** it stays below the dashboard, lifted into a shared `site-patrimonio-assets` so the three pages don't duplicate it.
3. **The modern header:** we theme `afi-page-header` for modern in its SCSS behind `[data-foundation="modern"]`. No new input, no v2 fork.
4. **The readout:** it is docked under the chart, never floating over it. This follows [`windowed-bar-and-docked-readout.md`](../claude-design-prompts/windowed-bar-and-docked-readout.md) and deliberately departs from the reference, whose tooltip sits over the bars.
5. **Chart controls:** they go in `slot="filters"` of the section header, not next to the title. This follows our page-header slot rule.

## Chunks (one session each, plan-mode gate between)

| # | Brief | Touches | Depends on |
|---|---|---|---|
| 1 | [chart-bar range mode](2026-09-24-patrimonio-dashboard-1-chart-bar-range.md) | `libs/ui/src/chart/` | — |
| 2 | [asset block extraction](2026-09-24-patrimonio-dashboard-2-assets-extraction.md) | `demos/patrimonial/` | — |
| 3 | [page-header under modern](2026-09-24-patrimonio-dashboard-3-page-header-modern.md) | `libs/ui/src/page-header/` | — |
| 4 | [traditional page](2026-09-24-patrimonio-dashboard-4-traditional-page.md) | new `demos/patrimonio-resumen/` | 1, 2 |
| 5 | [modern page](2026-09-24-patrimonio-dashboard-5-modern-page.md) | new page in the same folder | 1, 2, 3, 4 |

Chunks 1, 2 and 3 don't depend on each other and can run in any order.

## Follow-ups (not in this project)

- A v2 asset block (table-v2, chip-v2) so the modern page's tables match the rest of it.
- The `stat-tile-v2` primitive ([brief](2026-07-17-stat-tile-v2.md)). Until it exists, the modern KPI cards are card-v2 + badge-v2.
- A texture cue on `afi-chart-bar`. Data-viz non-negotiable 1 is currently met by colour alone in every bar chart.
