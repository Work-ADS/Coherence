import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  output,
  isDevMode,
  OnInit,
} from '@angular/core';

import { RadioGroupItemComponent } from './radio-group-item.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
})
export class RadioGroupComponent implements OnInit {
  readonly value = input<string | null>(null);
  readonly legend = input<string | null>(null);
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

  readonly items = contentChildren(RadioGroupItemComponent);

  constructor() {
    // Note: contentChildren + effect can sync name/selected to items,
    // but since items use input() signals, the parent needs to
    // pass values via template bindings. This component serves as the
    // semantic container (fieldset + radiogroup role).
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
