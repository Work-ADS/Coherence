# AWP 2026 — Conclusiones · Brief M1: Evolución comparada

**Status:** drafted 2026-05-27, awaits user "go"
**Branch:** `feature/awp-conclusiones-evolucion-comparada` (to be created)
**Created:** 2026-05-27
**Activates:** any time after the [chore-sidebar §5/§6 split](2026-05-27-awp-chore-sidebar-section-5-6-split.md) lands
**Plan reference:** [`/Users/richardgriner/.claude/plans/okay-now-let-s-plan-concurrent-quiche.md`](../../.claude/plans/okay-now-let-s-plan-concurrent-quiche.md) — Brief 1

---

## Why this exists

The new screen flow puts Evolución comparada as a **child of §5 Conclusiones**, but the surface that matches the design already exists in code as the standalone `/demos/wealth-planner-2026/evolucion-patrimonial` page. Per the PDF (§5.a, p. 10): *"Evolución comparada (toda la 'Evolución patrimonial' con todas sus variantes y casos)"* — confirmed in code: that page IS the canonical Evolución comparada, just routed and labeled differently.

This brief is mostly a **move + relabel**, not a build. The hard work (chart variants, filters, ajustes popup, accessibility menu) was already shipped under the `EvolucionPatrimonialProposalPage` artifact in earlier sessions.

## What this session ships

Three small touches:

1. **Sidebar wiring** — the chore-sidebar brief already adds the `evolucion-comparada` child under §5 Conclusiones pointing at `/demos/wealth-planner-2026/evolucion-patrimonial`. Confirm it routes and the active state highlights correctly when navigated.

2. **Breadcrumb verification** — the existing template (`evolucion-patrimonial-proposal.page.html` line 22) already shows `CONCLUSIONES` as the breadcrumb. No code change expected, just verify on the live page.

3. **Optional route rename** (Open decision below) — either keep `/wealth-planner-2026/evolucion-patrimonial` for git history continuity, or rename to `/wealth-planner-2026/conclusiones/evolucion-comparada` for URL hygiene. **Default: keep**, sidebar uses the existing route.

Folder name on disk stays `evolucion-patrimonial/` — git history matters more than a folder rename here.

## Coding standards

No new code expected — this brief is a sidebar move + breadcrumb verification. **If** the optional shell migration is picked up (the page currently uses pre-refactor chrome), it inherits [chore-sidebar brief § Coding standards](2026-05-27-awp-chore-sidebar-section-5-6-split.md#coding-standards-locked-from-brief-i): 3-file rule, libs/ui primitives only, semantic tokens, Tailwind utility convention.

## Pre-flight reads

1. `AGENTS.md` + `docs/strategy/plan.md`
2. `apps/site/src/app/pages/demos/evolucion-patrimonial/evolucion-patrimonial-proposal.page.{ts,html,scss}` — the page in question; nothing to change inside
3. The chore-sidebar brief — confirms the sidebar wiring is already done

## Sources of truth

- **Figma:** PDF references node `68078-28738` ([Figma link](https://www.figma.com/design/T3hIzIj78bTHVJhpSimJyK/Afi---Wealth-planner---DEV?node-id=68078-28738)) — the Evolución patrimonial frame is the canonical design.
- **PDF:** [`CambiosAfiWealthPlanner20260226.pdf`](../../CambiosAfiWealthPlanner20260226.pdf) p. 10 — §5.a *"Evolución comparada (toda la 'Evolución patrimonial' con todas sus variantes y casos)"*.
- **Screen:** `Afi brand/Wealth manager screens 2026/` — no dedicated screen for Evolución comparada (it's the existing page); cross-reference the sidebar in `Consecución de objetivos/DEFAULT.png` which shows "Evolución comparada" under Conclusiones.

## Chrome wrapping

No chrome change — `EvolucionPatrimonialProposalPage` already uses the old planner-sidebar + planner-top-bar directly (pre-`<site-objetivos-page-shell>` refactor). **Out of scope for this brief:** migrating it to `<site-objetivos-page-shell>` to match Brief F-onwards. Track as a follow-up if the inconsistency becomes a problem.

## Open work — execution order

1. **Verify after chore-sidebar lands** — navigate to /demos/wealth-planner-2026/evolucion-patrimonial from the new sidebar Conclusiones → Evolución comparada item. Confirm route works + active state highlights.

2. **Resolve Open decision below** with the user — keep route or rename?
   - If keep: no further work.
   - If rename: add a duplicate route entry pointing at the same component, update the sidebar `route` field, leave the old route as a redirect (or 301).

3. **Verify** at three viewport presets (1440 / 768 / 375) — no regression.

## Decisions still open

- **Route rename.** Keep `/wealth-planner-2026/evolucion-patrimonial` (preserves URL stability, matches folder name) OR rename to `/wealth-planner-2026/conclusiones/evolucion-comparada` (matches sidebar IA, but breaks any external links). **Default: keep.** Decide at activation.

- **Shell migration.** This page is the only AWP demo still on the pre-refactor chrome. Migrate it to `<site-objetivos-page-shell>` now, or leave it parked? **Default: leave**, track separately.

## Non-goals (do not pull in)

- Migrating the page to `<site-objetivos-page-shell>` — track as a follow-up chore.
- Reworking the chart, filters, ajustes popup, or accesibilidad menu — they're locked.
- Renaming the on-disk folder.

## Exit criteria

- [ ] Sidebar → Conclusiones → Evolución comparada navigates to the existing page
- [ ] Breadcrumb on the page reads "CONCLUSIONES"
- [ ] Page renders without console errors at the three viewport presets
- [ ] If route was renamed: old URL redirects or the original still works
- [ ] PR description names the route decision (renamed or kept) and links the chore-sidebar brief
