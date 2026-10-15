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

## 5b-3 plan (approved 2026-10-15)

Scope: step 7 and 8 above (Select and Search, then Switch, Checkbox and Radio Group). Every API step ends with `npm run build`, because `tsc` does not check templates. Consumers (html files): Select 23, Switch 9, Checkbox 7, Radio 7, Search 2.

1. **Select.** Label through `afi-field-label` (`help`, `helpLabel`, required marker); `shape="pill"`; `align="start|end"`; the trigger becomes `role="combobox"` with `aria-controls`, so `aria-activedescendant` is valid; the panel grows to its longest option between the trigger width and `--select-panel-max` (320 fallback); chevron and check through `afi-icon`; no `role="alert"` on the error. No `unit` (see 5b-2). The `trigger` slot waits for 5b-4 (needs the chip's `asTrigger` mode and MultiSelect).
2. **Search.** Label through `afi-field-label` (`help`, `required`); `shape="pill"`; icons through `afi-icon` (new `search` glyph); Home/End, IME guard, 10-row cap, blur close without the microtask race. Default `size` stays `sm` (two consumers).
3. **Switch.** `help`/`helpLabel` inside the label row via `afi-field-help`; `hint` stays.
4. **Checkbox.** Size `xs` (14 px, glyph 8, stroke 3.5) for dense tables.
5. **Radio Group.** The item injects the group optionally: inside a group it reads the group's `name` and `value`, outside it keeps its own `name`/`selected` inputs, so the seven hand-wired consumer files keep working. New group `options` (`{value,label,description,disabled}`), `hint`, `error` (`aria-invalid`, `aria-describedby`), `help`/`helpLabel` on the legend, and a row stack rule at the compact container width.

Decisions: no `defaultChecked`/uncontrolled mode on any control (every consumer is controlled; it is a cross-cutting API, deliberate difference from the zip); Search default size, suggestions-as-function and write-the-label-back are skipped (breaking for little gain); Radio supports `options` and hand-wired items side by side.

Done when: acceptance for Select, Search, Switch, Checkbox and Radio; clean-code check and build green after each commit; guardian review; doc pages updated; browser, dark and 375 px checks; pushed to both remotes.

## 5b-4 plan (approved 2026-10-15)

Scope: steps 9 and 10, the Select `trigger` hook, and the close of 5b. Every API step ends with `npm run build`. Consumers: Segmented Control 40 files (all controlled), Filter Chip 1 (`legado-retiro`, dropdown mode). `@angular/cdk` is not installed, so panels are portalled by hand as Select does.

1. **Segmented Control (additive).** `appearance="raised|solid"`; option `icon`/`ariaLabel`/`count`/`dot`/`meta`; `fullWidth`; whole-control `disabled`; field props (`label`, `help`, `hint`, `error`, `required`) that wrap the control in a fieldset only when `label` is set. Keyboard: roving tabindex, arrows move and select with wrap, Home/End, skip disabled. Thumb re-measured on `document.fonts.ready`, no transition on first paint, `nothumb` fallback. Unicaja block untouched.
2. **Filter Chip.** Wrapper with sibling buttons (no nested interactive), fill driven from the wrapper; toggle mode on `aria-pressed`; `value`, `appearance="outline"`, `removable`/`removed`, `cleared`, trigger mode (`asTrigger`, `expanded`, `toggled`, leading `reset`). `dismissable` stays as an alias, `count` stays, dropdown mode stays deprecated.
3. **MultiSelect + Select `trigger`.** New `afi-multi-select` (field anatomy, grouped options, `selectAll` tri-state, `tools`, `summary` modes, `shape`, portalled panel, full keyboard). The closed control is replaceable through a `TemplateRef` with a state context (`open`, `toggle`, `selected`, `count`, `total`, `allSelected`, `labels`, `clear`); Select gets the same hook (`open`, `toggle`, `value`, `option`, `clear`). `legado-retiro` is not migrated.
4. **Close.** Doc pages (Segmented, Filter Chip, new `/componentes/multi-select`), Unicaja check, dark and 375 px sweep of all ten controls, guardian, findings into this brief and chunk 5, push.

Decisions: one session, with commits 1 and 2 first; if MultiSelect runs long it ships as a short 5b-5 rather than rushed. Segmented roving tabindex changes Tab behaviour in 40 files (ARIA-correct; accepted). Filter Chip dropdown mode stays until its consumer migrates. Trigger hook is a `TemplateRef` with state, not a slot. Shared floating panel extraction waits for 5d.

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

### 5b-2 (buttons API, FieldHelp, Input anatomy, 2026-10-15)

Commits: Button, Icon Button, Tooltip, FieldHelp/FieldLabel, Input and doc pages, then the guardian fixes. `tsc`, `clean-code-check.sh` and `npm run build` green; browser checks below.

- **The plan was wrong about two consumers; both were caught by `npm run build`, not `tsc`.** (`tsc -p apps/site/tsconfig.app.json` does not check templates: always run the build.) `badge` on Icon Button is bound by `feedback-overlay`, so the input stays (declared, still not rendered). Button's `iconStart`/`iconEnd` are bound as string flags by three pages (`iconStart="sliders"`, `"power"`, `[iconEnd]="'chevron-down'"`) next to a projected svg, so the gate and slots stay as they were; only the spinner moved to `afi-icon` (`loader`, new glyph). Moving icon names into Button waits until those consumers migrate.
- **Tooltip.** `openOnClick`, `multiline` (cap `--dimension-60`) and Escape added, defaults unchanged. Escape only stops propagation while a bubble is showing. Still absolutely positioned (5d portal).
- **FieldHelp + FieldLabel.** New `afi-field-help` and `afi-field-label`; the ⓘ sits outside the `<label>` so it is not part of the field's name; verified in the browser: name «Más información sobre …», description node, opens on click, Escape closes, ⓘ active on a disabled field, a 3-line label keeps the ⓘ after its last word. Icon Button gained `ariaDescribedBy` for it.
- **Input.** `help`/`helpLabel`, `shape="pill"`, `iconStart`/`iconEnd` (icon names, rendered inside the shell), `numeric`; `type="number"` still right-aligns on its own (58 consumers; migrate later). No `role="alert"` on the error. No `unit` (deliberate: `suffix` does it). Unicaja's label font rule moved into `field-label` scss, so Select and Radio labels will pick it up under Unicaja too.
- **Guardian fixes.** Quiet-destruction hover ink was error-900 on a dark-grey fill: now `--feedback-error-foreground`. `--input-icon-default` had no dark value: added to the dark block in `components.scss` (control-400).
- **Open, deferred.** `--button-warning-ghost-border` equals the dark active fill (border vanishes on press); 18 px icon (`--dimension-4-5`) and the tooltip cap use primitive dimensions in component scss (component tokens would be cleaner); tooltip and Input's Unicaja block still read `--color-base-white`/`--color-neutral-900` (pre-existing); the 0.7 s spinner loop is a raw duration.
- **Not repeated this session.** The before/after side-by-side and the `/workbench` hash: no `-v2` or `foundations-modern` file changed, so modern is untouched by construction.

### 5b-3 (Select, Search, Switch, Checkbox, Radio Group, 2026-10-15)

Commits: Select, Search (and its new `/componentes/search` page), Switch/Checkbox/Radio with their doc pages, then the guardian fix. `clean-code-check.sh` and `npm run build` green after each commit; browser-verified.

- **Select.** `afi-field-label` (help, required), `shape="pill"`, `align="start|end"`, `role="combobox"` + `aria-controls` (the listbox id resolves, `aria-activedescendant` resolves), the panel keeps the trigger's width as a minimum and grows to its longest option up to `--select-panel-max` (undocumented opt-in, 320 px fallback). Chevron, check and search glyphs are `afi-icon` (`check` and `search` added to the registry). `align="end"` measures from `clientWidth`, not `innerWidth`, so a scrollbar does not offset it. The `trigger` slot waits for 5b-4.
- **Search.** `help`, `required`, `shape`, ten-row cap on rendered suggestions, Home/End (only when a row is highlighted), IME guard, blur closes immediately unless focus moves inside the component. The only visible Search demo was inside a modal, so a `/componentes/search` page was added; the typeahead was tested there with real keystrokes.
- **Switch.** `help` inside the label row; the switch is named by `aria-labelledby` to the label text only; pressing the ⓘ does not toggle.
- **Checkbox.** `xs` (14 px box, 8 px glyph, 24 px row when labelled).
- **Radio Group.** Items read the group through an `InjectionToken`: inside a group with a bound `value` the group owns the selection; otherwise the item's own `selected` still works. Hand-wired groups now also share the group's `name` (arrow keys work as a bonus). New `options`, `hint`, `error` (`aria-invalid`, `aria-describedby`), `help` on the legend. Verified both modes on the doc page.
- **Guardian.** Tokens clean. Dropped the 40rem container-query stacking: `container-type: inline-size` makes the group's intrinsic width zero in any shrink-to-fit parent (inline-flex, auto grid column, table cell), which is a worse risk than a row that wraps. Horizontal groups still wrap. Revisit with the responsive canvas work. Error paragraphs on Select, Input and Radio no longer carry `role="alert"` (deliberate, per the zip: the error is described, not announced twice).
- **Deferred.** `defaultChecked` / uncontrolled mode (cross-cutting); Search default size `md`, suggestions as a function and write-the-label-back; Select `trigger` slot (5b-4). Under Unicaja a pill Select stays square (frozen brand rule wins). Dark and 375 px were spot-checked on the radio page only.

### 5b-4 (Segmented, Filter Chip, MultiSelect, Select trigger, close, 2026-10-15)

Commits: Segmented Control, Filter Chip, MultiSelect + `#trigger` hook, guardian fixes. `clean-code-check.sh` and `npm run build` green after each; browser-verified (below). Doc pages: Segmented and Filter Chip updated (the Filter Chip page now previews the real component, not hand-drawn chips), new `/componentes/multi-select`.

- **Segmented Control.** `appearance`, option `icon`/`ariaLabel`/`count`/`dot`/`meta`, `fullWidth`, `disabled`, field anatomy (fieldset + legend only when `label` is set; hint and error are described only then). Roving tabindex, arrows move and select with wrap and skip disabled, Home/End. `SegmentedOption.label` stays a required string: an icon-only segment uses `''` (a site component types its options with it). Verified: one tab stop, wrap skips the disabled option, thumb equals the active option, icon-only is square (28 x 28; the first attempt lost to the per-size padding rule, fixed with a three-class selector), solid/count/dot/meta render, **Unicaja still renders radio cards** (72 px, 8 px, radio mark).
- **Filter Chip.** Pill of sibling buttons (no nested interactive), `aria-pressed` on toggles, `value`, `appearance="outline"` (28 px at md, dashed until applied), `removable`/`removed`, `cleared`, trigger mode (`asTrigger`, `expanded`, `toggled`, leading `reset`, `controls`, `activeId`). Verified: no button in a button, × names «Quitar filtro de …» and «Borrar …», disabled shows no ×, the reset never toggles the panel. Dropdown mode stays (deprecated) and `legado-retiro` was not migrated.
- **MultiSelect.** Built and verified: combobox + listbox ids resolve, grouped tri-state rows, select-all mixed state, summary modes, keyboard (arrows, Enter toggles without closing, Escape returns focus), panel portalled to the body. **Trigger hook**: a `TemplateRef` (`#trigger`, `let-s`) on both MultiSelect and Select; context carries `open`, `toggle`, state, `clear`, `listboxId`, `activeId`. A filter chip as the closed control works on both.
- **Guardian fixes.** Select-all and group rows now carry `aria-selected` as well as `aria-checked`; the trigger context and chip expose `aria-controls`/`aria-activedescendant`; the segmented count is no longer hidden from screen readers and the dot has hidden text («con novedades»); the disabled segmented track is one step deeper than the enabled one in dark (`--seg-track-disabled`); `--space-3xs` for the required marker.
- **Known limits.** The solid segmented thumb uses `--button-primary-background-default`, which is AFI-only (white-label frozen). Under Unicaja the new `solid`/`error`/`disabled` segmented props do not suit the radio cards (not reachable unless used). The Select and MultiSelect panels still hand-roll the portal (no `@angular/cdk` in the repo): extract one shared floating panel in 5d. The multi-select positioning code mirrors two panel dimensions as literals. An explicit `ariaLabel` on a chip replaces its visible text and value.
- **Sweep.** 375 px: no horizontal scroll on the 12 control doc pages. Dark: input, switch, segmented, field help and the open MultiSelect panel check out. Not captured: pixel before/after for 5b-2 to 5b-4.

## 5b status

All ten primitives plus FieldHelp and MultiSelect are done to the plan (restyle in 5b-1, API in 5b-2 to 5b-4). Deliberate differences from the zip: no `defaultChecked`/uncontrolled modes, no Input `unit`, no Search function suggestions or write-back, no Search default `md`, Radio keeps `legend`/`hint` names. Still to do elsewhere: migrate `legado-retiro` to MultiSelect + chip trigger, `type="number"` right-align to `numeric`, Button icon names, the shared panel (5d).
