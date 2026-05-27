# AWP 2026 — Conclusiones · Brief M2: Consecución de objetivos

**Status:** drafted 2026-05-27, awaits user "go"
**Branch:** `feature/awp-conclusiones-consecucion-objetivos` (to be created)
**Created:** 2026-05-27
**Activates:** after the [chore-sidebar §5/§6 split](2026-05-27-awp-chore-sidebar-section-5-6-split.md) lands. **Does NOT block on Briefs K + L** — ships with mock optimization factors that K and L later replace.
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-now-let-s-plan-concurrent-quiche.md`](../../.claude/plans/okay-now-let-s-plan-concurrent-quiche.md) — Brief 2

---

## Why this exists

After the gestor walks through Diagnóstico (Patrimonio previsto + Estrategias) and Plan de acción (Liquidez + Asset allocation), Consecución de objetivos is the **one-screen read-out** that answers: *did the plan close the gap?* It puts the same scenario read-out from Patrimonio previsto next to a "después del plan" version of itself, so the gestor can show the family — at a glance — how the recommended actions move every metric per scenario.

The screen is intentionally simple: a single wide table, no chart. The whole story is in the seven columns.

## What this session ships

New page at `/demos/wealth-planner-2026/conclusiones/consecucion-objetivos`.

Page composition (locked from the screen):

```
<afi-page-header title="Consecución de objetivos" breadcrumb="CONCLUSIONES">
<table>
  Escenario | Antes del plan ── (Cobertura vital | Legado inmo | Legado financiero)
            | Después del plan ── (Cobertura vital | Legado inmo | Legado financiero)
─────────────────────────────────────────────────────────────────────────────────
  Objetivo  | 100+ años | 3,02M€ | 1,52M€ | 100+ años | 3,02M€ | 1,52M€      ← italic baseline (no color)
  Optimista | 100+ años | 4,12M€ | 1,93M€ (green) | 100+ años | 4,12M€ | 2,33M€ (green)
  Medio     | 100+ años | 2,73M€ | 1,22M€ (orange) | 100+ años | 2,73M€ | 1,99M€ (green)
  Pesimista | 87 años (red) | 1,03M€ | 0,00M€ (red) | 92 años (red) | 1,03M€ | 0,00M€ (red)
```

Color-coding rules (from PDF p. 10 + Brief I established):
- **Cobertura vital**: red if `< 100`; "100+ años" if ≥ 100.
- **Legado financiero**: green if `>= Objetivo`, orange if `>= 80%` of Objetivo, red if `< 80%`.
- **Legado inmobiliario**: neutral (no color treatment), per Brief I.
- **Objetivo row**: italic, muted color, no per-cell tints — it's the reference.

Reuses the **`.pp-table` styles from Brief I** (`apps/site/src/app/pages/demos/patrimonio-previsto/patrimonio-previsto.page.scss`). Either import or duplicate the rules — proposed: extract `.pp-table` into a shared partial `_scenario-table.scss` under `apps/site/src/app/pages/demos/wealth-planner-2026/shared/` so both pages consume it. **Open decision below.**

## Coding standards

Inherited from [chore-sidebar brief § Coding standards](2026-05-27-awp-chore-sidebar-section-5-6-split.md#coding-standards-locked-from-brief-i):

- **3-file rule** — `.ts` + `.html` + `.scss`, NO inline template / styles.
- **Reuse libs/ui primitives** — `<afi-page-header>`, status-chip-equivalent styling via tokens, etc. Hand-rolled `<table>` is OK here because it mirrors Brief I's `.pp-table` pattern (which is itself page-scoped, not a primitive yet).
- **Tokens only in SCSS** — zero hex / rgb / bare px. Pre-commit hook enforces.
- **Tailwind utilities for layout** matching Brief I (`mx-space-8 mt-space-6 …`).
- **Visual anchor:** the locked sibling is Patrimonio previsto. This page should feel like its read-only summary cousin.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md` + `docs/rules/component-skill.md` + `docs/rules/token-skill.md`
2. The chore-sidebar brief — confirms `consecucionObjetivosState` exists in the store as a stub computed
3. `apps/site/src/app/pages/demos/patrimonio-previsto/patrimonio-previsto.page.{ts,html,scss}` — the table styling pattern + color-coding logic to mirror
4. `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts` — current `patrimonioPrevisto` + `ScenarioRow`
5. Brief K (`2026-05-26-awp-plan-optimizacion-liquidez.md`) — see what shape the optimization factor will eventually take
6. Brief L (`2026-05-26-awp-plan-optimizacion-asset-allocation.md`) — same

