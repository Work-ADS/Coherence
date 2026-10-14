# Traditional DS update — project index

**Status:** planned 2026-10-14 · **Branch:** `traditional-ds-update` · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip` (extract into a fresh empty directory; never into the repo)
**Prerequisite reading for every chunk:** full AGENTS.md required-read order, then this index, then the chunk's brief.

## What we're making

The traditional AFI brand (the default `:root` layer) brought in line with the Wealth Planner design system in the zip. The zip is a React + CSS reconstruction of Coherence scoped to Wealth Planner. We port its decisions to Angular in `libs/tokens` and `libs/ui`. We do not port its React.

## Decisions locked (Richard, 2026-10-14)

1. **Font:** traditional moves from Roboto Serif to Roboto (single sans family). `font-family-serif` stays defined but unused until we confirm nothing reads it.
2. **Warning ramp:** the zip's orange (`#f97316` at 500) is intentional and replaces our amber (`#ffc107`).
3. **White-label is frozen, not deleted.** The five `colors-*.scss` brand files and the Sarevi / AWM demos stay as they are. We don't test new tokens against them. Case studies still show them. We build for AFI only. We have no brand manuals for the other brands, so unfreezing would mean guessing at their skins. The one brand check is the segmented-control playground (`componentes/segmented-control`): at the end of any chunk that touches that primitive (chunk 5), switching to Unicaja must still render radio cards.
4. **Modern stays scoped.** `[data-foundation="modern"]` is untouched. Nothing in this project edits `libs/tokens/foundations-modern/`.
5. **The zip's tests and templates stay out of the repo.** The `tools/*-tests.html` pages are mined for acceptance criteria per primitive. The three templates are a reference for the page-migration chunk.
6. **Primitives before semantic.** Order inside tokens: primitive → semantic (update existing, then create new). Order inside components: audit → update existing → create new.

## Audit findings (2026-10-14, names and values only)

- **Shared token names:** 448. Values identical for 396; 52 differ (14 type, 7 warning ramp, 12 nav, ~10 shape and layering, rest minor).
- **New in zip:** 271 semantic names (chart 48, color 32, sidebar 26, table 26, insight 15, button 14, control 13, layout 13, tour 10, statuspill 9).
- **Primitive layer:** colors +32 new / 9 changed; typography +11 new / 14 changed; dimensions +3 new; elevation +4 new; motion +4 new.
- **Components:** ~35 of the zip's 78 exports have no equivalent in `libs/ui`. None is sitting in the Wealth Planner demo code to promote. Our `chart/` already has bar, line, heatmap, dumbbell, composition.

## Chunks (one session each, plan-mode gate between)

| # | Chunk | Touches | Depends on |
|---|---|---|---|
| 1 | [Primitive tokens](2026-10-14-traditional-ds-1-primitive-tokens.md) | `libs/tokens/`, `apps/site/src/styles.scss` | — |
| 2 | [Semantic: update existing](2026-10-14-traditional-ds-2-semantic-update-existing.md) (Roboto lands, warning orange, nav/sidebar, shape, overlay) | `libs/tokens/semantic.scss` | 1 |
| 3 | [Semantic: create new, cross-cutting only](2026-10-14-traditional-ds-3-semantic-create-cross-cutting.md) (chart, canvas, layout, color) | `libs/tokens/semantic.scss` | 2 |
| 4 | Components: audit every existing primitive against the zip (read-only report) | none | 2 |
| 5 | Components: update existing to the zip's look | `libs/ui/src/*` | 2, 4 |
| 6a | New components: data and charts (DataSection, FigureStrip, RankedBars, ReturnRuler, Sparkline, SummaryPanel, Meter) | `libs/ui/src/` | 3, 5 |
| 6b | New components: forms (ControlBar, FormGrid, ValueField, PercentageSplit, MultiSelect, DatePicker, FieldReveal, ExpandableCheckRow, FieldHelp) | `libs/ui/src/` | 5 |
| 6c | New components: display and navigation (MetricCard, InsightCard, VerdictBlock, ValuePill, StatusPill, Pagination, NotesPopover, PageSection, PageActions) | `libs/ui/src/` | 5 |
| 6d | New components: feedback and layout (PlannerShell, TourSpotlight, InlineNotice, EmptyState, ProgressOverlay, GhostValue, SplitButton, FloatingActionButton) | `libs/ui/src/` | 5 |
| 7 | Wealth Planner pages: swap demo-local pieces for the new primitives | `apps/site/.../wealth-planner-2026/` | 6a–6d |

Rules for 3 and 6:
- Component-scoped tokens (sidebar 26, table 26, insight 15, tour 10, statuspill 9) are created with their component in chunk 6, not in chunk 3.
- Each new primitive follows the 3-file convention and `_pre-flight.md`, and its brief lists the regressions mined from the matching zip test page.
- Chunks 6a–6d are outlined only. We sharpen each brief once its predecessor lands, because the audit in chunk 4 will change the list.

## Follow-ups (not in this project)

- Decide whether `font-family-serif` and the unused `--reveal-*` heavy/light tokens can go once nothing reads them.
- Revisit white-label if it comes back off pause.
- Brand doc: `docs/brand/digital-solutions-v1.md` may need a note once traditional matches the zip.
