# Plan — AFI Design System (Coherence), v1

## Context

Building **Coherence** — an internal design system for AFI, a fintech consultancy. Phase 1 of a larger epic; additional "mini-stories" are intentionally parked (see Backlog).

### Why this exists — the pains anchoring it

- **Variables get mistaken** in the design→dev handoff.
- **Weak communication** between designer and developers.
- **Solo-designer bottleneck** — one designer at AFI; knowledge decays, nothing gets documented.
- **Rushed + no accountability** — stakeholders under-allocate design time, then ~2 months later call the rushed result "wrong and confusing." The designer absorbs both the rush and the blame.
- **Devs don't consume the current handoff at all** — not Figma, not DevMode, not components, not written docs. *The systemic killer.*

### North star (LOCKED 2026-04-16)

> **A design system developers actually use — because it's built for how *they* consume information, not how designers wish they would.**

**Philosophical backing:** the full manifesto articulating *why Coherence exists and how it fits into the broader AFI way of working with AI* lives in [`docs/manifesto.md`](./manifesto.md) (source: Granola note *DS manifesto AFI*, 2026-04-16). That document carries the project's voice and is the source-of-truth for case-study language, outward-facing writing, and north-star decisions beyond the compressed sentence above.

### Intended outcomes

- V1 earns the **AFI dev lead's adoption** (beachhead).
- V1 is used to ship the greenfield **AFI-Marketing Wealth Planner** — doubles as the "200% productivity" hypothesis test.
- V1 survives a real **white-label stress test** (Wealth Planner is inherently multi-brand).

### Visual identity (LOCKED 2026-04-16)

**Brand soul:** *A modern AI tool with a traditional typographic foundation — tool-precise but typographically grounded.*

**Brand soul refined LOCKED 2026-04-16 (user articulation):** *"Innovative but classy. Modern but educated."* Direct reference: Granola's home screen — heavy serif display, ink-on-paper body tone, horizontal-only dividers, tabular figures, muted editorial tags, monoline icons, generous rhythm, minimal color used only to carry meaning (status dot, active-meeting bar, folder tag). The register is **New Yorker / Monocle / Kinfolk applied to software** — editorial confidence, not SaaS flash. Operational rule: when a visual decision is ambiguous, the tiebreaker is *"what would a monthly magazine do?"* — typography-first, color-sparingly, horizontal-rules-over-boxes, weight-and-tracking-over-size. This register bias applies universally except where finance-specific density (dense tables, scanning-heavy admin) overrides it — in those contexts, Notion / Stripe pragmatism wins.

| Layer | Source | Role |
|---|---|---|
| Structure / density | Figma | Compact, spatially disciplined, organized. |
| Typography / soul | Granola | **Roboto Serif only — single family across the entire hierarchy** (display, body, buttons, inputs, labels, data, tables). LOCKED 2026-04-16 — correction from earlier "Roboto Serif + Roboto sans pair." AFI's traditional/brand font IS Roboto Serif; Roboto sans is deferred to the brand/mode architecture (v2). Hierarchy is delivered entirely through weight + size + letter-spacing + tabular-figures — not through a second family. This is the editorial-software register (Medium pre-redesign / NYT web / Bloomberg Terminal / Stripe long-form docs) rather than the SaaS default (display-serif + body-sans). Distinctive, harder to execute, stronger signal. |
| Color | Wise | Monochromatic neutral base + strategic accents. Few shades per brand. Accent is the primary brand-swappable color slot. |
| Information architecture | Linear | Clean IA mechanics. |
| Motion | — | Smooth subtle microanimations. |
| Framework | — | Angular (hard constraint). |

### v1 scope (LOCKED 2026-04-16)

**Must-have surfaces:**
1. **Foundations** — color, type (Roboto Serif + Roboto), spacing, radius, motion tokens.
2. **Tokens** — browsable, copy-pasteable, linked from every component page.
3. **~10 core components** — Button, Input, Select, Checkbox, Switch, Card, Modal, Table, Tabs, Drawer. **Table references: Notion + Stripe (LOCKED 2026-04-16).** Interactive, hover-rich, flexible columns — editable / sortable / row-hover actions / tabular figures / inline detail expansion. Pushes Table from "data grid" to "primary interactive surface." Directly serves the EscenarioTable on Diagnóstico and position tables on Wealth Manager. **Core principle LOCKED 2026-04-16: "Build once, variants for the rest."** One Button file handles all sizes / intents / states via `@Input()` props + class binding. Same for Input, Card, Table, etc. No duplicate component files. Same philosophy as shadcn / `class-variance-authority`. Keeps the ~10 count real; otherwise Button becomes 6 files and the DS bloats like the one we're replacing.
4. **3 chart types** — line, bar, donut.
5. **One composed flow** — a real screen rebuilt entirely from the DS. **Target: AFI-Marketing Wealth Planner — Diagnóstico screen (LOCKED 2026-04-16).** Rationale: Diagnóstico naturally exercises all 3 v1 chart types in one screen (EvolucionChart = line for 3-scenario future projection, CashflowChart = bar for income/expense evolution, AssetAllocationChart = donut for current vs recommended allocation) + EscenarioTable. Strongest single-screen stress test for v1.
6. **Site shell** — sidebar IA (Foundations / Tokens / Components / Charts / Flows), page template, search, every URL linkable.

   **Page template pattern LOCKED 2026-04-16 (per user request — "shadcn docs + Awwwards case studies"):**

   Every foundations / tokens / components page follows ONE template, blending shadcn's density with Awwwards' editorial register. **Rule of thumb: density is internal, rhythm is external.** Each section is packed with utility (shadcn); spacing, typography, and page-level architecture between sections is editorial (Awwwards). Reading a token page should feel like a New Yorker feature about engineering.

   **Sections (in order):**
   1. **Editorial hero band** — Roboto Serif display, one-sentence role, airy vertical rhythm. Full-width.
   2. **Why this exists** — one short contextual paragraph setting the register.
   3. **Visual exhibit** — the actual thing at generous scale (color band, spacing rhythm sample, component in default state). Not a thumbnail.
   4. **How to use (rules)** — rendered from the corresponding MD skill file. Bullet rules + "don't" examples.
   5. **Code examples** — shadcn-style snippets with copy buttons. Import + applied usage.
   6. **Props / API table** — shadcn-density table (components only).
   7. **Related** — links to adjacent concepts, components that consume this, and the source-of-truth MD skill file (transparently exposed — "this rule lives in `docs/token-skill.md`").

   **Layout:** two-pane — sticky left sidebar (IA), sticky right on-page quick-nav (shadcn pattern). Content max-width `content-lg` (1024) for reading rhythm.

   **Reference anchors LOCKED 2026-04-16 (user confirmed Option B + clarification):**
   - **shadcn/ui docs** (`ui.shadcn.com/docs`) — density, code-first pattern, props tables, every-page-has-copy-paste
   - **Vercel Design** (`vercel.com/design`) — editorial wrapper for a DS: hero typography, generous whitespace, confident rhythm, no scroll-immersion overhead
   - **Stripe docs** (`stripe.com/docs`) — B2B-finance proof that shadcn-density inside an editorial wrapper actually works when people need to ship
   - **"Components as experiences" (Awwwards register, applied to components NOT case studies)** — the user's clarifying framing. Per-component demos feel *alive* (subtle microinteractions on hover, purposeful transitions, considered focus states) the way award-winning agency sites show components. NOT full case-study immersion (no scroll-driven hero videos, no parallax, no full-bleed cinematic). Reference category: framer.com feature showcases, arc.net component demos, linear.app homepage component-in-context.

   **Guiding tension LOCKED:** *"An experience — not over the top but useful and valuable."* Every interactive element has to pass two tests: (1) does it teach, let the user play, or reveal accessibility reality? (2) is it restrained enough that a back-office operator using a Wealth Manager import table all day wouldn't find it tiring? If no to either, cut it. "Useful and valuable" is the ceiling on delight, not a license for restraint-as-austerity.

   **Single-writer / dual-reader rule LOCKED:** MD skill files (`docs/token-skill.md`, `docs/component-skill.md`, `docs/accessibility.md`, `docs/clean-code.md`, `docs/motion-templates.md`) are the **source of truth**. Site pages render their "How to use" sections from those files. One edit updates the rule for agents (Builder / Token Guardian / Tester), for designers, for developers, for the case-study presentation. No drift. The site becomes a rendered, enhanced version of the same content AI agents read as instructions — this IS the case-study story.

   **Interactive + educational layer LOCKED 2026-04-16 (per user — "play, have fun, understand when to use it, accessibility, thought experiment"):**

   "Overview" = per-topic landing page (`/foundations/colors` IS the color overview; `/components/button` IS the button overview). Each page is an **interactive learning environment**, not static reference. Traditional numerical scales (50–950, xs–2xl) are available as reference but are NOT the primary engagement mode. Primary engagement: hover / click / pair / play / compare / learn. Register references: Radix Colors docs, color.review, Tailwind color palette hover cards — applied inside our editorial wrapper.

   **Four learning modalities per page** (where applicable): *when to use*, *accessibility*, *play*, *thought experiment*.

   **v1 interactive MUST-haves:**

   | Page type | Interactive elements |
   |---|---|
   | Colors | Hover-card per swatch (hex / CSS var / usage / contrast vs black + white). **Pair contrast checker** (click two swatches → ratio + WCAG AA/AAA badge inline). "When to use" panel rendered from `token-skill.md`. |
   | Dimensions | Rhythm visualizer (click a size → see it at real scale against sample content). Copy button on every token. |
   | Motion | **Animation template gallery** (see below) — each template has name + live preview + spec + copy-paste + apply-to-sample. Reduced-motion respected honestly. |
   | Components | Static variants grid (all sizes × all intents × all states). Live state toggler (click through default / hover / pressed / focus / disabled / loading / error). Animation template dropdown applied to preview. |
   | All pages | "Related" footer links to the MD skill source + adjacent concepts. |

   **v2 (parked — promotes from backlog Wave 1 when v1 ships):**
   - Full Stripe-style config panels with live prop editing
   - Multi-step thought-experiment flows ("design a destructive button — the system walks you through a11y + intent decisions")
   - User-submitted examples / community gallery

16. **Animation template library — `docs/motion-templates.md`** *(added 2026-04-16 per user request — "examples of animations but like template examples almost").* Named library of canned micro-animation templates. Each entry: name, spec (duration token + easing token + transform), when-to-use, reduced-motion fallback, example invocation. Rendered on the site at `/foundations/motion/templates`. Components reference BY NAME (`animation="hover-lift"`) rather than re-declaring CSS — enforces consistency; this is the "unique vibe" layer. Initial templates to spec in motion session (session 3 of strategy sequence): `hover-lift` (Button primary, Card) / `hover-tint` (Button secondary/ghost, chip) / `press-scale` (Button all, interactive row) / `focus-ring-fade` (every focusable primitive) / `enter-slide-up` (Modal, Drawer from bottom, Toast) / `enter-slide-right` (Drawer primary) / `enter-fade` (Tooltip, Popover) / `exit-fade-contract` (dismissal) / `list-reorder` (Table row drag, list reorder) / `chart-morph` (EvolucionChart scenario-to-scenario, AssetAllocationChart re-slice).

   **Motion discipline LOCKED 2026-04-16 (per user — "animations follow the rules of animations and are realistic... animate the container not just the text inside — from a YouTube video about taste as a vibe coder"):** motion-templates.md opens with this ruleset as its preamble. Builder agent follows it for any animation. Tester agent verifies it before any animated component ships.

   1. **Container-first — animate the object, not its contents.** A button's hover moves the button as one unit: border, bg, label together. Decoupled text motion inside a static container reads broken.
   2. **Fewest properties possible.** Prefer `transform` + `opacity` (GPU-composited, no layout). Avoid animating `width` / `height` / `top` / `left` except when genuinely needed.
   3. **Ease correctly.** `ease-out` for enters (settling in). `ease-in` for exits (accelerating away). `ease-in-out` for back-and-forth. Linear is almost always wrong.
   4. **Match duration to weight.** Chip focus: 80–150ms. Button hover / press: 150–200ms. Modal enter: 200–300ms. Never above 400ms for interactive response.
   5. **Respect the resting state.** Hover / pressed / focus read as *variants* of default, not *replacements*. User can always visually "return home."
   6. **Don't animate what you haven't decided.** Animation clarifies intent; random animation muddles it. If a property's purpose isn't clear, leave it static.
   7. **Reduced motion = respect, not disable.** `prefers-reduced-motion: reduce` drops to 0–80ms fades. Keep state communication, cut movement. One global CSS rule handles this.

   These seven rules are the craft layer under every template. Once locked in `motion-templates.md` they become enforceable — Builder cites them, Tester checks them, Case-study presentation has them as a named artifact.
17. **Download-MD feature on applicable pages** *(added 2026-04-16 per user request — "allow the user to download the MD files").* A `DownloadMdButton` component appears in the "Related" footer of every page that has a source-of-truth MD worth taking away. **Why it matters:** the MD files are agent-ready context. A visitor clicks Download → the MD lands on their machine → they drop it into their own Claude / Open Code / Cursor session → they inherit the same rules our agents follow. This makes Coherence consumable as reference AND as AI context, which is the single most on-brand feature possible given the manifesto. **Page mapping for v1:** `/foundations/colors` + `/foundations/dimensions` + `/foundations/typography` + `/foundations/motion` → `docs/token-skill.md` (plus `motion-templates.md` on motion page). `/components/*` → `docs/component-skill.md` + `docs/accessibility.md` + `docs/clean-code.md` (eventually a per-component `.md` once components ship). Home → eventual "all" bundle (v2). Component built once, reused on every applicable page — "build once, variants for the rest" applies; `DownloadMdButton` takes `filePath` + `label` inputs.
7. **Project / feature brief template MD** *(added 2026-04-16 per user request)* — a reusable "plan-agent" template the user can run to scope future digital products/features **while** other builds are in flight. **Form LOCKED 2026-04-16: Agent prompt + questions.** The MD *is* a Claude system prompt: opens with working-style rules + four ordered phases with checkpoints between them. **Structure LOCKED 2026-04-16:**
   - **Phase 0 — Intake:** client / team → project type (new / iteration / redesign) → existing DS → existing Figma → stakeholders. (The *what am I walking into*.) Branches how all subsequent phases are asked.
   - **Phase 1 — Frame:** pains → north star → references → users. (The *why*.)
   - **Phase 2 — Scope:** v1 surfaces → user stories → out-of-scope. (The *what*.)
   - **Phase 3 — Spec:** technical + non-technical requirements + constraints. (The *how*.)
   - **Phase 4 — Parked:** v2 deferred → backlog. (What not to lose.)

   User can stop after any phase for lighter projects. Each phase has a checkpoint — plan file gets a section written, user confirms, next phase begins. **Roadmap / V×C÷E scoring is deliberately NOT in the template** (user note 2026-04-16: "they don't think like this, especially with AI where we can build it"); it remains Coherence's own internal practice, not a universal requirement. The actual prompt text for each phase is co-defined with user during build phase. Lives in `docs/` on the DS site so it is linkable.
