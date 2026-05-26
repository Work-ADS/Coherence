# AWP 2026 — Objetivos · Brief H: Protección familiar

**Status:** ✅ complete — landed on `main` in `<this commit>`. **Objetivos chunk closed** (E + F + G + H all on main).
**Branch:** `feature/awp-objetivos-proteccion-familiar` → merged + deleted
**Created:** 2026-05-25
**Completed:** 2026-05-26
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md) — Objetivos addendum

## Completion notes (2026-05-26)

- Page lives at [`apps/site/src/app/pages/demos/proteccion-familiar/proteccion-familiar.page.{ts,html,scss}`](../../apps/site/src/app/pages/demos/proteccion-familiar/proteccion-familiar.page.ts). Reuses the shared `<site-objetivos-page-shell>` from Brief E for chrome + banner gate.
- Store extended with `ProteccionFamiliarData`, `proteccionFamiliarEstablished` + `proteccionFamiliar` signals, `proteccionFamiliarState` computed (empty → in-progress → complete; complete requires `cliente.activa` and — when `tienePareja()` is true — `conyuge.activa`), plus `setProteccionFamiliarEstablished` / `setClienteActiva` / `setConyugeActiva` mutations.
- Page-local placeholder modal: the `activatingRow` signal tracks which row (`cliente` | `conyuge`) opened the modal; `markActiveAndClose()` flips the matching row's `activa` flag in one shot and resets the signal. Closing via Cerrar / Esc / backdrop just resets the signal.
- **Conyuge row visibility** keys off `store.tienePareja()` — Brief A's existing signal. When `tienePareja` is false but the gate is on, the page shows a soft hint card ("No hay cónyuge registrado en Familia…") instead of just leaving the section invisible — keeps the page feeling intentional.
- **Badge intents**: the brief said `intent="positive"`, but `BadgeIntent` is `'neutral' | 'info' | 'success' | 'warning' | 'error'`. Mapped to `success` (Activada — green) and `neutral` (No activada — grey).
- Route registered, sidebar entry now reads `store.proteccionFamiliarState()` with a real `route` field (replacing the hardcoded `'empty'` placeholder).
- Verified live (1440 wide): gate off → no sections → sidebar `empty`. Gate on (no pareja) → cliente section + hint card → sidebar `in-progress`. Set `tienePareja(true)` → cónyuge section appears → sidebar still `in-progress`. Activar cliente via modal → "Marcar como activada" flips state, badge → Activada, Consultar/Desactivar buttons appear → sidebar still `in-progress` (cónyuge not yet). Activar cónyuge → sidebar `complete`. Desactivar cliente → sidebar back to `in-progress`. Console clean.
- **Out-of-scope per the brief:** the real "Flujo de protección familiar" wizard. Today's modal is just a stub that lets the gestor flip the state manually — the wizard ships in a future iteration. Suggested follow-up: dedicated wizard component with steps for product type (seguro de vida / incapacidad / etc.), beneficiary, capital, premium → on completion, write back into `proteccionFamiliar().cliente` / `.conyuge` with the structured data.

## Objetivos chunk recap

All four Objetivos pages are now live and share the `<site-objetivos-page-shell>` + `<site-objetivos-banner>` infrastructure:

| Brief | Route | Status |
| :-- | :-- | :-- |
| E | `/legado-retiro` | ✅ complete |
| F | `/inversiones-futuras` | ✅ complete |
| G | `/desinversiones-futuras` + `/:id` | ✅ complete |
| H | `/proteccion-familiar` | ✅ complete |

Known shared deviation across F/G: `+ Añadir` / `← Volver` CTAs live in body-level toolbars because multi-level `<ng-content>` projection through the shell drops the slot attribute before it reaches `<afi-page-header>`. Refactor candidate: shell accepts a `TemplateRef` for actions via `ngTemplateOutlet`. Would lift the constraint for all three pages at once.

---

## What this session ships

