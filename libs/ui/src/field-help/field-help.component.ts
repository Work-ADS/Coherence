import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { IconButtonComponent } from '../icon-button';
import { IconComponent } from '../icon';
import { TooltipComponent } from '../tooltip';

let nextId = 0;

/**
 * The ⓘ after a field label: a quiet icon button with the help text in a
 * tooltip that opens on hover, focus and click. The button is named by
 * `helpLabel` and described by a hidden node carrying the help text, so the
 * text is reachable by keyboard and screen reader without opening the tooltip.
 * A click on it never reaches the field. Use `hint` on the field for the
 * always-visible line under it.
 */
@Component({
  selector: 'afi-field-help',
  standalone: true,
  imports: [IconButtonComponent, IconComponent, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-help.component.html',
  styleUrls: ['./field-help.component.scss'],
})
export class FieldHelpComponent {
  readonly help = input.required<string>();
  /** Accessible name of the button. Default «Más información sobre <label>». */
  readonly helpLabel = input<string | null>(null);
  /** The field's label, used only to build the default name. */
  readonly label = input<string | null>(null);

  readonly descriptionId = `afi-field-help-${nextId++}`;

  readonly name = computed(
    () => this.helpLabel() ?? `Más información sobre ${this.label() ?? 'este campo'}`,
  );

  protected stop(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
