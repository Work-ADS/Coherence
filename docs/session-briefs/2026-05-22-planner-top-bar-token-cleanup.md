# Planner top bar — token cleanup pickup brief

**Status:** parked, awaits user "go"
**Branch:** `feature/planner-top-bar-rewrite` (no commits yet — all changes uncommitted)
**Created:** 2026-05-21
**Activates:** when the user says go (likely 2026-05-22)

---

## Where we left off

Five files modified on the working tree (no commits):
- `apps/site/src/app/pages/novedades/shared/planner-top-bar.component.ts` — rewritten to use DS primitives (afi-icon-button, afi-tooltip, afi-inline-edit, afi-status-chip, afi-dropdown-panel, afi-toast). 3 consumer pages verified.
- `apps/site/src/app/pages/novedades/shared/planner-top-bar.component.html` — same rewrite.
- `apps/site/src/app/pages/novedades/shared/planner-top-bar.component.scss` — same rewrite + height bumped to `var(--dimension-12)` to match sidebar logo row.
- `libs/ui/src/icon-button/icon-button.component.scss` — added per-variant `:disabled` blocks using `--*-disabled` tokens; added baseline `border-color: transparent` + `outline-color: transparent` to kill UA leaks.
- `apps/site/src/app/services/inspect.service.ts` — one-line bug fix at line 422: `isRawValue` now accepts `value.startsWith('rgba(0, 0, 0, 0)')` as transparent (was only matching the literal `'transparent'` keyword, which `getComputedStyle` never returns).

Plus one unrelated edit picked up during the session:
- `apps/site/src/app/layout/sidebar.scss` — token rename `--color-neutral-200` → `--border-subtle`. Not authored by me. Worth confirming whether to keep, revert, or commit separately.

## Open work — DO THIS BEFORE COMMIT

Token Guardian violations I introduced. User authorized cleanup but hadn't picked the path when we ended.

1. **Primitive-token leak in a component.** `planner-top-bar.component.scss:13` uses `height: var(--dimension-12)`. Components in `libs/ui/**` (and per the spirit of the rule, ANY component) must route through a semantic token, not a primitive. Define `--top-bar-height` (or `--shell-header-height`) in `libs/tokens/semantic.scss`, mapped to `var(--dimension-12)`, then reference that.

2. **Improvised fallback tokens.** Same file has three offenders:
   - `var(--space-3xs, var(--space-2xs))` — appears in `.ptb__plans` and `.ptb__states` gap. Either define `--space-3xs` (a real 2px primitive + semantic alias) or accept `--space-2xs` as the minimum and drop the fallback.
   - `var(--type-caption-400, var(--type-body-sm-400))` — appears in `.ptb__plans-heading` and `.ptb__plans-id`. Grep for the canonical caption-typography token; if missing, define.
   - `var(--font-weight-medium, 500)` — appears in `.ptb__plans-name`. Likely a real token exists already (Coherence has a typography weight scale). Grep and replace.

## Process — what to do tomorrow when user says go

1. **First read (in order, always):**
   - `docs/strategy/plan.md`
   - `docs/rules/component-skill.md`
   - `docs/rules/token-skill.md`
   - `docs/agents/ds-token-guardian.md`
2. **Then audit the diff** with the Token Guardian checklist (three-layer discipline, naming, values, leakage). Produce the inline review-comment format the agent doc specifies.
3. **Propose** the exact token additions (name, layer, value, brand-manifest entries) BEFORE editing tokens or components. Wait for user approval.
4. **Then apply** in this order per token-guardian.md: primitive gaps → semantic additions → swap component refs.
5. Verify in preview (planner-top-bar still renders, sidebar alignment intact, no new violations from the inspector).

## Decisions still open

- Whether `sidebar.scss` token rename ships with this PR or gets reverted.
- Whether to commit and PR after token cleanup, OR split into two PRs (rewrite-as-is + token hygiene).
