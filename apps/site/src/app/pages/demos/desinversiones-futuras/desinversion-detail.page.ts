import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  ButtonComponent,
  InputComponent,
  PageHeaderComponent,
  SelectComponent,
  TableComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, TableSortState } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type {
  DesinversionFutura,
  DesinversionObjetivo,
  Frecuencia,
  PatrimonioAsset,
} from '../wealth-planner-2026/store';

/** Single row shape passed to afi-table — keys match the dynamic column set. */
interface AssetRow extends Record<string, unknown> {
  id: string;
  tipo: string;
  cuenta: string;
  nombre: string;
  patrimonioEsperado2027: number;
  patrimonioDespuesImpuestos: number;
  costeFiscal: number;
  rentaMensualBruta: number;
  rentaMensualNeta: number;
}

const TIPO_LABEL: Record<PatrimonioAsset['tipo'], string> = {
  liquidez: 'Liquidez',
  inversion: 'Inversión',
  inmobiliario: 'Inmobiliario',
  pension: 'Pensión',
  participacion: 'Participación',
  otro: 'Otro',
  // v2 tipos (Brief C)
  fondos: 'Fondos',
  'acciones-cotizadas': 'Acciones cotizadas',
  'participaciones-empresariales': 'Participaciones empresariales',
  otros: 'Otros activos',
  deudas: 'Deudas',
};

const CUENTA_LABEL: Record<PatrimonioAsset['tipo'], string> = {
  liquidez: 'Cuenta personal',
  inversion: 'Cuenta valores',
  inmobiliario: 'Patrimonio personal',
  pension: 'Plan de pensiones',
  participacion: 'Sociedad familiar',
  otro: 'Cuenta personal',
  // v2 tipos (Brief C)
  fondos: 'Cuenta valores',
  'acciones-cotizadas': 'Cuenta valores',
  'participaciones-empresariales': 'Sociedad familiar',
  otros: 'Cuenta personal',
  deudas: 'Pasivo',
};

/**
 * Objetivos · Desinversiones futuras — detail / edit page (Brief G).
 *
 * Full-page edit (not a modal) per Borja 2026-02-27 — divestment planning is
 * a "simulación", not a quick form. Two sections: (1) Objetivo y patrimonio
 * asignado with a sortable asset-selection table, and (2) Detalles
 * (placeholder pending Jaime's review per PDF p.6).
 *
 * The sortable asset table is the **first real consumer of `afi-table`'s
 * sort** in the codebase: rows are computed from `store.patrimonio()` plus a
 * mocked per-asset value layer (see {@link enrich}), sorted by the current
 * {@link sortBy} signal. Column set changes dynamically with `objetivo`.
 */
@Component({
  selector: 'site-desinversion-detail-page',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    PageHeaderComponent,
    SelectComponent,
    TableComponent,
    RouterLink,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './desinversion-detail.page.html',
  styleUrls: ['./desinversion-detail.page.scss'],
})
export class DesinversionDetailPage {
  readonly store = inject(WealthPlannerStore);
  private readonly route = inject(ActivatedRoute);

  // ── Route param → desinversion id signal ─────────────────────────────
  private readonly idFromRoute = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly desinversionId = computed<string | null>(
    () => this.idFromRoute().get('id'),
  );

  readonly currentDesinversion = computed<DesinversionFutura | null>(() => {
    const id = this.desinversionId();
    if (id === null) return null;
    return this.store.desinversiones().find((row) => row.id === id) ?? null;
  });

