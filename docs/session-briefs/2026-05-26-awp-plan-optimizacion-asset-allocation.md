# AWP 2026 — Plan de acción · Brief L: Optimización del asset allocation

**Status:** parked, awaits user "go" — **blocked by Brief K** (shared `PerfilRiesgo` type)
**Branch:** `feature/awp-plan-optimizacion-asset-allocation` (to be created)
**Created:** 2026-05-26
**Activates:** second of the Plan de acción chunk (Brief K → L) — closes the 9-screen map ahead of Conclusiones / Informe
**Plan reference:** [`/Users/richardgriner/.claude/plans/add-the-flow-to-robust-cherny.md`](../../.claude/plans/add-the-flow-to-robust-cherny.md) — Deliverable 5

---

## What this session ships

The second of two Plan de acción pages: **Optimización del asset allocation** at `/demos/wealth-planner-2026/optimizacion-asset-allocation`. Read-only output that visualizes expected portfolio evolution under the chosen risk profile, with the option to compare multiple profiles on the same chart.

PDF p.9-10 is largely a "remove these AWP-2025 controls" list — most of the work is establishing a leaner layout that's just risk-profile selector + evolution chart + comparison toggle.

## Pre-flight reads

Same six as Brief I, plus:
7. Brief K's `PerfilRiesgo` type + perfilOptions (Brief L imports these)
8. Brief I's chart wiring for the evolution series

## Sources of truth

- **Figma:** TBD — pull from `888lN7vbJSc4gLYt7nP3DW` "Optimización asset allocation" frame before activation.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) pp. 9–10 — §4.c. Drop the first definition screen; lift the listboxes to a top filter strip with `Vista` (default `comparada`) + `Escenario` (default `medio`) + a `Comparar perfiles de riesgo` toggle that swaps to all-profiles chart.
- **Screens (added 2026-05-27):** `Afi brand/Wealth manager screens 2026/Optimización del asset allocation/`:
  - `Perfil de riesgo_.png` + `-1.png` + `-2.png` — "Evolución esperada" tab; Vista=Comparada + Escenario=Medio + Actual vs Optimizada lines
  - `Comparar perfiles de riesgo.png` — "Comparativa de perfiles" tab; 5-line chart (Actual / Conservadora / Moderada / Dinámica / Agresiva)
  - `Empty.png` + `-1.png` + `-2.png` — empty / partial states
  - `Tooltips.png` + variants — tooltip overlays
- **Granola:** sessions 2026-02-26 + 2026-02-27 + 2026-03-05.

## Coding standards

