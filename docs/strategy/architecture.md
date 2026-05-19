# Coherence Repo Architecture

This map is optimized for onboarding: a designer should be able to tell which docs are active, which docs are rules, and which docs are old context.

```
Coherence/
├── README.md                         # repo front door
├── AGENTS.md                         # AI/session orientation
├── CLAUDE.md                         # Claude Code entry point
├── docs/
│   ├── README.md                     # docs front door for new designers
│   ├── strategy/                     # why + direction
│   │   ├── manifesto.md
│   │   ├── plan.md
│   │   └── architecture.md
│   ├── workflow/                     # how work moves from notes to build
│   │   ├── design-process-assistant.md
│   │   ├── brief-template.md
│   │   ├── build-kickoff.md
│   │   ├── git-cheatsheet.md
│   │   └── blog-template.md
│   ├── rules/                        # constraints for anything built
│   │   ├── component-skill.md
│   │   ├── token-skill.md
│   │   ├── clean-code.md
│   │   ├── accessibility.md
│   │   ├── copy-skill.md
│   │   └── data-viz-skill.md
│   ├── agents/                       # Planner / Builder / Tester / Guardian / Case-study
│   ├── build-prompts/                # executable work orders
│   ├── briefs/                       # project briefs created from workflow
│   └── archive/                      # old experiments and reference material
├── libs/
│   ├── tokens/                       # primitive / semantic / brand token sources
│   └── ui/                           # Angular component library
└── apps/
    └── site/                         # Coherence reference site
```

## Placement Rationale

| Path | Why there |
|---|---|
| `docs/README.md` | The docs map. This is where a new designer starts. |
| `docs/strategy/` | Stable direction: why Coherence exists, what is planned, how the repo is structured. |
| `docs/workflow/` | Process docs used by humans and AI: messy notes to brief, brief to build, Git basics, release writing. |
| `docs/rules/` | Build constraints. These override individual build prompts when there is a conflict. |
| `docs/agents/` | AI role harnesses. Useful for understanding who does what in an AI-assisted workflow. |
| `docs/build-prompts/` | Concrete work orders for components, pages, and system surfaces. |
| `docs/briefs/` | Active project/function briefs. Empty is acceptable. |
| `docs/archive/` | Old session briefs, code examples, and design review exports. Useful history, not source of truth. |
| `libs/tokens/` + `libs/ui/` | The actual design system implementation. |
| `apps/site/` | The browsable documentation/reference site. |
