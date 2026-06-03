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
  IconButtonComponent,
  InputComponent,
  ModalComponent,
  PageHeaderComponent,
  SegmentedControlComponent,
  SelectComponent,
  StepperComponent,
  SwitchComponent,
} from '@coherence/ui';
import type { SelectOption, SegmentedOption } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import {
  WealthPlannerStore,
  type ProductoProteccion,
  type ProductoProteccionTipo,
} from '../wealth-planner-2026/store';

type ProteccionRow = 'cliente' | 'conyuge';

const TIPO_OPTIONS: SegmentedOption[] = [
  { value: 'seguro-vida', label: 'Seguro de vida' },
  { value: 'incapacidad-temporal', label: 'Incapacidad temporal' },
  { value: 'incapacidad-permanente', label: 'Incapacidad permanente' },
  { value: 'dependencia', label: 'Dependencia' },
  { value: 'salud', label: 'Salud' },
];

const TIPO_LABELS: Record<ProductoProteccionTipo, string> = {
  'seguro-vida': 'Seguro de vida',
  'incapacidad-temporal': 'Incapacidad temporal',
  'incapacidad-permanente': 'Incapacidad permanente',
  dependencia: 'Dependencia',
  salud: 'Salud',
};

/**
 * Objetivos · Protección familiar (Brief H + H-Plus).
 *
 * Two toggleable rows (cliente + cónyuge) with per-row product lists.
 * Clicking Activar/Consultar opens a 4-step wizard inside an afi-modal
 * that captures tipo, beneficiario, capital and prima. Multiple products
 * per row are supported; the row badge reflects product presence.
 */
@Component({
  selector: 'site-proteccion-familiar-page',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    SegmentedControlComponent,
    SelectComponent,
    StepperComponent,
    SwitchComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proteccion-familiar.page.html',
  styleUrls: ['./proteccion-familiar.page.scss'],
})
export class ProteccionFamiliarPage {
  readonly store = inject(WealthPlannerStore);

  // ── Wizard state ──────────────────────────────────────────────────────
  readonly wizardRow = signal<ProteccionRow | null>(null);
  readonly wizardOpen = computed(() => this.wizardRow() !== null);
  readonly editingId = signal<string | null>(null);
  readonly step = signal<1 | 2 | 3 | 4>(1);
  readonly draft = signal<Partial<ProductoProteccion>>({});

  readonly stepValid = computed(() => {
    const d = this.draft();
    switch (this.step()) {
      case 1:
        return d.tipo != null;
      case 2:
        return d.beneficiarioId != null && d.beneficiarioId.trim() !== '';
      case 3:
        return (d.capital ?? 0) > 0;
      case 4:
        return (d.prima ?? 0) > 0;
    }
  });

  readonly stepperItems = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'beneficiario', label: 'Beneficiario' },
    { key: 'capital', label: 'Capital' },
    { key: 'prima', label: 'Prima' },
  ];

  readonly tipoOptions = TIPO_OPTIONS;

  readonly beneficiarioOptions = computed<SelectOption[]>(() =>
    this.store.familiaParticipantes().map((p) => ({
      value: p.id,
      label: p.label,
    })),
  );

  // ── Gate handler ──────────────────────────────────────────────────────
  setEstablished(value: boolean): void {
    this.store.setProteccionFamiliarEstablished(value);
  }

  // ── Wizard open / close ───────────────────────────────────────────────
  openWizard(row: ProteccionRow, editingId?: string): void {
    this.wizardRow.set(row);
    this.editingId.set(editingId ?? null);
    this.step.set(1);

    if (editingId) {
      const person = this.store.proteccionFamiliar()[row];
      const producto = person.productos.find((p) => p.id === editingId);
      if (producto) {
        this.draft.set({ ...producto });
        return;
      }
    }
    this.draft.set({});
  }

  closeWizard(): void {
    this.wizardRow.set(null);
    this.editingId.set(null);
    this.step.set(1);
    this.draft.set({});
  }

  nextStep(): void {
    this.step.update((s) => Math.min(4, s + 1) as 1 | 2 | 3 | 4);
  }

  prevStep(): void {
    this.step.update((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4);
  }

  saveProducto(): void {
    const row = this.wizardRow();
    if (!row) return;
    const d = this.draft();
    if (!d.tipo || !d.beneficiarioId || !(d.capital! > 0) || !(d.prima! > 0)) return;

    const payload: Omit<ProductoProteccion, 'id'> = {
      tipo: d.tipo,
      beneficiarioId: d.beneficiarioId,
      capital: d.capital ?? 0,
      prima: d.prima ?? 0,
    };

    const editing = this.editingId();
    if (editing) {
      this.store.updateProteccionProducto(row, editing, payload);
    } else {
      this.store.addProteccionProducto(row, payload);
    }
    this.closeWizard();
  }

  // ── Draft setters ─────────────────────────────────────────────────────
  setDraftTipo(value: string): void {
    this.draft.update((d) => ({ ...d, tipo: value as ProductoProteccionTipo }));
  }

  setDraftBeneficiario(value: string | number | null): void {
    this.draft.update((d) => ({ ...d, beneficiarioId: String(value ?? '') }));
  }

  setDraftCapital(value: string | number | null): void {
    const num = typeof value === 'number' ? value : parseFloat(String(value ?? '0'));
    this.draft.update((d) => ({ ...d, capital: Number.isFinite(num) ? num : 0 }));
  }

  setDraftPrima(value: string | number | null): void {
    const num = typeof value === 'number' ? value : parseFloat(String(value ?? '0'));
    this.draft.update((d) => ({ ...d, prima: Number.isFinite(num) ? num : 0 }));
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
