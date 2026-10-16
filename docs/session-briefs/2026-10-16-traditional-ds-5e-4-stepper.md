# Chunk 5e-4 — Stepper

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [5e navigation](2026-10-16-traditional-ds-5e-navigation.md) · **Evidence:** [appendix C, stepper](2026-10-15-traditional-ds-4-audit-detail-C-navigation-shell.md) · **Branch:** `traditional-ds-5e-4-stepper` (from Azure `main`) · **Source:** `components/navigation/Stepper.jsx`, `Stepper.d.ts` and `tools/stepper-a11y-regression.html` in the zips (Stepper is byte-identical between the two exports). Own file so it cannot collide with the 5e brief, which the sidebar branches also edit.

## Goal

Bring `afi-stepper` to the zip's look, its accessibility contract and its API, additively, for the four flows and the preview that use it.

## Consumers (multi-line aware, 2026-10-16)

`/preview`; the proteccion-familiar and optimizacion-asset flows; three Laboral Kutxa Sarevi mounts (white-label, frozen; `layout="stacked"` and a `bc-stepper` class that sets the `--stepper-current-accent-*` hooks). All pass `steps` (`{key, label}`), `current` (1-based), `ariaLabel` and `(stepClicked)`. There was no doc page.

## Decisions

1. **Done colour:** ours (brand-secondary, the AFI action colour). The zip uses brand-primary; `--button-primary-background-default` is not needed. The current ring is brand-secondary, as in the zip.
2. **Name collision:** `layout="inline"` here means marker beside label **with** connectors; in the zip it means no connectors, left-aligned, wrapping. We keep ours (`inline`, `stacked`) and add `plain` for the zip's.
3. **0-based and click gating:** `currentIndex` beside `current` (both optional); `interactive` (default true = today) instead of the zip's «is a handler passed» test, because an Angular output cannot be probed.

## Findings from the session

- **5e-4 done 2026-10-16** (four commits: restyle, a11y rewrite, API, doc page).
  - **Restyle.** STEPPER tokens in `components.scss` (`--stepper-marker-size` 32, `-compact` 24, `--stepper-connector-width`, `--stepper-gap-plain`). Markers 28 to 32px with a tabular medium-weight number, pending = subtle fill with a hairline, done = secondary fill, **current = ring** (surface fill, brand number, thick secondary border; the old halo is gone), connectors 2px (done run in secondary), labels 400 tertiary / done secondary / current 600 primary, shared focus-ring mixin. Stacked connectors are centred on the marker (measured centre difference 0; the old maths ignored the step's block padding). The BC accent stripe hook is untouched.
  - **A11y rewrite** (mines `stepper-a11y-regression`). The root is a labelled list (no `nav` landmark), each step a `listitem` with `aria-current="step"` on the item, the marker `aria-hidden`, the state spoken by a visually hidden suffix («, completado» / «, pendiente», none on the current step; out of flow and clipped, geometry identical: measured equal with and without it), only done steps are buttons, pending and current are plain spans (not focusable; they used to be disabled buttons). The `aria-label` that overrode the visible text is gone.
  - **API (additive).** `currentIndex` (0-based), `interactive`, `size="compact"`, `layout="plain"`, item `sub` (second line), item `state` override, item `key` optional (falls back to position; `stepClicked` then reports the position as the key). `current` is no longer required.
  - **Doc page** `/componentes/stepper` (layout, size, orientation, current, interactive, second line, state override; readout of the last click; tokens; a11y). Route and landing entry added.
  - **Measured:** markers 32px (24 compact), connectors 2px, current ring `2px` secondary border on a white fill with the brand number, done fill `rgb(6,45,63)`, pending subtle fill; `plain` + `compact` has no connectors and 24px height; proteccion-familiar flow renders with `aria-current` on the first item and «pendiente» suffixes.
  - **Visible change to know about:** on the four flows and the preview the markers grow 4px and the current step turns from a filled disc into a ring.
  - **Guardian fixes (same slice):** at 640px and narrower the wrap rule overrode `layout="plain"`'s wide gap (steps sat 4px apart), so plain is now excluded from it; the stale doc headers (an old lock date, a «filled» current marker, a `disabled` todo button) were rewritten to this contract and say keys must be unique; the two accent hooks the BC pages set are now declared in the token block as off (0 and transparent) so they can be found.
  - **Accepted:** the `aria-hidden` connector spans sit directly inside `role=list` next to the list items (valid, ARIA ignores hidden children; if an axe pass flags it, move each connector inside its item); a pending marker in dark has the same fill and border colour, so it reads borderless (the number passes contrast and the marker is `aria-hidden`); the hidden suffix is sized with `--border-width-hairline`, a border token used as a clip size; with `sub` set a done button's name reads «label sub, completado» and relies on the browser adding the gap between the two blocks.
  - **Not verified:** the three Laboral Kutxa mounts (they only render deep in that flow; checked by reading the stylesheet, not in the browser), `/preview` with `size`/`layout` variants, an axe or VoiceOver pass, dark mode in the browser (contrast read from tokens by the guardian), reduced motion.
