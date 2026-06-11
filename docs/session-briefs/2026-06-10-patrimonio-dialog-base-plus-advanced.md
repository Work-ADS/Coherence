# AWP 2026 — Patrimonio dialog v2 · Two-step Tipo + per-branch dialogs

**Status:** planning · awaits user "go"
**Created:** 2026-06-10 · revised 2026-06-10 after user reframe
**Sources scanned:**
- PDF: `CambiosAfiWealthPlanner20260226.pdf` pp.1–4 (locked spec)
- Figma exports: `Afi brand/Wealth manager screens 2026/Dialogs for patrimonio/atom/overlay/modal*.png` (31 screens, sampled: modal.png, 1–10, 14)
- Live code (Brief C Simple): `apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.html` v2 Simple branch
- User clarification 2026-06-10: top-level Tipo split, Simple/Avanzado only inside Inversión branch

## Big revision · 2026-06-10

The original Brief C model was a flat 7-tipo list with a global Simple ⏐ Avanzado toggle. That's wrong — the canonical structure is **two-step**:

1. **Top-level Tipo de patrimonio** (always visible, first thing in the dialog) — 7 categories
2. Branching based on which top-level the user picks; **only the Inversión branch** carries a sub-type select AND the Simple ⏐ Avanzado toggle

Every other top-level (Liquidez / Plan de pensiones / Private equity / Inmobiliario / Participaciones / Deudas) renders its own focused dialog with no Simple/Avanzado split. This is why every modal screenshot I've seen titled "Añadir inversión / inversión futura" is on the Inversión branch — they're a subset of the universe, not the whole thing.

## A. Dialog skeleton

```
<afi-modal title="Añadir patrimonio">
  Tipo de patrimonio*  [listbox, 7 options]    ← STEP 1

  @switch (tipo) {
    @case ('liquidez')           { <LiquidezForm /> }
    @case ('inversion')          { <InversionFlow /> }   ← only branch with Simple/Avanzado
    @case ('plan-pensiones')     { <PlanPensionesForm /> }
    @case ('private-equity')     { <PrivateEquityForm /> }
    @case ('inmobiliario')       { <InmobiliarioForm /> }
    @case ('participaciones')    { <ParticipacionesForm /> }
    @case ('deudas')             { <DeudasForm /> }
  }

  <UniversalFooter />  ← ¿Patrimonio futuro? + Nombre + Valor actual + Titulares
</afi-modal>
```

## B. Top-level dialogs (single-pane, no Simple/Avanzado)

Each of these renders its own per-tipo fields above the Universal footer.

### B1 · Liquidez
- — *(no tipo-specific fields per PDF p.2)*

### B2 · Plan de pensiones
- TBD — not in scanned screenshots. Likely Entidad + Aportación periódica anual estimada + Tipo tasa crecimiento (IPC/Manual) + Tasa crecimiento %.

### B3 · Private equity (modal-5)
- Compromiso de pago — Number, € (e.g. 2.000.000 €)
- Desembolso realizado — Number, € (e.g. 500.000 €)
- Año fin de desembolsos — Year (e.g. 2028)
- Año inicio de distribuciones — Year (e.g. 2035)
- Año fin de distribuciones — Year (e.g. 2038)
- Rentabilidad-riesgo — Select Bajo/Medio/Alto

### B4 · Inmobiliario (modal-6)
- **Sub-section "Revalorización esperada"**:
  - Revalorización esperada — Number, % (default 2%)
  - Nivel de riesgo — Select (default Nulo)
- Uso de la vivienda — Select: Vivienda principal / Vivienda en uso propio / Inversión
- if Uso = Inversión → Ingresos netos anuales — Number, %

### B5 · Participaciones empresariales (modal-4)
- Rentabilidad-riesgo — Select Bajo/Medio/Alto
- Dividendo anual — Number, %

### B6 · Deudas (modal-8)
- Tipo de interés — Number, %
- Plazo medio pendiente — Number, years (default 5)
- *(Activo financiado is Avanzado-only per PDF; only applies if we decide to add Simple/Avanzado to Deudas. For v1, treat Deudas as single-pane and put Activo financiado in a future-iteration "ver más" disclosure. **Open question — see D2.**)*

### Universal footer (after the per-tipo block in every dialog)

- **¿Es patrimonio futuro?** — Radio Sí / No (default No)
  - if Sí → Año en que se espera obtener el activo — Number (e.g. 2030) with helper "Edad: X años"
- **¿Generará ingresos?** — Radio Sí / No (default No)
  - if Sí → Frecuencia + Importe/Porcentaje + Crecimiento estimado (IPC / Manual)
- **Nombre** — text input, default = tipo label (e.g. "Liquidez", "Plan de pensiones")
- **Valor actual*** — Number, €
- **Titulares** — multi-row block: Titular* + Porcentaje* + delete + "+ Añadir" link + green "Total: 100%" validator

## C. Inversión branch (the only Simple/Avanzado flow)

Picking Tipo de patrimonio = Inversión reveals:

1. **Tipo de inversión*** — second listbox immediately under Tipo de patrimonio. Sub-types from modal-1: Fondos de inversión / Acciones cotizadas / Participaciones empresariales / Private equity / Inmobiliario / Otros activos / Deudas. **Note:** the Figma's Inversión sub-list overlaps with the top-level list (it includes Private equity, Inmobiliario, Participaciones, Deudas — which are also top-level). That's almost certainly a Figma leftover from the flat-list era. **Open question — see D1.**
2. **Tipo (Simple ⏐ Avanzado)** — global segmented control for this branch only.
3. **Per-subtipo subfields** — the matrix from Brief C lives here:

