# Pattern — typeahead search + result cascade

> Prepend [`_foundation.md`](./_foundation.md) before using this.
>
> Append [`overlay-extrude-reveal.md`](./overlay-extrude-reveal.md) too. The
> suggestion panel below **is** that pattern, unchanged — this file does not
> repeat its numbers.
>
> Catalog: the result cascade is [`motion-skill.md §4.7`](../rules/motion-skill.md)
> (`stagger-reveal`), run deliberately against that section's own rule. The
> exception ships in code (`TableV2Reveal`, opt-in) but has **no catalog entry
> yet** — see "The rule this breaks on purpose".
>
> Shipped in `afi-search-v2` + `afi-table-v2` with `reveal="stagger"`. The
> interaction was designed first on our Patrimonio screen as one-off markup;
> these are the productised v2 primitives.

**Use for** — a search field that filters a list or table in place and previews
its matches while you type. Not for a search that navigates away, and not for a
command palette that takes over the screen.

Three things move, and they are three separate events:

1. The **field** responds to focus. Instant.
2. The **suggestion panel** opens out of the field and fills with matches.
3. The **results underneath** re-enter with a blur-and-rise cascade, every time
   the query changes.

Build them independently. The panel and the results are not choreographed
together and must not wait on each other — they answer different questions
("what could you mean?" and "here is what you get"), and a user who ignores the
panel still needs the results to land on time.

## Anatomy

```
label (optional)
┌──────────────────────────────────────┐
│ ⌕  query text…                    ×  │   ← field
└──────────────────────────────────────┘
   ↓ 4px
┌──────────────────────────────────────┐
│  Ava Bennett                2.400 €  │   ← panel: one row per match
│  #52000 · Nuevo                      │      label / description / trailing
│  Tessa Foster               3.600 €  │
│  #52003 · Nuevo                      │
└──────────────────────────────────────┘

   the filtered table or list, re-cascading           ← results
```

The panel matches the field's width exactly and is anchored to it, not nested
inside it — it must escape any scrolling or clipping ancestor. Flip it above the
field when there is not enough room below.

## The field

| | |
|---|---|
| Height | 28 / 32 / 40px (`--height-component-sm/md/lg`) |
| Horizontal padding | 8 / 10 / 12px (`--pad-control-sm/md/lg`) |
| Gap between parts | 4px (`--gap-control-sm`) |
| Radius | 8px (`--radius-lg`) |
| Border | 1px hairline (`--stroke-default`) |
| Text | 13px / 18px line-height, regular |
| Leading + clear icons | 16px (`--icon-sm`), secondary tone |
| Label, when present | 12px medium, 4px above the field |

States:

- **Hover** (unfocused) — background and border step to their hover tone over
  150ms (`--motion-duration-fast`) on the standard curve.
- **Focus** — border takes the focus tone plus a 2px inset ring.
  **Instant. Never transitioned.** The ring is an accessibility signal, and a
  signal that fades in is a signal that arrives late.
- **Disabled** — disabled surface and border, no hover.

Two details that are easy to lose:

- The focus ring rides on the **wrapper**, driven by focus *within* it, because
  the real focusable element is the bare input inside. Do not put the ring on
  the input.
- Kill the browser's native search decorations (the magnifier and the "×" some
  engines inject). You own both affordances; two clear buttons is a bug.

The clear button appears only when the field has a value, and returns focus to
the input after clearing. It never closes the panel by itself.

## Phase 1 — the suggestion panel

Motion is [`overlay-extrude-reveal.md`](./overlay-extrude-reveal.md) exactly:
150ms `clip-path` wipe downward out of the field with a 2px tuck, then rows fade
and rise in at 200ms each, base delay 150ms, +40ms per row, capped at ten.

Panel chrome: surface fill, 1px hairline border, 12px radius, 4px padding, 2px
between rows, 200px minimum width, two-layer shadow
`0 2px 4px 0 #0000001a, 0 4px 16px 0 #0000000d`.

Row: 32px tall, 6px radius, 8px horizontal padding, three slots on one line —
**label** (13px, primary, truncates), optional **description** underneath (10px,
secondary, truncates), optional **trailing value** (right-aligned, secondary,
tabular figures). Hover and keyboard-highlight use the same tint; in a listbox
the roving highlight *is* the focus affordance.

Cap the visible height at eight rows, then scroll. Sized for two-line rows that
is 342px.

### When the panel is allowed to open

Open only when **all three** hold: the field has focus, the query is non-empty,
and there is something to show. Specifically:

- Empty query → **no panel**, ever. A search field is not a menu, and a list of
  everything is not a suggestion.
- Matches → the panel.
- Query but no matches → the same panel chrome with a single line of secondary
  text ("Sin coincidencias."). One line, not an illustration.
- No suggestions wired at all → **no panel**. The field is then a pure filter and
  the filtered results are the entire feedback. This is a legitimate way to use
  the component, not a degraded one.

Close on: Escape, outside click, or a pick. Reposition on scroll and resize —
the panel is anchored to a viewport rectangle, so it must follow the field.

Defer the close-on-blur by a tick. A click on a suggestion fires *after* blur,
and a panel that tears itself down first will swallow the click.

Picking a suggestion writes its label into the field, which narrows the results
to that one thing. The panel is a shortcut into the filter, not a separate
navigation.

## Phase 2 — the result cascade (the blur transition)

