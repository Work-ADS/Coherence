import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

import { SegmentedControlComponent } from '@coherence/ui';

/**
 * Component playground: preview/code toggle on the left + controls rail on the right.
 * Uses afi-segmented-control (animated pill) for the Vista previa / Código toggle.
 *
 * Slots:
 *   [slot=preview]  — live primitive with bound state
 *   [slot=controls] — the right-rail form (radios, checkboxes, text inputs)
 */
@Component({
  selector: 'afi-component-playground',
  standalone: true,
  imports: [SegmentedControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './component-playground.component.html',
  styleUrl: './component-playground.component.scss',
})
export class ComponentPlaygroundComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('html');

  readonly activeView = signal('preview');

  readonly viewOptions = [
    { value: 'preview', label: 'Vista previa' },
    { value: 'code', label: 'Código' },
  ];
}
