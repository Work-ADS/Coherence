# AWP 2026 — Informe · Brief N: Informe

> **⚠️ SUPERSEDED 2026-05-27 (same day)** — the new screens in `Afi brand/Wealth manager screens 2026/` revealed Informe is much leaner than this draft (no preview panel, no version chips on the main page — just "Generar informe" CTA + a list of past PDFs). Replaced by:
> - [`2026-05-27-awp-informe-generador.md`](2026-05-27-awp-informe-generador.md)
>
> Kept in place as a planning trail (carries the snapshot / versioning / PDF-generation decisions). **Do NOT consume for build.**

**Status:** drafted 2026-05-27, awaits user "go" + review of open decisions below
**Branch:** `feature/awp-informe` (to be created)
**Created:** 2026-05-27
**Activates:** after Brief M (Conclusiones) ships — Informe consumes Conclusiones' synthesized state to produce the deliverable
**Plan reference:** mentioned alongside Conclusiones as the close-out of the 9-screen map in [Brief L · Asset allocation](2026-05-26-awp-plan-optimizacion-asset-allocation.md)

---

## Why this exists

Once Conclusiones (Brief M) produces a defensible synthesis of the plan, the advisor needs to **share it with the family**. Informe is that surface — the artifact the family takes home (or opens later on their phone) that captures the conversation in a clean, printable, brand-skinned format.

It's the bridge between the interactive planner (advisor-facing, dense, editable) and the family's lived experience (passive, narrative, calm). Two consumer surfaces matter:

1. **In-app preview** — the advisor can see the report before sharing, scroll through it, swap the cover page or the recommendation tone.
2. **Shareable artifact** — a downloadable PDF and/or a tokenized share link the family opens.

If the simulación-as-entity decision lands in the Listado brief (parallel work), each generated Informe is versioned per simulación and persists in a per-client archive.

## What this session ships

A new page at `/demos/wealth-planner-2026/informe` that produces a renderable family-facing report from the WealthPlannerStore state.

Three composing surfaces:

1. **Preview panel** (the bulk of the page) — a long-form scrollable view styled to print. Sections:
   - Cover — client name, advisor name, date, brand-skinned hero
   - Resumen ejecutivo — 4 KPI tiles + 2-sentence narrative auto-generated from Conclusiones
   - Su situación — condensed Familia / Patrimonio / Ingresos read-out
   - Sus objetivos — Legado / Inversiones / Desinversiones / Protección, each as a tile
   - Diagnóstico — patrimonio previsto chart + 2 estrategias bullets
   - Plan recomendado — top 3 acciones from Conclusiones' "Acciones recomendadas"
   - Próximos pasos — checklist + advisor contact card
2. **Controls panel** (right rail, sticky) — generate, version metadata, brand picker (auto-inherits from the active simulación's brand if Listado ships), export options (PDF / share link), and a draft/sent status toggle.
3. **Versions strip** (top of page, below header) — a horizontal chip row showing prior generations: "v1 · 2026-02-15 · Sent" / "v2 · 2026-04-03 · Draft". Each chip swaps the preview to that version. New version = new chip appended.

The preview must be **print-ready** by default — `@media print` styles strip chrome, force page breaks at section boundaries, scale typography for paper. The PDF export uses the print stylesheet (browser print to PDF, or `puppeteer` later — see Open decisions).

## Sources of truth

- **Figma:** TBD — pull from `888lN7vbJSc4gLYt7nP3DW` "Informe" frame before activation. **OPEN: does this frame exist yet?**
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) — final pages likely contain the informe layout reference.
- **Granola:** any session that touched "informe" or "PDF generation" — flag during activation.
- **Branded demos:** [Sarevi Unicaja iteration](2026-05-26-sarevi-unicaja-360-iteration.md) — the closest existing pattern for a brand-skinned, family-facing read-out.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md`
2. `docs/rules/component-skill.md` + `docs/rules/token-skill.md`
3. Brief M (Conclusiones) — the data shape Informe consumes
4. Brief K + L — for acciones recomendadas details
5. Listado brief (if exists by the time this activates) — version-per-simulación model
6. `apps/site/src/app/pages/demos/laboral-kutxa-sarevi/` — closest brand-skinned long-form precedent
7. `libs/tokens/semantic.scss` `[data-brand="..."]` blocks — the brand swap surface this page consumes

## Chrome wrapping

Same shell as Conclusiones with `breadcrumb="INFORME"`. Below the page header, the Versions strip; below that, a 2-column layout: preview on the left (wide), controls on the right (sticky rail).

```html
<site-conclusiones-page-shell
  demoSlug="informe"
  demoRoute="/demos/wealth-planner-2026/informe"
  activeKey="informe"
