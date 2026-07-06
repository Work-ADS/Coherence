---
slug: modern-ui-2026
eyebrow: RESEARCH · UI 2026
title: What is modern UI in 2026? The research behind Afi's visual redesign
date: 24 June 2026
subtitle: The research base behind the visual redesign — why we're moving now, what problems we're solving, what we mean by modern UI in 2026, and what comes next.
lang: en
mirror-of: ui-moderno-2026
---

> *Part 1 of the redesign series: the research base. Before moodboards, before tokens, before touching a single component — what we read, what we heard, and what we decided to look at.*

## The brief said "modern". We went looking for what that means.

The brief was short and familiar: give us a moodboard — something modern, something fresh. Most redesigns start exactly there. Most stall at the same wall: *modern* was never defined, so every review turns into a taste debate. One person's modern is another person's cold. And preference — even when it's right — doesn't scale across five brands and four teams.

So before opening Figma, we did the homework: turn *modern* from an adjective into a definition. What is 2026 actually converging on? What do users of financial products expect now? What separates fashionable from durable? Agree on those answers first, and everything that follows — moodboard included — gets judged against criteria we chose together, not against the mood of the room. Definition first, moodboard second.

We know this can read as overcomplicating something simple. It's the opposite: everything after gets faster and more collaborative, because we'll have decided together what we believe in.

The stakes justify the rigor. Afi's conversation with clients — wealth, planning, risk, strategy — is at the level of the best in the sector, and the product has to reflect that. Yet interface decisions still get made without a shared language: no tokens, no named patterns, no common reference for "what a sensitive figure looks like" or "how a high-impact action gets confirmed".

`design.afi.es` exists to open that conversation: it centralizes components, tokens, decisions and rules. This redesign is the first project that treats it as the central vehicle, not a parallel repository. And this post is its first deliverable: the definition we propose, where it comes from, and five commitments you can audit us against.

## Three problems a new palette won't fix

A definition is only useful if it solves something. Three concrete problems the research helped us name — the ones "modern" has to answer at Afi.

### Taste doesn't scale. Shared language does.

Without an explicit system, interface decisions rest on personal preference. The 2026 literature calls this *ego-driven UI*: shaping the interface around the taste of whoever decides, rather than around design practice and the user's cognitive load. It's a systemic phenomenon — it shows up in any organization before it closes its design-maturity gap — not a criticism of individuals. The antidote isn't debating taste; it's raising the conversation to tokens, patterns and intent.

And it cuts both ways, deliberately. It's also why we didn't answer the brief from our own taste: a redesign that can only be defended with "trust us, it's modern" is exactly as fragile as one rejected with "I don't like it". A shared definition protects the work — and everyone's time — in both directions.

### Design maturity is a team sport

Design maturity isn't measured by the skill of the designers. It's measured by how far **the rest of the organization** — product, engineering, business, leadership — takes part in the conversation with a shared language.

When that language exists, conversations change. They stop being "I just like it better this way" and become "this pattern is designed for [intent]; does that match what we want?". There's no need to agree on taste; agreeing on intent is enough. It's faster, and it distributes the decision among the people who will sustain it afterwards.

That's why this redesign isn't only design work. It's the opportunity to build, together, the vocabulary that will make deciding easier when it's each team's turn.

### Static layouts serve everyone the same screen

Our digital products are built on static layouts: the page is decided at design time and served identically to everyone. It works, but it carries an implicit contract with the user — *we show you the same thing regardless of what you came here to do*.

For clients who come in to make different decisions — review their wealth, plan a retirement, compare scenarios — that uniformity eventually takes its toll: more clicks, more filters, more friction to reach the same place. The next generation of products resolves that contract differently; we develop this below, in *How interfaces behave*.

![Static layout vs layout adapted to user intent](./assets/modern-ui-2026/static-vs-personalized.svg)
*Diagram 1 — Today we serve the same screen to every user. An adaptive interface proposes a different layer depending on the intent each user arrives with.*

## What "modern" actually means in 2026