The smallest of the 4 Objetivos pages: **Protección familiar** at `/demos/wealth-planner-2026/proteccion-familiar`. Optional. Two toggleable rows (cliente + cónyuge, the latter only when `tienePareja()` is true) with separate Activar/Consultar/Desactivar actions per row.

The actual "Flujo de protección familiar" sub-flow is **out of scope** for this brief — clicking Activar/Consultar opens a placeholder modal saying *"Flujo pendiente de definir"*, to be specced + built in a future session.

## Pre-flight reads

Same six as Brief E. No additional special reads.

## Sources of truth

- **Figma:** node `60:36493` ("↳ Protección familiar") in file `888lN7vbJSc4gLYt7nP3DW`.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p.6 — "Protección familiar (opcional)".
- **Granola:** sessions 2026-02-26 + 2026-02-27.

## Chrome wrapping (LOCKED — every demo page)

```html
<site-demo-shell
  [views]="['Protección familiar']"
  demoSlug="proteccion-familiar"
  demoRoute="/demos/wealth-planner-2026/proteccion-familiar"
>
  <!-- chrome + banner (when established) + page content -->
</site-demo-shell>
```

## Page composition (locked)

```
<site-demo-shell …>
  <div class="h-screen flex bg-canvas-base overflow-hidden">
    <site-planner-sidebar activeKey="proteccion-familiar" />
    <div class="flex-1 flex flex-col min-w-0">
      <site-planner-top-bar … />
      @if (store.legadoRetiroEstablished()) { <site-objetivos-banner /> }
      <main>
        <afi-page-header
          title="Protección familiar"
          subtitle="Seguros y planes de protección para el cliente y, en su caso, el cónyuge (opcional)."
          [sticky]="false" [scrollFade]="false"
        >
          <span slot="breadcrumb">OBJETIVOS</span>
        </afi-page-header>
        <site-version-toggle … />

        <!-- Main gate -->
        <section class="pf-gate">
          <afi-switch
            label="¿Has establecido protección familiar?"
            hint="Activa para registrar la protección del cliente y, si aplica, del cónyuge."
            [checked]="store.proteccionFamiliarEstablished()"
            (checkedChange)="store.setProteccionFamiliarEstablished($event)"
          />
        </section>

        @if (store.proteccionFamiliarEstablished()) {
          <!-- Cliente row -->
          <section class="pf-section">
            <header><h2>PROTECCIÓN PARA EL CLIENTE</h2></header>
            <div class="pf-row">
              <span class="pf-row__label">Estado</span>
              @if (store.proteccionFamiliar().cliente.activa) {
                <afi-badge intent="positive">Activada</afi-badge>
                <div class="pf-row__actions">
                  <afi-button variant="secondary" size="sm" (clicked)="openFlowPlaceholder()">Consultar</afi-button>
                  <afi-button variant="ghost"     size="sm" (clicked)="deactivateCliente()">Desactivar</afi-button>
                </div>
              } @else {
                <afi-badge intent="neutral">No activada</afi-badge>
                <div class="pf-row__actions">
                  <afi-button variant="primary" size="sm" (clicked)="openFlowPlaceholder()">Activar</afi-button>
                </div>
              }
            </div>
          </section>

          <!-- Cónyuge row — only when Familia.tienePareja is true -->
          @if (store.tienePareja()) {
            <section class="pf-section">
              <header><h2>PROTECCIÓN PARA EL CÓNYUGE</h2></header>
              <div class="pf-row">
                <span class="pf-row__label">Estado</span>
                @if (store.proteccionFamiliar().conyuge.activa) {
                  <afi-badge intent="positive">Activada</afi-badge>
                  <div class="pf-row__actions">
                    <afi-button variant="secondary" size="sm" (clicked)="openFlowPlaceholder()">Consultar</afi-button>
                    <afi-button variant="ghost"     size="sm" (clicked)="deactivateConyuge()">Desactivar</afi-button>
                  </div>
                } @else {
                  <afi-badge intent="neutral">No activada</afi-badge>
                  <div class="pf-row__actions">
                    <afi-button variant="primary" size="sm" (clicked)="openFlowPlaceholder()">Activar</afi-button>
                  </div>
                }
              </div>
            </section>
          }
        }
      </main>
    </div>
  </div>
</site-demo-shell>

<!-- Flujo-pendiente placeholder modal -->
<afi-modal [open]="flowPlaceholderOpen()" title="Flujo de protección familiar" size="sm" …>
  <p>El flujo de protección familiar está pendiente de definir.</p>
  <p>Se abrirá un wizard dedicado en una iteración futura — por ahora marca el estado manualmente.</p>
  <ng-container slot="footer">
    <afi-button variant="ghost"   (clicked)="closeFlowPlaceholder()">Cerrar</afi-button>
    <afi-button variant="primary" (clicked)="markActiveAndClose()">Marcar como activada</afi-button>
  </ng-container>
</afi-modal>
```

