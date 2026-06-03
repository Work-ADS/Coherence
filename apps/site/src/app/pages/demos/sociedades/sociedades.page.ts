import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  PageHeaderComponent,
  SelectComponent,
  TableComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, TableRowAction } from '@coherence/ui';

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
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    SelectComponent,
    TableComponent,
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

  // ── <afi-table> column + action defs (Propuesta preset — modal flavor) ─
  readonly sociedadColumns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', emphasis: true },
    { key: 'tributacion', label: 'Tributación' },
  ];

  /**
   * Row-actions pattern (2026-05-28, team-locked): 1 primary inline + the
   * rest in the `⋯` overflow menu. Matches the patrimonial reference.
   *   - Editar → inline (most-used action; visible on hover via the
   *     primitive's `actionsReveal` setting)
   *   - Duplicar → overflow
   *   - Borrar → overflow + danger variant (auto-divider above it)
   */
  readonly sociedadActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', ariaLabel: 'Editar sociedad', icon: 'edit' },
    { key: 'duplicate', label: 'Duplicar', overflow: true },
    {
      key: 'delete',
      label: 'Borrar',
      overflow: true,
      variant: 'danger',
    },
  ];

  /**
   * Display rows. Maps the raw `Tributacion` enum value to its human label
   * so `<afi-table>` can render it directly without a custom cell renderer
   * (its `cellText` calls `String(value)`). `nombre` defaults to a
   * placeholder when blank, matching the bespoke table's prior behavior.
   */
  readonly sociedadRows = computed(() =>
    this.store.sociedades().map((s) => ({
      id: s.id,
      nombre: s.nombre || 'Sin nombre',
      tributacion: this.tributacionLabel(s.tributacion),
    })),
  );

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

  /**
   * Duplicar: minimum-viable demo flow. Creates a new sociedad with the
   * shape of the source (nombre + tributación copied; participantes left
   * empty in this MVP — would need a store-level deep-clone helper).
   * Opens the modal on the new row so the user can adjust.
   */
  duplicateSociedad(id: string): void {
    const source = this.store.sociedades().find((s) => s.id === id);
    if (!source) return;
    const next = this.store.addSociedad();
    this.store.updateSociedad(next.id, {
      nombre: source.nombre ? `${source.nombre} (copia)` : '',
      tributacion: source.tributacion,
    });
    this.editingId.set(next.id);
  }

  /**
   * Row-click handler from `<afi-table>` — opens the edit modal. Action
   * clicks (edit / delete) emit `rowActionClicked` instead and the table
   * stops propagation internally, so this handler only fires for genuine
   * row clicks.
   */
  onSociedadRowClick(event: { row: Record<string, unknown>; event: MouseEvent }): void {
    this.openEdit(event.row['id'] as string);
  }

  /**
   * Row-action handler from `<afi-table>`. Edit dispatches to the modal;
   * duplicate clones via the store; delete removes the sociedad. The
   * table's `onRowAction` already stopPropagated for inline actions, and
   * `onOverflowAction` closes the menu after emitting — so handlers here
   * stay side-effect-light.
   */
  onSociedadAction(event: { action: TableRowAction; row: Record<string, unknown> }): void {
    const id = event.row['id'] as string;
    switch (event.action.key) {
      case 'edit':
        this.openEdit(id);
        break;
      case 'duplicate':
        this.duplicateSociedad(id);
        break;
      case 'delete':
        this.removeSociedad(id);
        break;
    }
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
