# AWP 2026 — Situación Actual · Brief C: Patrimonio rewrite

**Status:** parked, awaits user "go" — **blocked by Brief B** (needs the `<afi-input>` suffix/percentage primitive update + WealthPlannerStore extensions)
**Branch:** `feature/awp-situacion-patrimonio-v2`
**Created:** 2026-05-25
**Activates:** after Brief B ships
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md)

---

## What this session ships

Major rewrite of the existing **Patrimonio** page at `/demos/wealth-planner-2026/patrimonial`. The current page (live, working) gets a `v2` layout-version layered alongside `v1` — seniors compare via the version-toggle. The page surface is largely the same (list + add-asset modal); the **add-asset modal is where 90% of the work lives**.

Borja-driven changes (PDF pp.1–4, Granola 2026-02-26 / 2026-02-27 / 2026-03-05 / 2026-05-12):

### Modal (add-asset) — the new Simple mode
1. **Simple / Avanzado** toggle at the top of the modal — Avanzado is today's flow; Simple is the new fast path.
2. **"¿Patrimonio futuro?"** boolean on EVERY asset, before titulares — default `No`. If `Sí`: show *Año en que se espera obtener el activo*.
3. **"¿Generará ingresos?"** boolean with branching sub-fields when `Sí`.
4. **Simple-mode tipo listbox** (no buscador): Liquidez · Fondos · Acciones cotizadas · Participaciones empresariales · Inmobiliario · Otros activos · Deudas.
5. **Per-tipo subfield matrix** in Simple mode (locked below).
6. **Inmobiliario rename:** *Rentabilidad esperada* → **Revalorización esperada**. Remove automático/manual radios — always manual.
7. **Deudas:** Tipo de interés, Plazo medio pendiente, Activo financiado (`<afi-select>` con buscador, default *Ninguno*).
8. **Simple-mode Nombre default:** prefilled to the tipo label (e.g. *"Fondos"* when tipo = Fondos).

### Page-level / table behavior (Granola 2026-02-27, added 2026-05-25)
9. **Sortable columns** on the patrimonio table — Borja explicitly: *"cuando tú vendes, vas a querer ordenar. ¿Dónde pago más impuesto? ¿O dónde consigo más o menos dinero?"* (Feb 27). Apply to Nombre, Tipo de activo, Valor, and any other numeric column. Use the existing `<afi-table>` primitive's sort signal.
10. **Asset type as section headers** inside the table (not as filter tabs above it) — Liquidez / Inversión / Inmobiliario act as *"título de recepción"* row groups. **The current patrimonial page has tabs by tipo** — this brief should evaluate whether to keep the tabs OR move to section-header grouping. Default proposal: keep both — tabs filter, section headers group within the active tab.
11. **Edit = full-page edit mode** (NOT a modal). Borja Feb 27: *"cuando ves ese listado, hay que pinchar en editar, y luego toda la página cambia en editar."* The page enters an edit mode where all rows become inline-editable (checkboxes for bulk select, inline cell edits, bulk-delete). The current page has this stubbed at [patrimonial-proposal.page.ts:218](apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.ts) — finish the implementation. Distinct from **add** which stays modal.
12. **IPC removed EVERYWHERE** — Borja: *"En cualquier sitio que tienes IPC, quitarlo."* Affects the modal's "Crecimiento estimado" branch (drop IPC option, keep only *El mismo que el activo* / *Manual*) AND propagates to Brief D's "Incremento" select (drop IPC, keep only Manual). Cross-reference both briefs.

### Visual reference (Granola 2026-05-12, added 2026-05-25)
13. The **Wolf Planner version of Patrimonio** was shown to Miguel on May 12 — strong positive feedback ("so nice", "most on brand design for AFI"). Search is present and functional; simulation name is editable. Use that build as the visual reference for v2 polish.

## Pre-flight reads

Same six as Brief A, plus:

7. The existing patrimonial page in full — every file:
   - [`apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.ts`](apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.ts)
   - [`apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.html`](apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.html)
   - [`apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.scss`](apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.scss)
8. `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts` from Brief A — extend `patrimonio` here

## Sources of truth

- **Figma:** node `4:17627` ("↳ Patrimonio ✅"). Canonical:
  - `352:477557` — page/patrimonio/default (the list view)
  - `103:233051` — page/patrimonio/Añadir Activo (the modal trigger)
  - Multiple `atom/overlay/modal` instances starting at `103:232980` — the Simple-mode dialog variants per tipo. Pull each via `get_design_context` as needed during build.
- **PDF:** pp.1–4
- **Granola:** 2026-02-26 + 2026-03-05 (Borja confirmed deltas — see plan doc summary)

## Chrome wrapping (LOCKED — every demo page)

The existing patrimonial page is NOT wrapped in `<site-demo-shell>` today. This brief MUST wrap it — the shell is the project's feedback + handoff center (inspect mode + comment pins + viewport sizer). Pattern:

```html
<site-demo-shell
  [views]="['Patrimonio']"
  demoSlug="patrimonio"
  demoRoute="/demos/wealth-planner-2026/patrimonial"
>
  <!-- existing patrimonial template -->
</site-demo-shell>
```

