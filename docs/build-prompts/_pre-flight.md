# Pre-flight — shared checklist for every primitive build prompt

> Every primitive prompt points here. Run every check. Commit blocks on any failure. No `--no-verify` escape.

Substitute `<primitive>` = the primitive being built (`button`, `input`, `sidebar`, etc.) in the grep paths below.

## 1. Clean-code grep (from `docs/clean-code.md`)

Run each; each must return **no matches**:

```bash
grep -rE '#[0-9a-f]{3,6}|rgba?\(|\d+px' libs/ui/<primitive>/
grep -rE '\bany\b|@ts-ignore|as unknown as' libs/ui/<primitive>/
grep -rE 'EventEmitter|@Input\(' libs/ui/<primitive>/
grep -rE 'console\.log|debugger|TODO|FIXME' libs/ui/<primitive>/
```

Plus: if a `.scss` file exists in the primitive's folder, it is under 20 lines AND has a comment explaining why Tailwind wasn't enough.

## 2. Accessibility (from `docs/accessibility.md`)

Open `docs/accessibility.md`, find the primitive's section under "Per-primitive quick checklist", run every box. Plus the shared non-negotiables:

- Visible focus via `var(--border-focus)` (2px, `action-500`)
- Touch target ≥ 44×44pt at default size unless documented opt-out with `aria-label` rationale
- `prefers-reduced-motion` respected for any animation > 200ms
- Keyboard-operable: Tab reaches every interactive element; Enter/Space actuate where expected
- Tested with VoiceOver (macOS) on the minimum interaction set for this primitive

## 3. RAE copy (from `docs/copy-skill.md`)

Only applies if the primitive hardcodes any user-facing string (e.g., `Cargando…` in Button). For each hardcoded string:

- Spanish, formal register (`usted`) unless product spec overrides
- Accents correct incl. caps
- Glossary-consistent (Panel, Iniciar sesión, Proveedor, Sobrescribir, etc.)
- No English fallback left in

Consumers of the primitive handle their own copy — this check is only for what the primitive itself renders.

## 4. Build + test + lint

```bash
ng test --include="libs/ui/<primitive>/**/*.spec.ts"
ng build ui
ng lint libs/ui/<primitive>
```

All three: zero failures, zero warnings.

## 5. Manual verification

Open the DS site or a scratch app, mount the primitive with default inputs + two edge-case input combinations. Verify:

- Renders visually per the prompt's "What success looks like" section
- Focus ring appears on keyboard focus (Tab) but NOT on pointer focus (click)
- Disabled state is non-interactive and visually distinct
- Loading / transient states announce themselves via `aria-busy` / `aria-live`

## 6. Motion context check (from `docs/plan.md` Motion context rule)

If the primitive adds motion beyond state affordance + transitions (hover, press, enter/exit, loading):

- Is it a DS-site-only effect? → ship as an opt-in variant, default to restrained
- Is it default-on in a consumer product? → justify or cut

## On failure

Fix in-place, re-run. If a rule blocks a legitimate case, **amend the rule** (open an issue, update `clean-code.md` / `accessibility.md` / `copy-skill.md`). Do not skip. Do not `--no-verify`.

## When this file changes

Bump the header date below and note what changed. Primitive prompts stay stable; the pre-flight is the single source of truth for what "done" means.

**Last updated:** 2026-04-16 — initial version.
