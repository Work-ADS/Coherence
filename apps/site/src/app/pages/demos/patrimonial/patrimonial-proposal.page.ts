import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  afterNextRender,
  computed,
  signal,
  viewChild,
  viewChildren,
  type WritableSignal,
} from '@angular/core';

import {
  ButtonComponent,
  InputComponent,
  KbdComponent,
  ModalComponent,
  PageHeaderComponent,
  SelectComponent,
  TableComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, TableRowAction } from '@coherence/ui';

import { GraphCardHeaderComponent } from '../../patrones/graficos/evolucion-patrimonial/graph-card-header.component';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { ActionToastComponent } from '../shared/action-toast.component';
import { bridgeDesignReviewVersion } from '../shared/design-review-bridge';
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import { VersionToggleComponent, type VersionOption } from '../shared/version-toggle.component';

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
    InputComponent,
    KbdComponent,
    ModalComponent,
    PageHeaderComponent,
    SelectComponent,
    TableComponent,
    DemoShellComponent,
    GraphCardHeaderComponent,
    ActionToastComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    VersionToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patrimonial-proposal.page.html',
  styleUrls: ['./patrimonial-proposal.page.scss'],
})
export class PatrimonialProposalPage {
  constructor() {
    // Measure the tab strip after first render so the left/right chevrons
    // reflect actual overflow from page load (not just after the user scrolls).
    afterNextRender(() => this.measureTabs());

    bridgeDesignReviewVersion(this.version as unknown as WritableSignal<string>);
  }

  readonly addDialogOpen = signal(false);
  readonly rowActionsOpen = signal<string | null>(null);
  readonly addTipo = signal<string>('liquidez');
  readonly addImporte = signal<string>('');
  readonly addEntidad = signal<string>('santander');
  readonly addDescripcion = signal<string>('');
  readonly escShortcut: string[] = ['Esc'];

  /** Page-level layout version. V1 is the current implementation with the
   *  senior-feedback fixes from this round. V2 / V3 are stubs ready to host
   *  future explorations — variants are kept side-by-side so seniors can
   *  compare across reviews instead of overwriting prior work. */
  readonly version = signal<LayoutVersion>('v1');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];
  setVersion(v: string): void {
    if (v === 'v1' || v === 'v2' || v === 'v3') this.version.set(v);
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

    // Switch to the target tab so the user can see where the activo landed
    this.setActiveTab(newAsset.sectionKey);
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

  readonly addShortcut: string[] = ['A'];

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

  /** Sections actually shown on the page — tab-filtered. "todos" shows everything. */
  readonly visibleSections = computed(() => {
    const t = this.activeTab();
    return t === 'todos' ? this.sections : this.sections.filter((s) => s.key === t);
  });

  private rowsForSection(section: AssetSection): AssetRow[] {
    const added = this.addedAssets()
      .filter((item) => item.sectionKey === section.key)
      .map((item) => item.row);
    return added.concat(section.rows);
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
    const total = this.sectionRowCount(section);
    const count =
      this.anyFilterActive() && visibleRows !== section.rows.length
        ? `${visibleRows} de ${total}`
        : `${total}`;
    const noun = total === 1 ? 'activo' : 'activos';
    const columns = section.columns.map((c) => c.label).join(', ');
    return `${count} ${noun} · Columnas: ${columns}`;
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
   *  rows + their children get the same set). */
  readonly assetTableActions: TableRowAction[] = [
    { key: 'edit', label: 'Editar', icon: 'edit', ariaLabel: 'Editar activo' },
    { key: 'duplicate', label: 'Duplicar', overflow: true },
    {
      key: 'delete',
      label: 'Borrar',
      overflow: true,
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
   * Row-click handler from `<afi-table>` — no-op for now (patrimonial
   * doesn't open a detail page on row click, only on action click).
   * Wired so the table doesn't complain about the missing handler.
   */
  onSectionRowClicked(_event: { row: Record<string, unknown>; event: MouseEvent }): void {
    /* intentional no-op */
  }

  /** Row-action dispatcher. All three actions are placeholders pending
   *  real implementations from the store; closes the toast on each. */
  onSectionAction(event: { action: TableRowAction; row: Record<string, unknown> }): void {
    // TODO(2026-05-28): wire to the patrimonial store once edit/duplicate/
    // delete persist. For now the actions just dismiss the row-actions menu.
    void event;
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
  clearMin(): void {
    this.filterMin.set(null);
    this.minMenuOpen.set(false);
  }
  clearMax(): void {
    this.filterMax.set(null);
    this.maxMenuOpen.set(false);
  }

  onSearchInput(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }
  onMinInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value.trim();
    this.filterMin.set(v === '' ? null : Number(v));
  }
  onMaxInput(e: Event): void {
    const v = (e.target as HTMLInputElement).value.trim();
    this.filterMax.set(v === '' ? null : Number(v));
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
      this.filterMax() !== null,
  );

  clearAllFilters(): void {
    this.searchQuery.set('');
    this.selectedEntidades.set(new Set());
    this.filterMin.set(null);
    this.filterMax.set(null);
  }
}
