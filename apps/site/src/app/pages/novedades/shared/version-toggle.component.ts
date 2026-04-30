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
  template: `
    <div
      role="radiogroup"
      [attr.aria-label]="ariaLabel()"
      class="inline-flex items-center gap-[2px] p-[2px] rounded-full border border-border-hairline bg-canvas-base"
    >
      @for (v of versions(); track v.key) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="v.key === value()"
          (click)="valueChange.emit(v.key)"
          class="inline-flex items-center justify-center h-6 px-space-3 rounded-full text-body-sm transition-colors"
          [class.bg-action-700]="v.key === value()"
          [class.text-white]="v.key === value()"
          [class.font-medium]="v.key === value()"
          [class.text-neutral-600]="v.key !== value()"
          [class.hover:bg-surface-muted]="v.key !== value()"
        >
          {{ v.label }}
        </button>
      }
    </div>
  `,
})
export class VersionToggleComponent {
  readonly versions = input.required<VersionOption[]>();
  readonly value = input.required<string>();
  readonly ariaLabel = input<string>('Versiones de la pantalla');
  readonly valueChange = output<string>();
}
