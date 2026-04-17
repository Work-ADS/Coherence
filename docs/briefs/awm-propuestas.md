# AWM — Propuestas

> **Status: Phases 0–4 COMPLETE (2026-04-17).** Brief is a living artifact — re-read when scope shifts, move items between sections as they resolve. Ready for build-kickoff handoff.
> Part of v1 composed-flow proofs (LOCKED 2026-04-17): AWM Propuestas + Wealth Planner Diagnóstico, two parallel proofs.
> **Sub-artifact:** `docs/briefs/awm-propuestas-demo-script.md` — Tuesday 2026-04-21 pitch script.

---

## Context *(Phase 0 — complete)*

- **Client / team.** AFI Wealth Manager (AWM), internal AFI B2B product. Primary users: **gestores** (financial advisors who build investment proposals for clients). Secondary: **back-office / compliance** (validation layer for certain checks).
- **Project type.** **Redesign** — full rebuild of the propuestas surface. AWM currently runs on PrimeNG; this surface is the first to **move off PrimeNG onto Coherence DS**. This is deliberate: AWM Propuestas is the real-user proof point for Coherence v1 (alongside Wealth Planner Diagnóstico).
- **Existing DS.** PrimeNG on the live product — being replaced by Coherence for this surface. No integration with PrimeNG needed going forward; Coherence tokens + components are the target.
- **Existing Figma.** Yes — `AWM-Wealth-Manager-DEV` (file key `9CuIYPGooTHSrHBKkUQETj`). The Propuestas frame at node `1776:296268` is the reference. Meetings note this file is the consolidation target for ~20 previously scattered Figmas. Treat as the visual starting point, not a locked spec — it will evolve as we build.
- **Stakeholders.** **Nico, Angel, Manu, Oscar** (sign-off + pushback).
- **Priority context.** Propuestas is the **#1 AWM roadmap priority** (Granola sync 2026-04-17).
- **Build sequencing (LOCKED 2026-04-17).** This brief is handed to the Builder **after Coherence DS v1 has shipped** — Foundations, Tokens, the ~10 core components (Button, Input, Select, Checkbox, Switch, Card, Modal, Table, Tabs, Drawer), the 3 chart types, the site shell, animation templates, and the shell catalog will all exist. Propuestas **consumes** Coherence primitives; it never redefines tokens, recreates components, or writes one-off styles. If a pattern doesn't exist in Coherence yet, the Builder escalates it as a DS gap rather than forking locally. Reference: `libs/tokens/`, `libs/ui/`, `docs/component-skill.md`, `docs/token-skill.md`.

---

## Frame *(Phase 1 — in progress)*

### Pains

**Surface symptoms (from Granola AWM syncs):**
- "Ajustes de cartera" has grown by accretion — swallowed what used to be separate "detalle" + "editar datos" screens. Gestores spend most of their time there and it is overgrown.
- Designs scattered across ~20 Figma files; consolidation into one file (`AWM-Wealth-Manager-DEV`) is a forcing function.
- **Reclasificación** (compra → traspaso entrada / venta → traspaso salida) is a new flow with fiscal implications the old design doesn't handle.
- Tablet breakpoints fragile — row-level action buttons need responsive 3-dot treatment.
- Multiple carteras per contract has no real UI yet — early mocks assumed one.
- "Create propuesta" button was missing in early mocks; filtering by name was still under discussion.

**Systemic pain (stakeholder-articulated):**
- **None provided.** Stakeholders handed the team a "redesign these flows" mandate without naming a deeper why. Flagged as a Spec risk: without an articulated systemic pain, success criteria are harder to lock and the rebuild can drift.

### North star

> **A gestor always knows where they are in a propuesta, sees the information they need, and the UI never gets in the way.**

**Secondary outcome (not the north star, but tracked):** AWM Propuestas becomes the visual pattern other AFI products pull from — the proof point that makes Coherence's DS-first argument self-evident. Measured in Phase 3 via "number of AFI product teams referencing Propuestas patterns in their own briefs within 90 days of ship."

### References

**Inherited from Coherence DS plan.md:** shadcn (density), Vercel Design (editorial wrapper), Stripe docs (B2B density proof), Granola + Figma (visual identity anchor), Wise (color model), Linear (IA mechanics), Notion + Stripe (table references). These carry into every Coherence surface, including Propuestas.

