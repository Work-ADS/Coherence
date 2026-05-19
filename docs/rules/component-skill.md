# Component skill — agent rules for building ANY primitive

> Consulted BEFORE writing the first line of component code.
> Every primitive in `libs/ui/*` answers to this document.
> If a build prompt contradicts this skill, the skill wins. Builder flags the drift.

---

## Core principle (LOCKED 2026-04-16)

**"Build once, variants for the rest."**

One component file per primitive. Variants via signal inputs + class binding. Never duplicate component files. Same philosophy as shadcn / `class-variance-authority`. Keeps the primitive count real; otherwise Button becomes 6 files and the DS bloats like the one we're replacing.

---

## 1. Architecture (non-negotiable)

Every primitive is:

- **Standalone** — `@Component({ standalone: true, ... })`. No NgModules. Ever. `*.module.ts` files trigger the clean-code hook.
- **OnPush** — `changeDetection: ChangeDetectionStrategy.OnPush`. Always.
- **Signal-based** — `input()` / `input.required()` / `output<T>()` / `signal()` / `computed()`. No `@Input()` or `@Output()` decorators. The clean-code hook blocks them.
- **Async via RxJS only when you actually need streams** — otherwise prefer signals. Don't mix without reason.
- **No direct DOM access** — no `document.querySelector`, no `ElementRef.nativeElement.style.x = …`. Use Angular bindings and CDK.
- **Strict TS** — no `any`, no `@ts-ignore`, no `as unknown as`. Hook blocks them all.

If any of the above is impossible for a legitimate reason, the primitive is probably the wrong shape. Redesign or escalate to Planner.

---

## 2. File structure per primitive (LOCKED 2026-05-18)

> Companion: [dimension-tokens.md](dimension-tokens.md) — the contributor rules for which CSS custom properties to reference and how the responsive system works. Components must use semantic tokens (e.g. `var(--button-height)`); never primitives (`var(--dimension-11)`) and never raw values.

```
libs/ui/src/{primitive}/
├── {primitive}.component.ts         # class only — decorator uses templateUrl + (optional) styleUrls
├── {primitive}.component.html       # template — ALWAYS external
├── {primitive}.component.scss       # styles — BEM classes + CSS custom properties (ALWAYS present)
├── {primitive}.variants.ts          # type exports only (e.g. ButtonVariant, ButtonSize)
├── {primitive}.component.spec.ts    # behavior tests (Angular harness when helpful)
└── index.ts                          # barrel: exports component + types
```

**The rule:**
- **`.html` is always external** — `templateUrl: './{primitive}.component.html'`. Inline `template: \`…\`` is banned.
- **`.scss` is always external and always present** — `styleUrls: ['./{primitive}.component.scss']`. Inline `styles: [\`…\`]` arrays are **banned** (the pre-commit hook enforces this).
- **All visual styling lives in `.scss` using BEM classes + CSS custom properties.** No Tailwind utility classes in templates for visual styling. Templates contain only BEM class names bound via `[class]="computed()"` or static `class="block__element"`.
- **`.variants.ts` exports types only** (e.g., `export type ButtonSize = 'sm' | 'md' | 'lg'`). Class-map strings are banned — size/variant logic lives in SCSS via BEM modifiers (`&--sm`, `&--primary`).

**Why 3-file (not the single-file shadcn style we used to mandate):** AFI production code uses the 3-file Angular convention. The DS shape needs to match what devs already write — otherwise they bypass the DS. Single-file inline templates are a React/shadcn-specific pattern that the previous version of this rule mistakenly imported.

If the primitive grows companion artifacts (e.g., `status-chip.labels.ts`, `{primitive}.types.ts`), add them to the folder — one folder per primitive, no shared-grab-bag directories.

### When the `.scss` file exists (which is ALWAYS), only these belong in it:
- BEM-structured classes (`.block`, `.block__element`, `.block--modifier`).
- All visual properties: colors, spacing, radius, typography, motion, borders — via `var(--token-name)`.
- `@media` responsive overrides. Raw px in `@media` queries is banned — reference named breakpoints from a generated Sass partial (to be added in a later session when first needed).
- Component-scoped CSS custom property overrides (`:host { --my-padding: var(--space-md); }`).
- Selectors like `:has()`, sibling combinators on dynamic content.
- Hover/focus/active/disabled states via `&:hover`, `&:focus-visible`, `&--disabled`, etc.

