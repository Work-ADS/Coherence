# AWM Propuestas — Tuesday 2026-04-21 Demo Script

> Sub-artifact of `docs/briefs/awm-propuestas.md` — the pitch-disguised-as-demo script.
> Voice: Richard first-person. Target length: **90 seconds walkthrough + 30 seconds Wealth Planner teaser + 60 seconds Q&A headroom ≈ 3 minutes core**.
> Audience: Nico, Angel, Manu, Oscar.

---

## The arc (don't skip — this is what turns a walkthrough into a pitch)

1. **Current reality (name it).** "The team is rebuilding Propuestas in PrimeNG right now. That's real work, it's in flight, and PrimeNG was the right call when we picked it."
2. **The shift.** "What changed — in the last year — is what one designer with AI + a code-first DS can ship. That's not rhetoric; that's what I want to show you."
3. **What I built.** "In 4 days — Friday to today — solo. Using a new in-house DS called Coherence. Here it is."
4. **Walk the flow.** Golden flow, 6-8 surfaces, ~60 seconds.
5. **The extrapolation.** Wealth Planner Diagnóstico teaser. "Because Coherence is a DS, every AFI product inherits this."
6. **The ask.** Two decisions: (a) switch Propuestas to Coherence or keep paralleling? (b) Wealth Planner needs a library — Coherence as the base?

---

## Walk-through cues (per surface — what to say while showing)

**Open on the Propuestas list page.**
> *"This is the list page. Notice the density — every row scans at a glance. No PrimeNG-style 20px padding eating the screen. Five states, color-coded. Every action a gestor needs is one keystroke or click away."*

**Trigger the keyboard shortcut.** (cmd-K or whatever lands)
> *"Gestors work fast. Cmd-K starts a new propuesta without reaching for the mouse. That's what 'UI never gets in the way' means."*

**Type picker appears.**
> *"Four types. Each with a visual preview. A dropdown would've been faster to build but slower to use — and we're optimizing for the gestor's time, not the designer's."*

**Select Nueva. Ajustes de cartera loads.**
> *"This is where gestores spend most of their time. Real weight editing, real add/remove assets. If a contract has 2+ carteras, they switch between them right here — no separate screens. Reembolso and Reclasificación are inline when the propuesta type calls for them. All in one surface."*

**Point to the Restrictions side-panel.**
> *"Real-time validation, docked right. Regulatoria, ESG, contrato — all visible while editing. No surprise rejections from compliance two weeks later."*

**Click Formalizar → PDF preview modal.**
> *"One click to preview. What you see is what the client signs."*

**Confirm → Enviar para firma.**
> *"Signaturit integration. Clock starts when the propuesta begins, stops here. Time-to-enviar — our target metric — is measurable from day one."*

**Return to list; new row appears with updated state.**
> *"And we're back on the list. Three seconds of narration, fourteen of actual interaction — that's the whole flow."*

---

## Wealth Planner teaser handoff

*(Pause. Reset register.)*

> *"One more thing. Because Coherence is a DS, not a one-off, the same primitives power every AFI product. Here's Wealth Planner Diagnóstico in Coherence."*

**Show static Diagnóstico screen.** (EvolucionChart line + CashflowChart bar + AssetAllocationChart donut + EscenarioTable)

> *"Same type family. Same tokens. Same motion language. One library, every product. Which brings me to the actual ask —"*

---

## The ask

> *"Two decisions I'd like your read on:*
>
> 1. *Do we switch AWM Propuestas off PrimeNG onto Coherence — or keep the teams paralleling until production wiring?*
> 2. *Wealth Planner needs a library. It's currently Bootstrap + Angular with no real system. Do we commit to Coherence as the base for the next rebuild, or do we research PrimeNG again?*
>
> *I'm not asking to shut the PrimeNG Propuestas team down. Their work is the safety net and the immediate production target. What I'm asking is what we pick next."*

---

## Anticipated questions + prepared answers

| Q | Short answer | Deeper answer if pressed |
|---|---|---|
| **"Can PrimeNG not do this?"** | "Most of it, yes. But not the way Coherence does — and not with the flexibility we need for white-labeling simulators across different bank brands." | Show the brand-manifest architecture. One file swap → different bank. PrimeNG's Token Studio sync has fought us for months. |
| **"How long does this actually take in production?"** | "UI prototype: 4 days solo. Wiring to real backends: ~2 weeks with one dev. So ~3 weeks total to prod for Propuestas." | We can compare with the PrimeNG team's honest estimate side-by-side. |
| **"What about compliance / security / real data?"** | "Out of scope for this concept — intentionally. Compliance review happens on the wired version, same gate as any production rollout." | UI-only prototype is how we stay fast in the pitch phase. Production has the same compliance path either way. |
| **"Why now?"** | "The AI tooling that made a solo 1-designer DS build realistic didn't exist when we picked PrimeNG. It does now." | Reference the 200% productivity thesis. This demo is the first evidence, not the argument. |
| **"What happens to the PrimeNG team's work?"** | "Their work is the immediate safety net. Coherence is the path to what we ship *next* — Wealth Planner, the rest of AWM, future client brands." | We can merge the PrimeNG Propuestas frontend into Coherence later via the hybrid phase. No work is thrown away. |
| **"What about [Nico/Angel/Manu/Oscar's specific concern]?"** | *(Fill in per person once we know.)* | — |
| **"Is this real, or is it a mockup?"** | "It's real Angular code, Coherence primitives, running in the browser. The backend is stubbed — that's the v2 wiring." | Show the code briefly if the audience is technical. |

---

## Time-discipline checklist (before the meeting)

- [ ] Rehearse the walkthrough **three times** with a timer. Target: 90 seconds. If it's over 2 minutes, cut, don't speed up.
- [ ] Identify **one "speed moment"** inside the demo — a visible signal of "built in 4 days solo." Footer badge or intro slide with `2026-04-17 → 2026-04-21 · 1 designer · Coherence v1`.
- [ ] Confirm **demo deploy target** — localhost on your laptop is fine if the meeting is in person; Vercel / staging URL if remote.
- [ ] If the Wealth Planner teaser isn't ready by Monday EOD: **cut it cleanly**, don't fake it. Lead with Propuestas; park the teaser for the follow-up meeting.
- [ ] Have a **one-sentence version** of the whole pitch ready in case you only get 30 seconds: *"One designer, 4 days, new DS — here's what AWM Propuestas could look like, and here's the same DS applied to Wealth Planner. Two decisions I want your read on."*

---

## Post-demo next-step bets (plan these ahead)

Depending on how the room lands:

- **Enthusiastic yes.** "Great — I'll open the Wealth Planner brief this week, and we sync on merging Coherence-Propuestas into the live AWM Angular app."
- **Cautious yes.** "Understood — I'll keep Coherence going, we revisit after the PrimeNG team ships their version, and compare head-to-head on the same surface."
- **Pushback ("not now").** "Hear you. I'll keep Coherence on the Wealth Planner surface specifically — that's a new product with no existing library to fight." *(Salvage the core ask.)*
- **"Let me think."** "Cool — I'll send the brief doc + a link to the demo. Feedback by Friday would let me plan next week."