## Sources of truth

- **Figma:** PDF cites this exact table layout in §5.b (column structure decided in conversation, "DECIDE RICHARD" note in PDF). Pull the Consecución de objetivos frame from `888lN7vbJSc4gLYt7nP3DW` before activation.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p. 10 — §5.b *"Consecución de objetivos: Columnas: Escenario | (Cobertura vital | Legado inmobiliario | Legado financiero) x2 (Antes del plan de acción | Después del plan de acción)"*. Includes the exact row values for the four scenarios in the "después" version.
- **Screen:** `Afi brand/Wealth manager screens 2026/Consecución de objetivos/DEFAULT.png` — single screen, locked.

## Chrome wrapping

Uses `<site-objetivos-page-shell>` (the post-refactor chrome locked in Brief I). Banner gates on `legadoRetiroEstablished()`. Sidebar `activeKey="consecucion-objetivos"`.

```html
<site-objetivos-page-shell
  [views]="['Consecución de objetivos']"
  demoSlug="consecucion-objetivos"
  demoRoute="/demos/wealth-planner-2026/conclusiones/consecucion-objetivos"
  activeKey="consecucion-objetivos"
  [showBanner]="store.legadoRetiroEstablished()"
>
  <afi-page-header
    title="Consecución de objetivos"
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb" class="uppercase tracking-wider text-action-700">
      CONCLUSIONES
    </span>
  </afi-page-header>

  <div class="mx-space-8 mt-space-6">
    <div class="rounded-lg border border-border-hairline overflow-hidden">
      <table class="pp-table w-full">
        <thead>
          <tr class="pp-table__head-row">
            <th rowspan="2">Escenario</th>
            <th colspan="3">Antes del plan de acción</th>
            <th colspan="3">Después del plan de acción</th>
          </tr>
          <tr class="pp-table__head-row">
            <th class="pp-table__th--num">Cobertura vital</th>
            <th class="pp-table__th--num">Legado inmobiliario</th>
            <th class="pp-table__th--num">Legado financiero</th>
            <th class="pp-table__th--num">Cobertura vital</th>
            <th class="pp-table__th--num">Legado inmobiliario</th>
            <th class="pp-table__th--num">Legado financiero</th>
          </tr>
        </thead>
        <tbody>
          @for (row of store.consecucionObjetivos(); track row.scenario) {
            <tr class="pp-table__row" [class.pp-table__row--objetivo]="row.scenario === 'objetivo'">
              <td>{{ scenarioLabel(row.scenario) }}</td>
              <td class="pp-table__td--num" [class]="coberturaClass(row.antes.coberturaVitalAnios)">
                {{ formatCobertura(row.antes.coberturaVitalAnios) }}
              </td>
              <td class="pp-table__td--num">{{ formatEuro(row.antes.legadoInmobiliario) }}</td>
              <td class="pp-table__td--num" [class]="legadoFinClass(row.antes.legadoFinanciero)">
                {{ formatEuro(row.antes.legadoFinanciero) }}
              </td>
              <!-- después columns mirror the antes columns with row.despues.* -->
              ...
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
</site-objetivos-page-shell>
```

## Store extensions

```ts
// ── Conclusiones — Consecución de objetivos (Brief M2) ───────────────────
//
// Antes = patrimonioPrevisto (Brief I).
// Después = patrimonioPrevisto × OptimizationFactors.
// v1 ships with mock factors that match the screen's exact post-plan values.
// Briefs K (Liquidez) and L (Asset allocation) later replace these with real
// store reads from their respective optimization slices.

export interface OptimizationFactors {
  /** Multiplier applied to legadoFinanciero (Brief K's liquidez optimization). */
  liquidez: number;
  /** Multiplier applied across all legado metrics (Brief L's asset allocation). */
  assetAllocation: number;
}

// Mock — calibrated to match screen values (1.93 → 2.33, 1.22 → 1.99, etc.).
// Replace with derived computed when K + L ship.
readonly optimizationFactors = signal<OptimizationFactors>({
  liquidez: 1.10,
  assetAllocation: 1.08,
});

export interface ConsecucionRow {
  scenario: Scenario;
  antes: { coberturaVitalAnios: number; legadoInmobiliario: number; legadoFinanciero: number };
  despues: { coberturaVitalAnios: number; legadoInmobiliario: number; legadoFinanciero: number };
}

readonly consecucionObjetivos = computed<ConsecucionRow[]>(() => {
  const factors = this.optimizationFactors();
  return this.patrimonioPrevisto().map((row) => {
    const factor = factors.liquidez * factors.assetAllocation;
    return {
      scenario: row.scenario,
      antes: { ...row /* the brief-I ScenarioRow shape */ },
      despues: {
        coberturaVitalAnios: row.coberturaVitalAnios + (row.scenario === 'pesimista' ? 5 : 0),
        legadoInmobiliario: row.legadoInmobiliario, // Inmobiliario unchanged by optimization
        legadoFinanciero: Math.round(row.legadoFinanciero * factor),
      },
    };
  });
});

readonly consecucionObjetivosState = computed<SectionState>(() => 'complete');
```

