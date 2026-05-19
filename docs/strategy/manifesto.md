# Coherence — Manifesto

**Source:** Granola note *DS manifesto AFI* — 2026-04-16
**Purpose:** The philosophical layer behind Coherence and the broader AFI way of working with AI. Coherence is the first concrete instantiation; this document is the *why*. Used as source material for the case-study presentation, as the north-star reference for scoping future work, and as the voice-of-the-project anchor when writing anything outward-facing.
**Link-back:** `docs/plan.md` references this document for Context / North Star / Case-study.

---

## The shift

We are not working harder. We are working more efficiently — and we are using that efficiency to increase revenue and reclaim work-life balance at the same time.

This is not an aspiration. It is already happening. Jobs have already changed since we started working with Claude and Open Code. Designers are creating tools, not just screens. Developers — even juniors — are managing process, reviewing prompts, and shipping flows instead of pushing pixels through tickets. The work of the team has moved up the value ladder; the system we're building is how that move becomes intentional instead of accidental.

---

## What AI is, for us

> *AI as a Socratic guide, not an autocomplete machine.*

Our use of AI is defined by three commitments:

1. **Critical thinking over automatic generation.** The system asks us questions. It forces decisions to be made out loud, one at a time. It does not hand us an answer and hope we approve it.
2. **Preservation, not replacement.** Brainstorming, meeting discussions, stakeholder conversations — the moments where real thinking happens — are captured by the system, not bypassed. The system remembers what we decided and why. It keeps the ideas we almost lost.
3. **Scaffolding, not substitution.** AI does not replace the designer. It does not replace the developer. It removes the wasted motion between them — the unconsumed Figma files, the variables that got mistranslated, the rushed weeks that nobody documented.

---

## What's changing about the work

**The designer's role is moving from screen-drawing to tool-building and strategic thinking.** A year ago, "design work" meant Figma frames. Today, it means: defining a design system that developers actually consume, codifying the brief template the team uses on every new project, and deciding which decisions matter enough to lock before code gets written.

**The developer's role — even at the junior level — is moving from code-typing to process-management, discovery, and prompt-review.** The work that used to be "build this component" is now "review the output of an AI that built this component, and make sure it matches the spec." Less pixel-pushing. More judgment.

**What the designer reviews:** design, taste, animations, and the overall coherence of the product.
**What the team reviews:** backend, accessibility, and code cleanliness.

This division isn't old-world hand-off. It's the load-bearing rule that makes parallel work possible.

---

## What the system contains

Coherence is the design system — tokens, components, charts, composed flows, a reference site, and a 5-agent AI lineup (Planner / Builder / Tester / DS-Token Guardian / Case-study).

The broader system — the *way of working* this manifesto describes — extends beyond the DS to a shared toolbox:

- **Brief template** — a plan-mode agent that scopes any new product or feature through Context → Frame → Scope → Spec → Parked.
- **Build kickoff** — the symmetric twin of the brief template, used to hand off from planning to implementation.
- **Value proposition canvas, user flows, service blueprints, customer journey mapping (as-is and to-be)** — the upstream artifacts that feed a brief before a single component gets built.
- **A living plan file** — the artifact that survives across sessions, tools, and teammates.

None of these are new ideas in isolation. What's new is that AI makes them *enforceable* without consuming human time — the system asks the questions, the humans answer them, the artifacts write themselves.

---

## What success looks like

- **Velocity:** the kind of velocity the Claude Code founder demonstrated by launching 15–20 projects daily becomes reachable for a small team — not by heroic effort, but by scaffolding.
- **Creative confidence through efficiency gains.** When the rushed week goes away, the work gets better. The designer has time to talk to a user. The developer has time to get an implementation right.
- **More time for user conversations and stakeholder engagement.** The wasted motion the system removes gets converted into hours spent with the people the products are for.
- **Work-life balance and revenue, simultaneously.** This is the measurable proof of the bet. If only one improves, the system isn't working yet.

---

## Why now

Y Combinator's current thesis: *"The next billion- and trillion-dollar companies will be agencies and services, not tech startups."* We agree — with one addition. The agencies that win will be the ones that built their own internal scaffolding before the market realized it needed to.

We're already there. Coherence, and everything around it, is the scaffolding.

---

## Tone, when writing about this

Pragmatic, optimistic, direct. **Not** utopian — this is not a "AI will save design" document. The pain we are solving is wasted motion, not existential anxiety. When in doubt, compress. The manifesto should read like an operator describing a tool they use every day, not a founder describing a future they hope for.

---

## Appendix — Source phrases to preserve verbatim

These are the lines from the original Granola transcript that carry voice. Use them directly in the case-study presentation, in outward-facing writing, or wherever the project needs its own words instead of paraphrased ones.

| Phrase | Used for |
|---|---|
| *"Work efficiently vs working hard to maximize revenue"* | Core thesis — opening line or section-header material |
| *"Improve work-life balance while increasing output"* | The "both, not either" bet |
| *"Less pixel pushing, more process management"* | Role evolution — designer + developer both |
| *"Programmers (even juniors) becoming more strategic"* | Pairs with the line above — makes explicit that this isn't a senior-only shift |
| *"Designer role shifting to tool creation and strategic thinking"* | Role evolution — designer side |
| *"Enables critical thinking vs. automatic generation"* | AI philosophy — one-line version |
| *"Preserves brainstorming and meeting discussions"* | What the system is for |
| *"AI will guide team through processes with questions"* | How the system works — the Socratic mechanism |
| *"Building creative confidence through efficiency gains"* | Emotional outcome — what the team actually gets back |
| *"Focus on discovery, research, project management"* | Work-category shift — developer side |
| *"Prompting AI and reviewing code output"* | Work-category shift — developer side (continued) |
| *"Launch multiple projects rapidly"* | Velocity framing — pairs with the Claude Code 15–20/day benchmark |
| *"More time for user conversations and stakeholder engagement"* | The pay-off — what efficiency buys |
| *"Jobs already changing rapidly since switching to Prime and G"* | Proof-of-already-happening — grounds the whole manifesto in evidence, not prediction |
| *"Next billion/trillion dollar companies will be agencies/services"* | Y Combinator anchor — why now |

---

## Appendix — The division of labor, in one table

| Reviews | Owner |
|---|---|
| Design, taste, animations, overall coherence | Designer |
| Backend, accessibility, code cleanliness | Team (developers) |

Simple. Legible. Hard to misinterpret. The kind of rule that survives a new hire's first week.
