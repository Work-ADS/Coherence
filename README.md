# Coherence

> **A design system developers actually use — because it's built for how *they* consume information, not how designers wish they would.**

Internal design system for AFI. Angular-first. White-label-ready.

---

## Start here

New designers should start with [docs/README.md](docs/README.md). It explains what each folder is for and gives the main paths through the system.

```
Messy notes      →  docs/workflow/design-process-assistant.md
  ↓
Formal brief     →  docs/workflow/brief-template.md
  ↓
Build prompts    →  docs/workflow/build-kickoff.md
  ↓
Build + review   →  docs/rules/* + docs/build-prompts/*
```

---

## Key docs

| Doc | What it is |
|---|---|
| [docs/README.md](docs/README.md) | Docs map for onboarding and navigation |
| [docs/strategy/manifesto.md](docs/strategy/manifesto.md) | Why Coherence exists |
| [docs/strategy/plan.md](docs/strategy/plan.md) | The master plan — scope, decisions, roadmap |
| [docs/strategy/architecture.md](docs/strategy/architecture.md) | Repo and docs structure map |
| [docs/workflow/design-process-assistant.md](docs/workflow/design-process-assistant.md) | Turns messy stakeholder notes into a clear design direction |
| [docs/workflow/brief-template.md](docs/workflow/brief-template.md) | Formal prompt for scoping new products/features |
| [docs/workflow/build-kickoff.md](docs/workflow/build-kickoff.md) | Converts a completed brief into build prompts |
| [docs/workflow/git-cheatsheet.md](docs/workflow/git-cheatsheet.md) | 5-6 plain-English Git commands for designers |
| [docs/rules/component-skill.md](docs/rules/component-skill.md) | Rules for building components |
| [docs/rules/token-skill.md](docs/rules/token-skill.md) | Rules for defining or consuming tokens |
| [docs/rules/accessibility.md](docs/rules/accessibility.md) | Accessibility checklist per component |
| [docs/rules/clean-code.md](docs/rules/clean-code.md) | Angular conventions + code discipline |

## Agents

Five-agent lineup in [docs/agents/](docs/agents/):

- **Planner** — scopes work via brief-template
- **Builder** — implements components + tokens
- **Tester** — verifies before done
- **DS-Token Guardian** — enforces token + skill rules
- **Case-study** — documents as we go

## Repo structure

```
libs/tokens/     primitive / semantic / brand token sources
libs/ui/         Angular component library
apps/site/       DS reference site
docs/            strategy, workflow, rules, agents, build prompts, briefs, archive
```

## Visual identity

**Roboto Serif** (display/headings) + **Roboto** (UI body). Monochromatic neutral base + strategic accents. Compact, spatially disciplined. Angular framework.
