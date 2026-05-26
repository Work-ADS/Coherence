# Sarevi Unicaja — first iteration log

**Status:** shipped (no pickup work pending)
**Demo route:** `/demos/sarevi-unicaja`
**Source:** `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/` (brand-aware page, served at the `sarevi-unicaja` path via `data.sareviBrand = 'unicaja'`)
**Created:** 2026-05-26

---

## Provenance

This iteration was produced in two passes:

1. **First pass — Figma + Claude Design.** Richard mocked up a Unicaja-skinned
   Sarevi 360 in Figma, then handed the design off through Claude Design
   (`claude.ai/design`). The resulting bundle lives at
   `Afi brand/Unicaja tokens/unicaja-sarevi/` — see
   `unicaja-sarevi/project/Sarevi 360.html` for the source-of-truth prototype.

2. **Second pass — adjust in code with Manu's Claude Code.** The existing
   Unicaja variant on `/demos/sarevi-unicaja` was already a brand swap of the
   Laboral Kutxa simulator. Manu's Claude Code session adjusted the existing
   page rather than scaffolding a new route, so the change set is scoped to
   brand-conditional blocks inside the shared component.

This is treated as the **first iteration** of Sarevi Unicaja — no versioned
snapshot was carved out, the existing route was updated in place per Richard's
direction.

## What changed vs. the prior Unicaja variant

All edits are brand-gated (`@if (brand() === 'unicaja')` in the template,
`.lk-sarevi--unicaja { … }` in styles) so the Laboral Kutxa path is untouched.
The `.datos-form-wrap` wrapper exists in the DOM for both brands but only
receives visual treatment under `.lk-sarevi--unicaja` — it's a transparent
passthrough on LK.

- **Datos sub-card grouping.** The four form sections (Caso de reformas,
  Certificado, Características físicas, Sistemas de climatización) now sit
  inside one white outer card; each becomes a light-gray sub-card. Matches
  the Sarevi 360 nested layout.

- **Caso de reformas — buscar-dir first, conditional pin/select.** Inside
  the Caso de reformas sub-card the field order flipped: Sí/No comes first
  (compact, inline with its label), then a conditional below — Sí renders
  a "Usar mi ubicación actual" pin card with a Usar ubicación button; No
  renders the searchable municipio select. The compact Sí/No height was
  forced past the segmented control's host-level Unicaja sizing with
  `!important` (encapsulation attrs on the component beat the external
  rule by specificity). LK keeps the original municipio-first ordering.
  ([laboral-kutxa-sarevi.page.html](apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.html) +
  [laboral-kutxa-sarevi.scss](apps/site/src/styles/laboral-kutxa-sarevi.scss))

- **Datos actuales estimados.** Horizontal 4-column banner instead of the LK
  metric-grid with delta badges. The `.stat__delta` comparison chips are
  hidden under `.lk-sarevi--unicaja` so the figures sit clean.

- **Variant tabs.** `variantOptions` is now a `computed` — Unicaja drops the
  middle "Reforma completa" tier, leaving Básica / Personalizada to match the
  Sarevi 360 mock.
  ([laboral-kutxa-sarevi.page.ts](apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.ts))

- **CAE badge.** Re-skinned to black-on-white inside `.lk-sarevi--unicaja`
  (was Unicaja-secondary green). Higher contrast against the green palette so
  the bonificación cue reads first.
  ([laboral-kutxa-sarevi.scss](apps/site/src/styles/laboral-kutxa-sarevi.scss))

- **Loan card collapse.** The resumen page used to show two stacked cards
  (Cuota sin CAE / Cuota con CAE). For Unicaja it now renders a **single big
  "Con bonificación CAE" card** with side-by-side 12-meses / resto del plazo
  columns and a 3-stat sidebar (Comisión / TIN / TAE). The two-card layout
  stays as the Laboral Kutxa default.
  ([laboral-kutxa-sarevi.page.html](apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.html))

- **Green CTA banner.** Full-bleed green bar with a white "Pulsa aquí para
  más información" button sits between the financiación section and the new
  providers grid. Replaces the old in-card cuota CTA for Unicaja.

- **Proveedores grid.** Replaces the generic `.help-band` at the bottom of
  resumen with a 3-card provider list (EcoRehab Solutions / CertiEnergy
  España / SolarPlus Instalaciones) — each card has an icon block, name,
  short description, and a secondary CTA. Provider data lives in
  `providers` on the page class.

## Files touched

- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.ts`
  — `variantOptions` → computed; added `providers` data.
- `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/laboral-kutxa-sarevi.page.html`
  — brand-gated single loan card, green CTA banner, providers grid; switched
  binding to `variantOptions()`.
- `apps/site/src/styles/laboral-kutxa-sarevi.scss`
  — `.lk-sarevi--unicaja` overrides for `.cae-badge`, plus new
  `.unicaja-loan`, `.unicaja-cta`, `.unicaja-providers`, `.unicaja-provider`
  blocks.

## What still maps to the design

Most of the rest of the Sarevi 360 design was already in place on the shared
page before this iteration:

- Welcome with Sostenibilidad pill + Edificio / Vivienda picker + Recuperar link.
- Datos with 4 sub-cards (Caso de reformas / Certificado / Características /
  Sistemas de climatización) + Datos actuales estimados + Alerta.
- Medidas with the row list (impact + CAE + price + Detalles), Realizando
  la reforma 2-up, and Costes aproximados table.
- Step pills (01 / 02 / 03), brand logo + "Sarevi 360" header label,
  ref-code pill.

Those carry over from the brand-swap that was already wired through
`brandConfig()` / `data-brand="unicaja"`.

## Open follow-ups (not started)

- The Unicaja design uses a single-color "fan" mark in the header that
  differs from the wordmark in `assets/logos/unicaja/logo-dark.svg`. The
  wordmark is kept for now (consistent across the rest of the site) — swap
  to a fan-only variant if brand wants the simulator to feel more standalone.
- The Sarevi 360 design specifies an "En curso" sublabel under the active
  step pill. Current implementation keeps the simpler pill style. Add when
  there's design alignment on whether to roll this back into the LK pill
  treatment too.