**Propuestas-specific references (named by user 2026-04-17):**

1. **Figma** — **the right-panel property-editing pattern**, the way Figma displays type scale and variable options, and the way it gives users options (visual previews + grouped controls rather than a wall of dropdowns). Maps to: propuesta-type selection (Nueva / Rebalanceo / Modificación libre / Reembolso as previewable options, not a plain select), the Ajustes de cartera right-panel for position-level edits, and how the Restrictions side-panel surfaces state.

2. **Linear** — **information-architecture flows**. How Linear moves users between lists, items, sub-views, and command palette without losing orientation. Maps to: Propuestas list ↔ propuesta detail ↔ ajustes ↔ restrictions navigation, breadcrumb/where-am-I cues, and the "build, review, send" flow feeling like a single continuous movement rather than a stack of modals.

3. **motion.dev** — **microinteraction inspiration** (React, but patterns are framework-agnostic — we adapt to Angular + our motion-templates library). Maps to: the "interactions that never get in the way" clause of the north star. Also feeds the already-flagged `<afi-command>` primitive exploration from plan.md.

### Users

**Primary user:** gestor (financial advisor) building, reviewing, and sending investment proposals for clients.
**Secondary user:** back-office / compliance, validating certain propuesta checks.

**Moments in the day — different surfaces, different primary moments (LOCKED 2026-04-17):**

| Surface | Primary moment | Default UI mode | Override |
|---|---|---|---|
| **Propuestas list page** (v1 target) | **Solo** — triage, review, find a draft, open something | **Power tool** — compact rows, keyboard-driven, dense, fast. *Locked example: cmd-K / dedicated keyboard shortcut to start a new propuesta directly from the list, no mouse needed.* | Presenter-mode toggle: larger type, amounts hidden, softer density for screen-share moments |
| **Propuesta flow** (Ajustes → Restrictions → Formalizar → Signaturit — deeper scope) | **Mid-client** — client is watching the screen | Presenter-appropriate density from the start | Power-user accelerators (cmd-K, shortcuts) remain available but don't dominate visual weight |

**Shared pattern:** "Presenter mode" becomes a first-class Coherence pattern — documented once, reusable across any AFI product surface that gets shown to a client (Wealth Planner simulations, etc.).

### Success metrics

Locked 2026-04-17 — 2 leading + 2 lagging, all tied to the north star.

**Leading:**
- **% of gestores using the "start new propuesta" keyboard shortcut at least once per session** (target: **≥ 40% within 30 days of ship**). Proxy: power-tool mode landed.
- **Drop-off rate at each flow step, Borrador → Enviado para firma** (target: **no single step > 15% drop-off**). Proxy: UI never gets in the way.

**Lagging:**
- **Time-to-enviar median (Borrador → Enviado para firma) vs PrimeNG baseline** (target: **−30%**). Direct north-star proof.
- **Gestor satisfaction survey at 30 days, single question: "I always know where I am in a propuesta."** (target: **≥ 8/10 median**). Direct north-star check.

### Instrumentation gap (inherited into Phase 3 — Spec)

Per plan.md ("the team currently tracks nothing — any metric"), none of these four metrics are measurable today. Phase 3 must include:
- Golden-flow event emissions at each step of the propuesta flow (user-id, session-id, timestamp, step-ordinal) per Coherence's standard tracking pattern.
- Keyboard-shortcut-used event from the Propuestas list page.
- Borrador-creation and Enviado-for-firma events timestamped for the time-to-enviar calculation.
- Hook for the 30-day satisfaction survey (cadence + delivery mechanism TBD).
- Baseline capture of time-to-enviar on the PrimeNG version *before* Coherence ships — otherwise the −30% target can't be measured.

---

## Scope *(Phase 2 — in progress)*

### v1 surfaces — Full front-end redesign (LOCKED 2026-04-17, expanded)

Shape: **complete Propuestas front-end**, not a happy-path slice. v1 covers the full interactive front-end of the Propuestas product. v2 handles the integration + productionization layer (real Signaturit, real PDF engine, tablet polish, back-office UI, PrimeNG baseline measurement).

