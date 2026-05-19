# Session briefs — Coherence DS + Wealth Planner Iteración 2

Each brief in this folder kicks off **one focused Claude Code session**. The structure is: one logical chunk of work per session, each with its own plan-mode plan → user approval → execute → verify. Six review gates instead of one giant merge.

## Master plan

Full strategic context: `~/.claude/plans/okay-i-need-your-swirling-shell.md`

## Sessions

| Order | Session | Brief | Depends on |
|---|---|---|---|
| 1 | **A — DS foundation pass** | [session-A-foundation.md](./session-A-foundation.md) | — |
| 2 | **B — Sidebar redesign** | [session-B-sidebar.md](./session-B-sidebar.md) | A |
| 3 | **C — Wealth evolution chart** | [session-C-wealth-chart.md](./session-C-wealth-chart.md) | A |
| 4 | **D — Asset table** | [session-D-asset-table.md](./session-D-asset-table.md) | A |
| 5 | **E — Add-asset dialog** | [session-E-add-asset-dialog.md](./session-E-add-asset-dialog.md) | A |
| Parallel | **F — Feedback widget as DS surface** | [session-F-widget.md](./session-F-widget.md) | A (loosely) |

**B–E can run in any order after A lands.** Sidebar (B) is the gating Iteración 2 task per the May 4 meeting note ("yo empezaría cambiando el menú ese lo primero"), but the others don't strictly depend on it.

## How to use a brief

1. Open a fresh Claude Code session in the Coherence repo.
2. Open the relevant brief (or paste its contents into your first message).
3. The brief tells Claude to enter plan mode, draft a plan, get your approval, then execute.
4. Verify per the brief's verification section before closing.

## Constraints that apply to all sessions

These are encoded in every brief but worth knowing up front:

- **Iteration pages are versioned snapshots** — never modify `apps/site/src/app/pages/novedades/iteracion-N/`. New work lands at its own `/novedades/{surface}` page + a new card on `/novedades`.
- **Handoff uses DS primitives + tokens only** — no bare HTML, hex, or px in generated code. A missing primitive blocks the pattern.
- **3-file Angular convention** (post-Session A): every component is `.component.ts` + `.component.html` + `.component.scss` + optional `.variants.ts`.
- **No `--no-verify`.** If the pre-commit hook blocks, fix the underlying issue or add a token.
