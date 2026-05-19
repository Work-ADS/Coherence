# Accessibility — agent rules for ANY component rendered to users

> Consulted before a component's template is written. Passes before merge. Paired with `clean-code.md` in the component pre-flight.

## Baseline (LOCKED 2026-04-16)

- **WCAG 2.2 AA minimum, AAA where text + touch are involved.**
- **44×44pt minimum touch target** on anything clickable. Desktop-only dense-mode components opt out and document the reason.
- **Contrast AA for body, AAA for small text.** The DS site pair-contrast checker enforces.
- **Keyboard-operable everything.** If it's clickable, it's reachable via Tab and actuatable via Enter or Space.

## Non-negotiables

1. **Semantic HTML first.** `<button>`, `<a>`, `<input>`, `<label>`, `<nav>`, `<main>`. `<div role="button">` is a last resort — when used, full manual aria + keyboard handling required.

2. **Label every control.** Visible `<label for>` tied by `id` **or** `aria-labelledby` pointing to visible text **or** `aria-label` when genuinely iconic and unambiguous. "Save" icon with no label = fail.

3. **Focus is visible.** `focus-visible` ring uses the `--focus-ring` token (2px, `action-500`). Never `outline: none` without a replacement. Never strip focus off something that stays interactive.

4. **Focus order matches visual order.** If a drawer opens to the right, Tab moves into the drawer first. Use Angular CDK `FocusTrap` for modals + drawers.

5. **Announce dynamic changes.** Toast / snackbar / live validation uses `aria-live="polite"` (default) or `assertive` for errors. Loading states use `aria-busy="true"`.

6. **Color is never the only cue.** Error = red border + error icon + text. Success = green check + text. Required = asterisk + `aria-required`. Color-blind users pass through unaffected.

7. **Touch targets ≥ 44×44pt.** Dense desktop components (`control-h-sm`) opt out with a documented comment **and** an `aria-label` that stays compact but unambiguous.

8. **Reduced motion respected.** Any animation > 200ms or > 4px translation checks `prefers-reduced-motion: reduce` and collapses to fade-only or instant. Applies to Angular `@keyframes` and CDK portal transitions.

9. **Skip links** on any page with 3+ landmark regions. Tab 1 = "Saltar al contenido principal."

10. **Forms announce errors.** `aria-invalid="true"` + `aria-describedby` pointing to the error text. Error appears on blur, not on keystroke — exception: password-strength meters.

## Per-primitive quick checklist

**Button**
- [ ] `<button type="...">` (never `<div>`), `type` set explicitly
- [ ] `aria-label` if icon-only; otherwise visible text IS the label
- [ ] `aria-pressed` for toggle variant
- [ ] `disabled` attribute + styles + `aria-disabled` when non-interactive by state, not prop

**Input / Textarea**
- [ ] `<label for>` paired with `id`
- [ ] `aria-describedby` pointing to hint + error
- [ ] `aria-invalid="true"` on validation fail
- [ ] `autocomplete` attribute for personal info

**Select / Combobox**
- [ ] Native `<select>` when it fits. Else CDK Listbox pattern.
- [ ] Arrow keys navigate options, Enter selects, Esc closes
- [ ] `aria-expanded`, `aria-controls`, `aria-activedescendant`

**Checkbox / Switch**
- [ ] `<input type="checkbox">`; `role="switch"` only for true on/off (not selection)
- [ ] `aria-checked` state mirrors `checked` for custom implementations

**Modal**
- [ ] CDK `FocusTrap` + `A11yModule`
- [ ] Focus lands on first interactive on open
- [ ] Esc closes; explicit close button always present
- [ ] Focus returns to trigger on close
- [ ] `role="dialog"` + `aria-modal="true"` + `aria-labelledby`

**Drawer** (DS-specific — no overlay, page stays interactive)
- [ ] Same as Modal but: click-outside closes; no `aria-modal`
- [ ] Arrow-nav between rows uses `aria-controls` → next row's drawer content
- [ ] Position indicator ("1 de 5") announced via `aria-live="polite"`

**Table**
- [ ] `<table>` + `<thead>` + `<th scope="col">`
- [ ] Sortable columns: `aria-sort="ascending|descending|none"` on `<th>`
- [ ] Row-selection checkboxes have `aria-label` referencing the row identifier
- [ ] Empty state announced via `aria-live`

**Tabs**
- [ ] CDK a11y tablist pattern
- [ ] Arrow keys cycle, Enter activates, Home/End jump
- [ ] `role="tablist"` → `role="tab"` → `role="tabpanel"` linked

**Toast**
- [ ] `role="status"` for success/info, `role="alert"` for error
- [ ] Auto-dismiss at 5s for info; manual-only for errors
- [ ] Action button (e.g., Undo) reachable before auto-dismiss fires

**Inline-edit row panel** (DS-specific — AWM Import pattern)
- [ ] Expansion announced via `aria-expanded` on the row
- [ ] Editor panel has `role="region"` + `aria-label`
- [ ] Focus moves into the editor on expand, returns to row on collapse
- [ ] "Usar" shortcut buttons have explicit labels: `aria-label="Usar valor del proveedor"` etc.

## Pre-flight checklist (runs before merge)

- [ ] All interactive elements keyboard-reachable and actuatable
- [ ] All interactive elements have visible focus via `--focus-ring`
- [ ] All non-text content has a text alternative
- [ ] Contrast AA (body) / AAA (small) — verified via pair-contrast tool
- [ ] Touch targets ≥ 44×44pt unless opted out with reason
- [ ] `prefers-reduced-motion` handled for any motion > 200ms
- [ ] Live regions announce dynamic content (toasts, form errors, loading)
- [ ] Tested with VoiceOver (macOS) + NVDA (Windows) for at least the golden flow

## Anti-patterns (seen in wild, don't)

- `role="button"` on `<div>` without `tabindex="0"` + keyboard handler → use `<button>`
- `placeholder` as the only label → always a real `<label>`
- `outline: none` without a focus-visible replacement → fails immediately
- Animation that can't be disabled by `prefers-reduced-motion` → ships broken for vestibular disorders
- Icon-only button with no `aria-label` → SR announces "button" and nothing else
- Error text rendered but not associated via `aria-describedby` → SR users never hear it
- Modal that closes but doesn't return focus → user lands at `<body>`, lost

## When a rule doesn't fit

Document the exception in the component's docstring with the WCAG success criterion it trades against. If you can't name the criterion, the exception isn't justified.
