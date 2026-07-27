# How we built the new visual identity

> Source draft for `/blog/arquitectura-informacion` (Part 3 of the redesign series).
> Edit this file freely — the page HTML gets synced from it, not the other way around.
> The Spanish version comes from this file via the afi-redaccion pass once the English is locked.
> Sourced from the Granola meetings in the "Afi simulators visual identity" folder (Jul 3–23, 2026)
> plus the earlier research and foundations sessions.

**Standfirst:** From a vague brief to a system running in code: the decisions, in order, so the team has the full context.

**Lead:** *Part 3 of the redesign series. Part 1 defined what modern UI means in 2026; Part 2 sets brand strategy. This one covers our process: what we did, and why. We wrote it down because reconstructing context is where teams lose the most time.*

---

## 1. Context and objectives

> **Visual:** a four-stage timeline of the handoff eras — PNGs → Figma screens → Material components → our own system in code — drawn in the same diagram style as Part 1's maturity stages, so the series reads as one. Each stage gets a tiny artifact icon (an image file, a Figma frame, a Material card, a code component).

### Design at Afi is young

First, Daniel from communications sent PNGs to the programmers. 

Then Figma arrived with Miguel on Wealth Manager: real flows, but the org still had no systems and no components. Design and development mostly only talked when there was a visual question or an objection; the screens were designed by feel and the programmers took it from there.

My first project when I joined was Bankinter. We designed a product using the commercial visual line, with a lot of back and forth with the Bankinter team. After all that work it turned out the product was for private banking, a different visual line entirely. 

The Wealth Planner ran into the same problem at product scale: work arriving without context. When Renta 4 came in, my brief was one line: change the name, maybe make it red. No brand materials, no context on the size of the project. And the product itself had been built free-flow, without components, back when nobody had a system yet.

When the first round of Renta 4 iterations came in, I moved us onto components, in Material because that's what the team's code already used. It was a real step forward, and iteration got much faster. 

Then we learned what we'd missed by adopting the library without evaluating it together: Material is deeply opinionated, and we had to hack it to create products that match our clients' brands. Systemizing the design was the right call, but doing it inside Material created more restrictions for us.

After that, the direction was to create different versions changing only fonts, colors, and logos. We made one for Afi and one for Unicaja. Because of this we ended up with an old-looking, static product. The workflow never gave anyone time to design: it was plug in, drop in, deliver.

But AI changed what's possible: we aren't restricted to opinionated Angular libraries anymore; we can build our own. That's why I took the Memorisely AI design-system course. It gives us the flexibility to create the products we want.

That's the context for this redesign. We want a wow factor, which we haven't had in a while. 

To get there, we needed a design process, because every project above started the same way: no alignment upfront. 

### Wealth planner

The Afi Wealth Planner is a tool financial advisors use to build, simulate, and present wealth plans to clients. We have our version, mostly used for demos. We also white-label the product for Spanish banks, using their databases of client details. The brief was one line: make it look more modern.

The real problem is we run everything on static Figma screens. Developers work screen by screen without understanding interactions. The UI looked dated no matter what color we put on it. 

So before touching anything we set three objectives: a lean, information-dense UI built for professionals; interactive code demos instead of Figma-only documentation, so developers inspect the real thing; and a system that scales across client brands by swapping tokens, not redrawing screens.

## 2. Defining "modern"

> **Visual:** none needed — this section's job is to hand off to Part 1, and a new diagram would compete with it. At most, restyle the five bullets as the same bordered checklist Part 1's summary uses.

Before opening Figma, we wanted to define what "modern" meant. Otherwise every review turns into a debate about what people like versus what they don't; without a shared definition, taste argues with taste and nothing settles.

We synthesized the research in [Part 1 of this series](/blog/ui-moderno-2026). The short version:

- **Be intentional with visuals.** Neutral tones, functional depth, bento grids for hierarchy. Color and animation carry information, fast.
- **Dynamic instead of linear.** Linear flows create boring experiences; what we need is to truly understand the user's objective and build the layout around it.
- **Systems over preferences.** Semantic tokens as one source of truth, so decisions stay consistent and even machine-readable.
- **Evidence over opinion.** Because layouts can be dynamic there is more of an emphasis on tracking metrics and talking to users. Taste-only feedback, with no metrics or user input behind it, stunts creativity.
- **Pay attention to the small details.** Now that building is so much faster, modern UI gives space to the details users wouldn't name but do feel. An arrow twisting or a button hugging its text used to be a nice-to-have; now it's how you show that, even with AI, someone paid attention.

