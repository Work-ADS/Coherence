# Audit D — data & charts (chart, animated-chart, table, table-apron)

Scope: AFI default only. `ZIP` = scratchpad/zip. `LIB` = libs/ui/src. Read-only; nothing edited in the repo.
Citations: `zip:` = path under ZIP; bare paths = libs/ui/src or libs/tokens.

## 0. Cross-cutting findings (read first)

1. **Structural mismatch: the zip has ONE multi-mode `Chart`, we have five unrelated per-shape components.**
   Zip `Chart` (zip:components/data/Chart.d.ts; 134 KB jsx) = `type: bar | line | donut | line-comparison | stacked-bar`
   x `style: solid | gradient | hatched`, ~45 props. Ours (`chart/`): `afi-chart-bar|line|heatmap|dumbbell|composition`,
   each with its own datum shape (`BarDatum`, `LineSeries{points:{x,y}}`, ... chart.types.ts:11-37). None of these shapes
   carries: series[] with colour/stroke/treatment, categories[], reference, markers, milestones, band, gap, tooltipModel,
   selectedIndex/onSelect, axisLabels, endTag/endLabels. Every zip chart mode in the brief (stacked, milestones, scale,
   soft-remainder, reference, tooltip, scrub, hatch, x-title/legend, liquidez) is a gap on our side except a partial
   `reference` on bar. Zip also has no heatmap/dumbbell/composition. Porting = a new primitive (`afi-chart`) +
   sub-components, not a restyle. Size L (whole family). This also contradicts docs/rules/data-viz-skill.md "Allowed,
   not built" taxonomy (stacked bar, donut, fan chart, reference lines are now built in the zip) and the
   in-flight Chart-selection table edit (uncommitted).
