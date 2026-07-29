# Wealth Planner — two dashboards for look and feel

**Status:** scoped, locked with Richard 2026-07-28 · **Branch:** `demos-planning`
**Purpose:** define two dashboards that demonstrate the modern (v2) look and feel while proving the IA restructure. Planning only — no code in this session.

---

## Where this comes from

The July 2026 IA audit ([`wealth-planner-screen-value-map.md`](../case-studies/wealth-planner-screen-value-map.md)) mapped ~15 screens across 6 wizard sections to a user-value statement each, then proposed collapsing them into 3 dashboards.

We go further. The audit's `Informe` section is one screen whose value is "generate the report" — that's a button, not a section. And `Diagnóstico`, `Plan de acción` and `Conclusiones` answer a single question. So the restructure is **2 dashboards plus a report action**, not 3 sections.

**Collect → Answer** replaces Collect → Define → Diagnose → Act → Validate → Deliver.

---

## The two dashboards

### Dashboard 1 — «¿Cuál es mi situación y qué hago al respecto?»

Merges 6 screens: `Evolución patrimonial previsto`, `Estrategias`, `Optimización de liquidez`, `Optimización del asset allocation`, `Evolución comparada`, `Consecución de objetivos`.

One surface running situación → acción → resultado. The advisor adjusts a strategy and watches the projection, the comparison and the goal scorecard all move.

### Dashboard 2 — «¿Qué tiene, qué entra, qué sale?»

Merges 4 screens: `Patrimonio`, `Ingresos`, `Gastos`, `Sociedades`.

Sociedades belongs here because corporate wealth counts toward net worth — same question, held through a vehicle. Borja: usually 0–2 sociedades, occasionally more, so it's a short table, not a section.

**Familia appears as a read-only context strip** — names and ages only. Two reasons it isn't a card: it's the most set-once screen in the app, and giving setup data a peer slot on a page advisors read constantly is the exact failure the audit named ("Setup ≠ analysis"). But it can't be absent either — Brief B is explicitly blocked on Familia because the **participación accionarial matrix has a row per family member**. Without the strip the matrix columns are unlabeled. Editing opens the full two-tab Familia surface.

### Not demoed

Familia's editor and the four `Objetivos` screens go to a third surface outside this scope. Goals get defined there and scored on Dashboard 1 — an accepted seam, noted so nobody treats it as an oversight.

---

## Look and feel

**Source of truth:** Figma `AFI-FOUNDATIONS-MODERN`, section **"Inspiration"** (`3216:13473`) — 3 sub-sections, 14 sticky notes. Read it with `get_metadata`; the sticky `name` attribute carries the note text.

**Foundation:** modern / v2. Light is the default; dark is a theme, not a requirement.

### The spine — three tiers

From the Layouts note: *"main insights, then mini insights, then deeper look."* Both dashboards use it, which is what makes them read as one system.

| Tier | Dashboard 1 | Dashboard 2 |
|---|---|---|
| **Hero** — inverse band | Projection chart + the verdict: do we reach the goals? | Net worth + annual surplus |
| **Mini insights** | Strategy impact deltas, goal scorecard | KPI strip: assets, debts, inflow, outflow |
| **Deeper look** — light cards | Liquidez, asset allocation, evolución comparada | Patrimonio breakdown, Ingresos, Gastos, Sociedades |

### Patterns the board asks for

- **Inverse hero band.** Layout #1 is the favourite because it *"shows the main two sections in different colors to highlight the data"* — a dark band holding the primary cards, light cards below. `--surface-inverse-*` tokens already exist (shipped `ac53c27`…`ca7e4e0`).
- **Gray page, white cards, visible borders, real spacing.** *"Borders of the sections, spacing and how there is gray behind the sections."*
- **Section titles on a gray band**, uppercase and letterspaced, with info + overflow icons at the ends. *"Good separation of information."*
- **One reusable card shell, different content.** *"Clearly reusable elements with different main content."*
- **Mini insights on cards** — a small interpretive line inside the card, not just a number.
- **Monochrome charts.** Black bars, dotted gridlines, color reserved for meaning (deltas, status). Gradient fills on line charts, and the line treatment carries to bar charts.
- **Asset breakdown row** — per category: label, colored share bar (solid = share, dotted = remainder), amount, delta. **Drop the oversized gray percentages** from the reference; that's the one thing explicitly rejected.

---

## What we build — corrected gap list

An earlier pass called the KPI card and the meter "genuinely new." They are not — **briefs already exist from 2026-07-17.** Reuse those specs; do not re-scope them.

### Spec'd, not built

