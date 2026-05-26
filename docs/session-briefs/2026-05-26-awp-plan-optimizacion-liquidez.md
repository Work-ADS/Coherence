# AWP 2026 — Plan de acción · Brief K: Optimización de la liquidez

**Status:** parked, awaits user "go" — **blocked by Brief I** (chart + table pattern) and Deliverable 0 (shell refactor)
**Branch:** `feature/awp-plan-optimizacion-liquidez` (to be created)
**Created:** 2026-05-26
**Activates:** first of the Plan de acción chunk (Brief K → L)
**Plan reference:** [`/Users/richardgriner/.claude/plans/add-the-flow-to-robust-cherny.md`](../../.claude/plans/add-the-flow-to-robust-cherny.md) — Deliverable 4

---

## What this session ships

The first of two Plan de acción pages: **Optimización de la liquidez** at `/demos/wealth-planner-2026/optimizacion-liquidez`. Optional — gated by a switch. Once activated, simulates investing annual surpluses according to a chosen risk profile and covers deficits from previously generated savings.

PDF p.9-10 verbatim:
> *"La optimización de la liquidez simula que en todos los años en que se genera un exceso de ahorro, éste se invierte según el perfil de riesgo establecido en esta pantalla. En los años en que existe un déficit de liquidez, se simula que el déficit se cubre con el ahorro previamente generado."*

Visually mirrors Patrimonio previsto (line chart + scenario table), but with an "optimized" overlay against the baseline. Plus a risk-profile selector.

## Pre-flight reads

Same six as Brief I, plus:
7. Brief I's Patrimonio previsto page — the chart+table pattern this brief reuses
8. PDF p.9-10 — the "remove this, remove that" deltas from the AWP-2025 version

## Sources of truth

- **Figma:** TBD — pull from `888lN7vbJSc4gLYt7nP3DW` "Optimización de liquidez" frame before activation.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) pp. 9–10.
- **Granola:** sessions 2026-02-26 + 2026-02-27.

## Chrome wrapping

`<site-objetivos-page-shell>` with inline `<afi-page-header>` carrying `breadcrumb="PLAN DE ACCIÓN"`. Banner gated on `legadoRetiroEstablished()`.

## Page composition (locked)

```html
<site-objetivos-page-shell
  [views]="['Optimización de la liquidez']"
  demoSlug="optimizacion-liquidez"
  demoRoute="/demos/wealth-planner-2026/optimizacion-liquidez"
  activeKey="optimizacion-liquidez"
  [showBanner]="store.legadoRetiroEstablished()"
>
  <afi-page-header
    title="Optimización de la liquidez"
    subtitle="Activa la simulación para invertir los excesos de ahorro según un perfil de riesgo."
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb">PLAN DE ACCIÓN</span>
  </afi-page-header>

  <!-- ─── Gate switch ────────────────────────────────────────────── -->
  <section class="ol-gate">
    <afi-switch
      label="¿Activar optimización de liquidez?"
      hint="Simula que los años con exceso se invierten y los años con déficit se cubren con el ahorro previo."
      [checked]="store.optimizacionLiquidezEnabled()"
      (checkedChange)="store.setOptimizacionLiquidezEnabled($event)"
    />
  </section>

  @if (store.optimizacionLiquidezEnabled()) {
    <!-- ─── Risk profile selector ─────────────────────────────── -->
    <section class="ol-section">
      <header class="ol-section__head">
        <h2 class="ol-section__title">Perfil de riesgo</h2>
      </header>
      <afi-select
        label="Perfil"
        [options]="perfilOptions"
        [value]="store.perfilRiesgoOptimizacion()"
        (valueChange)="setPerfil($event)"
        placeholder="Selecciona"
      />
    </section>

    <!-- ─── Evolution chart with optimized overlay ────────────── -->
    <section class="ol-section">
      <header class="ol-section__head">
        <h2 class="ol-section__title">Evolución optimizada vs. base</h2>
      </header>
      <afi-chart-line
        [series]="evolucionOptimizadaSeries()"
        ariaLabel="Evolución optimizada por escenario"
      />
    </section>

    <!-- ─── Scenario read-out ─────────────────────────────────── -->
    <section class="ol-section">
      <header class="ol-section__head">
        <h2 class="ol-section__title">Por escenario</h2>
      </header>
      <afi-table
        [columns]="scenarioCols"
        [rows]="store.patrimonioPrevisto()"
        density="comfortable"
        [rowHoverable]="false"
      />
    </section>
  }
</site-objetivos-page-shell>
```

