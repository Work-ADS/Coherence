import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export interface RadioCardOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * site-radio-card-group
 *
 * Horizontal row of full-width cards, one per option. Each card carries the
 * option label on the left and a circular radio dot on the right. Selecting
 * a card fills its dot with the action color; the card border stays neutral.
 *
 * Built for the BC Sarevi datos page, where the official Figma renders
 * Sí/No and tipo-de-vivienda questions as separate cards with corner dots
 * (instead of one pill-style segmented control). Token-driven so any brand
 * picks up its action color automatically via the cascade.
 *
 * Reference: Figma file rw0MpBWVyKNmLZIkLJ9oyS, datos node 3:5975.
 */
@Component({
  selector: 'site-radio-card-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-card-group.component.html',
  styleUrl: './radio-card-group.component.scss',
})
export class RadioCardGroupComponent {
  readonly options = input.required<readonly RadioCardOption[]>();
  readonly value = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly name = input<string>('');
  /**
   * When true, cards size to their content (inline-flex layout). Useful
   * for short-label questions like Sí/No so the cards don't stretch
   * across a wide row. Default false → full-width grid columns.
   */
  readonly compact = input<boolean>(false);

  readonly valueChange = output<string>();

  select(option: RadioCardOption): void {
    if (option.disabled) return;
    if (option.value === this.value()) return;
    this.valueChange.emit(option.value);
  }

  isSelected(option: RadioCardOption): boolean {
    return option.value === this.value();
  }
}
