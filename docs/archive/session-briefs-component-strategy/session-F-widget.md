# Session F — Feedback widget as a DS feature surface

**You are starting a fresh Claude Code session in the Coherence DS repo. Read this brief fully, then enter plan mode (the user will trigger it), draft a plan, and get user approval before executing. Verify at the end.**

## Goal

Present the standalone feedback / design-review widget as a Coherence feature surface inside the DS site — like Figma's "Open Prototype" pattern. The widget is its own technical artifact, but the user experiences it as part of the DS flow.

## Prerequisites

**Session A should have landed** (3-file convention, enforcement hook, tokens stable). Session B–E are not required.

This session is **parallelizable** — can run after A or alongside B–E.

## Why this exists

The widget lives at `~/Desktop/Code/design-review-widget/` as a standalone Preact + Vite + Shadow DOM bundle. It's already loosely bridged into the Coherence site via `apps/site/src/index.html` + [`apps/site/src/app/pages/novedades/shared/design-review-bridge.ts`](../../apps/site/src/app/pages/novedades/shared/design-review-bridge.ts), but there's no DS-side documentation or framing — it just exists as a script tag.

Users (designers and AFI devs) currently encounter the widget without context. The goal is to surface it inside the DS site as a documented, branded feature: "this is the Coherence way to give design feedback."

## Scope

### IN

1. **New page** at `/feedback` (or `/handoff`) in [`apps/site/src/app/pages/`](../../apps/site/src/app/pages/). 3-file shape.
2. **Documentation content on the page:**
   - What the widget is (one-paragraph framing).
   - Install snippet (a single `<script>` tag — copy-paste-able).
   - Keyboard shortcuts (`Alt+R`, `Alt+C`, `Alt+D`).
   - How exported markdown lands in `docs/archive/design-review-iterations/`.
   - The "designer → dev" loop story.
3. **Inline version-history viewer** (if feasible) — surface the widget's own version-list UI on the page so users can scrub through prior reviews without leaving the DS site.
4. **Navigation entry** — add the new page to the site's main IA (sidebar or top nav, wherever DS feature surfaces live).
5. **(Optional, scope decision in plan mode)** — re-skin the widget's Shadow DOM to consume Coherence CSS vars via `:host` styles, so it visually matches the DS without being rewritten. CSS vars pierce Shadow DOM cleanly. This may require editing the widget repo at `~/Desktop/Code/design-review-widget/`. Decide in plan mode whether to bundle this or defer.

### OUT

- Rewriting the widget in Angular. The current Preact + Vite architecture is correct — keep it.
- Backend persistence (Cloudflare Worker + D1 from the widget's README) — deferred.
- Authentication / team identity — deferred.
- Any wealth-planner surface work (Sessions B–E).

## Files

**Editing:**
- Site IA / routing config (likely `apps/site/src/app/app.routes.ts` or equivalent)
- The site's nav/sidebar source (`libs/ui/src/sidebar/` consumer, or whatever shells `apps/site/src/app/`)

**Creating:**
- New page at `apps/site/src/app/pages/feedback/feedback.page.{ts,html,scss}` (or `/handoff`)
- If theming the widget: minor edits to the widget repo at `~/Desktop/Code/design-review-widget/src/widget/styles.ts` or similar

**Not touching (unless explicitly scoped):**
- The widget's core logic (`~/Desktop/Code/design-review-widget/src/core/`)
- Wealth-planner pages

## Constraints

- **3-file Angular convention** for the new DS-side page.
- **DS primitives + tokens only** on the DS-side page.
- **Don't break the existing bridge** — [`design-review-bridge.ts`](../../apps/site/src/app/pages/novedades/shared/design-review-bridge.ts) wires the widget's version-change callback to the page's version signal. Whatever you do, the widget must still work on `/novedades/*` pages as it does today.
- **Pre-commit hook** must pass.

## How to start

1. Enter plan mode.
2. Read:
   - `~/Desktop/Code/design-review-widget/README.md` for what the widget does.
   - [`apps/site/src/index.html`](../../apps/site/src/index.html) for how the widget loads today.
   - [`apps/site/src/app/pages/novedades/shared/design-review-bridge.ts`](../../apps/site/src/app/pages/novedades/shared/design-review-bridge.ts) for the bridge pattern.
   - [`docs/archive/design-review-iterations/`](../design-review-iterations/) for where exported markdown lives.
3. Decide scope: docs page only, vs. docs page + Shadow DOM re-skin. Trade-off: the re-skin makes the widget feel native but requires touching a separate repo.
4. Draft the plan with the chosen scope.
5. Get approval. Execute.

## Verification

- New page renders at `/feedback` (or `/handoff`) in the dev server.
- Install snippet is copy-paste-able and accurate.
- Keyboard shortcuts are documented and verifiable in-browser.
- Navigation entry is reachable from the main site nav.
- Widget still works correctly on `/novedades/*` pages — no regression in the existing bridge integration.
- If the optional Shadow DOM re-skin shipped: widget's visual palette matches the DS tokens in light + dark mode.
- Pre-commit hook passes for all DS-side files.

## Reference

- Master plan: `~/.claude/plans/okay-i-need-your-swirling-shell.md`
- Widget repo: `~/Desktop/Code/design-review-widget/`
- Existing bridge: [`apps/site/src/app/pages/novedades/shared/design-review-bridge.ts`](../../apps/site/src/app/pages/novedades/shared/design-review-bridge.ts)
- Memory: "Handoff uses DS primitives + tokens only" — applies to the DS-side page; the widget itself is its own architecture.