>
  <afi-page-header
    title="Informe"
    subtitle="Genera, previsualiza y comparte el informe para la familia."
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb">INFORME</span>
    <afi-button slot="actions" variant="ghost" size="md" (clicked)="exportPdf()">
      Descargar PDF
    </afi-button>
    <afi-button slot="actions" variant="primary" size="md" (clicked)="generateVersion()">
      Generar nueva versión
    </afi-button>
  </afi-page-header>

  <!-- ─── Versions strip ───────────────────────────────────────── -->
  <section class="in-versions">
    @for (v of versions(); track v.id) {
      <button
        type="button"
        class="in-version-chip"
        [class.in-version-chip--active]="v.id === activeVersionId()"
        (click)="switchVersion(v.id)"
      >
        <span class="in-version-chip__label">v{{ v.number }}</span>
        <span class="in-version-chip__meta">{{ v.createdAt | date:'shortDate' }}</span>
        <afi-status-chip [intent]="v.status === 'sent' ? 'success' : 'neutral'" size="sm">
          {{ v.status === 'sent' ? 'Enviado' : 'Borrador' }}
        </afi-status-chip>
      </button>
    }
  </section>

  <div class="in-layout">
    <!-- ─── Preview (left) ─────────────────────────────────────── -->
    <article class="in-preview" [attr.data-brand]="activeBrand()">
      <!-- Cover -->
      <section class="in-cover">
        <coherence-logo size="lg" />
        <h1 class="in-cover__client">{{ store.familia().nombreClient }}</h1>
        <p class="in-cover__meta">
          {{ store.advisorName() }} · {{ activeVersion().createdAt | date:'longDate' }}
        </p>
      </section>

      <!-- Resumen ejecutivo -->
      <section class="in-section in-section--summary">
        <h2 class="in-section__title">Resumen ejecutivo</h2>
        <div class="in-kpi-row">
          @for (kpi of store.headlineKpis(); track kpi.key) {
            <div class="in-kpi">
              <span class="stat__label">{{ kpi.label }}</span>
              <span class="stat__value">{{ kpi.value }}{{ kpi.unit }}</span>
            </div>
          }
        </div>
        <p class="in-section__narrative">{{ resumenNarrative() }}</p>
      </section>

      <!-- Su situación + Sus objetivos + Diagnóstico + Plan + Próximos pasos -->
      <!-- ... sections rendered from store derivations ... -->
    </article>

    <!-- ─── Controls (right rail, sticky) ──────────────────────── -->
    <aside class="in-controls">
      <afi-card variant="quiet" padding="md">
        <h3 class="in-controls__title">Versión activa</h3>
        <dl class="in-controls__meta">
          <dt>Creada</dt><dd>{{ activeVersion().createdAt | date:'short' }}</dd>
          <dt>Estado</dt><dd>
            <afi-status-chip [intent]="activeVersion().status === 'sent' ? 'success' : 'neutral'">
              {{ activeVersion().status === 'sent' ? 'Enviado' : 'Borrador' }}
            </afi-status-chip>
          </dd>
          <dt>Marca</dt><dd>{{ brandLabel(activeBrand()) }}</dd>
        </dl>

        <h3 class="in-controls__title">Compartir</h3>
        <afi-button variant="secondary" size="md" (clicked)="copyShareLink()">
          {{ shareCopied() ? '✓ Copiado' : 'Copiar enlace' }}
        </afi-button>
        <afi-button variant="ghost" size="md" (clicked)="markSent()" [disabled]="activeVersion().status === 'sent'">
          Marcar como enviado
        </afi-button>
      </afi-card>
    </aside>
  </div>
