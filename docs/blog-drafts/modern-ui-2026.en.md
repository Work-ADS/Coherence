---
slug: modern-ui-2026
eyebrow: RESEARCH · UI 2026
title: What is modern UI in 2026? The research behind Afi's visual redesign
date: 24 June 2026
subtitle: The research base behind the visual redesign — six learnings on what modern UI means in 2026, and a six-point checklist to review the work against.
lang: en
mirror-of: ui-moderno-2026
---

## Context

My boss handed me a vague task. "Build a visual identity for our demos. Something more modern." No persona, no buyer profile, no constraints.

Instead of jumping straight into design, I wanted to answer: What does modern UI mean in 2026?

But why?

Because most designs without definition end up as preference-based designs instead of evidence-based designs. Everyone likes something different, and when the team finally agrees, it gets vetoed by a team lead. Not because of a valuable insight, but because they don't like it.

The decisions ride on individual taste, not shared principles.

## Learning 1: Design maturity

The research called this design maturity. It measured how widely design language is shared in a team — not how skilled the designers are. This was one of the key insights. Obviously colors and fonts matter, but introducing vocabulary the whole team can use will help us maintain the momentum after the initial launch of the new UI. We can make beautiful screens all we want, but if people say no because of preference rather than insight and we don't know how to replicate it, we're setting ourselves up for failure.

The research puts a shared scale under this: five stages of maturity.

- **Ad hoc.** Design happens screen by screen; every decision is personal.
- **Managed.** Reusable pieces exist, but the rules live in designers' heads.
- **Defined.** Tokens and patterns are written down and become the source of truth.
- **Optimized.** The rest of the organization decides with them: product consults tokens before requesting exceptions; engineering implements by semantic name.
- **Adaptive.** The system is machine-readable; an AI can build on it without breaking identity.

Afi sits between *Managed* and *Defined*, and this redesign is the first step to reaching *Optimized*. We have the opportunity to change how decisions are made downstream and boost productivity.

For example, the Velvetum study (*UX/UI Design Tools 2026*) makes the point: a fourteen-designer team's productivity rose 38% because the rest of the organization adopted the same stack and the same protocols.

![The five stages of design maturity with Afi crossing from Managed to Defined](./assets/modern-ui-2026/design-maturity-stages.svg)
*Diagram 1 — The five stages of maturity. Afi is crossing from Managed to Defined; the next jump — to Optimized — no longer depends on the design team.*

## Learning 2: Build around user intent

Our digital products are built on static layouts: the page is decided at design time and served identically to everyone. It works, but it carries constraints — *we show you the same thing regardless of what you came here to do*. For clients who come in to make different decisions — review their wealth, plan a retirement, compare scenarios — that uniformity forces everyone down the same path, no matter which decision they came for.

![Static layout vs layout adapted to user intent](./assets/modern-ui-2026/static-vs-personalized.svg)
*Diagram 2 — Today we serve the same screen to every user. An adaptive interface proposes a different layer depending on the intent each user arrives with.*

UI in 2026 starts from intent: the interface recognizes what the user is trying to accomplish, then shows what's relevant. The four classic intents — informational, navigational, commercial, transactional — aren't new; what's new is treating them as the *starting point* of the flow.

Google PAIR distinguishes explicit intent (what the user names) from implicit intent (what the system infers from behavior). Both feed the decision about what gets shown first. For Afi, with no conversational AI in the product yet, this doesn't mean bolting on a chat. It means designing forms and screens so the system infers intent earlier and proposes the correct information.

A completely intent-driven product might not be the best fit for Afi yet, but the direction is still valuable for us: the user should see relevant information based on **what they want**.

![Menu tree vs direct access guided by intent](./assets/modern-ui-2026/tree-vs-intent.svg)
*Diagram 3 — Navigation stops asking the user to walk a tree and starts offering short routes from each intent.*

## Learning 3: Friction as a feature

For a decade, engineers chased instant response on every interaction. Designers in 2026 are deliberately adding delays back in.

Emil Kowalski compared two identical buttons for a high-impact action: one confirms the millisecond it's clicked; the other inserts a short processing animation before the same confirmation. Users overwhelmingly trusted the delayed version.