Rationale for expansion: the AFI team ignores incomplete flows (durable memory rule). Shipping Propuestas without Reembolso, Reclasificación, multi-cartera, or real-time restrictions would read as "this doesn't actually do what Propuestas needs to do." The v1 bar is *"Coherence front-end equivalent of production Propuestas."*

1. **Propuestas list page** — table with all 5 states rendered (Borrador / Enviado para firma / Ejecutado / Formalizada / Cancelada), **per-state action wiring fully live** (Borrador: Editar / Eliminar / Enviar para firmar. Enviado para firma: Cancelar firma / Ver. Ejecutado: Ver / Eliminar. Formalizada: Volver a borrador / Solicitar propuesta inversión. Cancelada: Volver a solicitar), **bulk delete via multi-select**, **filter by name**, per-row 3-dot secondary menu, keyboard shortcut for "new propuesta," presenter-mode toggle.
2. **Propuesta-type picker** — modal/drawer with **all 4 types functional**: Nueva / Rebalanceo / **Modificación libre** / **Reembolso**. Each routes to its real flow.
3. **Ajustes de cartera — full** — edit position weights, add/remove assets, **multi-cartera panel** for contracts with 2+ carteras (tabs/switcher between carteras within a single propuesta), **full cartera-modelo integration** (connected-model behavior, deviation flagging, empty-state UI when no model is assigned).
4. **Reembolso tab** (inside Ajustes when propuesta type is Reembolso) — amount input, cartera selection, tax optimization options.
5. **Reclasificación sub-flow** — compra → traspaso entrada / venta → traspaso salida switches, with fiscal implications surfaced in the UI. Needs its own sub-screens or modal sequences within Ajustes.
6. **Restrictions side-panel — real-time** — docked right of Ajustes, validates regulatoria / ESG / contrato restrictions in real time as the gestor edits. Blocks or flags actions that violate restrictions. Data contract with the AWM backend needed (or mocked against a realistic restriction set in the UI-only v1 prototype).
7. **Formalizar → PDF preview modal** — real styled HTML preview of the propuesta (not a real PDF in v1 — HTML-as-PDF-preview swaps to real PDF engine in v2).
8. **Enviar para firma** — Signaturit handoff action. UI + state transition + event fire; actual Signaturit integration is v2. Propuesta state transitions to Enviado para firma, returns to list.

**The Tuesday concept is a subset of this v1** — see Team + Timeline below for what's interactive vs. static on 2026-04-21.

### User stories

| Surface | Story |
|---|---|
| List page — browsing | *As a gestor, I want to see every propuesta for my clients with its state at a glance, so that I can orient instantly and act on what needs attention without digging.* |
| List page — keyboard shortcut | *As a gestor, I want to start a new propuesta via keyboard shortcut from the list, so that the UI never gets in the way when I want to create.* |
| List page — presenter mode | *As a gestor, I want to toggle presenter mode when the list is visible in a client meeting, so that amounts are hidden and type enlarged without leaving the page.* |
| Propuesta-type picker | *As a gestor, I want to choose the propuesta type with visual previews of what each means, so that I see the information I need to decide correctly.* |
| Ajustes — core adjustments | *As a gestor, I want to adjust weights and add or remove assets in a single cartera, so that I build a concrete proposal inside the flow rather than outside it.* |
| Ajustes — restrictions panel (read-only) | *As a gestor, I want to see the current regulatoria / ESG / contrato restrictions for the cartera I'm editing, so that I know what constraints exist — even while real-time validation is out of v1 scope.* |
| Formalizar — PDF preview | *As a gestor, I want to see a PDF preview before sending, so that I review what the client will actually receive.* |
| Enviar para firma | *As a gestor, I want to send the formalized propuesta for client signature via Signaturit, so that the "build → send" arc is complete and the time-to-enviar metric is measurable.* |
| Ajustes — multi-cartera | *As a gestor, I want to switch between carteras within a single propuesta when a contract has 2+ carteras, so that I can build one coherent proposal across the full portfolio.* |
| Ajustes — Reembolso flow | *As a gestor, I want to build a Reembolso propuesta with amount, cartera, and tax optimization options inline, so that redemption requests follow the same clean flow as other types.* |
| Ajustes — Reclasificación | *As a gestor, I want to classify a fund switch as traspaso entrada or traspaso salida with the fiscal implications surfaced in the UI, so that I make the correct fiscal decision without leaving Ajustes.* |
| Ajustes — cartera-modelo integration | *As a gestor, I want the cartera-modelo behavior to match reality (shown when assigned, empty-state when not, deviation flagged), so that I never see a broken or incomplete Ajustes screen.* |
| Restrictions — real-time | *As a gestor, I want the Restrictions panel to validate my edits in real time and flag violations as they happen, so that I don't build a proposal the compliance layer will reject later.* |
| List — bulk delete | *As a gestor, I want to select multiple propuestas and delete them in one action, so that list cleanup doesn't require per-row clicking.* |
| List — filter by name | *As a gestor, I want to filter the list by propuesta or client name, so that I find what I need without scrolling or scanning.* |
| List — per-state actions (Ejecutado / Formalizada / Cancelada) | *As a gestor, I want each state's row to offer its specific actions (Volver a borrador, Solicitar propuesta inversión, Cancelar firma, Ver, Eliminar), so that the list page is the one surface for every propuesta lifecycle action, not just Borrador.* |

