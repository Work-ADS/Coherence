# Identity v2 — Input · session KICKOFF (start here)

**Date:** 2026-07-13 · **Branch:** `feat/identity-v2-input` (already cut from `main` @ `01a91b2`)
**Predecessor:** button v2 shipped + merged to `main` on both remotes; `feat/identity-v2` deleted everywhere.

---

## Read order (before any code)

1. Full **AGENTS.md** required-read order (all 11 entries) — not a subset.
2. **Companion brief:** [2026-07-13-identity-v2-button-input.md](2026-07-13-identity-v2-button-input.md) — the full input spec lives there (sizes, states, anatomy, constraints, out-of-scope). Read it, but apply the two corrections in §"Deltas" below.
3. This file.

---

## What this session produces

- **`afi-input-v2`** in `libs/ui/src/input-v2/` (parallel to legacy `afi-input`, mirroring the `button-v2` pattern exactly). 3-file convention. Consumes ONLY `foundations-modern` tokens. Renders only under `[data-foundation="modern"]`. **Do NOT touch legacy `afi-input`.**
- The **input variant × size × state grid** added to the existing workbench page (`/demos/foundations-modern/workbench`) — the scaffold, `<site-demo-shell>` wrapper, and `data-foundation="modern"` root are already there from the button work; just add an input section.

## Spec (from the companion brief, line 15)

- **Sizes:** SM / MD / LG
- **States:** default / hover / focus / error / disabled / read-only
- **Anatomy:** label + help text + prefix/suffix (both text and icon)
- Focus ring: `--borders-focus` (info blue placeholder — brand accent still pending Borja; do not invent).
- a11y per accessibility.md: label association, `aria-describedby` for help/error, `aria-invalid` on error. Copy per copy-skill.md (RAE).

## Deltas since the companion brief was written (IMPORTANT)

1. **The Figma Input page `2280:1134` is EMPTY — Richard deleted it.** Ignore companion-brief line 13's "Input (2280:1134)" source. **Input source is unresolved — ask Richard first:**
   - (a) his separate **component playground** — if so, get the file key / node from him at the start, read via `get_design_context` / `get_screenshot`; or
   - (b) build from the **Granola spec above** + the legacy **`libs/ui/src/input/`** as the structural reference (same 3-file shape, label/hint/error a11y wiring, prefix/suffix adornment shell) — rebuilt against foundations-modern tokens.
   - **Do not start building until Richard confirms which.** This is the first question of the session.
2. **Raw-hex effect values, if any, go in a hand-authored `libs/tokens/foundations-modern/component-input.scss`** (mirror how `component-button.scss` handles it) — the pre-commit hook blocks raw hex in `libs/ui/**`. Import it in `apps/site/src/styles.scss` next to the button one.

## Reference: how button-v2 was structured (copy the pattern)

- `libs/ui/src/button-v2/` — `.component.ts` / `.html` / `.scss` / `.variants.ts` / `index.ts`
- `libs/tokens/foundations-modern/component-button.scss` — hand-authored effect styles + gradients (hook-exempt layer)
- `libs/ui/public-api.ts` — exports the component + types
- `apps/site/src/styles.scss` — imports `foundations-modern/index` + `foundations-modern/component-button`
- Workbench: `apps/site/src/app/pages/demos/foundations-modern-workbench/`

## Out of scope

Select/menu (next after input), dark-mode values, brand accent, doc pages, the curated moodboard presentation.

## Workflow reminders

- Pre-flight (`docs/build-prompts/_pre-flight.md`) before handoff; note the repo-wide "spec exists" gap is unmet (no test runner configured — infra debt, not this component's debt).
- Commit convention: plain FF merge later; push `github` + open Azure PR via web UI. Co-author line per repo convention.