### NEVER in `.scss`:
- Raw hex / rgba / px literals — hook blocks them outside `libs/tokens/`.
- Sass color/dimension variables (`$color-brand-700`, `$dimension-4`) or any `@import` of a Sass tokens partial. **Only CSS custom properties from `tokens.css`.** Why: Sass `@import`s re-bake the brand at build time and break any future per-route or runtime brand switching. CSS vars compose live through the cascade and are brand-swappable for free.
- `::ng-deep` — banned outright. It leaks DS styling into consumer scope and breaks brand encapsulation. If a primitive needs to style a slotted child, that's a composition redesign, not a `::ng-deep` patch.

### Multi-client theming (whitelabel) — the foundation rule
- **Brand swap = token-layer swap, not component-layer swap.** Brand overrides live at `libs/tokens/brand/{client}.ts`; style-dictionary builds a brand-specific `tokens.css`. Components stay brand-agnostic — they reference only semantic CSS custom properties (`var(--action-primary)`, `var(--surface-quiet)`, `var(--canvas-fg)`, etc.).
- The logo is brand-specific but lives at `libs/ui/src/logo/` and swaps via brand config — not via per-brand component duplication.
- Result: adding a new brand (Mutualidad, etc.) requires zero changes to the 24 primitives.

### Responsive — the foundation rule
- **SCSS `@media` with semantic breakpoint tokens is the default.** Responsive overrides go in the `.scss` file.
- Mobile-first throughout.

### Encapsulation note
CSS custom properties inherit via the cascade, not via Angular's attribute-rewriting scope, so `var(--surface-quiet)` resolves identically inside and outside Emulated ViewEncapsulation. No `ViewEncapsulation.None` or `ShadowDom` is needed (or wanted) for tokens to work.

---

## 3. Inputs (signal pattern)

```ts
readonly variant = input<ButtonVariant>('primary');
readonly size    = input<ButtonSize>('md');
readonly disabled = input(false);
readonly label   = input.required<string>();        // when absence is a bug
readonly estado  = input<Estado | null>(null);      // null-default for optionals
```

Rules:
- Typed always. No `input<any>()`.
- `input.required<T>()` when absence is a programmer error.
- Default values match the "most common" case, so consumers rarely pass them.
- Boolean inputs: default `false` unless the sensible default is `true` (e.g., `sticky` on PageHeader).
- Nullable when "unset" is a semantically valid state (e.g., `ariaLabel: string | null = null`).

---

## 4. Outputs (signal pattern)

```ts
readonly clicked      = output<{ event: MouseEvent }>();
readonly valueChange  = output<string>();
readonly expandedChange = output<boolean>();
```

Rules:
- **Past tense** for events that happened (`clicked`, `opened`, `dismissed`).
- **`{change}`-suffixed** for two-way bindable state (`expandedChange`, `valueChange`).
- **Payload is an object** when the event may gain fields later (`{ event }` not `event` directly). Survives future additions without a breaking change.
- Suppress emission when the source state is `disabled()` or `loading()`.

---

## 5. Template rules

- **Template is always external** — `templateUrl: './{primitive}.component.html'`. Inline `template: \`…\`` is banned (see § 2). The pre-commit hook flags inline `styles:` arrays; reviewer flags inline `template:` strings.
- **Control flow:** Angular 17+ `@if` / `@else` / `@for` / `@switch`. Never `*ngIf` / `*ngFor` / `*ngSwitch`.
- **Class binding:** `[class]="classes()"` from a `computed()` signal that returns BEM class strings (e.g., `'btn btn--primary btn--md'`). Never `[ngClass]`.
- **Style binding:** reserved for dynamic CSS-var interpolation (e.g., `[style.background-color]="'var(--status-' + estado() + '-dot)'"`). Never hardcode hex / rgba / px in inline styles.
- **Event binding:** `(click)="onClick($event)"`. Handlers live as class methods, not inline arrow functions.
- **Content projection:** `<ng-content>` with `select=` for named slots. Name slots semantically (`slot="iconStart"`, `slot="rail"`), not visually (`slot="leftThing"`).
- **No Tailwind utility classes in templates.** All visual styling is in `.scss`. Templates only use BEM class names. This is a LOCKED rule (2026-05-19).
- **Sizing is responsive at the token layer, not the component.** Use `var(--button-height)`, `var(--canvas-padding-inline)`, etc. — the value automatically updates per breakpoint via [`semantic.scss`](../../libs/tokens/semantic.scss). Components only need their own `@media` for layout (flex-direction changes, visibility toggles, content reflow), NOT for sizing. See [dimension-tokens.md](dimension-tokens.md) § "Responsive — the load-bearing answer".

