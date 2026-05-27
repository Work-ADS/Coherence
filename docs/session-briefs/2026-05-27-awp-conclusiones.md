# AWP 2026 — Conclusiones · Brief M: Conclusiones

> **⚠️ SUPERSEDED 2026-05-27 (same day)** — the new screens in `Afi brand/Wealth manager screens 2026/` revealed Conclusiones is two pages, not one. Replaced by:
> - [`2026-05-27-awp-conclusiones-evolucion-comparada.md`](2026-05-27-awp-conclusiones-evolucion-comparada.md)
> - [`2026-05-27-awp-conclusiones-consecucion-objetivos.md`](2026-05-27-awp-conclusiones-consecucion-objetivos.md)
>
> Kept in place as a planning trail (carries the simulation-engine fidelity question + headline-KPI exploration). **Do NOT consume for build.**

**Status:** drafted 2026-05-27, awaits user "go" + review of open decisions below
**Branch:** `feature/awp-conclusiones` (to be created)
**Created:** 2026-05-27
**Activates:** after the Plan de acción chunk (Briefs K + L) ships — closes the 9-screen map into the §5 synthesis surface that Informe (Brief N) consumes
**Plan reference:** referenced as the "real simulation engine" home in [Brief K · Liquidez](2026-05-26-awp-plan-optimizacion-liquidez.md#L145)

---

## Why this exists

Briefs A–L populate the planner with inputs (Situación), goals (Objetivos), forward-looking math (Diagnóstico), and recommended moves (Plan de acción). What's missing is the **read-out** — the single screen the advisor opens at the end of a session to answer "what does this look like for the family?" before sharing it as an Informe.

Per Brief K's note, **Conclusiones is where the real simulation engine lives**. Up to this point the optimization overlays are illustrative multipliers (`moderado ≈ 1.08`, `decidido ≈ 1.15`). Conclusiones is the surface where the actual scenario projection runs end-to-end against the family's full state, with results that the advisor can defend in conversation.

Two consumer surfaces feed off it:
1. **The advisor on screen** — interrogates the conclusions interactively, switches risk profile, drills into a specific scenario.
2. **The Informe** (Brief N) — generates a static, shareable artifact (PDF / link) from this same data.

## What this session ships

A new page at `/demos/wealth-planner-2026/conclusiones` that synthesizes everything upstream into one screen:

1. **KPI strip — the headline numbers** (one row at the top, mirrors Estrategias' Edad-de-retiro KPI pattern):
   - Patrimonio final estimado (k€)
   - Edad de retiro alcanzable
   - Probabilidad de cumplir objetivos (%)
   - Brecha vs. legado deseado (k€, can be negative = surplus)
2. **Objetivos cumplidos / no cumplidos** — a two-column read-out: which of the family's Objetivos (Legado, Inversiones, Desinversiones, Protección) the current Plan covers, and where the gaps are. Each row links back to the originating Objetivo page.
3. **Patrimonio resultante por escenario** — a `<afi-chart-line>` showing the projected wealth curve under each scenario, with the optimized Plan overlaid against the baseline Diagnóstico. Visually mirrors Brief K's chart, but the curve is the post-Plan result, not just the diagnosis.
4. **Acciones recomendadas — síntesis** — a compact `<afi-table>` listing the top 3–5 recommended moves from Brief L (Optimización del asset allocation), with priority + estimated impact. Linkable to the originating Plan section.
5. **Estado del plan** — a status read-out: "Plan completo" / "Plan parcial — N decisiones pendientes" / "Plan inviable — revisar Objetivos". Drives whether Informe (Brief N) can generate.

The page is read-only (no inputs) — every value derives from the WealthPlannerStore signals seeded by Briefs A–L. The only interaction is a single `<afi-segmented-control>` to switch the active risk profile across the four downstream sections.

## Sources of truth

- **Figma:** TBD — pull from `888lN7vbJSc4gLYt7nP3DW` "Conclusiones" frame before activation. **OPEN: does this frame exist yet?**
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) — pages TBD (likely pp. 10–12 if the document follows the same flow).
- **Granola:** any session that touched "conclusiones" or "informe" — flag during activation.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md`
2. `docs/rules/component-skill.md`
3. `docs/rules/token-skill.md`
4. `docs/agents/ds-token-guardian.md`
5. Brief I (Patrimonio previsto) — shared `Scenario` type + chart wiring
6. Brief J (Estrategias) — `ScenarioWithActual` + KPI card pattern
7. Brief K (Liquidez) — `PerfilRiesgo` type + optimization overlay pattern
8. Brief L (Asset allocation) — recommended-actions data shape

## Chrome wrapping

Same shell as Diagnóstico / Plan de acción pages — inline `<afi-page-header>` with `breadcrumb="CONCLUSIONES"`. Sidebar gets a new "Conclusiones" item under a new §5 section header.

```html
<site-conclusiones-page-shell
  demoSlug="conclusiones"
  demoRoute="/demos/wealth-planner-2026/conclusiones"
  activeKey="conclusiones"
>
  <afi-page-header
    title="Conclusiones"
    subtitle="Síntesis del plan: dónde llega la familia y qué decisiones quedan abiertas."
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb">CONCLUSIONES</span>
  </afi-page-header>

  <!-- ─── 1. KPI strip ─────────────────────────────────────────── -->
  <section class="cc-section cc-section--kpi">
    <div class="cc-kpi-row">
      @for (kpi of headlineKpis(); track kpi.key) {
        <div class="cc-kpi-card" [class.cc-kpi-card--negative]="kpi.tone === 'negative'">
          <span class="stat__label">{{ kpi.label }}</span>
          <span class="stat__value">
            {{ kpi.value }}<span class="stat__unit">{{ kpi.unit }}</span>
          </span>
        </div>
      }
    </div>
  </section>

  <!-- ─── 2. Objetivos cumplidos / no cumplidos ────────────────── -->
  <section class="cc-section">
    <header class="cc-section__head">
      <h2 class="cc-section__title">Objetivos</h2>
    </header>
    <div class="cc-objetivos-grid">
      <div class="cc-objetivos-grid__col">
        <h3 class="cc-objetivos-grid__heading">Cumplidos</h3>
        @for (o of objetivosCumplidos(); track o.id) {
          <a [routerLink]="o.route" class="cc-objetivo-row cc-objetivo-row--cumplido">
            <afi-status-chip intent="success">Cumplido</afi-status-chip>
            <span class="cc-objetivo-row__label">{{ o.label }}</span>
          </a>
        }
      </div>
      <div class="cc-objetivos-grid__col">
        <h3 class="cc-objetivos-grid__heading">No cumplidos</h3>
        @for (o of objetivosNoCumplidos(); track o.id) {
          <a [routerLink]="o.route" class="cc-objetivo-row cc-objetivo-row--gap">
            <afi-status-chip intent="warning">Brecha</afi-status-chip>
            <span class="cc-objetivo-row__label">{{ o.label }}</span>
            <span class="cc-objetivo-row__gap">{{ o.brecha | currency }}</span>
          </a>
        }
      </div>
    </div>
  </section>

  <!-- ─── 3. Patrimonio resultante por escenario ───────────────── -->
  <section class="cc-section">
    <header class="cc-section__head">
      <h2 class="cc-section__title">Patrimonio resultante</h2>
      <p class="cc-section__hint">
        Proyección a {{ store.legadoRetiro().edadSeguridad }} años con el plan optimizado
        contra la línea base del diagnóstico.
      </p>
    </header>
    <afi-chart-line [series]="patrimonioResultanteSeries()" />
  </section>

  <!-- ─── 4. Acciones recomendadas ─────────────────────────────── -->
  <section class="cc-section">
    <header class="cc-section__head">
      <h2 class="cc-section__title">Acciones recomendadas</h2>
    </header>
    <afi-table
      [columns]="accionesCols"
      [rows]="accionesRecomendadas()"
      density="comfortable"
    />
  </section>

  <!-- ─── 5. Estado del plan ───────────────────────────────────── -->
  <section class="cc-section cc-section--status">
    <afi-card variant="quiet" padding="lg">
      <header class="cc-status__head">
        <afi-status-chip [intent]="planStatusIntent()">{{ planStatusLabel() }}</afi-status-chip>
        <h2 class="cc-status__title">{{ planStatusHeadline() }}</h2>
      </header>
      <p class="cc-status__body">{{ planStatusBody() }}</p>
      @if (canGenerateInforme()) {
        <afi-button variant="primary" size="md" [routerLink]="'/demos/wealth-planner-2026/informe'">
          Generar informe →
        </afi-button>
      }
    </afi-card>
  </section>
</site-conclusiones-page-shell>
```

## Store extensions

```ts
// Builds on Briefs I, J, K, L
export interface HeadlineKpi {
  key: 'patrimonio-final' | 'edad-retiro' | 'probabilidad-objetivos' | 'brecha-legado';
  label: string;
  value: string;          // pre-formatted; locale-aware
  unit: string;           // 'k€', 'años', '%'
  tone: 'positive' | 'neutral' | 'negative';
}

export interface ObjetivoSyntesisRow {
  id: string;
  label: string;          // 'Legado y retiro', 'Inversión X', etc.
  route: string;          // /demos/wealth-planner-2026/legado-retiro etc.
  brecha?: number;        // k€, only on objetivosNoCumplidos
}

export interface AccionRecomendada {
  prioridad: 1 | 2 | 3;
  accion: string;         // 'Reasignar 15% de liquidez a renta fija'
  impacto: string;        // '+2.4 k€/año en renta proyectada'
  origen: string;         // 'Optimización asset allocation'
  ruta: string;           // /demos/wealth-planner-2026/optimizacion-asset-allocation
}

export type PlanStatus = 'completo' | 'parcial' | 'inviable';

readonly headlineKpis            = computed<HeadlineKpi[]>(() => /* derive */);
readonly objetivosCumplidos      = computed<ObjetivoSyntesisRow[]>(() => /* derive */);
readonly objetivosNoCumplidos    = computed<ObjetivoSyntesisRow[]>(() => /* derive */);
readonly patrimonioResultante    = computed<...>(() => /* derive */);  // chart series
readonly accionesRecomendadas    = computed<AccionRecomendada[]>(() => /* derive */);
readonly planStatus              = computed<PlanStatus>(() => /* derive */);
readonly canGenerateInforme      = computed<boolean>(() => this.planStatus() !== 'inviable');

readonly conclusionesState       = computed<SectionState>(() => /* complete / partial / empty */);
```

All derivations should be pure computeds off existing store signals — no new seed data, no manual entry. **OPEN: simulation engine spec needs Jaime / engine team input — see Open decisions.**

## Sidebar wiring

New §5 section in the planner sidebar:

```ts
{
  key: 'conclusiones-section',
  label: 'Conclusiones',
  items: [
    {
      key: 'conclusiones',
      label: 'Conclusiones',
      state: this.store.conclusionesState(),
      route: '/demos/wealth-planner-2026/conclusiones',
    },
    {
      key: 'informe',
      label: 'Informe',
      state: this.store.informeState(),  // from Brief N
      route: '/demos/wealth-planner-2026/informe',
    },
  ],
}
```

## Routes

```ts
{
  path: 'wealth-planner-2026/conclusiones',
  loadComponent: () =>
    import('./conclusiones/conclusiones.page').then((m) => m.ConclusionesPage),
},
```

## Open decisions (need user input before build)

1. **Simulation engine fidelity.** "Real simulation engine is Conclusiones territory" — but how real? Options:
   - (a) Same illustrative multiplier approach as Brief K (just compose K + L overlays end-to-end on the existing scenario series). Fast to ship, honest about being illustrative.
   - (b) Implement a deterministic projection model in TS using actual return assumptions per asset class. Defensible, but needs Jaime to confirm the model.
   - (c) Stub the projection out as a service interface, mock with (a) for v1, leave a TODO for the real engine to land later.
   - Default proposal: **(c)** — keep the brief shippable, define the surface for future engine swap.

2. **Headline KPI choice.** The 4 KPIs above are a guess. Confirm:
   - Patrimonio final estimado ✓
   - Edad de retiro alcanzable ✓
   - Probabilidad de cumplir objetivos — does the engine produce a probability? If not, replace with something the data can support (e.g., "Margen de seguridad: ±X%").
   - Brecha vs. legado deseado ✓

3. **Risk profile selector — global or local?** The conclusions naturally depend on the chosen `PerfilRiesgo` from Brief K. Options:
   - (a) Show 4 columns simultaneously (one per profile) — dense but defensible.
   - (b) Single global selector at the top of the page, all sections update.
   - (c) Inherit from Brief K's selector (read-only echo). User has to go back to Plan to change.
   - Default proposal: **(b)** — keep Conclusiones self-contained.

4. **"Objetivo cumplido" criteria.** What makes an Objetivo "cumplido" vs. "gap"? Numeric threshold per Objetivo type? Confirm with Jaime / Borja.

5. **Sidebar §5 section name.** "Conclusiones" as the section header reads odd if Informe is a sibling. Alternatives: "Cierre", "Resultado", "Síntesis". Default proposal: keep "Conclusiones" for now — rename in Brief N if Informe feels misplaced under it.

## Process — what to do when user says go

1. **First read (in order, always):** AGENTS.md → docs/strategy/plan.md → component-skill.md → token-skill.md → ds-token-guardian.md
2. **Read the existing surfaces** before touching code: WealthPlannerStore, Brief I/J/K/L shell wiring, the existing sidebar config.
3. **Close the Open decisions above** with the user — one question at a time per the project convention.
4. **Pull Figma** for any "Conclusiones" frame in `888lN7vbJSc4gLYt7nP3DW` — if none exists, flag and ship from PDF + this brief alone.
5. **Plan-mode gate** — produce a step list of file changes BEFORE editing.
6. **Build** — sections in order: store extensions → page (3 files) → sidebar → route.
7. **Token Guardian sweep** before commit.

## Non-goals (do not pull in)

- The Informe generation itself — that's Brief N. Conclusiones links to Informe but does not produce it.
- A real Monte Carlo / stochastic simulation engine — out of scope per Open decision #1.
- Editable conclusions — this is a derived read-out, not a free-text advisor note. (Advisor notes could be a future Brief.)
- New chart primitives — reuse `afi-chart-line`. If the overlay needs a new shape, propose it as a separate libs/ui task.

## Success looks like

The advisor finishes a session with the family. After working through Situación → Objetivos → Diagnóstico → Plan, they open Conclusiones and see a single screen that answers "did we land the plan?" — KPIs at the top, what's covered vs. open below, a clear chart showing where the family ends up, and a "Generar informe →" CTA that's enabled only when the plan is shippable.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/conclusiones` routes and renders
- [ ] 5 sections render with derived data (no manual seeds)
- [ ] Risk profile selector swaps all dependent sections atomically
- [ ] Objetivos rows link back to their originating page
- [ ] "Generar informe →" CTA gated on `canGenerateInforme()`
- [ ] Sidebar §5 section + Conclusiones chip wired
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the simulation-engine fidelity decision (1) and headline-KPI choices (2)