This is the part people remember. Every visible result row enters independently:

| | |
|---|---|
| Duration | 500ms (`--motion-reveal-duration-normal`) |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` (`--motion-easing-enter`) |
| Fill mode | both |
| Stagger | 40ms (`--motion-reveal-stagger-light`) |

- `opacity` from 0 to 1
- `transform` from `translateY(10px)` to `translateY(0)` (`--motion-reveal-rise-normal`)
- `filter` from `blur(14px)` to `blur(0)` (`--motion-reveal-blur-heavy`)

Delay per row, where `n` is the row's 1-based position in the *current* result
set:

```
delay = (n - 1) * 40ms
```

No base offset. The results do not wait for the panel — they are answering the
query, not the panel.

**The tier mix is deliberate.** This is the `light` stagger (40ms, the tier for
many small elements, so a long list never overruns) carrying the `heavy` blur
(14px, the strongest in the set). Read the two knobs separately: stagger is
pacing and tracks element count; blur is presence and tracks how much you want
the arrival to register. A 40ms/4px cascade is the same choreography and is
nearly invisible. The whole effect of this pattern lives in that one number.

**Blur the row, not the text.** The blur runs on the row as a whole and must
land at exactly 0. A cascade that settles at `blur(0.5px)` looks like a
rendering fault, not a flourish.

## What replays the cascade

The behaviour, not the animation, is the hard part.

The **page** owns the query and the filters. The table receives resolved rows and
a **change signature** — a string built from every active filter plus the trimmed
query, e.g. `"atrasado|bennett"`. The table folds that signature into each row's
identity key. When the signature changes, every row is a *new* row as far as the
renderer is concerned, so the entrance animation runs again from zero.

Consequences worth designing around, rather than discovering:

- The cascade replays on **every keystroke that changes the result set**, not on
  submit and not on a debounce. That is the intended feel: the list reassembles
  under your fingers.
- Rows that survive a keystroke still re-enter. There is no diffing of "which
  rows are actually new" — the whole visible set replays. Trying to animate only
  the delta reads as broken, because the surviving rows sit still while their
  neighbours move.
- Nothing about the result set depends on the motion. Strip every animation and
  the same rows are on screen in the same order.

One honest edge: the delay is uncapped, unlike the panel's ten-row ceiling. A
twelve-row result set starts its last row at 440ms and settles at 940ms. In
practice a filtered set is short, and the cascade shortens as the user types —
but if you are rebuilding this against long unfiltered lists, cap the index the
way the panel does.

## The rule this breaks on purpose

Our own catalog reserves `stagger-reveal` for **cold** entries — first paint, a
hard refresh, an empty state filling for the first time — and prescribes a plain
150ms fade for **warm** transitions like a filter or search refresh. The
reasoning still stands: the more often a user sees a motion, the less of it it
earns, and a 500ms cascade on a keystroke is latency you added deliberately.

We ship it anyway, here, because the reassembling table is the point of this
particular surface. The terms of that trade:

- It is **opt-in**. The default for the same table is no entrance motion at all.
- It is scoped to one interaction, not made the house default for filtering.
- It collapses hard under reduced motion (below), because the cost lands on
  exactly the users who asked not to pay it.

If you take this pattern into a screen where the user filters constantly and is
heads-down working, take the cascade out and keep the panel. That is the
compliant shape, and it is the right default.

## Keyboard and semantics

The editable-combobox pattern. **DOM focus never leaves the input.**

- Input: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded` tracking
  the panel, `aria-controls` pointing at it, and `aria-activedescendant` naming
  the highlighted option.
- Panel: `role="listbox"`. Rows: `role="option"`, each with a stable id.
- ↓ / ↑ move the highlight and **wrap** at both ends. Home / End jump to first /
  last. The highlighted row scrolls into view — nearest, never centred.
- Enter commits the highlighted option; with nothing highlighted it submits the
  raw query.
- Escape closes the panel and clears the highlight, leaving the query alone. A
  second Escape is the browser's to handle.
- Every printable key just types. No key in this component is stolen from text
  entry.

Announce the result count somewhere outside the cascade — a live "12 of 40"
readout next to the results. The animation carries no information for anyone not
watching it, which includes every screen-reader user and everyone below.

## Timeline

First open, five suggestions, panel mounting:

| Time | Event |
|---|---|
| 0ms | panel starts extruding |
| 150ms | panel open and empty, suggestion 1 starts |
| 190 / 230 / 270 / 310ms | suggestions 2–5 start |
| 510ms | suggestion 5 lands |

One keystroke with the panel already open, five results:

| Time | Event |
|---|---|
| 0ms | result row 1 starts — 14px blur, 10px low, transparent |
| 40 / 80 / 120 / 160ms | rows 2–5 start |
| 500ms | row 1 lands |
| 660ms | row 5 lands, cascade complete |

The panel does not re-extrude while it stays open; only rows whose content
changed re-enter. It extrudes again the next time it opens from closed.

## Reduced motion

- Field, clear button: `transition: none`.
- Panel: `animation: none`, `clip-path: none`, `transform: none`.
- Panel rows: `animation: none`.
- Result rows: **not** "none" — an 80ms linear opacity fade, zero delay, no blur,
  no translate. The rows are genuinely changing, so a hard cut reads as a glitch;
  80ms is under the threshold where motion registers as motion.

Everything still appears, in the right place, in the right order. The state was
never carried by the movement.
