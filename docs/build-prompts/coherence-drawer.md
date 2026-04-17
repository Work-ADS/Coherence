# Build — Coherence Drawer primitive (`libs/ui/drawer/`)

**Source:** `docs/plan.md`
**Surface:** DS-specific side panel. **No overlay, page remains interactive.** Click-outside closes immediately. Arrow-nav between sibling rows with "1 de 5" position indicator. This is the AWM Import row-detail pattern.
**Prereqs:** scaffolding + tokens + Button + Card + Modal (Drawer distinguishes itself from Modal deliberately).

## Scope

One primitive, `<afi-drawer>`, right-edge-aligned, non-blocking.

## Required reads

1. `docs/clean-code.md`
2. `docs/accessibility.md` — Drawer section (DS-specific rules)
3. `docs/component-skill.md`
4. `docs/token-skill.md` — Surface (elevated for the drawer body)
5. `docs/plan.md` — drawer rules locked from AWM brief: no overlay, click-outside closes, arrow nav, position indicator
6. `docs/build-prompts/coherence-modal.md` — the deliberate contrast (Drawer is not a right-side Modal)

## When to use

- Row-detail reveal (Table row → Drawer showing that row's full data + edit affordances)
- Secondary context that benefits from the main page staying visible (compare-to-main, or continue scanning the Table while inspecting one row)
- Settings panel that's frequently referenced (user wants to skim + close + re-open cheaply)

## When NOT to use

- Blocking action / critical confirmation → `<afi-modal>`
- Transient message → Toast (future)
- Primary navigation → `<afi-sidebar>`
- Full-screen flow → dedicated route

## Composition patterns

- **Table row detail:** clicking a row opens Drawer with that row's detail. Arrow nav moves through rows — Drawer content updates; Table row selection updates to match.
- **Filter drawer:** filter controls live in the Drawer while the Table stays visible; filtering updates results live as user toggles.
- **Edit panel:** Drawer contains form for editing a selected entity; Save/Cancel in footer.

## API

| Input | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Two-way via `openChange` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | sm = 400px, md = 480px, lg = 640px (width; full-height always) |
| `title` | `string \| null` | `null` | Header title; wired to `aria-labelledby` |
| `position` | `{ current: number; total: number } \| null` | `null` | Renders "1 de 5" indicator if set |
| `closeOnEsc` | `boolean` | `true` | |
| `closeOnOutsideClick` | `boolean` | `true` | **Default true** — DS-specific; inverse of Modal |
| `ariaLabel` | `string \| null` | `null` | When `title` absent |

**Outputs:**

```ts
openChange = output<boolean>();
closed     = output<'esc' | 'outside' | 'button'>();
navigated  = output<'prev' | 'next'>(); // arrow-nav; consumer updates data
```

**Slots:**

- `[slot=header]` — override default title render
- default slot — body
- `[slot=footer]` — actions

## Key behavior

1. **No backdrop.** Page behind stays visible AND interactive. Drawer is a right-docked panel, not an overlay.
2. **Click-outside closes** (default). Clicking any page content outside the drawer panel emits `closed('outside')`.
3. **Enter:** slide in from right (250ms ease-out). Exit: slide out to right (200ms ease-in).
4. `prefers-reduced-motion`: slide → fade (80ms); position still changes (state visible).
5. **Arrow navigation:** when `position` is set, panel shows two arrow buttons + "N de M" indicator in header. Arrow keys (left/right) on the drawer body fire `navigated('prev')` / `navigated('next')`. Consumer updates the bound row + data. Drawer does NOT own the list of rows — it's a presentation primitive.
6. **Position indicator** announced via `aria-live="polite"` when it changes ("2 de 5").
7. Focus management: focus lands on first interactive element in body on open; on close, returns to trigger.
8. **No focus trap** (distinct from Modal) — user can Tab out of the drawer into the page. That's the point.

## Accessibility

Per `accessibility.md` Drawer section. Primitive-specific:

- `role="region"` + `aria-label` or `aria-labelledby` — NOT `role="dialog"` + `aria-modal="true"` (those would imply blocking).
- Position change announced: `aria-live="polite"` on the position indicator element.
- Close button always present, always keyboard-reachable.
- Arrow-nav buttons have explicit labels: `aria-label="Fila anterior"`, `aria-label="Fila siguiente"`.

## File structure

```
libs/ui/drawer/
├── drawer.component.ts
├── drawer.variants.ts
├── drawer.component.spec.ts
└── index.ts
```

## Copy (hardcoded)

- Close button: `Cerrar`
- Prev: aria-label `Fila anterior`
- Next: aria-label `Fila siguiente`
- Position format: `{current} de {total}` (Spanish — RAE correct)

## Pre-flight

Run `docs/build-prompts/_pre-flight.md` with `<primitive>` = `drawer`.

Drawer-specific additions:
- Verify page behind stays interactive (clicking a visible button outside the drawer fires that button's click).
- Verify click-outside closes (default on).
- Verify arrow-nav fires `navigated` output correctly.
- Verify position indicator updates `aria-live` region.
- Verify Tab can leave the drawer (no focus trap).

## What success looks like

- Clicking a Table row opens Drawer on the right; Table rows remain clickable.
- Drawer shows "3 de 12" in header; right-arrow key advances to row 4.
- Clicking outside drawer → Drawer closes, focus returns to the row that opened it.
- Screen reader on Tab-through announces "Region, Detalle de fila 3 de 12".

## If stuck

- Don't reuse `<afi-modal>` with `position="right"`. They're different components because their interaction models are different (blocking vs non-blocking). Building Drawer on Modal's base will push the wrong a11y semantics.
- CDK Overlay can render the panel, but NO backdrop strategy (or a transparent backdrop that doesn't intercept clicks).
- Body scroll should NOT lock (distinct from Modal).