The mechanism is **perceived reliability**: for a high-stakes action — authorizing a payment, moving funds, rebalancing a portfolio — the brain doesn't believe a system that responds too fast had time to do the work. The window is small: 150–250 milliseconds. Long enough to register that something happened; short enough that the app doesn't feel sluggish. Below 150 ms triggers anxiety; above 250 ms feels broken.

![Instant button vs button with an intentional 150–250 ms pause](./assets/modern-ui-2026/pause-confidence.svg)
*Diagram 4 — Same gesture, two responses. The instant button feels broken; the 150–250 ms pause conveys that the system is doing the work.*

## Learning 4: Trust is a formula

Stan Vision (*Fintech UX in 2026*) defines trust in financial products as **transparency + consistency + responsiveness**. In practice:

- **Predict, but always announce.** Pre-filling a transfer is welcome; executing it without confirmation is not. And if the application pre-fills, it says why: *"based on your last three transfers to this payee…"*. Silent prefill reads as surveillance; announced prefill reads as competence.
- **Friction where it earns it.** The 150–250 ms processing beat from Learning 3. Trust comes from the system signaling it took the action seriously.
- **Biometrics as handshake.** Face ID, fingerprint, voice — no longer just security measures, but an emotional cue: *we know it's you, your environment is secure, let's proceed*.

Don Norman's three levels of emotional design frame the rest: **visceral** (the first-impression reaction), **behavioral** (pleasure and effectiveness during use), **reflective** (how it sits with the user afterwards). An interface that only wins the visceral level doesn't last, and in a product people open daily, the reflective level is where the relationship lives.

## Learning 5: Stylish but minimalist

#### The *Liquid Glass* trend

Apple-style depth and translucency have matured. Professional tools now adopt *Anti-Liquid Glass*: they keep blur and depth as a spatial cue (a panel visibly floats above the content) but remove the refractive distortion that hurts legibility in dense interfaces. Linear is the reference. The rule that falls out of it: glass on chrome, solid backgrounds on data.

#### Dark mode

It stops being a nice-to-have and in a lot of products has become the default state: between 60% and 80% of users prefer it (Tubik, Merveilleux). Afi doesn't need an all-dark-mode product, but we do need to start building with it in mind. One way to adjust the platform to context is using system backgrounds: during the day, light mode; at night, dark mode. If a user prefers one over the other, they simply choose it as their default.

One critical detail: never pure black. Absolute black under white text produces *halation* — the white glows and bleeds at the edges, so the text seems blurry.

#### Color that communicates

Color in 2026 communicates, it doesn't decorate. Surfaces stay neutral, which gives the accents more meaning. When one color is reserved for communication, the user learns to recognize it without thinking. When everything is colorful, nothing stands out.

States work the same way: green means positive, red means risk — but color should never be alone. A colorblind user can't tell a red −2% from a green +2%, so indicators pair color with a universal arrow (up/down). 

The meaning has to be consistent to be learnable. That's the semantic layer again: `color-action`, `color-positive`, `color-critical`. The name carries the intent, and the intent stays the same across all five brands.

#### The *bento* grid

Asymmetric cards of different sizes are the default pattern for 2026 dashboards: visual hierarchy without rigid columns. A large card for a chart, a small one for recent transactions.

![Flat list vs asymmetric bento grid](./assets/modern-ui-2026/list-vs-bento.svg)
*Diagram 5 — The flat list makes every piece equal. The bento grid uses size and shape to signal importance without imposing rigid columns.*

Expressive minimalism connects with high-cognitive-load B2B products because it prioritizes content instead of ranking everything the same. For example Cresco opted for interfaces that look like technical blueprints: visible grids, monospaced numerals, no ornament. For people moving serious numbers, the trust comes from the *absence* of decoration: a high signal-to-noise ratio that communicates competence.

## Learning 6: Create a map machines can read

AI has moved from generative (producing content) to *agentic* (executing work).

For an agent to build interfaces on the system without breaking visual identity, it needs to understand the difference between `blue-500` (descriptive) and `button-primary` (functional). Figma refers to this as *TokenOps*: the person or team responsible for creating rules the AI can read to create consistent outputs. This mindset is the difference between a system only humans can understand and one an AI can consume too.

