## File layout — LOCKED 2026-04-16

Full map of where every v1 artifact lives and why. Copies into `docs/architecture.md` verbatim.

```
/Users/richardgriner/Desktop/Coherence/       ← WORKSPACE (not a repo)
├── Coherence/                                 ← THE GIT REPO — open in Cursor/Open Code
│   ├── README.md                              (v1 item 9 — workflow / start here)
│   ├── CLAUDE.md                              (Claude Code entry point — file, not folder)
│   ├── docs/
│   │   ├── plan.md                            (copy of this plan file)
│   │   ├── architecture.md                    (this layout map)
│   │   ├── brief-template.md                  (v1 item 7 — content LOCKED in Appendix A)
│   │   ├── build-kickoff.md                   (v1 item 8)
│   │   ├── git-cheatsheet.md                  (v1 item 10)
│   │   ├── accessibility.md                   (v1 item 11)
│   │   ├── clean-code.md                      (v1 item 12)
│   │   ├── component-skill.md                 (v1 item 13 — build-once-variants-rest rule)
│   │   ├── token-skill.md                     (v1 item 14 — 6 semantic buckets, base-4)
│   │   ├── onboarding.md
│   │   └── agents/                            (v1 item 15 — 5-agent lineup, visible)
│   │       ├── planner.md
│   │       ├── builder.md
│   │       ├── tester.md
│   │       ├── ds-token-guardian.md
│   │       └── case-study.md
│   ├── libs/
│   │   ├── tokens/
│   │   │   ├── primitive/                     (raw values — JSON)
│   │   │   ├── semantic/                      (Canvas / Surface / Action / Control-neutral / System / Data-viz — JSON)
│   │   │   └── brand/
│   │   │       ├── afi.ts                     (manifest — points at ../../../../Afi brand/)
│   │   │       └── default.ts                 (fallback)
│   │   └── ui/                                (Angular components — v1 item 3)
│   └── apps/
│       └── site/                              (DS reference site — v1 item 6)
│           └── src/flows/diagnostico/         (composed-flow proof — v1 item 5)
└── Afi brand/                                 ← SIBLING OF REPO (brand assets)
    ├── logos/
    ├── Manual Afi_2024-2025.pdf
    ├── Brand guide photos/
    └── Logo screenshots/
```

**Placement rationale:**

| Path | Why there, not elsewhere |
|---|---|
| `README.md` at root | Auto-rendered by GitHub / Cursor / Open Code. It IS "start here." |
| `CLAUDE.md` at root | Claude Code convention — first file read per session. It's a file (not a hidden folder), so team sees it. |
| `docs/agents/` (NOT `.claude/agents/`) | `.claude/` is hidden from Finder / file trees — violates team-accessibility rule. `docs/agents/` is visible, readable as documentation, and loaded explicitly via build-kickoff MD. |
| `docs/plan.md` | Working artifact, not the front door. README maps to it. |
| `docs/architecture.md` | Separate from plan — this is the file map everyone references. |
| `docs/*-skill.md` | Human + agent reference. Could later mirror as `.claude/skills/<name>/SKILL.md`. |
| `libs/tokens/` + `libs/ui/` | Angular monorepo convention. |
| `libs/tokens/brand/afi.ts` | TypeScript, not JSON — needs to build relative asset paths at compile time. |
| `Afi brand/` as sibling | Already locked. Brand-agnostic repo; brand swap = point at different sibling. |