8. **Build-kickoff MD — `docs/build-kickoff.md`** *(added 2026-04-16, **live 2026-04-16**)* — symmetric twin of the brief-template MD. Consulted when a brief reaches `Status: complete`. Converts Phase 2 v1 surfaces into one executable build prompt each under `docs/build-prompts/{slug}-{surface}.md`. Prompts **reference** the skills (clean-code, a11y, component, token, copy) rather than inline them — Open Code follows the links, no "huge prompt" pattern. Every build prompt ends with a clean-code grep pre-flight; commit blocked on failure, no `--no-verify` escape. Execution order locked: token gaps → primitive gaps → surface prompts.
9. **Workflow MD (Start here) — `README.md`** *(added 2026-04-16 per user request)* — the single first-page map of the whole loop: **Meeting** (discovery / research) → **Plan with AI** (brief-template) → **Fill in plan file** → **Build** (build-kickoff → Builder) → **Test** → **Iterate**. One screen. Links out to brief-template, build-kickoff, git-cheatsheet. Placed at `README.md` (not `docs/`) because it IS "start here" — the first thing anyone sees in the repo. `docs/` links to it, not vice versa.
10. **Git cheatsheet — `docs/git-cheatsheet.md`** *(added 2026-04-16 per user request)* — 5–6 plain-English-named commands: pull, save-and-share (`add` + `commit` + `push`), new branch, see-what-changed, undo-last-commit. Not a git tutorial. Keeps the DS approachable for non-git-power-users (future designers, writers, Miguel, Flavia) and doubles as a case-study artifact: "here's a DS accessible to non-engineers."
11. **`docs/accessibility.md`** *(added 2026-04-16, **live 2026-04-16**)* — WCAG 2.2 AA minimum / AAA for text + touch. 44×44pt touch targets. Per-primitive checklists (Button, Input, Select, Checkbox, Switch, Modal, Drawer, Table, Tabs, Toast, inline-edit). Pre-flight runs before merge; paired with `clean-code.md` as the component pre-flight. Referenced by `component-skill.md` as a must-check on every component.
12. **`docs/clean-code.md`** *(added 2026-04-16, **live 2026-04-16**)* — Angular + Tailwind + strict TS + token-only styling. Non-negotiables: standalone + OnPush + signal inputs/outputs / no hex-rgba-px outside `libs/tokens/` / one file per primitive / signals for state, RxJS only for async / no direct DOM / Tailwind over SCSS with 20-line SCSS cap per component. Pre-flight grep runs at commit; blocks commit on failure, no `--no-verify` escape. Referenced by `component-skill.md`.
13. **`docs/component-skill.md`** *(added 2026-04-16 per user request)* — the agent rules when building ANY component. **Core rules:** reads tokens only (no hard-coded values) / uses the 6 semantic buckets / passes a11y checklist / follows clean-code.md / consulted BEFORE first line of component code / **"Build once, variants for the rest" (LOCKED 2026-04-16) — one component file per primitive, variants via `@Input()` props + class binding, never duplicate component files** (shadcn / `class-variance-authority` philosophy; keeps the ~10 count real).
14. **`docs/token-skill.md`** *(added 2026-04-16 per user request)* — the agent rules for defining OR consuming tokens. Primitive → semantic → brand three-layer architecture / semantic bucket taxonomy locked (Canvas / Surface / Action / Control-neutral / System / Data-viz) / base-4 spacing scale / naming conventions / brand-manifest slot awareness / JSON as source of truth → CSS variables generated. Referenced by `component-skill.md` as the authoritative token-use guide.
15. **`docs/agents/` — 5-agent lineup MDs** *(moved from `.claude/agents/` 2026-04-16 per user accessibility rule)* — `planner.md` **(live 2026-04-16)**, `builder.md`, `tester.md`, `ds-token-guardian.md`, `case-study.md`. Each MD: role, boundaries, consumed artifacts (plan, component-skill, token-skill, etc.), handoff rules. Loaded explicitly by build-kickoff MD into any Claude Code session. Lives in `docs/` (visible, team-readable) instead of `.claude/` (hidden). **Shape locked 2026-04-16: each agent is a session harness — a thin file that points at source-of-truth prompts (e.g. `planner.md` points at `brief-template.md`) and adds the operational details (input/output paths, read-order, voice, handoff). Single-writer rule: phase content lives in one file, harnesses consume it.**
16. **`docs/copy-skill.md`** *(added 2026-04-16, **live 2026-04-16**)* — RAE Spanish rules + dual-mode posture (team language in, RAE-perfect Spanish out). Orthography + grammar + UI register for B2B Iberian Spanish (formal `usted`). AFI glossary for English-Spanish terms that drift (*Panel*, *Iniciar sesión*, *Proveedor*, *Sobrescribir*, etc.). Pre-flight runs before strings ship. Referenced by `component-skill.md` for any user-facing string.

**Session locks 2026-04-16 (post-skill-batch):**

- **Typography utility layer = Tailwind.** Token JSON → CSS vars → `tailwind.config.theme.extend` → templates use `text-*`, `font-*`, `leading-*` utility classes. Shadcn-Angular pattern. SCSS is escape-hatch only, capped at 20 lines per component with documented reason.
- **AWM type scale is the reference structure.** 7 named roles — Display 96/112, Title 32/40, Subtitle 24/32, Section 20/24, Body 16/24, Subtitle body 20/20, Informe 12/14, Button 14/14 — plus Body L/M/S × weights 400/500/600, Roboto Serif throughout. Coherence adopts the *structure*; values go into `libs/tokens/primitive/typography.json` with semantic aliases in `libs/tokens/semantic/typography.json`.
- **AWM is a future brand slot.** AWM type + color overrides land in `libs/tokens/brand/awm.ts` post-v1. v1 Coherence ships with AFI default brand; AWM manifest then validates the brand-swap proof point.
- **Data-viz skill source = Visa Product Design System data-viz rules.** `docs/data-viz-skill.md` queued after primitives land; needs Visa DS reference pull first.
- **Motion references — motion.dev tutorials locked:**
  - `motion.dev/tutorials/react-command-palette` → inspires `<afi-command>` primitive (**v2 candidate, high-priority**). CDK Overlay + FocusTrap + `@angular/animations`; Motion One (Tier 3) for stagger if CSS can't.
  - `motion.dev/tutorials/react-loading-line-reveal` → inspires `<afi-loading-overlay>` primitive/directive (**v1**). Pure CSS `clip-path` + `transform` (Tier 1) driven by a `revealing` signal.
  - `motion.dev/tutorials/react-multi-state-badge` → inspires `<afi-badge>` state transitions (**v1** — directly serves AWM status tags: En revisión → Listo para importar → Importado). CSS transitions on width + color + icon swap (Tier 1).
- **Principle-transfer rule (motion references).** motion.dev examples are React — Coherence translates the *choreography* (timing, easing, container-first movement) not the *code*. Tier 3 Motion One remains the ceiling only when Tier 1 CSS + Tier 2 `@angular/animations` can't deliver.
- **Motion context rule — LOCKED 2026-04-16 (per user "all about context").** Decorative motion (page-load line-reveal, staged hero reveals, ornamental parallax, big stagger sequences) lives in the **Coherence DS site** as a demonstration surface — the DS is allowed to perform. **Consumer products** (AWM, future bank clients) use motion strictly for state affordance + transitions (hover, press, enter/exit, loading). A primitive like `<afi-loading-overlay>` ships its full variant range; consumers pick the restrained variant by default. Burden of justification is on adding motion, not removing it. This rule overrides any "but the DS does X" argument when a product application is in scope.
- **Sidebar primitives added to v1 (Instagram-style hover-expand) — LOCKED 2026-04-16.** Two new primitives, bringing the v1 count from 10 → 12:
  - **`<afi-sidebar>`** — navigation shell. Variants: `mode="static" | "collapsible" | "hover-expand"`. Default = `hover-expand` (narrow icon rail that expands on pointer hover OR keyboard focus). Owns `expanded` signal state + optional `pinned` persistence.
  - **`<afi-nav-item>`** — repeatable row. Inputs: `icon`, `label`, `href`, `badge?`, `active?`.
  - **Animation (Tier 1 pure CSS):** width transition 200ms ease-out; label opacity cross-fade 150ms ease-out, ~50ms staggered after width; collapse on mouse-leave 200ms ease-in (asymmetric — exits accelerate per motion discipline rule 3). Container-first (rule 1).
  - **Reduced motion:** width still changes (utility preserved); opacity transitions collapse to 0–80ms. Movement cut, state kept.
  - **A11y:** keyboard focus acts as hover (focusing an icon expands the sidebar — Instagram + Linear pattern; makes collapsed mode keyboard-usable). `aria-expanded` on the sidebar root; `aria-label` on every nav item when collapsed. Tooltip per icon when collapsed, suppressed when expanded.
  - **References:** Claude app sidebar (style — user-provided screenshot 2026-04-16: quiet dividers, muted typography, small icon sizing). Instagram messaging mode (mechanic). Notion desktop, Vercel dashboard, Linear sidebar (adjacent references).
  - **Why v1:** the DS site itself needs a sidebar for Foundations / Tokens / Components / Charts / Flows IA. Ships with Coherence, validates the pattern before external products consume it.
  - **Color — LOCKED 2026-04-16 per user ("less blue, one step lighter, Claude + Granola + Perplexity subtle-change calibration").** New semantic token: **`surface-quiet`** — lives in the Surface bucket. Desaturated near-white: ~4-6% luminance delta from canvas-base, ~60-70% saturation cut from the standard 200° AFI-blue hue. Default surface for persistent chrome: Sidebar, Toolbar, Footer. **Not** the same as `surface-100` (which stays more chromatic for cards / panels). Sidebar and NavItem read from `surface-quiet` by default; other chrome composes in. Reference triangulation: Claude (near-neutral, whisper-cool) / Granola (warm off-white) / Perplexity (between). AFI hue preserved, volume turned way down.

**Session locks 2026-04-17 (post-chrome-model):**

- **App chrome model = Pure C — LOCKED 2026-04-17.** Persistent sidebar (icon-rail, expandable) + `<afi-page-header>` (adaptive height) + content. **No top strip, ever.** Reasoning: AFI has no product-wide mode switcher — URL-based context (`/personas/cliente/propuestas`) carries the cliente, and `propuesta.estado` is page-scoped. The Claude.ai / ChatGPT model-picker top-strip pattern is unearned here. Notifications bell pins top-right of page-header row 1 as the only persistent global action; everything else is route-based or page-scoped.

- **Estado pattern is page-scoped — LOCKED 2026-04-17.** `<afi-status-chip>` renders beside the resource title; the estado drives conditional primary actions, tabs, right-rail contents. Replaces earlier instinct toward a "nivel de riesgo" global chip — that's the proposal's *regulatory* risk level (per-proposal slider in the current AWM design's right rail), not a product-wide advisor lens. The product-wide advisor lens does not exist at AFI.

- **Shell catalog = 5 named shells — LOCKED 2026-04-17.** Workspace / Focus / Canvas / Auth / Docs. Each is a fixed composition of the same underlying primitives; products pick one per route via `data.shell` route metadata. **v1 ships:** Workspace (AWM) + Docs (the Coherence site itself) + Auth (cheap, every product needs login). **Reserved (contract documented, build parked):** Focus + Canvas. When a consumer needs them, the build prompt is already written.

- **Surface tonal ladder complete — LOCKED 2026-04-17.** `surface-base` / `surface-quiet` / `surface-muted` / `surface-elevated` / `surface-overlay`. **Tonal step = context change** (sidebar vs content). **Shadow = elevation change** (card above content). They don't mix. The `surface-quiet` calibration from 2026-04-16 stands; `muted` + `overlay` fill the ladder.

- **Status semantic bucket — LOCKED 2026-04-17.** 8 estados (borrador / pendiente / aprobada / rechazada / ejecutada / cancelada / en-revision / archivada), each with bg + fg + dot tokens. AA contrast verified per pair. Source-of-truth for `<afi-status-chip>`.

- **Three new v1 primitives — v1 count 14 → 17:**
  - `<afi-page-header>` — adaptive-height page chrome, sticky + scroll-fade, estado-aware. Slot-driven rows collapse when empty.
  - `<afi-status-chip>` — estado pill. Sibling of `<afi-badge>`; semantically distinct (Badge = count/intent; StatusChip = business-resource state).
  - `<afi-shell>` — composition primitive for the 5 shell types, driven by `data.shell` route metadata.

  Plus Auth shell + login form ships as a composed surface in v1 (reuses Card + Input + Button — not a new primitive). Focus + Canvas render a "Reservado en v1" stub that doesn't crash the route.

- **Coherence site IA restructured — LOCKED 2026-04-17.** The site is the Coherence docs umbrella. Top-level = Fundamentos / Producto / Marketing / Recursos. `/componentes` → `/primitivos`. Site runs inside `<afi-shell type="docs">` — no custom shell wrapper. Marketing is a `Próximamente` stub in v1; fills out v1.1+. `docs/build-prompts/coherence-site.md` updated.

- **Scroll-fade rule — LOCKED 2026-04-17.** Sticky page-header applies `backdrop-blur` + bottom border on `scrollY > 8px`. Transition: `duration-fast` (150ms), `easing-enter`. Reduced-motion → instant.

- **Explicit non-goals — LOCKED 2026-04-17.** Marketing site chrome, email templates, PDF templates, Figma UI kit. These are **tokens-only consumers** — they share Coherence's color/type/space/motion tokens but have their own chrome systems. Not Coherence's job to own.

- **`nivel de riesgo` global mode — REJECTED 2026-04-17.** Earlier strategy instinct was wrong; it conflated (a) the proposal's regulatory risk level (page-scoped, already in AWM's right rail) with (b) a hypothetical product-wide advisor lens. (b) does not exist at AFI. Top strip stays unearned. Archived as an explicit rejection so the question doesn't re-open.

- **Build sequence amendment — LOCKED 2026-04-17 — site bootstrap pulled forward to close the visual-preview gap.** The prior sequence parked the full site at the end, which left Builder shipping primitives into `libs/ui/` with no way for the user to see them locally until the site came online much later. **Fix:** insert a minimal `apps/site/` bootstrap after Tokens — just `<afi-shell type="docs">` + a single `/preview` route rendering a gallery of every shipped primitive. Each primitive PR adds a card to the gallery. The full site IA (pages, tabs, MD rendering, downloads) still lands at the end and *replaces* the preview gallery with the real docs site when ready.

  **Revised v1 build order (supersedes earlier sequencing):**
  1. Scaffolding
  2. Tokens
  3. Clean-code-check (pre-commit hook)
  4. **Site bootstrap — minimal `apps/site/` + `/preview` gallery route** *(NEW)*
  5. Button (+ preview card)  ← *just shipped by Builder 2026-04-17*
  6. Input
  7. Checkbox
  8. Switch
  9. LoadingOverlay + Badge
  10. Card
  11. Tabs
  12. Modal
  13. Drawer
  14. Select
  15. Sidebar + NavItem
  16. Table
  17. Page-header *(NEW primitive)*
  18. Status-chip *(NEW primitive)*
  19. Shell (Workspace + Docs + Auth build; Focus + Canvas stub honestly) *(NEW)*
  20. Auth shell + login form (composed surface) *(NEW)*
  21. Charts (bar / line / heatmap / dumbbell)
  22. Site full IA — Fundamentos / Producto / Marketing / Recursos — replaces `/preview` gallery.

  **Immediate builder handoff (2026-04-17):** Button is shipped at `libs/ui/button/`. Next step is **Step 4 — site bootstrap**, not Step 6 (Input). Rationale: the /preview route is now the visual feedback loop for every subsequent primitive. Adding Button's card to the gallery is a 10-minute task once the bootstrap is in place, and every primitive after is immediately previewable. Do not continue to Input until the gallery is live and Button is visible at `localhost:4200/preview`.

