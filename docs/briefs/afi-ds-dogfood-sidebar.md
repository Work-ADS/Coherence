# AFI — DS dogfood (sidebar first) (brief)

**Status:** active
**Client:** AFI (internal)
**Product:** Coherence DS docs site (`apps/site`)
**Feature:** Migrate bespoke UI on the docs site to DS primitives — starting with the docs-site sidebar (`apps/site/src/app/layout/sidebar.*`) currently hardcoded and bypassing `afi-sidebar`.
**Started:** 2026-05-22
**Last updated:** 2026-05-22

---

## Context

- **Client / team:** AFI internal. Two audiences: (1) the Coherence DS team itself (you), (2) the AFI dev + design consumers who use the docs site as a working reference.
- **Project type:** Iteration. The docs-site sidebar today is bespoke HTML (`apps/site/src/app/layout/sidebar.*`). The wealth-planner already uses `afi-sidebar` (the primitive). Goal: unify on the primitive, with variants for visual differences.
- **Existing DS:** Coherence is the DS. `afi-sidebar` exists at `libs/ui/src/sidebar/` with variants `'neutral' | 'brand'` and modes `'static' | 'collapsible' | 'hover-expand'`. Companion primitives: `afi-nav-section` + `afi-nav-item`.
- **Existing Figma / mocks:** A Figma sidebar exists but is a **draft iterated in prior Claude sessions** — not authoritative. The **DS implementation (`afi-sidebar` + the docs-site rendering it produces) is the spec.** No new Figma needed.
- **Stakeholders:**
  - Sign-off: Richard (design lead at AFI).
  - Push-back risk / adoption target: AFI dev lead — the beachhead adopter per [plan.md](../strategy/plan.md) §"Intended outcomes".

### Why the docs site matters (carry-over for Phase 1)
The docs site is the surface where DS consumers (devs + designers) inspect components, find bespoke HTML/CSS/JS/TS, identify raw values, and turn them into tokens. Dogfooding isn't aesthetic — it's the workflow that keeps the token layer evolving. If the docs site itself uses bespoke HTML, that loop breaks at the source.

## Frame
(Phase 1 — pains + north star locked; references / users / metrics intentionally skipped because this is execution work, not design)

### Pains
Symptoms (what's visibly going wrong):
- Designer builds Figma components with states + variables; devs don't consume them. The design intent gets re-discovered (or lost) at build time.
- Designer gets "where is X" messages from devs — designer becomes a live lookup service. Time tax + interrupts deep work.
- Figma variable names ≠ code token names. Devs map by hand per use. Slow + lossy + error-prone.
- Static Figma frames can't communicate motion or responsive behavior. Microinteractions and breakpoint nuance never make it across the handoff.

**Systemic pain (one sentence, user's words):** Close the gap between design and code, at least for front-end and component infrastructure.

If this stays broken, dogfooding the docs-site sidebar is decoration. The work is worth doing because it makes the docs site honest enough that the gap-closing loop (inspect → find raw value → token-ize → reuse) can run.

### North star

> **The docs site is the working spec — same components, names, and behaviors devs ship.**

## Scope

**v1 surfaces:**
1. Refactor `apps/site/src/app/layout/sidebar.{ts,html,scss}` to use `afi-sidebar` (mode=static, default variant).
2. Add a `secondary-azul` variant to `afi-sidebar` (the AFI secondary brand blue used by the wealth-planner today).
3. Switch wealth-planner's `planner-sidebar.component.ts` from `variant="brand"` to `variant="secondary-azul"`.
4. **Plus a corrective sweep:** find consumer pages that compose bespoke HTML where primitives already exist (e.g. the plan-switcher dropdown in `planner-top-bar.component.html` should use `afi-menu` + `afi-menu-item` + `afi-menu-divider` instead of bespoke `<button class="ptb__plans-item">`). Fix those.

**Out of scope:** selects on `/componentes/*` playgrounds (parked for next pass), audit of other bespoke surfaces beyond the items above.

**Subsequent phases (Spec, Parked) not run** — this is execution work, the brief above is enough framing.

## Spec
(Phase 3)

## Parked
(Phase 4)