Add `DemoShellComponent` to the page's `imports` array. See [Familia page](apps/site/src/app/pages/demos/familia/familia.page.html) for the working example. This wrapping is REQUIRED in this brief (not optional).

## Per-tipo subfield matrix (PDF p.2–3, locked)

Common fields (all tipos): **Nombre** · **Valor actual** · **Titular**.

| Tipo | Subfields (Simple mode) |
|---|---|
| **Liquidez** | none |
| **Fondos** | Rentabilidad–riesgo `<afi-select>` (Bajo / Medio / Alto) |
| **Acciones cotizadas** | Dividendo anual % `<afi-input type="number" suffix="%">` |
| **Participaciones empresariales** | Rentabilidad–riesgo (same set) + Dividendo anual % |
| **Inmobiliario** | Revalorización esperada `<afi-input type="number" suffix="%">` (default 2%) · Nivel de riesgo `<afi-select>` (Nulo / Bajo / Medio / Alto) · Uso `<afi-select>` (Vivienda principal / Vivienda en uso propio / Inversión) — if **Inversión**: Ingresos netos anuales % |
| **Otros activos** | Rentabilidad–riesgo + Ingresos netos anuales % |
| **Deudas** | Tipo de interés `<afi-input type="number" suffix="%">` · Plazo medio pendiente (años) `<afi-input type="number">` · Activo financiado `<afi-select>` con búsqueda (default *Ninguno*) |

### "¿Patrimonio futuro?" — universal branch (all tipos)

```
[afi-switch] ¿Patrimonio futuro? (default No)
  └── if Sí:
      ├── Año en que se espera obtener el activo (afi-input type="number" — e.g. 2030)
      └── [afi-switch] ¿Generará ingresos?
          └── if Sí:
              ├── Frecuencia (afi-select)
              ├── Tipo de generación (afi-select: Importe / Porcentaje)
              │   ├── If Importe: afi-input type="number" suffix="€"
              │   └── If Porcentaje: afi-input type="number" suffix="%"
              └── Crecimiento estimado (afi-select: El mismo que el activo / Manual)
                  └── if Manual: afi-input type="number" suffix="%"
```

This branch lives **before titulares** in every tipo's form per PDF p.1: *"Tiene que ir en todos los activos, antes de los titulares."*

**NOTE — IPC removed (Granola 2026-02-27):** the Crecimiento estimado select previously had IPC as an option. Borja: *"En cualquier sitio que tienes IPC, quitarlo."* Final list: *El mismo que el activo* / *Manual*. No IPC anywhere in Patrimonio. Same instruction applies to Brief D's Incremento select (cross-referenced).

## Page composition — modal structure (v2)

```
<afi-modal title="Añadir activo" (close)="closeAdd()">
  <!-- 1. Mode toggle (NEW) -->
  <afi-segmented-control
    size="sm"
    [options]="[{value:'simple', label:'Simple'}, {value:'avanzado', label:'Avanzado'}]"
    [value]="addMode()"
    (valueChange)="addMode.set($event)" />

  @if (addMode() === 'simple') {
    <!-- 2. Tipo listbox (NEW — no buscador) -->
    <afi-select label="Tipo de activo" [options]="simpleTipos" [value]="addTipo()" />

    <!-- 3. Per-tipo subfields (NEW) -->
    @switch (addTipo()) {
      @case ('liquidez') { <!-- nada --> }
      @case ('fondos') { <ng-container *ngTemplateOutlet="rentabilidadRiesgo" /> }
      @case ('acciones-cotizadas') { … }
      @case ('participaciones-empresariales') { … }
      @case ('inmobiliario') { <ng-container *ngTemplateOutlet="inmobiliarioFields" /> }
      @case ('otros') { … }
      @case ('deudas') { <ng-container *ngTemplateOutlet="deudasFields" /> }
    }

    <!-- 4. ¿Patrimonio futuro? — universal -->
    <afi-switch label="¿Patrimonio futuro?" [checked]="addIsPatrimonioFuturo()" />
    @if (addIsPatrimonioFuturo()) {
      <afi-input label="Año en que se espera obtener el activo" type="number" />
      <afi-switch label="¿Generará ingresos?" />
      @if (addGeneraIngresos()) {
        <!-- frecuencia, tipo de generación, crecimiento estimado -->
      }
    }

    <!-- 5. Common fields -->
    <afi-input label="Nombre" [value]="addNombre()" /> <!-- defaults to tipo label -->
    <afi-input label="Valor actual" type="number" suffix="€" />
    <afi-select label="Titular" [options]="titularOptions" />
  } @else {
    <!-- Avanzado = the existing dialog UNCHANGED. v1 markup preserved. -->
  }
</afi-modal>
```

The Avanzado branch IS the current dialog. Do NOT touch it. v1 layout-version still renders the original.

## Open work — execution order

1. **Read the existing page in full** — understand the signal landscape (`addTipo`, `addImporte`, `addEntidad`, `addDescripcion`, `addIsin`, `addHoldings`).