**Session lock 2026-04-17-rev2 (post-IA-restructure) — SUPERSEDES the "Coherence site IA restructured" entry from 2026-04-17:**

- **Coherence site IA — six top-level sections, Wise-flavored landings, Claude-flavored sidebar mechanics — LOCKED 2026-04-17-rev2.**

  The 2026-04-17 IA (Fundamentos / Producto / Marketing / Recursos) is **superseded**. That umbrella framing was correct in spirit but too flat for a design-system showcase. The Wise information architecture (Design at Wise / Foundations / Components / Patterns / Resources) is the right reference — six sections, each with an editorial landing page, Pure-C-compatible sidebar mechanics.

  **The six sections:**

  | Route | Section | Contents |
  |---|---|---|
  | `/` | Design at Coherence | Home. Welcome + manifesto + working style + team. Single page, no children. |
  | `/fundamentos` | Foundations | Principios / Color / Tipografía / Espacio / Movimiento / Accesibilidad / Copy / **Tokens** (moved here from Producto) |
  | `/componentes` | Components | All 17 primitives (Button / Input / … / PageHeader / StatusChip / Shell) |
  | `/patrones` | Patterns | Shells (the 5 types) + Flujos (Importación, edición-de-fila) + Gráficos (chart primitives compose here) |
  | `/recursos` | Resources | Descargas / Changelog / Roadmap / FAQ |
  | `/blog` | Blog | Propuesta-framed release posts (see Blog scope below) |

  **Producto drops as a top-level.** Its children distribute: Tokens → Foundations, Primitivos → Components, Shells + Flujos + Gráficos → Patterns.
  **Marketing drops as a top-level.** Not needed. If marketing patterns emerge later, they join `/patrones`.

- **Sidebar mechanics — Claude/Linear pattern — LOCKED 2026-04-17-rev2.** Single persistent sidebar with six top-level items; each section expands/collapses to reveal its children. Only the active section's children are expanded by default. This preserves the Pure-C chrome lock (no top strip, ever) from 2026-04-17. Editorial register lives at section *landings*, not in chrome.

- **Section landing pages — Wise-style editorial register — LOCKED 2026-04-17-rev2.** Each `/fundamentos`, `/componentes`, `/patrones`, `/recursos`, `/blog` landing page opens with a big serif hero (`text-display` or `text-title`, Roboto Serif, generous vertical rhythm), followed by a teaser grid of square tiles — one per child. Tiles show a **real visual** of the child (color swatches on the Color tile, a focus-ring example on Accesibilidad, a Button preview on the Button tile). Tiles link to detail pages. This is the showcase moment; the chrome stays quiet.

- **Blog scope — propuesta-framed release posts at ship time — LOCKED 2026-04-17-rev2.** Not generic release notes. Every post answers the three propuesta questions:
  1. **¿Cuál es el objetivo?** — the outcome, not the feature description.
  2. **¿Cómo cambia la vida del usuario?** — the before → after transformation, concrete.
  3. **¿En qué momento lo abren?** — the anchor moment in the user's day.
  
  Written **at ship time**, not post-hoc. Closing disclaimer on every post: *"Este artículo se escribió al momento del envío. No es una descripción retrospectiva."* Template lives at `docs/blog-template.md`. Cadence is per meaningful release (waves of primitives, shell types, composed flows), not per primitive. 600–1200 words, hard cap 1500.

- **Case-study agent gains two modes — LOCKED 2026-04-17-rev2.** `docs/agents/case-study.md` now carries:
  - `mode: release` — invoked at ship time, propuesta-framed, filed to `docs/blog/{slug}.md`, consumes `docs/blog-template.md`.
  - `mode: retrospective` — invoked weeks/months post-ship, receipts-driven (Before/After/Receipts/Lesson), filed to `docs/case-studies/{slug}.md`. This is the existing behavior, preserved.
  
  Retrospectives cover outcomes/adoption/surprises; releases cover propuesta/decision. If both exist for the same feature, cross-link.

- **File-artifact deltas — LOCKED 2026-04-17-rev2:**
  - **New:** `docs/blog-template.md` (the propuesta-framed structure the agent fills).
  - **New:** `docs/blog/` directory (release posts land here; each renders at `/blog/{slug}`).
  - **Updated:** `docs/agents/case-study.md` (two modes).
  - **Updated:** `docs/build-prompts/coherence-site.md` (routes restructured to six sections; sidebar template rewritten; file structure updated).
  - **Updated:** `docs/build-prompts/coherence-site-bootstrap.md` (sidebar template previews the six sections as collapsible placeholders; only `/preview` active).
  - **Not affected:** primitive build prompts, shell build prompt, tokens build prompt, clean-code-check prompt, skill MDs — these don't care about IA.

**Session lock 2026-04-17-rev3 (post-menu-nav-section) — EXTENDS the v1 primitive set + build order from rev2:**

- **Three new primitives added to v1 — LOCKED 2026-04-17-rev3.** v1 count 17 → 20 (21 counting MenuDivider as a trivial helper shipped with Menu). Calibration: Granola's workspace nav-section + folder `⋮` menu.
  - **`<afi-menu>` + `<afi-menu-item>` + `<afi-menu-divider>`** — CDK Overlay-based contextual action list. Sibling to Modal/Drawer in the overlay family; distinct from `<afi-select>` (form control). Unlocks row-level action menus everywhere (Delete propuesta, Rename folder, Share cartera), toolbar-overflow menus, workspace/brand pickers. Build prompt: `docs/build-prompts/coherence-menu.md`.
  - **`<afi-nav-section>`** — expandable parent nav row with collapsible children; chevron + label + icon + trailing-action slot. Auto-expands when the active route is inside. Composes `<afi-nav-item>` for parent and children. **Graduates** from the site-local component slotted in 2026-04-17-rev2 to a real DS primitive — AWM will need Granola-style hierarchical sidebars the moment it has folders, collections, or workspaces. Build prompt: `docs/build-prompts/coherence-nav-section.md`.

- **Revised v1 build order — LOCKED 2026-04-17-rev3** (supersedes the rev2 build order at the step range below; everything outside this range is unchanged):

  ```
  15. Sidebar + NavItem
  16. NavSection                  ← NEW, extends nav family
  17. Menu + MenuItem + Divider   ← NEW, extends overlay family
  18. Table
  19. Page-header
  20. Status-chip
  21. Shell (Workspace + Docs + Auth; Focus + Canvas stub)
  22. Auth shell + login form
  23. Charts (bar / line / heatmap / dumbbell)
  24. Site full IA — Design at Coherence / Foundations / Components / Patterns / Resources / Blog (replaces /preview)
  ```

  Ordering rationale: NavSection composes NavItem (must ship after it). Menu reuses CDK Overlay infrastructure already built for Modal/Drawer. Table and everything after are unaffected by this insertion.

- **Granola + Linear are the nav-family calibration anchors — LOCKED 2026-04-17-rev3.** The reference set for the nav family is now pinned:
  - Granola — workspace hierarchy, folder rows, `⋮` menus, trailing `+` actions on hover
  - Linear — persistent sidebar, collapsible sections, quiet chrome, notifications-only top-right pin
  - Claude / ChatGPT — sidebar-as-brand-home pattern (no logo in top strip)
  
  Any new nav-family work triangulates against these three; Wise is the section-landing calibration (editorial hero + teaser grid) but not the sidebar-mechanics calibration.

- **Site-local component list trimmed — LOCKED 2026-04-17-rev3.** The rev2 site build prompt referenced `<afi-nav-section>` as site-local. That's superseded — use the DS primitive from `libs/ui/nav-section/` instead. The site-local component list is now: `download-md-button` · `component-playground` · `tokens-table` · `code-toggle` · `teaser-tile` · `primitive-card` (bootstrap only). `nav-section` drops off the site-local list.

- **File-artifact deltas — LOCKED 2026-04-17-rev3:**
  - **New:** `docs/build-prompts/coherence-menu.md` (covers Menu + MenuItem + MenuDivider).
  - **New:** `docs/build-prompts/coherence-nav-section.md`.
  - **Updated:** `docs/build-prompts/coherence-site.md` (NavSection reference updated from site-local to DS primitive).
  - **Not affected:** blog-template, case-study agent, skill MDs, site-bootstrap (the bootstrap's inline shell doesn't use nav-section yet; it gets swapped for the real primitive when v1 step 24 lands).

**Session lock 2026-04-17-rev4 (post-getting-started) — EXTENDS the IA from rev2:**

- **Primeros pasos added as the 7th top-level section — LOCKED 2026-04-17-rev4.** Position: second in the sidebar, right after Design at Coherence. Rationale: Wise / Stripe / Linear all place a Get-started ramp directly after Home; it's the first real destination after a welcome page.

  **Seven top-level sections (supersedes the 2026-04-17-rev2 six-section IA):**
  1. Design at Coherence (`/`)
  2. **Primeros pasos** (`/primeros-pasos`) ← NEW
  3. Foundations (`/fundamentos`)
  4. Components (`/componentes`)
  5. Patterns (`/patrones`)
  6. Resources (`/recursos`)
  7. Blog (`/blog`)

- **Primeros pasos sub-routes — LOCKED 2026-04-17-rev4.** Five practical workflow pages plus a landing:

  | Route | Page title | Content source |
  |---|---|---|
  | `/primeros-pasos` | Primeros pasos | Wise-style landing with teaser cards per sub-page |
  | `/primeros-pasos/nuevo-proyecto` | Iniciar un proyecto | How to run `docs/brief-template.md` (plan-one agent) — step-by-step |
  | `/primeros-pasos/nueva-marca` | Crear una marca nueva | Brand manifest shape + required fields + minimal-access fallback |
  | `/primeros-pasos/clonar-producto` | Clonar un producto o cambiar su marca | Fork an existing product repo + point to a different brand manifest (the white-label moment) |
  | `/primeros-pasos/git-ramas` | Ramas de Git: crear, enviar, eliminar | Renders `docs/git-cheatsheet.md` sections; practical commands with explanations |
  | `/primeros-pasos/actualizar-ds` | Actualizar el DS en tu proyecto | How to pull the latest Coherence into a consumer product (tokens + primitives) |

- **Content-vs-primitive distinction — LOCKED 2026-04-17-rev4.** Primeros pasos pages are **content pages**, not primitive detail pages. They don't use the `coherence-primitive-page.md` template (playground / tokens table / tabs). They use a simpler prose-plus-command-blocks template. No new build prompt required — Builder authors these pages directly, consuming the existing workflow MDs (`brief-template.md`, `git-cheatsheet.md`) via the `md-excerpt.ts` utility for reusable sections.

- **No primitive-count change.** v1 count stays at 20. Primeros pasos is pure documentation — no new `libs/ui/*` primitives needed.

- **Build-order position — LOCKED 2026-04-17-rev4.** Primeros pasos lands with v1 step 24 (Site full IA), not earlier. It's content on the site; the site's shell + page template need to exist first. An early `apps/site/src/app/pages/primeros-pasos/` folder can be scaffolded alongside Components during step 24 work.

- **Nav behavior — LOCKED 2026-04-17-rev4.** Primeros pasos is a `<afi-nav-section>` in the sidebar (like Foundations, Components, Patterns, Resources, Blog). Its landing page `/primeros-pasos` is reachable via clicking the section label; the chevron toggles expand/collapse showing the 5 sub-pages. Auto-expands when the active route is inside.

- **File-artifact deltas — LOCKED 2026-04-17-rev4:**
  - **Updated:** `docs/build-prompts/coherence-site.md` — Site IA tree, sidebar nav template, file structure, copy section all gain Primeros pasos.
  - **Not affected:** primitive build prompts, shell build prompt, tokens build prompt, skill MDs, blog template, case-study agent, site bootstrap (bootstrap stays minimal; Primeros pasos arrives with the full site at v1 step 24).

**Session lock 2026-04-17-rev5 (post-primitive-page-refresh + nav-section-tree-lines) — BUNDLES visual calibration from Animate UI + Radix Files into the nav family and the primitive-page template:**

- **Primitive-page layout refresh — LOCKED 2026-04-17-rev5.** Calibration: Animate UI Files doc page (`animate-ui.com/docs/components/files`), adjusted to Coherence's operator register. Supersedes the earlier 4-tab layout from the first `coherence-primitive-page.md` draft.

  **Structure:**
  - Page header + kicker (`COMPONENTS`, quiet action-700) + title (serif) + subtitle + author (`Made by · AFI design team`).
  - **Actions row** — three operator actions: `Edit on GitHub` · `Copy Markdown` · `Descargar prompt ▾` (dropdown with build prompt + component-skill + accessibility MDs).
  - **Two page-level tabs: Code / Design.** Engineer view vs. designer view of the same primitive. Uses `<afi-tabs variant="secondary">` (underline-on-active).
  - **Code tab:** Playground (nested Preview/Code toggle + right-rail controls) → `## Importar` → `## Uso` (Cuándo usar / NO usar / Composiciones / Ejemplo real) → `## API Reference` (Entradas + Salidas tables with row-expand live micro-examples).
  - **Design tab:** `## Tokens consumidos` (<afi-tokens-table>) → `## Accesibilidad` (Reglas / Mapa de teclado / SR demo) → `## Motion` → `## Do & Don't` (paired live primitives).
  - **Right-rail "On this page" TOC** — always visible, auto-generated from H2s of the active tab, `IntersectionObserver` scroll-spy, smooth-scroll on click (instant under reduced-motion). Landmark: `<aside role="complementary" aria-label="Índice de la página">`.
  - **Mobile (<md):** controls panel collapses to a `Configurar` BottomSheet button; TOC collapses to an `Índice` BottomSheet button.

- **Five site-local components (was 3) — LOCKED 2026-04-17-rev5:** `doc-page-layout` (new, shell) · `component-playground` (refreshed — controls moved to right, nested Preview/Code inside the panel) · `tokens-table` (unchanged) · `code-block` (renamed from earlier `code-toggle`; stand-alone syntax-highlighted block with Copy) · `toc` (new, right-rail "En esta página"). All in `apps/site/src/app/components/`.

- **Tree-line visual treatment on NavSection — LOCKED 2026-04-17-rev5.** Calibration: Radix Files + Animate UI Files component. Three pieces, all Tier 1 CSS:
  1. **Connecting lines** — `::before` pseudo-elements: vertical guide on children container, horizontal stubs per child. Default: `border-hairline`.
  2. **Hover/focus trail** — path from parent to hovered/focused child tints from `border-hairline` → `border-action-300`. Implemented via linear-gradient on the vertical guide anchored by a `--trail-end-y` CSS custom property; horizontal stub color-swaps via `data-hovered` attribute.
  3. **"You are here" marker** — 2×16px rounded bar, `action-500`, overlays the vertical guide at hovered/focused child's Y-center. `transition: top 200ms var(--easing-enter)` slides it between items. Opacity 0 when nothing hovered/focused.

  New NavSection input: `showTreeLines` (default `true`). Set false for flat lists. Pseudo-elements + marker are `aria-hidden="true"` — the hierarchy's semantic announcement comes from the existing `role="group"` + `aria-expanded` wiring. Reduced motion: all transitions collapse.