  // ── Option lists ──────────────────────────────────────────────────────
  readonly objetivoOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Generar liquidez' },
    { value: 'rentas', label: 'Generar rentas' },
  ];

  readonly frecuenciaOptions: SelectOption[] = [
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' },
  ];

  readonly isRentasObjetivo = computed<boolean>(
    () => this.currentDesinversion()?.objetivo === 'rentas',
  );

  // ── Sort state — single source of truth for the asset table ───────────
  readonly sortBy = signal<TableSortState | null>(null);

  // ── Dynamic columns ───────────────────────────────────────────────────
  readonly assetColumns = computed<TableColumn[]>(() => {
    const common: TableColumn[] = [
      { key: 'tipo', label: 'Tipo de activo', sortable: true },
      { key: 'cuenta', label: 'Cuenta', sortable: true },
      { key: 'nombre', label: 'Nombre', sortable: true },
    ];
    const objetivo = this.currentDesinversion()?.objetivo;
    if (objetivo === 'liquidez') {
      return [
        ...common,
        {
          key: 'patrimonioEsperado2027',
          label: 'Patrimonio esperado 2027',
          sortable: true,
          align: 'end',
        },
        {
          key: 'patrimonioDespuesImpuestos',
          label: 'Después de impuestos',
          sortable: true,
          align: 'end',
        },
        { key: 'costeFiscal', label: 'Coste fiscal', sortable: true, align: 'end' },
      ];
    }
    if (objetivo === 'rentas') {
      return [
        ...common,
        {
          key: 'patrimonioEsperado2027',
          label: 'Patrimonio esperado 2027',
          sortable: true,
          align: 'end',
        },
        {
          key: 'rentaMensualBruta',
          label: 'Renta mensual bruta',
          sortable: true,
          align: 'end',
        },
        {
          key: 'rentaMensualNeta',
          label: 'Renta mensual neta',
          sortable: true,
          align: 'end',
        },
        { key: 'costeFiscal', label: 'Coste fiscal', sortable: true, align: 'end' },
      ];
    }
    return common;
  });

  // ── Enriched rows derived from patrimonio + per-asset value mocks ────
  readonly assetRows = computed<AssetRow[]>(() =>
    this.store.patrimonio().map((asset) => this.enrich(asset)),
  );

  readonly sortedAssetRows = computed<AssetRow[]>(() => {
    const rows = this.assetRows();
    const sort = this.sortBy();
    if (sort === null) return rows;
    const { column, direction } = sort;
    const sorted = [...rows].sort((a, b) => {
      const av = a[column];
      const bv = b[column];
      if (typeof av === 'number' && typeof bv === 'number') return av - bv;
      return String(av ?? '').localeCompare(String(bv ?? ''), 'es');
    });
    return direction === 'desc' ? sorted.reverse() : sorted;
  });

  readonly selectedAssetRows = computed<AssetRow[]>(() => {
    const ids = new Set(this.currentDesinversion()?.activosAsignados ?? []);
    return this.assetRows().filter((row) => ids.has(row.id));
  });

  // ── Field handlers ────────────────────────────────────────────────────
  setNombre(value: string | number | null): void {
    const id = this.desinversionId();
    if (id === null) return;
    this.store.updateDesinversion(id, {
      nombre: value === null ? '' : String(value),
    });
  }

  setObjetivo(value: string | number | null): void {
    const id = this.desinversionId();
    if (id === null) return;
    const next = (value as DesinversionObjetivo | null) ?? null;
    const patch: Partial<DesinversionFutura> = { objetivo: next };
    // Clear rentas-only fields when switching away from rentas.
    if (next !== 'rentas') {
      patch.frecuencia = null;
      patch.plazoAnios = null;
    }
    this.store.updateDesinversion(id, patch);
  }

  setFrecuencia(value: string | number | null): void {
    const id = this.desinversionId();
    if (id === null) return;
    this.store.updateDesinversion(id, {
      frecuencia: (value as Frecuencia | null) ?? null,
    });
  }

  setPlazoAnios(value: string | number | null): void {
    const id = this.desinversionId();
    if (id === null) return;
    if (value === null || value === '') {
      this.store.updateDesinversion(id, { plazoAnios: null });
      return;
    }
    const num = Number(value);
    this.store.updateDesinversion(id, {
      plazoAnios: Number.isFinite(num) ? Math.max(0, num) : null,
    });
  }

  onAssetSelectionChange(rows: Record<string, unknown>[]): void {
    const id = this.desinversionId();
    if (id === null) return;
    const ids = rows.map((row) => String(row['id']));
    this.store.updateDesinversion(id, { activosAsignados: ids });
  }

  // ── Per-asset value mocks ─────────────────────────────────────────────
  /**
   * Real values are Diagnóstico/backend territory. For v1 we project from the
   * stored `valor`: a small annual growth assumption + a flat fiscal cost
   * percentage gets us numbers that look plausible against the PDF's example
   * (8.000 € net, 2.000 € gross renta mensual, 1.700 € net). Tweak the
   * factors below if the demo needs to mirror specific PDF cells.
   */
  private enrich(asset: PatrimonioAsset): AssetRow {
    const v = asset.valor;
    const patrimonioEsperado2027 = Math.round(v * 1.05);
    const costeFiscal = Math.round(v * 0.1);
    const patrimonioDespuesImpuestos = v - costeFiscal;
    const rentaMensualBruta = Math.round((v * 0.04) / 12);
    const rentaMensualNeta = Math.round(rentaMensualBruta * 0.85);
    return {
      id: asset.id,
      tipo: TIPO_LABEL[asset.tipo],
      cuenta: CUENTA_LABEL[asset.tipo],
      nombre: asset.nombre,
      patrimonioEsperado2027,
      patrimonioDespuesImpuestos,
      costeFiscal,
      rentaMensualBruta,
      rentaMensualNeta,
    };
  }
}