## 3. Moodboards, then a shortlist

> **Visual:** side-by-side crops of your Mobbin board and Miguel's for one component (buttons is the strongest), with the recurring apps highlighted — it shows "the same names surfaced" instead of asserting it. A second, smaller one: a strip of the winning reference per component (Cursor button, OpenAI input, Clerk menu) as the shortlist made tangible.

With the research done, we each built a moodboard in Mobbin, separately, organized by component: buttons, inputs, menus, cards, dialogs, sidebar, filters. Three or four screens saved per component. Working alone first mattered: two independent selections that agree are evidence, not taste.

Then we went through both collections together, one component at a time. Miguel noticed the pattern first: "We kept choosing the same apps over and over again. Maybe this is the vibe we want to go for." The same names surfaced in both boards, and that became the shortlist: Cursor, Shopify, Clerk, Notion, and Granola, with Linear, OpenAI, and Stack AI as recurring references.

The session produced directions, not final designs. Buttons compact like Cursor's, with the barely-visible shadow Stack AI uses. Inputs tight like OpenAI's, in two padding variants. Menus like Clerk's: options only, no icons, strong shadow. A Clerk-style breadcrumb navbar: workspace, client, simulation. Shopify as the reference for graphs on cards. And one rule that ended a recurring debate: segmented buttons for options, line tabs for views.

One idea came out of the session itself: on press, the button sinks inward. Small, but it set the tone for how we'd treat micro-interactions later.

## 4. Principles for the team

> **Visual:** the numbered lists carry this section; don't add a poster graphic that repeats them. If anything, a screenshot of the principles living in the design center / Figma library cover — proof they're a real artifact the team opens, not a slide.

After the moodboard session we wrote the design principles. Nine of them, each traceable to the research or to a decision we'd already made together:

