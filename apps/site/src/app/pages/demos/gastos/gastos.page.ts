import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IngresosGastosListComponent } from '../wealth-planner-2026/shared/ingresos-gastos-list.component';

/**
 * Situación Actual · Gastos. Thin wrapper that mounts the shared
 * list-body with mode="gasto".
 */
@Component({
  selector: 'site-gastos-page',
  standalone: true,
  imports: [IngresosGastosListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage {}