---

## 6. Variants — types + SCSS BEM modifiers (LOCKED 2026-05-19)

Every primitive with >1 visual variant uses this pattern.

`{primitive}.variants.ts` — **exports types only**:

```ts
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
```

Component computes BEM class string:

```ts
readonly classes = computed(() =>
  `btn btn--${this.variant()} btn--${this.size()}${this.fullWidth() ? ' btn--full' : ''}`
);
```

`{primitive}.component.scss` — variant logic lives here:

```scss
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  border-radius: var(--radius-control);
  font: var(--type-button);
  transition: background var(--duration-fast) var(--easing-enter);

  &--primary {
    background: var(--action-primary-default);
    color: var(--action-primary-text);
    &:hover { background: var(--action-primary-hover); }
  }

  &--sm { height: var(--control-h-sm); padding: 0 var(--space-sm); }
  &--md { height: var(--control-h-md); padding: 0 var(--space-md); }
  &--lg { height: var(--control-h-lg); padding: 0 var(--space-lg); }
}
```

**Every value references a CSS custom property.** No raw hex, rgba, or px. No Tailwind class strings in `.ts` files.

---

## 7. Token consumption (the rule that keeps drift out)

- **Every visual property reads a token.** Color, spacing, radius, typography, motion, border. No exceptions.
- **Tokens come from `libs/tokens/semantic.scss`** (and its partials), imported into the consuming app's `styles.scss`.
- **Components consume tokens via CSS custom properties in SCSS.** `var(--action-primary-default)`, `var(--control-h-md)`, `var(--duration-fast)`.
- **No Tailwind utility classes for visual styling.** The team uses SCSS + CSS custom properties exclusively.
- **The clean-code hook blocks** `#[0-9a-fA-F]{3,8}\b` (hex), `\brgba?\s*\(` (rgba), and `\b\d+px\b` outside `libs/tokens/**`.
- **If you need a token that doesn't exist, define it first.** Never improvise a value. Token Guardian enforces this.

---

## 8. Surface tonal ladder (LOCKED 2026-04-17)

Five semantic surface tokens. Each has a specific job.

| Token | Use |
|---|---|
| `surface-base`     | Main content area. The brightest step. |
| `surface-quiet`    | Persistent chrome — sidebar, right rail, toolbar. |
| `surface-muted`    | Deeper quiet — nested panels, filter rails. |
| `surface-elevated` | Lifted above base — cards, modals, popovers. Same tone as `base`; subtle shadow distinguishes. |
| `surface-overlay`  | Modal scrim. |

**The rule:** tonal step = context change; shadow = elevation change. **They don't mix.** A card is `surface-elevated` with shadow. A sidebar is `surface-quiet` without shadow. Never apply shadow to `quiet` — that's conflating two axes.

---

## 9. Naming conventions

- **Selector:** `afi-{primitive}` (kebab-case, prefix always). `<afi-button>`, `<afi-status-chip>`.
- **Variants:** named after intent, not visuals. `primary` not `blue`. `danger` not `red`. `ghost` is the accepted compromise for "transparent-until-hover."
- **Sizes:** `sm` / `md` / `lg` / `xl`. Numeric sizes (`size-100`) are reserved for internal density tokens.
- **Event handlers:** `onClick`, `onChange`, `onFocus`. Private when possible; `protected` when template-referenced.
- **Private fields:** `#` prefix (JS private) when Angular lifecycle lets you; else `private` keyword. No underscore prefix.

---

## 10. Accessibility non-negotiables

Consult `docs/rules/accessibility.md` for the per-primitive checklist. These apply to every primitive:

- **Focus-visible ring** — 2px `action-500`, 2px offset. Every focusable element. No exceptions.
- **Keyboard operable** — Tab / Shift-Tab, Arrow keys for composite widgets, Enter / Space where native, Escape to dismiss overlays. Tested in the spec.
- **Touch target ≥ 44×44pt** on interactive elements. The `sm` size opt-outs require a product-level `aria-label` and a documented dense-context reason.
- **Reduced motion** — `prefers-reduced-motion: reduce` collapses movement transitions to 0–80ms fades. State communication stays; motion is cut.
- **Screen reader** — role, name, state announced. Test with VoiceOver on macOS before PR.
- **Contrast** — WCAG 2.2 AA minimum. AAA for text where the spec calls for it.
- **Dev-mode assertions** — log a warning when a primitive is used in a way that would break a11y (e.g., icon-only Button without `ariaLabel`).

---

## 11. Motion — three tiers

Prefer the lowest tier that does the job. Never skip straight to Tier 3.

| Tier | Tool | When |
|---|---|---|
| **1 (95% of cases)** | Pure CSS — `transition`, `transform`, `opacity`, `clip-path` | Hover, press, focus, simple enter/exit |
| **2** | `@angular/animations` | State machines that CSS can't cleanly express (e.g., sidebar collapse with coordinated opacity + width) |
| **3** | Motion One (~3kb) | Complex timeline choreography (stagger across multiple elements, spring physics) — reserved for the DS site demonstrations |

Choreography rules (from `docs/strategy/plan.md` motion discipline, LOCKED 2026-04-16):

1. **Container-first** — animate the container, not its contents. A button's hover moves the button as one unit.
2. **Fewest properties** — prefer `transform` + `opacity` (GPU-composited). Avoid `width` / `height` / `top` / `left` except when genuinely needed.
3. **Ease correctly** — `ease-out` for enters, `ease-in` for exits, `ease-in-out` for back-and-forth. Linear is almost always wrong.
4. **Duration matches weight** — chip focus 80–150ms, button 150–200ms, modal 200–300ms. Never >400ms for interactive response.
5. **Respect resting state** — hover/pressed/focus read as variants of default, not replacements.
6. **Don't animate what you haven't decided** — if a property's purpose isn't clear, leave it static.
7. **Reduced motion = respect, not disable** — drop to 0–80ms fades; keep state communication.

---

## 12. Copy (RAE Spanish, formal `usted`)

- **Every user-visible string** passes `docs/rules/copy-skill.md`.
- **Every hardcoded string inside a primitive** (screen-reader text, default `aria-label`, "cargando" spinner text) is RAE-verified and glossary-controlled.
- **No English fallbacks** in shipping primitives. Not even in comments the screen reader might ever see (e.g., `sr-only` text).
- **Sentence case**, not Title Case. `Guardar cambios`, not `Guardar Cambios`.
- **es-ES number / date formatting** — `1.234,56`, `1,2 k`, `16 abr 2026`. Use `Intl.NumberFormat('es-ES')` / `Intl.DateTimeFormat('es-ES')`. Never hand-concatenate.

---

## 13. Integration sanity check (DO THIS BEFORE YOU DEBUG ANYTHING)

If your primitive renders as unstyled browser-default HTML (no colors, no spacing, raw buttons/inputs), the cause is almost always one of:

1. **Tokens CSS not imported into the app.** `apps/{app}/src/styles.css` must have `@import '../../libs/tokens/dist/tokens.css';` at the top. Verify the file exists and resolves.
2. **Tailwind `content` paths miss the library.** `tailwind.config.js → content: [...]` must include `libs/**/*.{ts,html}` AND `apps/**/*.{ts,html}`. Missing library paths = Tailwind JIT doesn't see the classes = they don't compile.
3. **Theme.extend missing.** `tailwind.config.js → theme.extend.colors.surface.quiet = 'var(--surface-quiet)'` (and the rest of the ladder). Without this, `bg-surface-quiet` is an unknown class.
4. **Style Dictionary didn't run.** `libs/tokens/dist/tokens.css` must exist and contain `:root { --surface-quiet: …; }`. Run `npx style-dictionary build` from `libs/tokens/`.
5. **Variant CSS vars undefined at runtime.** Use DevTools → Inspect → Computed → confirm `--surface-quiet` resolves. If it says "invalid value," the import chain is broken.

**This primitive does not ship if any of the above fail.** An unstyled browser-default render is a FAIL in pre-flight, not a visual quibble.

---

## 14. Family-specific patterns

Apply on top of the universal rules.

