# afi-page-header under modern — session brief

**Status:** ready to plan · **Branch:** `feat/page-header-modern`
**Project:** [Patrimonio dashboard](2026-09-24-patrimonio-dashboard-0-index.md), chunk 3 of 5
**Prerequisite reading:** full AGENTS.md required-read order, `docs/rules/page-structure-skill.md`, then this brief.

## Why this exists

The modern Patrimonio page needs a page header and a section header. There's no v2 page header. `afi-page-header` has no modern rules, and the modern pages we have so far hand-roll their headers: `.ov__head` in `nueva-simulacion-overview` and the hero in `panel-asesor`. Under our "missing primitive blocks the pattern" rule, hand-rolling is out.

Richard's decision (2026-09-24): **the brand decides the treatment, not an input.** Theme the existing primitive for modern in its SCSS.

## What changes

`libs/ui/src/page-header/page-header.component.scss` only. Add a `:host-context([data-foundation="modern"])` block, or whatever scoping pattern the v2 primitives already use, that swaps:

- **Title and subtitle** for each `level` (page, section, subsection) to the modern type tokens (sans).
- **Gaps and inline padding** to the modern spacing and canvas tokens.
- **Any borders or dividers** to the modern border tokens.

Take the values from Figma AFI-FOUNDATIONS-MODERN, reached through the direct JSON-RPC route on `:3845` (see memory). Fall back to the type scale in `nueva-simulacion-overview`'s `.ov__head`.

## Constraints

- **No new inputs, and nothing changes outside modern.** Traditional pages and the current modern pages must render identically.
- **Slots take v2 controls without special cases:** `actions` = button-v2, `filters` = segmented-control-v2 + select-v2.
- **The token guardian reviews the diff.** Semantic tokens only.

## Verification

- A traditional page (Patrimonio, Gastos) is pixel-identical before and after.
- A modern test mount shows the page and section levels with filters and actions. Use the foundations-modern workbench, adding a page-header section there if it helps.
- clean-code check, tsc, build.
- The tester runs pre-flight.

## Out of scope

- Moving `.ov__head` or `panel-asesor` onto the primitive. That's a follow-up, worth flagging once this lands.
