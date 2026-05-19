# Component skill — agent rules for building ANY component

> Consulted BEFORE writing the first line of component code.

## Core principle (LOCKED 2026-04-16)

**"Build once, variants for the rest."**

One component file per primitive. Variants are expressed via `@Input()` props + class binding. Never duplicate component files. Same philosophy as shadcn / `class-variance-authority` — keeps the ~10 component count real; otherwise Button becomes 6 files and the DS bloats like the one we're replacing.

## Core rules

1. **Reads tokens only** — no hard-coded color, spacing, radius, or typography values. Every visual property references a token from `libs/tokens/`. If a token doesn't exist, define it first (see `docs/rules/token-skill.md`).

2. **Uses the 6 semantic buckets** — Canvas / Surface / Action / Control-neutral / System / Data-viz. Every token reference maps to one of these buckets. See `docs/rules/token-skill.md` for the authoritative taxonomy.

3. **Passes the a11y checklist** — aria labels, roles, keyboard nav, focus order, contrast ratios. See `docs/rules/accessibility.md` for the per-component checklist. No component ships without passing.

4. **Follows clean-code.md** — Angular conventions, component file structure, naming, input/output discipline, SCSS organization, no-magic-values rule, token-only styling. See `docs/rules/clean-code.md`.

5. **One file per primitive** — Button, Input, Select, Checkbox, Switch, Card, Modal, Table, Tabs, Drawer. Each is a single component file. Size, intent, and state variants are `@Input()` props that drive class bindings. No `ButtonPrimary.component.ts` + `ButtonSecondary.component.ts` — one `Button.component.ts` with a `variant` input.

6. **Reuse before creating** — if an existing component already expresses the structure, use it. Do not create a parallel component for a graph header, table header, section header, or any other repeated pattern. Extend the existing component with inputs/slots for optional content such as actions, filters, tags, or controls; change the content per use case, not the component.

7. **Consulted before first line of code** — this document is read before any component implementation begins. Not after, not during. Before.

<!-- TODO: expand with full variant examples + Angular patterns (strategy) -->
