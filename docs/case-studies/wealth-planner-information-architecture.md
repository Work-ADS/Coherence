# Wealth Planner: Information Architecture

> Working draft. Narrative arc: Context → Problem → Why → (rising action) What we did / What we learned / Our direction. The project is ongoing — no climax/falling action yet. English first; the `afi-redaccion` Spanish pass comes once the narrative is locked. Edit freely.
>
> **Audience:** internal advocacy (boss, other teams, leadership). **Tone:** measured, forward-looking — critique is about the old *way of working*, never about people; lean on the fact that the team already reached the same conclusion when v1 was presented.

---

## Tagline

*Reorganizing the Afi Wealth Planner around how advisors use it.*

---

## Team

The Afi design team — Richard Griner and Miguel — owning the redesign end to end: research, design system, and build.

---

## Role

Design system + product IA.

---

## Contributions

- Screen-by-screen IA audit
- User-value mapping
- Flow restructure (6 → 3 sections)
- Dashboard composition
- Wireframes (low-fidelity)
- Modern UI alignment

---

## Context

The Afi Wealth Planner is a tool financial advisors use to build, simulate, and present wealth plans to clients. We have two versions, our demo and white-labeled for clients. Our challenge was to make wealth planner look more modern by designing a new visual system — components, tokens, type. But during discovery we realized if your experience is old-fashioned, a new look doesn't help.

---

## Discovery: defining "modern"

Before opening Figma, we wanted to define what "modern" meant — otherwise every review turns into a debate about what people like versus what they don't. And when those opinions come mostly from non-designers, the platform rarely ends up better for it.

We synthesized the research in [Part 1 of this series](/blog/ui-moderno-2026). The short version:

- **Be intentional with visuals.** Neutral tones, functional depth, bento grids for hierarchy. Color and animation aren't used as decoration but to communicate information fast to users.
- **Dynamic instead of linear.** We have to be flexible. Linear flows create boring experiences; what we need is to truly understand the user's objective and build the layout around it.
- **Systems over preferences.** Semantic tokens as one source of truth, so decisions stay consistent and even machine-readable.
- **Evidence over opinion.** Because layouts can be dynamic there is more of an emphasis on tracking metrics and talking to users. Only listening to one person based on what they like stunts creativity.
- **Pay attention to the small details:** Now that building is so much faster, modern UI is giving space and allowing time to focus on the smallest details that users wouldn't think about, because it subconsciously improves the experience. An arrow twisting or button container hugging when the CTA text changes used to be looked at as a nice to have, but now it's a must have — it's your way to stand out and show that, even with AI, we pay attention to these opportunities of delight.

Two findings from that research pointed straight at this project: a new palette won't fix a static layout, and raising design maturity is a team sport — it depends on how the whole organization decides, not on the design team alone. 

---

## Problem

The current information architecture reflects how a plan gets built and how the calculation is implemented in the backend. But, the overall product treats every page as an equal part of the experience and doesn't account for any use case past a user's first time.

On top of that, there are many points of friction. For example, the advisor currently has to fill out tedious pages before seeing any data worth looking at.

To understand the value each screen provides, we mapped all ~15 screens to a user-value statement. We asked: what is the insight a user would want to reach within 5 seconds of looking at this page? That let us understand which data belongs together, so users can gather quick but powerful insights.

Right now, our product perspective is "I'm making this calculation for you — you figure out how to use the screen." This needs to change to: "We've done a calculation based on your data and here are the insights you can take from it to reach your goals."

That's why something like Conclusiones needs to be a dashboard: right now you see Diagnóstico and Plan de acción — two connected things — on two separate pages. But the user wants to understand their situation and how to fix it.

A visible symptom of all this: most pages look empty — a single chart or table floating in whitespace. That emptiness isn't a styling problem; it's what poor planning looks like, and it's what makes the product feel static.

### Why the flow ended up this way

To solve this properly, we have to name what caused it. We rarely prototype in Figma — we present static pages and scroll across the canvas — so interactions don't get thought through early in the design process. Designs reach developers before the client has signed off, and details that were never discussed — like how a hover should behave — show up months later as an expensive, annoying change.

