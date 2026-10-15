import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import type { RadioSize } from './radio-group.variants';

let nextItemId = 0;

/**
 * RadioGroupItem: a single radio option. A native `<input type="radio">`
 * carries the semantics; a drawn ring with an outline-style dot is its
 * picture. All motion respects `prefers-reduced-motion`.
 */
@Component({
  selector: 'afi-radio-group-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group-item.component.html',
  styleUrls: ['./radio-group-item.component.scss'],
})
export class RadioGroupItemComponent {
  readonly value = input.required<string>();
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly disabled = input<boolean>(false);
  readonly size = input<RadioSize>('md');
  readonly compact = input<boolean>(false);

  /** Set by parent RadioGroupComponent */
  readonly name = input<string>('');
  readonly selected = input<boolean>(false);

  readonly selectedChange = output<string>();

  readonly radioId = `afi-radio-${nextItemId++}`;
  readonly hintId = `${this.radioId}-hint`;

  readonly rootClasses = computed(() => {
    const parts = ['afi-radio', `afi-radio--${this.size()}`];
    if (this.compact()) parts.push('afi-radio--compact');
    if (this.disabled()) parts.push('afi-radio--disabled');
    return parts.join(' ');
  });

  onSelect(): void {
    if (this.disabled()) return;
    this.selectedChange.emit(this.value());
  }
}