**Data shape note:** Brief I's current `ScenarioRow` uses `coberturaVital: number` representing years (not euros — fixed after the user feedback during the Brief I rebuild). This brief inherits that convention. If the field name is still `coberturaVital`, leave it; if it was renamed to `coberturaVitalAnios`, this brief uses the renamed version. Confirm during activation.

## Formatting helpers (on the page component)

Reuse Brief I's helpers verbatim:
- `scenarioLabel(s: Scenario): string` — display name
- `formatCobertura(anios: number): string` — `"100+ años"` if ≥ 100, else `"N años"` (red class when <100)
- `formatEuro(value: number): string` — `"1,93 M €"` formatting
- `coberturaClass(anios: number)` / `legadoFinClass(value: number, objetivoValue: number)` — color modifier strings

The two `class` helpers compare to Objetivo's value (the baseline row). Extract them into a small helper class or keep page-local — defer.

## Sidebar wiring

Already handled by the chore-sidebar brief. This brief just verifies the `consecucion-objetivos` chip transitions from the chore's stub `empty` to `complete` once the new computed lands.

## Routes

```ts
{
  path: 'wealth-planner-2026/conclusiones/consecucion-objetivos',
  loadComponent: () =>
    import('./consecucion-objetivos/consecucion-objetivos.page').then(
      (m) => m.ConsecucionObjetivosPage,
    ),
},
```

## Open work — execution order

1. **Extract shared scenario-table SCSS** (Open decision below): either `_scenario-table.scss` partial OR duplicate `.pp-table` rules. Proposal: extract.
2. **Add `OptimizationFactors`, `optimizationFactors` signal, `ConsecucionRow`, `consecucionObjetivos` computed** to the store. Replace stub `consecucionObjetivosState` from the chore brief with the real `'complete'` computed.
3. **Build page** (3 files):
   - `apps/site/src/app/pages/demos/consecucion-objetivos/consecucion-objetivos.page.ts`
   - `.html`
   - `.scss`
4. **Register route**.
5. **Verify** the table values match the screen exactly (Optimista 1,93 → 2,33 etc.).

## Open decisions (need user input before build)

1. **Shared `.pp-table` extraction** — partial vs. duplicate. Default: **extract** to `apps/site/src/app/pages/demos/wealth-planner-2026/shared/_scenario-table.scss` and `@use` it from both pages.

2. **Cobertura vital "después" delta logic.** The mock above adds 5 años for Pesimista only (matching the screen's 87 → 92). What's the real rule when K and L wire in? Default proposal: years stay equal except when the active plan lifts a previously-red scenario to ≥ 100 (clamp at 100). Open until K and L are concrete.

3. **Live updates.** Should "Después" recompute live as the user toggles K (liquidez ON/OFF) or changes L's perfil de riesgo? Default proposal: **yes** — that's the whole point of the page. When K/L ship, the `optimizationFactors` computed becomes derived from their state.

## Non-goals (do not pull in)

- Real simulation engine — Conclusiones territory but explicitly out of scope for this brief.
- The Patrimonio previsto chart or KPI cards — Consecución is *just* the table.
- Editing the values inline — read-only.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/conclusiones/consecucion-objetivos` routes and renders
- [ ] Table values match the screen exactly: Optimista 1,93 → 2,33; Medio 1,22 → 1,99; Pesimista cobertura 87 → 92, financiero 0,00 → 0,00
- [ ] Color-coding matches Brief I's rules (cobertura red < 100; legado financiero green / orange / red against Objetivo)
- [ ] Objetivo row is italic, muted
- [ ] Sidebar Consecución de objetivos chip shows `complete` on first load
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the shared-table-SCSS extraction decision (1) + the mock OptimizationFactors values it ships with
