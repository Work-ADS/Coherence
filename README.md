# Coherence

> **A design system developers actually use — because it's built for how *they* consume information, not how designers wish they would.**

Internal design system for AFI. Angular-first. White-label-ready.

---

## Start here

```
Meeting          →  discovery / research
  ↓
Plan with AI     →  docs/brief-template.md
  ↓
Fill in plan     →  docs/plan.md (living artifact)
  ↓
Build            →  docs/build-kickoff.md → Builder agent
  ↓
Test             →  Tester agent verifies
  ↓
Iterate          →  repeat from Build or Plan
```

---

## Key docs

| Doc | What it is |
|---|---|
| [docs/plan.md](docs/plan.md) | The master plan — scope, decisions, roadmap |
| [docs/architecture.md](docs/architecture.md) | File layout map |
| [docs/brief-template.md](docs/brief-template.md) | Plan-agent prompt for scoping new products/features |
| [docs/build-kickoff.md](docs/build-kickoff.md) | Paste into a fresh session to start building |
| [docs/component-skill.md](docs/component-skill.md) | Agent rules for building any component |
| [docs/token-skill.md](docs/token-skill.md) | Agent rules for defining or consuming tokens |
| [docs/accessibility.md](docs/accessibility.md) | A11y checklist per component |
| [docs/clean-code.md](docs/clean-code.md) | Angular conventions + code discipline |
| [docs/git-cheatsheet.md](docs/git-cheatsheet.md) | 5-6 plain-English git commands |
| [docs/onboarding.md](docs/onboarding.md) | Clone, run, contribute, branch naming |

## Agents

Five-agent lineup in [docs/agents/](docs/agents/):

- **Planner** — scopes work via brief-template
- **Builder** — implements components + tokens
- **Tester** — verifies before done
- **DS-Token Guardian** — enforces token + skill rules
- **Case-study** — documents as we go

## Repo structure

```
libs/tokens/     primitive / semantic / brand (JSON source → CSS generated)
libs/ui/         ~10 core Angular components + 3 chart types
apps/site/       DS reference site (sidebar IA, live components, linkable URLs)
docs/            plans, skills, agents, guides
```

## Visual identity

**Roboto Serif** (display/headings) + **Roboto** (UI body). Monochromatic neutral base + strategic accents. Compact, spatially disciplined. Angular framework.
