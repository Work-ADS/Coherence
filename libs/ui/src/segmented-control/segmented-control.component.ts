import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { SegmentedControlSize } from './segmented-control.variants';

export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Segmented Control — a set of mutually exclusive options rendered as a button bar.
 */
@Component({
  selector: 'afi-segmented-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-control.component.html',
  styleUrls: ['./segmented-control.component.scss'],
})
export class SegmentedControlComponent {
  readonly options = input.required<SegmentedOption[]>();
  readonly value = model.required<string>();
  readonly size = input<SegmentedControlSize>('md');
  readonly ariaLabel = input<string>('');

  readonly containerClass = computed(() => `seg-control seg-control--${this.size()}`);

  optionClass(option: SegmentedOption): string {
    const base = 'seg-control__option';
    const active = option.value === this.value() ? `${base}--active` : '';
    const disabled = option.disabled ? `${base}--disabled` : '';
    return [base, active, disabled].filter(Boolean).join(' ');
  }

  select(option: SegmentedOption): void {
    if (!(option.disabled ?? false)) {
      this.value.set(option.value);
    }
  }
}
