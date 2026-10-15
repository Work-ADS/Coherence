# Chunk 5b — Controls

**Project:** [index](2026-10-14-traditional-ds-0-index.md) · **Parent:** [chunk 5](2026-10-15-traditional-ds-5-components-update-existing.md) · **Builds on:** [5a](2026-10-15-traditional-ds-5a-foundations.md) (findings and guardian review) · **Evidence:** [appendix A](2026-10-15-traditional-ds-4-audit-detail-A-buttons-forms.md) · **Branch:** `traditional-ds-5b-controls` (from `traditional-ds-5a-foundations`; 5a is not on `main` yet) · **Source:** `~/Downloads/Afi_Wealth_Planner_clean.zip`, extracted outside the repo.

## Goal

Bring button, icon-button, input, select, search, checkbox, radio-group, switch, segmented-control and filter-chip to the zip's look and API, and pull forward FieldHelp and MultiSelect from 6b. Restyle (SCSS and token swaps) ships before API growth in every primitive, per the visual-parity rule. Reads the 5a tokens: `--control-size-*`, `--control-h-*`, `--button-*`, `--checkbox-size/glyph-*`, `--menu-item-*`, `--control-label-*`, `--input-*`, the `focus-ring` and `touch-area` mixins and `afi-icon`.

## Out of scope

`*-v2`, `foundations-modern/`, white-label brand files (frozen; the one exception is the Unicaja check below), dropdown-panel, editable-text, inline-edit (appendix A rates them S and unrelated to the zip; revisit after 5d), DatePicker, ControlBar, FormGrid, ValueField, PercentageSplit, ExpandableCheckRow, SplitButton, FAB, InsightTrigger (chunk 6), Tooltip restyle (5d), Wealth Planner pages (chunk 7).

## Decisions (Richard approved the plan 2026-10-15)

1. **Split into four sessions**, each with its own plan-mode gate and brief section (see Sequence). One session cannot hold ten primitives, two new ones and three rewrites.
2. **FieldHelp pulls a minimal addition into `afi-tooltip`**: `openOnClick` and `multiline`, additive and default off. 5d restyles Tooltip afterwards.
3. **Filter-chip dropdown mode stays during 5b** with a deprecation note. It goes only when MultiSelect and the chip trigger ship and its one consumer migrates.

## Facts that shape the work

- Consumers (html files): segmented-control 40, button 39, select 23, input 19, icon-button 19, switch 9, checkbox 7, radio-group 5, search 1, filter-chip 1. Segmented, button, select and input have the widest blast radius: screenshots gate every restyle.
- `afi-tooltip` takes `text`, shows on hover and focus, no click-open, no multiline.
- Checkbox and radio-group are inline-template and Tailwind (a `.ts` file only): the rewrite to 3-file is structural.
- The Unicaja radio cards live in `segmented-control.component.scss` behind `:host-context([data-brand="unicaja"])`; that block hides the thumb and turns options into cards. Restyling the track, thumb or option box must not disturb it.
- Button still carries `font-family: var(--font-brand-display, serif)` and `--radius-md`. The 5a open items (dark contrast of `--button-warning-ghost-border`, `--button-danger-background-default`, and the `--chart-negative` hex) are checked when Button consumes them.

## Sequence

One commit per numbered step. Each commit: `clean-code-check.sh`, `tsc`, `npm run build` (850 kB budget), `preflight`.

### 5b-1 — Restyle pass (SCSS only, no new inputs)

