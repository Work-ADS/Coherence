import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FieldHelpComponent } from '../field-help';

/**
 * The label row shared by every field: the `<label for>` text, the required
 * marker and, when `help` is set, the ⓘ. Plain text flow, so on a label that
 * wraps the ⓘ follows the last word instead of jumping to the field's edge.
 * The marker is aria-hidden: the control carries `aria-required`.
 */
@Component({
  selector: 'afi-field-label',
  standalone: true,
  imports: [FieldHelpComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-label.component.html',
  styleUrls: ['./field-label.component.scss'],
})
export class FieldLabelComponent {
  readonly text = input.required<string>();
  /** `id` of the control the label names. */
  readonly forId = input<string | null>(null);
  /** `id` given to the label element, for `aria-labelledby`. */
  readonly labelId = input<string | null>(null);
  readonly required = input<boolean>(false);
  readonly help = input<string | null>(null);
  readonly helpLabel = input<string | null>(null);
}
