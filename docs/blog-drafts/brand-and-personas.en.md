---
slug: brand-and-personas
lang: en
eyebrow: STRATEGY · BRAND
title: Brand and personas: what the moodboard can't make up
date: 26 June 2026
subtitle: Why we paused before opening Figma — and what we figured out about who we're actually designing for.
---

> *Part 2 of the redesign series. Part 1 was the research base — what modern UI means in 2026. This one is the strategic base: who we're designing for, and what brand we're even building.*

## 1. The brief

For years our demos lived in Figma. We'd build wealth planning screens, fake the numbers, fake the plans, and present them. It worked to a point — but the journeys weren't real. We were always one question away from *"wait, what would that actually show?"* Clients didn't fully follow. They walked away frustrated.

Now the demos run on code. Real calculations, configurable profiles, real scenarios you can move. We can finally show *use cases*, not just *screens* — which means we need to know who the use cases are *for*.

Brand first, personas second, moodboards third. We had it backwards.

## 2. First, the brand

A moodboard with no brief is just *"what I like this week."* Three months later we're still arguing — because nobody agreed on the intent.

So we wrote a brief. Six fields, each backed by a *why*. Short version below.

**Positioning.** Afi Digital Solutions ships simulators for financial and adjacent institutions — wealth, retirement, home energy. Where most decision tools output spreadsheets or oversimplified calculators, we ship experiences clients act on.

*Why this:* Banks today have two options, both bad. They can buy a generic global planner that doesn't understand Spanish wealth (sociedades, tributación, jubilación). Or build their own — slow, expensive, locked to one brand. We sit in the middle: built for Spanish wealth, reusable across banks.

**Value prop.** *Institutional-grade simulators, finally with interfaces people want to use.* Afi has modeled Spanish wealth for years. The 2026 platform layers a story-led UI on top — configurable per brand, per channel — so advisors close on outcomes instead of defending numbers.
*Why this:* Wealth planners today are usually one of two things: accurate but ugly (built in-house) or pretty but shallow (off-the-shelf fintech). Advisors need both. We build both.

**Universal truth.** *Big decisions deserve a rehearsal.* Wealth, retirement, a home purchase — you don't get to test-drive them. Once the call is made, it's made.
*Why this:* That's what every AFI simulator is for. The rehearsal before the commitment.

**Personality.** Five traits, each picked against a specific failure mode of the category. Together they cover the emotional register — how the brand should *feel* to a user, not a list of visual rules.

1. *Confident, not loud* — trusts the work to do the talking.
*Why:* Wealth planning is the most trust-sensitive software a client will ever see. Anything that shouts for attention reads as a sales pitch, and HNW clients tune out sales pitches in two seconds.

2. *Storytelling* — outcome first, data second. Headline before chart.
*Why:* The advisor walks the client through 30 years of compounding, tax scenarios, retirement triggers, legacy structures. No human absorbs that as a table. A headline collapses 20 numbers into one sentence the client can hold onto.

3. *Modern, made to age* — editorial craft that holds up in 2029.
*Why:* Tech moves fast. A modern UI signals the team is up to date — old UI reads as *"these people stopped paying attention."* For high-trust software, that signal matters more than people admit.

4. *Hands-on* — every plan is a canvas. Built to be touched.
*Why:* A wealth plan isn't a single answer; it's a conversation between scenarios. The meeting breaks when the client asks *"what if I retire 3 years earlier?"* and the advisor has to leave and recompute. Flexibility is the difference between a planner and a calculator.

5. *Delightful, even when the topic is heavy* — quiet, earned moments that ease anxiety. Stripe-quiet, not Robinhood-confetti.
*Why:* Anxiety is the default in money conversations, and most planning software doubles down on it (more numbers, more warnings, more red). Small earned delights lower the anxiety floor enough for the client to plan instead of brace.

**Values.** Four commitments for how the team builds. Personality is what users see; values are what the team agrees to before shipping.

1. *Institutional brain, startup velocity* — finance-house expertise, shipped at startup speed.
*Why:* Most fintechs move fast but lack expertise — features don't survive a real conversation with a regulator or a senior advisor. Most consultancies have the expertise but ship slowly. AFI sits in the rare middle: traditional finance house, digital-solutions team moving like a startup. That's the moat.

2. *Easy to understand, even when complex* — any client should read a screen cold.
*Why:* The product handles wealth complexity so the user doesn't have to. If a screen needs a tooltip to be understood, the screen failed.

3. *Built from the surface up* — over-engineered foundations buy creative latitude on top.
*Why:* The DS grows from real demos, not top-down architecture. We over-engineer on purpose: tokens, semantic layers, primitives clean enough that AI can spot the pattern differences between AFI and Santander by reading the JSON. Rigor underneath buys freedom on top.

