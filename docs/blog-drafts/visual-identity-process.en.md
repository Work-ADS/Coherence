# How we built the new visual identity

> Source draft for `/blog/identidad-visual` (Part 3 of the redesign series).
> Edit this file freely — the page HTML gets synced from it, not the other way around.
> The Spanish version comes from this file via the afi-redaccion pass once the English is locked.
> Sourced from the Granola meetings in the "Afi simulators visual identity" folder (Jul 3–23, 2026)
> plus the earlier research and foundations sessions.

**Standfirst:** From a vague brief to a system running in code. This is our design process: what we did and why, because reconstructing context is where teams lose the most time and end up with preference-based design.

---

## 1. Context and objectives

> **Visual:** a four-stage timeline of the handoff eras — PNGs → Figma screens → Material components → our own system in code — drawn in the same diagram style as Part 1's maturity stages, so the series reads as one. Each stage gets a tiny artifact icon (an image file, a Figma frame, a Material card, a code component).

### Design at Afi is young

Before Miguel joined Afi, the programming team received PNGs of designs from a graphic designer. 

Then Miguel joined, working only on Wealth Manager, a different product, at first. He introduced real flows in Figma, but the org still had no design systems in place. Design and development only collaborated when there was a visual question or an objection; the screens were designed by feel and the programmers took it from there.

There was no collaboration, definition, or strategy. 

My first project when I joined was Bankinter. We designed a financial planner using the commercial visual line, with a lot of back and forth with the Bankinter team. 

After all that work it turned out the product was for private banking, a different visual line entirely, highlighting the importance of being aligned as a team.

The Wealth Planner ran into the same problem during the Renta 4 project. New projects with zero context. 

When the Renta 4 project started, my brief was: change the name and make it red. No brand materials, no context on the size of the project, **no plan**. And the product itself had been built without components, meaning any iteration would take time that we didn't have. 

When the first round of iterations came in, I moved us onto components, using the Material library because that's what the team's code already used. It was a real step forward, and iteration got much faster. 

But then we learned what we'd missed by not working together and dedicating proper time to discovery: Material is deeply opinionated, and we had to hack it to create products that match our clients' brands. Systemizing the design was the right call, but doing it inside Material created more restrictions for us.

After that, instead of improving the product my task was to create different versions of wealth planner for Afi and Unicaja, changing only fonts, colors, and logos with the goal of selling it to other clients. 

The workflow never gave anyone time to design. Because of this we ended up with an old-looking, static product. 

### Our opportunity

AI changed what's possible: we aren't restricted to opinionated Angular libraries anymore; we can build our own. That's why I took the Memorisely AI design-system course. It gives us the flexibility to create the products we want.

That's the context for this redesign. We want a wow factor, which we haven't had in a while. 

To get there, we're doing things a bit differently. We are working *together* as a design team, implementing a design process, and documenting the work, because every project above started the same way: no alignment upfront. 

### Wealth planner

The Afi Wealth Planner is a tool financial advisors use to build, simulate, and present wealth plans to clients. We have our version, mostly used for demos. We also white-label the product for Spanish banks, connecting their databases of client details. 

The brief was one line: make it look more modern.

The real problem is we run everything on static Figma screens. Clients get lost during presentations because of those static screens and user experiences that were never thought through. Developers work screen by screen without understanding interactions. The UI looked dated no matter what color we put on it. 

So before touching anything we set three objectives: a lean, information-dense UI built for professionals; interactive code demos instead of Figma-only documentation, so developers inspect the real thing; and a system that scales.

## 2. Defining "modern"

> **Visual:** none needed — this section's job is to hand off to Part 1, and a new diagram would compete with it. At most, restyle the five bullets as the same bordered checklist Part 1's summary uses.

Before opening Figma, we wanted to define what "modern" meant. Otherwise every review turns into a debate about what people like versus what they don't; without a shared definition, taste argues with taste and nothing gets decided.

We synthesized the research in [Part 1 of this series](/blog/ui-moderno-2026). The short version:

- **Be intentional with visuals.** Neutral tones, functional depth, bento grids for hierarchy. Color and animation carry information.
- **Dynamic instead of linear.** Linear flows create boring experiences; what we need is to truly understand the user's objective and build the layout around it.
- **Systems, systems, systems.** Semantic tokens as one source of truth, so decisions stay machine-readable.
- **Evidence over opinion.** Because layouts can be dynamic there is more of an emphasis on tracking metrics and talking to users. Taste-only feedback, with no metrics or user input behind it, stunts creativity.
- **Pay attention to the small details.** Now that building is so much faster, modern UI gives space to the details users wouldn't name but do feel. An arrow twisting or a button hugging its text used to be a nice-to-have; now it's how you show that, even with AI, someone paid attention.

## 3. Moodboards, then a shortlist

