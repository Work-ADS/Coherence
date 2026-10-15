import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  isDevMode,
  OnInit,
} from '@angular/core';

import { FieldHelpComponent } from '../field-help';

import { RadioGroupItemComponent } from './radio-group-item.component';
import { RADIO_GROUP } from './radio-group.token';
import type { RadioGroupHost } from './radio-group.token';
import type { RadioOption } from './radio-group.variants';

let nextGroupId = 0;

/**
 * RadioGroup — container that manages single-selection state
 * and distributes `name` + `selected` to child RadioGroupItems.
 *
 * Usage:
 * ```html
 * <afi-radio-group [value]="selected" (valueChange)="selected = $event">
 *   <afi-radio-group-item value="a" label="Opción A" />
 *   <afi-radio-group-item value="b" label="Opción B" />
 * </afi-radio-group>
 * ```
 */
@Component({
  selector: 'afi-radio-group',
  standalone: true,
  imports: [FieldHelpComponent, RadioGroupItemComponent],
  providers: [{ provide: RADIO_GROUP, useExisting: forwardRef(() => RadioGroupComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
})
export class RadioGroupComponent implements OnInit, RadioGroupHost {
  readonly value = input<string | null>(null);
  /** Options the group renders as items itself; items projected in the template still work. */
  readonly options = input<readonly RadioOption[]>([]);
  readonly legend = input<string | null>(null);
  readonly hint = input<string | null>(null);
  /** Error text under the group; sets `aria-invalid` and replaces `hint`. */
  readonly error = input<string | null>(null);
  /** ⓘ after the legend: help text in a tooltip (see `afi-field-help`). */
  readonly help = input<string | null>(null);
  readonly helpLabel = input<string | null>(null);
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  /**
   * Default `horizontal` — radios sit inline and wrap on narrow viewports.
   * Use `vertical` for long option lists where each option needs a full row
   * (e.g. card-style choices with sub-copy).
   */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly fieldsetClasses = computed(
    () => `afi-radio-group afi-radio-group--${this.orientation()}`,
  );

  readonly valueChange = output<string>();

  readonly groupName = `afi-radio-group-${nextGroupId++}`;
  readonly hintId = `${this.groupName}-hint`;
  readonly errorId = `${this.groupName}-error`;

  readonly describedBy = computed(() => {
    if (this.error()) return this.errorId;
    return this.hint() ? this.hintId : null;
  });

    /** Called by an item inside the group when the user picks it. */
  select(value: string): void {
    this.valueChange.emit(value);
  }

  ngOnInit(): void {
    if (isDevMode() && !this.legend() && !this.ariaLabel() && !this.ariaLabelledBy()) {
      console.warn(
        `[afi-radio-group] Group "${this.groupName}" has no legend, ariaLabel, or ariaLabelledBy. ` +
          'Provide at least one for accessibility.',
      );
    }
  }
}
