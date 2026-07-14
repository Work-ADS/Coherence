import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  isDevMode,
  model,
  OnInit,
  viewChild,
} from '@angular/core';

let nextId = 0;

/**
 * Checkbox — identity v2 (foundations-modern).
 *
 * Parallel primitive to the legacy `afi-checkbox`; consumes only
 * `foundations-modern` tokens, so it renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: Checkbox set (2553:2393) — 3 values
 * (Unchecked / Checked / Indeterminate) × 4 states (Default / Hover / Focus /
 * Disabled). Fixed 16×16 box; label sits RIGHT of the control (the opposite of
 * Toggle, per the control-label convention).
 *
 * Shape:
 *  - Unlike Toggle, a checkbox is a FORM control — the change is staged, not
 *    applied instantly. Use it where a Save/Confirm step gathers the value.
 *  - `indeterminate` is a parent-controlled tri-state (e.g. a "select all" whose
 *    children are partially selected). It is NOT flipped by clicking — the parent
 *    resolves it; a user click only ever sets `checked`.
 *
 * `checked` is a `model()` so it self-updates on toggle and supports
 * `[(checked)]`; consumers can also listen to the implicit `checkedChange`.
 *
 * A11y: a real (visually-hidden) `<input type="checkbox">` inside the `<label>`,
 * so clicking the label text toggles the control, the native `indeterminate` DOM
 * property is set (announced as "mixed"), and the browser owns keyboard +
 * form semantics. The 16×16 box in a height-component-md row is a dense-desktop
 * touch-target opt-out (form rows, not touch-first surfaces); the whole label
 * row is the hit area, and `label`/`ariaLabel` supplies the accessible name.
 */
@Component({
  selector: 'afi-checkbox-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox-v2.component.html',
  styleUrls: ['./checkbox-v2.component.scss'],
})
export class CheckboxV2Component implements OnInit {
  readonly checked = model<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  readonly checkboxId = `afi-checkbox-v2-${nextId++}`;

  /** Checked and indeterminate share the filled box; only the icon differs. */
  readonly active = computed(() => this.checked() || this.indeterminate());

  readonly rootClasses = computed(() => {
    const parts = ['afi-checkbox-v2'];
    if (this.disabled()) parts.push('afi-checkbox-v2--disabled');
    return parts.join(' ');
  });

  readonly boxClasses = computed(() => {
    const parts = ['afi-checkbox-v2__box'];
    if (this.active()) parts.push('afi-checkbox-v2__box--active');
    return parts.join(' ');
  });

  constructor() {
    // Mirror the tri-state into the native DOM property so assistive tech
    // announces "mixed"; `indeterminate` is not a reflected HTML attribute.
    effect(() => {
      const el = this.inputEl().nativeElement;
      el.indeterminate = this.indeterminate();
    });
  }

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-checkbox-v2] Checkbox "${this.checkboxId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onToggle(event: Event): void {
    if (this.disabled()) return;
    this.checked.set((event.target as HTMLInputElement).checked);
  }
}
