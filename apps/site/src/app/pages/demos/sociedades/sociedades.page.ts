import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  InputComponent,
  KbdComponent,
  ModalComponent,
  PageHeaderComponent,
  SelectComponent,
  TableComponent,
  ToastComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, TableRowAction } from '@coherence/ui';

import { KeyShortcutDirective } from '../../../directives/key-shortcut.directive';
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
    KbdComponent,
    ModalComponent,
    PageHeaderComponent,
    SelectComponent,
    TableComponent,
    ToastComponent,
    DemoShellComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    VersionToggleComponent,
    KeyShortcutDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sociedades.page.html',
  styleUrls: ['./sociedades.page.scss'],
})
export class SociedadesPage {
  readonly store = inject(WealthPlannerStore);

  /** Cmd/Ctrl + A — bound via `siteKeyShortcut="a"` on the primary CTA. */
  readonly addShortcut: string[] = ['⌘', 'A'];

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
   * Row-actions: 2 inline icon buttons — Editar (default) + Borrar (danger).
   * Per `TableRowAction.overflow` JSDoc, the primitive renders both inline
   * when the action set has ≤ 2 entries (no overflow menu).
   */
  readonly sociedadActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', ariaLabel: 'Editar sociedad', icon: 'edit' },
    {
      key: 'delete',
      label: 'Borrar',
      ariaLabel: 'Borrar sociedad',
      icon: 'delete',
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
  /**
   * id of a sociedad created by `openAdd()` that hasn't been confirmed yet.
   * Tracks "Cancelar should discard a new row, but never an existing one."
   * Edit-flow keeps this null.
   */
  readonly pendingAddId = signal<string | null>(null);
  readonly dialogOpen = computed(() => this.editingId() !== null);

  /**
   * id of a sociedad the user has clicked Borrar on, awaiting confirmation.
   * Drives the destructive-confirm modal per `docs/rules/destructive-actions.md`.
   */
  readonly pendingDeleteId = signal<string | null>(null);
  readonly confirmDeleteOpen = computed(() => this.pendingDeleteId() !== null);
  readonly pendingDeleteRow = computed<Sociedad | null>(() => {
    const id = this.pendingDeleteId();
    if (id === null) return null;
    return this.store.sociedades().find((s) => s.id === id) ?? null;
  });

  // ── Action toast — `<afi-toast>` per `destructive-actions.md` § 6. ────
  // One toast covers both Add (receipt for Guardar) and Delete (receipt for
  // confirm). Undo routes by `lastAction.kind`. ⌘Z is wired below via a
  // HostListener so the shortcut works while the toast is alive.
  readonly actionToastVisible = signal<boolean>(false);
  readonly actionToastMessage = signal<string>('');
  readonly undoShortcut: string[] = ['⌘', 'Z'];

  /**
   * Snapshot of the most recent undoable action, used to route the toast's
   * Deshacer / ⌘Z. Set whenever Add or Delete commits; cleared on undo,
   * dismiss, or auto-timeout.
   */
  private lastAction = signal<
    | { kind: 'add'; addedId: string }
    | { kind: 'delete'; snapshot: Sociedad }
    | null
  >(null);

  /** Active dismiss timer; cleared if a new action fires before this one ends. */
  private actionToastTimer: ReturnType<typeof setTimeout> | null = null;

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
    this.pendingAddId.set(next.id);
  }

  openEdit(id: string): void {
    this.editingId.set(id);
    this.pendingAddId.set(null);
  }

  /**
   * Guardar: data is already persisted via the reactive setters as the
   * user types. Confirm the new row (clear pending flag) and close. When
   * this dialog session created a new sociedad, fire the action toast
   * with undo (removes the just-added row).
   */
  saveDialog(): void {
    const newlyAddedId = this.pendingAddId();
    this.pendingAddId.set(null);
    this.editingId.set(null);
    if (newlyAddedId !== null) {
      const added = this.store.sociedades().find((s) => s.id === newlyAddedId);
      const nombre = added?.nombre?.trim() || 'Sociedad sin nombre';
      this.lastAction.set({ kind: 'add', addedId: newlyAddedId });
      this.showActionToast(`${nombre} añadida`);
    }
  }