A themed synthesis of the internal dossier *Research modern UI*, which collects articles from Velvetum, Stan Vision, Tubik, UX Collective, Merveilleux, Veza Digital, Find a SaaS, and classic references (Don Norman, Figma, Google PAIR). Organized by theme, not by source — in three clusters: how interfaces **look**, how they **behave**, and what **holds them together** underneath. Together, the three clusters are our working definition of modern UI in 2026.

### How interfaces look: calm over spectacle

#### Calm surfaces: Anti-Liquid Glass and true dark mode

The *Liquid Glass* trend — Apple-style depth and translucency — has matured. Professional tools are now adopting *Anti-Liquid Glass*: they keep blur and depth as a spatial cue (it signals that a panel floats above the content) but remove the refractive distortion that hurts legibility in dense interfaces. Linear is the reference.

Dark mode stops being an alternative and becomes the default state of the web: between 60% and 80% of users prefer it (Tubik, Merveilleux). One critical technical detail: never use pure black. Absolute black under white text produces *halation* — the white bleeds over the black and turns blurry. The right choice is very deep slate grays, or blacks tinted toward gray or blue (*off-blacks*).

#### Bento grids: hierarchy without rigid columns

The *bento* grid — asymmetric cards of different sizes, inspired by Japanese lunch boxes — is the default pattern for 2026 dashboards (UX Collective, Tubik). It allows visual hierarchy without being tied to columns: a large card for a rising chart, a small one for recent transactions, all inside the same coherent frame.

Expressive minimalism goes hand in hand with it. High-cognitive-load B2B products — Cresco is the cited example — opt for interfaces that look like technical blueprints: visible grids, monospaced typography, no ornament. It isn't laziness; it's a high signal-to-noise ratio for people moving serious numbers. The blueprint aesthetic communicates competence.

![Flat list vs asymmetric bento grid](./assets/modern-ui-2026/list-vs-bento.svg)
*Diagram 2 — The flat list makes every piece equal. The bento grid uses size and shape to signal importance without imposing rigid columns.*

### How interfaces behave: intent over navigation

#### From *how do I do it* to *what do I want*

The steering-wheel analogy sums up the transition. For a century, the steering wheel responded the same way to a teenager with a learner's permit and to a Formula 1 driver: mechanical, predictable, blind to the person driving. In 2026 it adapts. That adaptation defines the modern interface.

The consequence for design: information architecture stops being a menu tree — *Settings* → *Sub-account* → *Notifications* — and becomes direct access guided by intent. Google PAIR distinguishes between explicit intent (what the user names) and implicit intent (what the system infers from behavior). Both channels feed the decision about what gets shown first.

For Afi, with no conversational AI in the product yet, this doesn't mean bolting on a chat. It means designing forms and screens so the system infers intent earlier and proposes the shortest route.

![Menu tree vs direct access guided by intent](./assets/modern-ui-2026/tree-vs-intent.svg)
*Diagram 3 — Navigation stops asking the user to walk a tree and starts offering short routes from each intent.*

#### The pause that builds trust

Emil Kowalski compares two identical buttons for a high-impact action: one confirms instantly; the other inserts 150–250 milliseconds of processing animation before confirming. The second one generates more trust. The brain needs a visual heartbeat to believe the system has done the work. In 2026, animation is psychological before it is decorative.

The flip side is accessibility: the *reduced-motion* option belongs in onboarding, not buried in menus. For users with vestibular disorders or specific attention profiles, gratuitous motion isn't annoying — it's physically unpleasant.

![Instant button vs button with an intentional 150–250 ms pause](./assets/modern-ui-2026/pause-confidence.svg)
*Diagram 4 — Same gesture, two responses. The instant button feels broken; the 150–250 ms pause conveys that the system is doing the work.*

#### Trust is a formula: transparency + consistency + responsiveness

Stan Vision (*Fintech UX in 2026*) defines the trust formula in financial products as **transparency + consistency + responsiveness**. Two concrete applications:

- **Predictive UX.** Anticipate the user's intent without replacing it. Pre-filling a transfer is welcome; executing it without confirmation is not. And if the application pre-fills, it explains why: *"based on your last three transfers to this payee…"*.
- **Friction and reassurance.** The deliberate pause on high-impact actions, covered above.

