# AWP 2026 — Chore: Sidebar §5/§6 split + global `perfilRiesgoActivo`

**Status:** drafted 2026-05-27, awaits user "go"
**Branch:** `chore/awp-sidebar-5-6-split` (to be created)
**Created:** 2026-05-27
**Activates:** prerequisite for the three §5/§6 feature briefs (Evolución comparada · Consecución de objetivos · Generador de informes)
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-now-let-s-plan-concurrent-quiche.md`](../../.claude/plans/okay-now-let-s-plan-concurrent-quiche.md) — chore-sidebar item

---

## Why this exists

Three feature briefs (Brief M1 Evolución comparada, M2 Consecución de objetivos, N-v2 Generador de informes) all need to touch the same two shared surfaces:

1. **The sidebar** in `apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts` — to wire Conclusiones with two children and Informe as its own §6 section.
2. **A global `perfilRiesgoActivo` signal in the store** — because Briefs K (Liquidez), L (Asset allocation), and M2 (Consecución) all derive their numbers from the active risk profile. Per-page state would let switching on one page silently desynchronize the others.

Shipping these as a single chore brief (instead of letting M1+M2+N-v2 race the same file) is faster and avoids three-way merge conflicts.

## What this session ships

Two small, decoupled changes:

### 1. Sidebar IA — §5 Conclusiones (2 children) + §6 Informe (1 child)

Current config:

```ts
{ label: 'Conclusiones', items: [/* nothing yet */] },
{ label: 'Informe', items: [/* nothing yet */] },
```

After:

```ts
{
  label: 'Conclusiones',
  items: [
    { key: 'evolucion-comparada', label: 'Evolución comparada', state: 'complete',
      route: '/demos/wealth-planner-2026/evolucion-patrimonial' },
    { key: 'consecucion-objetivos', label: 'Consecución de objetivos',
      state: this.store.consecucionObjetivosState(),
      route: '/demos/wealth-planner-2026/conclusiones/consecucion-objetivos' },
  ],
},
{
  label: 'Informe',
  items: [
    { key: 'generador-informes', label: 'Generador de informes',
      state: this.store.informeState(),
      route: '/demos/wealth-planner-2026/informe/generador' },
  ],
},
```

**Important:** Conclusiones and Informe are **siblings** at the same level, not Informe nested under Conclusiones. The screens in `Afi brand/Wealth manager screens 2026/` confirm this — every page sidebar shows both as separate section headers.

Two new store computeds are referenced (`consecucionObjetivosState`, `informeState`) — those land with M2 and N-v2 respectively. For this chore, either stub them as `signal<SectionState>('empty')` placeholders OR have this chore add stub computeds that the feature briefs replace. **Default: stub here**, replace in feature briefs.

### 2. Global `perfilRiesgoActivo` signal

Add to `WealthPlannerStore`:

```ts
// ── Plan de acción — global risk profile (Briefs K / L / M2 all read this) ──
export type PerfilRiesgo = 'conservador' | 'moderado' | 'decidido' | 'arriesgado';

readonly perfilRiesgoActivo = signal<PerfilRiesgo>('moderado');

setPerfilRiesgoActivo(value: PerfilRiesgo): void {
  this.perfilRiesgoActivo.set(value);
}
```

**Sequencing note:** Brief K's draft introduces `PerfilRiesgo` as a local type. This chore promotes it to the store. When Brief K activates, it imports the type + signal from the store instead of declaring its own. Briefs L and M2 do the same. Update each of K/L/M2's brief files to note this consumption when this chore lands.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md` + `docs/rules/component-skill.md`
2. `apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts` — current sidebar config (the `sections()` getter)
3. `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts` — where the new signals land
4. Brief K (`2026-05-26-awp-plan-optimizacion-liquidez.md`) — confirm the `PerfilRiesgo` shape matches what K expects

## Sources of truth

- **Figma:** N/A — this is internal IA / data plumbing, not a page surface.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) pp. 10–11 — the §5 Conclusiones / §6 Informe section structure confirming siblings, not nested.
- **Screens:** `Afi brand/Wealth manager screens 2026/Consecución de objetivos/DEFAULT.png` + `Generador de informes/*` — every sidebar render confirms §5 + §6 as separate section headers.

