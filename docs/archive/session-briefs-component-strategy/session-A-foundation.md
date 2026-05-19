# Session A — DS foundation pass

**You are starting a fresh Claude Code session in the Coherence DS repo. Read this brief fully, then enter plan mode (the user will trigger it), draft a plan, and get user approval before executing. Verify at the end.**

## Goal

Get the DS foundation aligned with how AFI devs actually write Angular code, and make the alignment enforceable so it survives contact with the team.

## Why this exists

Two compounding problems are blocking the wealth-planner iteration:

1. **Rule misfit.** [`docs/rules/component-skill.md`](../component-skill.md) § 2 currently mandates **single-file inline templates** (the author wrote this thinking shadcn-style). AFI production code uses **3-file Angular convention** (`.html` + `.scss` + `.ts`). The DS is teaching devs the wrong shape — a real reason they bypass it.
2. **No enforcement.** [`apps/site/src/app/pages/novedades/shared/planner-top-bar.component.ts`](../../apps/site/src/app/pages/novedades/shared/planner-top-bar.component.ts) already shipped to `main` with hardcoded `#ffffff`, `#0f172a`, `6px`, `11px`, `16px`. Zero pre-commit / lint protection. The next 13 wealth-planner surfaces will inherit this if nothing changes.

If we ship Iteración 2 without fixing these, every new surface bakes in both problems and gets redone later.

## Scope

### IN

1. **Rule rewrite — `docs/rules/component-skill.md` § 2**
   - Mandate 3-file structure: `.component.ts` + `.component.html` + `.component.scss` as default, with optional `.variants.ts` sibling for class-variance logic.
   - Document the rationale: matches AFI's Angular convention; shadcn's single-file pattern is React-specific.
   - Add the theming + responsive story:
     - **Multi-client theming:** `libs/tokens/` defines base CSS custom properties (`--color-accent`, `--space-md`, etc.). Each client gets a theme file (`libs/themes/afi.scss`, `libs/themes/{client}.scss`) overriding those vars. Component `.scss` files reference vars only — never raw values.
     - **Responsive design:** `@media (max-width: …)` blocks live inside each component's own `.scss`.
2. **Build prompt updates** — update relevant files in [`docs/build-prompts/`](../build-prompts/) (including `_pre-flight.md` and any per-component prompts) to require the 3-file shape.
3. **Enforcement hook** — add a pre-commit hook (`.husky/pre-commit` + `lint-staged`) that runs a grep over staged `*.component.ts` and `*.scss` files for hex codes (`#aabbcc`), `rgba(`, and `\d+px` patterns. Block matches found outside `libs/tokens/`. Reference [`docs/build-prompts/_pre-flight.md`](../build-prompts/_pre-flight.md) § 1 for the exact grep pattern.
4. **Primitive refactor** — convert each primitive in [`libs/ui/src/`](../../libs/ui/src/) from single-file inline template to 3-file shape. The current list (verify at start):

   ```
   badge, button, card, chart, checkbox, download-md-button,
   drawer, input, kbd, loading-overlay, logo, menu, modal,
   nav-item, nav-section, page-header, radio-group, select,
   shell, sidebar, status-chip, switch, table, tabs
   ```

   **This is ~24 primitives — bigger than initially scoped (originally estimated ~5).** Confirm the actual list during plan mode and budget accordingly. Each refactor is mechanical (~15 min): move `template` → `.component.html`, move `styles` array → `.component.scss`, switch decorator from `template` to `templateUrl` + `styleUrls`, keep `.variants.ts` as-is.

   **If 24 is too many for one session,** propose a split in plan mode (e.g., A1 = rules + enforcement + 8 primitives, A2 = remaining 16). Get user approval before splitting.
5. **Tokenize `planner-top-bar.component.ts`** — fix the hardcoded `#ffffff` / `#0f172a` / `6px` / `11px` / `16px` to use tokens. Do this in the same pass; once the hook lands, future changes to this file will be blocked until tokenized anyway.

### OUT

- Any wealth-planner surface changes (Sessions B–E).
- Feedback widget changes (Session F).
- Modifying [`apps/site/src/app/pages/novedades/iteracion-2/`](../../apps/site/src/app/pages/novedades/iteracion-2/) — versioned snapshot, do not touch.
- Adding *new* primitives. This session is restructuring existing ones only.

## Files

**Editing:**
- [`docs/rules/component-skill.md`](../component-skill.md) — § 2 rule change + theming/responsive guidance
- [`docs/build-prompts/_pre-flight.md`](../build-prompts/_pre-flight.md) — hook reference
- [`docs/build-prompts/`](../build-prompts/) — per-component prompts
- Every primitive under [`libs/ui/src/`](../../libs/ui/src/) currently using inline templates
- [`apps/site/src/app/pages/novedades/shared/planner-top-bar.component.ts`](../../apps/site/src/app/pages/novedades/shared/planner-top-bar.component.ts) — tokenize hardcoded styles

**Creating:**
- `.husky/pre-commit` (or extend if it exists)
- `lint-staged` config in [`package.json`](../../package.json)
- One `.component.html` + one `.component.scss` per refactored primitive

## Constraints

- **No `--no-verify`** to bypass the hook you just added. If the hook blocks something legitimate, add a token in `libs/tokens/` and re-commit.
- **No behavior change** to the primitives during refactor — visual diffs should be zero.
- **3-file convention** going forward. The `.variants.ts` sibling stays where it adds value (class-variance logic).

## How to start

1. Enter plan mode.
2. Read [`docs/rules/component-skill.md`](../component-skill.md), [`docs/build-prompts/_pre-flight.md`](../build-prompts/_pre-flight.md), and 1–2 example primitives ([`libs/ui/src/card/card.component.ts`](../../libs/ui/src/card/card.component.ts) is a good baseline) to ground the plan.
3. Verify the exact primitive count under `libs/ui/src/` and decide whether to do all in one session or split.
4. Draft the plan: rule rewrite, enforcement hook, primitive refactor (with split decision if needed), planner-top-bar fix.
5. Get user approval. Execute.

## Verification (before closing the session)

- **Hook works:** try committing a file with `background: #ff0000` inside a `.component.scss` → confirm blocked. Try `padding: 12px` → confirm blocked. Try `background: var(--color-bg-default)` → confirm passes.
- **Primitives unchanged visually:** run the dev server (`apps/site`) and visit `/components/card`, `/components/input`, `/components/tabs`, etc. Each page renders identically to pre-refactor — no visual diffs.
- **Downstream pages still work:** visit `/novedades/patrimonial` and confirm tables/cards/buttons still render (they consume the primitives).
- **`planner-top-bar` is tokenized:** grep the file for hex/px — should return empty for non-token lines.
- **Rule is documented:** `docs/rules/component-skill.md` § 2 explicitly states the 3-file rule + the rationale + the theming/responsive story.

## Reference

- Master plan: `~/.claude/plans/okay-i-need-your-swirling-shell.md`
- Memory: "Handoff uses DS primitives + tokens only — no bare HTML/hex/px in generated code; missing primitive blocks the pattern."
