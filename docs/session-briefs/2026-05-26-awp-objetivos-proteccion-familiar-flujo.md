# AWP 2026 — Objetivos · Brief H-Plus: Protección familiar — Flujo

**Status:** parked, awaits user "go" — **builds on Brief H** ([Protección familiar](2026-05-25-awp-objetivos-proteccion-familiar.md), already complete)
**Branch:** `feature/awp-proteccion-familiar-flujo` (to be created)
**Created:** 2026-05-26
**Activates:** when the user is ready to replace the placeholder modal with the real wizard
**Plan reference:** [`/Users/richardgriner/.claude/plans/add-the-flow-to-robust-cherny.md`](../../.claude/plans/add-the-flow-to-robust-cherny.md) — Deliverable 1

---

## What this session ships

Replaces the placeholder modal in [`proteccion-familiar.page.html`](../../apps/site/src/app/pages/demos/proteccion-familiar/proteccion-familiar.page.html) with a real multi-step wizard. The current modal (one body paragraph + a "Marcar como activada" button) becomes a 4-step `afi-modal` size="lg" that captures the structured protección data the brief originally promised.

When the gestor finishes the wizard, the row's `activa` flag flips to `true` AND the structured `producto` payload is stored. Cancel discards the in-flight payload but preserves any previously activated state.

## Pre-flight reads

