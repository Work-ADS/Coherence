# AWP 2026 — Informe · Brief N-v2: Generador de informes

**Status:** drafted 2026-05-27, awaits user "go"
**Branch:** `feature/awp-informe-generador` (to be created)
**Created:** 2026-05-27
**Activates:** any time after the [chore-sidebar §5/§6 split](2026-05-27-awp-chore-sidebar-section-5-6-split.md) lands. Independent of M1/M2 — ships parallel.
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-now-let-s-plan-concurrent-quiche.md`](../../.claude/plans/okay-now-let-s-plan-concurrent-quiche.md) — Brief 3
**Supersedes:** [`2026-05-27-awp-informe.md`](2026-05-27-awp-informe.md) (drafted same day, replaced after seeing the actual screen)

---

## Why this exists

Once the gestor has walked through every section and the plan is ready, they need to **generate the deliverable for the family**. The Informe screen IS the surface where that happens: one CTA to generate a new informe, a chronological list of past informes with download buttons. Nothing else.

The first draft of this brief (Brief N, now superseded) imagined a much richer UI — a preview panel, a versions strip, a brand picker, narrative templating. The actual screen is much leaner: it's a list page, not a workspace.

## What this session ships

New page at `/demos/wealth-planner-2026/informe/generador`. Three things on screen:

1. **Page header** with a primary `Generar informe` button top-right.
2. **`Listado de informes` heading** (h2 below the page header).
3. **A simple list** of past informes, reverse-chronological. Each row:
   - Timestamp: `01/02/2026 15:23` (line 1, primary)
   - Metadata: `PDF · 3.2 MB · Informe manual` (line 2, muted)
   - Action: `↓ Descargar` button on the right

The "Generar informe" CTA opens a **modal** (using `<afi-modal>` primitive) with three options:
- `Informe manual` — gestor uploads / authors externally
- `Informe detallado` — auto-generated from current planner state
- `Informe resumido` — abbreviated auto-generated version

Picking one closes the modal, appends a new row to the listado with the current timestamp + a mock file size. v1 does not actually render a PDF — the row's `Descargar` button is a stub link (or browser print). PDF generation is a follow-up; see Open decisions.

## Coding standards

Inherited from [chore-sidebar brief § Coding standards](2026-05-27-awp-chore-sidebar-section-5-6-split.md#coding-standards-locked-from-brief-i):

- **3-file rule** — `.ts` + `.html` + `.scss`, NO inline template / styles.
- **Reuse libs/ui primitives** — `<afi-page-header>`, `<afi-button>`, `<afi-modal>` (for the type picker), `<afi-status-chip>` for estado / type tags if applicable. Grep `libs/ui/src/` before authoring markup.
- **Tokens only in SCSS** — zero hex / rgb / bare px.
- **Tailwind utilities for layout** matching Brief I.
- **Visual anchor:** Patrimonio previsto's chrome; the list rows borrow the row + actions pattern from `desinversiones-futuras.page.html`.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md` + `docs/rules/component-skill.md`
2. The chore-sidebar brief — confirms `informeState` exists in the store
3. `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts`
4. `libs/ui/src/modal/` — the `<afi-modal>` primitive used for the type picker
5. `apps/site/src/app/pages/demos/desinversiones-futuras/desinversiones-futuras.page.{ts,html}` — closest precedent for a list-of-records page with an "Añadir" CTA + table

## Sources of truth

- **Figma:** TBD — pull from `888lN7vbJSc4gLYt7nP3DW` "Generador de informes" frame before activation.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) pp. 10–11 — §6 Informe. Lists the report's intended sections (Portada · Índice · Situación actual · Objetivos · Diagnóstico · Plan de acción · Conclusiones · Detalle de carteras modelo · Contraportada). For this brief, those are **inside the generated PDF** — not on the list page.
- **Screens:** `Afi brand/Wealth manager screens 2026/Generador de informes/Descargar Informe detallado.png` (+ 1-3 variants) and `Descargar Informe resumido.png` (+ 1 variant) — three rows showing the manual/detallado/resumido types.

## Chrome wrapping

Uses `<site-objetivos-page-shell>` per the locked pattern. Sidebar `activeKey="generador-informes"`. Banner gates on `legadoRetiroEstablished()`.

```html
<site-objetivos-page-shell
  [views]="['Generador de informes']"
  demoSlug="generador-informes"
  demoRoute="/demos/wealth-planner-2026/informe/generador"
  activeKey="generador-informes"
  [showBanner]="store.legadoRetiroEstablished()"
>
  <afi-page-header
    title="Generador de informes"
    [sticky]="false" [scrollFade]="false"
  >
    <span slot="breadcrumb" class="uppercase tracking-wider text-action-700">INFORME</span>
    <afi-button slot="actions" variant="primary" size="md" (clicked)="openGenerateModal()">
      Generar informe
    </afi-button>
  </afi-page-header>

  <div class="mx-space-8 mt-space-6">
    <h2 class="text-section text-canvas-fg mb-space-4">Listado de informes</h2>

    @if (store.informesGenerados().length === 0) {
      <div class="empty-state">…empty copy + secondary CTA…</div>
    } @else {
      <ul class="gi-list">
        @for (row of store.informesGenerados(); track row.id) {
          <li class="gi-list__row">
            <div class="gi-list__col-meta">
              <p class="gi-list__timestamp">{{ row.createdAt | date:'short' }}</p>
              <p class="gi-list__metadata">PDF · {{ row.sizeMb }} MB · {{ tipoLabel(row.tipo) }}</p>
            </div>
            <afi-button variant="ghost" size="md" (clicked)="onDescargar(row.id)">
              <svg slot="iconStart">↓</svg>
              Descargar
            </afi-button>
          </li>
        }
      </ul>
    }
  </div>

  <!-- Generate modal -->
  <afi-modal [open]="generateModalOpen()" (closed)="generateModalOpen.set(false)" title="Generar informe">
    <p>Seleccione el tipo de informe a generar:</p>
    <div class="gi-modal__options">
      <afi-button variant="secondary" (clicked)="generarInforme('manual')">Informe manual</afi-button>
      <afi-button variant="secondary" (clicked)="generarInforme('detallado')">Informe detallado</afi-button>
      <afi-button variant="secondary" (clicked)="generarInforme('resumido')">Informe resumido</afi-button>
    </div>
  </afi-modal>
</site-objetivos-page-shell>
```

