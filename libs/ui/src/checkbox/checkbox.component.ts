import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  isDevMode,
  OnInit,
  effect,
  viewChild,
  ElementRef,
} from '@angular/core';

import type { CheckboxSize } from './checkbox.variants';

let nextId = 0;

/**
 * Checkbox primitive: a native `<input type="checkbox">` for the semantics and
 * a drawn box for the look. The tick draws itself and the box settles once on
 * commit; `indeterminate` shows a dash. All motion respects
 * `prefers-reduced-motion`. Styling lives in `checkbox.component.scss`.
 */
@Component({
  selector: 'afi-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
  readonly checked = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly size = input<CheckboxSize>('md');
  readonly compact = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly checkedChange = output<boolean>();

  readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');

  readonly checkboxId = `afi-checkbox-${nextId++}`;
  readonly hintId = `${this.checkboxId}-hint`;
  readonly errorId = `${this.checkboxId}-error`;

  readonly rootClasses = computed(() => {
    const parts = ['afi-check', `afi-check--${this.size()}`];
    if (this.compact()) parts.push('afi-check--compact');
    if (this.error()) parts.push('afi-check--error');
    if (this.disabled()) parts.push('afi-check--disabled');
    return parts.join(' ');
  });

  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.hint() && !this.error()) ids.push(this.hintId);
    if (this.error()) ids.push(this.errorId);
    return ids.length > 0 ? ids.join(' ') : null;
  });

  constructor() {
    // Sync indeterminate DOM property via effect
    effect(() => {
      const el = this.inputEl()?.nativeElement;
      if (el) {
        el.indeterminate = this.indeterminate();
      }
    });
  }

  ngOnInit(): void {
    if (isDevMode() && !this.label() && !this.ariaLabel()) {
      console.warn(
        `[afi-checkbox] Checkbox "${this.checkboxId}" has neither label nor ariaLabel. ` +
          'Provide at least one for accessibility.',
      );
    }
  }

  onToggle(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  }
}