Inherited from [chore-sidebar brief § Coding standards](2026-05-27-awp-chore-sidebar-section-5-6-split.md#coding-standards-locked-from-brief-i):

- **3-file rule** — `.ts` + `.html` + `.scss`, NO inline template / styles.
- **Reuse libs/ui primitives** — `<afi-page-header>`, `<afi-tabs>` + `<afi-tab-item>` for the 2-tab layout, `<afi-select>` for Vista + Escenario, `<afi-evolucion-bar-chart>` or `<afi-chart-line>` for the projection. Comparar perfiles toggle uses `<afi-switch>` or `<afi-button variant="ghost">`.
- **Tokens only in SCSS** — zero hex / rgb / bare px.
- **Tailwind utilities for layout** matching Brief I.
- **Visual anchor:** Brief I + the existing `EvolucionPatrimonialProposalPage` patterns. The filter strip mirrors Evolución patrimonial's; the chart slot reuses the same primitive.
- **Cross-brief state:** `PerfilRiesgo` + `perfilRiesgoActivo` signal now live in the store (added by the [chore-sidebar brief](2026-05-27-awp-chore-sidebar-section-5-6-split.md)). Consume `store.perfilRiesgoActivo()` — do NOT declare local profile state. The "Comparar perfiles" toggle overrides this with an all-profiles view but the underlying `perfilRiesgoActivo` should stay the persisted user choice.

## Chrome wrapping

`<site-objetivos-page-shell>` with inline `<afi-page-header>` carrying `breadcrumb="PLAN DE ACCIÓN"`. Banner gated on `legadoRetiroEstablished()`.

## Page composition (locked)

```html
<site-objetivos-page-shell
  [views]="['Optimización del asset allocation']"
  demoSlug="optimizacion-asset-allocation"
  demoRoute="/demos/wealth-planner-2026/optimizacion-asset-allocation"
  activeKey="optimizacion-asset-allocation"
  [showBanner]="store.legadoRetiroEstablished()"
>
  <afi-page-header
    title="Optimización del asset allocation"
    subtitle="Distribución óptima del patrimonio financiero según el perfil de riesgo."
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb">PLAN DE ACCIÓN</span>
  </afi-page-header>

  <!-- ─── 1. Perfil de riesgo (left panel — sole control) ────── -->
  <section class="aa-section aa-section--controls">
    <header class="aa-section__head">
      <h2 class="aa-section__title">Perfil de riesgo</h2>
    </header>
    <afi-select
      label="Perfil"
      [options]="perfilOptions"
      [value]="store.perfilRiesgoSeleccionado()"
      (valueChange)="setPerfil($event)"
    />
  </section>

  <!-- ─── 2. Evolución esperada (right panel — chart) ────────── -->
  <section class="aa-section aa-section--chart">
    <header class="aa-section__head aa-section__head--with-controls">
      <h2 class="aa-section__title">Evolución esperada</h2>
      <div class="aa-controls">
        <afi-select
          ariaLabel="Vista"
          [options]="vistaOptions"
          [value]="store.vistaAssetAllocation()"
          (valueChange)="setVista($event)"
        />
        <afi-select
          ariaLabel="Escenario"
          [options]="escenarioOptions"
          [value]="store.escenarioAssetAllocation()"
          (valueChange)="setEscenario($event)"
        />
        <afi-switch
          label="Comparar perfiles"
          [checked]="store.compararPerfiles()"
          (checkedChange)="store.setCompararPerfiles($event)"
        />
      </div>
    </header>

    <afi-chart-line
      [series]="evolucionAssetAllocationSeries()"
      [legend]="store.compararPerfiles() ? perfilLegend() : null"
      ariaLabel="Evolución esperada del asset allocation"
    />
  </section>
</site-objetivos-page-shell>
```

**Explicitly removed per PDF**: every other left-panel control beyond Perfil de riesgo; "Valor esperado a los 10 años" on the right; the detail selector; the "Adjustments" button.

## Data — option sets

```ts
// Imported from Brief K
import type { PerfilRiesgo } from '../wealth-planner-2026/store';

readonly vistaOptions: SelectOption[] = [
  { value: 'comparada', label: 'Vista comparada' },
  { value: 'individual', label: 'Vista individual' },
];

readonly escenarioOptions: SelectOption[] = [
  { value: 'optimista', label: 'Optimista' },
  { value: 'medio',     label: 'Medio' },
  { value: 'pesimista', label: 'Pesimista' },
];
```

When `compararPerfiles` is ON, the chart renders all 4 profiles (4 series) for the selected escenario. When OFF, just the single `perfilRiesgoSeleccionado` series.

## Store extensions

```ts
readonly perfilRiesgoSeleccionado = signal<PerfilRiesgo>('moderado');
readonly vistaAssetAllocation     = signal<'comparada' | 'individual'>('comparada');
readonly escenarioAssetAllocation = signal<Scenario>('medio');
readonly compararPerfiles         = signal<boolean>(false);

readonly optimizacionAssetAllocationState = computed<SectionState>(() => 'complete');

setPerfilRiesgoSeleccionado(value: PerfilRiesgo): void { ... }
setVistaAssetAllocation(value: 'comparada' | 'individual'): void { ... }
setEscenarioAssetAllocation(value: Scenario): void { ... }
setCompararPerfiles(value: boolean): void { ... }
```

## Mock chart series

Inline computed on the page: per-profile expected return curves (conservador slow + flat, arriesgado steep + volatile). Use a small constants table at the top of the page TS for per-profile parameters. Real engine is Conclusiones territory.

## Sidebar wiring

```ts
{
  key: 'optimizacion-asset-allocation',
  label: 'Optimización del asset allocation',
  state: this.store.optimizacionAssetAllocationState(),
  route: '/demos/wealth-planner-2026/optimizacion-asset-allocation',
},
```

## Routes

```ts
{
  path: 'wealth-planner-2026/optimizacion-asset-allocation',
  loadComponent: () =>
    import('./optimizacion-asset-allocation/optimizacion-asset-allocation.page').then(
      (m) => m.OptimizacionAssetAllocationPage,
    ),
},
```

## Open work — execution order

1. **Slice: 4 signals + state computed + 4 setters**.
2. **Page (3 files)** — controls panel + evolution chart with per-profile / per-scenario filtering.
3. **Mock per-profile return curves** — small constants table.
4. **Route + sidebar wiring**.

## Verification

Standard 5-point check, plus:
- Page renders with default perfil (moderado), default vista (comparada), default escenario (medio)
- Change perfil → chart re-renders with new single-series curve (when comparar is OFF)
- Toggle "Comparar perfiles" ON → chart shows 4 series with legend chips colored per profile
- Change escenario → all rendered series update to the new scenario's curve
- Sidebar chip stays `complete` regardless of selections (it's a read-out)
- Banner mounts iff `legadoRetiroEstablished()` is true

## Decisions still open

- **Vista comparada vs individual semantics** — "comparada" might mean "show vs benchmark" rather than "show all profiles". Clarify with Borja before locking the option labels.
- **Legend interaction** — should clicking a legend chip dim/hide that profile in the comparison view? Default v1: no, all 4 always show.
- **Number of profiles in comparison** — proposal: all 4. If Borja wants the gestor to opt-in profile-by-profile, swap the switch for a multi-select chip group. Decide on first visual review.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/optimizacion-asset-allocation` routes and renders
- [ ] Perfil de riesgo selector controls the single-series curve
- [ ] "Comparar perfiles" toggle shows all 4 profiles with distinct colors + legend
- [ ] Escenario dropdown swaps the scenario curves
- [ ] Sidebar chip stays `complete` on first load
- [ ] Banner mounts iff Legado y retiro is established
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the vista-comparada semantics + legend-interaction open questions
- [ ] **9-screen map closed up to Conclusiones** — confirms the chunk is shippable

## Closes the Plan de acción chunk

After Brief L lands, the AWP simulator surfaces 8 of the 9 mapped screens. Only **Conclusiones / Informe** remains — separate planning session.