1. **Button + icon-button.** Heights from `--control-size-*`; type from `--control-label-font-sm/lg` plus `--control-label-tracking`; backgrounds from `--button-*` (primary hover is azul-profundo-450, secondary hover `--button-neutral-background-hover`, danger and danger-ghost from their tokens); radius `--radius-control`; disabled by opacity only, no fill swap, `box-shadow: none`; drop the serif fallback; `touch-area` and `focus-ring` mixins. Icon-button: size scale 24/28/32, glyph size per size, ghost ink secondary, secondary = surface + hairline, primary = action colour (not `--brand-primary-*`), remove the pressed fill only if it has no consumer (grep first, otherwise keep).
2. **Input, Select, Search.** `--input-background/border/foreground/icon-*` instead of `--control-background-default`; `--radius-control`; one type size (`--type-body-md-400`) at every size; label body-md-400 secondary ink with `--space-2xs` gap; required `*` with `margin-inline-start` 2px; Input and Select focus = outer 2px `--border-focus` ring plus `--input-border-focus`, Search inset; disabled via `--input-*-disabled` plus `-webkit-text-fill-color`; error ring. Select panel: `--overlay-dropdown`, `--border-subtle`, `--radius-panel`, `--elevation-lg`, `--z-floating` (replaces z 40/50), `--menu-item-*` rows, hover `--nav-item-background-hover`, check `--nav-item-icon-hover`, open trigger keeps its ring. Search: pill-less rect, primitive colour `--color-afi-control-400` replaced by `--input-icon-default`, default size `md` is an API change and waits for 5b-3. The `:host-context([data-brand])` blocks stay as they are.
3. **Switch, segmented-control, filter-chip.** Switch: track 40x24 / 32x18 per zip, thumb 18/13 at 3/2.5 inset, off `--control-background-active`, on `--brand-secondary-background-default`, thumb white with `--elevation-sm`, no primitive colours, overshoot and press-stretch motion with reduced-motion collapse, drop the 44 px min-height (label row carries the target through `touch-area`). Segmented: track height `--control-h-*` so it equals Input at the same size, radius `calc(var(--radius-control) + padding)`, padding `--space-3xs`, thumb `--surface-raised` + `--elevation-sm`, one weight (500) in every state, inset focus ring. Filter-chip: chrome scale, selected = quiet tint with brand ink (not a solid brand pill), `--control-border-selected`, gap tokens, caret and x at stroke 1.75 via `afi-icon`. **Unicaja block untouched; screenshot it.**
4. **Checkbox + radio-group rewrite to 3-file**, same public API for now. `--checkbox-size/glyph-md/sm` for the box, `--border-width-thick` + `--input-border-default/hover`, checked fill `--brand-secondary-background-default`, tick in `currentColor` with dash-draw on `--duration-base` / `--easing-enter`, token-only motion, disabled .55. Radio: 18 px ring, outline style with a 10 px dot, no white fill. Keep the 44 px target via `touch-area` rather than a 44 px wrapper.

Guardian review at the end of 5b-1.

### 5b-2 — Buttons API + field anatomy + FieldHelp

5. **Button and icon-button API.** Button: `warning-ghost` variant, sizes `xl`, `2xl`, spinner and `iconStart/iconEnd` onto `afi-icon` (string inputs stay as the gate or become icon names: decide in the session, appendix A calls the string gate odd). Icon-button: `quiet`, `quiet-destruction`, sizes `xl`, `2xl`, the declared-but-unused `badge` input either rendered or removed.
6. **Shared field anatomy.** New `libs/ui/src/field-help/` (FieldHelp ⓘ = tooltip + icon-button quiet sm + `afi-icon` `info`, RequiredMark, one row helper) and the Tooltip addition from decision 2. Input gets `help`/`helpLabel`, `numeric` (type number stops implying right-align), `unit`, `shape=pill`, `iconEnd` (and renders `iconStart`), forwarded focus. ARIA: error described not announced (drop `role="alert"`), label name only via `aria-labelledby`. `prefix/suffix` stay as ours-only.

### 5b-3 — Select, Search, Switch, Checkbox, Radio API

7. **Select**: `help`, `shape=pill`, `unit`, `align`, `trigger` slot, `role="combobox"` + `aria-controls` on the trigger, panel grows to longest option up to a cap. **Search**: `help`, `required`, `shape=pill`, default `size` to `md`, suggestions as function, write the picked label back, Home/End, IME guard, 10-row cap, blur close without the microtask race.
8. **Switch**: `help`. **Checkbox**: `xs` size, `defaultChecked`. **Radio-group**: `options` array, group `label`/`hint`/`error`, parent owns `name` and `selected`, `row`, stacks below 640 px.

### 5b-4 — Segmented-control, filter-chip, MultiSelect + close