| Piece | Brief | State |
|---|---|---|
| `afi-stat-tile-v2` — KPI card, label/value/delta | [`2026-07-17-stat-tile-v2.md`](../session-briefs/2026-07-17-stat-tile-v2.md) | ready to build, `libs/ui/src/stat-tile-v2/` absent |
| `afi-meter-v2` — value vs target | [`2026-07-17-meter-v2.md`](../session-briefs/2026-07-17-meter-v2.md) | ready to build, absent |
| `afi-donut-v2` — part-to-whole | [`2026-07-17-donut-v2.md`](../session-briefs/2026-07-17-donut-v2.md) | ready to build, absent |
| `chart-line` year x-axis | [`2026-07-17-chart-line-year-axis.md`](../session-briefs/2026-07-17-chart-line-year-axis.md) | ready to build; shared chart code, **not** a v2 primitive |

Sequence locked 2026-07-17: stat-tile → meter → donut, plan gate between each.

### Genuinely new — needs a brief

- **`afi-breakdown-row-v2`** (working name) — the asset-breakdown pattern. Nothing in `libs/ui` composes label + share bar + amount + delta as a row of categories. `meter-v2` is value-vs-target, not multi-category share, so it doesn't cover this.

### Restyles, not new primitives

- **Section title on a gray band** — modern-foundation styling of `page-header` at `level="section"`. No new API. Respects the standing rule: `slot=actions` is one page-wide action; chart controls go in `slot=filters`.
- **Monochrome chart treatment** — styling on existing chart primitives. Note the `donut-v2` brief's decision: v2 charts deliberately depart from the shared brand-neutral chart pattern and carry `[data-foundation="modern"]`. Keep that split straight.
- **Inverse hero band** — a `card-v2` tone plus page SCSS.

`chart`, `animated-chart` and `page-header` have no v2 twin (verified 2026-07-28: 25 `*-v2` dirs of ~40 base primitives). That's why these three are restyles — building `chart-v2` is a large job and this demo isn't the reason to start it.

---

## What already exists — build on it

`apps/site/src/app/pages/demos/nueva-simulacion-overview/` is **on main** (commit `9e8dda2`), not on a feature branch — the `overview-recompose` brief's gate condition 3 is already met and its "lives only on its own branch" note is stale.

It's a goal-driven client dashboard on the v2 shell: `sidebar-v2` + `navbar-v2` + 11 `card-v2` bento tiles + `chart-line` + `chart-bar` + `badge-v2`, with stagger-reveal on load and a loading overlay. Renders full-screen (no demo-shell) and is hidden from the demos landing pending polish. Sidebar nav: Cliente · Overview · Familia · Patrimonio · Ingresos y gastos · Simulaciones recientes.

Those 11 tiles are hand-written label/value/delta markup inside `card-v2` — exactly what `stat-tile-v2` exists to replace. Our two dashboards inherit this shell rather than starting fresh.

**Note the demo-shell exception:** the standing rule is every `/demos/*` page wraps in `<site-demo-shell>`. This page opts out via a full-screen flag. Confirm which way the two new dashboards go before building — the shell is how design leaves feedback.

---

## Decided — row and donut both ship, different jobs

**Locked 2026-07-28.** Both answer "distribución de activos," and they answer it at different tiers:

- **`afi-donut-v2`** — the at-a-glance part-to-whole split. Lives in the **mini-insights** tier. Already briefed; keeps its slot as deliverable 3.
- **`afi-breakdown-row-v2`** — the itemised read: label, share bar, amount, delta per category. Lives in the **deeper-look** tier, inside Patrimonio.

They are not redundant, and neither is a fallback for the other. If a future consumer wants only one, that's a composition choice, not a reason to merge the primitives.

---

## Still open

**Does the demo-shell rule apply?** Every `/demos/*` page wraps in `<site-demo-shell>` — it's how design leaves feedback (inspect mode, comment pins, viewport sizer). `nueva-simulacion-overview` opts out via a full-screen flag. Since these two dashboards inherit that shell, decide before building whether they follow the rule or the exception.

---

## Sequence

1. Brief `afi-breakdown-row-v2`.
2. Build the spec'd primitives in their locked order — stat-tile → meter → donut — plan gate between each, then `chart-line` year axis (independent, slot in anywhere).
3. Build `afi-breakdown-row-v2`.
4. Compose Dashboard 2 (simpler, 4 screens, most reference coverage).
5. Compose Dashboard 1 (6 screens, heaviest chart load).

Each of 2–5 is its own session with a plan gate. Related: [[project_dashboard_example]], [[project_identity_v2_foundation]].