4. *Demo-grade craft* — "it works" is a lower bar than "it lands in a meeting."
*Why:* This brand exists to sell — internal showcases, sales pitches, conference talks. The bar isn't "shipped." The bar is "lands in front of a stranger watching for the first time."

**Visual idea.** *Story-led product design with modern editorial sensibility.* Type does heavy lifting, layouts breathe, color carries meaning, charts read like sentences. Modern reference points: Stripe, Linear, Vercel, NYT interactive features, The Pudding, Notion, Apple product pages. *Not* FT or WSJ — those are too old.
*Why this:* Editorial design has spent a century figuring out how to tell complex stories beautifully. Strip the magazine vibe, keep the discipline.

**Rollout.** v1 is the surface — colors, fonts, restrained delight on existing flows. v2 is structural — flow rework, widget-based layouts, deeper experience changes. The DS foundation (Value 3) makes the v1 → v2 swap cheap when we get there.
*Why this split:* v1 ships now without renegotiating the whole product. v2 changes structure once the language is in place.

Long form lives at [`docs/brand/digital-solutions-v1.md`](../brand/digital-solutions-v1.md). If you want the *why* paragraph behind every field, that's where it is.

## 3. Then, the personas

Five archetypes for the demos. One operator — the advisor — and four clients she runs plans for, split across the two channels Afi serves: **private banking** (high net worth) and **commercial banking** (mass-affluent / near-HNW).

These aren't vibes-on-a-poster. They're the configurable profiles the demos actually model. Carmen is the operator the screens have to feel competent to. Diego, Lucía, Javier, and María are the inputs — when we demo *"what does Wealth Planner look like for someone like Javier?"*, the calculations run against his real structure: operating company + holding + properties + liquid. The personas are the test cases the brand has to land for.

Click through them.

<!-- PERSONA-TABS COMPONENT — names along the top: Carmen / Diego / Lucía / Javier / María. Card swaps below per active tab. Will wrap the five sub-sections below. -->

### 3.1 Carmen Reyes — *The advisor*

**Senior Wealth Advisor (Asesora Patrimonial Senior)** · 42 · Madrid · 14 years in role
Works at a mid-size Spanish private bank. Around 60 wealthy clients, ~€4M average per client. Heavy Excel user, comfortable on iPad, frustrated by slow internal tools.

> *"When my client asks 'what if I retire 3 years earlier?', I need to answer in 30 seconds — not 'let me get back to you next week.'"*

**What drives her**
- Win new mandates. The first plan she shows has to feel like the future.
- Defend existing clients. Competitors call them every month; she wins by responding fastest with the sharpest answer.
- Look modern. Younger clients grew up on Stripe and Revolut; older clients read polish as a proxy for competence.

**What fails her today**
- Excel-grade plans. A 12-page PDF the client never reads.
- What-if delays. Half a day per scenario tweak.
- Old-looking interface. Hard to demo to a 35-year-old founder.

**Where the planner has to work**
- The first 60 seconds. Open laptop, headline tells the story. If the client doesn't lean in, she's lost the room.
- The what-if moment. Slider moves, chart morphs, answer on screen before the client finishes asking.
- The send-and-hold. After the meeting she emails a link. The client opens it next morning. The plan still tells the same story.

### 3.2 Diego Martínez — *Family Goal-Setter*

**Senior Strategy Consultant** · 38 · Madrid · 12 years into his career
~€1M total: €600K primary residence (half paid off), €300K liquid, €100K pension. Combined household income ~€140K. Two kids: Sara (9), Mateo (6). Sara talks about studying in California.

> *"How do I make sure my kids can go to Stanford without sacrificing my own retirement?"*

**What drives him**
- Education first. He won't limit his kids' futures by cost.
- Don't repeat his father's path. His dad worked until 70 because the math didn't work.
- Build smart, not lucky. He's watched friends get burned chasing crypto and IPOs.

**What fails him today**
- No tool for goal-based building. Tools model retirement *or* education in isolation — not as competing goals on one screen.
- Future-cost opacity. What does Stanford actually cost in 9 years with US inflation and EUR/USD?
- Trade-off blindness. Save €30K/year for education → what does that cost retirement at 65?

**Where the planner has to work**
- Goal stacking — education + retirement + maybe a coastal apartment, modeled together.
- Future-cost modeling — US tuition projected with realistic inflation, currency risk made visible.
- Live trade-off — move the education slider, watch retirement age jump from 65 to 67. Make the cost of the goal *felt*.

