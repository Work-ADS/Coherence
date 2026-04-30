# Case study — a design.md for a PrimeNG-themed product

## Context

I'm the sole designer at AFI, a fintech consultancy. One of our products, **Wealth Manager**, is a B2B platform for wealth advisors — info-dense, tables-and-forms-all-day, used by finance people who care about parity with their data more than delight. The frontend is Angular on top of **PrimeNG**, an off-the-shelf component library.

When a product uses an off-the-shelf UI library, one of two things is usually true. Either the team adopts the library's defaults wholesale and the product looks like every other PrimeNG app — or the team themes it heavily and immediately introduces design drift, because "theming" tends to mean one designer tweaking colors in Figma while the code preset quietly keeps its original defaults. We were doing the second thing, and nobody had written down the rules.

So I decided to write a **design.md** for Wealth Manager.

## What's a design.md

A [design.md](https://getdesign.md) is a plain Markdown file that encodes a design system — tokens, rules, component usage, anti-patterns — in a form that humans *and* AI coding agents can read as instructions. You drop it into a repo and any coding agent (Claude, Cursor, Copilot) follows it when generating UI. It's also a useful forcing function: writing the rules down exposes the gaps.

It's not a component library. It's the rulebook *next to* the component library.

## The problem with theming PrimeNG

PrimeNG's Figma library is… minimal. It ships component-level tokens (button colors, input sizes) but **no primitive layer** — no standalone spacing scale, no radius scale, no font-size scale. Its color system is built around a "surface" ramp (used for both text and backgrounds — that's what gives PrimeNG apps their monochrome look) and a "primary" color for actions.

That means if you're theming PrimeNG, you're also inventing the primitive and semantic layers yourself. And because that invention happens inside a Figma file, it rarely makes it back to the code side — which is exactly how the drift I mentioned earlier starts.

So the design.md had to do three things at once:

1. Document the brand values we plugged into PrimeNG (the easy part).
2. Document the token scaffolding we built on top of PrimeNG (the Figma-only layer).
3. Make the drift between Figma and code *visible* so the team can close it.

## The process

I worked through it with an AI pair (Claude Code) over a couple hours. Not because I couldn't write it alone, but because the thinking-out-loud surfaced decisions I'd been making implicitly. Rough arc:

### 1. Start with references, not with writing

Before a single word of the doc got written, we looked at two references: PrimeNG's own theming docs, and [getdesign.md](https://getdesign.md)'s format conventions. The point wasn't to copy either — it was to make sure I wasn't reinventing something that already had a convention.

### 2. Pull the Figma variables

I sent a link to the file's variable-panel canvas. Claude used the Figma MCP to read the actual variable definitions — not a screenshot guess, the real token names and values. That gave us:
- **AFI Primitives** (87 variables): numbers, colors, fonts.
- **Semantic numbers** (39 variables): aliases like `spacing/md` that reference primitives.
- **AFI Custom Semantics** (22 variables): PrimeNG component overrides like `p-datatable/padding/normal`.

That structure — three tiers, from raw to meaningful to component-specific — turned out to be the spine of the whole doc.

### 3. Three tiers, in plain language

**Tier 1 — Primitives.** Raw atoms. A hex. A pixel number. A font family string. They have no opinion about what they're for. `dimension-8` is just the number 8.

**Tier 2 — Semantic numbers.** Aliases with meaning. `spacing/md` *references* `dimension-8`, but now it carries intent: "this is the medium spacing value." A designer or developer reaching for a value goes here, not to primitives.

**Tier 3 — Custom Semantics.** Component-level. `p-datatable/padding/normal` references `spacing/lg`. The reason this tier exists is that PrimeNG's Figma didn't expose these slots — so when I was themeing the DataTable, I had to create the variables myself. That's where the drift risk lives: if the code preset doesn't also have a matching `p-datatable/padding/normal` routed to the same value, Figma and code quietly disagree.

