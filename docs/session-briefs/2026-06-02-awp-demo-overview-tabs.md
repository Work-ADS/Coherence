# AWP — Demo overview tabs (Brief 2)

**Status:** active 2026-06-02 — building on `richard/overview-tabs`
**Branch:** `richard/overview-tabs` (cut from `main` after Brief 1 merged via [#4](https://github.com/AfiDesigner/Afi-coherence/pull/4))
**Created:** 2026-06-02
**Activated:** 2026-06-02 — all 4 Open decisions locked
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-continue-and-take-magical-thimble.md`](../../.claude/plans/okay-continue-and-take-magical-thimble.md) — Brief 2

---

## Why this exists

The `/demos/wealth-planner-2026` demo overview currently has 3 tabs (Visión general · Caso de estudio · Bitácora). Three new "operational" tabs land alongside them so anyone opening the demo overview can see:

- What the product is supposed to do (Documento funcional)
- The semantic CSS / tokens that back it (Semántica CSS)
- Which user scenarios it's built for (User personas)

The brief explicitly ships **scaffolds + 2 personas filled**. The functional doc and semantic CSS contents arrive later as each AWP product page graduates to the "right way" treatment (Listado first, Familia next).

## What this session ships

Three new `<afi-tab-item>` slots inside the existing `<afi-tabs>` block in [`wealth-planner-2026.page.html`](../../apps/site/src/app/pages/demos/wealth-planner-2026/wealth-planner-2026.page.html). Existing tabs untouched.

**Tab order (locked):** Visión general · Caso de estudio · Bitácora · **Documento funcional · Semántica CSS · User personas**.

### Tab 4 — Documento funcional

Inner `<afi-tabs>` strip per product: **Listado · Familia** for v1 (more added as products graduate).

Each product sub-tab renders three placeholder sections:
- Requisitos técnicos
- Requisitos no técnicos
- Buenas prácticas

Each section shows an "En construcción · se rellena en próximas iteraciones" placeholder card with a small tag identifying the product. No new primitive — prose + existing block layout (`.wp-tab__block` shape).

### Tab 5 — Semántica CSS

Inner `<afi-tabs>` strip per product (same Listado · Familia split). Each product sub-tab ships an "En construcción · llegará junto con el documento funcional" placeholder.

The eventual renderer (next iteration) will consume [`apps/site/src/app/utils/export-semantic-css.ts`](../../apps/site/src/app/utils/export-semantic-css.ts) — the same utility the demo-shell's `Descargar CSS semántico` button uses (224 tokens: 170 color + 54 length). Columns will be: nombre · valor resuelto · muestra (swatch o preview tipográfico) · grupo. Spec'd in this brief's *Follow-ups* but NOT built in v1.

### Tab 6 — User personas

Subtitle paragraph explaining the *why* (cliente data sensitivity + confidentiality → personas instead of real-client seeds).

Below the subtitle: responsive 2-column grid of `<site-persona-card>` instances, one per persona. **No `Crear persona` flow in v1.**

V1 personas (descriptive only, no full `ClienteData` snapshots — Activar is v2):

1. **María Fernández Castro** — Acumulador (42)
   - Ingresos > 100 k €/año · Primer inmueble de alquiler · Familia con un hijo pequeño
   - "Empieza a construir patrimonio por dos vías: inversión financiera de toda la vida y un primer ladrillo que va a alquilar. Su planificación equilibra dos motores recién encendidos."

2. **Carmen López Martín** — Patrimonio establecido (64)
   - Jubilada · Múltiples activos (inmuebles + cartera + planes) · 2 hijos adultos
   - "Lleva décadas acumulando patrimonio. Ahora pivota: cómo desinvertir con cabeza, asegurar el legado a sus hijos y mantener el nivel de vida durante un retiro largo."

## Coding standards

Inherited from the listado brief — non-negotiables:

- **3-file rule** — `.ts` + `.html` + `.scss`, no inline template / styles
- **Reuse primitives** — `<afi-card>` is the backbone for persona cards; `<afi-tabs>` + `<afi-tab-item>` for tab structure; `<afi-badge>` for the persona profile chip + key-attribute chips
- **Tokens only in SCSS** — no hex / rgb / bare px outside libs/tokens
- **Site-local widget convention** — peer of `<site-doc-tokens>` (e.g., `<site-persona-card>` lives at `apps/site/src/app/components/persona-card/`, not under `libs/ui/`)

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md` + `docs/rules/component-skill.md` + `docs/rules/token-skill.md`
2. [`apps/site/src/app/pages/demos/wealth-planner-2026/wealth-planner-2026.page.{ts,html}`](../../apps/site/src/app/pages/demos/wealth-planner-2026/) — the existing overview, sees the 3 current tabs and the `.wp-tab__block` shape to reuse
3. [`libs/ui/src/card/card.component.ts`](../../libs/ui/src/card/card.component.ts) — primitive that `<site-persona-card>` wraps
4. [`libs/ui/src/tabs/`](../../libs/ui/src/tabs/) — confirm inner `<afi-tabs>` can nest cleanly inside an `<afi-tab-item>`

## Sources of truth

- **User direction** — voice-recorded brief (this session) plus the umbrella plan
- **Figma** — none for v1 (the new tabs are scaffolded; design comes when content lands)
- **Existing infra** — `exportSemanticCss()` utility is the future renderer's data source

## Locked decisions (2026-06-02)

1. **Per-product navigation inside Documento funcional + Semántica CSS** → inner `<afi-tabs>` strip (Listado · Familia for v1). Scales when more products graduate.
2. **Persona card** → site-local `<site-persona-card>` at `apps/site/src/app/components/persona-card/` (3-file), wrapping `<afi-card>`. NOT a `libs/ui` primitive in v1.
3. **Persona data shape + Activar** → descriptive only (alias, age, profileSlug, profileLabel, keyAttributes, summary). No `Activar persona` button, no `ClienteData` snapshot. Deferred to v2.
4. **Tab order** → append at the right: Visión general · Caso de estudio · Bitácora · Documento funcional · Semántica CSS · User personas.

## Files

**New:**

- `apps/site/src/app/components/persona-card/persona-card.component.{ts,html,scss}` (+ `index.ts` barrel)
- `apps/site/src/app/pages/demos/wealth-planner-2026/data/personas.ts` — `Persona` interface + 2 seeded personas

**Edit:**

- `apps/site/src/app/pages/demos/wealth-planner-2026/wealth-planner-2026.page.{ts,html,scss}` — append 3 tab items + import `<site-persona-card>` + import the personas fixture + add minor sub-tab styles
- `apps/site/src/app/pages/blog/iteracion-4/iteracion-4.page.ts` — populate the *Documentación demo* surface tasks once the build lands

## Out of scope (called out explicitly)

- `Crear persona` flow — v2
- Full Semántica CSS token table renderer — separate follow-up brief (see below)
- Filling Documento funcional with real per-product content — happens iteration-by-iteration as each product page graduates
- Adding personas to LK Sarevi / Unicaja / Banco Cooperativo — AWP only in v1

## Follow-ups (tracked for after this ships)

- `2026-XX-XX-awp-semantic-css-renderer.md` — build `<site-doc-tokens-table>` to render the 224 semantic tokens (170 color + 54 length) inside the Semántica CSS sub-tabs. Read from `exportSemanticCss()` utility output. Columns: nombre · valor resuelto · muestra · grupo. Includes filtering by grupo.
- `2026-XX-XX-awp-persona-activate.md` — extend `Persona` with optional `clienteSnapshot: ClienteData & {...}` payload + `Activar persona` button → seeds `WealthPlannerStore`, navigates to `/familia`.

## Exit criteria

- [ ] 3 new tab items render on `/demos/wealth-planner-2026` after Bitácora (Documento funcional · Semántica CSS · User personas)
- [ ] Documento funcional tab shows an inner `<afi-tabs>` strip with Listado · Familia sub-tabs; each sub-tab renders the 3 placeholder sections (Requisitos técnicos · no técnicos · Buenas prácticas) with "En construcción" copy
- [ ] Semántica CSS tab shows the same inner sub-tabs structure with a single "En construcción" placeholder per sub-tab
- [ ] User personas tab shows the explanatory subtitle + 2 `<site-persona-card>` instances (María Fernández Castro · Carmen López Martín) in a responsive grid
- [ ] `<site-persona-card>` is a 3-file component wrapping `<afi-card>`; uses `<afi-badge>` for profile + key-attribute chips; renders alias, age, profile label, key attributes, summary; falls back to initials avatar when no image
- [ ] iteracion-4 *Documentación demo* surface populated with this brief's tasks (Hecho)
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the 4 locked decisions + lists the 2 follow-up briefs queued