### Out-of-scope — explicitly NOT in v1 (LOCKED 2026-04-17, tightened after v1 expansion)

If any of these get asked for mid-build, the Builder points back at this list.

**Integration + productionization (all in v2):**
- **Real Signaturit integration.** v1 fires the UI + event; actual send is stubbed.
- **Real PDF generation engine.** v1 uses styled HTML-as-PDF-preview; v2 swaps in the real PDF engine without UI changes.
- **Live AWM backend data wiring.** v1 is UI-only with fake realistic data.
- **PrimeNG baseline capture for time-to-enviar.** Prerequisite for metric D validity but not a v1 feature — must be scheduled separately, runs in parallel to v1 build.

**Device + platform:**
- **Tablet-responsive polish** (3-dot treatment at narrow widths). Desktop-first in v1. Tablet works but isn't polished.
- **Mobile** — not a target at any phase.

**Adjacent surfaces:**
- **Back-office / compliance validation UI.** That layer stays on PrimeNG; no Coherence surface for it in v1.
- **The rest of AWM** (Carteras, Clientes, Documentos, dashboards). This brief is **Propuestas-only**. Each adjacent surface gets its own brief on demand.

**Instrumentation** (events fire in v1; dashboards that visualize them are separate):
- **Metrics dashboard UI** for the 4 success metrics. Events are captured; visualization lives in the parked "AWM telemetry dashboard" backlog item.

### Golden flow (LOCKED 2026-04-17)

The single ideal end-to-end path through v1 — the 90-second demo. Every step maps to a v1 surface and user story. Branch points are instrumentation hooks handed to Phase 3.

1. Gestor opens **Propuestas list page** (desktop, solo — power-tool mode default).
2. Hits **keyboard shortcut** → Propuesta-type picker opens.
3. Selects **Nueva** (or Rebalanceo) → auto-naming runs invisibly; Ajustes de cartera loads with the propuesta ready to edit.
4. In **Ajustes de cartera**, gestor adjusts position weights and adds/removes assets on the single cartera.
5. **Restrictions side-panel** stays visible, read-only, showing current regulatoria / ESG / contrato constraints while editing.
6. Clicks **Formalizar** → PDF preview modal opens with the propuesta rendered.
7. Confirms → **Enviar para firma** fires the Signaturit handoff.
8. Propuesta state transitions to **Enviado para firma**; gestor is returned to the list; the new row is visible with the new state tag.

**Time-to-enviar clock** (metric D): step 2 start → step 7 confirm.

**Branch points — each becomes a Phase 3 instrumentation event:**

