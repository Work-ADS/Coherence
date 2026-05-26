import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  ModalComponent,
  PageHeaderComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type {
  InversionFuturaRow,
  InversionFuturaTipo,
} from '../wealth-planner-2026/store';

/**
 * Objetivos · Inversiones futuras (Brief F).
 *
 * Optional section — captures planned future asset acquisitions (Vivienda
 * o Otros). Table + add/edit modal, same shape as Sociedades and
 * Ingresos/Gastos. The `<site-objetivos-banner>` strip is gated on
 * `store.legadoRetiroEstablished()` via the shared `<site-objetivos-page-shell>`.
 *
 * Figma reference: node `28:174808` ("↳ Inversiones futuras") in file
 * `888lN7vbJSc4gLYt7nP3DW`. PDF: p.5 ("Inversiones futuras (opcional)").
 */
@Component({
  selector: 'site-inversiones-futuras-page',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    SelectComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inversiones-futuras.page.html',
  styleUrls: ['./inversiones-futuras.page.scss'],
})
export class InversionesFuturasPage {
  readonly store = inject(WealthPlannerStore);

  // ── Tipo options (locked per PDF p.5) ─────────────────────────────────
  readonly tipoOptions: SelectOption[] = [
    { value: 'vivienda', label: 'Vivienda' },
    { value: 'otros', label: 'Otros' },
  ];

  /**
   * Titular options derived from the Familia store — same shape as Sociedades'
   * participación accionarial picker but flattened to SelectOption[].
   */
  readonly titularOptions = computed<SelectOption[]>(() =>
    this.store.familiaParticipantes().map((p) => ({
      value: p.id,
      label: p.label,
    })),
  );

  // ── Dialog state ──────────────────────────────────────────────────────
  /** id of the inversión being edited; null when dialog is closed. */
  readonly editingId = signal<string | null>(null);
  readonly dialogOpen = computed(() => this.editingId() !== null);

  readonly editing = computed<InversionFuturaRow | null>(() => {
    const id = this.editingId();
    if (id === null) return null;
    return this.store.inversionesFuturas().find((row) => row.id === id) ?? null;
  });

  // ── Label helpers (used by the table) ─────────────────────────────────
  tipoLabel(tipo: InversionFuturaTipo | null): string {
    return this.tipoOptions.find((o) => o.value === tipo)?.label ?? '—';
  }

  titularLabel(id: string | null): string {
    if (id === null) return '—';
    return this.titularOptions().find((o) => o.value === id)?.label ?? '—';
  }

  formatEuro(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatAnio(anio: number | null): string {
    return anio === null ? '—' : String(anio);
  }

  // ── Actions ───────────────────────────────────────────────────────────
  openAdd(): void {
    const next = this.store.addInversionFutura();
    this.editingId.set(next.id);
  }

  openEdit(id: string): void {
    this.editingId.set(id);
  }

  closeDialog(): void {
    this.editingId.set(null);
  }

  removeInversionFutura(id: string, event?: Event): void {
    event?.stopPropagation();
    this.store.removeInversionFutura(id);
  }

  // ── Field handlers ────────────────────────────────────────────────────
  private toStr(value: string | number | null): string {
    return value === null ? '' : String(value);
  }

  private toNumberOrNull(value: string | number | null): number | null {
    if (value === null || value === '') return null;
    const next = Number(value);
    return Number.isFinite(next) ? next : null;
  }

  setNombre(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, { nombre: this.toStr(value) });
  }

  setTipo(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      tipo: (value as InversionFuturaTipo | null) ?? null,
    });
  }

  setAnio(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, { anio: this.toNumberOrNull(value) });
  }

  setImporte(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    const num = this.toNumberOrNull(value);
    this.store.updateInversionFutura(id, {
      importe: num === null ? 0 : Math.max(0, num),
    });
  }

  setTitular(value: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateInversionFutura(id, {
      titular: value === null || value === '' ? null : String(value),
    });
  }
}
