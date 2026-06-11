import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  SegmentedControlComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SegmentedOption, SelectOption } from '@coherence/ui';

import {
  DialogContextBarComponent,
  type ContextBarSegment,
} from '../../shared/dialog-context-bar.component';
import {
  TitularesBlockComponent,
  type TitularRow,
} from '../../shared/titulares-block.component';
import type {
  InmobiliarioUso,
  NivelRiesgo,
  PatrimonioAddMode,
  PatrimonioAsset,
  PatrimonioTipo,
  PlanPensionesTipo,
  RentabilidadRiesgo,
  TipoInversion,
  TipoPatrimonioTop,
} from '../../wealth-planner-2026/store';

/**
 * v3 patrimonio dialog — Figma reference: Wealth manager screens 2026/
 * Dialogs for patrimonio (organism/dialog/anadir-*).
 *
 * Two-step model:
 *   • Step 1 — Tipo de patrimonio (always visible, 7 categories)
 *   • Step 2 — branch-specific fields. Only the Inversión branch carries
 *     a secondary "Tipo de inversión" sub-select PLUS Simple/Avanzado.
 *
 * Universal footer (Nombre + Valor actual + Titulares + ¿Hay financiación
 * asociada?) renders below every branch except Deudas (where the
 * universal "financiación asociada" radio is meaningless because the
 * asset IS a debt).
 *
 * For v3 launch we ship the Simple shape across all branches. The
 * Avanzado-only extras for Inversión (Section 1 Identificación / Section
 * 2 Aportaciones / Section 3 Revalorización) are wired in the next push.
 */
