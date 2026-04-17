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

## 2. File structure per primitive

```
libs/ui/{primitive}/
├── {primitive}.component.ts         # class + inline template
├── {primitive}.variants.ts          # baseClasses + variantClasses + sizeClasses + types
├── {primitive}.component.spec.ts    # behavior tests (Angular harness when helpful)
└── index.ts                          # barrel: exports component + types
```

No `.html` file unless the template exceeds **40 lines** (rare). No `.scss` file unless Tailwind genuinely can't express it, and then capped at **20 lines** with a comment explaining why.

If the primitive grows companion artifacts (e.g., `status-chip.labels.ts`), add them to the folder — one folder per primitive, no shared-grab-bag directories.

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

- **Inline template** in the component file. No separate `.html` for anything under 40 lines.
- **Control flow:** Angular 17+ `@if` / `@else` / `@for` / `@switch`. Never `*ngIf` / `*ngFor` / `*ngSwitch`.
- **Class binding:** `[class]="classes()"` from a `computed()` signal. Never `[ngClass]`.
- **Style binding:** reserved for dynamic CSS-var interpolation (e.g., `[style.background-color]="'var(--status-' + estado() + '-dot)'"`). Never hardcode hex / rgba / px in inline styles.
- **Event binding:** `(click)="onClick($event)"`. Handlers live as class methods, not inline arrow functions.
- **Content projection:** `<ng-content>` with `select=` for named slots. Name slots semantically (`slot="iconStart"`, `slot="rail"`), not visually (`slot="leftThing"`).

---

## 6. Variants — the class-variance-authority pattern (Angular)

Every primitive with >1 visual variant uses this pattern verbatim.

`{primitive}.variants.ts`:

```ts
export const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md font-button ' +
  'transition-colors duration-fast ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ' +
  'focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

export const variantClasses = {
  primary:   'bg-action text-white hover:bg-action-600 active:bg-action-700',
  secondary: 'bg-surface-quiet text-canvas-fg border border-border-hairline hover:bg-surface-muted',
  ghost:     'bg-transparent text-canvas-fg hover:bg-surface-quiet',
  danger:    'bg-system-error text-white hover:bg-system-error-600',
} as const;

export const sizeClasses = {
  sm: 'h-8 px-3 text-body-sm',
  md: 'h-10 px-4 text-button',
  lg: 'h-12 px-5 text-button',
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize    = keyof typeof sizeClasses;
```

Component:

```ts
readonly classes = computed(() => [
  baseClasses,
  variantClasses[this.variant()],
  sizeClasses[this.size()],
  this.fullWidth() ? 'w-full' : '',
].filter(Boolean).join(' '));
```

**Every class listed above must resolve against a token at build time.** `bg-action` → `var(--action-500)`. `text-body-sm` → the semantic type role. No literal hex or px anywhere in this file.

---

## 7. Token consumption (the rule that keeps drift out)

- **Every visual property reads a token.** Color, spacing, radius, typography, motion, border. No exceptions.
- **Tokens come from `libs/tokens/dist/tokens.css`**, which is imported by the consuming app's `styles.css`.
- **Tailwind utility classes resolve to tokens via `tailwind.config.js theme.extend`.** Example: `bg-surface-quiet` → `backgroundColor: var(--surface-quiet)`.
- **Arbitrary-value Tailwind is permitted only for CSS-var interpolation** (e.g., `bg-[var(--status-pending-bg)]` when the var is dynamic). Never for literal values.
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

Consult `docs/accessibility.md` for the per-primitive checklist. These apply to every primitive:

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

Choreography rules (from `docs/plan.md` motion discipline, LOCKED 2026-04-16):

1. **Container-first** — animate the container, not its contents. A button's hover moves the button as one unit.
2. **Fewest properties** — prefer `transform` + `opacity` (GPU-composited). Avoid `width` / `height` / `top` / `left` except when genuinely needed.
3. **Ease correctly** — `ease-out` for enters, `ease-in` for exits, `ease-in-out` for back-and-forth. Linear is almost always wrong.
4. **Duration matches weight** — chip focus 80–150ms, button 150–200ms, modal 200–300ms. Never >400ms for interactive response.
5. **Respect resting state** — hover/pressed/focus read as variants of default, not replacements.
6. **Don't animate what you haven't decided** — if a property's purpose isn't clear, leave it static.
7. **Reduced motion = respect, not disable** — drop to 0–80ms fades; keep state communication.

---

## 12. Copy (RAE Spanish, formal `usted`)

- **Every user-visible string** passes `docs/copy-skill.md`.
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
- [ ] `scripts/clean-code-check.sh` green (no hex, rgba, px, any, @ts-ignore, as unknown as, @Input, @Output, @NgModule, *.module.ts outside allowlist).
- [ ] All signal inputs + outputs; no decorator-based `@Input()` / `@Output()`.
- [ ] Template < 40 lines (or `.html` file with comment justifying).
- [ ] Variants extracted to `{primitive}.variants.ts`.
- [ ] Every style property reads a token.
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