### 3.3 Lucía Romero — *Real-Estate Optimizer*

**Owner of a small architecture studio** · 43 · Valencia · Bought her first apartment at 28
~€2M total — three-quarters of it in property: primary residence in Valencia (€500K), rental apartment in Madrid (€400K), two adjacent apartments on the Costa Blanca (€700K combined), €250K liquid, €150K studio business equity.

> *"I bought my first apartment at 28. Now I have four. I need someone to show me what happens if I sell two of them."*

**What drives her**
- Concentration risk anxiety. 75% in property. The 2008 crash is still vivid.
- Step up the game. Larger commercial property, a co-investment, or a diversified fund.
- Trade active for passive. Fifteen years of tenants and renovations is enough.

**What fails her today**
- Real estate as a black box. Tools value her properties and stop — they don't model what happens if she *sells*.
- No what-if for restructuring. "Sell two, keep two, redeploy" with tax modeled in — nobody can do this.
- Tax surprises. There's a local capital-gains tax (*plusvalía*) plus personal income tax (*IRPF*) on the gain. She doesn't know how much.

**Where the planner has to work**
- Real estate as movable wealth. Each property is sell-able, taxable, redeployable.
- Restructuring scenarios, three side by side, tax baked in.
- Diversification visualization — 75% real estate today vs. 40% after restructuring, on screen, not in a footnote.

### 3.4 Javier Soler — *The Founder*

**Founder & Director, mid-size industrial company** · 56 · Barcelona · Owns the company outright
~€10M total. Most of it locked in the operating business he founded in 1998. The rest sits in a family holding company (*sociedad patrimonial*) that owns his Barcelona residence, a coastal investment property, and a modest portfolio. Married, two adult kids (28 and 25). Knows his P&L cold; needs help with tax structuring and intergenerational planning.

> *"I built this. Tell me in plain Spanish: if I sell next year vs. five years from now, what happens to my family?"*

**What drives him**
- Protect what he built. 28 years of work in one company.
- Plan for his kids. They didn't grow up with money the way he made it.
- Sleep at night. He's seen peers get burned by tax surprises.

**What fails him today**
- Generic planners model him as a brokerage account, not as someone with two companies and an illiquid majority position.
- Math without implications. Rate of return shown; what it *means* for his family, not shown.
- No clear what-if. "Sell 2027 vs. sell 2031" side by side, in his own structure, with his own tax reality.

**Where the planner has to work**
- Structure matches reality — operating company, holding, residence, investment property, modeled as he lives them.
- Story lands. Three scenarios, one glance, the difference for his kids visible.
- Plain Spanish, not actuary Spanish. *"Si vendes en 2027, tu hijo recibe €X cuando tú cumplas 80."* Not *"VAN actualizada con tasa de descuento de 4,2%."*

### 3.5 María Echevarría — *The Retiring Professional*

**Recently retired Managing Partner, Spanish law firm** · 64 · Bilbao · 35 years building wealth through career
~€5M: €3M liquid (decades of investing), €1.5M paid-off residence, €500K inherited from her parents, plus a firm pension. Married. Two adult kids — Madrid and New York. Hoping for grandkids.

> *"I spent 35 years building this. The only question now is: can I enjoy it without watching the balance fall every month?"*

**What drives her**
- Will it last? Accumulating felt natural; spending feels harder.
- Stay in control. Used to making big decisions; refuses to be condescended to.
- Leave a legacy without the drama. Help her kids without destabilizing them.

**What fails her today**
- Decumulation is poorly served. Every tool is built for *accumulators*; drawdown is an afterthought.
- Inflation anxiety. At 64 she expects to live to 95 — 31 years of inflation invisible in static plans.
- Opaque legacy planning. "Give €500K now vs. €1M at death vs. nothing" — most planners can't show this.

**Where the planner has to work**
- The drawdown story. *"How much can I take out, and when does it get scary?"* — answered year by year.
- Inflation visible, not assumed away.
- Side-by-side legacy scenarios — three columns, one screen, three different futures.

### The five at a glance

| | Carmen | Diego | Lucía | Javier | María |
|---|---|---|---|---|---|
| **Role** | Advisor | Client | Client | Client | Client |
| **Channel** | Serves both | Commercial | Commercial | Private | Private |
| **Life stage** | Mid-career advisor | Building | Restructuring | Pre-exit | Retired |
| **Main question** | *"How fast?"* | *"Stanford + retirement?"* | *"Sell two?"* | *"Sell now or later?"* | *"Will it last?"* |

## 4. What's next

Three look-and-feel directions, each grounded in this brief. We explore them in parallel, then pick one as the basis for v1. Next post: the three, side by side.
