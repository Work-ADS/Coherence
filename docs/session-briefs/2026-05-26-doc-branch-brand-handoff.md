# Doc branch — brand picker resurfacing + flat handoff output

**Status:** drafted 2026-05-26, awaits user "go"
**Branch (proposed):** `docs/brand-handoff`
**Activates:** when the user says go

---

## Why this exists

The AFI team is shifting their workflow: **screenshots instead of prototypes**. That means a developer receives a static image of a component skinned for a specific client (Unicaja, Sarevi, etc.) and has to translate it into code without a live Figma file to inspect.

This branch makes Coherence the live source-of-truth that closes that gap:

1. A developer opens the relevant component page in Coherence.
2. They flip the brand picker to the client (e.g., Unicaja).
3. The preview re-skins to match the screenshot they were sent.
4. They click any element and copy a **single flat line** — `button-primary-background: #0805d7` — straight into their code.

No more mistaken variables in handoff. No more guessing which semantic token resolves to which hex. The team consensus from the **May 22 token-standards session** was explicit: one flat file per client, leaf token + raw hex, no reference chain visible to the consumer.

---

## What already exists (do not rebuild)

- **Brand picker component** — [apps/site/src/app/components/brand-picker/brand-picker.component.ts](apps/site/src/app/components/brand-picker/brand-picker.component.ts). Sets `data-brand` on `<html>`, persists to `localStorage` as `coherence-brand`, SSR-safe.
- **Brand engine** — [libs/tokens/semantic.scss](libs/tokens/semantic.scss) has `[data-brand="..."]` blocks that rebind every relevant CSS custom property. Components follow automatically because they consume semantic tokens, never primitives.
- **Inspect service** — [apps/site/src/app/services/inspect.service.ts](apps/site/src/app/services/inspect.service.ts) already reads `getComputedStyle` and resolves the token chain. This is the foundation for the new leaf-only popover.
- **Three live brands** — AFI (default), Laboral Kutxa (Sarevi), Unicaja. All three have real semantic blocks at `semantic.scss:578` (Unicaja), `:627` (Laboral Kutxa), and the AFI default at the top of the file.

## What's parked, not built

- **Mutualidad** — listed in the picker dropdown but [semantic.scss:562](libs/tokens/semantic.scss:562) is a STUB ("⚠️ STUB. Fill in once colors-mutualidad.scss has real primitive values"). Picking it changes the attribute but no tokens rebind. **Decision for this brief:** keep Mutualidad in the dropdown as visible "coming soon" state, OR hide it until tokens land. See Open decisions below.

## Recent context to honor

- Commit [`03cddfc`](https://github.com/) — *"chore(site): hide global brand picker from the top bar"* — landed yesterday. That direction stands: **no top-bar picker.** This brief surfaces the picker contextually inside the pages where handoff actually happens.

---

## Decisions locked in planning (2026-05-26)

1. **Picker scope: scoped placement, global state.**
   - Lives on `/componentes/*` detail pages and `/demos/*` only.
   - State is global — selecting Unicaja on the Button page persists when you navigate to the Demo page (existing localStorage handles this).
   - Does NOT appear on `/`, `/fundamentos`, `/patrones` landings, `/primeros-pasos`, `/recursos`, `/blog`.

2. **Site chrome stays Coherence.** The logo, top bar, and sidebar never re-skin. The brand swap is **confined to the preview frame** inside each component page. A visitor always knows they're on Coherence.

3. **Inspect output: one line, leaf only.**
   - Click any element inside a preview frame → small popover appears with one line: `button-primary-background: #0805d7` (or whatever leaf token resolves there).
   - One Copy button. Nothing else. No chain visible. No primitive→semantic→component trail.
   - This is the **exact contract from the May 22 meeting** — flat output, no layered abstraction in the consumer surface.

4. **Brand list v1: AFI + Laboral Kutxa + Unicaja.** Three real brands. Mutualidad stays in the codebase but its visibility in the picker is an Open decision.

---

## Open decisions (need user input before build)

Order of importance — top unlocks the most:

1. **Picker placement on the component page.** Three candidates:
   - (a) Above the preview frame — a chip row labeled "Marca: [Unicaja ▾]" sitting between the page H1 and the playground.
   - (b) Inside the existing right-rail controls panel — alongside size/state controls.
   - (c) As an overlay button pinned to the top-right corner of the preview frame itself — like a Storybook addon.

2. **"Descargar tokens de [brand]" button — v1 or parked?**
   - In v1: each component page has a download button that emits the flat per-brand file the team copies into their project. Adds real friction-reduction for the screenshot→ship loop.
   - Parked: ship the inspect popover alone in v1; the download is a v2 add-on.

3. **Inspect popover — refactor existing service or build new?**
   - The existing `inspect.service.ts` resolves the full chain (cascade-correct). The new leaf-only contract may want a thinner sibling rather than mutating the existing service, since `/fundamentos` and other surfaces may still want the full chain for educational purposes.

4. **Mutualidad visibility.** Hide from dropdown until tokens land, OR show as disabled with "próximamente" label?

5. **Where the brand picker on `/demos/*` lives vs `/componentes/*`.** A `/demos` page is a full screen composition, not a single primitive. Picker may want to be a small pill in the demo frame's chrome rather than the same component-page placement.

---

## Process — what to do when user says go

1. **First read (in order, always):**
   - `AGENTS.md`
   - `docs/strategy/plan.md`
   - `docs/rules/component-skill.md`
   - `docs/rules/token-skill.md`
   - `docs/agents/ds-token-guardian.md`
2. **Read the existing surfaces** before touching code:
   - `apps/site/src/app/components/brand-picker/brand-picker.component.ts` (works — don't rewrite, re-mount)
   - `apps/site/src/app/services/inspect.service.ts` (decide refactor vs sibling per Open decision 3)
   - `libs/tokens/semantic.scss` `[data-brand="..."]` blocks (understand the engine before adding to it)
   - One existing component page (e.g., `apps/site/src/app/pages/componentes/button.page.ts`) to understand the shell + slot pattern from `<site-doc-page-shell>`
3. **Close the Open decisions above** with the user — one question at a time per the project convention.
4. **Then plan-mode gate** — produce a step list of file changes BEFORE editing.
5. **Then build** — smallest vertical slice first: picker mounts on Button page → preview re-skins → click-to-inspect popover shows one line for one token. Verify in preview before scaling to other component pages.
6. **Token Guardian sweep** before commit. No primitive leaks. No improvised fallback tokens.

## Non-goals (do not pull in)

- Building the Mutualidad semantic block. Separate task — only triggered when primitive colors arrive from that client.
- Restoring the global top-bar picker (commit [`03cddfc`](https://github.com/) is the active direction).
- Re-skinning Foundations, Patterns, or chrome surfaces. Out of scope.
- Adding a fifth brand. v1 is the three real ones.
- Designing a new component for the popover from scratch — reuse existing Coherence primitives (tooltip, copy-button, etc.) per [feedback_reuse_primitives_not_bespoke](https://github.com/).

## Success looks like

A developer at AFI receives a screenshot of a Unicaja-skinned button. They open Coherence, navigate to the Button page, flip the picker to Unicaja, the preview matches the screenshot, they click the button, copy `button-primary-background: #0805d7`, and paste it into their code. Total time: under 30 seconds. No Figma, no DevMode, no Slack DM to the designer.