One concrete rule from the fintech checklist: replace red/green color coding on indicators with universal arrows (up/down) to meet WCAG AAA.

### What holds it all together: systems over preferences

#### TokenOps: a map that machines can read

AI has moved from generative (producing content) to *agentic* (executing work). Agents observe their environment, plan steps, call APIs and evaluate results. Visually, they have moved out of the center of the screen. The emblematic pattern is Gemini's side panel in Chrome: it doesn't rewrite the recipe you're reading; it suggests variants (oat milk instead of whole milk) in the margin. Human authorship stays intact.

For an agent to build interfaces on top of the system without breaking the visual identity, it needs a machine-readable map. That map is semantic tokens, as Figma describes in its guide. The difference between `blue-500` (descriptive) and `button-primary` (functional) is the difference between a system only humans can understand and one an AI can consume too.

For Afi, with no conversational AI yet, the same principle applies in the other direction. Consistent structural patterns — page actions always in the same place, filters always in the *filters* row, modals sharing one skeleton — preserve identity while content varies. Same structure, different content: the principle Coherence is built on.

![Token cascade: primitive → semantic → component](./assets/modern-ui-2026/token-hierarchy.svg)
*Diagram 5 — One decision at the primitive level propagates to the semantic tokens and, from there, to every component. Without touching a single component.*

#### Emotional design works on three levels

Don Norman describes three levels of emotional design:

- **Visceral.** The immediate reaction to appearance. First impression.
- **Behavioral.** Pleasure and effectiveness during use.
- **Reflective.** Meaning and satisfaction afterwards, in the user's memory.

An interface that only takes care of the visceral falls apart in use; one that only takes care of the behavioral ends up functional but forgettable. Afi needs all three layers. They fit naturally with the time-of-day modes — *Morning / Focus / Evening / Reflective* — emerging in products people use for long stretches.

#### Design maturity: the next jump isn't a design task

The five-stage model (*Ad hoc → Managed → Defined → Optimized → Adaptive*) puts a shared scale under the discussion. Its two interconnected pillars — the team's skill and the integration into the organization's processes — appeared earlier, in *Design maturity is a team sport*.

The Velvetum study (*UX/UI Design Tools 2026*) adds a useful data point on the second pillar. A team of fourteen designers went from 8.2 active tools to 4.2 (Figma, Midjourney, Figma AI, Storybook, Code Connect): annual license costs dropped significantly, onboarding a new designer went from fourteen days to four, and productivity rose 38%.

The interesting part isn't the consolidation — it's what made it possible: the rest of the organization adopted the same stack and the same protocols. *Code Connect* and *Dev Mode* only deliver their 38% when engineering integrates them into the real hand-off flow, not when they live as an optional button in Figma. The tool is available; the value depends on adoption.

The jump from *Defined* to *Optimized* isn't closed by hiring better design. It's closed by changing how decisions are made downstream: product consults tokens before requesting exceptions; engineering implements by semantic name and uses *Dev Mode* as the default hand-off bridge, not an occasional visit; business understands the system as an investment, not a final coat of paint. Afi sits on the border between *Managed* and *Defined*. This redesign is the vehicle to cross it.

![The five stages of design maturity with Afi crossing from Managed to Defined](./assets/modern-ui-2026/design-maturity-stages.svg)
*Diagram 6 — The five stages of maturity. Afi is crossing from Managed to Defined; the next jump — to Optimized — no longer depends on the design team.*

## Five commitments you can hold us to

This is the definition made auditable. Five short commitments, drawn directly from the research, so that when the redesign is reviewed the conversation can point at intentions we agreed on — not at taste.

**1. *Calm Design* as the aesthetic and functional reference.** Neutral tones, functional depth, intentional motion. The interface accompanies; it doesn't compete for attention. (See *How interfaces look*.)

**2. Intent-based design.** Direct access from the user's context, not a walk through a menu tree. No conversational chat — we don't need it yet — but forms and screens that infer intent before asking for it explicitly. (See *How interfaces behave*.)

