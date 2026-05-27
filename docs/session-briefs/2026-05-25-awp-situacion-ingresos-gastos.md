# AWP 2026 — Situación Actual · Brief D: Ingresos + Gastos

**Status:** parked, awaits user "go" — **blocked by Briefs A + B + C** (needs the WealthPlannerStore in full, plus the `<afi-input>` suffix/percentage primitive update from Brief B, plus the retiro/jubilación age from Brief C's Patrimonio store if available — otherwise mocked)
**Branch:** `feature/awp-situacion-ingresos-gastos`
**Created:** 2026-05-25
**Activates:** after Brief C ships
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md)

---

## What this session ships

The final two Situación Actual pages in one session, because they share an identical pattern:

1. **Ingresos** at `/demos/wealth-planner-2026/ingresos`
2. **Gastos** at `/demos/wealth-planner-2026/gastos`

Plus the **shared reusable** `<site-ingreso-gasto-form-modal>` component at `apps/site/src/app/pages/demos/wealth-planner-2026/shared/`. Same modal, two pages, two store slices.

Borja-driven changes (PDF pp.3–4, Granola 2026-02-26 + 2026-03-05):

1. **Ingresos and Gastos go in separate sections** (like Unicaja) — was previously one combined table.
2. Within each section: **a single table** for current + future (not split into two tables).
3. Future rows carry an **"futuro" etiqueta** (`<afi-status-chip>` or `<afi-badge>`). The "nuevo" and "modificado" labels are **removed**.
4. Add/edit modal flow with structured Inicio + Finalización listbox families.

## Pre-flight reads

Same six as Brief A, plus:

7. `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts` — extend ingresos + gastos signals
8. Brief B's modal pattern for reference (table + modal trigger from `<afi-page-header>`)

## Sources of truth

- **Figma:** Ingresos node `14:45012` ("↳ Ingresos ✅"), Gastos node `16:173942` ("↳ Gastos ✅"). Canonical:
  - `15:165902` — Ingresos page (populated)
  - `23:32416` — Ingresos page (alt)
  - `15:169270` — Gastos page (populated)
  - `23:34392` — Gastos page (alt)
  - Multiple modal overlays beneath each page node — the add/edit dialog variants
- **PDF:** pp.3–4 — "Ingresos" + "Gastos" sections + seed data examples
- **Granola:** 2026-02-26 (initial planning), 2026-03-05 (Borja confirmed: separate sections, single table per section, "futuro" etiqueta only, "Lo mismo que en ingresos" for Gastos)

## Chrome wrapping (LOCKED — every demo page)

Both pages MUST wrap their template in `<site-demo-shell>` — the project's feedback + handoff center (inspect mode + comment pins + viewport sizer). Pattern:

```html
<site-demo-shell
  [views]="['Ingresos']"   <!-- or ['Gastos'] on the other page -->
  demoSlug="ingresos"      <!-- or 'gastos' -->
  demoRoute="/demos/wealth-planner-2026/ingresos"
>
  <!-- page content -->
</site-demo-shell>
```

Add `DemoShellComponent` to each page's `imports` array. See [Familia page](apps/site/src/app/pages/demos/familia/familia.page.html) for the working example.

## Page composition (locked — identical for both routes)

```
<site-planner-top-bar />
<site-planner-sidebar [activeKey]="'ingresos' | 'gastos'" />
<main>
  <afi-page-header
    [title]="mode === 'ingreso' ? 'Ingresos' : 'Gastos'"
    [subtitle]="introCopy"
    [actions]="addAction" />

  <site-version-toggle />

  @if (rows().length === 0) {
    <!-- Empty state — copy from Figma -->
    <site-empty-state-ingresos-gastos
      [mode]="mode"
      (addClicked)="openAddDialog()" />
  } @else {
    <afi-table [columns]="cols" [rows]="rows()">
      <!-- Column "etiqueta" renders <afi-status-chip variant="info"> when row.isFuturo -->
      <!-- Per-row trailing column hosts <afi-menu> with Editar/Borrar -->
    </afi-table>
  }
</main>

@if (dialogOpen()) {
  <site-ingreso-gasto-form-modal
    [mode]="mode"
    [initialValue]="editingRow()"
    [familyState]="store.hijos()"
    [retiroAge]="store.retiroAge()"
    (submitted)="onSubmit($event)"
    (cancelled)="closeDialog()" />
}
```