  /**
   * Cancelar: if this dialog session created a new row, drop it so it
   * never shows up in the table. Edit-flow just closes (existing row
   * stays as-is).
   */
  cancelDialog(): void {
    const pending = this.pendingAddId();
    if (pending !== null) {
      this.store.removeSociedad(pending);
    }
    this.pendingAddId.set(null);
    this.editingId.set(null);
  }

  /**
   * Step 1 of the destructive-confirm flow — stage the row for deletion
   * and open the confirm modal. The actual store mutation only happens
   * after `confirmDelete()`.
   */
  askDelete(id: string, event?: Event): void {
    event?.stopPropagation();
    this.pendingDeleteId.set(id);
  }

  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (id !== null) {
      const target = this.store.sociedades().find((s) => s.id === id);
      if (target) {
        const nombre = target.nombre?.trim() || 'Sociedad sin nombre';
        // Deep snapshot so the participantes array doesn't share refs with
        // the live store (the user could edit them, undo, and the snapshot
        // would be polluted). Cheap for the realistic 0-2 sociedad case.
        const snapshot: Sociedad = {
          ...target,
          participantes: target.participantes.map((p) => ({ ...p })),
        };
        this.store.removeSociedad(id);
        this.lastAction.set({ kind: 'delete', snapshot });
        this.showActionToast(`${nombre} borrada`);
      }
    }
    this.pendingDeleteId.set(null);
  }

  // ── Action toast lifecycle ────────────────────────────────────────────
  private showActionToast(message: string): void {
    if (this.actionToastTimer !== null) {
      clearTimeout(this.actionToastTimer);
    }
    this.actionToastMessage.set(message);
    this.actionToastVisible.set(true);
    this.actionToastTimer = setTimeout(() => {
      this.actionToastVisible.set(false);
      this.lastAction.set(null);
      this.actionToastTimer = null;
    }, 5000);
  }

  dismissActionToast(): void {
    if (this.actionToastTimer !== null) {
      clearTimeout(this.actionToastTimer);
      this.actionToastTimer = null;
    }
    this.actionToastVisible.set(false);
    this.lastAction.set(null);
  }

  /**
   * Toast Deshacer / ⌘Z handler. Routes by `lastAction.kind`:
   *  - add    → removes the just-added row.
   *  - delete → re-creates the row from the snapshot. The store mints a
   *             fresh id (no insertAt API), but the user-visible fields
   *             (nombre, tributación, participantes %) are preserved.
   */
  undoLastAction(): void {
    const last = this.lastAction();
    if (last === null) return;
    if (last.kind === 'add') {
      this.store.removeSociedad(last.addedId);
    } else {
      const next = this.store.addSociedad();
      this.store.updateSociedad(next.id, {
        nombre: last.snapshot.nombre,
        tributacion: last.snapshot.tributacion,
      });
      for (const p of last.snapshot.participantes) {
        this.store.updateParticipante(next.id, p.id, p.porcentaje);
      }
    }
    this.dismissActionToast();
  }

  @HostListener('document:keydown', ['$event'])
  onUndoKeydown(event: KeyboardEvent): void {
    if (!this.actionToastVisible() || this.lastAction() === null) return;
    const isUndo =
      (event.key === 'z' || event.key === 'Z') &&
      (event.metaKey || event.ctrlKey) &&
      !event.shiftKey;
    if (!isUndo) return;
    // Don't steal ⌘Z away from text inputs (native undo inside a field
    // should still win, even with our toast up).
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    event.preventDefault();
    this.undoLastAction();
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
      case 'delete':
        this.askDelete(id);
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