- **Menu hover micro-animation — LOCKED 2026-04-17-rev5.** On `hover` / `focus-visible` of a MenuItem, the leading icon shifts right by 2px (`transform: translateX(2px)`) via 120ms `easing-enter` transition paired with the `bg-surface-muted` color transition. Subtle "lean-in" gesture. Reduced motion disables the translation; bg transition stays for state communication.

- **Calibration anchors updated — LOCKED 2026-04-17-rev5.** The reference set for the **nav family** + **primitive-page template** now includes:
  - **Animate UI Files** (`animate-ui.com/docs/components/files`) — docs-page layout, tree-line treatment
  - **Radix Files / Radix Primitives** — connecting-lines pattern, hover feel
  - **Granola** (prior) — workspace hierarchy + `⋮` menus
  - **Linear** (prior) — persistent sidebar + quiet chrome
  
  Any new nav-family or primitive-page work triangulates against these four.

- **File-artifact deltas — LOCKED 2026-04-17-rev5:**
  - **Fully rewritten:** `docs/build-prompts/coherence-primitive-page.md` (two-tab Code/Design layout, right-rail controls + TOC, actions row, five site-local components specced).
  - **Updated:** `docs/build-prompts/coherence-nav-section.md` (new "Tree-line visual treatment" section with connecting lines + hover trail + sliding marker + `showTreeLines` input).
  - **Updated:** `docs/build-prompts/coherence-menu.md` (MenuItem behavior gains the hover icon lean-in, item 6).
  - **Not affected:** primitive build prompts (button, input, etc.), shell build prompt, tokens build prompt, site bootstrap (bootstrap stays minimal; refreshed primitive-page layout lands when detail pages do, v1 step 24).

**Session lock 2026-04-17-rev6 (post-kbd + token-page) — ADDS primitive #21 and a new page template for semantic color tokens:**

- **`<afi-kbd>` added to v1 — primitive #21 — LOCKED 2026-04-17-rev6.** Visual keycap for keyboard shortcuts. Display-only atom; no interaction. Used inside `<afi-menu-item>` shortcut slot (already referenced), site-level search triggers (the `⌘ K` pattern), and every primitive page's `Mapa de teclado` sub-section. Small (~40-line) primitive. Spanish key-name glossary locked for auto-generated `aria-label` (⌘ → Comando, ⇧ → Mayús, ↵ → Intro, etc.). v1 count 20 → 21. Build prompt: `docs/build-prompts/coherence-kbd.md`.

  **Build order placement:** insert after Status-chip (step 20), before Shell (step 21 in rev3, renumbered to 22):
  ```
  …
  19. Page-header
  20. Status-chip
  21. Kbd                         ← NEW
  22. Shell (was 21)
  23. Auth shell + login form (was 22)
  24. Charts (was 23)
  25. Site full IA (was 24)
  ```

