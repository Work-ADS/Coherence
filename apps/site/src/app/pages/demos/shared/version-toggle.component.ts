import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type VersionOption = {
  key: string;
  label: string;
};

/**
 * Top-right page-level toggle to switch between layout variants.
 * Variants are kept in the page (not deleted) so seniors can compare
 * across review sessions: V1 = original, V2/V3 = explorations.
 */
@Component({
  selector: 'site-version-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './version-toggle.component.html',
  styleUrl: './version-toggle.component.scss',
})
export class VersionToggleComponent {
  readonly versions = input.required<VersionOption[]>();
  readonly value = input.required<string>();
  readonly ariaLabel = input<string>('Versiones de la pantalla');
  readonly valueChange = output<string>();
}