9. **Segmented-control**: `appearance=solid`, option `icon`/`count`/`dot`/`meta`, `fullWidth`, whole-control `disabled`, field props, roving tabindex with arrows, Home/End and wrap, measured thumb (ResizeObserver and `document.fonts.ready`).
10. **Filter-chip and MultiSelect.** New `libs/ui/src/multi-select/` (accumulating panel, `summary`, `selectAll`, `trigger`). Filter-chip: wrapper plus two sibling buttons (no nested interactive), `value`, `appearance=outline`, `asTrigger/expanded/onReset`, toggle mode on `aria-pressed`.
11. **Close.** `/componentes/*` doc pages for every touched primitive, findings into this brief, final guardian review, Unicaja check.

## 5b-2 plan (approved 2026-10-15)

Scope: steps 5 and 6 above. Every step is API growth; the restyle shipped in 5b-1.

1. **Button.** `warning-ghost` variant; sizes `xl` and `2xl` (36 and 40, padding `--space-md`, `--control-label-font-lg`). `iconStart`/`iconEnd` become `IconName | null` rendered through `afi-icon` (the string-gated slot has no v1 consumers: the slot uses in the repo are `afi-button-v2`). Spinner becomes an `afi-icon` `loader` glyph (new, data-only registry entry), sr-only text and reduced-motion rule kept.
2. **Icon-button.** `quiet`, `quiet-destruction`, sizes `xl` and `2xl`; glyph steps 16/16/16/18/20 (sm stays 16: no 14 px token). The declared-but-unrendered `badge` input is removed (no consumers).
3. **Tooltip, additive.** `openOnClick`, `multiline` (max width `--dimension-60`), Escape closes, closes on mouseleave and focusout. Defaults unchanged for the 56 existing uses. Still absolutely positioned; the portal waits for 5d.
4. **FieldHelp.** New `libs/ui/src/field-help/`: `afi-field-help` (tooltip + icon-button quiet sm + `info` glyph, click never reaches the field, named by `helpLabel`, described by a hidden node) and `afi-field-label` (label row: `<label for>`, required marker, help; the required marker is folded in here instead of a separate RequiredMark). Doc page `/componentes/field-help`.
5. **Input.** `help`/`helpLabel`, `shape="pill"`, `iconStart`/`iconEnd` as `IconName`, `numeric`. ARIA: no `role="alert"` on the error, label text carries the name, hint/error ids merged into `aria-describedby`.

Decisions: `numeric` is added but `type="number"` keeps its implicit right-align for now (58 consumers; migrate later, deprecation note). `unit` is not added: `suffix` already renders a trailing static unit (5 consumers); recorded as a deliberate difference from the zip. Tooltip portal deferred to 5d.

Done when: acceptance below for Button, Icon-button, Input and Field help; `clean-code-check.sh`, `tsc`, `npm run build` green; guardian review; before/after, 375 px, dark and the modern `/workbench` hash check; pushed to both remotes.

## Acceptance per primitive (from appendix A)

- **Button / icon-button:** keyboard focus ring visible and absent on mouse focus; ring >= 3:1 against surface-default and surface-subtle in light and dark; disabled opacity .5, not-allowed; dev-mode icon-only warning kept; hit area 44 px by `touch-area`.
- **Input / Select / Search:** Input, Select and Segmented share one height per row at the same size; hint and error have unique ids merged with any consumer `aria-describedby`; Select panel portalled and inside the viewport, opens upward when no room, `aria-controls` id resolves, `aria-activedescendant` resolves, ArrowDown + Enter picks, outside mousedown and Escape close.
- **Field help:** Tab order reaches the ⓘ; tooltip opens on focus; Escape closes the tooltip first; long wrapping label keeps the ⓘ after the last word; ⓘ stays active when the field is disabled; clicking it never focuses or opens the field.
- **Checkbox:** visible box exactly 18/16/14 with and without a global reset, light and dark; hit target never smaller than before; label line centred.
- **Switch:** `help` never toggles; named by label text only; no children reveal (FieldReveal is chunk 6).
- **Segmented:** thumb equals the active option at x and width within 0.6 px including the last option; equal left and right padding; arrows move and select; roving tabindex; Unicaja renders radio cards.
- **Filter-chip:** no button inside a button; x buttons named by verb plus label; outline md is 28 px and transparent at rest; open versus closed does not shift geometry.