@Component({
  selector: 'site-patrimonio-add-modal',
  standalone: true,
  imports: [
    ButtonComponent,
    DialogContextBarComponent,
    InputComponent,
    ModalComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    SegmentedControlComponent,
    SelectComponent,
    TitularesBlockComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './patrimonio-add-modal.component.html',
  styleUrls: ['./patrimonio-add-modal.component.scss'],
})
export class PatrimonioAddModalComponent {
  // ── Inputs ─────────────────────────────────────────────────────────────
  readonly open = input.required<boolean>();
  /** Stacked-bar segments for the Tesler-law context tag. */
  readonly patrimonioSegments = input.required<ContextBarSegment[]>();
  readonly patrimonioTotal = input.required<number>();
  readonly titularOptions = input.required<SelectOption[]>();
  /** Existing patrimonio assets — only the Deudas branch needs this, to
   *  populate the "Activo financiado" search-select. */
  readonly activosFinanciables = input<SelectOption[]>([]);

  // ── Outputs ────────────────────────────────────────────────────────────
  readonly openChange = output<boolean>();
  readonly save = output<PatrimonioAsset>();

  // ── Step 1: top-level tipo ─────────────────────────────────────────────
  readonly tipoTop = signal<TipoPatrimonioTop>('liquidez');
  readonly tipoTopOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Liquidez' },
    { value: 'inversion', label: 'Inversión' },
    { value: 'plan-pensiones', label: 'Plan de pensiones' },
    { value: 'private-equity', label: 'Private equity' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'participaciones', label: 'Participaciones empresariales' },
    { value: 'deudas', label: 'Deudas' },
  ];

  // ── Step 2: Inversión sub-flow ─────────────────────────────────────────
  readonly tipoInversion = signal<TipoInversion>('fondos');
  readonly tipoInversionOptions: SelectOption[] = [
    { value: 'fondos', label: 'Fondos de inversión' },
    { value: 'acciones-cotizadas', label: 'Acciones cotizadas' },
    { value: 'seguros-ahorro', label: 'Seguros de ahorro' },
    { value: 'renta-fija', label: 'Renta fija' },
    { value: 'etf', label: 'ETF' },
    { value: 'cartera', label: 'Cartera' },
    { value: 'otros', label: 'Otros' },
  ];

  readonly addMode = signal<PatrimonioAddMode>('simple');
  readonly addModeOptions: SegmentedOption[] = [
    { value: 'simple', label: 'Simple' },
    { value: 'avanzado', label: 'Avanzado' },
  ];

  // ── Plan de pensiones ──────────────────────────────────────────────────
  readonly planPensionesTipo = signal<PlanPensionesTipo>('ppi');
  readonly derechosConsolidados = signal<number>(0);
  readonly derechosConsolidadosPrevios2007 = signal<number>(0);
  readonly aportacionPeriodicaAnual = signal<number>(0);
  readonly tipoTasaCrecimientoAportacion = signal<'ipc' | 'manual'>('ipc');
  readonly tasaCrecimientoAportacion = signal<number>(2);

  // ── Private equity ─────────────────────────────────────────────────────
  readonly compromisoPago = signal<number>(0);
  readonly desembolsoRealizado = signal<number>(0);
  readonly anioFinDesembolsos = signal<number | null>(null);
  readonly anioInicioDistribuciones = signal<number | null>(null);
  readonly anioFinDistribuciones = signal<number | null>(null);

  // ── Inmobiliario ───────────────────────────────────────────────────────
  readonly revalorizacionEsperada = signal<number>(2);
  readonly inmobiliarioUso = signal<InmobiliarioUso>('vivienda-principal');
  readonly ingresosNetosAnuales = signal<number>(0);
  readonly inmobiliarioUsoOptions: SelectOption[] = [
    { value: 'vivienda-principal', label: 'Vivienda principal' },
    { value: 'uso-propio', label: 'Vivienda en uso propio' },
    { value: 'inversion', label: 'Inversión' },
  ];

  // ── Participaciones empresariales ─────────────────────────────────────
  readonly dividendoAnual = signal<number>(0);

  // ── Deudas ─────────────────────────────────────────────────────────────
  readonly tipoInteres = signal<number>(0);
  readonly plazoMedio = signal<number>(5);
  readonly activoFinanciado = signal<string>('ninguno');

  // ── Shared: Rentabilidad-riesgo + Nivel de riesgo selects ─────────────
  readonly rentabilidadRiesgo = signal<RentabilidadRiesgo>('bajo');
  readonly rentabilidadRiesgoOptions: SelectOption[] = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
  ];
  readonly nivelRiesgo = signal<NivelRiesgo>('nulo');
  readonly nivelRiesgoOptions: SelectOption[] = [
    { value: 'nulo', label: 'Nulo' },
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
  ];

  // ── Universal footer ───────────────────────────────────────────────────
  readonly nombre = signal<string>('');
  readonly valorActual = signal<number>(0);
  readonly financiacionAsociada = signal<boolean>(false);
  readonly titulares = signal<TitularRow[]>([
    { id: 't-1', titularId: 'cliente', porcentaje: 100 },
  ]);

  // ── Computed flags ─────────────────────────────────────────────────────
  readonly showsInversionBranch = computed(() => this.tipoTop() === 'inversion');
  readonly showsModeToggle = computed(() => this.tipoTop() === 'inversion');
  readonly showsFinanciacionAsociada = computed(() => this.tipoTop() !== 'deudas');
  readonly showsIngresosNetosInmobiliario = computed(
    () => this.tipoTop() === 'inmobiliario' && this.inmobiliarioUso() === 'inversion',
  );
  readonly showsDividendoAnual = computed(() => {
    if (this.tipoTop() === 'participaciones') return true;
    if (this.tipoTop() === 'inversion' && this.tipoInversion() === 'acciones-cotizadas') return true;
    return false;
  });
  readonly showsRentabilidadRiesgo = computed(() => {
    if (this.tipoTop() === 'private-equity') return true;
    if (this.tipoTop() === 'participaciones') return true;
    if (this.tipoTop() === 'inversion') {
      const t = this.tipoInversion();
      return t === 'fondos' || t === 'otros';
    }
    return false;
  });
  readonly showsManualGrowthRate = computed(
    () => this.tipoTasaCrecimientoAportacion() === 'manual',
  );

  /** Sum of titular percentages — must equal 100 for the form to save. */
  readonly titularesTotal = computed(() =>
    this.titulares().reduce(
      (sum, t) => sum + (Number.isFinite(t.porcentaje) ? t.porcentaje : 0),
      0,
    ),
  );
  readonly titularesValid = computed(() => Math.round(this.titularesTotal()) === 100);

  /** Aceptar enabled when valor actual > 0 AND titulares sum to 100. */
  readonly canSave = computed(() => this.valorActual() > 0 && this.titularesValid());

  /** Title varies per branch — matches Figma copy. */
  readonly modalTitle = computed(() => {
    switch (this.tipoTop()) {
      case 'liquidez':
        return 'Añadir liquidez';
      case 'inversion':
        return 'Añadir inversión';
      case 'plan-pensiones':
        return 'Añadir plan de pensiones';
      case 'private-equity':
        return 'Añadir private equity';
      case 'inmobiliario':
        return 'Añadir inmobiliario';
      case 'participaciones':
        return 'Añadir participaciones';
      case 'deudas':
        return 'Añadir deudas';
    }
  });

  // ── Setters ────────────────────────────────────────────────────────────
  setTipoTop(v: string | number | null): void {
    if (typeof v !== 'string') return;
    this.tipoTop.set(v as TipoPatrimonioTop);
  }
  setTipoInversion(v: string | number | null): void {
    if (typeof v !== 'string') return;
    this.tipoInversion.set(v as TipoInversion);
  }
  setAddMode(v: string | number): void {
    if (v === 'simple' || v === 'avanzado') this.addMode.set(v);
  }
  setRentabilidadRiesgo(v: string | number | null): void {
    if (typeof v !== 'string') return;
    this.rentabilidadRiesgo.set(v as RentabilidadRiesgo);
  }
  setNivelRiesgo(v: string | number | null): void {
    if (typeof v !== 'string') return;
    this.nivelRiesgo.set(v as NivelRiesgo);
  }
  setInmobiliarioUso(v: string | number | null): void {
    if (typeof v !== 'string') return;
    this.inmobiliarioUso.set(v as InmobiliarioUso);
  }
  setActivoFinanciado(v: string | number | null): void {
    if (typeof v !== 'string') return;
    this.activoFinanciado.set(v);
  }
  setPlanTipo(v: string): void {
    if (v === 'ppi' || v === 'ppe' || v === 'epsv') this.planPensionesTipo.set(v);
  }
  setCrecimientoTipo(v: string): void {
    if (v === 'ipc' || v === 'manual') this.tipoTasaCrecimientoAportacion.set(v);
  }
  setFinanciacionAsociada(v: string): void {
    this.financiacionAsociada.set(v === 'si');
  }

  /** Numeric input handler — both Input emits string | number | null. */
  setNumber(target: 'derechosConsolidados' | 'derechosConsolidadosPrevios2007'
    | 'aportacionPeriodicaAnual' | 'tasaCrecimientoAportacion'
    | 'compromisoPago' | 'desembolsoRealizado'
    | 'anioFinDesembolsos' | 'anioInicioDistribuciones' | 'anioFinDistribuciones'
    | 'revalorizacionEsperada' | 'ingresosNetosAnuales' | 'dividendoAnual'
    | 'tipoInteres' | 'plazoMedio' | 'valorActual',
    v: string | number | null): void {
    const n = v === null || v === '' ? 0 : Number(v);
    const safe = Number.isFinite(n) ? n : 0;
    switch (target) {
      case 'derechosConsolidados': this.derechosConsolidados.set(safe); break;
      case 'derechosConsolidadosPrevios2007': this.derechosConsolidadosPrevios2007.set(safe); break;
      case 'aportacionPeriodicaAnual': this.aportacionPeriodicaAnual.set(safe); break;
      case 'tasaCrecimientoAportacion': this.tasaCrecimientoAportacion.set(safe); break;
      case 'compromisoPago': this.compromisoPago.set(safe); break;
      case 'desembolsoRealizado': this.desembolsoRealizado.set(safe); break;
      case 'anioFinDesembolsos': this.anioFinDesembolsos.set(safe); break;
      case 'anioInicioDistribuciones': this.anioInicioDistribuciones.set(safe); break;
      case 'anioFinDistribuciones': this.anioFinDistribuciones.set(safe); break;
      case 'revalorizacionEsperada': this.revalorizacionEsperada.set(safe); break;
      case 'ingresosNetosAnuales': this.ingresosNetosAnuales.set(safe); break;
      case 'dividendoAnual': this.dividendoAnual.set(safe); break;
      case 'tipoInteres': this.tipoInteres.set(safe); break;
      case 'plazoMedio': this.plazoMedio.set(safe); break;
      case 'valorActual': this.valorActual.set(safe); break;
    }
  }

  setNombre(v: string | number | null): void {
    this.nombre.set(typeof v === 'string' ? v : v === null ? '' : String(v));
  }

  setTitulares(rows: TitularRow[]): void {
    this.titulares.set(rows);
  }

  // ── Save flow ──────────────────────────────────────────────────────────
  cancel(): void {
    this.openChange.emit(false);
  }

  accept(): void {
    if (!this.canSave()) return;
    this.save.emit(this.buildAsset());
    this.openChange.emit(false);
  }

  /** Map the new tipoTop → legacy `tipo` field so existing readers
   *  (desinversiones-futuras, legado-retiro) keep working. */
  private mapLegacyTipo(): PatrimonioTipo {
    switch (this.tipoTop()) {
      case 'liquidez': return 'liquidez';
      case 'inversion': {
        const sub = this.tipoInversion();
        if (sub === 'fondos') return 'fondos';
        if (sub === 'acciones-cotizadas') return 'acciones-cotizadas';
        return 'inversion';
      }
      case 'plan-pensiones': return 'pension';
      case 'private-equity': return 'participaciones-empresariales';
      case 'inmobiliario': return 'inmobiliario';
      case 'participaciones': return 'participaciones-empresariales';
      case 'deudas': return 'deudas';
    }
  }

  private buildAsset(): PatrimonioAsset {
    const id = `patrimonio-${Date.now().toString(36)}`;
    const top = this.tipoTop();
    const asset: PatrimonioAsset = {
      id,
      nombre: this.nombre().trim() || this.modalTitle().replace('Añadir ', ''),
      tipo: this.mapLegacyTipo(),
      valor: this.valorActual(),

      tipoTop: top,
      addMode: this.addMode(),
      titulares: this.titulares()
        .filter((t) => t.titularId !== null)
        .map((t) => ({ id: t.id, titularId: t.titularId as string, porcentaje: t.porcentaje })),
    };

    if (top !== 'deudas') {
      asset.financiacionAsociada = this.financiacionAsociada();
    }
    if (top === 'inversion') {
      asset.tipoInversion = this.tipoInversion();
    }
    if (top === 'plan-pensiones') {
      asset.planPensionesTipo = this.planPensionesTipo();
      asset.derechosConsolidados = this.derechosConsolidados();
      asset.derechosConsolidadosPrevios2007 = this.derechosConsolidadosPrevios2007();
      asset.aportacionPeriodicaAnual = this.aportacionPeriodicaAnual();
      asset.tipoTasaCrecimientoAportacion = this.tipoTasaCrecimientoAportacion();
      if (this.tipoTasaCrecimientoAportacion() === 'manual') {
        asset.tasaCrecimientoAportacion = this.tasaCrecimientoAportacion();
      }
    }
    if (top === 'private-equity') {
      asset.rentabilidadRiesgo = this.rentabilidadRiesgo();
    }
    if (top === 'inmobiliario') {
      asset.revalorizacion = this.revalorizacionEsperada();
      asset.nivelRiesgo = this.nivelRiesgo();
      asset.uso = this.inmobiliarioUso();
      if (this.inmobiliarioUso() === 'inversion') {
        asset.ingresosNetos = this.ingresosNetosAnuales();
      }
    }
    if (top === 'participaciones') {
      asset.rentabilidadRiesgo = this.rentabilidadRiesgo();
      asset.dividendoAnual = this.dividendoAnual();
    }
    if (top === 'deudas') {
      asset.tipoInteres = this.tipoInteres();
      asset.plazoMedio = this.plazoMedio();
      asset.activoFinanciado = this.activoFinanciado();
    }
    if (top === 'inversion' && this.showsDividendoAnual()) {
      asset.dividendoAnual = this.dividendoAnual();
    }
    if (top === 'inversion' && this.showsRentabilidadRiesgo()) {
      asset.rentabilidadRiesgo = this.rentabilidadRiesgo();
    }
    return asset;
  }
}
