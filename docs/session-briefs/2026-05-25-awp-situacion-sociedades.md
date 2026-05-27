# AWP 2026 — Situación Actual · Brief B: Sociedades

**Status:** parked, awaits user "go" — **blocked by Brief A** (needs the shared `WealthPlannerStore` + Familia signal data for the participación accionarial matrix)
**Branch:** `feature/awp-situacion-sociedades`
**Created:** 2026-05-25
**Activates:** after Brief A ships
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md)

---

## What this session ships

The second Situación Actual page: **Sociedades** at `/demos/wealth-planner-2026/sociedades`. New section in 2026 — Borja-introduced. Captures the investment vehicles (sociedades patrimoniales / holdings / SOCIMI) through which the family invests, plus per-member shareholder participation.

Borja (Granola 2026-02-26): *"En caso de que existan, añade aquí las sociedades a través de las que invierte la familia. Lo habitual es tener entre 0 y 2 sociedades, pero puede haber más."* (PDF p.1)

Confirmed Mar 5: Tributación options = **Patrimonial · Holding · SOCIMI** (Borja said *"esto no me lo borres porque luego tenemos que ver si son estos tres o son cuáles son"* on Feb 26 — Mar 5 locked it).

## Pre-flight reads

Same six as Brief A (plan.md, component-skill, token-skill, planner agent, token-guardian agent, patrimonial as pattern), plus:

7. `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts` (built in Brief A) — for the family signal data
8. [`apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.ts`](apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.ts) lines 100–200 — the add-asset modal pattern (Sociedades reuses this shape)

## Sources of truth

- **Figma:** node `4:17626` ("↳ Sociedades ✅"). Frames:
  - `7:15629` — empty state ("Sociedad empty")
  - `12:42751` — populated table (Sociedad/1)
  - `9:20456` — populated table 2 sociedades (Sociedad/2)
  - `9:20736` — add/edit dialog (Sociedad/dialog)
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p.1
- **Granola:** 2026-02-26 (planning), 2026-03-05 (Tributación list locked)

## Chrome wrapping (LOCKED — every demo page)

Every page under `/demos/*` MUST wrap its template in `<site-demo-shell>` — it's the project's feedback + handoff center (inspect mode + comment pins + viewport sizer). Without it, design can't leave feedback on the page. Pattern:

```html
<site-demo-shell
  [views]="['Sociedades']"
  demoSlug="sociedades"
  demoRoute="/demos/wealth-planner-2026/sociedades"
>
  <!-- page content goes here -->
</site-demo-shell>
```

Add `DemoShellComponent` to the page's `imports` array. See [Familia page](apps/site/src/app/pages/demos/familia/familia.page.html) for the working example.

## Page composition (locked)

```
<site-planner-top-bar />
<site-planner-sidebar activeKey="sociedades" />
<main>
  <afi-page-header
    title="Sociedades"
    subtitle="Empresas a través de las que invierte la familia."
    [actions]="addAction" />   ← + Añadir sociedad

  <site-version-toggle />

  @if (sociedades().length === 0) {
    <!-- Empty state matches Figma 7:15629 -->
    <site-empty-state-sociedades (addClicked)="openAddDialog()" />
  } @else {
    <afi-table [columns]="cols" [rows]="sociedades()">
      <!-- Per-row trailing column hosts <afi-menu> with Editar/Borrar -->
    </afi-table>
  }
</main>

@if (dialogOpen()) {
  <afi-modal title="Añadir sociedad" (close)="closeDialog()">
    <afi-input label="Nombre" placeholder="Inversiones Siglo XXI, SL" />
    <afi-select label="Tributación" [options]="tributacionOptions" />
    <!-- Participación accionarial -->
    <h3>Participación accionarial</h3>
    <table>
      @for (member of participantes(); track member.id) {
        <tr>
          <td>{{ member.label }}</td>
          <td><afi-input type="number" suffix="%" /></td>
        </tr>
      }
    </table>
    <afi-button variant="ghost">+ Añadir miembro</afi-button>
    <!-- Submit / Cancel -->
  </afi-modal>
}
```

## Primitive policy — **AFI-input gap**

`<afi-input>` already supports `type="number"` (verified at [`libs/ui/src/input/input.variants.ts`](libs/ui/src/input/input.variants.ts) — union `'text' | 'textarea' | 'number' | 'email' | 'password'`). But it does NOT have:

- A **`suffix`** input or icon-end slot for `%` / `€` rendering
- Locale-aware formatting (`es-ES` thousand separators on `€`)

**Pre-flight gate:** before any markup lands, decide between:

- **(A) Extend `<afi-input>`** with `suffix?: string` + `iconEnd?: string`. Locale formatting on `type="number"` when `mode="currency" | "percentage"`. Small PR — should be 1–2 hours. **Recommended.** Per memory "DS eats own dogfood" — the suffix slot is universal enough to belong on the primitive.
- **(B) Compose the `%` suffix inline** in the page template (e.g. `<div class="input-row"><afi-input /><span>%</span></div>`). Faster but creates pressure to extract later. **Anti-pattern per "Reuse primitives, don't write bespoke".**

