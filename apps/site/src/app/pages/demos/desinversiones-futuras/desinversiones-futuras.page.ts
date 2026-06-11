import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  ButtonComponent,
  KbdComponent,
  PageHeaderComponent,
  TableComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, TableRowAction } from '@coherence/ui';

import { KeyShortcutDirective } from '../../../directives/key-shortcut.directive';
import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type { DesinversionObjetivo } from '../wealth-planner-2026/store';

/**
 * Objetivos · Desinversiones futuras — list page (Brief G).
 *
 * Optional section. Lists planned divestments (assets the family intends to
 * sell to generate liquidez or rentas). Clicking a row or the inline edit
 * icon routes to the detail page; the "+ Añadir" CTA creates a new empty
 * desinversion and routes straight to its detail page for editing.
 *
 * Figma reference: node `32:275620`. PDF: pp.5–6.
 */
@Component({
  selector: 'site-desinversiones-futuras-page',
  standalone: true,
  imports: [
    ButtonComponent,
    KbdComponent,
    PageHeaderComponent,
    TableComponent,
    ObjetivosPageShellComponent,
    KeyShortcutDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './desinversiones-futuras.page.html',
  styleUrls: ['./desinversiones-futuras.page.scss'],
})
export class DesinversionesFuturasPage {
  readonly store = inject(WealthPlannerStore);
  private readonly router = inject(Router);

  /** Cmd/Ctrl + A — bound via `siteKeyShortcut="a"` on the primary CTA. */
  readonly addShortcut: string[] = ['⌘', 'A'];

  // ── Objetivo labels (mirrors the detail-page options) ────────────────
  private readonly objetivoOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Generar liquidez' },
    { value: 'rentas', label: 'Generar rentas' },
  ];

  objetivoLabel(objetivo: DesinversionObjetivo | null): string {
    return this.objetivoOptions.find((o) => o.value === objetivo)?.label ?? '—';
  }

  formatEuro(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  // ── <afi-table> column + action defs (Propuesta preset — route flavor) ─
  readonly tableColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', emphasis: true },
    { key: 'objetivo', label: 'Objetivo' },
    { key: 'importeBruto', label: 'Importe bruto', align: 'end' },
    { key: 'importeNeto', label: 'Importe neto', align: 'end' },
  ];

  readonly tableActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', ariaLabel: 'Editar desinversión', icon: 'edit' },
    { key: 'duplicate', label: 'Duplicar', overflow: true },
    {
      key: 'delete',
      label: 'Borrar',
      overflow: true,
      variant: 'danger',
    },
  ];

  readonly tableRows = computed(() =>
    this.store.desinversiones().map((row) => ({
      id: row.id,
      nombre: row.nombre || 'Sin nombre',
      objetivo: this.objetivoLabel(row.objetivo),
      importeBruto: this.formatEuro(row.importeBruto),
      importeNeto: this.formatEuro(row.importeNeto),
    })),
  );

  // ── Actions ───────────────────────────────────────────────────────────
  openAdd(): void {
    const next = this.store.addDesinversion();
    this.router.navigate([
      '/demos/wealth-planner-2026/desinversiones-futuras',
      next.id,
    ]);
  }

  openEdit(id: string): void {
    this.router.navigate(['/demos/wealth-planner-2026/desinversiones-futuras', id]);
  }

  removeRow(id: string, event?: Event): void {
    event?.stopPropagation();
    this.store.removeDesinversion(id);
  }

  /** Duplicar: clone fields onto a new row, then navigate to its detail page. */
  duplicateRow(id: string): void {
    const source = this.store.desinversiones().find((r) => r.id === id);
    if (!source) return;
    const next = this.store.addDesinversion();
    this.store.updateDesinversion(next.id, {
      nombre: source.nombre ? `${source.nombre} (copia)` : '',
      objetivo: source.objetivo,
      frecuencia: source.frecuencia,
      plazoAnios: source.plazoAnios,
      activosAsignados: [...source.activosAsignados],
      importeBruto: source.importeBruto,
      importeNeto: source.importeNeto,
    });
    this.router.navigate(['/demos/wealth-planner-2026/desinversiones-futuras', next.id]);
  }

  /** Row-click → navigate to detail page. */
  onTableRowClick(event: { row: Record<string, unknown>; event: MouseEvent }): void {
    this.openEdit(event.row['id'] as string);
  }

  /** Row-action dispatcher (inline edit + overflow duplicate/delete). */
  onTableAction(event: { action: TableRowAction; row: Record<string, unknown> }): void {
    const id = event.row['id'] as string;
    switch (event.action.key) {
      case 'edit':
        this.openEdit(id);
        break;
      case 'duplicate':
        this.duplicateRow(id);
        break;
      case 'delete':
        this.removeRow(id);
        break;
    }
  }
}