</site-conclusiones-page-shell>
```

## Print stylesheet

```scss
// Triggered by browser print and the PDF export pipeline
@media print {
  // Strip chrome
  site-doc-page-shell > .doc-page__breadcrumb,
  site-doc-page-shell > .doc-page__controls,
  .in-versions,
  .in-controls {
    display: none;
  }

  // Force page breaks at section boundaries
  .in-section,
  .in-cover {
    break-inside: avoid;
    break-after: page;
  }

  // Paper-friendly typography
  .in-preview {
    font: var(--type-body-md-400);
    color: var(--foreground-primary-default);
  }
}
```

## Store extensions

```ts
// Builds on Brief M (Conclusiones)
export type InformeStatus = 'draft' | 'sent';

export interface InformeVersion {
  id: string;
  number: number;             // monotonically increasing per client
  createdAt: string;          // ISO timestamp
  status: InformeStatus;
  /** Snapshot of conclusions state at generation time — frozen, never re-derived. */
  snapshot: {
    headlineKpis: HeadlineKpi[];
    objetivosCumplidos: ObjetivoSyntesisRow[];
    objetivosNoCumplidos: ObjetivoSyntesisRow[];
    accionesRecomendadas: AccionRecomendada[];
    patrimonioResultanteSeries: ChartSeries;
  };
}

readonly versions          = signal<InformeVersion[]>([... seed: 2 versions ...]);
readonly activeVersionId   = signal<string>(/* most recent */);
readonly activeVersion     = computed<InformeVersion>(() => /* find */);
readonly activeBrand       = computed<ScopedBrand>(() => /* from simulación or default */);
readonly resumenNarrative  = computed<string>(() => /* generate 2-sentence narrative */);
readonly informeState      = computed<SectionState>(() => /* 'complete' iff at least 1 sent version */);

