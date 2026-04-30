import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeComponent } from '@coherence/ui';

/**
 * Floating graph-card header — three-tier hierarchy.
 * Label (small) → headline value (large, with optional event tag) → comparison + info tooltip.
 * No card chrome. Used inside the Evolución Patrimonial pattern.
 */
@Component({
  selector: 'afi-graph-card-header',
  standalone: true,
  imports: [BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col">
      <p class="text-body-sm font-medium text-neutral-700 mb-space-2">{{ label() }}</p>
      <h2 class="text-section text-canvas-fg flex items-center gap-space-2 flex-wrap">
        <span>{{ headline() }}</span>
        @if (tag()) {
          <afi-badge intent="info" size="sm">{{ tag() }}</afi-badge>
        }
      </h2>
      <p class="text-body-sm text-neutral-700 flex items-center gap-space-2 mt-space-1">
        <span>{{ comparison() }}</span>
        @if (tooltip()) {
          <span class="group relative inline-flex items-center cursor-help">
            <svg
              aria-hidden="true"
              class="w-3.5 h-3.5 text-neutral-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 100-2 1 1 0 000 2zm-1 2a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            <span
              role="tooltip"
              class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-caption bg-neutral-900 text-white rounded w-[360px] whitespace-normal leading-snug
                     opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                     pointer-events-none transition-opacity duration-fast z-50"
            >
              {{ tooltip() }}
            </span>
          </span>
        }
      </p>
    </div>
  `,
})
export class GraphCardHeaderComponent {
  readonly label = input.required<string>();
  readonly headline = input.required<string>();
  readonly comparison = input.required<string>();
  readonly tooltip = input<string | undefined>(undefined);
  /** Optional event tag shown as a badge next to the headline (e.g. "Retiro esperado", "Jubilación", "Emancipación hijo 1"). */
  readonly tag = input<string | undefined>(undefined);
}