2. **Extend the patrimonio store slice** — `WealthPlannerStore.patrimonio` (signal array of Asset). Asset type union covers every tipo. Methods: `addAsset(asset)`, `removeAsset(id)`, `updateAsset(id, partial)`.

3. **Extend the page class** with new signals:
   ```ts
   readonly addMode = signal<'simple' | 'avanzado'>('simple');  // default Simple per Borja
   readonly addIsPatrimonioFuturo = signal(false);
   readonly addAnoObtencion = signal<number | null>(null);
   readonly addGeneraIngresos = signal(false);
   readonly addFrecuencia = signal<Frecuencia | null>(null);
   readonly addTipoGeneracion = signal<'importe' | 'porcentaje'>('importe');
   readonly addGeneracionValor = signal<number | null>(null);
   readonly addCrecimientoMode = signal<'mismo-activo' | 'manual'>('mismo-activo');
   readonly addCrecimientoManual = signal<number | null>(null);
   // Tipo-specific
   readonly addRentabilidadRiesgo = signal<'bajo' | 'medio' | 'alto' | null>(null);
   readonly addDividendoAnual = signal<number | null>(null);
   readonly addRevalorizacion = signal<number>(2);  // default 2% per PDF screenshot
   readonly addNivelRiesgo = signal<'nulo' | 'bajo' | 'medio' | 'alto'>('nulo');
   readonly addUso = signal<'vivienda-principal' | 'uso-propio' | 'inversion'>('vivienda-principal');
   readonly addIngresosNetos = signal<number | null>(null);
   readonly addTipoInteres = signal<number | null>(null);
   readonly addPlazoMedio = signal<number | null>(null);
   readonly addActivoFinanciado = signal<string>('ninguno');  // asset ID or 'ninguno'
   ```

4. **Wire `addNombre` default** — `effect()` that watches `addTipo()` and prefills `addNombre()` to the tipo label IF the user hasn't typed anything yet.

5. **Add `v2` to the version-toggle** — `version` signal already exists (line 113). The template wraps the modal in `@switch (version()) { @case ('v1') { … current dialog … } @case ('v2') { … new dialog … } }`.

6. **Update the page-level imports** — add `SwitchComponent`, `SegmentedControlComponent` to the page `imports` array.

7. **No new primitive proposals** — every form control already exists (assuming Brief B closed the `afi-input` suffix/percent gap).

8. **Sidebar already routed** — no change.

## Verification

Standard 6-point check, plus:

- v1 toggle still renders the **exact** previous modal — visual regression check via screenshot diff if possible
- v2 Simple-mode flow for each tipo:
  - Switch tipo via the listbox; the subfield set updates accordingly
  - "¿Patrimonio futuro?" toggle reveals/hides the year + generará-ingresos branch
  - Nombre auto-prefills to tipo label and stays editable
- v2 Avanzado mode opens the original (v1) dialog content
- Saving an asset in v2 Simple mode adds it to the table on the page; the table renders all common fields (nombre / valor / titular) regardless of tipo-specific extras
- Inmobiliario field is labeled **"Revalorización esperada"** (NOT "Rentabilidad esperada"); no automático/manual radio anywhere
- **Table sort works** — click a column header, rows re-order ascending; click again, descending; click a third time, clears
- **Edit mode toggle works** — click "Editar" in the page header → page transitions to edit mode (rows show checkboxes + inline editable cells); click "Hecho" → returns to read mode
- **No IPC anywhere** — grep the page template for "IPC" → zero matches in Simple-mode or v2

## Decisions still open

- **Activo financiado list (Deudas)** — `<afi-select con buscador, default Ninguno>`. The candidate options are every other asset currently in the patrimonio array. Sample from PDF p.3: "(seleccionado) Vivienda Cádiz Acciona – 420.000 €", "Acciones – 500.000 €", "Cuadro Roger Accion – 250.000 €". Decision: render `[ { value: 'ninguno', label: 'Ninguno' }, ...patrimonio().filter(a => a.tipo !== 'deudas').map(a => ({ value: a.id, label: ${a.nombre} – ${a.valor.toEuros()} })) ]`.
- **Frecuencia options** — PDF doesn't enumerate. Default proposal: Mensual / Trimestral / Semestral / Anual. Confirm.
- **v1 / v2 default** — which version is the default `version()` signal value? Default **v2** so Simple mode is the visible new work; user can toggle to v1 for comparison.

## Exit criteria

- [ ] `patrimonial-proposal.page.{ts,html,scss}` updated with v2 Simple/Avanzado layered alongside v1
- [ ] All 7 tipos render their correct subfield set in Simple mode
- [ ] "¿Patrimonio futuro?" branch works in all tipos
- [ ] Inmobiliario uses "Revalorización esperada"; no auto/manual radio
- [ ] v1 toggle preserves the previous dialog identically (regression)
- [ ] `WealthPlannerStore.patrimonio` array drives the asset table
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] Preview verified, no console noise
- [ ] PR notes the Tributación + Frecuencia open questions