| Inversión sub-type | Simple subfields |
|---|---|
| Fondos de inversión | Rentabilidad-riesgo |
| Acciones cotizadas | Dividendo anual % |
| ETF | TBD — likely Rentabilidad-riesgo |
| Cartera | TBD |
| Otros activos | Rentabilidad-riesgo + Ingresos netos anuales % |
| Seguros de ahorro (modal-14) | minimal — joins universal footer directly |

4. **Avanzado-only extras** (revealed when Tipo = Avanzado, applied per Inversión sub-type):

#### Section 1 · Identificación
- **Nombre del activo*** — search-select with category tag (e.g. "Apple INC." → "RV Americana"; "Renta 4 monetario, FI" → "Monetario"). Replaces the plain text Nombre from Simple.
- Cartera — search-select
- Entidad — search-select
- Valor de compra — Number, €

#### Section 2 · Aportaciones (Fondos / Participaciones)
- Aportación periódica anual estimada — Number, €
- Tipo de tasa de crecimiento*** — Radio: IPC / Manual
- Tasa de crecimiento*** — Number, % (when Manual)

#### Section 3 · Revalorización esperada (all Inversión sub-types with a return profile)
- Tipo de revalorización esperada*** — Radio: Automática / Perfil de riesgo / Manual
- Rentabilidad anual*** — Number, % (default 2%)
- Nivel de riesgo*** — Select (default Nulo)

5. **Universal footer** (same as B7) renders below.

## D. Open questions

1. **Inversión sub-type list** — the Figma modal-1 lists Private equity / Inmobiliario / Participaciones / Deudas as Inversión sub-types, but the user reframe puts them at the top level. Either:
   - (a) The Figma is pre-reframe and Inversión sub-types are actually just Fondos / Acciones / ETF / Cartera / Otros / Seguros, OR
   - (b) Top-level Tipo = Inversión is a "shortcut" that includes the others
   - Recommend (a). Confirm with Figma link.
2. **Activo financiado on Deudas** — earlier we locked it to Avanzado-only assuming a global toggle. With Deudas as a single-pane top-level (no toggle), there's no "Avanzado" to hide it in. Options:
   - (a) Add a "Ver más" disclosure on Deudas that reveals Activo financiado, OR
   - (b) Always show Activo financiado in Deudas (Simple behavior), OR
   - (c) Bring a per-tipo Simple/Avanzado toggle back just for Deudas
   - Recommend (a). Lowest UX cost.
3. **¿Patrimonio futuro? control** — Simple uses afi-switch, Avanzado modals show afi-radio-group. With no Simple/Avanzado outside Inversión, the universal footer needs ONE control. Recommend radio (matches ¿Generará ingresos?).
4. **Plan de pensiones fields** — TBD until I see the modal. The PDF only mentions it indirectly. **Need a screen or your call on the field list.**

## E. Currently in code vs spec

Built per Brief C (flat 7-tipo + global toggle). Discrepancies vs the new model:
- ❌ Top-level Tipo dropdown shows the Brief C 7-tipo flat list (Liquidez/Fondos/Acciones/Participaciones/Inmobiliario/Otros/Deudas). Needs to become the 7-top-level list (Liquidez/Inversión/Plan/PE/Inmobiliario/Participaciones/Deudas).
- ❌ Simple/Avanzado toggle visible for every tipo. Needs to only appear when Tipo = Inversión.
- ❌ No second-level "Tipo de inversión" dropdown.
- ❌ Private equity / Plan de pensiones don't have their own dialog yet.
- ❌ Universal footer is partial — Titulares is a single select, not the multi-row block.
- ⚠️ Inmobiliario shows correctly under Simple today; it'll just need to move from "Simple tipo" to "Inmobiliario top-level tipo."

## F. Suggested execution order (build phase)

1. **Extract `<site-titulares-block>` site-local component** — multi-row Titular + Porcentaje + delete + "+ Añadir" + Total validator. Reusable across Patrimonio + Inversiones futuras + future forms.
2. **Extend `WealthPlannerStore.patrimonio.PatrimonioAsset`** with the new field shape: split `tipoTop: TipoPatrimonio` (7 options) + `tipoInversion?: SubtipoInversion` (only when top = inversion) + the universal footer fields + the per-branch tipo-specific fields. Drop the old flat `tipo: PatrimonioTipo` union or keep it for migration.
3. **Rewrite the v2 modal in `patrimonial-proposal.page.html`** with the skeleton from section A. Each top-level tipo gets its own form component (or inline block) for clarity.
4. **Build the Inversión branch** with the sub-type dropdown + Simple/Avanzado toggle + the per-subtipo + Avanzado extras matrix.
5. **Wire the universal footer** at the bottom of every tipo branch.
6. **A11y pass** — radio focus order, section landmarks, search-select autofill.

## G. Next clarifications I need from you (Richard)

- The **Figma link to the page** so I can confirm the Inversión sub-type list (Question D1) and pull canonical fields for Plan de pensiones (Question D4).
- Your call on D2 (Activo financiado disclosure on Deudas) and D3 (¿Patrimonio futuro? radio vs switch).

Tesler-law ideas for the Inversión Avanzado state are **still parked** until Base + per-branch dialogs are landing.
