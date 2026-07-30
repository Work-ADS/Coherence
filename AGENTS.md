This is the Coherence DS repo.

`docs/strategy/plan.md` is the strategy/roadmap context. It is large (~31k tokens), so read it **on demand** — for planning, scoping, or strategy work — **not** for every coding task. For coding work, skip it and follow the required-read order below.

Address the user as **Richard** in conversational replies — natural openers and asides, not on every line, and never in code or file content.


Agent lineup lives in `docs/agents/`:
- **Planner is live**: `docs/agents/planner.md` is the session harness over `docs/workflow/brief-template.md`; invoke it when starting or activating a brief.
- **Builder**: `docs/agents/builder.md` is the implementation harness; invoke it only after scope is locked or a build prompt is green-lit.
- **Tester**: `docs/agents/tester.md` verifies completed work against the brief, pre-flight, a11y, copy, and clean-code rules.
- **Token Guardian**: `docs/agents/ds-token-guardian.md` reviews token additions/references.

`Design.md` at the repo root is the entry-point overview — what Coherence is, brand soul, principles, foundations index. It points at the deep skills; it never duplicates them. Deep rules live in `docs/rules/`: `page-structure-skill.md` (page composition — anatomy, wrapper, slots, responsive baseline, empty state), `component-skill.md` (build), `component-design-skill.md` (design — upstream of build), `motion-skill.md` (named motion patterns + tokens), `token-skill.md`, `clean-code.md`, `accessibility.md`, `copy-skill.md`, and `data-viz-skill.md` (charts — selection, anatomy, labeling, chart a11y).

## Required read order

Before any coding work, read in order:

1. `Design.md` — entry-point overview (principles, brand, foundations index)
2. `docs/agents/builder.md`
3. `docs/workflow/build-kickoff.md`
4. `docs/rules/clean-code.md`
5. `docs/rules/accessibility.md`
6. `docs/rules/copy-skill.md`
7. `docs/rules/component-skill.md`
8. `docs/rules/token-skill.md`
9. `docs/rules/motion-skill.md`
10. `docs/rules/page-structure-skill.md` — page composition (anatomy, sections, wrapper, responsive baseline, empty state)
11. `docs/build-prompts/_pre-flight.md`

Then, only when the work touches a chart: `docs/rules/data-viz-skill.md`. It is the source of truth for chart selection, anatomy, labeling, number formatting and chart keyboard/screen-reader behaviour. Vendored Visa PDS reference sits under `docs/reference/visa-pds/data-visualization/` — consult it for Visa's own wording, never as the rule.

If those files conflict, use this precedence:

1. `page-structure-skill.md` wins for page-level composition (anatomy, section nesting, slot placement, responsive baseline) even over `component-skill.md` when they conflict on slot placement within a page.
2. `component-skill.md` wins for Angular component structure and file layout.
3. `token-skill.md` wins for token naming/layering.
4. `clean-code.md` wins for commit-hook and pre-flight constraints.
5. The specific build prompt wins only inside its scoped surface and only when it does not contradict a skill.

`Design.md` is the overview; it does not arbitrate conflicts. When in doubt, the deep skill wins over the overview.

Before committing implementation work, run the relevant checks:

```bash
bash scripts/clean-code-check.sh <changed files>
npx tsc -p apps/site/tsconfig.app.json --noEmit
npm run build
```

## Reuse before building (LOCKED)

Before writing new UI code, search for existing primitives, composed patterns, and reference screens. Reuse them unless the brief explicitly says they are insufficient.

Required searches:
- `libs/ui/src/` for DS primitives
- `apps/site/src/app/pages/demos/shared/` for reusable demo/product chrome
- `apps/site/src/app/pages/demos/` for composed product reference screens
- `apps/site/src/app/pages/componentes/` and `apps/site/src/app/pages/patrones/` for docs examples

Do not hand-roll these in page code:
- tables
- charts / graphs
- cards / section containers
- modals / dialogs
- drawers
- page headers
- top bars / sidebars
- form fields
- tabs / filter bars

If a similar implementation exists, copy the composition pattern and adapt data/labels only. If the existing primitive cannot support the use case, document the gap before building new UI.

## Wealth Planner references

For Wealth Planner / AWM demo work, use these reference implementations:

- **Tables:** reuse `libs/ui/src/table/` and mirror the Patrimonial table composition in `apps/site/src/app/pages/demos/patrimonial/patrimonial-proposal.page.html`.
- **Section containers:** use `afi-page-header` section/subsection patterns from `libs/ui/src/page-header/`.
- **Top bar / sidebar:** reuse `apps/site/src/app/pages/demos/shared/planner-top-bar.component.*` and `planner-sidebar.component.*`.
- **Add/edit dialogs:** reuse the modal/form composition in `apps/site/src/app/pages/demos/patrimonial/patrimonio-add-modal/` and shared dialog components in `apps/site/src/app/pages/demos/shared/`.
- **Charts / graphs:** use chart primitives or existing chart pattern pages. Do not create ad hoc SVG/HTML charts in page code.

## Persistent label alignment (LOCKED)

For section/table reveal actions such as `Ver datos`, align the always-visible trigger label/icon with the surrounding section text. The resting state is the alignment source of truth.

- The visible label/icon must line up with the section heading, table text, and other persistent content.
- Hover/focus/expanded containers may grow or offset around that anchor; their temporary box alignment is secondary.
- Do not indent the resting trigger just to center or balance a hidden hover panel.

## 3-file rule (LOCKED)

**Every Angular component, pattern, template, or page in this repo MUST use 3 separate files:**

```
{name}.component.ts    — class only, uses templateUrl + styleUrl/styleUrls
{name}.component.html  — external template (NEVER inline template:)
{name}.component.scss  — external styles with BEM + CSS custom properties (NEVER inline styles:)
```

This applies to:
- All primitives in `libs/ui/src/`
- All site page components in `apps/site/src/`
- All reusable shell/template components (e.g. `doc-page-shell`)

**Inline `template:` and `styles:` are banned.** No exceptions. Read `docs/rules/component-skill.md` § 2 for the full rationale.

## Doc page shell (LOCKED)

Every component/pattern documentation page under `apps/site/src/app/pages/componentes/` or `apps/site/src/app/pages/patrones/` MUST:

1. Wrap its content in `<site-doc-page-shell>` (from `apps/site/src/app/components/doc-page-shell/`).
2. Use the named slots: `breadcrumb`, `use-cases`, `controls`, `preview`, `tokens`, `accessibility`, `dos-donts`. Free-form layout outside these slots is not allowed (the catchall `<ng-content />` is reserved for one-off pattern-specific sections like `Decisiones`).
3. Render the tokens block with `<site-doc-tokens [categories]="...">` (from `apps/site/src/app/components/doc-tokens/`). Do not re-implement the Copy button / category filter / table trio per page.
4. Reuse the shared styles in `apps/site/src/app/pages/componentes/_doc-page-shared.scss` for `use-cases`, `control-group`, `prose-section`, and `dos-donts` instead of inventing new ones.

Code sample sections are intentionally absent from the shell — they'll be added uniformly later.

## Design planning command

For messy product/design work, use `docs/workflow/design-process-assistant.md`.

When the user says **plan project**, follow that file:
- guide step by step
- ask one question at a time
- help define problem, main journey, first simple version, key UI pieces, and what can be shown quickly
