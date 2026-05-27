# AWP 2026 — Situación Actual · Brief A: Familia

**Status:** parked, awaits user "go"
**Branch:** `feature/awp-situacion-familia` (to be created)
**Created:** 2026-05-25
**Activates:** when the user says go
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-we-are-going-ethereal-wilkinson.md`](../../.claude/plans/okay-we-are-going-ethereal-wilkinson.md)

---

## What this session ships

The first of 5 Situación Actual pages: **Familia** at [`/demos/wealth-planner-2026/familia`](apps/site/src/app/pages/demos/). Household composition (cónyuge, hijos, ascendientes) — mirrors the legacy "Situación familiar" structure from the prior wealth planner. Borja: *"= Situación familiar, sin cambios"* (PDF p.1, Granola 2026-02-26).

Also lands in this session: the shared **`WealthPlannerStore`** at `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts` — signal-based, holds Familia + Sociedades + Patrimonio + Ingresos + Gastos. Other briefs extend it.

## Pre-flight reads (in order)

1. [`docs/strategy/plan.md`](docs/strategy/plan.md) — visual identity + brand register
2. [`docs/rules/component-skill.md`](docs/rules/component-skill.md) — 3-file rule, BEM, variants via @Input()
3. [`docs/rules/token-skill.md`](docs/rules/token-skill.md) — token discipline
4. [`docs/agents/planner.md`](docs/agents/planner.md) — session harness rules
5. [`docs/agents/ds-token-guardian.md`](docs/agents/ds-token-guardian.md) — token audit checklist
6. The patrimonial page as the pattern to mirror: [`apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.ts`](apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.ts) lines 14–28 (imports), 26–28 (chrome wiring), 92–120 (signal setup)
7. [`apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts`](apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts) — already lists `Familia` at line 66; needs a `route`

## Sources of truth

- **Figma:** node `3:8050` ("↳ Familia ✅") in file `888lN7vbJSc4gLYt7nP3DW`. Pull via `mcp__83105b11-1352-4e5d-863e-292cb5d82301__get_design_context` on these frames:
  - `3:8291` — *Información básico* (the canonical landing tab)
  - `3:8057` — *Miembros de la familia · Pareja*
  - `3:8070` — *Miembros de la familia · Hijos*
  - `3:8161` — *Miembros de la familia · Ascendientes*
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p.1 — "Familia (= Situación familiar)"
- **Granola:** 2026-02-26 (planning) and 2026-03-05 (component review w/ Borja). Query via `mcp__11d6f7d2-233a-49cb-92b7-1ded19f82bdc__query_granola_meetings` if any decision is ambiguous.

## Page composition (locked)

```
<site-planner-top-bar />                    ← shared chrome
<site-planner-sidebar activeKey="familia" /> ← shared chrome
<main>
  <afi-page-header title="Familia" subtitle="…" />
  <site-version-toggle [versions]="versions" [value]="version()" />
  <afi-tabs>
    <afi-tab-item label="Información básica">
      … cliente block (datos básicos)
      … cónyuge block (if applies)
    </afi-tab-item>
    <afi-tab-item label="Miembros de la familia">
      … Pareja section
      … Hijos section (signal array — add/remove)
      … Ascendientes section (signal array — add/remove)
    </afi-tab-item>
  </afi-tabs>