### Intro copy

- **Ingresos:** *"Introduce aquí todos los ingresos del cliente. Tanto los actuales como los previstos (por ejemplo, en la jubilación)."* (PDF p.3, verbatim)
- **Gastos:** *"Introduce aquí todos los gastos del cliente. Tanto los actuales como los previstos."*

## The shared modal — `<site-ingreso-gasto-form-modal>`

Lives at `apps/site/src/app/pages/demos/wealth-planner-2026/shared/ingreso-gasto-form-modal.component.{ts,html,scss}` (3 files, BEM, semantic tokens — full DS discipline).

### Inputs

```ts
readonly mode = input.required<'ingreso' | 'gasto'>();
readonly initialValue = input<IngresoGastoRow | null>(null);
readonly familyState = input<HijoData[]>([]);  // For "Hasta edad de un hijo"
readonly retiroAge = input<number | null>(null);  // From Patrimonio store, if set
```

### Outputs

```ts
readonly submitted = output<IngresoGastoRow>();
readonly cancelled = output<void>();
```

### Form structure (PDF p.3–4)

```
<afi-modal [title]="title">
  Concepto (afi-input)
  Es un ingreso/gasto futuro? (afi-switch) — applies to all rows; default No
    └── if Sí:
        Inicio (afi-select):
          - A partir de retiro
          - Jubilación
          - Manual (edad)   → afi-input type="number" "Edad" (e.g. 72)
          - Manual (año)    → afi-input type="number" "Año" (e.g. 2040)
  Finalización (afi-select) — always visible:
    - Indefinido
    - Hasta retiro o jubilación
    - Hasta edad de un hijo
      └── Listbox (afi-select) of familyState() hijos
      └── afi-input type="number" "Edad de finalización"
    - Manual (edad)         → afi-input type="number"
    - Manual (año)          → afi-input type="number"
  Frecuencia (afi-select: Mensual / Trimestral / Semestral / Anual)
  Incremento (afi-select: Manual)   ← IPC removed per Borja 2026-02-27
    └── afi-input type="number" suffix="%"
  Valor (afi-input type="number" suffix="€")
</afi-modal>
```

### IngresoGastoRow shape

```ts
type IngresoGastoRow = {
  id: string;
  concepto: string;
  isFuturo: boolean;
  inicio?: {
    kind: 'retiro' | 'jubilacion' | 'edad' | 'ano';
    value?: number;  // edad or año
  };
  finalizacion: {
    kind: 'indefinido' | 'retiro-jubilacion' | 'edad-hijo' | 'edad' | 'ano';
    hijoId?: string;  // when kind === 'edad-hijo'
    value?: number;   // edad de finalización, or edad/año
  };
  frecuencia: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  // IPC dropped per Borja 2026-02-27 — manual is the only option.
  incrementoManualPct: number;  // 0 means no incremento
  valor: number;  // euros
};
```

## Seed data (from PDF p.4)

- **Ingreso futuro (Ingresos seed):** *"Herencia Manuel"* — already in Figma; use the design's values.
- **Gasto futuro 1:** Concepto: Dependencia y cuidados · Inicio: 2050 · Fin: Indefinido · ~~Incremento: IPC~~ → Incremento manual (PDF said IPC, but IPC was retired by Borja 2026-02-27 — use 3% manual as a sensible default) · Frecuencia: Anual · Valor: 50.000 €
- **Gasto futuro 2:** Concepto: Incremento ocio · Inicio: Retiro · Fin: 2050 · ~~Incremento: IPC~~ → Incremento manual 3% · Frecuencia: Anual · Valor: 60.000 €

Seed both stores on first visit so the populated tables are visible without setup.

## Open work — execution order

