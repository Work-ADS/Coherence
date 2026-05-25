import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IngresosGastosListComponent } from '../wealth-planner-2026/shared/ingresos-gastos-list.component';

/**
 * Situación Actual · Ingresos. Thin wrapper that mounts the shared
 * list-body with mode="ingreso".
 */
@Component({
  selector: 'site-ingresos-page',
  standalone: true,
  imports: [IngresosGastosListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss'],
})
export class IngresosPage {}