</main>
```

## Primitives — reuse, don't propose new

Every field in the Figma maps to an existing primitive in `libs/ui/src/`:

| Figma field | Primitive | Notes |
|---|---|---|
| Text input | `<afi-input type="text">` | `label`, `hint`, `error` inputs already exist |
| Date | `<afi-input type="text" placeholder="DD/MM/AAAA">` | Date primitive deferred — text + mask is fine for v1 |
| Dropdown (sexo, estado civil, etc.) | `<afi-select>` | Pass `options: SelectOption[]` |
| Sí/No | `<afi-switch>` | For boolean-as-toggle |
| One-of-N (régimen económico, etc.) | `<afi-radio-group>` | Use when options visible inline |
| Section header | `<h2>` + inline styles via `_doc-page-shared.scss` patterns | No new primitive |
| Add Hijo / Add Ascendiente | `<afi-button variant="secondary" size="sm">` w/ `+` icon | Pattern matches `addHolding()` in patrimonial dialog |

The Figma "organism/field/conyuge" / "organism/field/hijo" / "organism/field/ascendientes" blocks compose `label + input + helper` inline. **Do NOT promote this to a `<afi-form-field>` primitive yet** — wait until 3+ pages need identical markup (per the plan's "out of scope" note).

## Open work — execution order

1. **Generate the route** in [`apps/site/src/app/pages/demos/demos.routes.ts`](apps/site/src/app/pages/demos/demos.routes.ts):
   ```ts
   {
     path: 'wealth-planner-2026/familia',
     loadComponent: () => import('./familia/familia.page').then((m) => m.FamiliaPage),
   },
   ```

2. **Stand up the shared store** at `apps/site/src/app/pages/demos/wealth-planner-2026/store.ts`:
   ```ts
   @Injectable({ providedIn: 'root' })
   export class WealthPlannerStore {
     // Familia
     readonly cliente = signal<ClienteData>({ ... });
     readonly conyuge = signal<ConyugeData | null>(null);
     readonly hijos = signal<HijoData[]>([]);
     readonly ascendientes = signal<AscendienteData[]>([]);
     // Other sections — empty signals for now, populated by future briefs
   }
   ```
   Type definitions live alongside in the same file.

3. **Build the page** (3 files, no inline templates/styles):
   - `apps/site/src/app/pages/demos/familia/familia.page.ts` — class + signals + injects `WealthPlannerStore`
   - `apps/site/src/app/pages/demos/familia/familia.page.html` — template, full markup
   - `apps/site/src/app/pages/demos/familia/familia.page.scss` — BEM, semantic tokens only

4. **Wire the sidebar route** — edit [`apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts`](apps/site/src/app/pages/demos/shared/planner-sidebar.component.ts) line 66:
   ```ts
   { key: 'familia', label: 'Familia', state: 'in-progress', route: '/demos/wealth-planner-2026/familia' },
   ```
   State logic: `computed()` derived from `WealthPlannerStore` — `empty` when `cliente().nombre === ''`, `in-progress` when some fields filled, `complete` when required block is done. Implement the computed in `planner-sidebar.component.ts` or in the store (preferred — store).

5. **Version toggle** — add `<site-version-toggle>` with `v1` only; `v2` / `v3` empty `@case` blocks ready for future review forks. Pattern: `patrimonial-proposal.page.ts:113-125`.

## Verification (must all pass before commit)

1. **Clean-code preflight** — `grep -rE "#[0-9a-fA-F]{3,8}|rgba?\(|[0-9]+px" apps/site/src/app/pages/demos/familia/` → expect zero matches.
2. **Token-guardian** — open the new page in `/preview`, activate inspect mode, click each styled element, confirm token chain ends in a semantic token (not a primitive).
3. **3-file rule** — `ls apps/site/src/app/pages/demos/familia/` → exactly `familia.page.ts`, `familia.page.html`, `familia.page.scss`. No inline `template:` or `styles:` in the `.ts`.
4. **Preview verification** — `npm run start` (or whatever script `package.json` defines), navigate to `/demos/wealth-planner-2026/familia` from the sidebar; check at 1440 / 768 / 375 viewport presets via the demo-shell's segmented control.
5. **State flow check** — filling cliente nombre flips the sidebar `Familia` chip from `empty` to `in-progress`; completing the required minimum flips it to `complete`.
6. **Console clean** — no errors, no warnings on load or interaction.

## Decisions still open

- **Section "Información básica" content** — needs another Figma pull (`3:8291`) for the exact field list. Default: nombre, apellidos, fecha de nacimiento, sexo, estado civil, régimen económico (if casado/unido), nacionalidad, NIF. Reconfirm against `3:8291` content before locking.
- **Required-field validation surface** — error styling on `<afi-input>` already exists via `error` input. Decision: skip in v1, wire in v2.
- **Sidebar chip semantics** — exact rule for `empty → in-progress → complete`. Default proposal: `empty` when `nombre` blank; `in-progress` when `nombre` filled; `complete` when nombre + apellidos + fecha nacimiento + estado civil all set. Confirm with user when working.

## Exit criteria

- [ ] `/demos/wealth-planner-2026/familia` routes and renders
- [ ] Sidebar `Familia` item links to it; state computed wired
- [ ] `WealthPlannerStore` exists at `wealth-planner-2026/store.ts` with all five section signals (other sections empty)
- [ ] Información básica + Pareja + Hijos repeater + Ascendientes repeater all functional
- [ ] Clean-code preflight + token-guardian audit + 3-file rule all clean
- [ ] Preview verified at 3 viewport presets, no console noise
- [ ] PR description summarizes the page + the store + the sidebar wire-up + open questions
