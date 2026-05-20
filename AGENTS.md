This is the Coherence DS repo. First read docs/strategy/plan.md. Agent lineup in docs/agents/ — **Planner is live** (session harness over docs/workflow/brief-template.md; invoke when starting or activating a brief). Skills in docs/rules/component-skill.md (build), docs/rules/component-design-skill.md (design — upstream of build), docs/rules/motion-skill.md (named motion patterns + tokens), and docs/rules/token-skill.md.

## 3-file rule (LOCKED)

**Every Angular component, pattern, template, or page in this repo MUST use 3 separate files:**

```
{name}.component.ts    — class only, uses templateUrl + styleUrl
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