Zip regressions to mine per primitive: `tools/focus-ring-tests.html`, `field-help-tests.html`, `control-height-floating-tests.html`, `select-portal-tests.html`, `chevron-selection-spacing-tests.html`, `checkbox-sizing-tests.html`, `switch-reveal-tests.html` (help and sizing parts only), `segmentedcontrol-tests.html`, `segmentedcontrol-field-tests.html`, `filterchip-outline-dark-tests.html`. The repo has no test runner, so each becomes a browser check recorded in the findings, not a spec file.

## Done when

- Every appendix A row for these ten primitives is closed, deferred with a reason, or moved to chunk 6.
- `clean-code-check.sh`, `tsc`, `npm run build` green; `ds-token-guardian` clean; `preflight` per commit.
- Before and after screenshots per family (button, icon-button, input, select, search, checkbox, radio, switch, segmented, filter-chip doc pages), dark mode, 375 px; one modern page pixel-identical.
- **Unicaja check:** on `/componentes/segmented-control`, switching to Unicaja still renders radio cards (bordered, 72 px, 8 px radius as 5a measured).

## Findings from the session

- **2026-10-15, planning only.** Zip extracted to a scratch directory outside the repo; no code written. Consumer counts and the Tooltip gap are recorded in "Facts that shape the work". All tokens this brief names resolve in `libs/tokens` (checked by grep: `--control-size-*`, `--control-h-*`, `--button-*`, `--checkbox-*`, `--menu-item-*`, `--control-label-*`, `--input-*`, `--radius-control`, `--radius-panel`, `--overlay-dropdown`, `--z-floating`, `--touch-target-min`, `--surface-raised`, `--nav-item-background-hover`).

### 5b-1 (restyle pass, 2026-10-15)

Commits: Button and Icon Button, Input/Select/Search, Switch/Segmented/Filter-chip, Checkbox/Radio rewrite, then the guardian fixes. Unicaja check passed in the browser after step 3 (72 px cards, 8 px radius, radio mark, thumb hidden); `tsc`, `clean-code-check.sh` and `npm run build` green.

- **Two tokens added.** `--button-danger-foreground` (the danger label was 1.85:1 on the fill in dark; closes the 5a danger-fill item) and `--easing-overshoot` (switch thumb only). The guardian wants Planner sign-off on a fourth easing and a line in `motion-skill.md`: open.
- **Danger hover deviates from the zip.** The zip's error-500 hover gives the label 3.6:1 (light) and 3.9:1 (dark). Hover is now error-900. Hover and active are therefore the same fill.
- **Guardian fixes.** Dark segmented thumb was the same colour as its track and the dark switch off-track stayed light grey (`--control-background-active` has no dark value). Fixed with component tokens `--seg-thumb-background`, `--switch-track-off`, `--switch-thumb` in `components.scss`, with dark values. The switch thumb no longer reads a primitive.
- **Still open.** `--type-caption-400` undefined in search and filter-chip scss (carried from before; fix with the 5a sweep list). Input's adorned shell hand-writes the focus ring rather than the mixin (cosmetic). Danger-foreground light value aliases `--feedback-error-background` (naming wobble). Icon-button glyph stays 16 px at every size until the `xl`/`2xl` step (no 14 px token). Unicaja blocks in input/select now carry redundant overrides; white-label stays frozen.
- **Layout shifts to expect.** Checkbox, radio and switch rows lost their 44 px wrappers (hit area is now an invisible `::after`); fields and segmented tracks are 4 to 8 px shorter on desktop; buttons are 24/28/32 instead of 32/40/48.
- **Visual checks (done).** Side-by-side against the 5a commit (second dev server on a worktree) for button, input and segmented-control: heights, radius, label weight and tracking shift as intended. 375 px: no horizontal scroll, fields 44 px, segmented track 40 px, 44 px hit areas on checkbox via `::after`. Dark: input and switch resolve to the dark values. Modern: computed-style hash over `/workbench` is identical for every `-v2` primitive (badge, card, logo, nav-item, nav-section, table); only `afi-button`, `afi-icon-button` and `afi-segmented-control` differ, because the workbench chrome uses those traditional primitives. No console errors. Screenshots were viewed in-session, not saved to the repo.
