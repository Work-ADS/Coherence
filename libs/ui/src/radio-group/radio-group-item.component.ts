import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { RADIO_GROUP } from './radio-group.token';
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

  /** Used when the item sits outside a group, or in one whose `value` is not bound. */
  readonly name = input<string>('');
  readonly selected = input<boolean>(false);

  readonly selectedChange = output<string>();

  private readonly group = inject(RADIO_GROUP, { optional: true });

  readonly radioId = `afi-radio-${nextItemId++}`;
  readonly hintId = `${this.radioId}-hint`;

  /** Inside a group the group owns the name; the item's `name` input is the fallback. */
  readonly groupedName = computed(() => this.group?.groupName ?? this.name());

  /** A group with a bound `value` decides which item is selected; otherwise the item's own `selected` does. */
  readonly isSelected = computed(() => {
    const groupValue = this.group?.value() ?? null;
    return groupValue !== null ? groupValue === this.value() : this.selected();
  });

  readonly isDisabled = computed(() => this.disabled() || (this.group?.disabled() ?? false));

  readonly rootClasses = computed(() => {
    const parts = ['afi-radio', `afi-radio--${this.size()}`];
    if (this.compact()) parts.push('afi-radio--compact');
    if (this.isDisabled()) parts.push('afi-radio--disabled');
    return parts.join(' ');
  });

  onSelect(): void {
    if (this.isDisabled()) return;
    this.selectedChange.emit(this.value());
    this.group?.select(this.value());
  }
}