**If (A):** open a side session for the primitive update first (component-skill + Builder + Token-Guardian), then resume Sociedades. New afi-input inputs: `suffix?: string`, `prefix?: string`. SCSS gets `.afi-input__suffix` / `.afi-input__prefix` BEM blocks. Tests in the input page.

## Tributación options (locked)

```ts
readonly tributacionOptions: SelectOption[] = [
  { value: 'patrimonial', label: 'Patrimonial' },
  { value: 'holding', label: 'Holding' },
  { value: 'socimi', label: 'SOCIMI' },
];
```

If the user / Aline / Ignacio Marqués later confirms additional options (per PDF p.1 "REVISAR CON ALINE / IGNACIO MARQUÉS"), this is a 1-line array extension.

## Participación accionarial — data shape

Each sociedad has an array of participants. A participant can be a family member OR the sociedad itself (PDF p.1: *"En las cajitas de patrimonio tiene que poderse poner tanto las personas como la sociedad"*):

```ts
type ParticipanteSociedad = {
  id: string;                // 'cliente' | 'conyuge' | 'hijo-1' | 'sociedad-{id}'
  label: string;             // Display name
  porcentaje: number;        // 0–100, NOT required to sum to 100
};

type Sociedad = {
  id: string;
  nombre: string;
  tributacion: 'patrimonial' | 'holding' | 'socimi';
  participantes: ParticipanteSociedad[];
};
```

Participantes are seeded from `WealthPlannerStore.cliente()`, `.conyuge()`, `.hijos()` — the brief A store gives us this directly.

## Open work — execution order

1. **Primitive preflight** (if path A chosen): extend `<afi-input>` with `suffix` + `prefix` + currency/percentage locale formatting. Update [`libs/ui/src/input/input.component.ts`](libs/ui/src/input/input.component.ts), `.html`, `.scss`, `.variants.ts`. Verify the input page at `/componentes/input` still renders.
2. **Store extension** — extend `WealthPlannerStore` with `sociedades = signal<Sociedad[]>([])` + `addSociedad()` + `editSociedad()` + `removeSociedad()` methods.
3. **Empty state component** — `apps/site/src/app/pages/demos/sociedades/empty-state.component.ts` (or compose inline if simple). Mirror Figma `7:15629`.
4. **Add/edit dialog** — composed inline in `sociedades.page.html` (modal opens/closes via `dialogOpen` signal). Reuses the patrimonial dialog pattern.
5. **Route registration** in [`demos.routes.ts`](apps/site/src/app/pages/demos/demos.routes.ts).
6. **Sidebar route wire** in [`planner-sidebar.component.ts`](apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts) line 67:
   ```ts
   { key: 'sociedades', label: 'Sociedades', state: 'empty', route: '/demos/wealth-planner-2026/sociedades' },
   ```
   State: `empty` when `sociedades().length === 0`, otherwise `complete` (Sociedades is optional — empty IS a valid completed state, but we use `empty` because the gestor hasn't engaged. Confirm with user.)
7. **Seed data** — for demo flavor, prefill one *Inversiones Siglo XXI, SL* sociedad on first visit (so the populated-table state is visible without setup). Reset via the demo-shell `restart` button.

## Verification

Same 6-point check as Brief A, plus:

- Add sociedad → row appears in table; row click reopens the dialog with the saved values
- Tributación dropdown shows exactly 3 options
- Participación accionarial matrix shows all current family members from the store
- Percentages do NOT validate against `sum === 100` (per PDF — empty/partial sums are valid)
- Per-row `<afi-menu>` Borrar removes the row; Editar reopens the dialog

## Decisions still open

- **Full Tributación option list** — Patrimonial / Holding / SOCIMI is the working set. PDF says "REVISAR CON ALINE / IGNACIO MARQUÉS". Park as a non-blocker; surface in the PR description.
- **Sidebar state semantics** when `sociedades().length === 0` — treat as `empty` (gestor hasn't engaged) or `complete` (Sociedades is optional, nothing to enter is also done)? Default: `empty`.
- **Should the sociedad itself appear as a participante row** of OTHER sociedades? PDF says yes; default: yes, with `id: 'sociedad-{id}'`.

## Exit criteria

- [ ] `<afi-input>` has `suffix` + `prefix` + locale formatting (if path A) OR explicit decision to skip (path B documented in PR)
- [ ] `/demos/wealth-planner-2026/sociedades` routes and renders empty + populated states
- [ ] Add/edit modal works end-to-end; participación matrix sources from Familia store
- [ ] `WealthPlannerStore.sociedades` signal + CRUD methods exist
- [ ] Sidebar `Sociedades` chip + route wired
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] Preview verified at 3 viewport presets
- [ ] PR notes the Tributación open question for follow-up with Aline/Ignacio
