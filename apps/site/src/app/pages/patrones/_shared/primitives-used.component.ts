import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '@coherence/ui';

export type PrimitiveStatus = 'exists' | 'partial' | 'missing';

export type PrimitiveRef = {
  readonly name: string;
  readonly slug: string;
  readonly status?: PrimitiveStatus;
  readonly note?: string;
};

@Component({
  selector: 'site-primitives-used',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="rounded-md border border-border-hairline bg-surface-quiet px-space-5 py-space-4"
      aria-label="Primitivos usados en este patrón"
    >
      <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
        Esta pantalla compone los siguientes primitivos
      </p>

      @if (primitives().length === 0) {
        <p class="text-body-sm text-neutral-500 italic">
          Auditoría pendiente — se completará durante la enumeración de átomos del patrón.
        </p>
      } @else {
        <ul class="flex flex-wrap gap-space-2">
          @for (p of primitives(); track p.slug) {
            <li>
              @if (p.status === 'missing') {
                <span
                  class="inline-flex items-center gap-space-2 rounded border border-dashed border-system-warning px-space-3 py-space-1 text-body-sm font-mono text-system-warning"
                  [attr.title]="p.note ?? 'Primitivo aún no construido — bloqueante.'"
                >
                  &lt;{{ p.name }}&gt;
                  <afi-badge size="sm" intent="warning">faltante</afi-badge>
                </span>
              } @else {
                <a
                  [routerLink]="'/primitivos/' + p.slug"
                  class="inline-flex items-center gap-space-2 rounded border border-border-hairline bg-surface-elevated px-space-3 py-space-1 text-body-sm font-mono text-canvas-fg hover:border-action hover:text-action transition-colors"
                  [attr.title]="p.note ?? null"
                >
                  &lt;{{ p.name }}&gt;
                  @if (p.status === 'partial') {
                    <afi-badge size="sm" intent="info">extender</afi-badge>
                  }
                </a>
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class PrimitivesUsedComponent {
  readonly primitives = input.required<readonly PrimitiveRef[]>();
}