1. The shipped Brief H page: [`proteccion-familiar.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/proteccion-familiar/)
2. The shipped Brief H store slice: [`store.ts`](../../apps/site/src/app/pages/demos/wealth-planner-2026/store.ts) — `ProteccionFamiliarData` interface and the `setClienteActiva` / `setConyugeActiva` mutations
3. The wizard reference (closest pattern shipped): Sarevi's multi-route step nav in [`laboral-kutxa-sarevi.page.{ts,html}`](../../apps/site/src/app/pages/demos/laboral-kutxa-sarevi/) — note this uses a route signal, NOT a modal. Adapt: keep all 4 steps inside one modal, swap content via `currentStep()` signal.
4. The Familia source for the beneficiary picker: `store.familiaParticipantes` (computed in [`store.ts`](../../apps/site/src/app/pages/demos/wealth-planner-2026/store.ts) — emits `cliente / conyuge / hijo-{n} / asc-{n}` rows)
5. [`docs/rules/component-skill.md`](../../docs/rules/component-skill.md) + [`docs/rules/token-skill.md`](../../docs/rules/token-skill.md)

## Sources of truth

- **Figma:** TBD — no Figma node exists for the wizard yet. Pull from PDF + Granola or draft a new Figma frame before activation.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p.6 — "Flujo de protección familiar" is referenced but not specced; details deferred to this brief.
- **Granola:** sessions 2026-02-26 + 2026-02-27 mention Borja's framing of protección as a per-product capture (life / disability / dependency).

## Open questions (resolve one-at-a-time at activation per memory rule)

These shape the data model and step set. Surface them in order; don't batch.

1. **Cardinality per protégé** — one product per row (cliente has at most 1, cónyuge has at most 1) OR multiple products per row (list of policies)? Default proposal: **multiple**. Most families carry separate life + disability + dependency products and the page should reflect that.
2. **Product types in v1** — proposal: `seguro-vida` · `incapacidad-temporal` · `incapacidad-permanente` · `dependencia` · `salud`. Confirm with Borja which subset ships in v1; leave the rest as future product types.
3. **Sub-fields per product type** — do different products need different fields? Proposal v1: same 4 fields for all (tipo / beneficiario / capital / prima) and treat per-type sub-fields as a v2 enhancement.
4. **Cliente vs cónyuge variance** — does the wizard differ between the two rows? Default: no. Same wizard, same fields, only the row context changes.
5. **Edit flow** — clicking "Consultar" on an activated row should open the wizard prepopulated with the row's product. Confirm.

## Page composition (locked once Q1–Q5 are answered)

Assuming defaults above:

```html
<!-- proteccion-familiar.page.html (modal section) -->
<afi-modal [open]="wizardOpen()" title="Configurar protección familiar"
  size="lg" [closeOnEsc]="true" [closeOnBackdrop]="false"
  (openChange)="$event ? null : cancelWizard()">

  <!-- Step indicator (4 steps) -->
  <ol class="pf-wizard__steps">
    <li [class.pf-wizard__step--current]="step() === 1">1. Tipo</li>
    <li [class.pf-wizard__step--current]="step() === 2">2. Beneficiario</li>
    <li [class.pf-wizard__step--current]="step() === 3">3. Capital</li>
    <li [class.pf-wizard__step--current]="step() === 4">4. Prima</li>
  </ol>

  <!-- Step bodies — only one renders at a time -->
  @if (step() === 1) {
    <afi-segmented-control [options]="tipoOptions" [value]="draft().tipo"
      (valueChange)="setDraftTipo($event)" ariaLabel="Tipo de producto" />
  }
  @if (step() === 2) {
    <afi-select label="Beneficiario" [options]="beneficiarioOptions()"
      [value]="draft().beneficiarioId" (valueChange)="setDraftBeneficiario($event)"
      [searchable]="true" />
  }
  @if (step() === 3) {
    <afi-input label="Capital asegurado" type="number"
      [value]="draft().capital" (valueChange)="setDraftCapital($event)" />
    <!-- € suffix inline; replace with afi-input prefix/suffix when that lands -->
  }
  @if (step() === 4) {
    <afi-input label="Prima anual" type="number"
      [value]="draft().prima" (valueChange)="setDraftPrima($event)" />
    <p class="pf-wizard__summary">
      Resumen — {{ tipoLabel(draft().tipo) }} para
      {{ beneficiarioLabel(draft().beneficiarioId) }}: capital
      {{ formatEuro(draft().capital) }} · prima
      {{ formatEuro(draft().prima) }}/año.
    </p>
  }

  <ng-container slot="footer">
    @if (step() > 1) {
      <afi-button variant="ghost" size="md" (clicked)="prevStep()">Atrás</afi-button>
    }
    <afi-button variant="ghost" size="md" (clicked)="cancelWizard()">Cancelar</afi-button>
    @if (step() < 4) {
      <afi-button variant="primary" size="md" [disabled]="!stepValid()"
        (clicked)="nextStep()">Siguiente</afi-button>
    } @else {
      <afi-button variant="primary" size="md" [disabled]="!stepValid()"
        (clicked)="saveProducto()">Guardar protección</afi-button>
    }
  </ng-container>
</afi-modal>
```

## Store changes

The current `ProteccionFamiliarData` is just `{ cliente: { activa }, conyuge: { activa } }`. Extend:

```ts
export type ProductoProteccionTipo =
  | 'seguro-vida'
  | 'incapacidad-temporal'
  | 'incapacidad-permanente'
  | 'dependencia'
  | 'salud';

export interface ProductoProteccion {
  id: string;
  tipo: ProductoProteccionTipo;
  beneficiarioId: string;          // familiaParticipantes id
  capital: number;
  prima: number;
}

export interface ProteccionFamiliarPerson {
  activa: boolean;                 // mirrors current flag; true ↔ productos.length > 0
  productos: ProductoProteccion[];
}

export interface ProteccionFamiliarData {
  cliente: ProteccionFamiliarPerson;
  conyuge: ProteccionFamiliarPerson;
}
```

Add CRUD:
- `addProteccionProducto(row: 'cliente' | 'conyuge', producto: Omit<ProductoProteccion, 'id'>): ProductoProteccion`
- `updateProteccionProducto(row, id, partial)`
- `removeProteccionProducto(row, id)` — when removing the last product, also flip `activa` to `false`

`proteccionFamiliarState` computed updates: `complete` requires at least one product on `cliente` and (when `tienePareja`) one on `cónyuge`.

## Wizard state (page-local)

```ts
readonly wizardRow = signal<'cliente' | 'conyuge' | null>(null);
readonly wizardOpen = computed(() => this.wizardRow() !== null);
readonly step = signal<1 | 2 | 3 | 4>(1);
readonly draft = signal<Partial<ProductoProteccion>>({});

stepValid = computed(() => {
  const d = this.draft();
  switch (this.step()) {
    case 1: return d.tipo != null;
    case 2: return d.beneficiarioId != null;
    case 3: return (d.capital ?? 0) > 0;
    case 4: return (d.prima ?? 0) > 0;
  }
});

openWizard(row: 'cliente' | 'conyuge', editingId?: string) { ... resets draft + step ... }
nextStep() { this.step.update(s => Math.min(4, s + 1) as 1|2|3|4); }
prevStep() { this.step.update(s => Math.max(1, s - 1) as 1|2|3|4); }
saveProducto() { /* call store, close, reset */ }
cancelWizard() { /* close, reset; preserves existing activa */ }
```

## Open work — execution order

1. **Confirm Q1–Q5** with the user, one at a time.
2. **Extend store** — `ProductoProteccion` + the per-person container; preserve the existing `activa` flag for backward compatibility with the current page.
3. **Update Brief H page** — replace the placeholder modal with the wizard markup. Page-local wizard state lives in the page component.
4. **Step indicator + transitions** — small SCSS for the 4-step header. Use semantic tokens only.
5. **List existing products on the row** — when a row has 1+ productos, show them under the badge with edit / delete icon buttons. The page's row becomes: badge + product list + "Añadir otra protección" CTA (replaces the old single Activar).
6. **Verification per the checklist below**.

## Verification

Standard 5-point check, plus:
- Open wizard from cliente row → step 1 shows tipo options
- Select tipo → "Siguiente" enables → step 2 shows beneficiario picker (sourced from `familiaParticipantes` with `searchable`)
- Pick beneficiario → step 3 shows capital input
- Type capital → step 4 shows prima input + summary block populating from draft
- Click "Guardar protección" → modal closes, row shows product line + Activada badge → sidebar chip flips to `complete` (when cliente + cónyuge both have ≥1 product)
- Re-open wizard from "Consultar" — fields prepopulate with the existing product
- "Cancelar" mid-wizard — state unchanged, draft discarded
- Add a SECOND product on the same row — both appear under the badge
- Delete a product — when last one goes, badge flips back to "No activada"

## Decisions still open after this brief ships

- **PDF integration of the structured data** — once the wizard captures real producto data, the Diagnóstico/Plan pages can read it to compute coverage gaps. Out of scope here; flag for the Conclusiones brief.
- **Validation rules** — capital and prima ranges, currency constraints. v1: positive numbers only.

## Exit criteria

- [ ] Q1–Q5 answered and locked at the top of the brief
- [ ] Store extended with `ProductoProteccion` + per-row product arrays
- [ ] Wizard replaces the placeholder modal in `proteccion-familiar.page.html`
- [ ] Wizard navigates 4 steps forward + back with validated next-button gating
- [ ] Saved products appear under the row's badge with edit / delete affordances
- [ ] Sidebar chip transitions empty → in-progress → complete based on product presence (not just `activa`)
- [ ] Brief H's completion note updated with a 1-line addendum referencing this brief
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the cardinality decision and the v1 product-type subset
