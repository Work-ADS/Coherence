import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  BadgeComponent,
  ButtonComponent,
  ModalComponent,
  SwitchComponent,
} from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';

type ProteccionRow = 'cliente' | 'conyuge';

/**
 * Objetivos · Protección familiar (Brief H).
 *
 * Smallest of the four Objetivos pages. Two toggleable rows (cliente +
 * cónyuge — the second only when `tienePareja()` is true) with per-row
 * Activar/Consultar/Desactivar actions. The actual "Flujo de protección
 * familiar" wizard is out of scope here; clicking Activar/Consultar opens
 * a placeholder modal that lets the gestor mark the row as activated
 * manually for now, and the real wizard ships in a future iteration.
 *
 * Figma reference: node `60:36493`. PDF: p.6.
 */
@Component({
  selector: 'site-proteccion-familiar-page',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    ModalComponent,
    SwitchComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proteccion-familiar.page.html',
  styleUrls: ['./proteccion-familiar.page.scss'],
})
export class ProteccionFamiliarPage {
  readonly store = inject(WealthPlannerStore);

  /** Which row triggered the placeholder modal; null when the modal is closed. */
  readonly activatingRow = signal<ProteccionRow | null>(null);
  readonly flowPlaceholderOpen = computed(() => this.activatingRow() !== null);

  // ── Gate handler ──────────────────────────────────────────────────────
  setEstablished(value: boolean): void {
    this.store.setProteccionFamiliarEstablished(value);
  }

  // ── Modal handlers ────────────────────────────────────────────────────
  openFlowPlaceholder(row: ProteccionRow): void {
    this.activatingRow.set(row);
  }

  closeFlowPlaceholder(): void {
    this.activatingRow.set(null);
  }

  markActiveAndClose(): void {
    const row = this.activatingRow();
    if (row === 'cliente') this.store.setClienteActiva(true);
    if (row === 'conyuge') this.store.setConyugeActiva(true);
    this.activatingRow.set(null);
  }

  // ── Direct row mutations ──────────────────────────────────────────────
  deactivateCliente(): void {
    this.store.setClienteActiva(false);
  }

  deactivateConyuge(): void {
    this.store.setConyugeActiva(false);
  }
}
