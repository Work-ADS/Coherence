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

import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import {
  VersionToggleComponent,
  type VersionOption,
} from '../shared/version-toggle.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type { Sociedad, Tributacion } from '../wealth-planner-2026/store';

/**
 * Situación Actual · Sociedades.
 *
 * Captures the investment vehicles (sociedades patrimoniales / holdings /
 * SOCIMI) through which the family invests. Borja-introduced in 2026 per
 * PDF p.1 + Granola 2026-02-26 / 2026-03-05.
 *
 * Figma references:
 *   - Empty state:      `7:15629`
 *   - Populated table:  `12:42751`
 *   - Add/edit dialog:  `9:20736`
 */
@Component({
  selector: 'site-sociedades-page',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    SelectComponent,
    DemoShellComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    VersionToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sociedades.page.html',
  styleUrls: ['./sociedades.page.scss'],
})
export class SociedadesPage {
  readonly store = inject(WealthPlannerStore);

  // ── Tributación options (confirmed Mar 5 with Borja) ──────────────────
  readonly tributacionOptions: SelectOption[] = [
    { value: 'patrimonial', label: 'Patrimonial' },
    { value: 'holding', label: 'Holding' },
    { value: 'socimi', label: 'SOCIMI' },
  ];

  // ── Dialog state ──────────────────────────────────────────────────────
  /** id of the sociedad being edited; null when dialog is closed. */
  readonly editingId = signal<string | null>(null);
  readonly dialogOpen = computed(() => this.editingId() !== null);

  /** Reactive view of the sociedad in the dialog (or null when closed). */
  readonly editing = computed<Sociedad | null>(() => {
    const id = this.editingId();
    if (id === null) return null;
    return this.store.sociedades().find((s) => s.id === id) ?? null;
  });

  /** Total participación across all participantes — informational, not a constraint. */
  readonly editingTotalParticipacion = computed<number>(() => {
    const s = this.editing();
    if (s === null) return 0;
    return s.participantes.reduce((sum, p) => sum + p.porcentaje, 0);
  });

  // ── Version-toggle (v1 only for now; v2/v3 reserved) ──────────────────
  readonly version = signal<string>('v1');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];
  setVersion(v: string): void {
    this.version.set(v);
  }

  // ── Tributación label helper ──────────────────────────────────────────
  tributacionLabel(t: Tributacion | null): string {
    return this.tributacionOptions.find((o) => o.value === t)?.label ?? '—';
  }

  // ── Actions ───────────────────────────────────────────────────────────
  openAdd(): void {
    const next = this.store.addSociedad();
    this.editingId.set(next.id);
  }

  openEdit(id: string): void {
    this.editingId.set(id);
  }

  closeDialog(): void {
    this.editingId.set(null);
  }

  removeSociedad(id: string, event?: Event): void {
    event?.stopPropagation();
    this.store.removeSociedad(id);
  }

  // ── Field handlers ────────────────────────────────────────────────────
  private toStr(v: string | number | null): string {
    return v === null ? '' : String(v);
  }

  setNombre(v: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateSociedad(id, { nombre: this.toStr(v) });
  }

  setTributacion(v: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    this.store.updateSociedad(id, {
      tributacion: (v as Tributacion | null) ?? null,
    });
  }

  setParticipacion(participanteId: string, v: string | number | null): void {
    const id = this.editingId();
    if (id === null) return;
    const num = v === null || v === '' ? 0 : Number(v);
    if (Number.isNaN(num)) return;
    this.store.updateParticipante(id, participanteId, num);
  }
}
