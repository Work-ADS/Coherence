import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
  type WritableSignal,
} from '@angular/core';

import {
  ButtonComponent,
  CardComponent,
  IconButtonComponent,
  InputComponent,
  KbdComponent,
  MenuComponent,
  MenuDividerComponent,
  MenuItemComponent,
  ModalComponent,
  PageHeaderComponent,
  SegmentedControlComponent,
  SelectComponent,
  SwitchComponent,
  TableComponent,
} from '@coherence/ui';
import type { SegmentedOption, SelectOption, TableColumn, TableRowAction } from '@coherence/ui';

import {
  PatrimonioAddDialogComponent,
  type PatrimonioAddDialogPayload,
} from './patrimonio-add-dialog/patrimonio-add-dialog.component';

// GraphCardHeaderComponent removed 2026-06-10 — per-section headers now use
// <afi-page-header level="section"> per the canonical migration.
import { KeyShortcutDirective } from '../../../directives/key-shortcut.directive';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import {
  TIPO_PATRIMONIO_TOP_LABEL,
  WealthPlannerStore,
} from '../wealth-planner-2026/store';
import type {
  CrecimientoMode,
  Frecuencia,
  InmobiliarioUso,
  NivelRiesgo,
  PatrimonioAddMode,
  PatrimonioAsset,
  PatrimonioTipo,
  PatrimonioTitular,
  RentabilidadRiesgo,
  TipoGeneracion,
  TipoPatrimonioTop,
} from '../wealth-planner-2026/store';
import { ActionToastComponent } from '../shared/action-toast.component';
import { bridgeDesignReviewVersion } from '../shared/design-review-bridge';
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
// VersionToggleComponent removed from imports 2026-06-10 — inline pill is
// globally hidden in styles.scss; floating design-review widget handles the
// V1/V2/V3 selector via `bridgeDesignReviewVersion`.
import type { VersionOption } from '../shared/version-toggle.component';

type LayoutVersion = 'v1' | 'v2' | 'v3';

type AssetColumn = {
  key: string;
  label: string;
  align?: 'end';
  emphasis?: boolean;
  width: string;
};

type AssetRow = {
  id?: string;
  name: string;
  nameTags?: string[];
  subtitle?: string | null;
  entidad: string;
  valorNum: number;
  cells: Record<string, string>;
  children?: AssetRow[];
};

type AssetSection = {
  key: string;
  title: string;
  total: string;
  description: string;
  columns: AssetColumn[];
  rows: AssetRow[];
};

type AddedAsset = {
  sectionKey: string;
  row: AssetRow;
};

/**
 * Propuesta — Patrimonio.
 *
 * Página de listado: navegación completa, cabecera con acciones y métricas,
 * pestañas por clase de activo y tablas desglosadas.
 *
 * Figma reference: node `298:74807`.
 */
@Component({
  selector: 'site-patrimonial-proposal-page',
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    IconButtonComponent,
    InputComponent,
    KbdComponent,
    MenuComponent,
    MenuDividerComponent,
    MenuItemComponent,
    ModalComponent,
    PageHeaderComponent,
    SegmentedControlComponent,
    SelectComponent,
    SwitchComponent,
    TableComponent,
    DemoShellComponent,
    ActionToastComponent,
    PatrimonioAddDialogComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    KeyShortcutDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patrimonial-proposal.page.html',
  styleUrls: ['./patrimonial-proposal.page.scss'],
})
export class PatrimonialProposalPage {
  readonly store = inject(WealthPlannerStore);

  constructor() {
    // Measure the tab strip after first render so the left/right chevrons
    // reflect actual overflow from page load (not just after the user scrolls).
    afterNextRender(() => this.measureTabs());

    bridgeDesignReviewVersion(this.version as unknown as WritableSignal<string>);
  }

  readonly addDialogOpen = signal(false);
  readonly addCategoryMenuOpen = signal(false);
  readonly activeAddCategory = signal<TipoPatrimonioTop | null>(null);
  readonly editingAsset = signal<PatrimonioAsset | null>(null);

  readonly dialogOpen = computed(
    () => this.activeAddCategory() !== null || this.editingAsset() !== null,
  );

  readonly dialogCategory = computed<TipoPatrimonioTop | null>(() => {
    const editing = this.editingAsset();
    if (editing) return editing.tipoTop ?? this.tipoToTipoTop(editing.tipo);
    return this.activeAddCategory();
  });

  readonly categoryMenuItems: ReadonlyArray<{
    value: TipoPatrimonioTop;
    label: string;
    dividerBefore?: boolean;
  }> = [
    { value: 'liquidez', label: 'Liquidez' },
    { value: 'inversion', label: 'Inversiones' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'private-equity', label: 'Private equity' },
    { value: 'plan-pensiones', label: 'Planes de pensiones' },
    { value: 'participaciones', label: 'Participaciones empresariales' },
    { value: 'otros-activos', label: 'Otros activos' },
    { value: 'deudas', label: 'Deuda', dividerBefore: true },
    { value: 'seguro-vida', label: 'Seguro de vida' },
  ];

  onAddTriggerClick(): void {
    if (this.version() === 'v3') {
      this.addCategoryMenuOpen.set(!this.addCategoryMenuOpen());
    } else {
      this.addDialogOpen.set(true);
    }
  }

  selectCategory(value: TipoPatrimonioTop): void {
    this.addCategoryMenuOpen.set(false);
    this.activeAddCategory.set(value);
  }

  onAddDialogOpenChange(open: boolean): void {
    if (!open) {
      this.activeAddCategory.set(null);
      this.editingAsset.set(null);
    }
  }

  onAddDialogSave(event: PatrimonioAddDialogPayload): void {
    const label = this.categoryMenuItems.find(c => c.value === event.category)?.label ?? '';
    const partial = this.payloadToAssetPartial(event);

    if (event.id) {
      const existingInAdded = this.addedAssets().find(a => a.row.id === event.id);
      if (existingInAdded) {
        // v3-added row — update store in place and replace the row in
        // addedAssets so the table reflects the edit.
        this.store.updateAsset(event.id, partial);
        const built = this.buildAddedAssetFromPayload(event, event.id);
        this.addedAssets.update(arr =>
          arr.map(a => (a.row.id === event.id ? built : a)),
        );
        this.latestAddedAssetId.set(event.id);
      } else {
        // Seed / page-only row: soft-delete the original and surface the
        // edited copy with a fresh id so it doesn't get re-filtered by the
        // deletedAssetIds set.
        this.deletedAssetIds.update((set) => {
          const next = new Set(set);
          next.add(event.id!);
          return next;
        });
        const editId = this.makeAssetId();
        const asset: PatrimonioAsset = { id: editId, ...partial } as PatrimonioAsset;
        this.store.addAsset(asset);
        this.addedAssets.update(arr => [
          this.buildAddedAssetFromPayload(event, editId),
          ...arr,
        ]);
        this.latestAddedAssetId.set(editId);
      }
      this.savedToastMessage.set(`${label} actualizado`);
    } else {
      const newId = this.makeAssetId();
      const asset: PatrimonioAsset = { id: newId, ...partial } as PatrimonioAsset;
      this.store.addAsset(asset);
      this.addedAssets.update(arr => [
        this.buildAddedAssetFromPayload(event, newId),
        ...arr,
      ]);
      this.latestAddedAssetId.set(newId);
      this.savedToastMessage.set(`Activo «${asset.nombre || label}» añadido`);
    }

    this.savedToastVisible.set(true);
    window.setTimeout(() => this.savedToastVisible.set(false), 3500);
  }

