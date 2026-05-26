# AWP 2026 — Objetivos · Brief F: Inversiones futuras

**Status:** ✅ complete — landed on `main` in `<this commit>`
**Branch:** `feature/awp-objetivos-inversiones-futuras` → merged + deleted
**Created:** 2026-05-25
**Completed:** 2026-05-26
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md) — Objetivos addendum

## Completion notes (2026-05-26)

- Page lives at [`apps/site/src/app/pages/demos/inversiones-futuras/inversiones-futuras.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/inversiones-futuras/inversiones-futuras.page.ts). Reuses the shared `<site-objetivos-page-shell>` from Brief E, so chrome (demo-shell + sidebar + planner-top-bar + page-header + banner gate) is one line of HTML.
- Store extended with `InversionFuturaTipo`, `InversionFuturaRow`, `inversionesFuturas` signal, `inversionesFuturasState` computed (`empty` / `in-progress` — no `complete` because the section is optional), and `addInversionFutura` / `updateInversionFutura` / `removeInversionFutura` mutations.
- Titular options derived from `store.familiaParticipantes` mapped to `SelectOption[]` — same source as Sociedades' participación accionarial picker.
- Route registered in [`demos.routes.ts`](../../apps/site/src/app/pages/demos/demos.routes.ts). Sidebar entry now reads `store.inversionesFuturasState()` with a real `route` field (replacing the hardcoded `'empty'` placeholder).
- Empty state + populated table + add/edit/delete modal all verified live. Row click opens edit modal prepopulated, trash icon removes row.
- Banner mounts iff `legadoRetiroEstablished()` — toggled the gate off and confirmed the banner disappears.
- **Deviation from original brief layout:** the `+ Añadir inversión futura` button was originally specced as `slot="actions"` inside the page-header. Multi-level ng-content projection through the shared shell didn't carry the slot attribute through to `<afi-page-header>`, so the button now lives in a right-aligned `.if-toolbar` directly above the table when rows exist (and inside the empty-state CTA when no rows). Visually similar, no behavioral loss. If we want it back inside the page-header later, the cleanest fix is to refactor the shell to accept an `<ng-template>` for actions via `ngTemplateOutlet` — recorded here so the next iteration knows.
- `€` suffix on Importe still composed inline via `<span>€</span>` next to the input (waiting on Brief B's afi-input suffix/prefix enhancement).
- Console clean, no compile errors.

---

## What this session ships

The second of 4 Objetivos pages: **Inversiones futuras** at `/demos/wealth-planner-2026/inversiones-futuras`. Optional section — captures planned future investments (Vivienda or Otros). Table + add/edit modal pattern, same shape as Sociedades and Ingresos/Gastos.

## Pre-flight reads

Same six as Brief E, plus:
7. [`apps/site/src/app/pages/demos/sociedades/sociedades.page.{ts,html}`](apps/site/src/app/pages/demos/sociedades/sociedades.page.ts) — table + edit modal pattern (clean reference)
8. [`apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-banner.component.ts`](apps/site/src/app/pages/demos/wealth-planner-2026/shared/objetivos-banner.component.ts) — Banner built in Brief E

## Sources of truth

- **Figma:** node `28:174808` ("↳ Inversiones futuras") in file `888lN7vbJSc4gLYt7nP3DW`.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p.5 — "Inversiones futuras (opcional)".
- **Granola:** sessions 2026-02-26 + 2026-02-27.

## Chrome wrapping (LOCKED — every demo page)

```html
<site-demo-shell
  [views]="['Inversiones futuras']"
  demoSlug="inversiones-futuras"
  demoRoute="/demos/wealth-planner-2026/inversiones-futuras"
>
  <!-- chrome + banner (when established) + page content -->
</site-demo-shell>
```

The `<site-objetivos-banner>` from Brief E mounts at the top of the page (between top-bar and page-header), conditionally on `store.legadoRetiroEstablished()`.

## Page composition (locked)

```
<site-demo-shell>
  <div class="h-screen flex bg-canvas-base overflow-hidden">
    <site-planner-sidebar activeKey="inversiones-futuras" />
    <div class="flex-1 flex flex-col min-w-0">
      <site-planner-top-bar … />
      @if (store.legadoRetiroEstablished()) {
        <site-objetivos-banner />
      }
      <main class="flex-1 min-w-0 overflow-y-auto">
        <div class="max-w-[1180px] mx-auto py-space-8">
          <afi-page-header
            title="Inversiones futuras"
            subtitle="Adquisiciones de activos previstas en el futuro (opcional)."
            [sticky]="false" [scrollFade]="false"
          >
            <span slot="breadcrumb">OBJETIVOS</span>
            <afi-button
              slot="actions"
              variant="primary" size="sm"
              (clicked)="openAdd()"
            >+ Añadir inversión futura</afi-button>
          </afi-page-header>
          <site-version-toggle … />

          @if (store.inversionesFuturas().length === 0) {
            <!-- Empty state -->
            <div class="if-empty">
              <h2>Aún no hay inversiones futuras registradas.</h2>
              <p>Es opcional. Añade una si el cliente planea comprar una vivienda u otro activo en el futuro.</p>
              <afi-button variant="primary" (clicked)="openAdd()">+ Añadir inversión futura</afi-button>
            </div>
          } @else {
            <!-- Table -->
            <table class="if-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Año</th>
                  <th class="if-table__th--num">Importe</th>
                  <th class="if-table__th--actions"><span class="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                @for (inv of store.inversionesFuturas(); track inv.id) {
                  <tr (click)="openEdit(inv.id)">
                    <td>{{ inv.nombre || 'Sin nombre' }}</td>
                    <td>{{ tipoLabel(inv.tipo) }}</td>
                    <td>{{ inv.anio }}</td>
                    <td class="if-table__td--num">{{ formatEuro(inv.importe) }}</td>
                    <td class="if-table__td--actions">
                      <afi-icon-button variant="ghost" ariaLabel="Editar"  …>edit</afi-icon-button>
                      <afi-icon-button variant="destruction" ariaLabel="Borrar" …>trash</afi-icon-button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </main>
    </div>
  </div>
</site-demo-shell>

<!-- Add / edit modal -->
<afi-modal [open]="dialogOpen()" title="Inversión futura" size="md" …>
  @if (editing(); as i) {
    <div class="if-form">
      <afi-input label="Nombre" placeholder="Vivienda principal" [value]="i.nombre" (valueChange)="setNombre($event)" />
      <afi-select label="Tipo" [options]="tipoOptions" [value]="i.tipo" (valueChange)="setTipo($event)" />
      <afi-input label="Año en que se realizará" type="number" [value]="i.anio ?? ''" (valueChange)="setAnio($event)" />
      <afi-input label="Importe" type="number" [value]="i.importe" (valueChange)="setImporte($event)" />
      <!-- €  suffix via inline span; replace with afi-input suffix when that lands -->
      <afi-select label="Titular" placeholder="Selecciona" [options]="titularOptions()" [value]="i.titular" (valueChange)="setTitular($event)" />
    </div>
  }
  <ng-container slot="footer">
    <afi-button variant="ghost" (clicked)="closeDialog()">Cancelar</afi-button>
    <afi-button variant="primary" (clicked)="closeDialog()">Guardar</afi-button>
  </ng-container>
</afi-modal>
```

## Data — Tipo options (locked, PDF p.5)

```ts
readonly tipoOptions: SelectOption[] = [
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'otros',    label: 'Otros' },
];
```

PDF says "Vivienda (tipo Unicaja)" — Unicaja-flavored visual is not required for v1; the same `afi-select` + Banner work. If extra Vivienda-specific fields are eventually needed (m², ubicación, hipoteca, etc.), they live in a later iteration.

## Titular options

Derived from the Familia store — same pattern as Sociedades' participación accionarial. The `titularOptions` computed reads `cliente()`, `conyuge()`, `hijos()`, `ascendientes()` and emits `{ value: 'cliente' | 'conyuge' | hijo.id | asc.id, label }[]`.

## Store extensions

```ts
export type InversionFuturaTipo = 'vivienda' | 'otros';

export interface InversionFuturaRow {
  id: string;
  nombre: string;
  tipo: InversionFuturaTipo | null;
  anio: number | null;
  importe: number;
  titular: string | null; // cliente | conyuge | hijo-{n} | asc-{n}
}

readonly inversionesFuturas = signal<InversionFuturaRow[]>([]);
readonly inversionesFuturasState = computed<SectionState>(() =>
  this.inversionesFuturas().length === 0 ? 'empty' : 'in-progress',
);

addInversionFutura(): InversionFuturaRow { ... }
updateInversionFutura(id: string, partial: Partial<InversionFuturaRow>): void { ... }
removeInversionFutura(id: string): void { ... }
```

## Open work — execution order

1. Extend store with `InversionFuturaRow` + signal + computed + CRUD.
2. Build the page (3 files) — empty state, table, add/edit modal.
3. Register route in `demos.routes.ts`.
4. Wire sidebar — `inversiones-futuras` key + route + state.
5. Mount `<site-objetivos-banner>` at top, gated by `store.legadoRetiroEstablished()`.

## Verification

Standard 5-point check (clean-code, token-guardian, 3-file, preview, console clean), plus:
- Empty state renders + add button opens dialog
- Add row → table appears
- Edit row → modal opens prepopulated
- Delete row → row removed
- Sidebar chip flips empty → in-progress on first add

## Decisions still open

- **Vivienda-specific fields** — the PDF says "tipo Unicaja". Are extra fields (superficie, hipoteca…) needed? Default v1: no, just the common ones. Park.
- **`€` suffix on Importe** — inline `<span>€</span>` until Brief B's afi-input enhancement lands.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/inversiones-futuras` routes and renders
- [ ] Empty state + populated table + add/edit modal all functional
- [ ] Banner appears at top (when Legado y retiro is established)
- [ ] Sidebar Inversiones futuras chip + route wired
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] Preview verified at 1440/1280/768
