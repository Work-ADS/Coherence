# Identity v2 — modern visual identity adoption plan · slice one

**Status:** planning · foundation phase green-lit (tokens first)
**Branch:** `feat/identity-v2`
**Created:** 2026-07-13
**Sources:**
- Granola folder "Afi simulators visual identity" (7 notes, Jul 3–10 2026)
- Granola Jun 29 "Design system refactor" + Jul 9 sessions (the what-to-show-Borja debate)
- `docs/strategy/plan.md` (Coherence v1 identity, LOCKED 2026-04-16 — now superseded as house identity)
- Richard's Figma library file (token collections + button/input specs) — **link pending**

## Problem

Borja liked Coherence but wants "more modern UI." His actual need: **nice, modern-looking product screens to show potential clients** — afi.design as a demo showcase of Afi's own products. Today he shares static Figma screens with zero context (he won't give any verbally either). A new visual identity is already well advanced in Figma (Jul 2026 work) but lives outside this repo.

## The identity decision (LOCKED this session)

- The **new identity becomes the Coherence foundation** — not a runtime mode/brand.
- Built from tokens up: seed `libs/tokens/` from the Token Studio export, then convert primitives against the new Figma specs.
- The **editorial serif identity (v1) is set aside, not deleted** — git history + candidate case study. May return someday as a brand manifest; optional, gates nothing.
- New identity direction (from Granola, already locked in Figma): IBM Plex Sans + Plex Mono, functional minimalism (Cursor / Clerk / Shopify Polaris / Linear / Wise), compact components, max 6px radius, two-layer token architecture (primitives + semantics), elevation 0–6, color carries meaning only.

## Two journeys

- **Journey A — Richard → Borja:** opens afi.design homepage; look and feel must land in seconds. This is where slice one gets judged.
- **Journey B — Borja → potential client:** sends a link cold. The page must carry its own context (Borja won't). Live screens must beat static Figma images for an unbriefed viewer.

## Site structure (direction, locked loosely)

Showcase becomes the front door; the system moves behind it; philosophy grows around it:

1. **Front door:** homepage + product pages (Borja's world)
2. **Behind:** foundations / components / patterns docs (dev adoption — existing north star stands)
3. **Around:** design principles, process, blog (Richard's world — content informs decisions NOW, pages ship later)

## Slice one scope

1. **Homepage** — new identity, full nav (products / process / principles / blog); destinations may be stubs. Job = look-and-feel + orientation.
2. **Wealth Planner hub page** — product front door; choose: **screens / flow / moodboard**. Embryo of the future value-articulation product page.
3. **Add-patrimonio flow** — live, in the new identity. Beats every show-Borja option debated in Granola: it's the moodboard made brand-consistent, in product language, framed as problem-solving (his persuasion pattern). **Click-by-click inventory still pending → defines the component bill.**
4. **Component moodboard page** — curated showcase of new primitives ("the moodboard he can't hate").

## Build order

1. **Tokens** — seed from Token Studio export (Figma). Neutral monochrome base; brand accent stays open. Color decision deferred ≠ colorless: semantic layer ships neutral, accent swap later is token-layer only.
2. **Primitives the flow needs** — button + input first (specs near-final in Figma, "zero unbound values then frozen"); rest converted as Figma lands.
3. **Flow screens** → 4. **Homepage + hub** → 5. **Moodboard page**.

## Parked (explicitly)

- **Palette switcher / 3 palette directions demo** — parked until color work starts; the multi-brand token engine makes it cheap later.
- **Design principles + philosophy pages, blog on Modern UI** — pages later; Richard to hand over principles content now as design input (file under `docs/brand/`).
- **Per-product landing pages with value articulation** — future; hub page is the seed.
- **v1 editorial identity case study** — parked idea.

## Notes for the button/input build session

- **Pressed states come from Figma EFFECT STYLES, not the pressed variables.** Confirmed by Richard 2026-07-13: `Elevation/pressed` (inner blur 8, for primary) and `Elevation/pressed/secondary` (inner blur 2 + drop, softer — secondary looked awful with the primary treatment) are intentionally different. The `pressed/inner-shadow` variable set only captures the primary variant.
- **Shopify-style raised button treatments exist only as effect styles** (`Elevation/Raised`, `Raised-Neutral`, `Raised-Danger` — triple inner-shadow stacks; values captured in this session's Figma reads). Encode them in the button SCSS directly.
- Figma additions pending (Richard running agent prompt): `font/family/mono`, "Primitive Motion" collection (3 durations + 3 easings, contract-only — code refines curves), `Elevation/roles/*` semantic effect styles, text style `h3`→`H3`. After they land: verify → refresh snapshot → regenerate → build components.

## Open questions

1. **Add-patrimonio flow inventory** — which screens, click by click? (Determines the primitive bill and real slice-one size.)
2. **Principles content** — Richard to provide; affects all downstream design decisions.
3. ~~The 171 `semantic.color.*` tokens~~ — RESOLVED 2026-07-13: **Figma is the source of truth, full stop** ("ya está"). The 171 zip-only tokens are ignored; code seeds from the live Figma variables (69 semantic colors × 2 modes). Dark mode = authoring the second Semantic Colors mode later (semantic layer, not primitives); not gating slice one.

## Milestone: tokens in code — DONE 2026-07-13

- `tools/figma-sync/` = the Figma→code pipeline: `foundations-modern.json` (verified snapshot of the 526 live variables) + `generate-foundations.mjs` (emits SCSS). Re-sync = refresh JSON, re-run script.
- `libs/tokens/foundations-modern/` = generated foundation, scoped under `[data-foundation="modern"]` — inert until a page/wrapper sets that attribute; existing site verified pixel-untouched. At cutover: hoist scope to `:root`, archive the legacy token files.
- IBM Plex Sans (400–700) + IBM Plex Mono (400/500) added to index.html font loading.
- Live-verified in browser: primitive→semantic chain resolves, responsive spacing breakpoints fire, dark-mode block wired (4 authored roles so far).
- NOTE: initial-bundle budget raised 750kB→800kB (apps/site/angular.json) to absorb the transitional double foundation; restore after cutover removes the legacy tokens.
- The mystery of the "171 semantic.color tokens": they are the CODE's current semantic layer (libs/tokens/semantic.scss, 171 roles) — an earlier generation of this same system, never pushed to Figma. Figma's 69-role layer is the go-forward naming per Richard's decision.

## Resolved 2026-07-13

- ✅ Figma link received (`AFI-FOUNDATIONS-MODERN`, key `xa3QosoCWiPdvRvgfQ5FaE`) + `tokensv3.zip` Token Studio export.
- ✅ Full zip-vs-Figma audit done — see `2026-07-13-identity-v2-token-audit.md`. All live values match; zip carries ~366 stale tokens to exclude; 2 alpha primitives missing from export (take from Figma); graphic/chart + data-viz monochrome colors are current-brand placeholders (colors deferred by design).
- ✅ Jul 10 export bugs: fixed state confirmed in both Figma and zip.