2. **Token layer: our charts never read the new `--chart-*` names.** All chart SCSS/HTML read the old `--data-*`
   buckets (`--data-neutral-strong/medium/muted`, `--data-highlight-primary/secondary`, chart.variants.ts:9-15) and the
   hard hex `--chart-negative: #C81E1E` (charts.scss:28, bar uses it at chart-bar.component.ts:366). aliases.scss:130-134
   maps data-* -> chart-*, but wrongly for look: series 0 = `--chart-neutral-label` (dark ink!) where the zip's normal
   bar is `--chart-data-muted` (control-200). `--chart-negative` is a flat hex that does NOT switch in dark, where the
   zip uses `--chart-value-negative` / `-label` / `-ink` (semantic.scss:583-604; dark 1275). `--data-diverge-pos/neg-300/500/700`
   (heatmap divergent, chart.variants.ts:94-103) are defined NOWHERE (grep -e "--data-diverge-...:" over libs+apps = 0) ->
   divergent heatmap paints undefined colours today. All the 47 new `--chart-*` names exist in semantic.scss (verified: data-*,
   scale-*, range-*, annotation-ink*, value-*, reference-neutral, soft-fill-mix, gradient-start-opacity, muted-gradient,
   category-1..7, radius-chart-bar). NOT created yet: all `--table-*` (header/cell/group/child/footer/action/planning-*, 24 names,
   zip:tokens/semantic.css:174-223, dark 890) and all `--summary-*` (zip:tokens/summary.css). Chart type/labels use
   Tailwind-ish utility classes (`fill-neutral-500`, `text-neutral-600`, `text-section`, `text-canvas-fg`; 24 occurrences in
   chart/*.html) plus `style="font-size:var(--font-size-body-sm)"` instead of the zip's `--type-body-sm-400` role.
3. **Fixed viewBox + no hover/tooltip vs. zip's measured-container chart with tooltip/scrub/selection.** Our bar (viewBox 600x280,
   chart-bar.component.ts:30-31) and line (960x320, chart-line.component.ts:25-26) scale as images, so axis type changes size
   with width; zip measures the container so type is always declared px (Chart.d.ts `viewWidth` doc). Neither bar nor line has a
   hover readout at all (`afi-chart-tooltip` is only used by composition; grep of apps+libs finds no other consumer) and
   selection is only click -> `dataPointActivated`. The zip's whole readout system (compact chip, series-list, tooltipModel,
   columns, live region, selectedIndex/onSelect, hoverIndex scrub) is absent; the in-flight demo-local
   `LiquidezEvolucionChartComponent` (apps/site/.../shared/liquidez-evolucion-chart.component.ts, uncommitted edits) hand-builds
   exactly that (click-to-pin popover, Año/Acumulado toggle, year chevrons, Esc/arrows) around `afi-chart-line` + its own legend
   (html:13-23) — it is the proof the primitive lacks selection + structured readout + legend + reference/markers. Also found
   live bug: `afi-chart-legend` fills swatches with `url(#afi-pattern-...)` (chart-legend.component.html:7) but
   `buildPatternDefs` is never emitted by any chart (only exported, index.ts:29) -> legend swatches render unpainted.

## 1. Chart — sub-blocks

### chart-line -> Chart `type="line"` / `"line-comparison"` (+ DataSection/ChartPanel scrub, Sparkline `type="line"`)
- **API gap:** ours = `data: LineSeries[]` (`{key, points[{x:number|Date,y|null}], color?}`), `baselineZero`, `showMarkers`, `focus`, hide* flags,
  `height` string, output `dataPointActivated`. Missing vs zip: `categories`/`axes` mode, `series[].stroke` (solid/dashed/dotted),
  `.signed` (red below zero), `.endShape`, `.name`; `reference {value,label,labelPosition,legend}` + `referenceTone`; `markers[{at,label,tone,anchor,labelSide,labelPlacement}]`;
  `milestones[]` (icons incl. alert/depleted, `tone:'negative'`, cluster/stack); `band` (1-2 ranges, `--chart-range-outer/inner`); `gap` bracket; `endTag`; `endLabels`;
  `selectedIndex`/`onSelect`/`selectionLabel`; controlled `hoverIndex`+`onHoverChange` (scrub); `tooltipMode` auto|compact|series-list|none + `tooltipModel(i)`
  (heading/meta/rows/columns[1-3]/total/milestones, strong rows, negative per column); `axisFormat` (K/M compaction), `axisLabels`, `xAxisTitle`, `legend` + `legendTrailing`,
  `register`, `style` (solid|gradient area|hatched). Line-comparison default roles (main series primary 2.5px, compared grey `--chart-annotation-ink-subtle` 1.5px, series 3+ with end shapes) not modelled.
  Ours outputs `dataTableToggled`/`instructionsOpened` (a11y chrome the zip does not have: data-table footer, "?" instructions) — keep as ours.
- **Look gap:** series colour from `resolveSeriesVisual` -> `--data-*` (chart.variants.ts:9-15) not `--chart-data-primary/secondary/...`, `--chart-data-comparison`, `--chart-annotation-ink-subtle`;
  stroke 2px hard-coded (scss:6-8) vs 2.5/1.5; grid `--border-hairline` at `opacity=0.5` hard-coded (html:30) vs `--chart-neutral-grid`; axis text `--chart-neutral-label` + `--type-body-sm-400`, we use `fill-neutral-500` + `--font-size-body-sm`;
  markers r=3/5 circles with focus outline `--border-width-thick`/`--border-focus` (keep ring, but zip end-shapes have 1.5px `--surface-default` halo); y ticks = 5 linear steps from `min*0.95`..`max*1.05` (ts:~120-135) = non-"nice" ticks, vs zip 1/2/5x10^n steps, zero always a tick, M/K units
  (chart-liquidez-support-tests: «17,5 M €», real minus U+2212, chart-additions K·ticks); xTicks stride 8 vs axisLabels; no area/gradient style; right inner room for endpoint/last label absent; fixed 960x320 viewBox (finding 3). Dark: zip lifts `--chart-data-primary` to azul-profundo-400 and gradient start opacity 0.9
  (tokens exist: semantic.scss:1233,1262) but we don't read them; tests/dataviz-dark-contrast-tests.html: every mark >=3:1 on `--surface-default` AND `--canvas-primary`; light unchanged (0.38 gradient).
- **Behaviour/a11y gap:** we have roving tabindex across marks, arrows/Enter/Esc (chart-keyboard.ts:156-166), `role=graphics-symbol` + per-point aria-label, sr-only 4-property description; missing **Home/End** (zip tests chart-additions "Teclado: una parada de tab, Home/->/End"), **polite live region** announcing the readout model while the plot is focused (chart-liquidez-support-tests, chart-additions), **Esc consumed only when a readout is visible**,
  hover guide + dots, milestone group as tab stop with accessible name incl. label (chart-milestone-tone-tests: Tab/Enter selects, hover leaves single tooltip), selection pin dashed guide. Touch: no tap-to-pin spec on ours. Zip regression suites that would bind: tools/chart-additions-tests.html (regression-identical DOM when new props omitted; stroke legend; tooltipModel; columns; endTag/objective plate; band; gap; zero marker; stacked selection),
  tools/chart-line-examples-tests.html (3-series defaults, end shapes, one dashed = objective only), tools/chart-liquidez-support-tests.html, tools/chart-xtitle-legend-tests.html, tools/chart-milestone-tone-tests.html, tools/dataviz-dark-contrast-tests.html, tools/chart-stacked-axislabels.test.html (axisLabels thinning at 375px, 6px collision rule, final label kept).
- **Verdict: structural (L).** Not reachable by restyle; needs a measured-container, series-based line (new `afi-chart` or a rewrite of chart-line to the zip model). A restyle-only pass on today's chart-line = swap `--data-*`->`--chart-*`, nice-tick fix, axis tokens (S-M) but it would still lack everything above.
  Tokens needed: all exist except none new for line; `--chart-data-comparison*`, `--chart-range-*`, `--chart-value-negative-label`, `--chart-annotation-ink*` exist. Milestone icon SVGs (9) are new assets, not tokens.

### chart-bar -> Chart `type="bar"` (+ `register="sparkline"`, Sparkline `type=bar`, RankedBars for the horizontal case)
- **API gap:** ours `data: BarDatum[]{key,value,label?}`, `orientation` vertical|horizontal, `sort`, `hideAxisTicks`, `unit`, `referenceValue`/`referenceLabel`, `valueLabelInside`, `focus`, output `dataPointActivated`.
  Zip has NO horizontal orientation or sort in Chart (the horizontal ranked case is `RankedBars{items,format,sort,focusFirst}`, a different DOM list with 8px Meter-style track, zip:RankedBars.prompt.md) -> our horizontal bar ~ RankedBars; our `valueLabelInside`/`unit`/`sort` have no zip analogue (keep, flag as AFI-only).
  Missing from zip: `categories`+`data`/`series[]`; `highlightLast` (static chart has NO highlighted column; interactive highlights point); `signed: true | 'negative'` (we auto-red any <0 = zip `signed:'negative'`-like but with no green option, no `signed:true` rate mode, no 40% fade of coloured columns, grey never fades);
  `selectedIndex`/`onSelect` (hover previews, click/tap/Arrows/Home/End select, dashed crosshair), `hoverIndex`/`onHoverChange`; `series[].as:'line'` overlay line with 5px halo; `band`; `endTag`; `reference {value,label,labelPosition start|end|outside|auto,legend}` + `referenceTone` (ours: single string label forced to right margin, `referenceLabelText` "name: value" ts:~190); `axisFormat`, `axisLabels`, `xAxisTitle`, `legend`/`legendTrailing`, `milestones`, `markers`, `gap`, `endLabels`, `style` solid|gradient|hatched, `tooltipMode`/`tooltipModel`, `register`.
- **Look gap:** default bar fill = `--data-neutral-strong` = `--chart-neutral-label` (dark ink, aliases.scss:130) and highlight `--data-highlight-primary`; zip: normal = `--chart-data-muted` (control-200 / dark control-500), highlighted = `--chart-data-primary`, selected-only emphasis in interactive mode; negative: ours `--chart-negative` hex vs zip `--chart-value-negative` (themed, dark parity). Radius: ours square rect (no rx); zip `--radius-chart-bar` 2px on the two corners away from axis, capped at 1/3 width (exists, semantic.scss:783).
  Hover: ours opacity .8 (scss:12); zip: hovered bar -> primary, others stay (grey never fades). Reference: ours `--border-default` hairline dash 6 4, label `--foreground-secondary-default`, no plate; zip: neutral rule `--chart-reference-neutral` / tone, label on `--surface-default` plate (`--space-3xs/2xs`, `--radius-sm`), legend swatch 1px `3 5` dash. Zero rule: ours `--border-strong` thick (scss:39), zip 1px `--chart-neutral-axis`. Axis ticks: our `niceTickStops` (chart-axis.component.ts:~55-90) takes a 1/2/5 fraction but 5 ticks target, formats with formatNumber (no K/M, no U+2212); zip max 3 steps, whole-step top/bottom, M/K unit. Gradient/hatched styles absent; dark gradient start 0.9 absent.
- **Behaviour/a11y gap:** marks are focusable rects with aria-label (good); lacks Home/End, live region readout, selection semantics (aria-pressed/selected), single tab stop already OK via nav controller. Zip tests: chart-additions "barras con color de serie y selección: 40% resto", I3/I5 endTag+objective plate, I6 y-scale, `axisFormat` on bar (chart-liquidez-support), dataviz-dark-contrast (faded bar >=3:1 and quieter than highlighted; gradient dark end >=3:1).
- **Verdict: structural (L)** for full Chart parity; **restyle+API gap (M)** if only the "plain bar" is aligned: tokens swap (`--chart-data-muted`/`-primary`, `--chart-value-negative`, `--chart-neutral-*`, `--radius-chart-bar`), reference plate + `--chart-reference-neutral`, axis K/M format; then API growth separately (highlight mode, selection, tooltip, signed variants). Tokens: all exist.

### chart-composition (part-to-whole strip; segments/blocks/ticks) -> no zip equivalent
- Closest zip things: `Chart type="stacked-bar"` (columns, not a single strip), `FigureStrip` (headline cells, unrelated), `RankedBars`, `Meter`. None draws one horizontal composition band. Our component is explicitly foundations-modern (reads `--chart-monochrome-strong/medium/soft/faint` INKS, chart-composition.component.ts:25-30; embeds `TableV2Component`, ts:imports) so it is modern-foundation scope, not AFI-default traditional.
- Gap: n/a. Note zip colour rule says stacked series use `--chart-data-primary/secondary/tertiary` (<=3) or `--chart-category-1..7` (4-7), "never plain grey" — composition's monochrome ramp breaks that rule if ever used under AFI default.
- **Verdict: no zip equivalent (modern-only; out of AFI-default scope). Size: n/a.**

### chart-heatmap -> no zip equivalent
- Zip has no matrix chart. Zip `--chart-scale-1..4` (+ `-ink`) is the sequential bands scale (ReturnRuler) and is the natural replacement for our 4-step `resolveDivergentColor` sequential branch (chart.variants.ts:88-92: neutral-muted/medium/highlight-secondary/primary), but not the divergent one.
- **Bug (independent of zip):** `--data-diverge-pos/neg-300/500/700` undefined (finding 2) -> divergent mode paints nothing.
- Look: cell stroke `var(--surface-base, white)` hard fallback (scss:10); labels `fill-neutral-500`.
- **Verdict: no zip equivalent. Size S to fix divergent tokens (define `--data-diverge-*` or map to `--chart-value-positive/negative` + `--chart-scale-*`) — token dependency: those tokens are NOT created.**

### chart-dumbbell -> no zip equivalent
- Closest: Chart line-comparison with `gap` bracket (two series at last category) or `reference`; none is a per-category dumbbell. Look debt: stroke `var(--color-neutral-300)` (html:39, a primitive colour, bypasses semantic layer), `fill-neutral-600` text; dots use series palette `--data-*`.
- **Verdict: no zip equivalent. Size S (token hygiene only: `--color-neutral-300` -> `--chart-neutral-axis`/`--border-subtle`).**

### chart-axis / chart-legend / chart-tooltip / chart-instructions / chart-data-table / chart-keyboard / chart-a11y / chart-format (shared parts) -> zip internals of Chart
- chart-axis: nice-number ticks target 5, `formatNumber` (no K/M, no `axisFormat`, no U+2212); zip: 1/2/5 steps, <=3 steps, zero a tick, M ("0,5 M €", no trailing ",0") / K units, edge labels shifted inward, label thinning 6px, `xAxisTitle`. **restyle+API (M)**.
- chart-legend: swatch = 14px rounded rect, texture pattern URL (broken, finding 3), text `text-neutral-600`; zip legend swatches are the mark: 16px piece of the line (colour+width+dash), band swatch, reference swatch (1px `3 5`), soft-hatch swatch, `kind:'reference'` items, `legendTrailing` note, "Por debajo de cero" auto item. **API gap (needs input: item kind/stroke/trailing) (M).**
- chart-tooltip: ours = single title/value/secondary box, `--surface-elevated`, `--radius-md`, `--spacing-8/12` (aliases only), `--elevation-md`, `font-size body-sm`, fade 120ms; zip: compact dark chip OR structured series-list (swatch + name + right-aligned tabular value, heading, meta, columns, strong row, total, milestones, role=tooltip, max 320/400px, flips and clamps to chart+viewport) — **API gap/structural (M-L)**; tests chart-additions (tooltip inside chart, voltea en borde derecho), chart-liquidez-support.
- chart-keyboard: Enter/Arrows/Escape only (chart-keyboard.ts:156-166); add Home/End; Esc-consume-only-when-visible; live-region hook. **API gap (S-M).**
- chart-instructions ("?" toggle) and chart-data-table (expandable table) = AFI a11y features with no zip counterpart (the zip puts the data table in DataSection `view` toggle); keep.

### Mode map: zip chart modes -> what ours lacks
| zip mode (card / test) | maps onto | lacks |
|---|---|---|
| stacked-bar (chart-stacked-segments card, chart-stacked-axislabels test) | none (composition is a strip, not columns) | whole type: 2-4 series, 1.5px surface seams, `sign:'negative'` deficit below zero, selection+fade, columnHover, category-1..7 ramp, centred axisLabels |
| milestones (chart-milestones card, chart-milestone-tone-tests) | none | lane, 9 icons, cluster/stack/+N, tone:'negative', hover spread, selection by marker |
| scale (chart-scale card) | none (`--chart-scale-1..4` tokens exist; used by ReturnRuler) | ReturnRuler component (see unmatched) |
| soft-remainder / hatch (chart-soft-remainder card, chart-soft-hatch-tests) | none | `series[].treatment:'soft-hatch'` + `tone`, 3px min seg, solid 1px outline, swatch reproduction; `style:'hatched'` (our texture resolver is unwired) |
| reference lines (chart-reference card) | bar: partial (`referenceValue/Label`); line: none | line reference, tone, plate, labelPosition, legend item, joins scale |
| tooltip (chart-tooltip card) | chart-tooltip (single box, unused by bar/line) | modes, tooltipModel, columns, live region |
| scrub (chartpanel-scrub card, ChartPanel) | none | controlled `hoverIndex`, external readout, `columnHover`, ChartPanel header/toolbar |
| x-title / legend (chart-xtitle-legend-tests) | chart-legend (broken swatches) | `xAxisTitle`, `legendTrailing`, legend-under-title ordering |
| liquidez support (chart-liquidez-support-tests, chart-evolucion card) | `LiquidezEvolucionChartComponent` (demo-local, uncommitted) around chart-line | `axisFormat`, `tooltipModel`(+milestones), pinned selection w/ `selectionLabel`, `endTag`, `signed` line, dark trio of comparison tokens |
| colour rule (chart-colour-rule card) | n/a | rule encoded in props: muted normal, primary shown column, negative-only problems, no green; our bar auto-red satisfies only "negative" |
| series options (chart-series-options card) | n/a | `stroke`, `endShape`, `as:'line'`, `signed`, `color` per series |

## 2. animated-chart -> no zip equivalent
- Zip has no animated card bar chart; closest = `Sparkline`/`Chart bar` (static; no entry animation) and `Meter`. Ours: N columns, `size sm|md|lg`, `maxValue`, `restartOnDataChange`, `column.series 1-8`, `column.color`, caption; grow animation via `scaleY` + reduced-motion.
- **Look/token debt:** reads primitives `--color-data-viz-series-{n}` directly (animated-chart.component.ts:~40; variants.ts doc) — skips the semantic layer (`--chart-data-*`); sets column title and numeric value text in the SERIES colour (html:15,35,41 inline `[style.color]`), which fails text contrast for light series (zip rule: marks need 3:1, text needs ink roles `--chart-*-ink`/`--chart-neutral-label`). Sizes via `--dimension-30/45/60`. Radius `--radius-xs/sm`.
- **A11y:** whole chart `role="img"` + generated aria-label, columns `aria-hidden` — acceptable (zip tests none for this).
- **Verdict: no zip equivalent. Size S if aligned to zip colour rules (route through `--chart-data-*`/`--chart-category-*`, ink text neutral, keep animation).**

## 3. table -> Table (zip:components/data/Table.jsx, .d.ts, .prompt.md; cards table-*.card.html)
- **API gap (zip props we lack):**
  - `density` 3-step compact|default|comfortable (ours `compact|comfortable`, default `compact`, table.variants.ts:7-8) — row heights are padding-driven in ours; zip 32/44/56px rows via `--afi-row-h` (zip:_ds_bundle.js:6937-6939; NB zip Table.d.ts doc says 36/52/64 — conflicts with its own CSS, ask the zip authors which is canonical).
  - `appearance:'planning'` (Roboto 400 15/20, headers 14/20 wrapping, 48px rows, `--table-planning-*`); none in ours.
  - `hover` auto (on only when onRowClick / selection / children / actions; sortable-only = no fill, no pointer) vs ours `rowHoverable` default true.
  - `rows[].variant:'reference'` (pinned above data regardless of sort, inert: no hover/click/actions, excluded from totals, hairline above, italic secondary label) vs ours `muted` magic key (italic+tertiary only, not pinned, still hoverable) -> rename/behaviour.
  - `footer` totals row (`tfoot`, 600 primary, thick top rule); ours none.
  - Selection: `selectionMode:'leaves'` (tri-state group boxes, leaf-only keys), `selectOnRowClick` (whole-row target, interactive-descendant exclusion, `[data-no-row-select]`, Space on group row selects/Enter expands), `selectionVisible`, `selectAllLabel`, `row.disabled`, all-disabled -> select-all disabled, `selectedKeys` as keys (ours `selected` = row objects + `selectedChange` emits objects; our group AND child rows both get boxes -> double-count risk).
  - `treeColumn` + `columns[].selection:true` (hierarchy in non-first column; selection column shrink, name starts `--space-xs` after box, child +24px indent); ours chevron is always first column (html:116-139) and precedes the label (zip: chevron FOLLOWS label, 4px gap, 20px box).
  - `columns[].numeric`, `.strong`, `.minWidth`, `.render`, `.align left|right` (ours `align start|center|end`, `emphasis`, `kind badge|text`, `toneKey`, `group/groupLabel` scorecard headers, `cellTemplates` — AFI-only, keep).
  - Actions: array form with rule (1-2 inline, 3+ first inline + ••• portalled menu), `inlineActions 'auto'|n|0`, `tone:'danger'`, `variant ghost|outline`, `disabled`, `actionsVisible`, 20px icon in 32px target; ours `rowActions[{key,label,icon: edit|delete|more|duplicate|archive,variant,overflow}]` + `actionsReveal always|hover|soft` — works but icon set is closed enum (zip takes arbitrary icon node/SidebarIcon names: pencil, trash-2, eye, copy, download), no `disabled`, overflow flag instead of count rule (already implements the 1-2 inline rule per types doc).
  - `rowPadding`, `flush`/`inset` (zip default flush; ours flush only through page-header host vars `--afi-table-first-cell-pad` etc., page-header.component.scss:57-124 — equivalent mechanism, no input), `highlightKey` + `onHighlightEnd` (ours `highlightedRowKey`, no end output, no scroll-into-view), controlled/uncontrolled `expandedKeys`/`defaultExpandedKeys`/`onToggleExpand` (ours `expandedKeys` + `expandedKeysChange`), `onRowClick`, `sortBy`+`sortDir` split (ours `sortBy:{column,direction}`).
- **Look gap:**
  - Header font: zip `--table-header-font` = `--type-body-sm-600` (600), foreground tertiary, divider `--table-header-divider`=`--border-subtle`, no fill; ours `--type-body-sm-500` (table.component.scss:~100, 108) -> 500 vs 600.
  - Cell ink: zip `--table-cell-foreground` = `--foreground-secondary-default`, group 500 primary (`--table-group-*`), child secondary, totals 600 primary; ours `__td` colour = `--foreground-primary-default` (scss:~370), no group-weight, child via CSS indent only. Net: our body text is one ink step stronger than zip, and level-1 group has no 500/primary distinction.
  - Hover: zip row bg `--table-row-background-hover` (= control-100; dark control-800) with `--radius-table` (exists) on first/last cells; ours `::before` pill `--surface-hover` (control-50) inset `--space-2xs` with `--radius-md` and extend vars (scss:~210-285) -> different colour step + radius token + implementation (pseudo vs cell bg). Selected: both `--surface-selected` OK.
  - Dividers: zip `--afi-divider` = hairline `--border-subtle`, last row no border; ours `--border-hairline` (alias of border-subtle) fine; planning footer `--table-planning-footer-divider`.
  - Highlight: zip soft **info** tint `--feedback-info-background` holds then fades ~2s, scrolls into view; ours `--feedback-success-background` 1.8s ease-out (scss:~236-250, keyframes) -> colour role differs.
  - Tone cells: ours `--feedback-*-foreground`; `tone-info` = `--color-action-500` (a primitive-ish colour, scss:~340; should be `--feedback-info-foreground`). Zip uses `ValuePill`/`Badge` for verdicts (Table-value grammar) rather than tinted text; tone text = AFI-only.
  - Sort glyph: zip single dual-direction mark at 0.4 opacity, active `--foreground-brand-default` + half at 1.0, 12px; ours `__sort-icon` 3-dimension (12px) in `--foreground-secondary-default` (check chevron vs dual glyph in html:45-60).
  - Sizes: ours expand chevron 14px, `aria-label` generic; zip toggle 20px box, 14px glyph. Checkbox: ours always `size="sm"`; zip sm (16) for compact/default, md (18) for comfortable, hit area 24 x row-height (tests: tools/checkbox-sizing-tests.html).
  - `--table-*` tokens do not exist in libs/tokens (24 names: header-font/foreground/divider, cell-font/foreground, group-font/foreground, child-foreground, footer-font/foreground/divider?, action-icon-size, action-target, row-background-hover, planning-* x11). `--afi-row-h`, `--afi-cell-px`, `--afi-tree-indent`, `--afi-content-inset`, `--afi-sel-gutter`, `--afi-sel-pad` are zip component-local custom props (set in zip table CSS), NOT tokens — they belong in table.component.scss, not libs/tokens.
- **Behaviour/a11y gap:**
  - Group toggle name: zip «Expandir Inmobiliario» / «Contraer Inmobiliario» (includes row label) + `aria-expanded` + group row `tabindex=0`, Enter/Space on row toggles (tools/table-tree-column-tests.html: ARIA toggle name w/ label, tabindex 0, Space/Enter on row, checkbox click never toggles row, Space on checkbox doesn't toggle, invalid treeColumn falls back + warns). Ours: toggle button aria-label fixed «Expandir fila»/«Colapsar fila» (html:126), rows not focusable/key-operable.
  - Checkbox name: zip «Seleccionar <row label>»; ours fixed «Seleccionar fila» (html:111) (all rows share one name).
  - `aria-sort`: zip sets `none` on inactive sortable columns; ours sets via `ariaSort()` (ts:447) only when sortable — check returns 'none' (likely ok).
  - Leaves selection regressions (tools/table-selection-leaves-tests.html): empty-cell click selects, Switch/Input click doesn't, checkbox toggles once, no extra tab stop, group tri-state + dash, disabled leaf skipped, header indeterminate, collapsed group keeps dash and visible box, **no group keys in emitted selection**. Ours has none of these (no leaves mode, no row-click select, groups emit as rows).
  - Hover-reveal checkbox: zip also reveals on keyboard focus-within and keeps visible once selected/partial; ours reveals via `--afi-table-select-checkbox-rest-opacity` host var; `:focus-within` reveal not present for the select cell (only `.row:hover`, `.row--selected`) -> checkbox can take focus while transparent in page-header context.
  - Row actions: zip actions column reserves width (no scrollWidth shift), menu portalled/flips above on last rows; ours uses `afi-menu` (same intent) — verify portal clipping inside `.afi-table__scroll` (overflow auto).
  - Row actions touch target: zip 32px target, 20px icon; ours icon buttons `--dimension-4/5` (scss:487,512) ~ 24-32 — check 32.
- **Verdict: API gap (L)** for full parity (new inputs: density 'default', appearance, hover auto, reference-row variant, footer, selectionMode/selectOnRowClick/selectionVisible, treeColumn+selection column, inlineActions/tone, highlightKey end/scroll) **plus a restyle slice (M)**: header 600, cell/group/child inks, hover token+radius, info highlight, `tone-info` token — all SCSS/token swaps and are doable independently first.
  Token deps: create `--table-*` (24, semantic.scss, light+dark: row-background-hover dark = control-800) — NOT yet created; `--radius-table`, `--surface-selected`, `--icon-button-size-lg`, `--icon-md`, `--type-body-sm-600`, `--border-subtle`, `--feedback-info-background` exist.

## 4. table-apron -> no zip equivalent
- Zip Table has no result-count/filter-token strip. Closest zip guidance: bulk actions go "in the page's filter row, pinned right, only while rows are selected — «3 seleccionados · Cancelar · Borrar»" (zip:Table.prompt.md, Selection) and DataSection `filters`/`legend` rows. Ours: floating capsule showing `shown/total`, removable filter tokens, selection count + icon-button bulk actions; paired with `afi-table-v2`, reads only foundations-modern tokens (`--background-hover`, `--borders-default`, `--content-*`, `--stroke-default`, `--gap-control-*`, `--pad-control-lg`, `--radius-full`, table-apron.variants.ts:tokenUsage). Modern-only; not rendered under AFI default.
- A11y is good already (role=status polite, "de" phrase sr-only, "Quitar {label}" buttons).
- **Verdict: no zip equivalent (modern-only, out of AFI-default scope). Size: n/a. Possible overlap to decide later: zip's pattern puts bulk selection UI in the page filter row, so an AFI-default table likely needs no apron.**

## 5. Verdict table
| primitive | verdict | size |
|---|---|---|
| chart-line | structural | L |
| chart-bar | structural (plain-bar restyle slice: restyle M) | L |
| chart-axis | restyle + API (ticks/format) | M |
| chart-legend | API gap + live bug fix | M |
| chart-tooltip | structural (readout system) | M-L |
| chart-keyboard / a11y helpers | API gap (Home/End, live region) | S-M |
| chart-heatmap | no zip equivalent (fix undefined `--data-diverge-*`) | S |
| chart-dumbbell | no zip equivalent (token hygiene) | S |
| chart-composition | no zip equivalent (modern-only) | n/a |
| chart-instructions / chart-data-table | no zip equivalent (keep) | n/a |
| animated-chart | no zip equivalent (route colours via `--chart-*`) | S |
| table | API gap (restyle slice M first) | L |
| table-apron | no zip equivalent (modern-only) | n/a |
Counts across 13 rows: structural 3 (line, bar, tooltip), API gap 3 (table, legend, keyboard), restyle+API 1 (axis), no zip equivalent 6 (heatmap, dumbbell, composition, instructions/data-table, animated-chart, table-apron), match 0.

## 6. Unmatched zip components (no equivalent in my four primitives)
- **ChartPanel** — full-page chart panel: label + big tabular value + inline delta (green/red ink), as-of caption, ruled toolbar (range selector + download of plotted data as HTML table), `mode` tooltip|readout (scrub via `hoverIndex`).
- **DataSection** — the «Sección de datos» pattern in one framed box: header/filters/answer line/FigureStrip/legend/view toggle/chart-or-table/detail rows/footer; `readout.placement:'side'` (tests: tools/datasection-readout-side-tests.html, datasection-tests.html).
- **FigureStrip** — 2-4 joined headline cells with ok/problem chip and optional pin toggle (`aria-pressed`, 2px `--chart-data-primary` underline); stacks <560px.
- **RankedBars** — label/value/proportional bar list (8px Meter track), top row primary, rest `--chart-data-muted`, negatives red; maps loosely to our horizontal `afi-chart-bar`.
- **ReturnRuler** — horizontal 4-band difficulty ruler (`--chart-scale-1..4`) with solid/dashed marks for required vs actual return; full + compact (tools/returnruler-tests.html).
- **Sparkline** — cell-sized bar/line strip with optional objective rule; no axes/hover; sign-keyed bars (maps to `afi-chart-bar register=sparkline` idea; we have nothing cell-sized).
- **SummaryPanel** — page-top 2-4 key figures on a tinted surface with optional footer; needs new `--summary-*` tokens (not created).
- **DataList** — `<dl>` label/value rows with description, help, total, `compare` mode; tests datalist-divider/datalist-chart-resize (not in my scope; flagged because of its chart-resize regression coupling).
- (Table-adjacent, other auditors) Meter, ValuePill, StatusChip, Badge used by Table-value grammar.

## 7. Suggested sequencing (for the planner, not a recommendation to start)
1. Token slice first (S): create `--table-*` + `--summary-*`; define or remove `--data-diverge-*`; repoint chart `--data-*` consumers to `--chart-*`; fix legend pattern bug.
2. Table restyle slice (M), then table API slices as separate briefs (leaves selection / tree+selection column / reference row+footer / planning appearance).
3. Decide Chart strategy before any chart work: new `afi-chart` (zip model, measured width, series) vs retiring bar/line. Don't grow chart-line in place; the in-flight liquidez wrapper shows the gap but composes rather than extends (no DS API growth).
