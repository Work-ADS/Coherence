# Build kickoff — handoff from Planner to build

> Consulted after `docs/briefs/{slug}.md` reaches `**Status:** complete`. Converts the brief into build prompts that Open Code (or any agentic coder) executes. Symmetric twin of `docs/brief-template.md` — brief is strategy, kickoff is execution.

## Purpose

Planner produces strategy. Build kickoff converts that strategy into executable prompts — one per v1 surface — that reference the skills in this repo rather than inline them. Open Code reads the prompt + follows the skill links; no "huge prompt" pattern.

## When to invoke

All four must be true:

- Brief's Phase 4 is confirmed
- `**Status:** complete` set in the brief header
- One-paragraph summary exists
- No open question blocks a build surface

If any is missing, return to Planner. Don't guess.

## Inputs this step reads (in order)

1. `docs/briefs/{slug}.md` — the completed brief
2. `docs/component-skill.md` — how components are built
3. `docs/token-skill.md` — how tokens are built
4. `docs/clean-code.md` — what code must look like
5. `docs/accessibility.md` — what a11y must cover
6. `docs/copy-skill.md` — what user-facing strings must look like
7. `docs/plan.md` — current Coherence DS state (tokens, primitives already built)

## Outputs this step produces

For each v1 surface named in the brief's Phase 2 Scope, one file at:

    docs/build-prompts/{slug}-{surface-slug}.md

## Build-prompt structure (template)

```
# Build — {surface} ({brief slug})

**Brief:** docs/briefs/{slug}.md
**Surface:** {surface name from Phase 2}
**User story:** {verbatim from Phase 2}
**Golden-flow step(s):** {which ordinal(s) from Phase 2 Q4 this serves}

## Scope of this prompt

{one surface, nothing else}

## Required reads (in order, before writing code)

1. docs/clean-code.md
2. docs/accessibility.md
3. docs/component-skill.md
4. docs/token-skill.md
5. docs/copy-skill.md              (only if strings render to users)
6. docs/briefs/{slug}.md — Phase 2 + Phase 3 only

## Primitives / components used

{list the libs/ui/ primitives this surface composes}

If a primitive doesn't exist yet → this prompt is BLOCKED. File the primitive as its own prompt first.

## Behavior requirements

{from Phase 2 user story + Phase 3 hard constraints — verbatim}

## Golden-flow instrumentation

Emit `step-start` on entry to this surface.
Metadata: user-id, session-id, timestamp, step-ordinal = {N}.
Event sink: {from Phase 3 Spec — SQL dashboard, BI, etc.}

## Pre-flight before commit (non-negotiable)

- Run the clean-code grep check against docs/clean-code.md rules
- Run the a11y pass per docs/accessibility.md pre-flight checklist
- Run the RAE copy check per docs/copy-skill.md (only if strings present)

Any failure → fix in place, re-run. Do not commit on amber.

## Out-of-scope for this prompt

{copy from brief's Phase 2 out-of-scope — restated so the coder does not drift}
```

## Rules for generating build prompts

1. **One surface per prompt.** Phase 2 has 5 surfaces → 5 build prompts. Each stands alone.
2. **Reference skills, don't inline them.** The prompt says "read `docs/clean-code.md`", not a 200-line embedded checklist. Skills are the single source of truth.
3. **Primitive gaps block surface prompts.** If the surface needs `<afi-drawer>` and `libs/ui/drawer/` doesn't exist, the drawer prompt ships first. Surface prompt queues behind it.
4. **Every build prompt ends with the pre-flight check.** Non-negotiable.
5. **Golden-flow instrumentation is copied from the brief, not invented.** If the brief didn't lock golden-flow steps, return to Planner.
6. **Token gaps block everything.** A new token referenced by a surface ships first, via `docs/token-skill.md`.

## Execution order (always)

1. **Token gaps** — any new primitive or semantic token referenced by v1 surfaces
2. **Primitive gaps** — any new primitive component referenced by v1 surfaces
3. **Surface prompts** — composed from the above

Open Code runs prompts in that order. The DS team reviews output against the brief at each tier.

## Clean-code check automation (LOCKED 2026-04-16)

Every build prompt ends with the same pre-flight grep block. Implementation:

- Pre-commit git hook runs the greps against the staged diff.
- Regex set lives in `scripts/clean-code-check.sh` (generated from the non-negotiables list in `docs/clean-code.md`).
- Failure = commit blocked + one-line reason printed. Coder (human or agent) fixes in-place.
- No `--no-verify` escape hatch is acceptable — if the rule is wrong, amend the rule.

## Handoff completion

When every v1 surface has shipped + passed pre-flight:

- Update `docs/briefs/{slug}.md` → add a `## Build` block listing each surface + commit SHA
- Brief status stays `complete` — nothing more to write there
- Next step: `docs/case-study.md` — handled by the Case-study agent (see `docs/agents/case-study.md`)

## When a build prompt fails

1. **Builds but fails a11y** → fix in place, re-run. Don't merge.
2. **Builds but drifted from brief** → update the prompt with the missing constraint, re-run. The prompt is the contract.
3. **Needs a primitive that doesn't exist** → file the primitive prompt, queue behind it. Surface waits.
4. **Brief is ambiguous** → back to Planner. Don't guess.
5. **Token doesn't exist** → file a token prompt, queue behind it. Everything waits.

## Voice

Match `docs/manifesto.md` — pragmatic, direct. The build-prompt MDs should read like a work order, not an essay. An engineer opening one should see the surface + the skill references + the pre-flight, and start.