  private makeAssetId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `patrimonio-${crypto.randomUUID().slice(0, 8)}`
      : `patrimonio-${Math.random().toString(36).slice(2, 10)}`;
  }

  private tipoTopToSectionKey(top: TipoPatrimonioTop): string {
    switch (top) {
      case 'liquidez':
        return 'liquidez';
      case 'inversion':
        return 'inversiones';
      case 'inmobiliario':
        return 'inmobiliario';
      case 'private-equity':
        return 'private-equity';
      case 'plan-pensiones':
        return 'planes-pensiones';
      case 'participaciones':
        return 'participaciones';
      case 'otros-activos':
        return 'otros';
      case 'deudas':
        return 'deudas';
      case 'seguro-vida':
        return 'seguros';
    }
  }

  private buildAddedAssetFromPayload(
    payload: PatrimonioAddDialogPayload,
    id: string,
  ): AddedAsset {
    const sectionKey = this.tipoTopToSectionKey(payload.category);
    const valorNum = Number.parseFloat(payload.valor) || 0;
    const valorLabel = this.formatEuro(valorNum);
    const entidad = payload.entidad || '—';
    const name = payload.nombre || TIPO_PATRIMONIO_TOP_LABEL[payload.category];
    return {
      sectionKey,
      row: {
        id,
        name,
        entidad,
        valorNum,
        cells: this.cellsForNewAsset(sectionKey, valorLabel, entidad),
      },
    };
  }

  /** Map the new v3 TipoPatrimonioTop down to the legacy v1/v2 PatrimonioTipo
   *  so existing readers (filter chips, downstream tables, etc.) still get the
   *  right grouping. Seguro de vida and Private equity don't have a 1:1 in the
   *  legacy enum — collapse to 'otro' (universal catch-all). */
  private tipoTopToTipo(top: TipoPatrimonioTop): PatrimonioTipo {
    switch (top) {
      case 'liquidez':
        return 'liquidez';
      case 'inversion':
        return 'inversion';
      case 'inmobiliario':
        return 'inmobiliario';
      case 'private-equity':
        return 'inversion';
      case 'plan-pensiones':
        return 'pension';
      case 'participaciones':
        return 'participacion';
      case 'otros-activos':
        return 'otro';
      case 'deudas':
        return 'deudas';
      case 'seguro-vida':
        return 'otro';
    }
  }

  /** Inverse mapping for hydrating the dialog from an asset whose `tipoTop`
   *  field was never written (seed data + v1/v2 modal output). */
  private tipoToTipoTop(tipo: PatrimonioTipo): TipoPatrimonioTop {
    switch (tipo) {
      case 'liquidez':
        return 'liquidez';
      case 'inversion':
      case 'fondos':
      case 'acciones-cotizadas':
        return 'inversion';
      case 'inmobiliario':
        return 'inmobiliario';
      case 'pension':
        return 'plan-pensiones';
      case 'participacion':
      case 'participaciones-empresariales':
        return 'participaciones';
      case 'otro':
      case 'otros':
        return 'otros-activos';
      case 'deudas':
        return 'deudas';
    }
  }

  private payloadToAssetPartial(p: PatrimonioAddDialogPayload): Partial<PatrimonioAsset> {
    const toNumber = (v: string): number | undefined => {
      if (v === '') return undefined;
      const n = Number.parseFloat(v);
      return Number.isFinite(n) ? n : undefined;
    };

    const titulares: PatrimonioTitular[] = Object.entries(p.titularesActivos)
      .filter(([, active]) => active)
      .map(([titularId], i) => ({
        id: `titular-${titularId}-${i}`,
        titularId,
        porcentaje: toNumber(p.titularPorcentajes[titularId] ?? '') ?? 0,
      }));

    const partial: Partial<PatrimonioAsset> = {
      nombre: p.nombre,
      tipo: this.tipoTopToTipo(p.category),
      tipoTop: p.category,
      valor: toNumber(p.valor) ?? 0,
      entidad: p.entidad ?? undefined,
      addMode: p.mode,
      tipoInversion: p.inversionType ?? undefined,
      patrimonioFuturo: p.patrimonioFuturo === 'si',
      anoObtencion: toNumber(p.anoObtencion),
      generaIngresos: p.generaIngresos === 'si',
      frecuencia: p.frecuencia ?? undefined,
      tipoGeneracion: p.tipoGeneracion,
      generacionValor:
        p.tipoGeneracion === 'porcentaje'
          ? toNumber(p.porcentajeIngresos)
          : toNumber(p.importeIngresos),
      crecimientoMode: p.crecimientoMode,
      crecimientoManual: toNumber(p.crecimientoManual),
      titulares,
      revalorizacion:
        p.tipoRevalorizacion === 'manual' ? toNumber(p.revalorizacionManual) : undefined,
    };

    return partial;
  }


  readonly rowActionsOpen = signal<string | null>(null);
  readonly addTipo = signal<string>('liquidez');
  readonly addImporte = signal<string>('');
  readonly addEntidad = signal<string>('santander');
  readonly addDescripcion = signal<string>('');
  readonly escShortcut: string[] = ['Esc'];

  /** Page-level layout version. V3 (2026-06-17) is the new per-category
   *  dropdown + dialog shell default; V1 and V2 are preserved unchanged via
   *  the floating design-review widget so seniors can still compare. */
  readonly version = signal<LayoutVersion>('v3');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];
  setVersion(v: string): void {
    if (v === 'v1' || v === 'v2' || v === 'v3') this.version.set(v);
  }

  // ── Dialog wiring (inline afi-modal, type="form") ─────────────────────
  // The "Añadir" dialog now uses afi-modal directly (type="form"),
  // projecting body content with site-dialog-summary-card + collapsible
  // afi-page-header subsections. This replaces the old encapsulated
  // <site-patrimonio-add-modal> component so the modal template is
  // centralised in afi-modal itself.

  /** Total patrimonios currently in the store. */
  readonly dialogContextTotal = computed(() =>
    this.store.patrimonio().reduce((sum, a) => sum + a.valor, 0),
  );

  /** Human label for the dialog summary card. */
  readonly dialogContextLabel = signal<string>('Patrimonio total');

  /** Titular options — built from cliente + cónyuge + hijos. */
  readonly dialogTitularOptions = computed<SelectOption[]>(() => {
    const opts: SelectOption[] = [{ value: 'cliente', label: 'Cliente' }];
    if (this.store.conyugeStatus() === 'yes' && this.store.conyuge()) {
      opts.push({ value: 'conyuge', label: 'Cónyuge' });
    }
    for (const h of this.store.hijos()) {
      opts.push({ value: h.id, label: h.alias || `Hijo ${h.id}` });
    }
    return opts;
  });

  /** Activo financiado options for the Deudas branch — current patrimonio
   *  assets the user could be financing. */
  readonly dialogActivosFinanciables = computed<SelectOption[]>(() => {
    const opts: SelectOption[] = [{ value: 'ninguno', label: 'Ninguno' }];
    for (const a of this.store.patrimonio()) {
      opts.push({ value: a.id, label: a.nombre });
    }
    return opts;
  });

  onDialogSave(asset: PatrimonioAsset): void {
    this.store.addAsset(asset);
    this.savedToastMessage.set(`Activo «${asset.nombre}» añadido`);
    this.savedToastVisible.set(true);
    window.setTimeout(() => this.savedToastVisible.set(false), 3500);
  }

  readonly addTipoOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Liquidez' },
    { value: 'inversion', label: 'Inversión' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'pension', label: 'Plan de pensiones' },
    { value: 'participacion', label: 'Participación empresarial' },
    { value: 'otro', label: 'Otro' },
  ];

  /** Sub-tipos revealed when Tipo = Inversión. `cartera` is the most complex
   * case and unlocks an ISIN field + a dynamic Composición list below. */
  readonly addSubtipoOptions: SelectOption[] = [
    { value: 'cartera', label: 'Cartera' },
    { value: 'fondo', label: 'Fondo' },
    { value: 'etf', label: 'ETF' },
    { value: 'accion', label: 'Acción' },
  ];

  readonly addHoldingTipoOptions: SelectOption[] = [
    { value: 'etf', label: 'ETF' },
    { value: 'fondo', label: 'Fondo' },
    { value: 'accion', label: 'Acción' },
    { value: 'bono', label: 'Bono' },
    { value: 'liquidez', label: 'Liquidez' },
  ];

  readonly addEntidadOptions: SelectOption[] = [
    { value: 'santander', label: 'Santander' },
    { value: 'ing', label: 'ING' },
    { value: 'bankinter', label: 'Bankinter' },
    { value: 'renta-4', label: 'Renta 4' },
    { value: 'degiro', label: 'Degiro' },
    { value: 'indexa', label: 'Indexa Capital' },
  ];

  // ---- Cartera state (most complex patrimonio: parent + holdings) ----
  readonly addSubtipo = signal<string>('cartera');
  readonly addIsin = signal<string>('');
  readonly addHoldings = signal<{ id: number; name: string; tipo: string; importe: string }[]>([
    { id: 1, name: 'iShares MSCI World', tipo: 'etf', importe: '42000' },
    { id: 2, name: 'Global Bond Fund', tipo: 'fondo', importe: '20300' },
  ]);

  setAddSubtipo(v: string | number | null): void {
    this.addSubtipo.set(v !== null ? String(v) : '');
  }
  setAddIsin(v: string | number | null): void {
    this.addIsin.set(v !== null ? String(v) : '');
  }

  isCartera(): boolean {
    return this.addTipo() === 'inversion' && this.addSubtipo() === 'cartera';
  }

  addHoldingsTotal(): number {
    return this.addHoldings().reduce((s, h) => s + (parseFloat(h.importe) || 0), 0);
  }

  addHolding(): void {
    const next = Math.max(0, ...this.addHoldings().map((h) => h.id)) + 1;
    this.addHoldings.update((rows) => [...rows, { id: next, name: '', tipo: 'etf', importe: '' }]);
  }
  removeHolding(id: number): void {
    this.addHoldings.update((rows) => rows.filter((h) => h.id !== id));
  }
  setHoldingName(id: number, v: string | number | null): void {
    this.addHoldings.update((rows) =>
      rows.map((h) => (h.id === id ? { ...h, name: v !== null ? String(v) : '' } : h)),
    );
  }
  setHoldingTipo(id: number, v: string | number | null): void {
    this.addHoldings.update((rows) =>
      rows.map((h) => (h.id === id ? { ...h, tipo: v !== null ? String(v) : '' } : h)),
    );
  }
  setHoldingImporte(id: number, v: string | number | null): void {
    this.addHoldings.update((rows) =>
      rows.map((h) => (h.id === id ? { ...h, importe: v !== null ? String(v) : '' } : h)),
    );
  }
  holdingTipoLabel(tipo: string): string {
    return this.addHoldingTipoOptions.find((o) => o.value === tipo)?.label ?? tipo;
  }
  inputValue(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  /** Parses a numeric string. Returns null if empty / not a number — so the
   * preview can distinguish "not typed yet" from "0". */
  parseImporte(s: string): number | null {
    if (!s || !s.trim()) return null;
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  // ---- Edit mode (stub) — toggled by the pencil icon in the control strip.
  //      Full edit-mode UI (checkboxes, bulk-delete, etc.) will follow; for now
  //      the toggle wires the button state + tooltip label flip. ----

  // ---- Save flow: switch tab to the new activo's section + confirmation toast ----
  readonly savedToastVisible = signal(false);
  readonly savedToastMessage = signal<string>('');
  readonly addedAssets = signal<AddedAsset[]>([]);
  readonly latestAddedAssetId = signal<string | null>(null);
  private savedToastTimer?: ReturnType<typeof setTimeout>;
  private latestAddedTimer?: ReturnType<typeof setTimeout>;

  /** Maps the current `addTipo()` to the matching section `key` in `this.sections`. */
  private sectionKeyForTipo(): string {
    switch (this.addTipo()) {
      case 'liquidez':
        return 'liquidez';
      case 'inversion':
        return 'inversiones';
      case 'inmobiliario':
        return 'inmobiliario';
      case 'pension':
        return 'planes-pensiones';
      case 'participacion':
        return 'participaciones';
      default:
        return 'otros';
    }
  }

  saveNewActivo(): void {
    const newAsset = this.buildNewAsset();

    // Compose the confirmation message
    let msg: string;
    if (this.isCartera()) {
      const name = newAsset.row.name;
      const n = newAsset.row.children?.length ?? 0;
      msg = `Cartera «${name}» añadida con ${n} ${n === 1 ? 'posición' : 'posiciones'}`;
    } else {
      msg = `Activo añadido a ${this.addSectionForTipo()}`;
    }

    this.addedAssets.update((rows) => [newAsset, ...rows]);
    this.latestAddedAssetId.set(newAsset.row.id ?? null);
    if (newAsset.row.children && newAsset.row.id) {
      this.expandedRows.update((rows) =>
        new Set(rows).add(`${newAsset.sectionKey}::${newAsset.row.name}`),
      );
    }

    // Ensure the target tipo is included in the active filter so the user
    // can actually see where the activo landed. With the multi-select Tipo
    // filter (2026-06-10) the legacy single-tab focus no longer applies —
    // we just add the section's key to the visible set if it's not already
    // there.
    const sel = this.selectedTipos();
    if (!sel.has(newAsset.sectionKey)) {
      const next = new Set(sel);
      next.add(newAsset.sectionKey);
      this.selectedTipos.set(next);
    }
    setTimeout(() => this.scrollLatestAddedIntoView(), 0);

    // Close dialog + reset form (keep addTipo so consecutive adds of the same type are fast)
    this.addDialogOpen.set(false);
    this.addImporte.set('');
    this.addDescripcion.set('');
    this.addIsin.set('');
    this.addHoldings.set([{ id: 1, name: '', tipo: 'etf', importe: '' }]);

    // Fire the toast (5s auto-dismiss)
    this.savedToastMessage.set(msg);
    this.savedToastVisible.set(true);
    clearTimeout(this.savedToastTimer);
    this.savedToastTimer = setTimeout(() => this.savedToastVisible.set(false), 5000);
    clearTimeout(this.latestAddedTimer);
    this.latestAddedTimer = setTimeout(() => this.latestAddedAssetId.set(null), 9000);
  }

  private buildNewAsset(): AddedAsset {
    const id = `new-${Date.now()}`;
    const sectionKey = this.sectionKeyForTipo();
    const name = this.addResumenRowName();
    const entidad = this.addEntidadLabel() || '—';
    const value = this.addImporteNum();
    const valueLabel = this.formatEuro(value);
    const row: AssetRow = {
      id,
      name,
      entidad,
      valorNum: value,
      cells: this.cellsForNewAsset(sectionKey, valueLabel, entidad),
      subtitle: this.subtitleForNewAsset(),
    };

    if (this.isCartera()) {
      row.nameTags = ['Cartera'];
      row.children = this.addHoldings()
        .filter((h) => h.name.trim() || this.parseImporte(h.importe))
        .map((h, index) => {
          const childValue = this.parseImporte(h.importe) ?? 0;
          const tipo = this.holdingTipoLabel(h.tipo);
          return {
            id: `${id}-holding-${h.id}`,
            name: h.name.trim() || `Posición ${index + 1}`,
            nameTags: [tipo],
            entidad,
            valorNum: childValue,
            cells: { tipo, entidad, valor: this.formatEuro(childValue) },
          };
        });
    }

    return { sectionKey, row };
  }

  private cellsForNewAsset(
    sectionKey: string,
    valueLabel: string,
    entidad: string,
  ): Record<string, string> {
    switch (sectionKey) {
      case 'liquidez':
        return { tipo: 'Cuenta', entidad, valor: valueLabel };
      case 'inversiones':
        return {
          tipo: this.isCartera() ? 'Cartera' : this.addSubtipoLabel(),
          entidad,
          valor: valueLabel,
        };
      case 'inmobiliario':
        return { uso: 'Pendiente de clasificar', valor: valueLabel };
      case 'planes-pensiones':
        return { entidad, derechosAntiguos: '—', derechos: valueLabel };
      default:
        return { valor: valueLabel };
    }
  }

  private subtitleForNewAsset(): string | null {
    if (this.isCartera() && this.addIsin().trim()) return this.addIsin().trim();
    if (this.addTipo() === 'inmobiliario') return this.addEntidadLabel();
    return null;
  }

  setAddTipo(v: string | number | null): void {
    this.addTipo.set(v !== null ? String(v) : '');
  }
  setAddImporte(v: string | number | null): void {
    this.addImporte.set(v !== null ? String(v) : '');
  }
  setAddEntidad(v: string | number | null): void {
    this.addEntidad.set(v !== null ? String(v) : '');
  }
  setAddDescripcion(v: string | number | null): void {
    this.addDescripcion.set(v !== null ? String(v) : '');
  }

  addImporteNum(): number {
    // Cartera mode: auto-sum from holdings. Otherwise use the typed Importe.
    if (this.isCartera()) return this.addHoldingsTotal();
    const n = parseFloat(this.addImporte());
    if (isNaN(n)) return 0;
    return Math.max(0, n); // dialog is an add-flow; clamp negatives to 0 for the preview
  }

  formatEuro(n: number): string {
    return Math.round(n).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
  }

  formatPercent(n: number): string {
    return `${n.toFixed(1).replace('.', ',')} %`;
  }

  /** Section display name for a given addTipo — used in the row-preview caption. */
  addSectionForTipo(): string {
    switch (this.addTipo()) {
      case 'liquidez':
        return 'Liquidez';
      case 'inversion':
        return 'Inversiones';
      case 'inmobiliario':
        return 'Inmobiliario';
      case 'pension':
        return 'Planes de pensiones y EPSV';
      case 'participacion':
        return 'Participaciones empresariales';
      default:
        return 'Otros activos';
    }
  }

  /** Name shown in the row-preview card — description if typed, else a placeholder by tipo. */
  addResumenRowName(): string {
    const desc = this.addDescripcion().trim();
    if (desc) return desc;
    switch (this.addTipo()) {
      case 'liquidez':
        return 'Nueva cuenta';
      case 'inversion':
        return 'Nueva inversión';
      case 'inmobiliario':
        return 'Nuevo inmueble';
      case 'pension':
        return 'Nuevo plan de pensiones';
      case 'participacion':
        return 'Nueva participación';
      default:
        return 'Nuevo activo';
    }
  }

  /** Label of the selected tipo — used in the preview row's Tipo cell. */
  addTipoLabel(): string {
    return this.addTipoOptions.find((o) => o.value === this.addTipo())?.label ?? '';
  }

  addSubtipoLabel(): string {
    return this.addSubtipoOptions.find((o) => o.value === this.addSubtipo())?.label ?? 'Inversión';
  }

  /** Label of the selected entidad — used in the preview row's Entidad cell. */
  addEntidadLabel(): string {
    return this.addEntidadOptions.find((o) => o.value === this.addEntidad())?.label ?? '';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (this.isTypingTarget(e)) return;
    if (
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      e.key.toLowerCase() === 'a' &&
      !this.addDialogOpen()
    ) {
      e.preventDefault();
      this.addDialogOpen.set(true);
      return;
    }
    if (e.key === 'Escape' && this.addDialogOpen()) {
      e.preventDefault();
      this.addDialogOpen.set(false);
    }
  }

  private isTypingTarget(e: Event): boolean {
    // composedPath pierces Shadow DOM (e.g. design-review widget),
    // so we catch typing in widgets that mount under document.body.
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    for (const node of path) {
      if (!(node instanceof Element)) continue;
      const tag = node.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if ((node as HTMLElement).isContentEditable) return true;
    }
    return false;
  }

  /** Cmd/Ctrl + A — bound via `[siteKeyShortcut]="'a'"` on the primary CTA.
   *  Display chip uses the ⌘ glyph (kbd primitive maps it to "Comando" via
   *  its Spanish key glossary for SR users). */
  readonly addShortcut: string[] = ['⌘', 'A'];

  // ---- Section data model ----
  // Each section defines its own columns so tables can have different schemas
  // (Deudas has Plazo + Tipo interés + Capital pendiente; Seguros has
  // Año vencimiento + Prima + Capital fallecimiento + Capital invalidez, etc).
  readonly sections: AssetSection[] = [
    {
      key: 'liquidez',
      title: 'Liquidez',
      total: '65.200 €',
      description: '65.200 € disponibles en liquidez.',
      columns: [
        { key: 'tipo', label: 'Tipo', width: '140px' },
        { key: 'entidad', label: 'Entidad', width: '160px' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
      ],
      rows: [
        {
          name: 'Cuenta corriente 123',
          entidad: 'Santander',
          valorNum: 45200,
          cells: { tipo: 'Cuenta corriente', entidad: 'Santander', valor: '45.200 €' },
        },
        {
          name: 'Depósito ING',
          entidad: 'ING',
          valorNum: 20000,
          cells: { tipo: 'Depósito', entidad: 'ING', valor: '20.000 €' },
        },
      ],
    },
    {
      key: 'inversiones',
      title: 'Inversiones',
      total: '205.500 €',
      description: '205.500 € invertidos en carteras, fondos y acciones.',
      columns: [
        { key: 'tipo', label: 'Tipo', width: '140px' },
        { key: 'entidad', label: 'Entidad', width: '160px' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
      ],
      rows: [
        {
          name: 'Cartera 2023',
          subtitle: 'ES0124XYZ1234',
          entidad: 'Renta 4',
          valorNum: 62300,
          cells: { tipo: 'Cartera', entidad: 'Renta 4', valor: '62.300 €' },
          children: [
            {
              name: 'iShares MSCI World',
              nameTags: ['ETF', 'RV Internacional'],
              entidad: 'Renta 4',
              valorNum: 42000,
              cells: { tipo: 'ETF', entidad: 'Renta 4', valor: '42.000 €' },
            },
            {
              name: 'Global Bond Fund',
              nameTags: ['Fondo', 'RF Global'],
              entidad: 'Renta 4',
              valorNum: 20300,
              cells: { tipo: 'Fondo', entidad: 'Renta 4', valor: '20.300 €' },
            },
          ],
        },
        {
          name: 'Cartera 2024',
          subtitle: 'ES0124XYZ1235',
          entidad: 'Renta 4',
          valorNum: 58900,
          cells: { tipo: 'Cartera', entidad: 'Renta 4', valor: '58.900 €' },
          children: [
            {
              name: 'Vanguard S&P 500',
              nameTags: ['ETF', 'RV Americana'],
              entidad: 'Renta 4',
              valorNum: 30000,
              cells: { tipo: 'ETF', entidad: 'Renta 4', valor: '30.000 €' },
            },
            {
              name: 'EU Small Cap',
              nameTags: ['Fondo', 'RV Europa'],
              entidad: 'Renta 4',
              valorNum: 28900,
              cells: { tipo: 'Fondo', entidad: 'Renta 4', valor: '28.900 €' },
            },
          ],
        },
        {
          name: 'Amazon Inc',
          subtitle: 'US0231001111',
          entidad: 'Degiro',
          valorNum: 12400,
          cells: { tipo: 'Acción', entidad: 'Degiro', valor: '12.400 €' },
        },
        {
          name: 'Bankinter capital plus, FI',
          subtitle: 'ES0114XX0001',
          entidad: 'Bankinter',
          valorNum: 30100,
          cells: { tipo: 'Fondo', entidad: 'Bankinter', valor: '30.100 €' },
        },
        {
          name: 'Ix global equity',
          subtitle: 'IE0056XXYY00',
          entidad: 'Indexa Capital',
          valorNum: 41800,
          cells: { tipo: 'Fondo', entidad: 'Indexa Capital', valor: '41.800 €' },
        },
      ],
    },
    {
      key: 'inmobiliario',
      title: 'Inmobiliario',
      total: '730.000 €',
      description: '730.000 € en patrimonio inmobiliario.',
      columns: [
        { key: 'uso', label: 'Uso', width: '1fr' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '180px' },
      ],
      rows: [
        {
          name: 'Vivienda habitual Madrid',
          entidad: '—',
          valorNum: 450000,
          cells: { uso: 'Residencia principal', valor: '450.000 €' },
        },
        {
          name: 'Apartamento Barcelona',
          entidad: '—',
          valorNum: 280000,
          cells: { uso: 'Alquiler vacacional', valor: '280.000 €' },
        },
      ],
    },
    {
      key: 'private-equity',
      title: 'Private equity',
      total: '263.500 €',
      description: '263.500 € en inversiones privadas.',
      columns: [
        { key: 'entidad', label: 'Entidad', width: '160px' },
        { key: 'compromiso', label: 'Compromiso', align: 'end', width: '160px' },
        { key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '140px' },
      ],
      rows: [
        {
          name: 'Fondo Arcano Partners I',
          subtitle: 'Capital riesgo · 2021',
          entidad: 'Arcano',
          valorNum: 185000,
          cells: { entidad: 'Arcano', compromiso: '200.000 €', valor: '185.000 €' },
        },
        {
          name: 'Nauta Tech Invest V',
          subtitle: 'Venture capital · 2023',
          entidad: 'Nauta Capital',
          valorNum: 78500,
          cells: { entidad: 'Nauta Capital', compromiso: '100.000 €', valor: '78.500 €' },
        },
      ],
    },
    {
      key: 'planes-pensiones',
      title: 'Planes de pensiones y EPSV',
      total: '70.600 €',
      description: '70.600 € en derechos consolidados.',
      columns: [
        { key: 'entidad', label: 'Entidad', width: '140px' },
        {
          key: 'derechosAntiguos',
          label: 'Derechos consolidados anteriores a 2007',
          align: 'end',
          width: '1fr',
        },
        {
          key: 'derechos',
          label: 'Derechos consolidados',
          align: 'end',
          emphasis: true,
          width: '200px',
        },
      ],
      rows: [
        {
          name: 'R4 PP',
          nameTags: ['AI.co', 'RV Internacional'],
          subtitle: 'DGS#4230',
          entidad: 'Renta 4',
          valorNum: 58200,
          cells: { entidad: 'Renta 4', derechosAntiguos: '12.400 €', derechos: '58.200 €' },
        },
        {
          name: 'EPSV Geroa',
          nameTags: ['Mixto moderado'],
          subtitle: 'DGS#1012',
          entidad: 'Geroa Pentsioak',
          valorNum: 12400,
          cells: { entidad: 'Geroa Pentsioak', derechosAntiguos: '—', derechos: '12.400 €' },
        },
      ],
    },
    {
      key: 'participaciones',
      title: 'Participaciones empresariales',
      total: '205.000 €',
      description: '205.000 € en participaciones empresariales.',
      columns: [{ key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '1fr' }],
      rows: [
        {
          name: 'Startup TechCo SL',
          subtitle: '15% participación',
          entidad: '—',
          valorNum: 120000,
          cells: { valor: '120.000 €' },
        },
        {
          name: 'Inversiones Familia SL',
          subtitle: '33% participación',
          entidad: '—',
          valorNum: 85000,
          cells: { valor: '85.000 €' },
        },
      ],
    },
    {
      key: 'otros',
      title: 'Otros activos',
      total: '42.000 €',
      description: '42.000 € en otros activos.',
      columns: [{ key: 'valor', label: 'Valor', align: 'end', emphasis: true, width: '1fr' }],
      rows: [
        {
          name: 'Colección de arte',
          subtitle: 'Tasación 2024',
          entidad: '—',
          valorNum: 42000,
          cells: { valor: '42.000 €' },
        },
      ],
    },
    {
      key: 'deudas',
      title: 'Deudas',
      total: '275.000 €',
      description: '275.000 € de deuda pendiente.',
      columns: [
        { key: 'entidad', label: 'Entidad', width: '140px' },
        { key: 'plazo', label: 'Plazo pendiente', align: 'end', width: '1fr' },
        { key: 'tipoInteres', label: 'Tipo de interés', align: 'end', width: '1fr' },
        {
          key: 'capitalPendiente',
          label: 'Capital pendiente',
          align: 'end',
          emphasis: true,
          width: '160px',
        },
      ],
      rows: [
        {
          name: 'Hipoteca Vivienda Madrid',
          entidad: 'ING',
          valorNum: 180000,
          cells: {
            entidad: 'ING',
            plazo: '18 años',
            tipoInteres: '2,35 %',
            capitalPendiente: '180.000 €',
          },
        },
        {
          name: 'Hipoteca Apartamento Barcelona',
          entidad: 'BBVA',
          valorNum: 95000,
          cells: {
            entidad: 'BBVA',
            plazo: '12 años',
            tipoInteres: '3,10 %',
            capitalPendiente: '95.000 €',
          },
        },
      ],
    },
    {
      key: 'seguros',
      title: 'Seguros de vida',
      total: '330.000 €',
      description: '330.000 € de capital asegurado.',
      columns: [
        { key: 'vencimiento', label: 'Año de vencimiento', align: 'end', width: '160px' },
        { key: 'prima', label: 'Prima anual', align: 'end', width: '140px' },
        { key: 'fallecimiento', label: 'Capital de fallecimiento', align: 'end', width: '200px' },
        {
          key: 'invalidez',
          label: 'Capital de invalidez',
          align: 'end',
          emphasis: true,
          width: '180px',
        },
      ],
      rows: [
        {
          name: 'Seguro de vida Santander',
          subtitle: 'Banco Santander',
          entidad: 'Santander',
          valorNum: 150000,
          cells: {
            vencimiento: '2045',
            prima: '420 €',
            fallecimiento: '150.000 €',
            invalidez: '120.000 €',
          },
        },
        {
          name: 'Seguro de vida BBVA',
          subtitle: 'BBVA',
          entidad: 'BBVA',
          valorNum: 180000,
          cells: {
            vencimiento: '2040',
            prima: '520 €',
            fallecimiento: '180.000 €',
            invalidez: '150.000 €',
          },
        },
      ],
    },
  ];

  /** Tabs — "Todos" + one chip per section. Clicking filters the section list. */
  readonly activeTab = signal<string>('todos');
  readonly tabs = computed(() => {
    this.addedAssets();
    const base = [
      {
        key: 'todos',
        label: 'Todos',
        count: this.sections.reduce((s, sec) => s + this.sectionRowCount(sec), 0),
      },
    ];
    return base.concat(
      this.sections.map((sec) => ({
        key: sec.key,
        label: sec.title,
        count: this.sectionRowCount(sec),
      })),
    );
  });

  // ---- Animate tabs (Coherence brand transition) ----
  // Sliding underline indicator: we measure each tab button's offsetLeft/Width
  // and drive a single absolute-positioned span with a CSS transition on left/width.
  // Panels use a CSS keyframe that re-plays every time activeTab changes because
  // the @for track string includes activeTab() — forcing fresh DOM nodes. The
  // keyframe direction (slide-in-from-right vs slide-in-from-left) follows the
  // direction of tab movement so the motion reads as "advancing" or "going back".
  readonly tabDirection = signal<'forward' | 'backward'>('forward');

  setActiveTab(key: string): void {
    const list = this.tabs();
    const prevIdx = list.findIndex((t) => t.key === this.activeTab());
    const nextIdx = list.findIndex((t) => t.key === key);
    this.tabDirection.set(nextIdx >= prevIdx ? 'forward' : 'backward');
    this.activeTab.set(key);
  }
  readonly tabRefs = viewChildren<ElementRef<HTMLElement>>('tabBtn');
  readonly tabsScrollEl = viewChild<ElementRef<HTMLElement>>('tabsScroll');
  readonly assetRowRefs = viewChildren<ElementRef<HTMLElement>>('assetRow');
  private readonly resizeTick = signal(0);

  // Tab overflow affordances — show a chevron on each side only when there's more
  // to scroll in that direction. Updated from (scroll) on the container + resize.
  readonly tabsScrollLeft = signal(0);
  readonly tabsScrollWidth = signal(0);
  readonly tabsClientWidth = signal(0);
  readonly canScrollLeft = computed(() => this.tabsScrollLeft() > 1);
  readonly canScrollRight = computed(
    () => this.tabsScrollLeft() + this.tabsClientWidth() < this.tabsScrollWidth() - 1,
  );

  onTabsScroll(e: Event): void {
    const el = e.target as HTMLElement;
    this.tabsScrollLeft.set(el.scrollLeft);
    this.tabsScrollWidth.set(el.scrollWidth);
    this.tabsClientWidth.set(el.clientWidth);
  }
  /** Run once after the view measures, and on every resize, so the right chevron appears at load. */
  measureTabs(): void {
    const el = this.tabsScrollEl()?.nativeElement;
    if (!el) return;
    this.tabsScrollLeft.set(el.scrollLeft);
    this.tabsScrollWidth.set(el.scrollWidth);
    this.tabsClientWidth.set(el.clientWidth);
  }

  scrollTabs(direction: 1 | -1): void {
    const el = this.tabsScrollEl()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: 220 * direction, behavior: 'smooth' });
  }

  private scrollLatestAddedIntoView(): void {
    const id = this.latestAddedAssetId();
    if (!id) return;
    const row = this.assetRowRefs().find((ref) => ref.nativeElement.dataset['assetRowId'] === id);
    row?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }

  readonly indicatorStyle = computed<Record<string, string>>(() => {
    this.resizeTick();
    const refs = this.tabRefs();
    const active = this.activeTab();
    const index = this.tabs().findIndex((t) => t.key === active);
    const el = refs[index]?.nativeElement;
    if (!el) return { left: '0px', width: '0px', opacity: '0' };
    return { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px`, opacity: '1' };
  });

  @HostListener('window:resize')
  onWindowResize(): void {
    this.resizeTick.update((v) => v + 1);
    this.measureTabs();
  }

  /** Sections actually shown on the page — driven by the Tipo multi-select
   * filter (replaces the old tab-based `activeTab` behavior 2026-06-10).
   * Render order follows `tipoOrder()`, filtered by `selectedTipos()`. */
  readonly visibleSections = computed(() => {
    const sel = this.selectedTipos();
    const order = this.tipoOrder();
    const byKey = new Map(this.sections.map((s) => [s.key, s]));
    return order
      .filter((k) => sel.has(k))
      .map((k) => byKey.get(k))
      .filter((s): s is AssetSection => s !== undefined);
  });

  private rowsForSection(section: AssetSection): AssetRow[] {
    const added = this.addedAssets()
      .filter((item) => item.sectionKey === section.key)
      .map((item) => item.row);
    const all = added.concat(section.rows);
    const deleted = this.deletedAssetIds();
    if (deleted.size === 0) return all;
    // Soft-delete: drop any row whose stable key landed in `deletedAssetIds`
    // via the bulk-delete affordance. Same key derivation as
    // `rowSelectionKey` (= `r.id ?? r.name`) so the selection → deletion
    // → table-render pipeline stays consistent.
    return all.filter((r) => {
      const key = r.id ?? r.name ?? null;
      return !key || !deleted.has(key);
    });
  }

  isLatestAdded(row: AssetRow): boolean {
    return !!row.id && row.id === this.latestAddedAssetId();
  }

  rowActionId(section: AssetSection, row: AssetRow): string {
    return `${section.key}::${row.id ?? row.name}`;
  }

  toggleRowActions(section: AssetSection, row: AssetRow): void {
    const id = this.rowActionId(section, row);
    this.rowActionsOpen.set(this.rowActionsOpen() === id ? null : id);
  }

  /** Internal: count of visible rows (including children) for the tab count pill. */
  sectionRowCount(section: AssetSection): number {
    return this.rowsForSection(section).reduce((n, r) => n + 1 + (r.children?.length ?? 0), 0);
  }

  tableHeaderMeta(section: AssetSection, visibleRows: number): string {
    // 2026-06-10 — dropped "Columnas: ..." trailer when this fn started
    // feeding the canonical `<afi-page-header level="section">` subtitle.
    // Keep just the row-count meta; the description (s.description) renders
    // separately above via the page-header title chrome if needed.
    const total = this.sectionRowCount(section);
    const count =
      this.anyFilterActive() && visibleRows !== section.rows.length
        ? `${visibleRows} de ${total}`
        : `${total}`;
    const noun = total === 1 ? 'activo' : 'activos';
    return `${count} ${noun}`;
  }

  tableExplainer(): string {
    const active = this.activeTab();
    const section = this.sections.find((s) => s.key === active);
    if (section) {
      return `${section.title} muestra ${section.description.toLowerCase()} Las columnas cambian para enseñar solo los datos útiles de ese tipo de patrimonio.`;
    }
    return 'Cada sección define sus propias columnas según el tipo de activo: deudas aporta plazo pendiente, tipo de interés y capital pendiente; seguros aporta vencimiento, prima y capitales asegurados; inversiones permite desplegar holdings internos.';
  }

  /** Inversiones has expandable carteras — track which row keys are open. */
  readonly expandedRows = signal<Set<string>>(new Set());
  isRowExpanded(sectionKey: string, rowName: string): boolean {
    return this.expandedRows().has(`${sectionKey}::${rowName}`);
  }
  toggleRow(sectionKey: string, rowName: string): void {
    const s = new Set(this.expandedRows());
    const id = `${sectionKey}::${rowName}`;
    if (s.has(id)) s.delete(id);
    else s.add(id);
    this.expandedRows.set(s);
  }

  /** Grid template string per section — name column (flex) + per-config column widths + 32px actions. */
  gridTemplateFor(section: AssetSection): string {
    const parts = ['minmax(320px, 1fr)'].concat(section.columns.map((c) => c.width));
    parts.push('32px');
    return parts.join(' ');
  }

  // ── <afi-table> migration helpers (2026-05-28) ──────────────────────────
  //
  // Each section is rendered as its own `<afi-table>` (different column
  // schemas per section). The bespoke `<div class="grid">` block was
  // replaced by these calls; the row data, expand state, and actions all
  // come from these helpers. Children are passed via the table's reserved
  // `children` magic key.
  //
  // Migration trade-offs (documented for follow-up):
  //   - Nameless badges (`row.nameTags`) and `subtitle` lose their visual
  //     treatment — only `name` is shown in the first cell. Re-add when
  //     <afi-table> grows a multi-line / tags cell renderer.
  //   - The "Nuevo" badge animation on newly-added rows is replaced by the
  //     primitive's `highlightedRowKey` flash.
  //   - The leading drag-handle / `+` add-row affordance is removed
  //     (leadingActions axis pending Phase 2).

  /** Table-level action set. Per-row overrides not used here (all asset
   *  rows + their children get the same set).
   *
   *  Pattern (Richard 2026-06-10): two actions only — Editar + Borrar —
   *  rendered inline as icon buttons. The 3-dot overflow menu is reserved
   *  for tables with 3+ actions; with two, the buttons themselves are the
   *  full surface (no friction from a menu trigger). Duplicar was dropped
   *  as out-of-scope for v2. */
  readonly assetTableActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', icon: 'edit', ariaLabel: 'Editar activo' },
    {
      key: 'delete',
      label: 'Borrar',
      icon: 'delete',
      ariaLabel: 'Borrar activo',
      variant: 'danger',
    },
  ];

  /** Prepend a "Nombre" column to the section's own column array. */
  tableColumnsFor(section: AssetSection): TableColumn[] {
    return [
      { key: 'name', label: 'Nombre', emphasis: true },
      ...section.columns.map<TableColumn>((c) => ({
        key: c.key,
        label: c.label,
        align: c.align,
        emphasis: c.emphasis,
      })),
    ];
  }

  /**
   * Map AssetRow[] (filtered through the section's row visibility) into
   * the `Record<string, unknown>[]` shape `<afi-table>` expects. Spreads
   * cells onto the row, prepends `name`, recurses for children via the
   * reserved `children` magic key.
   */
  tableRowsFor(section: AssetSection, rows: AssetRow[]): Record<string, unknown>[] {
    return rows.map((row) => this.toTableRow(row));
  }

  private toTableRow(row: AssetRow): Record<string, unknown> {
    const mapped: Record<string, unknown> = {
      id: row.id ?? row.name,
      name: row.name,
      ...row.cells,
    };
    if (row.children && row.children.length > 0) {
      mapped['children'] = row.children.map((c) => this.toTableRow(c));
    }
    return mapped;
  }

  /** Convert global `expandedRows` set → per-section array of row keys. */
  expandedKeysFor(sectionKey: string): unknown[] {
    const prefix = `${sectionKey}::`;
    return Array.from(this.expandedRows())
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.substring(prefix.length));
  }

  /** Bridge `<afi-table>` (expandedKeysChange: unknown[]) → global Set<string>. */
  onSectionExpandedChange(sectionKey: string, expanded: unknown[]): void {
    const next = new Set(this.expandedRows());
    const prefix = `${sectionKey}::`;
    // Remove all existing entries for this section
    for (const key of Array.from(next)) {
      if (key.startsWith(prefix)) next.delete(key);
    }
    // Add the new set
    for (const k of expanded) {
      next.add(`${prefix}${String(k)}`);
    }
    this.expandedRows.set(next);
  }

  /**
   * Row-click handler from `<afi-table>` — no-op. Selection is driven
   * by the per-row checkbox (visible in the hover-extend area thanks to
   * `[selectable]="true"` + the section page-header's CSS overrides),
   * NOT by clicking the row body. Leaves the row body free for future
   * navigation (open detail) without conflicting with selection toggle.
   */
  onSectionRowClicked(_event: { row: Record<string, unknown>; event: MouseEvent }): void {
    /* intentional no-op */
  }

  /**
   * Selection-change handler from `<afi-table (selectedChange)="..."/>`.
   * The primitive emits the full new selection array (including rows
   * across other sections that were already selected) whenever a checkbox
   * is toggled, so we just rebuild `selectedAssetIds` from the array.
   */
  onAssetSelectionChange(rows: Record<string, unknown>[]): void {
    const ids = new Set<string>();
    for (const r of rows) {
      const key = this.rowSelectionKey(r);
      if (key) ids.add(key);
    }
    this.selectedAssetIds.set(ids);
  }

  /** Stable selection key per row. Matches `toTableRow`'s id derivation
   *  (`row.id ?? row.name`) so the same key resolves whether we're handed
   *  the original AssetRow or the transformed Record<string, unknown>
   *  that <afi-table> emits from `(rowClicked)`. */
  private rowSelectionKey(row: Record<string, unknown>): string | null {
    const id = row['id'];
    if (typeof id === 'string' && id) return id;
    const name = row['name'];
    if (typeof name === 'string' && name) return name;
    return null;
  }

  // ─── Bulk selection / delete ─────────────────────────────────────────
  // Selected rows + soft-deleted rows tracked as id sets. The table reads
  // selection via `[selected]` (we feed it the live row OBJECTS so
  // afi-table's --selected class lands). Deletion moves selected ids to
  // `deletedAssetIds`, which `rowsForSection` filters out — the table
  // never sees deleted rows again.
  readonly selectedAssetIds = signal<Set<string>>(new Set<string>());
  readonly deletedAssetIds = signal<Set<string>>(new Set<string>());

  /** Lightweight stubs for `<afi-table [selected]="..."/>`. The primitive
   *  only checks `selectedRow[trackByKey] === renderedRow[trackByKey]`
   *  (trackByKey = 'id'), so we hand it an object literal whose `id`
   *  exactly matches the rendered row's `id` (= `r.id ?? r.name` per
   *  `toTableRow`). Cheap to recompute on every selection change. */
  readonly selectedAssetRows = computed<Record<string, unknown>[]>(() => {
    const ids = this.selectedAssetIds();
    if (ids.size === 0) return [];
    return [...ids].map((id) => ({ id }));
  });

  readonly bulkSelectedCount = computed(() => this.selectedAssetIds().size);

  clearAssetSelection(): void {
    this.selectedAssetIds.set(new Set());
  }

  // ─── Confirmation dialogs ────────────────────────────────────────────
  // Two flavors:
  //   • Bulk delete — fires after the "Borrar" button in the filter
  //     actions; copy reads "Borrar X activos seleccionados".
  //   • Single-row delete — fires from the row's trash icon; copy reads
  //     "Borrar [activo name]" so the user knows exactly what disappears.
  // Both block actual mutation until the user confirms; cancel restores
  // the prior state without touching `deletedAssetIds`.
  readonly confirmBulkDeleteOpen = signal<boolean>(false);
  readonly confirmRowDelete = signal<{ key: string; name: string } | null>(null);

  /** Called by the "Borrar" button in the filter-actions slot. */
  openBulkDeleteConfirm(): void {
    if (this.bulkSelectedCount() === 0) return;
    this.confirmBulkDeleteOpen.set(true);
  }

  /** User confirmed the bulk delete — soft-delete all selected ids, then
   *  close the dialog and clear the selection. Snapshots the affected ids
   *  into `lastDeletedIds` so the Cmd+Z / toast Deshacer can restore. */
  confirmBulkDelete(): void {
    const sel = this.selectedAssetIds();
    if (sel.size === 0) {
      this.confirmBulkDeleteOpen.set(false);
      return;
    }
    const next = new Set(this.deletedAssetIds());
    for (const k of sel) next.add(k);
    this.deletedAssetIds.set(next);
    const count = sel.size;
    this.lastDeletedIds.set([...sel]);
    this.clearAssetSelection();
    this.confirmBulkDeleteOpen.set(false);
    this.showDeleteToast(`${count} activo${count === 1 ? '' : 's'} borrado${count === 1 ? '' : 's'}`);
  }

  /** Called by the per-row trash icon (the canonical Borrar action key). */
  openRowDeleteConfirm(row: Record<string, unknown>): void {
    const key = this.rowSelectionKey(row);
    if (!key) return;
    const name = typeof row['name'] === 'string' ? row['name'] : key;
    this.confirmRowDelete.set({ key, name });
  }

  /** User confirmed the single-row delete — soft-delete just that row.
   *  Snapshots the single id into `lastDeletedIds` for the undo path. */
  confirmRowDeleteApply(): void {
    const target = this.confirmRowDelete();
    if (!target) return;
    const next = new Set(this.deletedAssetIds());
    next.add(target.key);
    this.deletedAssetIds.set(next);
    // Also drop it from the selection if it happened to be selected.
    const sel = new Set(this.selectedAssetIds());
    sel.delete(target.key);
    this.selectedAssetIds.set(sel);
    this.lastDeletedIds.set([target.key]);
    this.confirmRowDelete.set(null);
    this.showDeleteToast(`Activo "${target.name}" borrado`);
  }

  // ─── Delete toast + undo ─────────────────────────────────────────────
  // After every confirmed delete (bulk or single), a dark pill toast
  // surfaces at the bottom with an undo button + a `⌘ Z` kbd hint. The
  // shortcut is bound globally via @HostListener and routes to the same
  // `undoLastDelete()` handler the toast button calls.
  readonly lastDeletedIds = signal<string[]>([]);
  readonly deleteToastVisible = signal<boolean>(false);
  readonly deleteToastMessage = signal<string>('');
  readonly undoShortcut: string[] = ['⌘', 'Z'];
  private deleteToastTimer: ReturnType<typeof setTimeout> | null = null;

  private showDeleteToast(message: string): void {
    this.deleteToastMessage.set(message);
    this.deleteToastVisible.set(true);
    if (this.deleteToastTimer) clearTimeout(this.deleteToastTimer);
    // 8 seconds is the canonical undo window — long enough to react,
    // short enough not to be in the way.
    this.deleteToastTimer = setTimeout(() => {
      this.deleteToastVisible.set(false);
      this.lastDeletedIds.set([]);
    }, 8000);
  }

  /** Restore the most recent batch of soft-deleted assets. Triggered by
   *  the toast's Deshacer button OR Cmd/Ctrl + Z. No-op once
   *  `lastDeletedIds` is cleared (auto-dismiss timer fired). */
  undoLastDelete(): void {
    const ids = this.lastDeletedIds();
    if (ids.length === 0) return;
    const next = new Set(this.deletedAssetIds());
    for (const k of ids) next.delete(k);
    this.deletedAssetIds.set(next);
    this.lastDeletedIds.set([]);
    this.deleteToastVisible.set(false);
    if (this.deleteToastTimer) {
      clearTimeout(this.deleteToastTimer);
      this.deleteToastTimer = null;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onUndoKeydown(event: KeyboardEvent): void {
    // Only fire when there's actually something to undo and the focus
    // isn't inside a form input (avoid stomping native undo).
    if (!this.deleteToastVisible() || this.lastDeletedIds().length === 0) return;
    const isUndo = (event.key === 'z' || event.key === 'Z') && (event.metaKey || event.ctrlKey) && !event.shiftKey;
    if (!isUndo) return;
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    event.preventDefault();
    this.undoLastDelete();
  }

  /** Row-action dispatcher. `delete` opens the single-row confirmation
   *  modal (asks "Borrar [name]?"); `edit` is still a placeholder pending
   *  store wiring. */
  onSectionAction(event: { action: TableRowAction; row: Record<string, unknown> }): void {
    if (event.action.key === 'delete') {
      this.openRowDeleteConfirm(event.row);
      return;
    }
    if (event.action.key === 'edit') {
      const id = this.rowSelectionKey(event.row);
      if (!id) return;
      let asset: PatrimonioAsset | undefined = this.store.patrimonio().find(a => a.id === id);
      if (!asset) asset = this.synthAssetFromRow(event.row, id);
      if (asset) this.editingAsset.set(asset);
    }
  }

  /** Build a minimal PatrimonioAsset from a table row when the row isn't in
   *  the store (i.e. it's a hardcoded seed row in `sections[].rows`). Lets
   *  the edit dialog pre-populate from the visible row data; on save we
   *  soft-delete the original and surface the edited copy via addedAssets. */
  private synthAssetFromRow(
    row: Record<string, unknown>,
    id: string,
  ): PatrimonioAsset | undefined {
    for (const sec of this.sections) {
      const match = sec.rows.find(
        (r) => (r.id ?? r.name) === id || r.name === row['name'],
      );
      if (!match) continue;
      const tipoTop = this.sectionKeyToTipoTop(sec.key);
      return {
        id,
        nombre: String(row['name'] ?? match.name),
        tipo: this.tipoTopToTipo(tipoTop),
        tipoTop,
        valor: typeof row['valorNum'] === 'number' ? (row['valorNum'] as number) : match.valorNum,
        entidad: typeof row['entidad'] === 'string' ? (row['entidad'] as string) : match.entidad,
      };
    }
    return undefined;
  }

  private sectionKeyToTipoTop(key: string): TipoPatrimonioTop {
    switch (key) {
      case 'liquidez':
        return 'liquidez';
      case 'inversiones':
        return 'inversion';
      case 'inmobiliario':
        return 'inmobiliario';
      case 'private-equity':
        return 'private-equity';
      case 'planes-pensiones':
        return 'plan-pensiones';
      case 'participaciones':
        return 'participaciones';
      case 'otros':
        return 'otros-activos';
      case 'deudas':
        return 'deudas';
      case 'seguros':
        return 'seguro-vida';
      default:
        return 'otros-activos';
    }
  }

  // ---- Filter state ----
  readonly searchQuery = signal<string>('');
  readonly searchFocused = signal(false);
  readonly selectedEntidades = signal<Set<string>>(new Set<string>());
  readonly filterMin = signal<number | null>(null);
  readonly filterMax = signal<number | null>(null);

  readonly entidadMenuOpen = signal(false);
  readonly minMenuOpen = signal(false);
  readonly maxMenuOpen = signal(false);

  // ---- Tipo multi-select filter (replaces the old activeTab tabs) ----
  // Two signals model both inclusion AND order so the user can pick which
  // tipos to show AND drag-reorder them in the dropdown. Section render order
  // on the page follows `tipoOrder()`, filtered by `selectedTipos()`.
  //
  // Defaults: every tipo selected, in the page's canonical order. The chip
  // reads "Tipo" while in the default state; once the user deselects any
  // or reorders, the chip surfaces the diff (count + reorder hint).
  readonly selectedTipos = signal<Set<string>>(
    new Set<string>(this.sections.map((s) => s.key)),
  );
  readonly tipoOrder = signal<string[]>(this.sections.map((s) => s.key));
  readonly tipoMenuOpen = signal(false);

  // Drag-and-drop state for reordering rows inside the Tipo dropdown.
  // `dragFromIndex` is the source row being dragged; `dragOverIndex` is the
  // hovered row index that gets a top-border indicator. Both reset on drop.
  readonly tipoDragFromIndex = signal<number | null>(null);
  readonly tipoDragOverIndex = signal<number | null>(null);

  /** Autocomplete suggestions — flattened matches across every section's rows
   * (including expandable children), filtered by the current search query. */
  readonly searchSuggestions = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return [] as { name: string; section: string; entidad: string; valor: string }[];
    const out: { name: string; section: string; entidad: string; valor: string }[] = [];
    const push = (r: AssetRow, sectionTitle: string) => {
      const cellValues = Object.values(r.cells).join(' ');
      const hay =
        `${r.name} ${r.subtitle ?? ''} ${(r.nameTags ?? []).join(' ')} ${r.entidad} ${cellValues}`.toLowerCase();
      if (hay.includes(q)) {
        // Prefer a cell ending in "€" as the trailing label; fall back to the first cell.
        const values = Object.values(r.cells);
        const euro =
          values.find((v) => typeof v === 'string' && v.trim().endsWith('€')) ?? values[0] ?? '';
        out.push({ name: r.name, section: sectionTitle, entidad: r.entidad, valor: euro });
      }
    };
    for (const s of this.sections) {
      for (const r of this.rowsForSection(s)) {
        push(r, s.title);
        if (out.length >= 8) return out;
        for (const c of r.children ?? []) {
          push(c, s.title);
          if (out.length >= 8) return out;
        }
      }
    }
    return out;
  });

  onSearchFocus(): void {
    this.searchFocused.set(true);
  }
  onSearchBlur(): void {
    // Delay so a click on a suggestion fires before we hide the dropdown.
    setTimeout(() => this.searchFocused.set(false), 150);
  }
  pickSuggestion(name: string): void {
    this.searchQuery.set(name);
    this.searchFocused.set(false);
  }

  /** Unique entidades across every section's rows (plus children) — only
   * entidades the user actually has patrimonio in. Excludes "—" placeholder. */
  readonly availableEntidades = computed(() => {
    const s = new Set<string>();
    for (const sec of this.sections) {
      for (const r of this.rowsForSection(sec)) {
        if (r.entidad && r.entidad !== '—') s.add(r.entidad);
        for (const c of r.children ?? []) if (c.entidad && c.entidad !== '—') s.add(c.entidad);
      }
    }
    return [...s].sort((a, b) => a.localeCompare(b, 'es'));
  });

  /** Human-readable label shown on each filter chip — reflects applied state. */
  readonly entidadChipLabel = computed(() => {
    const n = this.selectedEntidades().size;
    const total = this.availableEntidades().length;
    if (n === 0) return 'Todas';
    if (n === total) return 'Todas';
    if (n === 1) return [...this.selectedEntidades()][0];
    return `${n} seleccionadas`;
  });
  readonly minChipLabel = computed(() => {
    const v = this.filterMin();
    return v === null ? null : this.formatEuroCompact(v);
  });
  readonly maxChipLabel = computed(() => {
    const v = this.filterMax();
    return v === null ? null : this.formatEuroCompact(v);
  });

  /** Short-form euro for chip labels — keeps the action bar from stretching.
   *  9.000 → "9K €", 150.000 → "150K €", 1.500.000 → "1,5M €", 100.000.000 → "100M €". */
  formatEuroCompact(n: number): string {
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1_000_000) {
      const m = abs / 1_000_000;
      const label =
        m >= 10 ? Math.round(m).toString() : m.toFixed(1).replace('.', ',').replace(',0', '');
      return `${sign}${label}M €`;
    }
    if (abs >= 1_000) {
      return `${sign}${Math.round(abs / 1_000)}K €`;
    }
    return `${sign}${Math.round(abs)} €`;
  }

  isEntidadSelected(e: string): boolean {
    return this.selectedEntidades().has(e);
  }
  toggleEntidad(e: string): void {
    const s = new Set(this.selectedEntidades());
    if (s.has(e)) s.delete(e);
    else s.add(e);
    this.selectedEntidades.set(s);
  }
  clearEntidades(): void {
    this.selectedEntidades.set(new Set());
  }
  isAllEntidadesSelected(): boolean {
    const all = this.availableEntidades();
    const sel = this.selectedEntidades();
    return all.length > 0 && sel.size === all.length;
  }
  toggleAllEntidades(): void {
    if (this.isAllEntidadesSelected()) {
      this.selectedEntidades.set(new Set());
    } else {
      this.selectedEntidades.set(new Set(this.availableEntidades()));
    }
  }

  // ─── Tipo filter — multi-select with drag-to-reorder ──────────────────
  // Mirror of the Entidad chip API for predictability, plus the reorder
  // bits (`moveTipo`, drag handlers). Replaces the legacy `activeTab` /
  // `setActiveTab` tabs UI which only allowed single-tipo + fixed order.

  /** Section-key → human label, looked up via the canonical `sections`
   * array. Used by the chip label + dropdown rows. */
  tipoLabel(key: string): string {
    return this.sections.find((s) => s.key === key)?.title ?? key;
  }

  /** Count for a given tipo key (raw row total, not filtered). Mirrors the
   * old tab badge count. */
  tipoCount(key: string): number {
    const sec = this.sections.find((s) => s.key === key);
    return sec ? this.sectionRowCount(sec) : 0;
  }

  isTipoSelected(key: string): boolean {
    return this.selectedTipos().has(key);
  }
  toggleTipo(key: string): void {
    const s = new Set(this.selectedTipos());
    if (s.has(key)) s.delete(key);
    else s.add(key);
    this.selectedTipos.set(s);
  }
  isAllTiposSelected(): boolean {
    return this.selectedTipos().size === this.sections.length;
  }
  toggleAllTipos(): void {
    if (this.isAllTiposSelected()) {
      this.selectedTipos.set(new Set());
    } else {
      this.selectedTipos.set(new Set(this.sections.map((s) => s.key)));
    }
  }
  /** Reset to default: every tipo selected, canonical order. */
  clearTipos(): void {
    this.selectedTipos.set(new Set(this.sections.map((s) => s.key)));
    this.tipoOrder.set(this.sections.map((s) => s.key));
  }

  /** True when the user has reordered tipos away from the canonical order. */
  readonly tipoOrderChanged = computed(() => {
    const canon = this.sections.map((s) => s.key);
    const cur = this.tipoOrder();
    if (canon.length !== cur.length) return true;
    return canon.some((k, i) => cur[i] !== k);
  });

  /** Chip label — surfaces the filter state at a glance.
   *   • All selected, default order  →  null (chip shows just "Tipo")
   *   • Reordered, all selected     →  "Reordenado"
   *   • Subset selected             →  "X seleccionadas" (or single label)
   */
  readonly tipoChipLabel = computed<string | null>(() => {
    const n = this.selectedTipos().size;
    const total = this.sections.length;
    if (n === total) return this.tipoOrderChanged() ? 'Reordenado' : null;
    if (n === 0) return 'Ninguno';
    if (n === 1) {
      const only = [...this.selectedTipos()][0];
      return only ? this.tipoLabel(only) : null;
    }
    return `${n} seleccionados`;
  });

  /** True when the Tipo chip is in a non-default state (subset selected
   * OR reordered). Drives the chip's active styling. */
  readonly tipoChipActive = computed(
    () => !this.isAllTiposSelected() || this.tipoOrderChanged(),
  );

  // ── Reorder ─────────────────────────────────────────────────────────
  /** Move a tipo from one position in `tipoOrder` to another. Splices the
   * array in-place semantically; emits a fresh array so signals re-fire. */
  moveTipo(fromIdx: number, toIdx: number): void {
    if (fromIdx === toIdx) return;
    const next = [...this.tipoOrder()];
    if (fromIdx < 0 || fromIdx >= next.length) return;
    if (toIdx < 0 || toIdx >= next.length) return;
    const [item] = next.splice(fromIdx, 1);
    if (item === undefined) return;
    next.splice(toIdx, 0, item);
    this.tipoOrder.set(next);
  }

  onTipoDragStart(idx: number, ev: DragEvent): void {
    this.tipoDragFromIndex.set(idx);
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
      // Required for Firefox to start the drag at all.
      ev.dataTransfer.setData('text/plain', String(idx));
    }
  }
  onTipoDragOver(idx: number, ev: DragEvent): void {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
    if (this.tipoDragOverIndex() !== idx) this.tipoDragOverIndex.set(idx);
  }
  onTipoDragLeave(): void {
    this.tipoDragOverIndex.set(null);
  }
  onTipoDrop(idx: number, ev: DragEvent): void {
    ev.preventDefault();
    const from = this.tipoDragFromIndex();
    if (from !== null) this.moveTipo(from, idx);
    this.tipoDragFromIndex.set(null);
    this.tipoDragOverIndex.set(null);
  }
  onTipoDragEnd(): void {
    this.tipoDragFromIndex.set(null);
    this.tipoDragOverIndex.set(null);
  }
  clearMin(): void {
    this.filterMin.set(null);
    this.minMenuOpen.set(false);
  }
  clearMax(): void {
    this.filterMax.set(null);
    this.maxMenuOpen.set(false);
  }

  /** Ceiling for the Min/Max stepper — the largest single-asset value in
   *  the patrimonio (deepest child included). Defaults to a sensible 100K
   *  when there's no data so the stepper still has a usable range. */
  readonly maxAvailableValue = computed<number>(() => {
    let max = 0;
    for (const s of this.sections) {
      for (const r of this.rowsForSection(s)) {
        if (r.valorNum > max) max = r.valorNum;
        for (const c of r.children ?? []) {
          if (c.valorNum > max) max = c.valorNum;
        }
      }
    }
    return max > 0 ? max : 100_000;
  });

  /** Step size for the Min/Max stepper — 1/20 of the ceiling, rounded to
   *  a 1·2·5·10 base so click counts stay reasonable across magnitudes
   *  (450K → 25K steps; 1M → 50K; 100K → 5K). */
  readonly filterStep = computed<number>(() => {
    const raw = Math.max(1, this.maxAvailableValue() / 20);
    return niceStep(raw);
  });

  stepMin(delta: 1 | -1): void {
    const max = this.maxAvailableValue();
    const step = this.filterStep();
    const current = this.filterMin() ?? 0;
    const next = Math.max(0, Math.min(max, current + delta * step));
    this.filterMin.set(next);
  }

  stepMax(delta: 1 | -1): void {
    const max = this.maxAvailableValue();
    const step = this.filterStep();
    const current = this.filterMax() ?? max;
    const next = Math.max(0, Math.min(max, current + delta * step));
    this.filterMax.set(next);
  }

  /** Placeholder for the Max input when no value is set — shows the
   *  ceiling so the user knows the cap before they touch the stepper. */
  readonly filterMaxPlaceholder = computed<string>(
    () => `Máx. ${this.formatEuroCompact(this.maxAvailableValue())}`,
  );

  onSearchInput(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }
  onMinInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value.trim();
    if (v === '') {
      this.filterMin.set(null);
      return;
    }
    const n = Number(v);
    if (Number.isNaN(n)) return;
    this.filterMin.set(Math.max(0, Math.min(this.maxAvailableValue(), n)));
  }
  onMaxInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value.trim();
    if (v === '') {
      this.filterMax.set(null);
      return;
    }
    const n = Number(v);
    if (Number.isNaN(n)) return;
    this.filterMax.set(Math.max(0, Math.min(this.maxAvailableValue(), n)));
  }

  /** Returns the rows of a section that pass the search + entidad + min/max filters.
   * Parent row keeps if it matches, OR if any of its children match (so we can
   * still surface Carteras whose inner holdings match the filter). */
  filteredRows(section: AssetSection): AssetRow[] {
    const q = this.searchQuery().trim().toLowerCase();
    const ents = this.selectedEntidades();
    const min = this.filterMin();
    const max = this.filterMax();
    const latestId = this.latestAddedAssetId();
    const matches = (r: AssetRow) => {
      if (r.id && r.id === latestId) return true;
      if (q) {
        const hay =
          `${r.name} ${r.subtitle ?? ''} ${(r.nameTags ?? []).join(' ')} ${r.entidad} ${Object.values(r.cells).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (ents.size > 0 && !ents.has(r.entidad)) return false;
      if (min !== null && r.valorNum < min) return false;
      if (max !== null && r.valorNum > max) return false;
      return true;
    };
    return this.rowsForSection(section).filter(
      (r) => matches(r) || (r.children ?? []).some(matches),
    );
  }

  /** Aggregate of rows visible across the currently-visible sections
   * (respects both the tab filter and the search/entidad/min/max filters). */
  readonly visibleCount = computed(() => {
    return this.visibleSections().reduce((sum, s) => sum + this.filteredRows(s).length, 0);
  });

  readonly anyFilterActive = computed(
    () =>
      this.searchQuery().trim() !== '' ||
      this.selectedEntidades().size > 0 ||
      this.filterMin() !== null ||
      this.filterMax() !== null ||
      this.tipoChipActive(),
  );

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedEntidades.set(new Set());
    this.filterMin.set(null);
    this.filterMax.set(null);
    this.clearTipos();
  }

  // ══════════════════════════════════════════════════════════════════════
  // v2 modal — Simple / Avanzado (Brief C · Borja 2026-05-25)
  //
  // Layered alongside v1. The v1 dialog markup is untouched; v2 is its own
  // template branch driven by `version() === 'v2' && addMode() === 'simple'`.
  // Avanzado mode falls back to the v1 dialog content per the brief.
  //
  // No IPC anywhere — Crecimiento estimado collapses to "El mismo que el
  // activo" / "Manual" per Borja 2026-02-27.
  // ══════════════════════════════════════════════════════════════════════

  readonly addMode = signal<'simple' | 'avanzado'>('simple');
  readonly addModeOptions: SegmentedOption[] = [
    { value: 'simple', label: 'Simple' },
    { value: 'avanzado', label: 'Avanzado' },
  ];
  setAddMode(v: string | number): void {
    if (v === 'simple' || v === 'avanzado') this.addMode.set(v);
  }

  // Borja's 7 tipos (PDF p.2). Distinct from `addTipo` (v1's 6 legacy slugs).
  readonly addTipoV2 = signal<PatrimonioTipo>('liquidez');
  readonly addTipoV2Options: SelectOption[] = [
    { value: 'liquidez', label: 'Liquidez' },
    { value: 'fondos', label: 'Fondos' },
    { value: 'acciones-cotizadas', label: 'Acciones cotizadas' },
    { value: 'participaciones-empresariales', label: 'Participaciones empresariales' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'otros', label: 'Otros activos' },
    { value: 'deudas', label: 'Deudas' },
  ];
  setAddTipoV2(v: string | number | null): void {
    if (typeof v !== 'string') return;
    if (
      v === 'liquidez' ||
      v === 'fondos' ||
      v === 'acciones-cotizadas' ||
      v === 'participaciones-empresariales' ||
      v === 'inmobiliario' ||
      v === 'otros' ||
      v === 'deudas'
    ) {
      this.addTipoV2.set(v);
    }
  }

  /** Looks up the v2 tipo label for prefill + preview. */
  addTipoV2Label(): string {
    return this.addTipoV2Options.find((o) => o.value === this.addTipoV2())?.label ?? '';
  }

  // ── Common v2 fields ───────────────────────────────────────────────────
  readonly addNombreV2 = signal<string>('Liquidez');
  /** Tracks whether the user has typed in Nombre. While `false`, the field
   * auto-prefills to the tipo label so Borja's "Simple-mode Nombre default"
   * rule (Brief C #8) lands without an explicit reset on every tipo change. */
  readonly addNombreV2Touched = signal<boolean>(false);
  setAddNombreV2(v: string | number | null): void {
    this.addNombreV2.set(v !== null ? String(v) : '');
    this.addNombreV2Touched.set(true);
  }

  readonly addValorV2 = signal<number | null>(null);
  setAddValorV2(v: string | number | null): void {
    this.addValorV2.set(typeof v === 'number' ? v : null);
  }

  readonly addTitularV2 = signal<string>('cliente');
  readonly addTitularV2Options: SelectOption[] = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'conyuge', label: 'Cónyuge' },
    { value: 'ambos', label: 'Ambos' },
  ];
  setAddTitularV2(v: string | number | null): void {
    this.addTitularV2.set(v !== null ? String(v) : 'cliente');
  }

  // ── ¿Patrimonio futuro? — universal branch (PDF p.1) ───────────────────
  readonly addIsPatrimonioFuturo = signal<boolean>(false);
  readonly addAnoObtencion = signal<number | null>(null);
  setAddAnoObtencion(v: string | number | null): void {
    this.addAnoObtencion.set(typeof v === 'number' ? v : null);
  }

  readonly addGeneraIngresos = signal<boolean>(false);

  readonly addFrecuencia = signal<Frecuencia>('anual');
  readonly addFrecuenciaOptions: SelectOption[] = [
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' },
  ];
  setAddFrecuencia(v: string | number | null): void {
    if (v === 'mensual' || v === 'trimestral' || v === 'semestral' || v === 'anual') {
      this.addFrecuencia.set(v);
    }
  }

  readonly addTipoGeneracion = signal<TipoGeneracion>('importe');
  readonly addTipoGeneracionOptions: SelectOption[] = [
    { value: 'importe', label: 'Importe' },
    { value: 'porcentaje', label: 'Porcentaje' },
  ];
  setAddTipoGeneracion(v: string | number | null): void {
    if (v === 'importe' || v === 'porcentaje') this.addTipoGeneracion.set(v);
  }

  readonly addGeneracionValor = signal<number | null>(null);
  setAddGeneracionValor(v: string | number | null): void {
    this.addGeneracionValor.set(typeof v === 'number' ? v : null);
  }

  /** Crecimiento estimado — IPC option dropped per Borja 2026-02-27. */
  readonly addCrecimientoMode = signal<CrecimientoMode>('mismo-activo');
  readonly addCrecimientoModeOptions: SelectOption[] = [
    { value: 'mismo-activo', label: 'El mismo que el activo' },
    { value: 'manual', label: 'Manual' },
  ];
  setAddCrecimientoMode(v: string | number | null): void {
    if (v === 'mismo-activo' || v === 'manual') this.addCrecimientoMode.set(v);
  }

  readonly addCrecimientoManual = signal<number | null>(null);
  setAddCrecimientoManual(v: string | number | null): void {
    this.addCrecimientoManual.set(typeof v === 'number' ? v : null);
  }

  // ── Tipo-specific fields ───────────────────────────────────────────────
  readonly addRentabilidadRiesgo = signal<RentabilidadRiesgo>('medio');
  readonly addRentabilidadRiesgoOptions: SelectOption[] = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
  ];
  setAddRentabilidadRiesgo(v: string | number | null): void {
    if (v === 'bajo' || v === 'medio' || v === 'alto') this.addRentabilidadRiesgo.set(v);
  }

  readonly addDividendoAnual = signal<number | null>(null);
  setAddDividendoAnual(v: string | number | null): void {
    this.addDividendoAnual.set(typeof v === 'number' ? v : null);
  }

  /** Inmobiliario default 2% per PDF screenshot. */
  readonly addRevalorizacion = signal<number>(2);
  setAddRevalorizacion(v: string | number | null): void {
    this.addRevalorizacion.set(typeof v === 'number' ? v : 0);
  }

  readonly addNivelRiesgo = signal<NivelRiesgo>('nulo');
  readonly addNivelRiesgoOptions: SelectOption[] = [
    { value: 'nulo', label: 'Nulo' },
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
  ];
  setAddNivelRiesgo(v: string | number | null): void {
    if (v === 'nulo' || v === 'bajo' || v === 'medio' || v === 'alto') {
      this.addNivelRiesgo.set(v);
    }
  }

  readonly addUso = signal<InmobiliarioUso>('vivienda-principal');
  readonly addUsoOptions: SelectOption[] = [
    { value: 'vivienda-principal', label: 'Vivienda principal' },
    { value: 'uso-propio', label: 'Vivienda en uso propio' },
    { value: 'inversion', label: 'Inversión' },
  ];
  setAddUso(v: string | number | null): void {
    if (v === 'vivienda-principal' || v === 'uso-propio' || v === 'inversion') {
      this.addUso.set(v);
    }
  }

  readonly addIngresosNetos = signal<number | null>(null);
  setAddIngresosNetos(v: string | number | null): void {
    this.addIngresosNetos.set(typeof v === 'number' ? v : null);
  }

  readonly addTipoInteres = signal<number | null>(null);
  setAddTipoInteres(v: string | number | null): void {
    this.addTipoInteres.set(typeof v === 'number' ? v : null);
  }

  readonly addPlazoMedio = signal<number | null>(null);
  setAddPlazoMedio(v: string | number | null): void {
    this.addPlazoMedio.set(typeof v === 'number' ? v : null);
  }

  /** Deudas: list of patrimonio assets this debt finances. `ninguno` first. */
  readonly addActivoFinanciado = signal<string>('ninguno');
  readonly addActivoFinanciadoOptions = computed<SelectOption[]>(() => [
    { value: 'ninguno', label: 'Ninguno' },
    ...this.store
      .patrimonio()
      .filter((a) => a.tipo !== 'deudas')
      .map<SelectOption>((a) => ({
        value: a.id,
        label: `${a.nombre} – ${this.formatEuro(a.valor)}`,
      })),
  ]);
  setAddActivoFinanciado(v: string | number | null): void {
    this.addActivoFinanciado.set(v !== null ? String(v) : 'ninguno');
  }

  // ── Show/hide helpers per tipo ─────────────────────────────────────────
  readonly showsRentabilidadRiesgo = computed(() => {
    const t = this.addTipoV2();
    return t === 'fondos' || t === 'participaciones-empresariales' || t === 'otros';
  });
  readonly showsDividendoAnual = computed(() => {
    const t = this.addTipoV2();
    return t === 'acciones-cotizadas' || t === 'participaciones-empresariales';
  });
  readonly showsInmobiliarioBlock = computed(() => this.addTipoV2() === 'inmobiliario');
  readonly showsInmobiliarioIngresos = computed(
    () => this.showsInmobiliarioBlock() && this.addUso() === 'inversion',
  );
  readonly showsOtrosIngresos = computed(() => this.addTipoV2() === 'otros');
  readonly showsDeudasBlock = computed(() => this.addTipoV2() === 'deudas');

  // ── Nombre auto-prefill effect ─────────────────────────────────────────
  // Keeps Nombre = tipo label while the user hasn't touched it. Resetting
  // `addNombreV2Touched` to false (e.g. on dialog close) re-arms the prefill.
  private readonly nombrePrefill = effect(() => {
    const label = this.addTipoV2Label();
    if (!this.addNombreV2Touched()) {
      this.addNombreV2.set(label);
    }
  });

  // ── Save (Simple mode) ─────────────────────────────────────────────────
  saveSimpleAsset(): void {
    const tipo = this.addTipoV2();
    const valor = this.addValorV2() ?? 0;
    const asset: PatrimonioAsset = {
      id: `new-${Date.now()}`,
      nombre: this.addNombreV2().trim() || this.addTipoV2Label(),
      tipo,
      valor,
      titular: this.addTitularV2(),

      // Universal branch
      patrimonioFuturo: this.addIsPatrimonioFuturo() || undefined,
      anoObtencion: this.addIsPatrimonioFuturo()
        ? (this.addAnoObtencion() ?? undefined)
        : undefined,
      generaIngresos:
        this.addIsPatrimonioFuturo() && this.addGeneraIngresos() ? true : undefined,
      frecuencia:
        this.addIsPatrimonioFuturo() && this.addGeneraIngresos()
          ? this.addFrecuencia()
          : undefined,
      tipoGeneracion:
        this.addIsPatrimonioFuturo() && this.addGeneraIngresos()
          ? this.addTipoGeneracion()
          : undefined,
      generacionValor:
        this.addIsPatrimonioFuturo() && this.addGeneraIngresos()
          ? (this.addGeneracionValor() ?? undefined)
          : undefined,
      crecimientoMode:
        this.addIsPatrimonioFuturo() && this.addGeneraIngresos()
          ? this.addCrecimientoMode()
          : undefined,
      crecimientoManual:
        this.addIsPatrimonioFuturo() &&
        this.addGeneraIngresos() &&
        this.addCrecimientoMode() === 'manual'
          ? (this.addCrecimientoManual() ?? undefined)
          : undefined,

      // Tipo-specific
      rentabilidadRiesgo: this.showsRentabilidadRiesgo()
        ? this.addRentabilidadRiesgo()
        : undefined,
      dividendoAnual: this.showsDividendoAnual()
        ? (this.addDividendoAnual() ?? undefined)
        : undefined,
      revalorizacion: this.showsInmobiliarioBlock() ? this.addRevalorizacion() : undefined,
      nivelRiesgo: this.showsInmobiliarioBlock() ? this.addNivelRiesgo() : undefined,
      uso: this.showsInmobiliarioBlock() ? this.addUso() : undefined,
      ingresosNetos:
        this.showsInmobiliarioIngresos() || this.showsOtrosIngresos()
          ? (this.addIngresosNetos() ?? undefined)
          : undefined,
      tipoInteres: this.showsDeudasBlock() ? (this.addTipoInteres() ?? undefined) : undefined,
      plazoMedio: this.showsDeudasBlock() ? (this.addPlazoMedio() ?? undefined) : undefined,
      activoFinanciado: this.showsDeudasBlock() ? this.addActivoFinanciado() : undefined,
    };

    this.store.addAsset(asset);

    // Reset form state for next add; close the dialog.
    this.resetV2Form();
    this.addDialogOpen.set(false);

    // Reuse the v1 toast channel so the confirmation lands in the same place.
    const msg = `Activo «${asset.nombre}» añadido a ${this.addTipoV2Label()}`;
    this.savedToastMessage.set(msg);
    this.savedToastVisible.set(true);
    clearTimeout(this.savedToastTimer);
    this.savedToastTimer = setTimeout(() => this.savedToastVisible.set(false), 5000);
  }

  private resetV2Form(): void {
    this.addNombreV2Touched.set(false);
    this.addValorV2.set(null);
    this.addIsPatrimonioFuturo.set(false);
    this.addAnoObtencion.set(null);
    this.addGeneraIngresos.set(false);
    this.addGeneracionValor.set(null);
    this.addCrecimientoMode.set('mismo-activo');
    this.addCrecimientoManual.set(null);
    this.addDividendoAnual.set(null);
    this.addIngresosNetos.set(null);
    this.addTipoInteres.set(null);
    this.addPlazoMedio.set(null);
    this.addActivoFinanciado.set('ninguno');
    // Tipo + Revalorización keep their defaults so consecutive adds are fast.
  }
}

/** Round to the nearest 1/2/5/10·10ⁿ step so a +/- stepper feels natural
 *  across magnitudes. 5_000 → 5_000, 23_000 → 20_000, 87_000 → 100_000. */
function niceStep(v: number): number {
  if (v <= 0) return 1;
  const log = Math.floor(Math.log10(v));
  const base = Math.pow(10, log);
  const norm = v / base;
  let mult: number;
  if (norm <= 1) mult = 1;
  else if (norm <= 2) mult = 2;
  else if (norm <= 5) mult = 5;
  else mult = 10;
  return mult * base;
}