| Step | User forks to... | What we learn |
|---|---|---|
| 2 | Cancels the type picker | Abandonment at type selection |
| 3 | Picks Reembolso or Modificación libre → "coming soon" dead-end | Demand signal for deferred types |
| 4 | Saves as Borrador and leaves | Step drop-off (metric C threshold — no step > 15%) |
| 4 | Needs multi-cartera → no v1 path, must abandon / revert to PrimeNG | Frequency of the hard v1 limitation |
| 5 | Restrictions panel shows a conflict → can still proceed (no enforcement) | Where v2 real-time validation matters most |
| 6 | Abandons at PDF preview | Trust signal — does the preview match expectations |
| 7 | Signaturit handoff fails (if wired) | Integration health |
| Any | Toggles presenter mode | Confirms the mid-meeting scenario is real |

---

## Spec *(Phase 3 — in progress)*

v1 shape locked 2026-04-17: **UI-only prototype** — fake realistic data, stubbed Signaturit, placeholder PDF preview where needed. Deploys to a demo URL, not AWM production. Wiring to real AWM backends + Signaturit + PDF engine is a v1.5 / v2 decision, captured in Parked.

### Technical requirements

**HARD (shipping blocked if missed):**
- **Stack:** Angular + TypeScript, inheriting from Coherence DS v1.
- **DS consumption only:** Propuestas uses Coherence primitives (`libs/ui/*`, `libs/tokens/*`) exclusively. No one-off styles, no re-created components. If a primitive is missing, escalate as a DS gap — do not fork locally.
- **Desktop-first at 1440px** (the Figma frame width). Works at ≥1280px; tablet polish deferred.
- **Modern browsers** — Chrome / Firefox / Safari / Edge, latest 2 versions *(confirm with AWM dev standard)*.
- **Full keyboard flow:** the golden flow completes end-to-end without a mouse (per north star + metric B). The "new propuesta" keyboard shortcut is load-bearing and must be real, not mocked.
- **WCAG AA** throughout — inherits Coherence DS accessibility standard (`docs/accessibility.md`). AAA where feasible in Coherence primitives is fine; Propuestas does not lower the bar.
- **Language:** Spanish. Strings centralized via Coherence's i18n pattern from day one (even if Spanish-only in v1) so English/other languages add later without refactor.
- **Motion:** animations reference Coherence `motion-templates.md` by name (`animation="hover-lift"` / `press-scale` / `focus-ring-fade` etc.). No ad-hoc CSS transitions.
- **Instrumentation — events fire regardless of backend:**
  - **Golden-flow step events** (step-start, per Coherence standard): each of the 8 golden-flow steps emits `{user-id, session-id, timestamp, step-ordinal, propuesta-id}`.
  - **Metric B — keyboard-shortcut usage:** `propuestas.shortcut.new-propuesta.invoked` per session.
  - **Metric C — step drop-off:** derivable from golden-flow step events (adherence rate).
  - **Metric D — time-to-enviar:** `propuesta.flow.start` + `propuesta.enviar-para-firma.confirmed` with timestamps.
  - **Metric F — satisfaction survey hook:** `gestor.survey.prompted` event at 30 days; actual delivery TBD (Parked).
  - **Branch-point events** from the golden-flow branch table — each fork point fires its own event.

**NEGOTIABLE (set defaults; reopen if they bite):**
- **Performance budget:** page-load < 1s on a typical AFI office network; interaction response < 100ms; animation frames at 60fps. Coherence DS motion discipline rules apply.
- **PDF preview fidelity:** v1 renders a **styled HTML preview of the propuesta** (not a real PDF). When the real PDF engine wires in v1.5, the component swaps without UI changes.
- **Fake data shape:** realistic seed JSON (~30 propuestas covering all 5 states; ~5 clients with 1 cartera each). Generated once, committed under the app folder. Memory rule: "no real data; realistic calculations only."

**UNKNOWN (must be answered before build):**
- **Data specifics** — user explicitly flagged "idk about data things yet" (2026-04-17). Shape/fields per propuesta row; restriction data source for the side-panel; which assets populate the happy-path cartera. Phase 4 still-to-determine.
- **Browser matrix** — confirm AWM dev team's supported versions to match.
- **Signaturit stub behavior** — toast + return to list? Mock confirmation screen? (Proposal: toast + state transition + visible row update. Confirm.)
- **Demo deploy target** — URL on Vercel / AFI-owned staging / localhost-only? Affects sign-off scheduling.

### Non-technical requirements

