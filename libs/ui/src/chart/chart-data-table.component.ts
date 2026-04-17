import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import { TableComponent } from '../table';
import { ButtonComponent } from '../button';
import type { TableColumn } from '../table/table.types';

/**
 * Data-table fallback for chart primitives.
 *
 * Toggle button reveals an `<afi-table>` beneath the chart with all data.
 * Required on bar / line / dumbbell; optional on heatmap.
 * One source of truth — wraps the existing Table primitive.
 */
@Component({
  selector: 'afi-chart-data-table',
  standalone: true,
  imports: [TableComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-space-2">
      <afi-button
        variant="ghost"
        size="sm"
        [ariaLabel]="isOpen() ? 'Ocultar tabla de datos' : 'Ver datos en tabla'"
        (clicked)="toggle()"
      >
        {{ isOpen() ? 'Ocultar tabla de datos' : 'Ver datos en tabla' }}
      </afi-button>

      @if (isOpen()) {
        <div class="mt-space-3" role="region" aria-label="Datos del gráfico">
          <afi-table
            [columns]="columns()"
            [rows]="rows()"
            [trackByKey]="trackByKey()"
            density="compact"
            emptyText="Sin datos para mostrar"
          />
        </div>
      }
    </div>
  `,
})
export class ChartDataTableComponent {
  readonly columns = input<TableColumn[]>([]);
  readonly rows = input<Record<string, unknown>[]>([]);
  readonly trackByKey = input('key');

  readonly toggled = output<boolean>();

  protected readonly isOpen = signal(false);

  toggle(): void {
    const next = !this.isOpen();
    this.isOpen.set(next);
    this.toggled.emit(next);
  }
}