## Store extensions

```ts
export interface ProteccionFamiliarData {
  cliente: { activa: boolean };
  conyuge: { activa: boolean };
}

readonly proteccionFamiliarEstablished = signal<boolean>(false);
readonly proteccionFamiliar = signal<ProteccionFamiliarData>({
  cliente: { activa: false },
  conyuge: { activa: false },
});

readonly proteccionFamiliarState = computed<SectionState>(() => {
  if (!this.proteccionFamiliarEstablished()) return 'empty';
  const pf = this.proteccionFamiliar();
  // The mere act of "establishing" the section is enough to mark in-progress.
  // Complete requires cliente.activa (and conyuge.activa if tienePareja).
  if (!pf.cliente.activa) return 'in-progress';
  if (this.tienePareja() && !pf.conyuge.activa) return 'in-progress';
  return 'complete';
});

setProteccionFamiliarEstablished(v: boolean): void { ... }
setClienteActiva(v: boolean): void { ... }
setConyugeActiva(v: boolean): void { ... }
```

## Open work — execution order

1. Extend store with `ProteccionFamiliarData` + signals + state computed + mutations.
2. Build the page (3 files) — gate + cliente row + conyuge row (conditional on `tienePareja`).
3. Build the placeholder modal — small, inline in the page template.
4. Register the route in `demos.routes.ts`.
5. Wire sidebar — `proteccion-familiar` key + route + state computed.

## Verification

Standard 5-point check, plus:
- Toggle the main gate → cliente row appears; if `tienePareja()` is true, cónyuge row appears too
- Without pareja in Familia → cónyuge row hidden
- Click Activar → placeholder modal opens
- Click "Marcar como activada" in modal → status flips to Activada + Consultar/Desactivar buttons appear
- Click Desactivar → returns to "No activada" state
- Sidebar chip: `empty` (gate off) → `in-progress` (gate on, not all activated) → `complete` (gate on + all required activated)

## Decisions still open

- **The "Flujo de protección familiar" sub-flow itself** — entirely out of scope for this brief. Brief notes that the placeholder modal is a stub; real flow specced in a future session.
- **What counts as "complete" for the chip** — proposal: cliente activated + (if pareja) cónyuge activated. Confirm.
- **Should declining protection (explicit "no necesita") be a distinct state from "no activada"?** Default v1: no — same state. Add if requested.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/proteccion-familiar` routes and renders
- [ ] Gate toggle reveals/hides the cliente + cónyuge rows
- [ ] Cónyuge row visibility tied to `store.tienePareja()`
- [ ] Activar / Consultar / Desactivar buttons all wire to the placeholder modal + state mutations
- [ ] Banner appears at top when Legado y retiro is established
- [ ] Sidebar Protección familiar chip + route wired
- [ ] Clean-code + token-guardian + 3-file checks clean
- [ ] PR description notes the "Flujo de protección familiar" out-of-scope status + suggested follow-up
