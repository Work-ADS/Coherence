# Clean code — agent rules for ANY file written in this repo

> Grepped against at commit time. If your change violates a rule here, the pre-commit check fails and the build prompt retries. Consulted by every agent before writing code.

## Stack (fixed, 2026-04-16)

- **Angular** — standalone components, signal inputs/outputs, OnPush, Angular 17+ patterns.
- **TypeScript** strict. No `any`. No `as unknown as`. No `@ts-ignore` without a tracked issue link.
- **SCSS** for all component styling — component-scoped, token-only (CSS vars from `libs/tokens/`). No Tailwind inline classes in templates.
- **No Tailwind utility classes in templates.** All layout, spacing, color, and typography expressed via SCSS using design tokens. Tailwind config may still exist for legacy pages being migrated — do not add new usages.
- **RxJS** only for async streams (HTTP, WebSocket). Component state = signals.
- **Angular CDK** for focus trap, overlay, portal, a11y. Never hand-roll.

## Non-negotiables

1. **Token-only styling.** No hex, `rgb()`, `rgba()`, or raw integer `px` in component templates or styles. Every color / spacing / radius / font-size reads from a CSS custom property defined in `libs/tokens/`. Hairlines, focus rings, radii, shadows, and spacing all have token names. The pre-commit hook uses `scripts/clean-code-check.sh`; it also scans comments, so avoid writing raw pixel values in explanatory comments. Breakpoint lines in `@media (...)` and plain `@container (...)` are exempt; named container queries should use `rem` values or tokenized Sass helpers when available.

2. **One primitive folder, variants inside it.** `button.component.ts`, not `button-primary.component.ts` + `button-secondary.component.ts`. Variants are signal inputs driving BEM class modifiers. See `component-skill.md`.

3. **Standalone + OnPush by default.** Every component:
   ```ts
   @Component({
     selector: 'afi-button',
     standalone: true,
     changeDetection: ChangeDetectionStrategy.OnPush,
     ...
   })
   ```
   If you need default change detection, write the reason in the component docstring.

4. **Signals for state. RxJS for async.** Component state = `signal()`, `computed()`, `effect()`. HTTP / WebSocket = `Observable`, bridged to signals via `toSignal()` at the component edge. No `Subject` / `BehaviorSubject` inside components — extract to a service or use a signal.

5. **Input discipline.** Use `input()` signal inputs, not decorator `@Input()`, for new code. Every input typed — no `any`, no optional primitives without explicit default. Named in the user's mental model: `variant`, `size`, `intent`, `disabled` — not implementation language (`isPressed`, `internalState`). Boolean inputs accept `boolean | ''` for attribute-shorthand (`<afi-button disabled>`).

6. **Output discipline.** `output<T>()`, not `EventEmitter`. Payloads are objects, not primitives: `(changed)="..."` emits `{ value, event }` so the signature survives future additions. Past tense for what happened: `changed`, `selected`, `dismissed`. Never `onChange`.

7. **No direct DOM access** unless unavoidable. `ElementRef` / `Renderer2` only when Angular CDK can't cover it — and comment the reason. No `document.querySelector`. Ever.

8. **SCSS over Tailwind.** Templates use semantic classes styled in the component's `.scss` file with design tokens — not inline utility classes. Every visual property (color, spacing, radius, font) reads from a CSS var. SCSS files have no arbitrary line-count limit but should remain focused on one component's concerns.

9. **File structure per primitive:**
   ```
    libs/ui/src/button/
    ├── button.component.ts       # class only; decorator uses templateUrl + styleUrls
    ├── button.component.html     # template, always external
    ├── button.component.scss     # BEM styles using CSS custom property tokens
    ├── button.variants.ts        # public variant/size/intent types only
    ├── button.component.spec.ts  # behavior tests when helpful
    └── index.ts                  # public exports only
   ```

10. **Naming.**
    - Files: `kebab-case.component.ts`, `kebab-case.types.ts`.
    - Classes: `PascalCase`, end in the role: `ButtonComponent`, `ButtonVariant`.
    - Members: `camelCase`. Private-with-public-accessor may prefix `_`.
    - Module-level immutables: `SCREAMING_SNAKE`.
    - Selectors: `afi-` prefix. Always.

11. **Imports.** Three blocks, blank line between:
    ```ts
    // external
    import { Component, input } from '@angular/core';
    import { NgClass } from '@angular/common';

    // internal (libs)
    import { tokens } from '@afi/tokens';

    // relative
    import { ButtonVariant } from './button.types';
    ```

12. **No TODO / FIXME in committed code.** File a task. Comments exist only for *why*, never *what*. The code explains what. If you need a comment to explain what, rewrite it.

13. **Tests cover behavior, not implementation.** `it('emits changed when the user clicks', …)` — not `it('sets _internalState to true', …)`. Use `@angular/cdk/testing` component harnesses.

14. **Accessibility is in markup, not a follow-up.** `aria-*`, `role`, focus management, keyboard handlers — present in the first template commit. See `accessibility.md` for the per-primitive checklist.

15. **Barrels stay intentional.** `libs/ui/src/{primitive}/index.ts` exports that primitive and its public types. Shared library barrels may re-export primitives only when they are already part of the public package API; do not create grab-bag exports for convenience.

## Pre-flight checklist (runs as grep at commit)

- [ ] No hex, rgba, or raw px outside `libs/tokens/`
- [ ] No `any`, `@ts-ignore`, `as unknown as`
- [ ] Every component `standalone: true` + `changeDetection: OnPush`
- [ ] Every new `@Input()` is `input()`; every new `EventEmitter` is `output()`
- [ ] No `console.log` / `debugger`
- [ ] No TODO / FIXME strings
- [ ] Imports sorted external → internal → relative
- [ ] SCSS is focused on one component's concerns and uses BEM + CSS custom properties
- [ ] Spec file exists and runs

## Anti-patterns (seen in wild, don't)

- `*ngIf="a; else b"` nested 3+ deep → extract to a `computed()`, template binds a single boolean
- `[ngStyle]="{ color: '#333' }"` with string literals → Tailwind class + token
- Component owns both presentation AND data fetching → split; primitives don't fetch
- `this.cdr.detectChanges()` sprinkled in → you've bypassed OnPush; fix the root cause
- `Subscription` member field → switch to `takeUntilDestroyed()` or `async` pipe
- A primitive imports a page component → dependency inversion; primitives don't know about pages
- `any` "temporarily" → it will not be temporary

## When a rule doesn't fit

File an issue. Rules exist because the exceptions were painful. If you found a new exception, the rule gets amended — not ignored.
