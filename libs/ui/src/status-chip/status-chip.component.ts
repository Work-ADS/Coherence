import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '../icon';

import type { Estado } from './status-chip.labels';
import { estadoLabels } from './status-chip.labels';
import type { StatusChipSize, StatusChipVariant } from './status-chip.variants';

@Component({
  selector: 'afi-status-chip',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.scss'],
})
export class StatusChipComponent {
  readonly estado = input.required<Estado>();
  readonly size = input<StatusChipSize>('md');
  readonly variant = input<StatusChipVariant>('subtle');
  readonly showDot = input(true);
  /** Text override; the default is the estado's label. */
  readonly labelOverride = input<string | null>(null, { alias: 'label' });
  /** Accessible name for the interactive chip when it must differ from its text. */
  readonly ariaLabel = input<string | null>(null);

  /** When true, renders as a button (the parent opens whatever it controls and owns the popup semantics). */
  readonly interactive = input(false);

  /** Emitted when interactive chip is clicked (parent composes with afi-menu). */
  readonly triggered = output<void>();

  protected readonly label = computed(() => this.labelOverride() ?? estadoLabels[this.estado()]);

  protected readonly dotColor = computed(() => {
    const key = estadoToCssKey(this.estado());
    return `var(--status-${key}-dot)`;
  });

  protected readonly chipStyle = computed(() => {
    const key = estadoToCssKey(this.estado());
    const v = this.variant();
    if (v === 'solid') {
      return `background: var(--status-${key}-dot); color: var(--foreground-inverse-default);`;
    }
    return `background: var(--status-${key}-bg); color: var(--status-${key}-fg);`;
  });

  protected readonly sizeClass = computed(() => `status-chip--${this.size()}`);
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