> **Visual (built):** a click-through gallery of the 110 Mobbin screens, ordered Wise → the products named as references (Cursor, Stack AI, Clerk, Shopify, Notion, Linear) → the rest of the board, with the product name beside the counter. Shows "the same names surfaced" instead of asserting it. Granola and OpenAI are named in the prose but have no screens on this board.

After research, we each built a moodboard in Mobbin, separately, organized by component: buttons, inputs, menus, cards, dialogs, sidebar, filters. Three or four screens saved per component.

Wise was the only reference from our own domain. It is the proof that a fintech can run almost entirely black and white and put color only where the data needs it.

Then we went through both collections, one component at a time. 

Miguel noticed the pattern first: "We kept choosing the same apps over and over again. Maybe this is the vibe we want to go for." The same names surfaced in both boards, and that became the shortlist: Wise, Cursor, Shopify, Clerk, Notion, and Granola, with Linear, OpenAI, and Stack AI. 

The session produced directions, not final designs. 
1. Buttons compact like Cursor's, with the barely-visible shadow Stack AI uses.
2. Inputs tight like OpenAI's, in two padding variants.
3. Menus like Clerk's: options only, no icons, strong shadow.
4. A Clerk-style breadcrumb navbar: workspace, client, simulation.
5. Shopify as the reference for graphs on cards.
6. Wise as the **starting point** on color usage.

One idea came out of the session itself: on press, the button sinks inward creating more of a life-like action. It sounds small, but it set the tone for how we'd treat micro-interactions later.

## 4. Principles for the team

> **Visual:** the numbered lists carry this section; don't add a poster graphic that repeats them. If anything, a screenshot of the principles living in the design center / Figma library cover — proof they're a real artifact the team opens, not a slide.

After the moodboard session we took the patterns we kept choosing, connected them back to the research, and wrote them down as nine design principles.

1. **Information density without visual density.** Show a lot of information without the screen feeling busy, so the data is easy to read.
2. **Compact controls.** Buttons, inputs, and menus take up only the space they need. Every product we shortlisted (Cursor, OpenAI, Linear, Notion) works this way.
3. **Functional minimalism.** If an element doesn't do a job, it goes. Trust comes from the absence of decoration and highlighting what's actually important.
4. **Progressive disclosure.** Show the essentials first and reveal detail when the user asks for it. Everything else is one click away, not on the first screen.
5. **Consistency above novelty.** A user learns a pattern once and recognizes it everywhere, so they spend less effort figuring out new tasks.
6. **Motion explains state, never decorates.** Animation shows that something changed or directs attention. Anything else gets cut.
7. **Color communicates meaning only.** Surfaces stay neutral and color always means something, so users learn to read it without thinking. In charts that means one highlighted series against gray, with green and red reserved for up and down.
8. **Build the system and flow, not screens.** Every screen assembles from reusable blocks. Designing screen by screen is exactly how we end up with static, boring products.
9. **Context over pages.** Keep the user where they are: drawers, inline editing, and expandable cards instead of sending them to a new page.

We also wrote down what to avoid, because knowing what we are is incomplete without knowing what we're not:

1. **Material Design.** We lived inside its opinions and spent our time hacking around them. 
2. **Heavy glassmorphism.** Blur that creates depth is fine; glass on top of dense data hurts legibility. Glass on the surfaces, solid backgrounds behind data.
3. **Colorful enterprise dashboards.** When everything is colorful, nothing stands out. 
4. **Playful consumer aesthetics.** We aren't a B2C product. Our users are professionals making financial decisions. The wow factor comes from micro-moments of delight, the small places where we can add some style.

The principles exist so a review can argue against a principle instead of a preference. They now live alongside the [brand strategy](/estrategia-marca), so any future designer inherits the reasoning along with the components.

## 5. Foundations in black and white

> **Visual (built):** the type test, shown, not told — "0000 vs 4444" in the three candidates that failed (Space Grotesk, Fira Sans, Geist) against IBM Plex Sans, which held. The most self-evident image in the post.

We set up our primitive and semantic tokens in black and white. A token is a role, like "background canvas" or "background elevated," that does the same job everywhere it appears. Defining that vocabulary before the palette means that choosing colors later is a quick change: update the primitive, and every screen changes with it. Same for spacing decisions like nav-to-content. Set a base now, adjust as the brand matures, and it propagates everywhere.

For typography we tested Space Grotesk, Fira Sans, and Geist, and none of them passed the width test across number patterns (0000 vs 4444). IBM Plex Sans held consistent, so it became the type family for the modern identity.

## 6. Components in code, documentation in Figma

> **Visual (partly built):** the live components are already embedded inline — the real, hoverable primitives instead of a screenshot, which proves the "one set of variables" claim better than an image would.
>
> **Still open — the workflow:** the four numbered steps could become a process/timeline animation (code → Figma agent → adjustments → component library, one step revealing at a time). Worth it only if it shows the loop better than the list does; the numbered list carries the section fine on its own, so this is a nice-to-have, not a gap.

