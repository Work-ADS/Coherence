import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  BadgeComponent,
  ButtonComponent,
  IconButtonComponent,
  PageHeaderComponent,
  SwitchComponent,
} from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import {
  WealthPlannerStore,
  type ProductoProteccionTipo,
} from '../wealth-planner-2026/store';

type ProteccionRow = 'cliente' | 'conyuge';

const TIPO_LABELS: Record<ProductoProteccionTipo, string> = {
  'seguro-vida': 'Seguro de vida',
  'incapacidad-temporal': 'Incapacidad temporal',
  'incapacidad-permanente': 'Incapacidad permanente',
  dependencia: 'Dependencia',
  salud: 'Salud',
};

/**
 * Objetivos · Protección familiar (Brief H).
 *
 * Two toggleable rows (cliente + cónyuge) with per-row product lists.
 * Clicking "Añadir" navigates to the dedicated 3-step flujo page
 * (`/proteccion-familiar/flujo`) — Patrimonio a disponer → Impacto en
 * ingresos y gastos → Simulación. The flow is NOT a modal; it's its own
 * focused route.
 */
@Component({
  selector: 'site-proteccion-familiar-page',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    IconButtonComponent,
    PageHeaderComponent,
    SwitchComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proteccion-familiar.page.html',
  styleUrls: ['./proteccion-familiar.page.scss'],
})
export class ProteccionFamiliarPage {
  readonly store = inject(WealthPlannerStore);
  private readonly router = inject(Router);

  // ── Gate handler ──────────────────────────────────────────────────────
  setEstablished(value: boolean): void {
    this.store.setProteccionFamiliarEstablished(value);
  }

  // ── Navigate to the 3-step flujo ──────────────────────────────────────
  goToFlujo(row: ProteccionRow): void {
    this.router.navigate(
      ['/demos/wealth-planner-2026/proteccion-familiar/flujo'],
      { queryParams: { row } },
    );
  }

  // ── Row mutations ─────────────────────────────────────────────────────
  removeProducto(row: ProteccionRow, id: string): void {
    this.store.removeProteccionProducto(row, id);
  }

  deactivateRow(row: ProteccionRow): void {
    if (row === 'cliente') this.store.setClienteActiva(false);
    if (row === 'conyuge') this.store.setConyugeActiva(false);
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  tipoLabel(tipo: ProductoProteccionTipo | undefined): string {
    if (!tipo) return '';
    return TIPO_LABELS[tipo] ?? tipo;
  }

  beneficiarioLabel(id: string | undefined): string {
    if (!id) return '';
    const found = this.store.familiaParticipantes().find((p) => p.id === id);
    return found?.label ?? id;
  }

  formatEuro(n: number | undefined): string {
    if (n === undefined || !Number.isFinite(n)) return '€0';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);
  }
}