### 4. Correcting assumptions, one by one

Several of my first-pass assumptions were wrong, and the process surfaced them:

- **I assumed the surface ramp was `grisafi`** (our AFI-branded gray palette). It isn't. I picked PrimeNG's **Slate** for surfaces because it has more contrast, and contrast matters in a data-dense product. `grisafi` still exists — but it's for accents (tags, illustrations, charts), not surfaces.
- **I assumed "primary = one color."** It's actually **two palettes, one role**: `azulprofundo` (deep navy) for light mode, `azulafi` (bright blue) for dark mode, auto-routed. I'd never picked between them by hand — the routing does it.
- **I assumed custom semantics were mostly raw values** that had drifted. When I actually pulled them, almost all of them linked cleanly to semantic numbers. The drift I was worried about was smaller than I'd thought.

Each of these got fixed in the doc as it came up. That's why writing the design.md was valuable before I ever opened the code: the doc was the audit.

### 5. Naming matters more than it should

One small detail ended up mattering a lot: **I call our primary "AzulProfundo," not "primary."**

Reason: AFI has a *different* blue called `azulafi` — and that's our core brand blue. If the doc says "primary" generically, teammates inevitably paste `azulafi` into an action slot, because the word "primary" slides in their heads toward "the main brand color." Calling it AzulProfundo explicitly pins the word to the exact palette we're routing. Tiny decision, real defense against drift.

### 6. Tablet-floor responsiveness

This wasn't in Figma — the team had told me early on "don't worry about it," and then started worrying about it. For a B2B wealth product, phone support is out of scope; advisors work at laptops and desktops. We committed to three breakpoints (`md 768` tablet, `lg 1024` laptop, `xl 1440` desktop) and five per-surface rules (tables, nav, forms, KPI grids, dialogs). No `sm`, no `2xl` — naming them would imply support we don't provide.

## What the design.md ends up being

Concretely: a Markdown file with eleven sections — overview, philosophy, token architecture (three tiers), themed values (all color tables with hex codes), component usage, layout & responsiveness, anti-patterns, contribution rules. All values are written out literally, not referenced by Figma node IDs, so a coding agent can consume the file cold and generate correct UI.

Less concretely: it's the rulebook that makes the Figma/code drift visible. Every token in the doc is a claim that both sides (design + engineering) agree on that value. Anywhere they don't agree, the doc flags it — and we close it.

## What I'd tell another designer working with PrimeNG

- **Start with the variable panel, not the canvas.** The canvas shows what you *made*; the variables show what you *decided*. Designs based on "here's the screen" versus "here's the system" read totally differently.
- **Three tiers, always.** Primitive → Semantic → Component. PrimeNG hands you the third tier; you have to build the first two yourself; the doc exists to prove all three exist and agree.
- **Name primary by its palette, not by its role.** "Primary" is ambiguous. Your palette name isn't.
- **Write the anti-patterns.** A list of don'ts is often more actionable than a list of dos. "Don't manually swap the primary color by mode" is a more useful rule than "the primary color is routed automatically."
- **Responsiveness: pick the minimum viewport that matters, skip the rest.** A B2B product that names a phone breakpoint is about to have phone-support expectations it didn't sign up for.

## What's next

The doc ships as v1. The team reviews it and we close three open questions: where it lives (repo root? docs site? Notion?), whether tablet-floor responsiveness is really what everyone agrees on, and whether dark mode is v1 or future-state. Then the same file goes into the wealth-manager repo so Claude Code and every other agent that touches this product reads it before generating UI.

And then the next time a teammate asks "what hex is a primary button?", the answer is one `ctrl+F` away — not a Slack message to me.

---

*Built alongside Claude (Anthropic). Figma file: Afi-Coherence-Wealth-manager-components. Wealth Manager is one surface in AFI's broader design-system initiative; the internal DS itself, Coherence, is a separate code-first shadcn-based library with its own case study.*
