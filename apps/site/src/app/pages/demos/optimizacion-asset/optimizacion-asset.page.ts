import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  ButtonComponent,
  ModalComponent,
  PageHeaderComponent,
  TableComponent,
} from '@coherence/ui';
import type { TableColumn, TableRowAction } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type { PerfilRiesgo } from '../wealth-planner-2026/store';

const PERFIL_LABELS: Record<PerfilRiesgo, string> = {
  conservador: 'Conservador',
  moderado: 'Moderado',
  dinamico: 'Dinámico',
};

interface OptAssetTableRow {
  [key: string]: unknown;
  id: string;
  nombre: string;
  perfilRiesgo: string;
  patrimonioAfectado: string;
  valorFinalOptimizado: string;
}

/**
 * Plan de acción · Optimización del asset allocation (Wave 3 §4.c) — landing.
 *
 * Spec pivot (2026-06-16): instead of a Liquidez-style switch + inline chart,
 * this surface lists named optimizations and lets the gestor launch the
 * 3-step wizard from `/optimizacion-asset/nuevo`. Empty state when the store
 * has zero optimizations; afi-table otherwise.
 */
@Component({
  selector: 'site-optimizacion-asset-page',
  standalone: true,
  imports: [
    ButtonComponent,
    ModalComponent,
    PageHeaderComponent,
    TableComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './optimizacion-asset.page.html',
  styleUrl: './optimizacion-asset.page.scss',
})
export class OptimizacionAssetPage {
  readonly store = inject(WealthPlannerStore);
  private readonly router = inject(Router);

  readonly columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'perfilRiesgo', label: 'Perfil de riesgo' },
    { key: 'patrimonioAfectado', label: 'Patrimonio afectado', align: 'end' },
    { key: 'valorFinalOptimizado', label: 'Valor final optimizado', align: 'end' },
  ];

  /**
   * Two inline actions only (Editar + Borrar) — both reveal on row hover via
   * the table primitive's default `actionsReveal: 'hover'`. The 3-dot
   * overflow menu is reserved for tables with 3+ actions; with two, the
   * icon buttons themselves are the full surface (Richard 2026-06-10 / 16
   * pattern, mirrors patrimonial-proposal.assetTableActions).
   */
  readonly rowActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', icon: 'edit', ariaLabel: 'Editar optimización' },
    {
      key: 'delete',
      label: 'Borrar',
      icon: 'delete',
      ariaLabel: 'Borrar optimización',
      variant: 'danger',
    },
  ];

  readonly rows = computed<OptAssetTableRow[]>(() =>
    this.store.optimizacionesAsset().map((opt) => ({
      id: opt.id,
      nombre: opt.nombre,
      perfilRiesgo: `${PERFIL_LABELS[opt.perfilRiesgo]} (${formatPct(opt.perfilRentabilidad)})`,
      patrimonioAfectado: formatEuro(opt.patrimonioAfectado),
      valorFinalOptimizado: formatEuro(opt.valorFinalOptimizado),
    })),
  );

  readonly hasOptimizaciones = computed<boolean>(
    () => this.store.optimizacionesAsset().length > 0,
  );

  // ── Destructive-confirm state (mirrors sociedades.page pattern) ─────────
  readonly confirmDeleteOpen = signal<boolean>(false);
  readonly pendingDeleteRow = signal<OptAssetTableRow | null>(null);

  goNueva(): void {
    this.router.navigate(['/demos/wealth-planner-2026/optimizacion-asset/nuevo']);
  }

  /** Edit + row-click both open the wizard pre-loaded at Step 3 (Resultados). */
  goEditar(row: OptAssetTableRow): void {
    this.router.navigate(
      ['/demos/wealth-planner-2026/optimizacion-asset/nuevo'],
      { queryParams: { id: row.id } },
    );
  }

  requestDelete(row: OptAssetTableRow): void {
    this.pendingDeleteRow.set(row);
    this.confirmDeleteOpen.set(true);
  }

  cancelDelete(): void {
    this.confirmDeleteOpen.set(false);
    this.pendingDeleteRow.set(null);
  }

  confirmDelete(): void {
    const row = this.pendingDeleteRow();
    if (row) this.store.removeOptimizacionAsset(row.id);
    this.cancelDelete();
  }

  onRowClick(event: { row: Record<string, unknown>; event: MouseEvent }): void {
    this.goEditar(event.row as OptAssetTableRow);
  }

  onAction(event: { action: TableRowAction; row: Record<string, unknown> }): void {
    const row = event.row as OptAssetTableRow;
    switch (event.action.key) {
      case 'edit':
        this.goEditar(row);
        break;
      case 'delete':
        this.requestDelete(row);
        break;
    }
  }
}

const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const PCT_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatEuro(n: number): string {
  return EUR_FORMATTER.format(n);
}

function formatPct(n: number): string {
  return PCT_FORMATTER.format(n);
}
