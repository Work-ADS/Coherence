# Wealth Planner — screen-by-screen value map

> The IA audit from July 2026: every screen mapped to a user-value statement
> ("the advisor wants to do X, so that Y"), the problems that mapping exposed,
> and the 3-dashboard restructure that came out of it. Lo-fi wireframes live on
> page 43 of the Figma file.

## The map

The current app is a linear wizard across 6 top-level sections, 16 screens.

### Situación actual (5 data-entry pages)

| Screen | Value statement |
|---|---|
| Familia | Capture the family unit and ages, so the plan knows who it protects and when milestones hit |
| Sociedades | Record the client's companies, so corporate wealth counts in the plan |
| Patrimonio | Inventory assets and debts, so the plan starts from the real net worth |
| Ingresos | Record what comes in, so the plan knows the inflows |
| Gastos | Record what goes out, so the plan knows the available surplus |

### Objetivos (4)

| Screen | Value statement |
|---|---|
| Legado y retiro | Define retirement and legacy targets, so the plan has something to aim at |
| Inversiones futuras | Declare planned investments, so their impact enters the simulation |
| Desinversiones futuras | Declare planned sales, so liquidity events appear in the projection |
| Protección familiar | Set coverage needs, so the family is protected if things go wrong |

### Diagnóstico (2)

| Screen | Value statement |
|---|---|
| Evolución patrimonial previsto | See projected wealth over time, so they know if the current path reaches the goals |
| Estrategias | See the available strategies, so they know what could change the outcome |

### Plan de acción (2)

| Screen | Value statement |
|---|---|
| Optimización de liquidez | Put idle cash to work, so money stops losing value |
| Optimización del asset allocation | Rebalance the portfolio, so it matches the profile and goals |

### Conclusiones (2)

| Screen | Value statement |
|---|---|
| Evolución comparada | Compare with-plan vs without-plan, so the value of the advice is visible |
| Consecución de objetivos | Check each goal's status, so they know what the plan achieves |

### Informe (1)

| Screen | Value statement |
|---|---|
| Generador de informes | Generate the report, so the client takes the plan home |

## What the map exposed

- **Wizard fatigue.** The linear flow forces advisors through 9+ setup pages before any analysis, even on return visits when nothing changed.
- **Thin pages.** Many pages hold a single chart or table (Consecución de objetivos is one scorecard), losing the chance to connect related insights.
- **Disconnected insights.** Goal achievement is separated from projections, strategies from their impact, liquidity and allocation from the simulation they modify.
- **Setup ≠ analysis.** Data entry (rare) and simulation work (frequent) sit as equal navigation peers despite completely different usage patterns.

## The restructure: 3 dashboard sections

| New section | Merges | What it is |
|---|---|---|
| **Perfil del cliente** | Situación actual + Objetivos | One persistent, editable dashboard: four expandable cards (Familia & Sociedades, Patrimonio, Flujos, Objetivos) with a summary metrics strip (net worth, annual surplus, retirement age, life coverage). Edit inline, no wizard; returning users land on the dashboard. |
| **Simulación** | Diagnóstico + Plan de acción | Interactive workspace: hero wealth-projection chart with scenario toggles (Optimista / Medio / Pesimista), strategy panel with on/off switches and impact indicators, liquidity + allocation cards below. Adjust a strategy, see the chart update. |
| **Resultados** | Conclusiones + Informe | Presentation-ready dashboard: before/after comparison as hero, key improvement metrics, goal scorecard, asset breakdown and milestone timeline. "Generar informe" is a button, not a section. |

**Core principle:** Collect → Simulate → Present replaces Collect → Define → Diagnose → Act → Validate → Deliver. Three clicks deep max; each section a rich, self-contained dashboard instead of many thin single-purpose pages.

---

*Note: section structure, page list, problems, and the new IA are verbatim from the July 2026 audit. The per-screen value sentences are restored in the audit's own format; the original wording lives with the Figma analysis on page 43.*