- **Token-detail page template — LOCKED 2026-04-17-rev6.** New site-local template for semantic color tokens. Sibling to the primitive-page template; shares `<afi-doc-page-layout>` + right-rail TOC + actions row. Calibration: Animate UI Preview/Code layout + Stripe parameter-bar chips (user's screenshot).

  **Page structure:**
  - Page header (breadcrumb + kicker + title = token name + one-line usage summary + actions row)
  - **Bucket tabs** at the top: `Canvas · Surface · Action · Control · System · Status · Border · Data-viz` (page-level `<afi-tabs>`)
  - **`## Resumen`** — color preview band (foreground text rendered in `{fg-token}` over `{bg-token}`) + contrast badge (AAA/AA/Fail + ratio) + meta table (Rol / Hex / HSL / Marca / Contraste)
  - **`## Instancias`** — Stripe-style filter bar (`<afi-filter-chip>` × N + `+ Añadir` + `⚙ Más`) → filtered list of primitive usages
  - **`## Ajuste de marca`** — how to swap this token in a brand manifest
  - **`## Reglas de accesibilidad`** — contrast rules + do/don't usage
  - Right-rail TOC mirrors these H2s

  **Routes:**
  - `/fundamentos/color` — Wise-style editorial landing with bucket teaser grid (NOT this template)
  - `/fundamentos/color/{bucket}` — redirects to first token in bucket
  - `/fundamentos/color/{bucket}/{tokenName}` — canonical token detail (this template)

- **Four new site-local components — LOCKED 2026-04-17-rev6:**
  - `<afi-token-page-layout>` — page shell sibling to `<afi-doc-page-layout>`
  - `<afi-contrast-badge>` — AAA/AA/Fail grade + ratio; computes WCAG luminance at runtime via `getComputedStyle`
  - `<afi-filter-chip>` — single Stripe-style filter criterion (`⊗ Dimension | Value ▾`)
  - `<afi-filter-bar>` — container for chips + `+ Añadir` + `⚙ Más`
  
  Site-local component count grows: 5 (rev5) → 9 (rev6). All live under `apps/site/src/app/components/`.

- **Token-instance registry — LOCKED 2026-04-17-rev6.** Data shape: `{ [tokenName]: TokenInstance[] }` where `TokenInstance = { primitive, variant?, state?, purpose, sourceFile }`. **v1 maintenance = hand-maintained**; each primitive's `variants.ts` exports a `tokenUsage` constant and `token-registry.ts` aggregates. **v1.1 = build-time scanner** that parses `libs/ui/**/*.variants.ts` for `var(--{token})` references and auto-generates. Ship the interaction model in v1; iterate the data source in v1.1.

- **WCAG contrast math lives in site-local `contrast.ts` — LOCKED 2026-04-17-rev6.** Standard relative-luminance formula; ~30 lines. No `chroma-js` / no npm package. `<afi-contrast-badge>` consumes it.

- **Extension path for other token families — RESERVED 2026-04-17-rev6.** The template is built for Color in v1 but designed to generalize. Typography token pages (`/fundamentos/tipografia/{role}`), Space (`/fundamentos/espacio/{size}`), Motion (`/fundamentos/movimiento/{duration}`) reuse `<afi-token-page-layout>` with domain-appropriate preview bands (type specimen instead of color preview, spacing rhythm instead of contrast, etc.). Deferred to v1.1+; pattern locked.

- **File-artifact deltas — LOCKED 2026-04-17-rev6:**
  - **New:** `docs/build-prompts/coherence-kbd.md` (primitive #21).
  - **New:** `docs/build-prompts/coherence-token-page.md` (page template + 4 site-local components + registry shape).
  - **Updated:** `docs/build-prompts/coherence-site.md` (IA tree adds `/fundamentos/color/{bucket}/{tokenName}` dynamic route; file structure gains `apps/site/src/app/data/token-registry.ts` + the four new site-local components).
  - **Not affected:** primitive build prompts (except Menu + NavSection already updated in rev5), shell build prompt, tokens build prompt, site bootstrap.

**Session lock 2026-04-17-rev7 (post-radio + tooltip) — ADDS primitives #22 and #23 + one new motion token:**

- **`<afi-radio-group>` + `<afi-radio>` — primitive #22 — LOCKED 2026-04-17-rev7.** One-of-N selection form control. Sibling of Checkbox (binary), Switch (binary with bias), Select (one-of-N in a dropdown). Radio is for when all options are visible inline — 2–5 options typically. Calibration: Animate UI base radio with scale-in dot, translated to Tier 1 CSS. Build prompt: `docs/build-prompts/coherence-radio.md`.

- **`<afi-tooltip>` + `[afiTooltip]` directive + `TooltipService` — primitive #23 — LOCKED 2026-04-17-rev7.** Supplementary text/content on hover or focus. CDK Overlay-based. Two forms: directive (sugar, 90 % of uses) + component (rich content). Made explicit — was an **implicit v1 dependency** of Sidebar's collapsed-mode NavItem tooltip (declared in `coherence-sidebar.md` but never broken into its own primitive). `followCursor` input reserved for v1.1 (accepted, no-op in v1). Build prompt: `docs/build-prompts/coherence-tooltip.md`.

- **`easing-spring-soft` motion token — LOCKED 2026-04-17-rev7.** New Motion-bucket token: `cubic-bezier(0.34, 1.56, 0.64, 1)` — small overshoot (~108% peak, settles to 100%). Reserved for **small state-change affordances** where a tiny "pop" signals life without being showy: radio dot scale-in, checkbox tick scale-in, switch thumb arriving, similar micro-acknowledgements. NOT for enter/exit of overlays, hover/press state color transitions, or any choreography longer than ~150ms. Use `easing-enter` for everything else per the 2026-04-16 motion discipline lock.

- **v1 primitive count 21 → 23 — LOCKED 2026-04-17-rev7.** Build order insertions:

  ```
  7. Checkbox
  8. Switch
  9. Radio                        ← NEW (rev7) — after Switch, before LoadingOverlay
  10. LoadingOverlay + Badge (was 9)
  11. Card (was 10)
  12. Tabs (was 11)
  13. Modal (was 12)
  14. Drawer (was 13)
  15. Select (was 14)
  16. Sidebar + NavItem (was 15)
  17. Tooltip                     ← NEW (rev7) — right after Sidebar+NavItem because Sidebar depends on it
  18. NavSection (was 16)
  19. Menu + MenuItem + Divider (was 17)
  20. Table (was 18)
  21. Page-header (was 19)
  22. Status-chip (was 20)
  23. Kbd (was 21)
  24. Shell (was 22)
  25. Auth shell + login form (was 23)
  26. Charts (was 24)
  27. Site full IA (was 25)
  ```

  Sidebar already references `CDK-Overlay tooltip` in its spec; that reference is being updated to `<afi-tooltip>` explicitly so Sidebar's collapsed-mode NavItem is a Tooltip consumer, not a CDK-primitive wrapper. Tooltip inserted right after Sidebar+NavItem so it lands before NavSection (which also uses tooltips on trailing-action buttons).

- **Scope discipline statement — 2026-04-17-rev7.** Coherence v1 is now **23 primitives + 5 shells + 4 chart primitives**. Compare: shadcn ~40 components, Radix ~25 primitives. Coherence sits squarely in "small, tight, complete." Any further additions between now and v1 ship must meet: **(a) declared dependency of an already-shipped primitive, OR (b) real v1 surface need named by a consumer product (AWM)**. No speculative adds. This sentence is the gate Planner enforces.

- **File-artifact deltas — LOCKED 2026-04-17-rev7:**
  - **New:** `docs/build-prompts/coherence-radio.md` (primitive #22).
  - **New:** `docs/build-prompts/coherence-tooltip.md` (primitive #23).
  - **Updated:** `docs/build-prompts/coherence-tokens.md` (add `easing-spring-soft` to the motion bucket).
  - **Updated:** `docs/build-prompts/coherence-sidebar.md` (replace "CDK-Overlay tooltip" with `<afi-tooltip>` reference).
  - **Not affected:** any already-shipped primitive, site bootstrap, skill MDs.

**Session lock 2026-04-17-rev8 (post-card-pattern-catalog) — DOCUMENTATION-ONLY expansion:**

- **Card pattern catalog — 10 patterns — LOCKED 2026-04-17-rev8.** Not new primitives. Documented compositions of the existing `<afi-card>` primitive + other primitives, each surfaced at `/patrones/tarjetas/{slug}` on the site. Reading the references (Quantec / finance dashboards / glassmorphism / Pinterest list) through a **content-structure lens** — borrowing content variants, NOT visual treatments:

  | # | Pattern | Content structure | Typical AWM surface |
  |---|---|---|---|
  | 1 | **Métrica** | Number + label + optional trend chip | KPI rows on Propuestas detail, Diagnóstico |
  | 2 | **Gráfico** | Title + current value + chart body + optional range tabs | EvolucionChart, CashflowChart |
  | 3 | **Fila de lista** | Thumbnail/avatar + title + 1–2 meta lines + optional trailing action | Clientes list, Propuestas list, Carteras list |
  | 4 | **Acción** | Short prose + primary CTA | Onboarding callouts, upgrade prompts |
  | 5 | **Entidad** | Visual representation of a business object + key facts | Cartera card, Cliente card, Propuesta resumen |
  | 6 | **Lista de indicadores** | Rows with inline sparkline or bar per item | Portfolio holdings, watchlist, asset allocation row |
  | 7 | **Composición** | Donut + legend with percentages + deltas | Asset allocation, risk distribution |
  | 8 | **Convertidor** | Input → transform → output + CTA | Moneda, divisa, scenario converter |
  | 9 | **Estado** | Status label + optional confirmation visual | Propuesta estado resumen, transacción estado |
  | 10 | **Editorial** | Kicker + big serif title + decorative flourish | Blog cards, case study previews, Primeros pasos teasers, onboarding hero — **NOT AWM operator screens** |

- **Brand register rules that apply to every pattern — LOCKED 2026-04-17-rev8:**
  - Radius: `radius-sm` (4px) or `radius-md`. Never heavily-rounded (16 px+) — that's glassmorphism/marketing-card territory.
  - Surfaces: `surface-base` / `surface-elevated` / `surface-quiet` only. No glass, no saturated gradient fills, no photographic backgrounds.
  - Elevation: hairline border OR `shadow-sm`, never both (surface-ladder rule from rev2).
  - Typography: AWM-structured scale. Display metrics in Roboto Serif; UI text in Roboto.
  - Motion: Tier 1 CSS per the 2026-04-16 motion discipline. Trend chips reuse `easing-spring-soft` (rev7) on value change.
  - Operator register: no emoji, no hashtag footers, no Quantec-style topographic decorations.

- **Editorial pattern — decorative-flourish exception — LOCKED 2026-04-17-rev8.** Pattern #10 (Editorial) is the **only** card pattern that may carry decorative motion / illustration / generous serif scale. Its use is gated by the motion-context rule from 2026-04-16: Editorial cards render on the DS site (Blog, Primeros pasos teasers, case-study previews) and on marketing surfaces (when Marketing ships in v1.1+). They **do NOT render inside AWM operator views** — Propuestas detail, Diagnóstico, Carteras lists, etc. all stay in the quiet-operator register.

- **Non-goals explicitly rejected — LOCKED 2026-04-17-rev8:**
  - Glassmorphism card treatment (frosted glass, saturated gradients, low contrast).
  - Heavily-rounded corners (16 px+).
  - Quantec-style marketing poster vocabulary (hashtag footers, topographic abstract shapes, bold color blocks as card fills).
  - Decorative motion inside AWM operator views.
  - Shimmer or continuous motion on any card in a consumer product (rev-unnumbered from the earlier Shimmer/Ripple conversation — formalized here).

- **v1 primitive count unchanged.** Still 23. Card pattern catalog is documentation, not primitives.

- **Shipping plan — LOCKED 2026-04-17-rev8.** All ten patterns documented at **v1 step 27 (Site full IA)**. Each pattern page uses the standard primitive-page template (Code tab: playground + Uso + API Reference; Design tab: tokens + a11y + motion + do/don't). Examples use AWM-flavored data (real `propuesta` slugs, `cartera` names, `translate` pipe) — not `lorem ipsum`.

- **`<afi-card>` primitive unchanged — LOCKED 2026-04-17-rev8.** The base primitive stays unopinionated: surface + optional border + slots. The richness lives in the pattern catalog, not in bloating the primitive. Bottom of `docs/build-prompts/coherence-card.md` gains one line pointing at `/patrones/tarjetas/` for the documented compositions.

- **File-artifact deltas — LOCKED 2026-04-17-rev8:**
  - **Updated:** `docs/build-prompts/coherence-site.md` — IA tree, sidebar nav, file structure, and copy all gain `/patrones/tarjetas/` + ten sub-routes.
  - **Updated:** `docs/build-prompts/coherence-card.md` — one-line pointer to the pattern catalog at the bottom.
  - **Not affected:** any primitive build prompt (including Card's core spec), token file, skill MDs, agent harnesses, bootstrap. The catalog is composition documentation.

**Session lock 2026-04-17-rev9 (post-tabs-sliding-indicator) — ADDS variants + motion to an existing primitive:**

- **`<afi-tabs>` gains three variants + sliding indicator + content crossfade — LOCKED 2026-04-17-rev9.** Calibration: Animate UI `<Tabs>` sliding-indicator + content-crossfade pattern, translated to Tier 1 CSS + Angular signals. No Framer / Motion One.

  **Variants:**
  - **`underline`** (default) — page-level Code/Design tabs, in-page section nav. Active indicator = 2 px `action-500` bar at the bottom hairline.
  - **`pill`** — **Preview/Code toggle inside `<afi-component-playground>`**. Segmented-control visual: list on `surface-quiet`, active pill on `surface-base` + `shadow-sm`.
  - **`subtle`** — no moving indicator; active state = font-weight shift + `canvas-fg` color. Reserved for dense contexts (future).

  **Mechanism:** one absolutely-positioned `<span aria-hidden="true">` inside `<afi-tabs-list>` with `transform: translateX(var(--indicator-x))` + `width: var(--indicator-w)` driven by signals. Each `<afi-tab>` calls `updateIndicator(activeEl)` on mount and on activation; the method measures the trigger's rect and writes the two signals. CSS `transition: transform, width 220ms var(--easing-enter)` handles the slide.

  **Content panel crossfade:** 150 ms opacity + 4 px `translateY(4px → 0)` via `easing-enter`. Under `prefers-reduced-motion: reduce`, the indicator still repositions (state communication preserved) but instantly; content crossfade collapses to 80 ms linear opacity fade with no transform.

  **`ResizeObserver`** on the active trigger catches badge updates or content reflow that would change indicator width; debounced viewport-resize listener catches layout shifts. Never measure on every frame.

- **Variant assignments — LOCKED 2026-04-17-rev9:**
  - Every primitive page's top Code/Design tabs: `underline`.
  - `<afi-component-playground>` Preview/Code sub-toggle: `pill` (hardcoded inside that site-local component; consumers don't pick).
  - Subtle: reserved for v1.1+ dense contexts.

- **No primitive count change, no new site-local components.** The variants extend the existing `<afi-tabs>` API; `<afi-component-playground>` consumes the `pill` variant instead of hand-rolling its own toggle.

- **File-artifact deltas — LOCKED 2026-04-17-rev9:**
  - **Updated:** `docs/build-prompts/coherence-tabs.md` — new section "Variants + sliding indicator" with full CSS spec, per-variant rules, content crossfade, reduced-motion handling, ResizeObserver pattern.
  - **Updated:** `docs/build-prompts/coherence-primitive-page.md` — `<afi-component-playground>` section now explicitly calls out `variant="pill"` for the Preview/Code toggle and `variant="underline"` for the page-level tabs, pointing at the Tabs spec for implementation details.
  - **Not affected:** any other primitive build prompt, site bootstrap, skill MDs.

**Session lock 2026-04-17-rev10 (post-primitive-color-restructure) — SUPERSEDES the 2026-04-16 color scale locks (Neutral 11-step / Action Azul-Afi / Success / Error / Warning) at the primitive layer. The semantic layer aliases reorganize accordingly. Downstream primitive code (Button, etc.) needs no changes because semantic tokens stay stable.**

- **Five primitive color scales — LOCKED 2026-04-17-rev10.** Source of truth: Token Studio (Figma) hand-tuned by the user. Every scale has steps `0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900` (neutral also has `950`).

  | Scale | Role | Anchor pin |
  |---|---|---|
  | `color.primary`     | Azul Afi (bright brand blue)    | 500 = `#0085CA` |
  | `color.secondary`   | Azul profundo (deep dark blue)  | 500 = `#062D3F` |
  | `color.tertiary`    | Gris Afi (blue-tinted neutral)  | 300 = `#C8DAE2` |
  | `color.neutral`     | Cool gray (UI general)          | — |
  | `color.neutral-alt` | Warm gray (**controls only**)   | — |
  | System red / green / amber (unchanged from 2026-04-16) | error / success / warning | AFI anchors preserved |

  See `docs/build-prompts/coherence-tokens.md` §"Primitive color scales" for per-step hex tables.

- **Semantic-to-primitive alias reorganization — LOCKED 2026-04-17-rev10:**
  - `canvas.base` → `color.neutral.0` (white)
  - `canvas.fg` → `color.neutral.900`
  - `canvas.fg-muted` → `color.neutral.500`
  - `canvas.fg-on-action` → `color.neutral.0` (white on Azul profundo — AAA contrast)
  - `surface.base` → `color.neutral.0`
  - `surface.quiet` → `color.neutral.50` (was hand-tuned HSL in rev2; now sourced from the scale)
  - `surface.muted` → `color.neutral.100`
  - `surface.elevated` → `color.neutral.0` + shadow
  - `surface.overlay` → `hsla(215, 25%, 15%, 0.55)` (unchanged; close to neutral.950 @ 55%)
  - **`action.*` → `color.secondary.*` (Azul profundo)** — Primary button, focus ring, primary CTAs. Previously action aliased to the old "Action Azul-Afi scale"; now it aliases to the secondary scale natively. This replaces the rev7 brand-manifest override.
  - **`accent.*` → `color.primary.*` (Azul Afi)** — NEW semantic bucket. For links, data-viz primary series, small attention moments where lift without weight is wanted. Distinct from `action` (deep authority).
  - **`control-neutral.*` → `color.neutral-alt.*`** — NEW per-role semantic tokens for form controls (inputs, checkboxes, switches, selects). Uses the warm-gray scale.
  - `border.hairline` → `color.neutral.200` (default). Consumers may use `color.tertiary.200` inline for a brand-flavored divider.
  - `border.focus` → `action.500` (= `secondary.500` = Azul profundo)
  - `status.*` — unchanged (already aliases to system + neutral)
  - `system.error.* / success.* / warning.* / info.*` — primitive scales unchanged; info aliases to `color.primary.*` (Azul Afi also serves as info hue)

- **AFI brand manifest simplifies — LOCKED 2026-04-17-rev10.** The rev7 action-scale override (`500/600/700 → #062D3F/#052636/#031C28`) is **removed**. No longer needed — the semantic `action.*` bucket aliases to `color.secondary.*` at the token layer, so Primary button renders in Azul profundo natively. `afiBrand.action = {}` (falls through to semantic default). Other brands may override in their own manifest.

- **Tailwind config colors expanded — LOCKED 2026-04-17-rev10.** Exposes all five primitive scales as utility classes (`bg-primary-500`, `bg-secondary-500`, `bg-tertiary-300`, `bg-neutral-*`, `bg-neutral-alt-*`), the new `accent` semantic (`text-accent-600`), the new `control-neutral.*` semantic tokens. See `docs/build-prompts/coherence-tokens.md` §"Tailwind theme extension" for the authoritative block.

- **Non-goals / explicit rejections — LOCKED 2026-04-17-rev10:**
  - The 2026-04-16 Action scale tables in this plan (Azul-Afi-anchored) are **superseded**. Retained above as historical record; Builder reads the tables in `coherence-tokens.md` as authoritative.
  - No more manual per-step hex overrides in the AFI brand manifest. Manifest overrides are a brand-swap feature, not a brand-calibration one.

- **Downstream impact — LOCKED 2026-04-17-rev10:**
  - **Button (shipped)** — no code change. `bg-action-500` now resolves to Azul profundo via the new alias chain.
  - **All primitives in queue** — use semantic tokens (`bg-action`, `bg-surface-quiet`, `text-canvas-fg`, `text-canvas-fg-muted`, `border-control-neutral-border`). Never reach for primitive scales directly unless documenting data-viz, charts, or special-case brand accents.
  - **Form controls** (Input, Checkbox, Switch, Select, Radio) — consume `control-neutral.*` semantic tokens. This is the big ergonomic win from neutral-alt: control chrome is its own visual family, distinct from general surfaces.
  - **Foundation color page** (`/fundamentos/color/*`) — rebuilds against the five-scale architecture when site full IA lands (v1 step 27). The token-detail template from rev6 already accommodates this; buckets are now: `primary` / `secondary` / `tertiary` / `neutral` / `neutral-alt` / `system` / `status`.

- **File-artifact deltas — LOCKED 2026-04-17-rev10:**
  - **Updated:** `docs/build-prompts/coherence-tokens.md` — primitive color section fully rewritten with five named scales + hex tables; semantic aliases updated to source from new scales; `afiBrand` manifest simplified (action override removed); Tailwind config colors block expanded with all five scales + `accent` + `control-neutral` semantic.
  - **Not affected:** any primitive build prompt, shell spec, site bootstrap, site IA spec, skill MDs, agent harnesses. All downstream consumption stays on semantic tokens; the restructure is below the semantic waterline.

**Session lock 2026-04-17-rev11 (post-token-studio-alignment) — EXTENDS rev10 with precise anchor annotations and data-viz palette family:**

- **AFI brand anchor pins — confirmed and precisely located 2026-04-17-rev11:**
  - `primary.500` = `#0085CA` = **AFI azul** (the bright brand blue)
  - `secondary.500` = `#062D3F` = **AFI azul profundo** (the deep dark blue; rationale: **Primary action chosen for accessibility** — ~15.7:1 contrast against white = AAA)
  - `tertiary.300` = `#C8DAE2` = **AFI grey** (Gris Afi)
  - **`neutral-alt.25` = `#FAFAFA` = AFI White** (CORRECTION to rev10: AFI White is NOT pure white / `neutral.0`. It's the warmer branded white at `neutral-alt.25`. Brand surfaces requesting "our white" should read `bg-neutral-alt-25`, not `bg-white`.)
  - Token Studio (Figma) is the authoritative source for every primitive hex; Style Dictionary emits from there.

- **Data-viz palette family — primitive-layer — LOCKED 2026-04-17-rev11.** Four distinct scales under `color.data-viz/*`, NOT aliased to system or brand:
  - `color.data-viz.mono` — multi-step monochrome for single-series charts + heatmaps
  - `color.data-viz.neut` — neutral comparison scale for multi-series charts
  - `color.data-viz.posi` — positive / gain register (brand-tuned green)
  - `color.data-viz.nega` — negative / loss register (brand-tuned red)

  **Rationale:** data-viz semantics ≠ UI-feedback semantics. A red bar showing Q2 loss is `data-viz.nega.500` (numeric "below zero"); a red toast saying "upload failed" is `system.error.500` (actionable failure). Different jobs, different tokens. Conflating them muddies both.

  **Downstream:** the data-viz skill (`docs/data-viz-skill.md`) already references `data-positive` / `data-negative` semantic tokens — those now alias the rev11 primitive palettes. Chart primitives (bar / line / heatmap / dumbbell, v1 step 26) consume via these semantics. No primitive change.

- **File-artifact deltas — LOCKED 2026-04-17-rev11:**
  - **Updated:** `docs/build-prompts/coherence-tokens.md` — AFI White pin annotation added to `neutral-alt.25`; new "Primitive color — data-viz palettes" section documenting the four scales.
  - **Not affected:** any primitive build prompt, semantic layer (it references data-viz tokens by role, not by value), site spec, data-viz skill, agent harnesses.

**Out of v1 scope:** everything else. Deferred items (NOT cut) are priority-ordered in the Roadmap section below.

---

## Exploration findings (read-only pass on disk)

**Coherence repo (build target for v1):** `/Users/richardgriner/Desktop/Coherence/Coherence` — **fresh git init, README only.** Truly greenfield. Ready for scaffolding. **LOCKED 2026-04-16:** this path is the canonical Coherence repo. The existing `afi-ui/` becomes a read-only reference we may cherry-pick from (ai-docs MDs, brand guidelines) — no direct migration, no continuation in place. Rationale: the locked visual identity (Figma + Granola/Roboto Serif + Wise + Linear) post-dates all afi-ui work, and the user's stated intent is "building from scratch now."

**Existing related work discovered — `/Users/richardgriner/Desktop/Afi/Afi coherence`:** a *mature* Angular design system **workspace** (not a single repo). Verified structure:
- `afi-ui/` ← **the actual git repo** (confirmed: `.git/HEAD` only lives here). Angular app with `src/main.ts`, `src/app/app.routes.ts`, full `node_modules`, `tsconfig*.json`, `.vscode/` configs.
- `tokens/` *(workspace-level, outside the repo)* — `foundations/primitive/` (colors, typography, elevation, numbers JSON), `foundations/semantic/` (colors, typography, dimensions JSON), `components.json`, `index.ts`, `test-tokens.ts`, `foundations-raw.json`.
- `src/components/button/` *(workspace-level)* — standalone `button.component.ts/html/scss` + `index.ts`. Lives outside `afi-ui/`, so it is not currently part of the compiled library.
- `src/styles/tokens.css` *(workspace-level)* — generated CSS tokens.
- `ai-docs/` *(workspace-level)* — real MDs: `content/spanish-language-guidelines.md`, `content/data-formatting-guidelines.md`, `agents/agents-backend.md`, `agents/agents-ef.md`, `design-system/brand-guidelines.md`, `design-system/css-variable-generation.md`, `design-system/styling-guidelines.md`.
- 12+ git commits of active development inside `afi-ui/`.
→ **Reconciliation RESOLVED 2026-04-16 (clean rebuild).** `afi-ui/` is a read-only reference; we cherry-pick from `ai-docs/` and brand MDs only when we actively want them. No migration of code or tokens — v1 starts from the locked visual identity, which post-dates all afi-ui work.

**Confirmed workspace layout (2026-04-16, user-screenshot-verified):** `/Users/richardgriner/Desktop/Coherence/` is the **workspace** (not a repo). Its contents:
- `Coherence/` — **the actual git repo** (fresh; README only; build target for v1).
- `Afi brand/` — AFI brand assets, sitting as a **sibling** of the repo, intentionally outside it. User framing: "it doesn't need to be inside the other coherence folder; the folder inside is our repo."

**AFI brand assets — `/Users/richardgriner/Desktop/Coherence/Afi brand/`.** Contents:
- `logos/` — `afi_positivo.svg`, `afi_negativo.svg`, `afi_color.svg`.
- `Manual Afi_2024-2025.pdf` — full brand manual.
- `Brand guide photos/` — color palette, abstract designs, layout variants, examples.
- `Logo screenshots/` — Elements, Incorrect / Correct uses, Brand architecture, Entities, Products and services.
→ **Architectural implication:** brand assets live *alongside* the repo in the workspace, not *inside* it. The white-label engine treats AFI as one brand among many (AFI / Santander / future clients); each brand is its own workspace-level folder pointed at by the DS via configuration. No brand is hard-coded into the repo. This is exactly the right structure for a white-label-first DS — the repo stays brand-agnostic; swapping brands means pointing at a different sibling folder.

**Client brand assets already on disk — `/Users/richardgriner/Desktop/Afi/Clients/Santander/Brand/`:** full Santander font families (Headline, Micro Text, Script, Condensed) in OTF / TTF / WOFF / WOFF2. Confirms that at least one live Wealth Planner client brand has its own typography (a hard counter to assumptions that white-labeling = swapping an accent color only). **The serif-swap slot is not hypothetical** — Santander ships its own Headline family; the token architecture must expose `font-brand-display` / `font-brand-text` as first-class swappable slots alongside accent color.

**Workspace-level files at `/Users/richardgriner/Desktop/Afi/`:** `AGENTs.md` (9.5 KB — AI-agent instructions for the workspace), `CLAUDE.md` (485 B — Claude instructions), `.env.example`, `.gitignore`, `Afi Products/` (Afi-Wealth-Manager.pdf), `system/` (purpose unknown from this pass).

**AFI-Marketing Wealth Planner brief** — `/Users/richardgriner/Desktop/Afi Design/afi-wealth-planner/docs/Borja_brief_primavera_2026.md`. Spring 2026 brief from Borja. Covers: family / patrimony management (family members, corporations with shareholding, taxation types — Patrimonial / Holding / SOCIMI), asset management (future assets w/ expected years, income-generating assets w/ frequency / amount / growth), goals (mandatory legacy + retirement, safety age, financial assets, retirement age), diagnostics (3-scenario evolution — optimistic / medium / pessimistic, legacy projections, coverage scenarios), action plans (liquidity optimization, asset allocation with risk profiles, auto-financing calcs), reporting (PDF w/ cover / ToC / current situation / objectives / diagnostics / action plan / conclusions / model-portfolio detail).

**AFI Wealth Planner product plan** — `/Users/richardgriner/Desktop/Afi Design/afi-wealth-planner/docs/plan.md` (25.6 KB). **9-screen map already defined:** Family → Patrimonio → Ingresos → Gastos → Objetivos → Diagnóstico → Estrategias → Plan de Acción → Conclusiones / Informe. Users: advisors at banks, asset managers, family offices, serving HNWI families. **Component inventory already listed:** BannerObjetivos, SociedadDialog, ActivoForm, DeudaForm, IngresoGastoForm, EtiquetaFuturo, EvolucionChart, CashflowChart, EscenarioTable, AssetAllocationChart. → *Ideal source for composed-flow-proof screen pick.*

**AFI Wealth Manager brief** — `/Users/richardgriner/Desktop/Afi/Afi Products/Afi-Wealth-Manager.pdf` (1.1 MB). B2B platform spec. Modules: User Control, Alerts, Client Management, Portfolio Management, Proposal Control, Configuration, Client Portal. Chart types in use: evolution line, position table, composition pie/donut, ESG scoring, correlation map, drawdown. Informs chart-component scope.

**Other docs to read when scoping architecture:** `/Users/richardgriner/Desktop/Afi Design/afi-wealth-planner/docs/tech-stack.md`, `decisions.md`, `plan.md`.

**"Variable showcase inspiration"** — `/Users/richardgriner/Desktop/Variable showcase inspiration/` — 2 screenshots (2026-03-26); loose token/variable references.

### Gaps — things the user mentioned that are NOT on disk

- **Design-system inspiration folder** with Homepage / components / foundations / blog / documentation subfolders + IA MDs. Not found. Lives elsewhere, or was planned but not yet created.
- **Morrisley / Meirisley** (AI design-system course) artifacts. Not found as files.

---

## Still to determine

### Resolved during plan mode (2026-04-16)
- ~~Reconciliation with existing `afi-ui/`~~ → **Clean rebuild** in `/Users/richardgriner/Desktop/Coherence/Coherence`; `afi-ui/` is read-only reference.
- ~~Composed-flow screen pick~~ → **Diagnóstico** (AFI-Marketing Wealth Planner).
- ~~UI sans font pairing~~ → **Roboto** (flat pair with Roboto Serif).
- ~~Table references~~ → **Notion + Stripe** (interactive, hover-rich, flexible columns).
- ~~Brief-template form~~ → **Agent prompt + questions** (the MD is itself a Claude system prompt).
- ~~White-label architecture~~ → **Minimal manifest + default fallback** (few required fields, many optional; partial-access friendly).

### Still open (strategy — resolve before or during build)
1. **Token values (primitive + semantic)** — co-defining in strategy now. 6 semantic buckets locked: Canvas / Surface / Action / Control-neutral / System (error/warning/success) / Data-viz. Base-4 spacing locked.

   **AFI palette sourced from `/Users/richardgriner/Desktop/Coherence/Afi brand/Brand guide photos/color pallet.png` (2026-04-16):**
   - Primary: Azul Afi `#0085CA` / Azul profundo `#062D3F` / Gris Afi `#C8DAE2` / Blanco Afi `#F3F3F3`
   - Data-viz anchors (priority-ordered): `#062D3F` → `#37BBF4` → `#C8DAE2` → `#F3F3F3`
   - Positive (gains): `#C6F3C6` → `#72C971` → `#367B35`
   - Negative (losses): `#EB5656` / `#EB8787`
   - **Gaps in manual:** no warning/caution color; no extended neutral scale (only 3 anchors)
   - **SVG-vs-manual discrepancy:** `afi_color.svg` uses `#007CBC`; manual says `#0085CA`. Manual is source of truth.

   **Neutral scale LOCKED 2026-04-16 — 11-step blue-tinted at hue 200°, shadcn/slate shape:**

   | Step | Hex | AFI anchor | Role |
   |---|---|---|---|
   | 50 | `#F6FAFC` | — | Lightest surface |
   | 100 | `#EEF3F7` | ≈ Blanco Afi | Canvas |
   | 200 | `#DDE8EF` | — | Subtle border / divider |
   | 300 | `#C8DAE2` | ⭐ **Gris Afi exact** | Default border, chip fill |
   | 400 | `#92AFBF` | — | Placeholder, disabled |
   | 500 | `#5D7D8F` | — | Muted secondary text |
   | 600 | `#405F72` | — | Body emphasis, icon |
   | 700 | `#294C5D` | — | Strong border |
   | 800 | `#163648` | — | Heading secondary |
   | 900 | `#062D3F` | ⭐ **Azul profundo exact** | Primary text |
   | 950 | `#031C28` | — | Overlays, extreme emphasis |

   Rationale: hue locked at 200° (AFI blue); AFI's Gris and Azul profundo are exact pins at 300/900; Blanco Afi's spiritual equivalent is step 100 (true `#F3F3F3` reserved as a brand-specific token if AFI ever needs a documentary-grade match). Dark mode = inverted scale — no new hue work needed. WCAG AA+ at standard text combinations.

   **Warning scale LOCKED 2026-04-16 — Amber (shadcn verbatim):**

   | Step | Hex | Role |
   |---|---|---|
   | 50 | `#FFFBEB` | Tint background |
   | 100 | `#FEF3C7` | Subtle surface |
   | 200 | `#FDE68A` | Border |
   | 300 | `#FCD34D` | Hover border |
   | 400 | `#FBBF24` | Icon secondary |
   | 500 | `#F59E0B` | **Primary — default warning** |
   | 600 | `#D97706` | Hover |
   | 700 | `#B45309` | Pressed, text on tint |
   | 800 | `#92400E` | Dark mode text |
   | 900 | `#78350F` | Deep emphasis |

   Rationale: AFI brand manual has no warning color; shadcn amber is the category-standard caution color and pairs cleanly with the blue-tinted neutrals without fighting them.

   **Action scale LOCKED 2026-04-16 — Azul Afi (both brand blues pinned):**

   | Step | Hex | AFI anchor | Role |
   |---|---|---|---|
   | 50 | `#F0F9FF` | — | Lightest tint |
   | 100 | `#D6EFFD` | — | Tint surface |
   | 200 | `#ADE0FC` | — | Subtle border |
   | 300 | `#74CDFA` | — | Hover border |
   | 400 | `#37BBF4` | ⭐ **Data-viz anchor 2 exact** | Secondary action, chart stroke |
   | 500 | `#0085CA` | ⭐ **Azul Afi exact** | **Primary — default action** |
   | 600 | `#006AA8` | — | Hover |
   | 700 | `#00548A` | — | Pressed |
   | 800 | `#003F68` | — | Dark mode emphasis |
   | 900 | `#002A4A` | — | Deep emphasis |

   Rationale: one scale absorbs both AFI brand blues — the primary (`#0085CA` at 500) and the data-viz blue (`#37BBF4` at 400). No scale split needed. Manual is the source of truth (not the `#007CBC` in `afi_color.svg`).

   **Success scale LOCKED 2026-04-16 — Green (3 AFI gain anchors pinned):**

   | Step | Hex | AFI anchor | Role |
   |---|---|---|---|
   | 50 | `#ECFCEC` | — | Tint background |
   | 100 | `#D3F8D1` | — | Subtle surface |
   | 200 | `#C6F3C6` | ⭐ **Gains-light exact** | Soft pill, tint border |
   | 300 | `#9FE49E` | — | Border |
   | 400 | `#72C971` | ⭐ **Gains-mid exact** | Icon, chart fill |
   | 500 | `#43B044` | — | **Primary — default success** |
   | 600 | `#38953A` | — | Hover |
   | 700 | `#367B35` | ⭐ **Gains-deep exact** | Pressed, text on tint |
   | 800 | `#266026` | — | Dark mode text |
   | 900 | `#153F15` | — | Deep emphasis |

   Rationale: AFI's three gain-green anchors preserved exactly (200 / 400 / 700). Primary at 500 generated to keep the scale monotonic.

   **Error scale LOCKED 2026-04-16 — Red (2 AFI loss anchors pinned):**

   | Step | Hex | AFI anchor | Role |
   |---|---|---|---|
   | 50 | `#FFEDED` | — | Tint background |
   | 100 | `#FDDADA` | — | Subtle surface |
   | 200 | `#F6B9B9` | — | Border |
   | 300 | `#EB8787` | ⭐ **Losses-light exact** | Soft pill, chart fill secondary |
   | 400 | `#EB5656` | ⭐ **Losses-mid exact** | Icon, chart fill primary |
   | 500 | `#E03838` | — | **Primary — default error** |
   | 600 | `#CE2525` | — | Hover |
   | 700 | `#AC1717` | — | Pressed, text on tint |
   | 800 | `#851212` | — | Dark mode text |
   | 900 | `#5E0C0C` | — | Deep emphasis |

   Rationale: AFI's two loss-red anchors preserved exactly (300 / 400). Primary at 500 darkened for contrast without drifting hue.

   **Dimensions LOCKED 2026-04-16 — primitive (base-4) + semantic (standard t-shirt names). Super-responsive + WCAG-accessible defaults.**

   **Primitive — `dim-*` (base-4 ladder, pixel-literal naming for self-documentation):**

   | Token | Value |
   |---|---|
   | `dim-0` | 0 |
   | `dim-4` | 4px |
   | `dim-8` | 8px |
   | `dim-12` | 12px |
   | `dim-16` | 16px |
   | `dim-20` | 20px |
   | `dim-24` | 24px |
   | `dim-32` | 32px |
   | `dim-40` | 40px |
   | `dim-48` | 48px |
   | `dim-56` | 56px |
   | `dim-64` | 64px |
   | `dim-80` | 80px |
   | `dim-96` | 96px |
   | `dim-128` | 128px |
   | `dim-160` | 160px |
   | `dim-192` | 192px |
   | `dim-256` | 256px |

   Rationale: base-4 throughout (no 14/18/22 half-steps). Pixel-literal names mean no mental math reading code (`dim-16` IS 16px). Semantic tokens below reference these.

   **Semantic — Spacing (`space-*`):**

   | Token | → Primitive | Use |
   |---|---|---|
   | `space-2xs` | `dim-4` | Tight inline gap (icon+label) |
   | `space-xs` | `dim-8` | Row item spacing, compact stack |
   | `space-sm` | `dim-12` | Input internal padding vertical |
   | `space-md` | `dim-16` | **Default** — card padding, form row gap |
   | `space-lg` | `dim-24` | Section spacing |
   | `space-xl` | `dim-32` | Page-level block spacing |
   | `space-2xl` | `dim-48` | Major section divide |
   | `space-3xl` | `dim-64` | Hero / landing page rhythm |

   **Semantic — Control height (`control-h-*`) — heights of interactive elements (buttons, inputs, selects):**

   | Token | → Primitive | Use | Accessibility |
   |---|---|---|---|
   | `control-h-sm` | `dim-32` | Dense tables, admin grids (desktop only) | Below WCAG AAA 44; restrict to desktop density contexts |
   | `control-h-md` | `dim-40` | **Default — desktop** | Desktop-visual-balanced |
   | `control-h-lg` | `dim-48` | **Default — mobile + default forms** | Meets WCAG AAA 44+ touch target |
   | `control-h-xl` | `dim-56` | Hero CTA |

   **Accessibility rule LOCKED:** below breakpoint `bp-sm` (640), all interactive controls auto-promote to minimum `control-h-lg` (48). Enforced in `component-skill.md` + verified by Tester agent. Same rule covers Checkbox / Switch / Radio hit areas.

   **Semantic — Icon size (`icon-*`):**

   | Token | → Primitive | Use |
   |---|---|---|
   | `icon-xs` | `dim-12` | Chip icons, inline tight |
   | `icon-sm` | `dim-16` | **Default** — buttons, inputs, table rows |
   | `icon-md` | `dim-20` | Emphasized (header icons, empty-state mini) |
   | `icon-lg` | `dim-24` | Primary nav icons, feature headers |

   **Semantic — Avatar size (`avatar-*`):**

   | Token | → Primitive | Use |
   |---|---|---|
   | `avatar-xs` | `dim-24` | Dense lists, comments |
   | `avatar-sm` | `dim-32` | Table rows |
   | `avatar-md` | `dim-40` | **Default** — headers, cards |
   | `avatar-lg` | `dim-48` | Profile cards |
   | `avatar-xl` | `dim-64` | Profile headers, modal headers |

   **Semantic — Radius (`radius-*`):**

   | Token | Value | Use |
   |---|---|---|
   | `radius-none` | 0 | Flat edges — tables, dense admin |
   | `radius-sm` | 4 | Chips, small badges |
   | `radius-md` | 8 | **Default** — buttons, inputs, cards, modals |
   | `radius-lg` | 12 | Panels, large surfaces |
   | `radius-xl` | 16 | Hero cards, marketing surfaces |
   | `radius-full` | 9999 | Pills, avatars, circular icon buttons |

   Rationale: all base-4 (no 2px / 6px half-steps). `radius-md: 8` is the shadcn default; confident, modern, not overly rounded.

   **Semantic — Border thickness (`border-*`) — THE ONLY base-4 exception:**

   | Token | Value | Use |
   |---|---|---|
   | `border-0` | 0 | No border |
   | `border-thin` | 1 | **Default** — hairline (inputs, cards, table dividers) |
   | `border-base` | 2 | Focus ring, emphasized states |
   | `border-thick` | 4 | Strong emphasis, selected state |

   Rationale: 1px hairline is a universal convention; breaking base-4 here is deliberate and well-trodden. Focus rings lock at `border-base: 2` paired with `action-500` for brand-consistent, WCAG-visible focus.

   **Semantic — Breakpoints (`bp-*`) — Tailwind-standard values, mobile-first:**

   | Token | Min-width | Target |
   |---|---|---|
   | (default) | 0 | Mobile portrait (no media query) |
   | `bp-sm` | 640 | Mobile landscape / small tablet |
   | `bp-md` | 768 | Tablet portrait |
   | `bp-lg` | 1024 | Laptop / tablet landscape |
   | `bp-xl` | 1280 | Desktop |
   | `bp-2xl` | 1536 | Large desktop |

   **Responsive rules LOCKED:** mobile-first (default = mobile styles, media queries add complexity up). IA-first — collapse menus, action bars, secondary nav to a "más opciones" (`…`) control below `bp-md`. Primary action always remains visible. Enforced via `component-skill.md`.

   **Semantic — Content max-width (`content-*`) — aligned with breakpoints for predictable reading widths:**

   | Token | Value | Use |
   |---|---|---|
   | `content-sm` | 640 | Narrow form / article |
   | `content-md` | 768 | **Default** — standard page content |
   | `content-lg` | 1024 | Wide dashboard |
   | `content-xl` | 1280 | Full-width tool / data view |
   | `content-2xl` | 1536 | Edge-to-edge dashboards |
   | `content-full` | 100% | Unbounded (hero sections, charts) |

   **Motion tooling tier LOCKED 2026-04-16 — tiered, token-driven, minimal dependency:**

   | Tier | Tool | Scope | Bundle |
   |---|---|---|---|
   | 1 | Pure CSS transitions + animations | Button / Input / Card / Tabs / Switch / hover / press / focus — 95% of primitives | 0 kb |
   | 2 | `@angular/animations` (built-in) | Modal / Drawer / Toast / route transitions / `*ngIf` enter-leave / list animations | Already in Angular |
   | 3 | **Motion One** (`motion`) — optional | Chart morphs, Diagnóstico composed-flow orchestration, any moment Tier 1/2 can't deliver | ~3 kb |
   | 4 | **Lottie** (`lottie-web`) — reserved | Empty-state illustrations, celebration moments (NOT v1) | ~60 kb — parked |
   | — | **Angular CDK** (`@angular/cdk`) | Focus trap, overlay positioning, keyboard nav — infrastructure for Modal/Drawer/Tabs | Standard Angular dep |

   **Rejected for Coherence:** GSAP (overkill + licensing friction for commercial white-label), Framer Motion (React-only), Anime.js (redundant with Motion One).

   **Rule LOCKED:** motion tokens (duration + easing) live in Tier 1 as CSS custom properties; `@angular/animations` configs READ from those CSS variables so a single token change updates both tiers simultaneously. Tier 3 is only allowed where Tier 1/2 demonstrably cannot deliver the effect — a 3 kb budget, not a default tool. `prefers-reduced-motion` respected via a single global CSS rule in Tier 1; Tier 2/3 must check the media query before animating.

   **Still to lock, in this order:**
   - Motion primitives (duration-fast/base/slow + easing-standard/enter/exit — NOW URGENT because first co-defined component will need them)
   - Semantic color mapping (Canvas → neutral-100, Surface → white, etc.)
   - Data-viz palette ordering for line/bar/donut
   - Type scale (Roboto Serif + Roboto sizes — font-size, line-height, weight pairs)
2. **5 agent MD contents** — ~~planner~~ *(live 2026-04-16 — session-harness shape over `docs/brief-template.md`, outputs to `docs/briefs/{client}-{slug}.md`)* / ds-token-guardian / builder / tester / case-study. Remaining four: co-define in strategy in that order (Guardian next — biggest unlock against the tokens-leapfrog pattern).
3. **Other MD contents** — component-skill, token-skill, accessibility, clean-code, build-kickoff, workflow (README), git-cheatsheet, onboarding, **`docs/copy-skill.md`** *(added 2026-04-16 — first triggered by AWM Sistema de Importación brief, all UI copy Spanish. **Dual-mode posture (LOCKED 2026-04-16):** agents operate in whatever language the team speaks (currently English with the DS owner), but **all output that reaches end users is RAE-perfect Spanish**. This applies to every agent that generates copy — Planner + Builder + Tester reviewing copy + any future copy-writing agent. Scope v1: Spanish following Real Academia Española (RAE) conventions — inverted punctuation ¿? ¡!, accents, imperative vs. infinitive for button labels, gender agreement, sentence-case vs. title-case rules, abbreviation conventions, common false-friends from English. Room to extend for English/Catalan/Portuguese later — internal header makes language scope explicit)*. Co-define in strategy or draft in build.
4. **AFI's own accent color** — neutral base is locked; AFI's primary accent is the first real swappable slot and needs a value. Pull from `/Users/richardgriner/Desktop/Coherence/Afi brand/Manual Afi_2024-2025.pdf` when locking.
5. **Dev lead identity** for the AFI Wealth Planner build — who's the beachhead user? (Not blocking architecture, but blocking adoption validation.)
6. **Design-system inspiration folder** — user mentioned (Homepage / components / foundations / blog / documentation subfolders + IA MDs); not found on disk. Exists elsewhere, or to-be-created.

### Deferred to build phase (technical — Open Code decisions)
- Repo / folder structure (Angular workspace with `apps/site` + `libs/ui` + `libs/tokens` is the likely default).
- Build approach — static-generated Angular docs vs Angular app with live component rendering.
- Hosting + preview infrastructure (Netlify / Vercel / GitHub Pages).
- Downstream consumption pattern in AFI Angular products (npm publish / git submodule / monorepo workspace).

These four are not strategy-level — they are best decided inside Open Code with the code in front of us.

---

## Files to create — v1 scaffold

All paths rooted at `/Users/richardgriner/Desktop/Coherence/Coherence/` (the canonical repo). Exact folder names to finalize inside Open Code.

- **`libs/tokens/`** — the source of truth for every color, type, spacing, radius, motion token. Organized: `primitive/` (raw values) + `semantic/` (intent-named) + `brand/` (the minimal manifest + default fallback shape locked above). Brand manifest schema lives here; it is what v2 commands will read and write.
- **`libs/ui/`** — the ~10 core Angular components (Button, Input, Select, Checkbox, Switch, Card, Modal, Table, Tabs, Drawer) + 3 chart types (line, bar, donut). Table built against Notion + Stripe reference behavior (interactive, hover-rich, flexible columns).
- **`apps/site/`** — the DS reference site (Angular app). Sidebar IA: Foundations / Tokens / Components / Charts / Flows. Every page has a URL you can paste into Teams mid-conversation. Live component + code + tokens on one screen.
- **`apps/site/src/flows/diagnostico/`** — the composed-flow proof: Diagnóstico screen from AFI-Marketing Wealth Planner, built entirely from Coherence. Exercises EvolucionChart (line) + CashflowChart (bar) + AssetAllocationChart (donut) + EscenarioTable in one place.
- **`README.md`** (repo root) — the **workflow / start-here** MD. Meeting → Plan → Fill plan → Build → Test → Iterate. One screen. Links to everything below.
- **`CLAUDE.md`** (repo root) — Claude Code entry point. Loads plan, docs, and agent references. File, not hidden folder, so team-visible.
- **`docs/agents/`** — the 5-agent lineup as individual agent definition MDs: `planner.md`, `builder.md`, `tester.md`, `ds-token-guardian.md`, `case-study.md`. Content co-defined (same pattern as brief-template). **Moved from `.claude/agents/` per user accessibility rule 2026-04-16** — `.claude/` is hidden; `docs/agents/` is visible to the team and serves as documentation of how the AI-driven build works.
- **`docs/plan.md`** — a copy of this plan file, inside the repo so it's git-tracked and shareable via URL.
- **`docs/architecture.md`** — the file-layout map (see "File layout — locked 2026-04-16" section below).
- **`docs/brief-template.md`** — the agent-prompt + question list MD (item 7). Content LOCKED in Appendix A of this plan.
- **`docs/build-kickoff.md`** — the symmetric build-session MD (item 8). Content co-defined during build.
- **`docs/git-cheatsheet.md`** — 5–6 plain-English-named commands (item 10).
- **`docs/accessibility.md`** — aria labels, roles, keyboard nav, focus order, contrast (item 11).
- **`docs/clean-code.md`** — Angular conventions, naming, SCSS discipline (item 12).
- **`docs/component-skill.md`** — agent rules for building ANY component (item 13). Consulted before first line of component code.
- **`docs/token-skill.md`** — agent rules for defining OR consuming tokens (item 14). Primitive → semantic → brand layering.
- **`docs/onboarding.md`** — how to clone / run / contribute / start a branch / naming conventions (per user's explicit need from project memory). Pairs with the git cheatsheet.
- **Brand assets referenced from sibling `/Users/richardgriner/Desktop/Coherence/Afi brand/`** — not copied into the repo. The AFI brand manifest in `libs/tokens/brand/afi.ts` points at this external folder via relative path (`../../../../Afi brand/…`). Santander (and future brands) follow the same pattern as siblings.

### File layout — LOCKED 2026-04-16

Full map of where every v1 artifact lives and why. Copies into `docs/architecture.md` verbatim.

```
/Users/richardgriner/Desktop/Coherence/       ← WORKSPACE (not a repo)
├── Coherence/                                 ← THE GIT REPO — open in Cursor/Open Code
│   ├── README.md                              (v1 item 9 — workflow / start here)
│   ├── CLAUDE.md                              (Claude Code entry point — file, not folder)
│   ├── docs/
│   │   ├── plan.md                            (copy of this plan file)
│   │   ├── architecture.md                    (this layout map)
│   │   ├── brief-template.md                  (v1 item 7 — content LOCKED in Appendix A)
│   │   ├── build-kickoff.md                   (v1 item 8)
│   │   ├── git-cheatsheet.md                  (v1 item 10)
│   │   ├── accessibility.md                   (v1 item 11)
│   │   ├── clean-code.md                      (v1 item 12)
│   │   ├── component-skill.md                 (v1 item 13 — build-once-variants-rest rule)
│   │   ├── token-skill.md                     (v1 item 14 — 6 semantic buckets, base-4)
│   │   ├── onboarding.md
│   │   └── agents/                            (v1 item 15 — 5-agent lineup, visible)
│   │       ├── planner.md
│   │       ├── builder.md
│   │       ├── tester.md
│   │       ├── ds-token-guardian.md
│   │       └── case-study.md
│   ├── libs/
│   │   ├── tokens/
│   │   │   ├── primitive/                     (raw values — JSON)
│   │   │   ├── semantic/                      (Canvas / Surface / Action / Control-neutral / System / Data-viz — JSON)
│   │   │   └── brand/
│   │   │       ├── afi.ts                     (manifest — points at ../../../../Afi brand/)
│   │   │       └── default.ts                 (fallback)
│   │   └── ui/                                (Angular components — v1 item 3)
│   └── apps/
│       └── site/                              (DS reference site — v1 item 6)
│           └── src/flows/diagnostico/         (composed-flow proof — v1 item 5)
└── Afi brand/                                 ← SIBLING OF REPO (brand assets)
    ├── logos/
    ├── Manual Afi_2024-2025.pdf
    ├── Brand guide photos/
    └── Logo screenshots/
```

**Placement rationale:**

| Path | Why there, not elsewhere |
|---|---|
| `README.md` at root | Auto-rendered by GitHub / Cursor / Open Code. It IS "start here." |
| `CLAUDE.md` at root | Claude Code convention — first file read per session. It's a file (not a hidden folder), so team sees it. |
| `docs/agents/` (NOT `.claude/agents/`) | `.claude/` is hidden from Finder / file trees — violates team-accessibility rule. `docs/agents/` is visible, readable as documentation, and loaded explicitly via build-kickoff MD. |
| `docs/plan.md` | Working artifact, not the front door. README maps to it. |
| `docs/architecture.md` | Separate from plan — this is the file map everyone references. |
| `docs/*-skill.md` | Human + agent reference. Could later mirror as `.claude/skills/<name>/SKILL.md`. |
| `libs/tokens/` + `libs/ui/` | Angular monorepo convention. |
| `libs/tokens/brand/afi.ts` | TypeScript, not JSON — needs to build relative asset paths at compile time. |
| `Afi brand/` as sibling | Already locked. Brand-agnostic repo; brand swap = point at different sibling. |

## Build-loop rules (LOCKED 2026-04-16)

These are non-negotiable during build. They also get written verbatim into `docs/build-kickoff.md` so any future Builder agent inherits them.

1. **Preview at every green checkpoint.** Whenever the Builder finishes an iteration that compiles and is visually verifiable — build and preview it. Don't stack 3 unverified changes. The loop is: implement → `ng serve` (or equivalent) → user looks → next iteration. This is how we catch drift early and how the case-study captures actual intermediate states, not just before/after.
2. **Ask instead of guess.** Builder is allowed — encouraged — to stop and ask Strategy (this plan + the user) before making any decision that isn't already locked in the plan. "I'm about to pick a radius value — is there one locked, or should I ask?" beats silent invention every time. Token Guardian agent enforces this for token use; the same rule extends to every unresolved question.
3. **Update the plan as reality pushes back.** If build reveals a strategy decision was wrong or incomplete, Builder flags it, we resolve it in strategy, the plan file gets updated, THEN build continues. Plan is living; stale plans are worse than no plan.
4. **Base components get co-defined one-by-one in strategy before Builder touches them** *(LOCKED 2026-04-16 per user request — "build the components one by one with you, at least the base ones so we get a unique vibe, even like micro animations").* For each base primitive (Button, Input, Select, Checkbox, Switch, Card, Modal, Table, Tabs, Drawer), run a dedicated strategy session covering: per-component references (specific products, not blanket "shadcn"), variants + sizes + states, micro-animations (what moves / duration / easing — the "unique vibe" compound layer), density + token refs, a11y edge cases + reduced-motion fallback. Output: a spec block appended to plan.md under "## Components — locked specs". Builder then implements the component in a single Open Code prompt against the locked spec. This is the slow lane by design — base primitives are the DNA of the DS and drift here compounds everywhere. Secondary / composite components (beyond the base ~10) may be fast-laned by Builder without a co-def session, referencing the base primitives' locked micro-animation vocabulary.

## Case-study observations (captured during work)

Notes for the ~20-min case-study presentation. Captured as they happen so we don't lose the "why AI changed this" moments.

- **2026-04-16 — AI compresses the inspiration→role-definition loop.** Old workflow: find inspiration, try to recreate it, reverse-engineer which scale served which role, then tinker. New workflow: AI looks at references and defines roles from the start (e.g., "this is the Action scale, pinned at 400 and 500 to preserve AFI's two brand blues; here's what each step is for"). Roles locked upfront means tinkering later is faster, not slower — because the scaffolding is already correct. The time saved is the recreation-and-guessing phase, which used to be where most design-system work actually lived.
- **2026-04-16 — AI leapfrogs when a visible artifact is in reach.** Strategy handoff prompt told Open Code to build in order: primitive JSON → Style Dictionary → generated CSS vars → site that consumes them. What it actually delivered first: an Angular site shell with hardcoded neutral colors baked into the components. It skipped the token pipeline because the site shell was the part that produces a screenshot, and screenshots feel like progress. Caught because the build-loop rule says "preview at every green checkpoint" — we previewed, we saw the shell, and the strategy side immediately asked "where's the token layer?" Lesson: the visible-progress bias is real in AI builders. The mitigation is the preview cadence itself, not hoping the agent follows the order. Document the order in the prompt; verify the order in the preview.

## Verification

How we know v1 is doing its job:
- **Dev-lead adoption signal:** the lead references a DS URL in Teams / conversation unprompted.
- **Composed-flow proof:** the Diagnóstico screen of AFI-Marketing Wealth Planner is shipped in production, composed entirely from Coherence components + the 3 v1 chart types. No hand-rolled overrides.
- **Speed delta:** measurable build-time reduction on a comparable screen vs pre-DS baseline (validates the "200% productivity" hypothesis — the core bet the user is testing).
- **White-label stress test:** the Diagnóstico screen re-themed for a hypothetical second brand via a **brand manifest swap only** — no code edits. Proves the minimal-manifest + default-fallback architecture works before v2 commands are built.
- **v2 command readiness check:** an engineer (or Claude) can hand-write a new brand manifest in under 10 minutes using only the public schema. If they can't, v1's manifest is not the right shape for `coherence new brand` in v2 and needs rework before shipping.
- **Linkable-URL audit:** every component, token, and flow has a shareable URL. User can paste any URL into Teams mid-conversation. If a concept doesn't have a URL, it doesn't exist yet.

---

## Roadmap *(added 2026-04-16 per user request — "keep a roadmap… prioritize based on projected value + effort equation / how sure we are it's needed")*

**Scoring:** each item tagged **V** (value if shipped), **E** (effort to ship), **C** (confidence it's needed). H / M / L. Priority ≈ high V × high C ÷ E. Re-score as learning compounds.

### NOW — v1 (LOCKED 2026-04-16) · V:H / E:M–H / C:H
Everything in the "v1 scope" section above. Ship this first. All dependencies below wait.

### NEXT — v2 Wave 1 (high V, high C — the white-label engine + dev adoption catalysts)

- **`coherence skin <product> <brand>`** · V:H / E:L / C:H — apply a stored brand manifest to an existing product via token swap, no code edits. This IS the white-label proof-point made repeatable. Lowest effort because v1 manifest architecture already pays for it.
- **`coherence new brand`** · V:H / E:M / C:H — interrogate user for brand info (partial-access aware: Santander full / smaller bank minimal), write a manifest. Directly removes the single biggest manual lift in every new client engagement.
- **`coherence edit brand`** · V:H / E:M / C:H — introspect existing manifest, surface gaps, let the user fill them. Sibling of `new brand`.
- **`coherence new product`** · V:H / E:M–H / C:M–H — scaffold a new AFI product from Coherence. This is the `brief-template MD` turned into a runnable command; the MD is the v1 prototype, the command is the v2 production version.
- **Interactive Stripe-style component playgrounds** · V:H / E:M / C:H — config panel + live preview embedded in the DS site. User named Stripe's PDF builder as the canonical reference in v1 references; this is what "prototyping kind of thing" materializes into. Strong dev-adoption catalyst.

### LATER — v2 Wave 2 (medium V or medium C — real value but not the leading edge)

- **Pattern library** · V:M / E:M / C:M — composed patterns beyond primitives (Wise-depth). Earns more docs authority; only pays off once v1 primitives are battle-tested.
- **Written brand / content guidelines** · V:M / E:L–M / C:M — voice, tone, writing rules. Valuable for Miguel + future writers; less urgent than components.
- **Motion showcase** · V:L–M / E:L / C:M — dedicated page demonstrating motion tokens in real contexts. Nice-to-have; v1 motion tokens likely enough on their own.

### BACKLOG — ideas parked (low C or unclear V, don't lose)

Re-evaluate per epic; anything here is allowed to graduate into Wave 1/2 if a concrete need emerges.

- **SQL dashboard tracking user movements on platforms** · V:H / E:H / C:M *(user note 2026-04-16: "that's another thing we don't measure, any metric.")* — cross-product analytics. Sits in backlog because no specific screen depends on it; value is real but not blocking.
- **Feedback feature on Wealth Planner + metrics dashboards** · V:M / E:M / C:M — related to the SQL dashboard.
- **Prototype / brief / handoff / feedback product** · V:H / E:H / C:L — user's "cool flow" design-delivery tool. High value if built, but low confidence anyone beyond the user will use it; earn right to build via v1 adoption first.
- **Strategy folder** · V:M / E:L / C:M — futures frameworks, interview templates, brief intake MDs, design-conclusion-per-objective MDs (IDEO DesignKit-style). Lightweight to start; value depends on actually running strategy work.
- **Granola-style meeting tool for Braulio** · V:M / E:H / C:L — partially proved already via the Claude + Granola workflow this project uses. Don't rebuild what already works.
- **NotebookLM-style market-research email loop** · V:M / E:H / C:L — Braulio-facing.
- **WhatsApp / Teams chatbot** · V:M / E:M / C:L — capture ideas outside work hours.
- **Landing pages** — investors / AFI offer / builder course / design course · V:M / E:L / C:L (each) — opportunistic; build when a specific audience is named.
- **AI vibe-coding / token kit for freelancers** · V:M / E:M / C:L — solves "hard to match brands at bigger banks" for others; adjacent market.
- **AFI School / design course with Flavia** · V:M / E:H / C:L — long-term ambition, needs Flavia alignment before scoping.
- **"Profound design reasoning" MDs ('5 whys' explanations)** · V:L–M / E:L / C:L — useful as artifacts emerge, not as a program.
- **Equations / calculations page on the DS site** *(added 2026-04-16 per user idea)* · V:M–H / E:M / C:M — a documented library of the mathematical formulas AFI uses across products (retirement projections, safety age, liquidity optimization, auto-financing, asset allocation, drawdown, ESG scoring, tax calcs for Patrimonial / Holding / SOCIMI, evolution scenarios). Renders each formula with: LaTeX/MathJax math, plain-language explanation, worked numeric example, link to the component(s) that use it, runnable TypeScript reference implementation. **Why valuable:** (1) onboarding — new devs/designers get the math alongside the UI, in one place; (2) cross-product consistency — Wealth Manager and Wealth Planner stop drifting on the same formula; (3) DS differentiator — finance DSes almost never ship math; (4) AI-agent-consumable — Builder agent can reference the formulas when implementing calculation-heavy components like EvolucionChart / CashflowChart; (5) white-label-relevant — each client bank has its own calculation rules, so this slot doubles as the brand-specific math layer. **Lightweight predecessor path:** start with `docs/equations.md` (plain MD, no rendering setup) to collect formulas as they surface during Wealth Planner build; promote to a full site section once we have a critical mass. **Graduation trigger:** dev lead asks for it OR we've collected 10+ formulas during v1 build.
- **Feature-tracking Kanban + per-feature dossiers** *(added 2026-04-16 per user idea — parked for later decision)* · V:M–H / E:M / C:M — a living history of every Coherence feature. **Kanban view:** cards per brief (`docs/briefs/{slug}.md`), columns = Parked / Planning / Building / Shipped / Archived. **Dossier (click a card):** the brief + case study + change log + iteration screenshots + **clean-code + Token-Guardian log**. **Mechanism sketch:** `scripts/clean-code-check.sh` and the Guardian agent append JSONL lines to `docs/briefs/logs/{slug}.jsonl` (agent, finding, file:line, resolution, timestamp) as they run; a site route reads briefs + logs and renders the Kanban + dossier. **Why valuable:** (1) closes the loop between Planner → Builder → Guardian → case-study artifacts already in v1; (2) every shipped feature becomes pitch material for the DS's "AI changed this" narrative; (3) transparent quality pressure — "this feature had 4 Guardian escalations" is visible history, not tribal knowledge. **Open question (parked unresolved):** site-integrated (new top-level route `/proyectos` alongside Fundamentos/Tokens/Componentes/Gráficos/Flujos) vs. separate tool sibling to the DS — the DS site's current purpose is documenting primitives; a feature tracker is a different purpose. **Graduation trigger:** after v1 ships and ≥3 features have moved through the full Planner → Builder → Tester loop, re-evaluate with real log data in hand.
- **Second brand** — "social digital solutions for financial freedom" · V:H / E:H / C:L — the long-horizon ambition outside bank clients. Earn via v1 adoption + 200% productivity proof.

*This roadmap is a living artifact. Re-score after each v1 milestone and whenever a backlog item's confidence shifts.*

---

## Appendix A — Brief template MD (LOCKED 2026-04-16)

*v1 item 7 content. Builder in Open Code writes this verbatim to `/Users/richardgriner/Desktop/Coherence/Coherence/docs/brief-template.md`.*

````markdown
# Brief template — plan agent prompt

You are a planning agent. Your job: help the user scope a digital
product or feature end-to-end. This is strategy work, not code. The
output is a plan file with five filled sections (Context, Frame,
Scope, Spec, Parked).

Rules (non-negotiable):
1. Ask ONE question at a time. Wait for the answer. Never batch.
2. Probe vague answers until they are concrete.
3. Push back on lazy references ("clean and modern") — ask which
   specific product, site, or pattern.
4. After each phase, summarize what was decided, write it to the
   plan file, and confirm with the user before the next phase
   begins.
5. Do not write code. Do not design mocks. Do not invent visual
   or technical decisions the user has not confirmed.

Work through Phase 0 → Phase 4 in order. A phase can be skipped
only if the user explicitly says it does not apply.

---

## Phase 0 — Intake

Goal: establish what you're walking into. Everything else branches
from the answers here.

1. **Client / team.** Who is this for — an AFI product, a specific
   bank client, an internal team, or something else? Name them.

2. **Project type.** Is this a new product (greenfield), an
   iteration on something live, or a redesign (existing product,
   big visual/structural change)? Pick one.

3. **Existing design system.** Does this client / team already
   have a DS? If yes: where does it live, and does Coherence need
   to integrate with it, be restyled through it, or sit alongside
   it?

4. **Existing Figma / mocks.** Does a Figma file, Sketch file, or
   other mock source already exist? If yes: is it current, is it
   approved, and do we treat it as the starting point or the thing
   being replaced?

5. **Stakeholders.** Who will sign off on this, and who will push
   back on it? Name them.

End of Phase 0: plan file has a "## Context" block with client,
project type, existing DS status, Figma status, stakeholders.
Confirm with user before Phase 1. The answers bias how Frame
questions are asked — e.g., an iteration means Phase 1 asks
"what's broken in v1" instead of "what's the vision."

---

## Phase 1 — Frame

Goal: establish WHY this project matters. Nothing about scope or
execution yet.

1. **Pains.** What is broken that makes this worth building? Name
   the symptoms first — the things visibly going wrong. Then,
   together, find the systemic one underneath them. Keep probing
   until you have at least one pain that, if it stayed broken,
   would make the project pointless.

2. **North star.** If this ships and works, what one thing has
   changed for the people it's for? One sentence. If the user
   gives more, ask them to compress it. Lock in the plan file as
   `> **North star:** [sentence]`.

3. **References.** Which existing products, sites, or patterns
   are closest to what you want this to feel like? Name them
   specifically — no "clean and modern." For each, ask what
   specifically from that reference (IA, color, density, motion,
   interaction). Ask for at least three.

4. **Users.** Who is this for? Role, context, the moment in their
   day when they'd open it. Name at least one primary user. If
   the answer is "everyone" or a broad category, push back.

End of Phase 1: plan file has a "## Frame" section with pains
(list with systemic one flagged), north star (one sentence),
references (list with what each contributes), users (primary +
secondary). Confirm before Phase 2.

---

## Phase 2 — Scope

Goal: define the MINIMUM surfaces that prove the north star.
Everything beyond that becomes Phase 4.

1. **v1 surfaces.** What are the smallest screens, components,
   flows, or features that make the north star real? Push the
   user to cut, not add. Each surface must answer: "Without this,
   does the north star still work?" If yes, the surface is out.
   Ask them to name surfaces they're tempted to include but can't
   justify — those go to Phase 4.

2. **User stories.** For each v1 surface, write a user story in
   the form: "As a [user from Phase 1 Users], I want to [action],
   so that [outcome tied to the north star]." Probe if the "so
   that" is vague or restates the action. The outcome is what
   matters.

3. **Out-of-scope.** What is this project explicitly NOT doing?
   Name the nearby adjacent features or responsibilities that
   people might assume are included but aren't. This becomes the
   checklist to push back with when stakeholders ask.

End of Phase 2: plan file has a "## Scope" section with v1
surfaces (list), user stories (one per surface), and explicit
out-of-scope items. Confirm before Phase 3.

---

## Phase 3 — Spec

Goal: capture the constraints that shape HOW the v1 surfaces get
built. This is where an engineer can pick up the plan and know
what's required.

1. **Technical requirements.** What must the build run on — stack
   (framework, language), browsers/devices, integrations (APIs,
   auth, databases), performance budgets, real-time or offline
   needs? Separate HARD constraints (shipping blocked if missed),
   NEGOTIABLE ones, and UNKNOWNS that must be answered before
   build starts.

2. **Non-technical requirements.** Accessibility level (e.g.,
   WCAG AA), i18n (languages), compliance (GDPR, financial regs,
   internal security), privacy (PII, consent), budget or cost
   caps, legal review, content constraints (tone, reading level,
   regulatory language). Same hard / nice-to-have split.

3. **Team + timeline constraints.** Who's building it (headcount,
   skills), how long they have, what else is in flight that
   blocks this. If relevant: sign-off dates or meetings this must
   be ready for.

End of Phase 3: plan file has a "## Spec" section with technical
requirements (hard / negotiable / unknown), non-technical
requirements (hard / nice-to-have), team + timeline constraints.
Confirm before Phase 4.

---

## Phase 4 — Parked

Goal: capture everything that came up but is NOT in v1 — so
nothing gets lost, and so readers know why each thing was cut.

1. **v2 candidates.** What did you want in v1 but had to cut? For
   each, note why (scope, time, risk, confidence). These come
   back first when v1 ships. No scoring required — a list with
   reasoning is enough.

2. **Backlog.** What adjacent or larger ideas came up that relate
   to this project but aren't for v1 or v2? Include anything the
   user said "not now, but don't forget" about.

3. **Still to determine.** Strategic questions open, ordered by
   leverage (the one that unlocks the most goes first). These are
   the handoff artifacts for the next planning session — or for
   the build-kickoff MD.

End of Phase 4: plan file has a "## Parked" section with v2
candidates (with cut reasons), backlog, still-to-determine
(ordered by leverage). Confirm the whole plan with the user.
Mark the plan file as COMPLETE and ready for handoff.

---

After Phase 4: remind the user this plan is a living artifact.
Re-read when scope shifts. Move items from Parked into v1 or from
Still-to-determine into resolved as they lock. If handing off to
build, point to the build-kickoff MD.
````
