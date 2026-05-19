# Coherence docs

Start here if you are new to the project. The docs are organized by what you are trying to understand or do.

## Start here

1. Read [`strategy/manifesto.md`](strategy/manifesto.md) to understand why Coherence exists.
2. Read [`strategy/plan.md`](strategy/plan.md) when you need the full product/system context.
3. Use [`workflow/design-process-assistant.md`](workflow/design-process-assistant.md) when stakeholder input is messy and you need to turn it into a clear design direction.
4. Use [`workflow/brief-template.md`](workflow/brief-template.md) when the direction is clear enough to become a formal project brief.
5. Use [`workflow/build-kickoff.md`](workflow/build-kickoff.md) when a brief is ready to become build prompts.

## Folders

| Folder | Purpose |
|---|---|
| [`strategy/`](strategy/) | Why Coherence exists, what is in scope, and how the repo is laid out. |
| [`workflow/`](workflow/) | Human process docs: messy notes to brief, brief to build, Git basics, release writing. |
| [`rules/`](rules/) | Build rules for components, tokens, accessibility, copy, charts, and code quality. |
| [`agents/`](agents/) | AI session harnesses: Planner, Builder, Tester, Token Guardian, Case-study. |
| [`build-prompts/`](build-prompts/) | Executable work orders for building Coherence primitives, pages, and site surfaces. |
| [`briefs/`](briefs/) | Project briefs created from the workflow. Empty is fine; new briefs land here. |
| [`archive/`](archive/) | Old experiments, session briefs, code examples, and design review material. Useful context, not source of truth. |

## Common paths

### I have messy notes from a meeting

Use [`workflow/design-process-assistant.md`](workflow/design-process-assistant.md) first. It helps extract the problem, main journey, first useful version, key UI pieces, and what can be shown quickly.

### I need a formal plan

Use [`workflow/brief-template.md`](workflow/brief-template.md). The output should be a brief in `docs/briefs/` with Context, Frame, Scope, Spec, and Parked sections.

### I need to build something

Use [`workflow/build-kickoff.md`](workflow/build-kickoff.md). It turns a completed brief into one build prompt per surface under `docs/build-prompts/`.

### I am building or reviewing a component

Read the relevant files in [`rules/`](rules/), especially:

- [`rules/component-skill.md`](rules/component-skill.md)
- [`rules/token-skill.md`](rules/token-skill.md)
- [`rules/accessibility.md`](rules/accessibility.md)
- [`rules/clean-code.md`](rules/clean-code.md)

### I found something old or confusing

Check [`archive/`](archive/) before assuming it is active. Archived docs can explain how we got here, but they should not override `strategy/`, `workflow/`, `rules/`, or `build-prompts/`.