**HARD:**
- **Accessibility: WCAG AA.** Keyboard-only completes the golden flow end-to-end; screen-reader labels on tags, row actions, and the Restrictions panel; focus ring respects Coherence tokens.
- **Content: Spanish.** Regulatory-register tone (matches AFI's existing product voice). No marketing-register microcopy in a B2B advisor tool.
- **Privacy:** UI-only with fake data side-steps GDPR + MIFID II in v1. **Flag:** the moment v1.5 wires real data, compliance review becomes a gate — captured in Parked.

**NICE-TO-HAVE:**
- **English** for the demo deploy (secondary), so non-Spanish-speaking stakeholders can follow the 90-second demo. Achievable if i18n architecture is in place from day one.
- **Reduced-motion honored** across every animation template (Coherence DS rule already).

### Team + timeline

**Team:** Richard (strategy + direction, in Claude) + Builder agent (Angular code generation, in Open Code) + Tester agent (verification). Possibly Miguel as second design eye. No AWM devs in the loop for the concept phase — UI-only doesn't force coordination.

**Deadline — two phases:**

1. **Concept by Tuesday 2026-04-21** *(confirm date — user said "next Tuesday" on 2026-04-17)*. **This is a pitch-disguised-as-demo, not a feature concept.** Three explicit jobs (per user, 2026-04-17):
   - **Beat the parallel PrimeNG Propuestas rebuild to a visible artifact.** AFI dev team is mid-flight on PrimeNG; Coherence version ships first.
   - **Pitch Coherence for Wealth Planner (simulators).** Propuestas is the vehicle; Wealth Planner is the real target of leadership buy-in.
   - **Prove "things are changing so fast"** — the 200% AI-DS productivity claim made empirical.

   Implications:
   - **Visual contrast > feature completeness.** A PrimeNG-looking concept loses the pitch. Must read as *obviously different* — Roboto Serif, Granola warmth-through-type, generous rhythm, motion-template animations. Unmistakable at first glance.
   - **Build the "speed moment" into the demo.** Visible signal that this was built in 4 days solo. Footer badge / intro slide / timestamp.
   - **Wealth Planner teaser appended to the walkthrough.** One static high-fidelity Diagnóstico screen rendered in Coherence, after the Propuestas flow ends. Makes the extrapolation explicit — stakeholders don't have to infer "could this work for simulators?"

   **Scope is a subset of v1** plus the Wealth Planner teaser. Clickable end-to-end walkthrough of the Propuestas golden flow — some surfaces fully interactive, others high-fidelity static — then a one-screen Diagnóstico epilogue.

   | Surface | Tuesday state |
   |---|---|
   | Propuestas list page | Fully interactive — table, fake data, state tags, keyboard shortcut, presenter-mode toggle |
   | Propuesta-type picker | Fully interactive — 4 visual options |
   | Ajustes de cartera | High-fidelity static — layout + positions list + restrictions panel; no editing |
   | Restrictions side-panel | Static visual |
   | Formalizar PDF preview | Static mockup modal |
   | Enviar para firma | Static success screen |
   | **Wealth Planner Diagnóstico (epilogue)** | **High-fidelity static** — line chart (EvolucionChart) + bar (CashflowChart) + donut (AssetAllocationChart) + EscenarioTable. Chart rendering can be static SVG / placeholder if real Charts.js-style components aren't wired yet. |

   **Sequencing inside the 4-day window:**
   - Day 1–2 (Fri–Sat 2026-04-17/18): **Coherence DS minimum-needed-for-Propuestas** — tokens + Button, Table, Tag, Modal, Checkbox, Drawer. Input, Select, Switch, Card, Tabs defer until post-concept.
   - Day 3 (Sun 2026-04-19): list page + type-picker modal, interactive.
   - Day 4 (Mon 2026-04-20): Ajustes + Restrictions + Formalizar + Enviar static walkthrough **+ Wealth Planner Diagnóstico teaser** (static).
   - Tue 2026-04-21: demo.

2. **Full v1 after concept is approved.** Everything in the v1 surfaces section above ships in the post-concept build, once direction is accepted. No date locked — "ship when good" once the rushed-concept pain is avoided.

**Risk flagged (durable AFI pattern):** "Concept by Tuesday" is exactly the setup the plan.md "Rushed + no accountability" pain names. Mitigations:
- The concept is **labeled "concept" in the demo itself** (visible watermark or banner) so stakeholders cannot mistake it for shipping work.
- The full-v1 brief above is the receipt — if sign-off on Tuesday is used to say "ship this," the list of deferred surfaces and stubs is right here.
- Mid-concept checkpoint (end of Day 2, Coherence DS minimum done) — Richard reviews alone before touching Propuestas; if the DS isn't ready, Tuesday scope cuts further rather than everything slipping.

**Dependencies / blockers:**
- Coherence DS v1 **minimum** must land by end of Day 2 for the concept to be Coherence-styled. If not, concept reverts to **hand-styled with Coherence tokens only** (no component library behind it) — uglier but traversable.
- Sign-off audience: **Nico / Angel / Manu / Oscar.** Mode: scheduled demo Tuesday. Format TBD — Claude + Open Code tabs, or deployed demo URL? (Still-to-determine.)

---

## Parked *(Phase 4 — in progress)*

### v2 candidates — cut from v1, come back first when v1 ships

v1 absorbed the full Propuestas front-end on 2026-04-17. v2 is now narrowly the **integration + productionization layer**:

- **Real Signaturit integration.** v1 fires the UI + state-transition event; v2 wires the real send.
- **Real PDF generation engine.** v1 uses styled HTML-as-PDF-preview; v2 swaps the engine without UI changes.
- **Live AWM backend data wiring** (hybrid phase / v1.5). Coherence-Propuestas front-end merged into the live AWM Angular app, calling real AWM backends.
- **Tablet-responsive polish** — 3-dot treatment for row actions at narrow widths.
- **Back-office / compliance validation UI layer.** Stays on PrimeNG until a dedicated brief scopes it.
- **Metrics dashboard UI** for the 4 success metrics (events already fire in v1).
- **PrimeNG baseline capture for time-to-enviar.** Prerequisite for metric D — scheduled as a parallel work item that must run before Coherence replaces PrimeNG in production.

### Backlog — adjacent and larger, not in v1 or v2 but don't lose

- **Rest of AWM** (Carteras, Clientes, Documentos, dashboards). Coherence-ifying the rest of the product — brief-by-brief, on demand. Part of the "move off PrimeNG" arc that the Propuestas pitch is opening.
- **Wealth Planner full build.** If the Tuesday pitch lands, Wealth Planner Diagnóstico graduates from v1 composed-flow proof to its own full product brief. The Tuesday Diagnóstico teaser is the seed.
- **Cross-product SQL dashboard / user-movement telemetry** (plan.md backlog item). The 4 Propuestas success metrics are events in v1; they need a visualization layer to become organizationally visible.

### Still to determine — ordered by leverage

1. **Demo narration + format for Tuesday.** Who walks the stakeholders through it? Is it shown side-by-side vs the in-flight PrimeNG version, or Coherence-only? Script for the 90-second walkthrough. **Highest leverage** — the concept is a pitch; without a narration plan the pitch loses half its force.
2. **Demo deploy target.** Vercel / AFI-owned staging / localhost on Richard's laptop at the meeting? Affects Day 3–4 infra setup and whether stakeholders can revisit the demo after the meeting.
3. **Signaturit stub behavior.** Toast + state transition + row update? Mock confirmation modal? Both are acceptable in v1 — decision unblocks Day 3.
4. **Fake-data shape.** Fields per propuesta row, restrictions data source, which assets populate the happy-path cartera. User flagged "idk about data things yet" — needs ~15 minutes of thinking before Day 3 build.
5. **PrimeNG baseline capture mechanism.** How do we actually instrument the existing PrimeNG flow? Who owns it (Richard? an AWM dev)? Without a plan, metric D is aspirational forever.
6. **Post-Tuesday path.** If pitch succeeds, how fast does `docs/briefs/awm-wealth-planner-*.md` start? If partial: what's the continuation plan? Naming this *before* Tuesday avoids the "rushed concept becomes shipping version" pain.
7. **Confirm "next Tuesday" — 2026-04-21 (4 days) or 2026-04-28 (11 days).** Already flagged; not blocking but affects how interactive the static surfaces can become.