With foundations set, we listed the primitive components and split them. I took chip, badge, card, and table; Miguel took tag, dialog, navbar, and tabs. 

We built buttons, inputs, checkboxes, and toggles together, so we could work out an efficient workflow and get similar outputs. 

We started with primitive components because they're the building blocks everything else assembles from; the more complex patterns only get built when we actually need them. 

Our workflow:
1. Lo-fi workarea: we build the primitive component in code based on our moodboard, then write a prompt for the Figma agent.
2. The AI builds the component in Figma using the correct variables, creating new ones where needed, and writes the documentation.
3. We make any small adjustments.
4. Then, once we're satisfied, we use the Figma MCP to build the component in our Afi component library.

We started building a component workbench page so during review we can show the team the interactions in an isolated environment. 

To keep things consistent, we built two skills: 
1. /ds-cleanup skill audits a component or page, tells me where it's drifting from the system, and then, on a second prompt, fixes it. 
2. /ship skill commits and pushes; I merge; then it hands back a Figma prompt for anything that changed in the variables, so Figma and code never drift apart.

This workflow saved us a lot of time. Everything is connected to base variables and we have safeguards to update documentation as we go. That keeps the AI producing consistent outputs and gives the team the context behind each design decision. 

## 7. Micro-interactions

> **Visual (built):** live components embedded in the article — checkbox (draw animation), radio group (fill), toggle (flip), and the send → sending → sent button. A static image here would contradict the section's own argument.

With the primitive components done, motion became the next layer. The principle was already locked: motion explains state, never decorates. That didn't mean we couldn't get creative.

We didn't invent most of the animations. We reverse-engineered the ones that inspired us, or took a React animation library, ported the code to Angular, and iterated from there. Some libraries we used: 
1. Magic UI
2. Animate UI
3. shadcn

## 8. The structure

> **Visual:** a before/after IA map in Part 1's tree-vs-intent diagram style: the ~15 screens in build order on the left, the merged insight-first structure on the right, with Conclusiones highlighted absorbing Diagnóstico and Plan de acción.

During our discovery, we found that most financial products didn't just have a single chart or table floating in whitespace, like we do. Most were insight-driven: a quick read at a glance, with room to dig deeper on demand. 

So we made a design decision: organize the product around the value each page delivers, not the order a plan gets built. Fewer, insight-driven screens. To get there, we mapped all ~15 screens to a user-value statement: what insight should a user reach within five seconds of looking at this page?

Conclusiones is the clearest case: today Diagnóstico and Plan de acción are two separate pages, but the value statement is one question, "what's my situation and what do I do about it?", so it becomes one dashboard.

<!-- TODO(Richard): swap or extend the Conclusiones example with today's work if you have a better one. -->

## 9. Where we are now: layout and charts

> **Visual:** a deliberately cropped teaser of the first dashboard exploration — monochrome, one accent, one chart token labeled. Partial on purpose: it sets up the next post without spoiling it.

In a fintech product the data visualization *is* the visual identity. Charts and cards are what a client actually looks at.

So we ran the moodboard exercise a second time, and this time we collected layouts instead of components: how the page is organized, how a dashboard is composed, how a chart behaves and how color is used.

What we kept:

1. **A bento dashboard** as the layout direction. Tight gaps, soft-rounded boxes, tags on the big numbers.
2. **Google Finance** for chart behavior. Extremely simple, the bare minimum on screen, and still enough. The compare control sits on top of the chart, and the tooltip updates a row of values instead of floating over the line, which solves a problem we have today: we show so much data on hover that the tooltip covers what you're trying to read.
3. **shadcn's shaded line** as the one variation on that baseline, so we have two to compare rather than one to defend.
4. **Shopify** again, for discipline. Boxes inside boxes inside boxes, and a chart style so plain it's accessible by default.

The decisions that came out of it:

- **One layout system, several layouts.** Pages can look different as long as they're assembled from the same modules and containers. A template removes parts; it doesn't invent new structure. As Miguel put it: "it doesn't feel like two different products."
- **Sections sit on a gray ground**, each with a one-pixel border and padding. That single border does more for texture than any decoration would.
- **Charts start at the most basic accessible form and grow from there.** My instinct was to pick three visual styles off the moodboard. Miguel argued for starting conservative and adding only what earns its place, and he was right. So Google Finance's chart is the baseline, shadcn's line is the first addition that earned its place, and anything beyond those two has to justify itself.
- **Color stops encoding categories.** Series go gray with one highlighted color, and green and red stay reserved for up and down. Miguel's line: "we should just use completely different things that are not colored to differentiate stuff."
- **Hierarchy per page:** the big insight on top, a row of small stats under it, the detailed table below.
- **Insight cards expand to full screen.** Filters and heavy interaction live in the expanded view, not on the card.
- **Nothing heavier than semibold**, and less differentiation overall: same font, same size, wherever we can get away with it.

Next we each rebuild the same page three ways from the real components, compare them, and pick. That's the current chapter. The next post starts with a chart.
