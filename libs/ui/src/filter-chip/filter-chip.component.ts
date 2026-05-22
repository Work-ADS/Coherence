import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import type { FilterChipSize } from './filter-chip.variants';

/**
 * afi-filter-chip — pill-shaped toggle chip for filter UIs.
 *
 * Renders a `<button role="checkbox">` with an optional leading icon slot,
 * an optional numeric count badge, and an optional dismiss "×" button when
 * `dismissable` is true. Click toggles `selected`; click on the dismiss
 * button emits `dismissed` without toggling.
 *
 * Use in filter bars (sidebar facets, "Active filters" rows, table
 * filter chips). For a single-select group, use `<afi-segmented-control>`
 * instead — chips are multi-select.
 */
@Component({
  selector: 'afi-filter-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-chip.component.html',
  styleUrls: ['./filter-chip.component.scss'],
})
export class FilterChipComponent {
  readonly label = input.required<string>();
  readonly selected = input<boolean>(false);
  readonly size = input<FilterChipSize>('md');
  readonly count = input<number | null>(null);
  readonly dismissable = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly selectedChange = output<boolean>();
  readonly dismissed = output<void>();

  readonly classes = computed(() => {
    const parts = ['afi-chip', `afi-chip--${this.size()}`];
    if (this.selected()) parts.push('afi-chip--selected');
    if (this.disabled()) parts.push('afi-chip--disabled');
    return parts.join(' ');
  });

  readonly hasCount = computed(() => this.count() !== null);

  onToggle(): void {
    if (this.disabled()) return;
    this.selectedChange.emit(!this.selected());
  }

  onDismiss(event: Event): void {
    if (this.disabled()) return;
    event.stopPropagation();
    this.dismissed.emit();
  }
}