1. **Information density without visual density.** Pack data, not decoration. The fintech research was clear that for people moving serious numbers, a high signal-to-noise ratio is what communicates competence.
2. **Compact controls.** Every control occupies only the space it needs. This came straight from the moodboards: the products we kept picking (Cursor, OpenAI, Linear) all run tight buttons and inputs.
3. **Functional minimalism.** Every element has to justify its existence. From the expressive-minimalism finding in Part 1: trust comes from the absence of decoration, not more of it.
4. **Progressive disclosure.** Show what's relevant first; expose complexity on request. The intent research in Part 1: the screen serves what the user came to do, and the detail is one click away, not on the first paint.
5. **Consistency above novelty.** Learn a pattern once, meet it everywhere. This is the design-maturity finding applied: shared patterns are what let the whole team decide together. The segmented-buttons-versus-tabs rule from the moodboard session is this principle in miniature.
6. **Motion explains state, never decorative.** From the friction research: the 150–250 ms processing beat builds trust, and any animation that doesn't explain a state change or direct attention gets cut.
7. **Color communicates meaning only.** Neutral surfaces, color reserved for action and state. When color is saved for communication, users learn to read it without thinking.
8. **Build the system, not bespoke screens.** Every screen assembles from reusable blocks. This one is our own history: screen-by-screen design is exactly how we ended up where section 1 describes.
9. **Context over pages.** Prefer drawers, inline editing, and expandable cards over page transitions. Users keep their place; the moodboard references (Shopify's click-in dashboards, complex drawers) all work this way.

We also wrote down what to avoid, because knowing what we are is incomplete without knowing what we're not:

1. **Material Design.** We lived inside its opinions and spent our time hacking around them. Not a style we dislike; a constraint we've already paid for.
2. **Heavy glassmorphism.** The research verdict: blur as a spatial cue is fine; refractive distortion on top of dense data is not. Glass on chrome, solid backgrounds on data.
3. **Colorful enterprise dashboards.** When everything is colorful, nothing stands out. 
4. **Playful consumer aesthetics.** Our users are professionals making financial decisions. The delight lives in precision and micro-interactions, not rounded mascot energy.

The principles exist so a review can argue against a principle instead of a preference. They now live alongside the [brand strategy](/estrategia-marca), so any future designer inherits the reasoning along with the components.

## 5. Foundations in black and white

> **Visual:** the type test, shown, not told — "0000 vs 4444" set in Space Grotesk, Fira Sans, and IBM Plex Sans at the same size with the width drift visible. It's the most self-evident image in the whole post. Optional second: the grayscale token cascade (primitive → semantic) to echo Part 1's token diagram.

We set up our primitive and semantic tokens with no color at all. A token is just a named decision, "background canvas," "background elevated," that does the same job everywhere it appears. Defining that vocabulary before the palette means that choosing colors later is a quick change: update the primitive, and every screen changes with it. Same for spacing decisions like nav-to-content. Set a base now, adjust as the brand matures, and it propagates everywhere.

Typography got the same treatment. We tested Space Grotesk and Fira Sans, and both drifted in width across number patterns (0000 vs 4444). IBM Plex Sans held consistent, so it became the type family for the modern identity.

## 6. Components in code, documentation in Figma

> **Visual:** the same button twice — its Figma doc page next to the live component in the workbench, with matching specs visible. One image proves the whole "one set of variables" claim. Since the blog runs on the modern foundation, the stronger move is embedding the real, hoverable component inline instead of a screenshot.

With foundations set, we listed the primitive components and split them. I took chip, badge, card, and table; Miguel took tag, dialog, navbar, and tabs. Buttons, inputs, checkboxes, and toggles were already done. Drawer and sidebar we saved to build together: too many variations to decide alone. We started with primitive components because they're the building blocks everything else assembles from; the more complex patterns only get built when we actually need them. 

We built in code first, using our references, then generated prompts for the Figma agent to create each component and its documentation. That saved us most of the documentation time, and because everything points back to the same variables, adjusting one reflects the change everywhere it's needed. 

From here we started building a component workbench page so during review we can show the team the interactions in an isolated environment. To keep that pipeline disciplined, we built two skills. Our /ds-cleanup skill audits a component or page, tells me where it's drifting from the system, and then, on a second prompt, fixes it. Our /ship skill commits and pushes; I merge; then it hands back a Figma prompt for anything that changed in the variables, so Figma and code never drift apart.

For the review meeting, we send the documentation link with the invite, so the team has context before the meeting starts. 

## 7. The structure detour

> **Visual:** a before/after IA map in Part 1's tree-vs-intent diagram style: the ~15 screens in build order on the left, the merged insight-first structure on the right, with Conclusiones highlighted absorbing Diagnóstico and Plan de acción.

Before adding motion to our components, we wanted to look at the whole product, because during our discovery, we found that most financial products didn't just have a single chart or table floating in whitespace. Most were insight-driven: a quick read at a glance, with room to dig deeper on demand. 

So we made a design decision: organize the product around the value each page delivers, not the order a plan gets built. Fewer, insight-driven screens. To get there, we mapped all ~15 screens to a user-value statement: what insight should a user reach within five seconds of looking at this page?

Conclusiones is the clearest case: today Diagnóstico and Plan de acción are two separate pages, but the value statement is one question, "what's my situation and what do I do about it?", so it becomes one dashboard.

<!-- TODO(Richard): swap or extend the Conclusiones example with today's work if you have a better one. -->

## 8. Micro-interactions

> **Visual (built):** live components embedded in the article — checkbox (draw animation), radio group (fill), toggle (flip), and the send → sending → sent button. A static image here would contradict the section's own argument.

With the components green, motion became the next layer. The principle was already locked: motion explains state, never decorative.

We didn't invent most of the animations; we collected them. Shopify's button press, where the icon drops one pixel like a key being pressed, we reverse-engineered in Figma down to the shadows. Wireframe.co set the bar for hover states. From Magic UI we took two patterns worth stealing: a gradient border that animates when an input takes focus, and a button that transitions when a task completes. That last one maps directly onto fintech: a submit button that stays disabled until the form is complete, then activates with motion, then walks through send, sending, sent. The 150–250 ms processing beat from Part 1 lives in the same layer.

## 9. Where we are now: the charts

> **Visual:** a deliberately cropped teaser of the first card-and-graph Figma exploration, monochrome with one chart token labeled — enough to set up the next post without spoiling it. It's the cliffhanger's image: partial on purpose.

Every component on the list is built. The gap is the one thing that was never on the list: graphs. In a fintech product, the charts are the visual identity. They're what a client actually looks at.

The groundwork is already in the foundations: the chart color roles (`chart/primary`, `chart/forecast`, `chart/positive`, `chart/negative`) were reserved back when we tokenized in black and white. The first card-and-graph examples are in Figma now, and we're building versions of them to compare.

That's the current chapter. The next post starts with a chart.
