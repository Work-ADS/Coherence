# AWP 2026 — Objetivos · Brief E: Legado y retiro

**Status:** ✅ complete — landed on `main` in commits `90efade` (page + shared banner + store + sidebar wiring) and `<this commit>` (status flip)
**Branch:** shipped directly to `main` (no feature branch was needed; work was bundled with sibling brief pages)
**Created:** 2026-05-25
**Completed:** 2026-05-26
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md) — Objetivos addendum

## Completion notes (2026-05-26)

- Page lives at [`apps/site/src/app/pages/demos/legado-retiro/legado-retiro.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/legado-retiro/legado-retiro.page.ts). Compiles clean, no console errors.
- Chrome was factored into a shared **`<site-objetivos-page-shell>`** at [`shared/objetivos-page-shell.component.ts`](../../apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-page-shell.component.ts) — encapsulates demo-shell + sidebar + top-bar + page-header + version-toggle slot + conditional banner mount. Briefs F/G/H reuse this same shell.
- **`<site-objetivos-banner>`** built at [`shared/objetivos-banner.component.ts`](../../apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-banner.component.ts) — uses `afi-badge` for the scenario chips; mocked values (1.92 M€ / 530 k€ / 0 €) per PDF p.6.
- Store extended with `LegadoObjetivo` type, `LegadoRetiroData` interface, `legadoRetiroEstablished` + `legadoRetiro` signals, `legadoRetiroState` computed, plus `setLegadoRetiroEstablished` / `setLegadoRetiro` / `setAssetToConservar` mutations.
- Route registered in [`demos.routes.ts`](../../apps/site/src/app/pages/demos/demos.routes.ts) and sidebar wired in [`planner-sidebar.component.ts`](../../apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts) (key `legado-retiro` reading `store.legadoRetiroState()`).
- Verified end-to-end in live preview: gate switch → faldón appears → banner mounts → `Manual` reveals asset checklist with running total (450.000 € selected) → age 56 shows cotizaciones checkbox, age 65 hides it → sidebar chip flips `empty` → `in-progress` → `complete`. Round-trip off→on preserves selections.
- **Note on the version toggle:** `<site-version-toggle>` is intentionally hidden globally via `display: none !important` in [`apps/site/src/styles.scss:17-22`](../../apps/site/src/styles.scss) — it was superseded by the floating design-review widget. The component still mounts in the DOM for future swapability; safe to remove the slot if v2/v3 layout forks aren't being added.
- **`isRetiroKind()`** set landed as 56–60 + 63/64 (the default proposal). Confirm with Borja if needed.

---

## What this session ships

The first of 4 Objetivos pages: **Legado y retiro** at `/demos/wealth-planner-2026/legado-retiro`. This is the **obligatory** section — the gestor must establish at least Edad de retiro and Legado objetivo before the Diagnóstico can run. The toggle that opens the faldón is the gate.

Also lands in this session: the shared **`<site-objetivos-banner>`** component (lives at `apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-banner.component.{ts,html,scss}`). It's the persistent scenario-projection strip — Edad de retiro · Legado · Optimista / Medio / Pesimista — that the next three Objetivos pages (F/G/H) also mount. It renders **only after `legadoRetiroEstablished()` is true**.

## Pre-flight reads (in order)

1. [`docs/strategy/plan.md`](docs/strategy/plan.md) — Objetivos addendum (added 2026-05-25)
2. [`docs/rules/component-skill.md`](docs/rules/component-skill.md)
3. [`docs/rules/token-skill.md`](docs/rules/token-skill.md)
4. [`docs/agents/planner.md`](docs/agents/planner.md) + [`docs/agents/ds-token-guardian.md`](docs/agents/ds-token-guardian.md)
5. Recent Situación Actual pages as chrome + form references:
   - [`apps/site/src/app/pages/demos/familia/familia.page.html`](apps/site/src/app/pages/demos/familia/familia.page.html) — toggle-and-faldón pattern (the "¿Tiene pareja?" Pareja section)
   - [`apps/site/src/app/pages/demos/sociedades/sociedades.page.html`](apps/site/src/app/pages/demos/sociedades/sociedades.page.html) — modal pattern (if you need any)
   - [`apps/site/src/app/pages/demos/wealth-planner-2026/store.ts`](apps/site/src/app/pages/demos/wealth-planner-2026/store.ts) — extend with Legado y retiro slice

## Sources of truth

- **Figma:** node `24:37352` ("↳ Legado y retiro") in file `888lN7vbJSc4gLYt7nP3DW`. Pull via `mcp__83105b11-1352-4e5d-863e-292cb5d82301__get_design_context`.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p.4 — "Legado y retiro (obligatorio)" section.
- **Granola:** sessions 2026-02-26 (planning) + 2026-02-27 (detailed walkthrough) + 2026-03-05 (component review w/ Borja).

## Chrome wrapping (LOCKED — every demo page)

Every page under `/demos/*` MUST wrap in `<site-demo-shell>`. Pattern (matches Familia / Sociedades / Ingresos / Gastos):

```html
<site-demo-shell
  [views]="['Legado y retiro']"
  demoSlug="legado-retiro"
  demoRoute="/demos/wealth-planner-2026/legado-retiro"
>
  <!-- page content -->
</site-demo-shell>
```

Add `DemoShellComponent` to the page's `imports`. The Banner mounts INSIDE the demo-shell, between the planner-top-bar and the page-header.

## Page composition (locked)

```
<site-demo-shell …>
  <div class="h-screen flex bg-canvas-base overflow-hidden">
    <site-planner-sidebar activeKey="legado-retiro" />
    <div class="flex-1 flex flex-col min-w-0">
      <site-planner-top-bar … />
      @if (store.legadoRetiroEstablished()) {
        <site-objetivos-banner />
      }
      <main class="flex-1 min-w-0 overflow-y-auto">
        <div class="max-w-[1180px] mx-auto py-space-8">
          <afi-page-header
            title="Legado y retiro"
            subtitle="Define qué quieres preservar y cuándo quieres retirarte. Este apartado es obligatorio."
            [sticky]="false" [scrollFade]="false"
          >
            <span slot="breadcrumb">OBJETIVOS</span>
          </afi-page-header>
          <site-version-toggle … />

          <!-- Main gate -->
          <section class="lr-gate">
            <afi-switch
              label="¿Has establecido legado y retiro?"
              hint="Activa para definir los objetivos del cliente."
              [checked]="store.legadoRetiroEstablished()"
              (checkedChange)="store.setLegadoRetiroEstablished($event)"
            />
          </section>

          @if (store.legadoRetiroEstablished()) {
            <!-- Edad de seguridad -->
            <section class="lr-section">
              <header class="lr-section__head"><h2>EDAD DE SEGURIDAD</h2></header>
              <afi-input
                label="Edad de seguridad"
                type="number"
                hint="Edad hasta la que debe durar el patrimonio (por defecto 100)."
                [value]="store.legadoRetiro().edadSeguridad"
                (valueChange)="setEdadSeguridad($event)"
              />
            </section>

            <!-- Legado objetivo -->
            <section class="lr-section">
              <header class="lr-section__head"><h2>LEGADO OBJETIVO</h2></header>
              <afi-select
                label="¿Qué quieres preservar?"
                [options]="legadoObjetivoOptions"
                [value]="store.legadoRetiro().legadoObjetivo"
                (valueChange)="setLegadoObjetivo($event)"
              />
              @if (showsManualLegado()) {
                <!-- Activos a conservar — multi-checkbox list -->
                <h3>Activos a conservar</h3>
                <ul class="lr-asset-list">
                  @for (asset of store.patrimonio(); track asset.id) {
                    <li class="lr-asset-list__row">
                      <afi-checkbox
                        [label]="asset.nombre + ' — ' + formatEuro(asset.valor)"
                        [checked]="isAssetSelected(asset.id)"
                        (checkedChange)="toggleAsset(asset.id, $event)"
                      />
                    </li>
                  }
                </ul>
                <p class="lr-total">
                  Total seleccionado: <strong>{{ totalSelected() }}</strong>
                </p>
                <afi-input
                  label="Patrimonio financiero adicional"
                  type="number"
                  [value]="store.legadoRetiro().patrimonioFinancieroAdicional"
                  (valueChange)="setPatrimonioFinancieroAdicional($event)"
                />
                <!-- TODO: € suffix once Brief B's afi-input enhancement lands -->
              }
            </section>

            <!-- Retiro objetivo -->
            <section class="lr-section">
              <header class="lr-section__head"><h2>RETIRO OBJETIVO</h2></header>
              <afi-select
                label="Edad de jubilación o retiro"
                [options]="edadJubilacionOptions"
                [value]="store.legadoRetiro().edadRetiro"
                (valueChange)="setEdadRetiro($event)"
              />
              @if (isRetiroKind()) {
                <afi-checkbox
                  label="Continuar cotizaciones hasta jubilación (recomendado)"
                  [checked]="store.legadoRetiro().continuarCotizaciones"
                  (checkedChange)="setContinuarCotizaciones($event)"
                />
              }
            </section>
          }
        </div>
      </main>
    </div>
  </div>
</site-demo-shell>
```

## Data — Legado objetivo options (locked)

```ts
readonly legadoObjetivoOptions: SelectOption[] = [
  { value: 'mantener-todo',         label: 'Mantener todo el patrimonio (endowment)' },
  { value: 'mantener-vivienda',     label: 'Mantener vivienda principal' },
  { value: 'manual',                label: 'Manual — seleccionar activos' },
];
```

## Data — Edad de jubilación options (locked, PDF p.5 screenshot)

```ts
readonly edadJubilacionOptions: SelectOption[] = [
  ...range(56, 60).map(n => ({ value: n, label: `${n} años` })),
  { value: 61, label: '61 años (jubilación involuntaria)' },
  { value: 62, label: '62 años (jubilación involuntaria)' },
  { value: 63, label: '63 años (jubilación voluntaria)' },
  { value: 64, label: '64 años (jubilación voluntaria)' },
  { value: 65, label: '65 años (jubilación ordinaria)' },
  ...range(66, 70).map(n => ({ value: n, label: `${n} años` })),
];
```

`isRetiroKind()` is a computed: true when the selected edad is in the "retiro" range (56–60, voluntary 63/64) — those are the kinds that allow the "Continuar cotizaciones" follow-up. Confirm exact set with Borja if ambiguous; default proposal: 56–60 + 63/64.

## Store extensions

```ts
export type LegadoObjetivo = 'mantener-todo' | 'mantener-vivienda' | 'manual';

export interface LegadoRetiroData {
  edadSeguridad: number;                 // default 100
  legadoObjetivo: LegadoObjetivo | null;
  activosConservar: string[];            // asset ids when legadoObjetivo === 'manual'
  patrimonioFinancieroAdicional: number; // €
  edadRetiro: number | null;             // 56-70
  continuarCotizaciones: boolean;
}

readonly legadoRetiroEstablished = signal<boolean>(false);
readonly legadoRetiro = signal<LegadoRetiroData>({ ...DEFAULTS });
readonly legadoRetiroState = computed<SectionState>(() => {
  if (!this.legadoRetiroEstablished()) return 'empty';
  const lr = this.legadoRetiro();
  if (lr.legadoObjetivo === null || lr.edadRetiro === null) return 'in-progress';
  if (lr.legadoObjetivo === 'manual' && lr.activosConservar.length === 0) return 'in-progress';
  return 'complete';
});

setLegadoRetiroEstablished(v: boolean): void { ... }
setLegadoRetiro(partial: Partial<LegadoRetiroData>): void { ... }
toggleAssetToConservar(id: string): void { ... }
```

## Banner — site-objetivos-banner

New 3-file site-local component at `apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-banner.component.{ts,html,scss}`.

**Inputs:** none — reads everything from `WealthPlannerStore`.

**Renders a horizontal strip** with two columns:
- Left: Objetivos (Edad de retiro: {n} años · Legado: "{n} activos + {€} en patrimonio financiero")
- Right: Legado estimado — three scenario chips:
  - Optimista: {€} (verde — using badge intent="positive")
  - Medio: {€} (naranja — badge intent="warning")
  - Pesimista: {€} (rojo — badge intent="negative")

**v1 mocked values** per PDF p.6 example: Optimista 1.92M€ · Medio 530K€ · Pesimista 0€ (agota a los 92 años). Hard-code as a `computed` over the store; the real simulation engine is Diagnóstico territory (out of scope).

**Visibility:** the page conditionally renders the banner only when `store.legadoRetiroEstablished()`. The component itself doesn't gate — that's the consumer's job.

## Open work — execution order

1. **Extend the store** with `LegadoRetiroData` + signal + computed state + mutations.
2. **Build the page** (3 files) — gate + 3 sections as above. Multi-checkbox list inline (don't extract until the same pattern appears in another brief).
3. **Build the Banner component** (3 files in `shared/`). Hardcoded values for v1.
4. **Register the route** in [`demos.routes.ts`](apps/site/src/app/pages/demos/demos.routes.ts):
   ```ts
   {
     path: 'wealth-planner-2026/legado-retiro',
     loadComponent: () => import('./legado-retiro/legado-retiro.page').then((m) => m.LegadoRetiroPage),
   },
   ```
5. **Wire the sidebar** — edit [`planner-sidebar.component.ts`](apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts) lines ~99–107 (the Objetivos section's items):
   ```ts
   {
     key: 'legado-retiro',
     label: 'Legado y retiro',
     state: this.store.legadoRetiroState(),
     route: '/demos/wealth-planner-2026/legado-retiro',
   },
   ```
6. **Version toggle** — v1 only, v2/v3 placeholders for future review forks.

## Verification

1. **Clean-code preflight** — grep new files for raw hex/rgba/px outside `libs/tokens/`. Zero matches.
2. **Token-guardian audit** — every styled property routes through a semantic token.
3. **3-file rule** — `ls apps/site/.../legado-retiro/` → exactly `legado-retiro.page.{ts,html,scss}`. Same for `shared/objetivos-banner.{ts,html,scss}`.
4. **Preview verification** — at 1440/1280/768:
   - Navigate to `/demos/wealth-planner-2026/legado-retiro` via sidebar
   - Toggle ON → faldón appears, Banner appears at top of page
   - Select "Manual" in Legado objetivo → "Activos a conservar" list appears
   - Select edad 56 → "Continuar cotizaciones" checkbox appears
   - Select edad 65 → checkbox disappears (jubilación ordinaria, not retiro)
   - Sidebar chip flips from `empty` → `in-progress` → `complete` as required fields fill
5. **Console clean** — zero errors or warnings on load + interaction.

## Decisions still open

- **`isRetiroKind()` set** — which edades count as "retiro" (vs jubilación)? Default proposal: 56–60 + 63/64. Confirm with Borja.
- **`€` suffix on Patrimonio financiero adicional input** — wait for Brief B's afi-input suffix/prefix enhancement (spawned task) OR compose inline with a `<span>€</span>` adjacent. v1: compose inline.
- **Banner real values** — currently mocked per PDF example. Real simulation engine is Diagnóstico's job. Flag in PR description.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/legado-retiro` routes and renders
- [ ] Toggle gates the faldón correctly
- [ ] Banner appears at top of page when toggle is ON, disappears when OFF
- [ ] Banner reads Optimista / Medio / Pesimista values (mocked v1)
- [ ] All 3 sections (Edad de seguridad · Legado objetivo · Retiro objetivo) functional
- [ ] Multi-checkbox "Activos a conservar" list works with running total
- [ ] `LegadoRetiroData` slice in store + sidebar state computed
- [ ] Sidebar chip + route wired
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR description notes the Banner mocking + the `isRetiroKind` open question