**3. *TokenOps* ready for the next generation.** Semantic tokens as the single source of truth. Functional naming (`button-primary`), not descriptive (`blue-500`). The technical precondition for an AI to build interfaces on the system without breaking its identity — and, in the meantime, the precondition for any of us to make consistent decisions. (See *TokenOps: a map that machines can read*.)

**4. Functional motion, not decorative.** Every animation pattern is justified by the trust it adds or the attention it directs. The *reduced-motion* option lives in onboarding. (See *The pause that builds trust*.)

**5. Accessibility as a trust contract.** Contrast and typography for diverse cognitive profiles, keyboard and screen-reader routes for every advanced interaction, and critical information that never rests on color alone. (See *Trust is a formula*.)

## What comes next

Next steps of the redesign:

- **Moodboards.** Visual exploration built on the research themes above. Documented in the next post of this series.
- **Token system.** Complete the semantic architecture of `design.afi.es` and migrate the remaining brands with the `coherence-brand-bind` mixin.
- **Page patterns.** Formalize the structural constants (actions, filters, sections) so they withstand content variation without losing identity.
- **Components.** Run the critical pieces through the design-skill process before touching code.

The moodboard the brief asked for is the very next step — and now it has something to be measured against.

---

## Sources

Collected in the internal dossier *Research modern UI* (June 2026), with the original articles cited throughout the post:

- [Gowtham V — *Evolution of UI Design: 2026 Trends Shaping Modern Digital Experiences*](https://www.linkedin.com/pulse/evolution-ui-design-2026-trends-shaping-modern-digital-gowtham-v-c6k4c) — LinkedIn Pulse.
- [Tubik Studio — *UI Design Trends 2026*](https://tubikstudio.com/blog/ui-design-trends-2026/).
- [Blushush — *Top 5 User Interface Design Trends for Modern Websites*](https://www.blushush.co.uk/blogs/top-5-user-interface-design-trends-for-modern-websites).
- [Sohan Talukder — *2026 UI/UX Trends*](https://www.linkedin.com/posts/sohan-talukder_2026-uiux-trends-activity-7414988664407023616-3yMo) — LinkedIn.
- [UX Collective — *The most popular experience design trends of 2026*](https://uxdesign.cc/the-most-popular-experience-design-trends-of-2026-3ca85c8a3e3d).
- [Envato Elements — *Web Design Trends*](https://elements.envato.com/learn/web-design-trends).
- [Spunk — *UI Design Trends 2026*](https://spunk.pics/blog/ui-design-trends-2026).
- [Velvetum — *UX/UI Design Tools 2026*](https://velvetum.com/en/journal/ux-ui-design-tools-2026) (design maturity).
- [Stan Vision — *Fintech UX in 2026: What users expect from modern financial products*](https://www.stan.vision/journal/fintech-ux-in-2026-what-users-expect-from-modern-financial-products) (trust formula).
- [Veza Digital — *Fintech Web Design Trends*](https://www.vezadigital.com/post/fintech-web-design-trends).
- [Merveilleux — *UI/UX Trends 2026*](https://www.merveilleux.design/en/blog/article/ui-ux-trends-2026).
- [Find a SaaS — *SaaS UX Trends 2026*](https://findasaas.com/blog/saas-ux-trends-2026).

Classic and specific references:

- [Don Norman — *Emotional Design: Why we love (or hate) everyday things*](https://www.nngroup.com/books/emotional-design/) (emotional design).
- [Figma — *The future of design systems is semantic*](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/) (TokenOps).
- [Google PAIR — *People + AI Guidebook*](https://pair.withgoogle.com/guidebook/) (intent).
- [dsruptr — *The Ultimate Design Maturity Guide for Tech Leaders*](https://dsruptr.com/2026/01/19/the-ultimate-design-maturity-guide-for-tech-leaders/) (five-stage maturity model).
- [Emil Kowalski](https://emilkowal.ski/) — intentional pause in high-impact interactions (the pause that builds trust).