## Store extensions

```ts
// ── Informe — Generador (Brief N-v2) ──────────────────────────────────────
export type InformeTipo = 'manual' | 'detallado' | 'resumido';

export interface InformeRow {
  id: string;
  createdAt: string;       // ISO timestamp
  tipo: InformeTipo;
  /** Mock — number rounded to one decimal, e.g. 3.2 (MB). */
  sizeMb: number;
}

// Seed matches the screen's three rows.
readonly informesGenerados = signal<InformeRow[]>([
  { id: 'inf-seed-1', createdAt: '2026-02-01T15:23:00Z', tipo: 'manual',    sizeMb: 3.2 },
  { id: 'inf-seed-2', createdAt: '2026-02-01T12:32:00Z', tipo: 'detallado', sizeMb: 2.1 },
  { id: 'inf-seed-3', createdAt: '2026-01-02T12:32:00Z', tipo: 'resumido',  sizeMb: 2.2 },
]);

readonly informeState = computed<SectionState>(() =>
  this.informesGenerados().length === 0 ? 'empty' : 'complete',
);

generarInforme(tipo: InformeTipo): InformeRow {
  const id = `inf-${nextInformeId++}`;
  const sizeMb = tipo === 'detallado' ? 2.1 : tipo === 'resumido' ? 2.2 : 3.2;
  const next: InformeRow = { id, createdAt: new Date().toISOString(), tipo, sizeMb };
  this.informesGenerados.update((rows) => [next, ...rows]);
  return next;
}
```

Replaces the stub `informeState` from the chore-sidebar brief.

## Sidebar wiring

Already handled by the chore-sidebar brief. `informeState` lifts from `'empty'` (stub) to the real computed once this brief lands.

## Routes

```ts
{
  path: 'wealth-planner-2026/informe/generador',
  loadComponent: () =>
    import('./informe-generador/informe-generador.page').then((m) => m.InformeGeneradorPage),
},
```

## Open work — execution order

1. **Add `InformeTipo` + `InformeRow` + `informesGenerados` + `generarInforme` + `informeState`** to the store. Replace chore-sidebar's stub `informeState`.
2. **Build page (3 files)** — list + modal + empty state.
3. **Register route**.
4. **Verify** the seeded 3 rows render, "Generar informe" modal opens, picking a type appends a row.

## Open decisions (need user input before build)

1. **PDF generation method.**
   - (a) Browser print → PDF (default). Cheapest; `Descargar` opens a print dialog rendering a static PDF surface.
   - (b) Server-side Puppeteer. Pixel-perfect; needs an endpoint.
   - (c) Client lib (`jsPDF` / `pdfmake`). Bundle hit ~150 kb.
   - **Default proposal: (a) for v1.** Reserve a future brief for the actual PDF surface that the print stylesheet renders. For this brief, `Descargar` is a stub.

2. **Modal vs. sub-route for type picker.** Modal feels right per the leaner pattern. Defer sub-route (`/informe/generador/nuevo`) to v2 if a deeper flow emerges.

3. **Empty state copy + CTA.** Default proposal:
   > "Aún no se ha generado ningún informe para esta planificación. Comienza generando el primero."
   > with a secondary CTA `Generar informe` in the center.
   Confirm at activation.

4. **`Configuración` link in the screen's top-right header.** Visible in this screen but absent elsewhere. Probably global, not page-specific. Flagged in the chore-sidebar brief; defer concrete decision to that chore's activation.

## Non-goals (do not pull in)

- The PDF generation surface itself — separate follow-up.
- Preview panel — explicitly dropped per the new screen.
- Versions strip on this page — versioning is implicit (each row IS a version).
- Brand picker per Informe — brand swap happens at the listado-de-planificaciones / simulación level.
- Narrative templating — out of scope for the list page.
- Editing or deleting past informes — read-only history.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/informe/generador` routes and renders
- [ ] Three seeded rows visible in reverse-chronological order, matching the screen exactly (manual 3.2 MB · detallado 2.1 MB · resumido 2.2 MB)
- [ ] `Generar informe` opens the modal; picking a type closes the modal and prepends a new row with the current timestamp
- [ ] `Descargar` button on each row is wired (even if v1 is a stub link / browser print)
- [ ] Empty state copy matches Open decision #3 default
- [ ] Sidebar `Generador de informes` chip shows `complete` once at least one row exists; `empty` if seed is removed
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR notes the PDF-generation decision (1) + flags the `Configuración` header item (4) for the chore-sidebar follow-up