generateVersion(): void { /* push new InformeVersion with current Conclusiones snapshot */ }
switchVersion(id: string): void { /* update activeVersionId */ }
markSent(): void { /* mutate active version status */ }
exportPdf(): void { /* trigger browser print dialog for v1 */ }
copyShareLink(): void { /* generate + clipboard the share URL */ }
```

**Important:** `snapshot` is frozen at generation time. Switching versions in the preview never re-derives from current store — it reads from the snapshot. This is what makes prior informes a stable record.

## Sidebar wiring

Informe sits as the second item under §5 (added by Brief M):

```ts
{
  key: 'informe',
  label: 'Informe',
  state: this.store.informeState(),
  route: '/demos/wealth-planner-2026/informe',
},
```

## Routes

```ts
{
  path: 'wealth-planner-2026/informe',
  loadComponent: () =>
    import('./informe/informe.page').then((m) => m.InformePage),
},
```

## Open decisions (need user input before build)

1. **PDF generation method.**
   - (a) **Browser print → PDF** (default proposal). Use `window.print()` + the `@media print` stylesheet. Zero new dependencies; the family receives whatever the advisor's browser produces. Caveat: print fidelity varies across browsers.
   - (b) **Server-side render** via Puppeteer / Playwright headless Chromium. Pixel-perfect, consistent, supports headers/footers. Needs an endpoint.
   - (c) **Client-side library** like `jsPDF` / `pdfmake`. Bundle hit (~150 kb), but no server. Lower fidelity than (b).
   - Default proposal: **(a)** for v1; reserve (b) as v2 if quality complaints.

2. **Share link behavior.** What does "Copiar enlace" actually do?
   - (a) Generate a URL like `/informe/:token` that renders a public, read-only view. Requires routing + auth.
   - (b) Mailto link pre-filled with the PDF as attachment (only works if PDF generation is sync).
   - (c) Just copy `/demos/wealth-planner-2026/informe?versionId=X` for now — internal link only.
   - Default proposal: **(c)** for v1 (mock the share flow); plan (a) once auth model lands.

3. **Versions persistence.** The seed shows in-memory versions. In production, where do they live?
   - (a) `localStorage` per client — survives reload, local-only.
   - (b) Backend persistence — requires API contract with the wealth planner backend.
   - Default proposal: **(a)** for v1 (matches Brief A–L's mock-data approach); flag for (b) when backend lands.

4. **Resumen ejecutivo narrative — auto-generated or templated?**
   - (a) Template strings filled from store signals: `"La familia ${nombre} cuenta con un patrimonio de ${total}. Con el plan propuesto, alcanza la edad de seguridad a los ${edad} años."`
   - (b) LLM-generated, personalized prose.
   - Default proposal: **(a)** — deterministic, debuggable, defensible.

5. **Listado dependency.** If [Listado brief](TBD) ships and simulación becomes a URL entity, this route becomes `/wealth-planner-2026/:simulationId/informe` and each simulación carries its own version stack. Confirm direction before this brief activates.

6. **Brand picker per Informe — or per simulación?** If the simulación entity carries the brand, the brand picker disappears here and Informe just renders in the simulación's brand. If brand stays free-form per Informe, keep a picker in the controls panel.
   - Default proposal: **simulación carries the brand** — drop the picker from Informe controls when Listado lands.

7. **Próximos pasos checklist source.** Static template or derived from Conclusiones' "Acciones recomendadas"? Default proposal: **derived top 3** with a parking-lot for advisor-added items.

## Process — what to do when user says go

1. **First read (in order, always):** AGENTS.md → docs/strategy/plan.md → component-skill.md → token-skill.md → ds-token-guardian.md
2. **Read the existing surfaces:** WealthPlannerStore (Brief M extensions), Sarevi long-form page for brand-skinned reference, the existing sidebar config.
3. **Confirm Listado direction (Open decision 5)** with the user before defining the route shape — this is the structural fork.
4. **Close remaining Open decisions** with the user — one question at a time.
5. **Pull Figma** for any "Informe" frame in `888lN7vbJSc4gLYt7nP3DW` — if none exists, flag and ship from PDF + this brief alone.
6. **Plan-mode gate** — produce a step list of file changes BEFORE editing.
7. **Build** — sections in order: store extensions (versions + snapshot) → page (3 files) → print stylesheet → sidebar → route.
8. **Token Guardian sweep** before commit. Print stylesheet exempt from clean-code-check's px ban iff inside `@media print` (which the rule allows).

## Non-goals (do not pull in)

- Backend persistence — out of scope; mock with localStorage or in-memory.
- Real auth-gated share links — out of scope; use Open decision 2 default.
- Editing the report's prose inline — Informe is generated, not authored. Future Brief can add advisor notes section.
- Multi-language Informe — Spanish-only for v1.
- Email integration — out of scope; "Marcar como enviado" is a status flag, not an actual send.

## Success looks like

The advisor finishes a session, opens Conclusiones, sees the plan is complete, clicks "Generar informe →". They land on Informe with a fresh version v1 (Draft). They scroll the preview, confirm the cover, KPIs, and recommendations look right, click "Descargar PDF", and the browser saves a brand-skinned PDF named `informe-{cliente}-v1-{fecha}.pdf`. The family receives it. Three weeks later the advisor revisits, generates v2 with updated inputs, and v1 + v2 coexist in the versions strip — the family can still open the original.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/informe` routes and renders
- [ ] Versions strip with at least 2 seeded versions; chip swap updates preview
- [ ] Preview renders all 6 sections (cover, resumen, situación, objetivos, diagnóstico, plan, próximos pasos) from Conclusiones snapshot
- [ ] Print stylesheet produces clean PDF via browser print
- [ ] "Marcar como enviado" mutates active version status; chip reflects
- [ ] "Copiar enlace" copies the v1 placeholder URL to clipboard
- [ ] Sidebar Informe chip wired
- [ ] Brand picker on /componentes/logo + Conclusiones inheritance proven (active brand re-skins Informe preview without re-skinning chrome)
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the PDF-generation decision (1) and share-link decision (2)
