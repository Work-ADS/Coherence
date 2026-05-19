# Session E — Iteración 2: Add-asset dialog

**You are starting a fresh Claude Code session in the Coherence DS repo. Read this brief fully, then enter plan mode (the user will trigger it), draft a plan, and get user approval before executing. Verify at the end.**

## Goal

Iterate the add-asset dialog (and modal patterns broadly) on the wealth planner per the 2 tasks captured in Iteración 2 — real-world max-field example, modal consistency across sections.

## Prerequisites

**Session A must have landed.** Confirm at session start:
- 3-file Angular convention is the rule
- Pre-commit hook is active
- [`libs/ui/src/modal/`](../../libs/ui/src/modal/) is in 3-file shape

## Scope

### IN — 2 specific tasks

Exact wording lives in [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts). Read it first. Summary:

1. **Real-world max-field example** — the add-asset dialog should demo an example with the maximum realistic number of fields/inputs filled, so reviewers can see what the dialog looks like at its busiest. Catches layout / scroll / focus problems that an empty form hides.
2. **Modal consistency across sections** — modals across the wealth-planner sections (add asset, edit decisions, etc.) should share the same shell, padding, header/footer pattern, close affordance, etc. Right now they likely differ. Reconcile to one pattern.

### OUT

- Modifying [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts).
- Sidebar (Session B), wealth chart (Session C), asset table (Session D), widget (Session F).
- Adding new modal *features* beyond the consistency / max-field requirements.

## Files

**Editing:**
- [`apps/site/src/app/pages/novedades/novedades.page.ts`](../../apps/site/src/app/pages/novedades/novedades.page.ts) — add new card
- Routing config — add new route

**Creating:**
- New surface page at `apps/site/src/app/pages/novedades/{slug}/` (slug e.g. `dialog-decisiones-v2` or a new name) showing the max-field dialog example
- If modal primitive needs consolidation: extend [`libs/ui/src/modal/`](../../libs/ui/src/modal/) with the shared shell pattern, 3-file shape

**Not touching:**
- [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) (versioned)
- The existing [`dialog-decisiones`](../../apps/site/src/app/pages/novedades/dialog-decisiones/) page (kept as baseline if it exists)

## Constraints

- **3-file Angular convention.**
- **DS primitives + tokens only.**
- **Modal a11y baseline:** focus trap, ESC to close, scroll lock on body, focus returns to trigger on close. If these aren't already in [`libs/ui/src/modal/`](../../libs/ui/src/modal/), add them.
- **Iteration page rule** — new page + new card, do not modify `iteracion-2`.
- **Pre-commit hook** must pass.

## How to start

1. Enter plan mode.
2. Read:
   - [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) for the exact 2 task descriptions.
   - [`apps/site/src/app/pages/novedades/dialog-decisiones/`](../../apps/site/src/app/pages/novedades/dialog-decisiones/) for one current modal implementation.
   - Other modal usages in `apps/site/src/app/pages/novedades/` — find them via grep for `<dl-modal>` or `import { ModalComponent }`.
   - [`libs/ui/src/modal/`](../../libs/ui/src/modal/) for the primitive API.
3. Identify the inconsistencies across current modals. Propose the canonical pattern in plan mode.
4. Draft the plan: which modals to reconcile, what primitive changes are needed, what the max-field example demo looks like.
5. Get approval. Execute.

## Verification

- New page renders at `/novedades/{slug}` showing the max-field example.
- The example dialog visibly fills with realistic content (not lorem ipsum) at maximum field count — capture screenshot for user.
- A11y baseline works: open modal, Tab cycles only within modal; ESC closes; focus returns to trigger.
- Modal shell pattern is now consistent — visit each section that uses a modal in the wealth-planner pages and confirm shell / padding / header look identical.
- [`iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts) unchanged.
- Pre-commit hook passes.

## Reference

- Master plan: `~/.claude/plans/okay-i-need-your-swirling-shell.md`
- Iteración 2 source-of-truth: [`apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts`](../../apps/site/src/app/pages/novedades/iteracion-2/iteracion-2.page.ts)
- Memory: "Iteration pages are versioned snapshots."
