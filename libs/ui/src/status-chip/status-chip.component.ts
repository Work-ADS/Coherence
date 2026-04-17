import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
} from '@angular/core';
import type { Estado } from './status-chip.labels';
import { estadoLabels } from './status-chip.labels';
import {
  baseClasses,
  sizeClasses,
  variantClasses,
} from './status-chip.variants';
import type { StatusChipSize, StatusChipVariant } from './status-chip.variants';

@Component({
  selector: 'afi-status-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="classes()"
      [attr.data-estado]="estado()"
      [attr.aria-label]="computedAriaLabel()"
      role="status"
    >
      @if (showDot()) {
        <span class="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
              [style.background-color]="dotColor()"
              aria-hidden="true"></span>
      }
      <span>{{ label() }}</span>
    </span>
  `,
})
export class StatusChipComponent {
  readonly estado = input.required<Estado>();
  readonly size = input<StatusChipSize>('md');
  readonly variant = input<StatusChipVariant>('subtle');
  readonly showDot = input(true);
  readonly ariaLabel = input<string | null>(null);

  protected readonly label = computed(() => estadoLabels[this.estado()]);

  protected readonly computedAriaLabel = computed(() =>
    this.ariaLabel() ?? this.label(),
  );

  protected readonly dotColor = computed(() => {
    const key = estadoToCssKey(this.estado());
    return `var(--status-${key}-dot)`;
  });

  protected readonly classes = computed(() => {
    const parts = [
      baseClasses,
      sizeClasses[this.size()],
      variantClasses(this.variant(), this.estado()),
    ];
    return parts.join(' ');
  });
}

function estadoToCssKey(estado: Estado): string {
  const map: Record<Estado, string> = {
    'borrador': 'draft',
    'pendiente': 'pending',
    'aprobada': 'approved',
    'rechazada': 'rejected',
    'ejecutada': 'executed',
    'cancelada': 'cancelled',
    'en-revision': 'in-review',
    'archivada': 'archived',
  };
  return map[estado];
}