![Token cascade: primitive → semantic → component](./assets/modern-ui-2026/token-hierarchy.svg)
*Diagram 6 — One decision at the primitive level propagates to the semantic tokens and, from there, to every component — without anyone touching a single component file.*

## Summary

Here is a quick checklist so when the redesign is reviewed the conversation is based on research, not preference.

**1. A shared design language.** Decisions are made with vocabulary the whole team shares — tokens, patterns, intent — not personal taste.

**2. Intent-based design.** We need to build products based on the objectives of the users.

**3. Functional motion, not decorative.** Every animation pattern is justified by the trust it adds or the attention it directs.

**4. Trust as a formula.** Transparency, consistency and responsiveness in every interaction — and an interface that works on all three of Norman's levels:

1. **Visceral** (the first-impression reaction)
2. **Behavioral** (pleasure and effectiveness during use)
3. **Reflective** (how it sits with the user afterwards)

**5. Stylish but minimalist.** Neutral tones, functional depth, glass on chrome and solid backgrounds on data — and color reserved for meaning: action and state, never decoration.

**6. *TokenOps* ready for the next generation.** Semantic tokens are the single source of truth. Functional naming (`button-primary`), not descriptive (`blue-500`). This is the precondition for an AI to build on the system without breaking its identity — and for us to make consistent decisions.

---

## Sources

Collected in the internal dossier *Research modern UI* (June 2026), with the original articles cited throughout the post. Grouped by what each one is useful for.

**Trend roundups** — cross-source agreement on where the field is moving:

- [Tubik Studio — *UI Design Trends 2026*](https://tubikstudio.com/blog/ui-design-trends-2026/)
- [UX Collective — *The most popular experience design trends of 2026*](https://uxdesign.cc/the-most-popular-experience-design-trends-of-2026-3ca85c8a3e3d)
- [Envato Elements — *Web Design Trends*](https://elements.envato.com/learn/web-design-trends)
- [Merveilleux — *UI/UX Trends 2026*](https://www.merveilleux.design/en/blog/article/ui-ux-trends-2026)
- [Find a SaaS — *SaaS UX Trends 2026*](https://findasaas.com/blog/saas-ux-trends-2026)
- [Gowtham V — *Evolution of UI Design: 2026 Trends Shaping Modern Digital Experiences*](https://www.linkedin.com/pulse/evolution-ui-design-2026-trends-shaping-modern-digital-gowtham-v-c6k4c) — LinkedIn Pulse
- [Sohan Talukder — *2026 UI/UX Trends*](https://www.linkedin.com/posts/sohan-talukder_2026-uiux-trends-activity-7414988664407023616-3yMo) — LinkedIn
- [Blushush — *Top 5 User Interface Design Trends for Modern Websites*](https://www.blushush.co.uk/blogs/top-5-user-interface-design-trends-for-modern-websites)
- [Spunk — *UI Design Trends 2026*](https://spunk.pics/blog/ui-design-trends-2026)

**Fintech-specific** — what users expect from financial products:

- [Stan Vision — *Fintech UX in 2026: What users expect from modern financial products*](https://www.stan.vision/journal/fintech-ux-in-2026-what-users-expect-from-modern-financial-products) — source for the trust formula
- [Veza Digital — *Fintech Web Design Trends*](https://www.vezadigital.com/post/fintech-web-design-trends)

**Design systems + maturity** — the token-layer story:

- [Figma — *The future of design systems is semantic*](https://www.figma.com/blog/the-future-of-design-systems-is-semantic/) — TokenOps
- [dsruptr — *The Ultimate Design Maturity Guide for Tech Leaders*](https://dsruptr.com/2026/01/19/the-ultimate-design-maturity-guide-for-tech-leaders/) — the five-stage maturity model
- [Velvetum — *UX/UI Design Tools 2026*](https://velvetum.com/en/journal/ux-ui-design-tools-2026) — the stack-consolidation study

**AI as teammate** — intent and visible reasoning:

- [Google PAIR — *People + AI Guidebook*](https://pair.withgoogle.com/guidebook/)

**Classics + specific references:**

- [Don Norman — *Emotional Design: Why we love (or hate) everyday things*](https://www.nngroup.com/books/emotional-design/)
- [Emil Kowalski](https://emilkowal.ski/) — intentional pause in high-impact interactions