**Removed per PDF**: "Colchón de liquidez inmediata" control and "Primera pantalla (definición)" — both AWP-2025 artifacts being deprecated. Do not port them.

## Data — Perfil de riesgo options

```ts
export type PerfilRiesgo =
  | 'conservador'
  | 'moderado'
  | 'decidido'
  | 'arriesgado';

readonly perfilOptions: SelectOption[] = [
  { value: 'conservador', label: 'Conservador' },
  { value: 'moderado',    label: 'Moderado' },
  { value: 'decidido',    label: 'Decidido' },
  { value: 'arriesgado',  label: 'Arriesgado' },
];
```

Confirm the exact set during build — Borja may have a 5th "muy arriesgado" or use Spanish ESG naming. Default proposal: 4 above.

## Store extensions

```ts
readonly optimizacionLiquidezEnabled = signal<boolean>(false);
readonly perfilRiesgoOptimizacion = signal<PerfilRiesgo | null>(null);

readonly optimizacionLiquidezState = computed<SectionState>(() => {
  if (!this.optimizacionLiquidezEnabled()) return 'empty';
  if (this.perfilRiesgoOptimizacion() === null) return 'in-progress';
  return 'complete';
});

setOptimizacionLiquidezEnabled(value: boolean): void { ... }
setPerfilRiesgoOptimizacion(value: PerfilRiesgo | null): void { ... }
```

## Mock chart series

The "optimized" overlay multiplies each Patrimonio previsto scenario by a per-profile factor (e.g. moderado ≈ 1.08, decidido ≈ 1.15). Compute inline on the page; real simulation engine is Conclusiones territory.

## Sidebar wiring

```ts
{
  key: 'optimizacion-liquidez',
  label: 'Optimización de la liquidez',
  state: this.store.optimizacionLiquidezState(),
  route: '/demos/wealth-planner-2026/optimizacion-liquidez',
},
```

## Routes

```ts
{
  path: 'wealth-planner-2026/optimizacion-liquidez',
  loadComponent: () =>
    import('./optimizacion-liquidez/optimizacion-liquidez.page').then(
      (m) => m.OptimizacionLiquidezPage,
    ),
},
```

## Open work — execution order

1. **`PerfilRiesgo` type + perfilOptions** — added to store; reused by Brief L.
2. **Slice: enabled + perfil signals + state computed + setters**.
3. **Page (3 files)** — gate + risk selector + chart + table.
4. **Mock optimization factors** — inline per-profile multipliers; document the mapping in a code comment for the next iteration.
5. **Route + sidebar wiring**.

## Verification

Standard 5-point check, plus:
- Gate off → no sections render; sidebar chip `empty`
- Gate on, no perfil → 3 sections render; chip `in-progress`
- Pick a perfil → series re-render with the optimized overlay; chip `complete`
- Toggle gate off → all sections hide; chip back to `empty`; perfil signal persists for next activation
- Banner mounts iff `legadoRetiroEstablished()` is true

## Decisions still open

- **Perfil set** — 4 (proposal) vs 5+ (need Borja confirmation)
- **Optimization factor source** — inline mock vs reading from a constants table. Default: inline with a TODO referencing the real engine
- **Show the baseline vs optimized series simultaneously** — proposal: yes, both visible (4 baseline + 4 optimized = 8 series). If that's too noisy, swap to a toggle to switch between baseline-only and optimized-only views. Decide during live verification

## Exit criteria

- [ ] `/demos/wealth-planner-2026/optimizacion-liquidez` routes and renders
- [ ] Gate switch reveals/hides the sections
- [ ] `PerfilRiesgo` type added to store and reused-ready for Brief L
- [ ] Sidebar chip transitions empty → in-progress → complete based on gate + perfil
- [ ] Chart re-renders when perfil changes
- [ ] Banner mounts iff Legado y retiro is established
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the perfil-set + baseline-overlay open questions