When design is treated one dimensionally, you default to thinking about flows as linear. That's a real limitation now that AI is opening a more dynamic chapter of design: a static way of working, with little room for collaboration and creativity, tends to produce a static product.

This is less about tools and colors than about mindset. It's systemic. Afi is a very traditional company that has truly become a respected institution. Unfortunately, because we are a successful company, change and innovation *in practice* is often put on the back burner.

Design has often meant producing screens quickly, where questions about objectives or audience didn't have a place. Changing that is less a design task than an organizational one: it depends on everyone sharing a language for deciding.

This project argues for treating design as an integral part of building products — understanding and defining what we're solving before we open Figma or touch code.

---

## What we did (and are still doing)

This is the current output (put link to the workbench here with the components).

**We started with goals, not screens.** Before opening Figma, we agreed on what the redesign had to achieve.

**We benchmarked and moodboarded.** We ran a competitive benchmark and built moodboards in Mobbin and Figma for specific components, pulling references from products we admired. Then we went through them together, component by component, deciding what we liked and what we didn't — a shared reference before anyone built anything.

**We built the design system in black and white first.** We set up our primitive and semantic tokens with no color at all. A token is just a named decision — "background canvas," "background elevated" — that does the same job everywhere it appears. Defining that vocabulary before the palette means choosing colors later is a single move: update the primitive, and every screen changes with it. Same for spacing decisions like nav-to-content — set a base now, adjust as the brand matures, and it propagates everywhere.

**With the foundation set, we built in code, then Figma.** We listed the primitive components and built them in code first, using our references. Then we generated prompts for the Figma agent to create the components and their documentation. That alone saved us a huge amount of time on documentation. And because everything points back to the same variables, adjusting one reflects the change everywhere it's needed.

**We connected Figma to the real project.** Once the components and docs existed in Figma, I wired them into our Angular project and built a live components page — the system running in the actual product, not a mockup of it.

**We tooled the discipline with two skills.** Our /DS clean-up skill audits a component or page, tells me where it's drifting from the system, and then — on a second prompt — fixes it. The audits stay small, which keeps the work honest and makes sure our variables are used the way we intended. 

Our /ship skill commits and pushes; I merge; then it deletes the branch, starts a new one, and hands back a Figma prompt for anything that changed in the variables or the system, so Figma and code never drift apart.

**Where we are now:** the components exist at a basic, low-fidelity level. We're adding micro-interactions and a bit more experience in code so we can show the team what a modern, interactive product actually feels like — the thing static Figma pages could never convey.

### What we learned

Before going deeper into graphs and patterns, we wanted to look at the whole product, not one screen at a time. So we ran a value audit across all ~15 pages and gave each one a value proposition: what insight it delivers and what the user should do next.

Looking outward at other fintechs, one pattern was consistent: they lead with insights and options, and they build for flexibility. Our ethos was already there — flexibility and the ability to plan — but the execution wasn't: most pages were a single graph or table with a pile of options and no guidance. Flexibility without direction.

### Our direction

The decision that came out of it: organize the product around the value each page delivers, not the order a plan gets built. Fewer, richer, insight-first screens; flexibility with guidance, not a fixed linear path.

The detailed structure — how the sections collapse and what each dashboard holds — is the climax, still ahead. The ideas we're carrying into it are below.

---

## Seeds for the next phase

**Profile-as-substrate.** Client data (ingresos, gastos, patrimonio, family) lives as a persistent profile that every simulation draws from — the way Claude keeps Projects / Artifacts / personalization across sessions. Creating a new simulation means choosing what to include, not re-entering anything. It also resolves the white-label vs. Afi split cleanly: institutional deployments (e.g. Renta4) load the profile automatically for existing clients; the Afi version fills it by hand. Same model, one way in.

**Consistency of general information (to develop).** A related thread worth its own seed: keeping general and shared info consistent across the product instead of re-entering or re-deciding it per page. The white-label case is the hook — data that loads automatically vs. by hand — but the broader point is one consistent source of truth for shared information.