### Form controls (Input, Checkbox, Switch, Select, Textarea)
- Wrap in a `<label>` — implicit wrapping preferred over `for=` / `id=` when the structure allows.
- Error state via `aria-invalid="true"` + visible error message region with `aria-describedby`.
- Disabled uses the native `disabled` attribute, not `aria-disabled` alone (unless staying focusable is required).
- Control height tokens: `control-h-sm: 32` (dense desktop), `control-h-md: 40`, `control-h-lg: 48` (mobile + default forms, WCAG AAA).

### Overlays (Modal, Drawer, Popover, Tooltip)
- CDK Overlay for positioning. FocusTrap on open; restore focus on close.
- `Escape` dismisses. Click-outside dismisses (unless modal is explicitly "blocking").
- Scrim = `surface-overlay`.
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing at the title.
- Reduced motion → enter/exit collapse to fade.

### Navigation (Sidebar, NavItem, Tabs, Breadcrumb)
- `<nav aria-label="…">` landmark.
- `aria-current="page"` on the active item.
- Arrow-key navigation between siblings via CDK `FocusKeyManager`.
- Active state = subtle fill + action-colored indicator (2px left-border or bottom-underline), not a full color reskin.

### Data display (Table, Card, Badge, StatusChip)
- Tokens for every column divider, hover row tint, header bg. No magic values.
- Badge/StatusChip: `role="status"` on the wrapping element.
- Table: semantic `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<td>`. Never divs pretending.

### Chrome primitives (PageHeader, Shell)
- PageHeader: adaptive height via collapsing rows. Never a fixed height that ghosts empty rows.
- Shell: route-data-driven. Read `data.shell`; render one of the 5 named types. No product-side layout logic.

---

## 15. Visual verification — ship styled, not stubbed

**Every primitive PR includes two things:**
1. The primitive itself in `libs/ui/{name}/`.
2. A `<afi-primitive-card>` entry in `apps/site/src/app/preview/preview.page.ts`.

**Before opening the PR, Builder:**
- Runs `ng serve apps/site`.
- Opens `localhost:4200/preview`.
- Confirms the primitive renders with full visual fidelity — correct colors, spacing, typography, focus ring.
- Keyboard-walks it.
- Toggles `prefers-reduced-motion` (DevTools → Rendering → Emulate CSS media feature).
- Confirms reduced-motion collapses cleanly.

**Unstyled browser defaults = FAIL.** Even a "technically it compiles" primitive doesn't ship until it looks right in the gallery. This is not optional.

---

## 16. Pre-flight before commit (non-negotiable)

Run `docs/build-prompts/_pre-flight.md` for every primitive. Every box closes or the primitive doesn't merge.

Key shared checks:
- [ ] `scripts/clean-code-check.sh` green (no hex, rgba, px, `::ng-deep` outside `libs/tokens/**`; no `any`, `@ts-ignore`, `as unknown as`, `@Input`, `@Output`, `@NgModule`, `*.module.ts` outside allowlist).
- [ ] All signal inputs + outputs; no decorator-based `@Input()` / `@Output()`.
- [ ] 3-file shape: `.component.ts` references `templateUrl`, `.component.html` exists, `.component.scss` exists iff there's content beyond Tailwind. Inline `template:` / `styles:` arrays are absent.
- [ ] Variants extracted to `{primitive}.variants.ts`.
- [ ] Every style property reads a token via CSS custom property (`var(--…)`) or Tailwind utility mapped to a token. No raw values, no Sass `@import` of token partials.
- [ ] Spec covers default render + every variant + every size + disabled + loading + keyboard activation + focus ring.
- [ ] RAE copy on every hardcoded string; `copy-skill.md` glossary verified.
- [ ] Primitive renders correctly at `/preview`.
- [ ] Reduced-motion works.
- [ ] Contrast AA across all variant × state combinations.

**Commit blocked on failure. No `--no-verify` escape. Ever.**

---

## If stuck

- **Spec unclear:** escalate to Planner with the ambiguity + two candidate resolutions. Don't invent.
- **Token missing:** escalate to Token Guardian. Don't improvise a value.
- **Tailwind class doesn't resolve:** run the Integration sanity check (§13) before assuming the primitive is wrong.
- **A11y check fails:** don't ship with a note to "fix later." A11y failures are PR-blockers.
- **Reduced-motion breaks the UI:** revisit the motion choreography. The rule is "collapse, not remove" — state must still communicate.