## Coding standards (locked from Brief I)

Every brief in this set inherits these — listed once here, referenced from M1 / M2 / N-v2 / Listado.

- **3-file rule (AGENTS.md § 3-file rule LOCKED):** every new page = `.ts` (class + signals + computeds) + `.html` (template) + `.scss` (BEM, scoped to a `{page-prefix}-*` namespace). NO inline `template:` or `styles:` blocks. No exceptions — `docs/rules/component-skill.md` § 2.
- **Reuse libs/ui primitives:** `<afi-page-header>`, `<afi-button>`, `<afi-table>`, `<afi-modal>`, `<afi-status-chip>`, `<afi-select>`, `<afi-evolucion-bar-chart>`, `<afi-graph-card-header>`, etc. Grep `libs/ui/src/` before authoring markup. The memory rule `feedback_reuse_primitives_not_bespoke` applies: if a primitive does the job, use it; if it doesn't exist, raise the gap BEFORE writing inline HTML.
- **Tokens only in SCSS:** zero hex, rgb, or bare integer px. Use `var(--*)` from `libs/tokens/`. The clean-code pre-commit hook will reject otherwise.
- **Tailwind utilities for layout** matching the AWP idiom established by Patrimonio previsto (Brief I): `mx-space-8 mt-space-6 grid grid-cols-N gap-space-6 text-section text-canvas-fg border-border-hairline pt-space-6` etc. Utilities are tokenized — they expand to the same custom properties the SCSS uses, so they're tokens-by-another-name.
- **Visual style anchor:** Patrimonio previsto (`apps/site/src/app/pages/demos/patrimonio-previsto/patrimonio-previsto.page.*`) is the locked reference. New pages should feel like siblings of that page, not like new explorations.

If any of these blocks the build, raise it BEFORE writing an inline workaround.

## Open work — execution order

1. **Add `PerfilRiesgo` type + `perfilRiesgoActivo` signal + setter** to `WealthPlannerStore`.
2. **Wire sidebar IA** — Conclusiones with 2 children, Informe with 1 child. Stub the two state computeds (`consecucionObjetivosState`, `informeState`) as `signal<SectionState>('empty')`.
3. **Update the K/L/M2 briefs** (or note in their headers) to consume `store.perfilRiesgoActivo()` instead of declaring local state.
4. **Verify**: visit any AWP demo page, confirm the sidebar shows both new sections with the correct children. Items are inactive until the feature briefs ship — that's expected.

## Decisions still open

- **`PerfilRiesgo` default value.** Proposed: `'moderado'` per Brief K's options list. Confirm with user at activation.
- **Stub computed names.** `consecucionObjetivosState` / `informeState` could also be named `consecucionState` / `generadorInformesState`. Default proposal matches the page filename for findability.
- **Configuración link in headers.** Visible in the Informe screen's header (`Configuración | Notas`) but NOT in other screens. Out of scope for this chore, but worth confirming if it's a global addition or screen-specific. Flag for the chore's follow-ups.

## Non-goals (do not pull in)

- Implementing M1 / M2 / N-v2 / Listado — those are separate briefs.
- Migrating routes to `:simulationId` — separate follow-up chore.
- Renaming any existing sidebar items (e.g., "Familia" → "Situación familiar" as shown in screens) — out of scope for this chore.

## Exit criteria

- [ ] `PerfilRiesgo` type + `perfilRiesgoActivo` signal + `setPerfilRiesgoActivo` mutation live in `WealthPlannerStore`
- [ ] Sidebar config has §5 Conclusiones with 2 stub-state children and §6 Informe with 1 stub-state child
- [ ] Clean-code + 3-file check pass (no SCSS changes expected; only `.ts` edits)
- [ ] No regression: every existing AWP demo page still routes and renders
- [ ] K/L/M2 brief headers updated with a one-line note about consuming `store.perfilRiesgoActivo()`