1. **Build the shared modal first** — `site-ingreso-gasto-form-modal`. 3 files. Test in isolation by mounting it briefly in one of the pages with a mock value.

2. **Extend the store** — add `ingresos = signal<IngresoGastoRow[]>([])` + `gastos = signal<IngresoGastoRow[]>([])` + CRUD methods for each. Seed with the PDF examples.

3. **Build the Ingresos page** — 3 files. Passes `mode="ingreso"`.

4. **Build the Gastos page** — 3 files. Passes `mode="gasto"`. Identical chrome, different store slice + intro copy.

5. **Register both routes** in [`demos.routes.ts`](apps/site/src/app/pages/demos/demos.routes.ts).

6. **Wire sidebar routes** in [`planner-sidebar.component.ts`](apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts) lines 69–70:
   ```ts
   { key: 'ingresos', label: 'Ingresos', state: 'in-progress', route: '/demos/wealth-planner-2026/ingresos' },
   { key: 'gastos',   label: 'Gastos',   state: 'empty',       route: '/demos/wealth-planner-2026/gastos'   },
   ```
   State computed: `empty` when `length === 0`, `in-progress` when 1+ row exists, `complete` when… (decision below).

7. **Empty-state component** — optional, may compose inline. Mirror the Figma empty state if present.

8. **No new primitives proposed** — every form control already exists (assuming Brief B's `afi-input` suffix update is in).

## "Nota para Richard" (PDF p.4)

> *"Dale una vuelta a cómo diferenciamos ingresos y gastos futuros (tal vez etiqueta)."*

The answer (locked in this brief): **single `<afi-status-chip variant="info" label="Futuro">` in a dedicated "Etiqueta" column.** No separate tables, no "nuevo" / "modificado" labels. Only "futuro" gets a chip.

## Verification

Standard 6-point check, plus:

- The same modal component renders in both `/ingresos` and `/gastos` (literal reuse — confirm by adding a `console.log` in the modal's constructor and seeing it fire on both)
- "Es un ingreso/gasto futuro?" switch reveals the Inicio listbox; selecting *Manual (edad)* reveals the edad input; selecting *Manual (año)* reveals the año input — all conditional rendering works
- Finalización *Hasta edad de un hijo* reveals the Hijo listbox sourced from `WealthPlannerStore.hijos()` — confirm the Hijos from Brief A flow through
- The "futuro" chip appears in the etiqueta column ONLY for rows with `isFuturo === true`
- Seed data renders on first visit: Ingresos shows "Herencia Manuel"; Gastos shows the two PDF examples

## Decisions still open

- **"Complete" semantics for Ingresos sidebar chip** — `complete` when at least 1 current-income row exists? Or when retiro/jubilación coverage is captured? Default: `in-progress` whenever rows exist, `complete` only when the gestor explicitly marks the section reviewed (out of scope for v1 — leave as `in-progress` forever). Confirm with user.
- **Tax handling on Valor** — PDF mentions IPC as default incremento; doesn't mention gross/net. v1 captures gross only. Mark in the PR for follow-up.
- **Editing existing rows** — the modal accepts `initialValue` but the page needs to wire `openAddDialog` vs `openEditDialog(row)`. Default: clicking a row opens edit; the `+ Añadir` button opens add.

## Exit criteria

- [ ] `<site-ingreso-gasto-form-modal>` exists, 3 files, fully composed from DS primitives
- [ ] `/demos/wealth-planner-2026/ingresos` and `/demos/wealth-planner-2026/gastos` route and render
- [ ] Same modal component instance type renders in both pages
- [ ] Store has `ingresos` + `gastos` signals + CRUD; seed data lands on first visit
- [ ] "futuro" chip appears in the right column, only for futuro rows
- [ ] Sidebar `Ingresos` + `Gastos` chips + routes wired; state flips based on row count
- [ ] Conditional sub-fields (Inicio kind, Finalización kind, Incremento manual) all branch correctly
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] Preview verified at 3 viewport presets
- [ ] PR closes the Situación Actual chunk — link the 4 briefs in the description for the case study
