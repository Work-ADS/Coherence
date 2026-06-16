import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  CheckboxComponent,
  FilterChipComponent,
  InputComponent,
  PageHeaderComponent,
  SearchComponent,
  SectionComponent,
  SelectComponent,
  SwitchComponent,
} from '@coherence/ui';
import type { FilterChipOption, SearchSuggestion, SelectOption } from '@coherence/ui';

import { ActionToastComponent } from '../shared/action-toast.component';
import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type {
  LegadoObjetivo,
  LegadoRetiroData,
  PatrimonioTipo,
} from '../wealth-planner-2026/store';

const retiroAges = new Set([56, 57, 58, 59, 60]);

const TIPO_LABEL: Record<PatrimonioTipo, string> = {
  liquidez: 'Liquidez',
  inversion: 'Inversión',
  inmobiliario: 'Inmobiliario',
  pension: 'Plan de pensiones',
  participacion: 'Participación',
  otro: 'Otro',
  fondos: 'Fondos',
  'acciones-cotizadas': 'Acciones cotizadas',
  'participaciones-empresariales': 'Participaciones empresariales',
  otros: 'Otros',
  deudas: 'Deudas',
};

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

/** Fields covered by the Datos generales section — only edits to these fire
 *  the save-with-undo toast. Patrimonio financiero adicional + Activos a
 *  conservar (Manual legado) live in their own section and stay silent. */
type DatosGeneralesSnapshot = Pick<
  LegadoRetiroData,
  'edadSeguridad' | 'edadRetiro' | 'legadoObjetivo' | 'continuarCotizaciones'
>;

// `<afi-filter-chip mode="dropdown" [options]=...>` consumes plain
// FilterChipOption shapes — keep the local tipo enum on the side so the
// page can map a picked option.value back to a PatrimonioTipo safely.
type TipoFilterOption = FilterChipOption;

@Component({
  selector: 'site-legado-retiro-page',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    FilterChipComponent,
    InputComponent,
    PageHeaderComponent,
    SearchComponent,
    SectionComponent,
    SelectComponent,
    SwitchComponent,
    ActionToastComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legado-retiro.page.html',
  styleUrl: './legado-retiro.page.scss',
})
export class LegadoRetiroPage {
  readonly store = inject(WealthPlannerStore);

  readonly legadoObjetivoOptions: SelectOption[] = [
    {
      value: 'mantener-todo',
      label: 'Mantener todo el patrimonio (endowment)',
    },
    { value: 'mantener-vivienda', label: 'Mantener vivienda principal' },
    { value: 'manual', label: 'Manual - seleccionar activos' },
  ];

  readonly edadJubilacionOptions: SelectOption[] = [
    ...range(56, 60).map((age) => ({
      value: age,
      label: `${age} años`,
    })),
    { value: 61, label: '61 años (jubilación involuntaria)' },
    { value: 62, label: '62 años (jubilación involuntaria)' },
    { value: 63, label: '63 años (jubilación voluntaria)' },
    { value: 64, label: '64 años (jubilación voluntaria)' },
    { value: 65, label: '65 años (jubilación ordinaria)' },
    ...range(66, 70).map((age) => ({
      value: age,
      label: `${age} años`,
    })),
  ];

  readonly showsManualLegado = computed<boolean>(
    () => this.store.legadoRetiro().legadoObjetivo === 'manual',
  );

  readonly selectedAssets = computed(() => {
    const selected = new Set(this.store.legadoRetiro().activosConservar);
    return this.store.patrimonio().filter((asset) => selected.has(asset.id));
  });

  readonly totalSelected = computed<string>(() =>
    this.formatEuro(this.selectedAssets().reduce((total, asset) => total + asset.valor, 0)),
  );

  readonly isRetiroKind = computed<boolean>(() => {
    const edadRetiro = this.store.legadoRetiro().edadRetiro;
    return edadRetiro !== null && retiroAges.has(edadRetiro);
  });

  // ── Activos a conservar filters (search + tipo dropdown) ───────────────
  readonly assetSearchTerm = signal<string>('');
  /** Set of selected tipo values (strings, since FilterChipOption.value is
   *  a string). An empty set means "no tipo filter applied". */
  readonly selectedTipos = signal<ReadonlySet<string>>(new Set());

  /** Options for the Tipo dropdown chip — one per tipo present in
   *  patrimonio(), each with its count badge. */
  readonly assetTipoOptions = computed<TipoFilterOption[]>(() => {
    const counts = new Map<PatrimonioTipo, number>();
    for (const asset of this.store.patrimonio()) {
      counts.set(asset.tipo, (counts.get(asset.tipo) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, label: TIPO_LABEL[value], count }))
      .sort((a, b) => a.label.localeCompare(b.label, 'es'));
  });

  /** Short textual summary of the Tipo dropdown selection — drives the
   *  chip's `[selectionLabel]` so the trigger reads "Tipo · Inmuebles" or
   *  "Tipo · 3 seleccionados" instead of a bare number. Mirrors the
   *  Patrimonio `tipoChipLabel` shape. Returns null when nothing is
   *  selected (= no filter) so the chip falls back to its neutral state. */
  readonly tipoChipLabel = computed<string | null>(() => {
    const selected = this.selectedTipos();
    if (selected.size === 0) return null;
    if (selected.size === 1) {
      const [only] = [...selected];
      const match = this.assetTipoOptions().find((o) => o.value === only);
      return match?.label ?? null;
    }
    const [first, ...rest] = [...selected];
    const firstLabel =
      this.assetTipoOptions().find((o) => o.value === first)?.label ?? null;
    if (firstLabel === null) return `${selected.size} seleccionados`;
    return `${firstLabel} + ${rest.length}`;
  });

  /** Typeahead suggestions for the search field — top 8 assets whose name
   *  matches the current query. Empty when the query is empty so the
   *  dropdown only appears once the user starts typing. */
  readonly assetSuggestions = computed<SearchSuggestion[]>(() => {
    const term = this.assetSearchTerm().trim().toLocaleLowerCase('es');
    if (term.length === 0) return [];
    return this.store
      .patrimonio()
      .filter((a) => a.nombre.toLocaleLowerCase('es').includes(term))
      .slice(0, 8)
      .map<SearchSuggestion>((a) => ({
        id: a.id,
        label: a.nombre,
        description: TIPO_LABEL[a.tipo],
        trailing: this.formatEuro(a.valor),
      }));
  });

  readonly filteredAssets = computed(() => {
    const term = this.assetSearchTerm().trim().toLocaleLowerCase('es');
    const tipos = this.selectedTipos();
    return this.store.patrimonio().filter((asset) => {
      if (tipos.size > 0 && !tipos.has(asset.tipo)) return false;
      if (term.length > 0 && !asset.nombre.toLocaleLowerCase('es').includes(term)) return false;
      return true;
    });
  });

  pickAssetSuggestion(suggestion: SearchSuggestion): void {
    this.assetSearchTerm.set(suggestion.label);
  }

  // ── Datos generales action-toast (sociedades pattern) ──────────────────
  readonly datosToastVisible = signal<boolean>(false);
  readonly undoShortcut: string[] = ['⌘', 'Z'];

  private datosPreEditSnapshot: DatosGeneralesSnapshot | null = null;
  private datosToastTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly euroFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  setLegadoRetiroEstablished(value: boolean): void {
    this.store.setLegadoRetiroEstablished(value);
    if (!value) this.dismissDatosToast();
  }

  setEdadSeguridad(value: string | number | null): void {
    this.noteDatosChange();
    this.store.setLegadoRetiro({
      edadSeguridad: this.toNumber(value, 100),
    });
  }

  setLegadoObjetivo(value: string | number | null): void {
    this.noteDatosChange();
    this.store.setLegadoRetiro({
      legadoObjetivo: (value as LegadoObjetivo | null) ?? null,
    });
  }

  setPatrimonioFinancieroAdicional(value: string | number | null): void {
    this.store.setLegadoRetiro({
      patrimonioFinancieroAdicional: this.toNumber(value, 0),
    });
  }

  setEdadRetiro(value: string | number | null): void {
    this.noteDatosChange();
    this.store.setLegadoRetiro({
      edadRetiro: value === null || value === '' ? null : Number(value),
    });
  }

  setContinuarCotizaciones(value: boolean): void {
    this.noteDatosChange();
    this.store.setLegadoRetiro({ continuarCotizaciones: value });
  }

  toggleAsset(id: string, selected: boolean): void {
    this.store.setAssetToConservar(id, selected);
  }

  isAssetSelected(id: string): boolean {
    return this.store.legadoRetiro().activosConservar.includes(id);
  }

  formatEuro(value: number): string {
    return this.euroFormatter.format(value);
  }

  // ── Toast lifecycle ────────────────────────────────────────────────────
  private noteDatosChange(): void {
    if (this.datosPreEditSnapshot === null) {
      const lr = this.store.legadoRetiro();
      this.datosPreEditSnapshot = {
        edadSeguridad: lr.edadSeguridad,
        edadRetiro: lr.edadRetiro,
        legadoObjetivo: lr.legadoObjetivo,
        continuarCotizaciones: lr.continuarCotizaciones,
      };
    }
    this.datosToastVisible.set(true);
    if (this.datosToastTimer !== null) clearTimeout(this.datosToastTimer);
    this.datosToastTimer = setTimeout(() => {
      this.datosToastVisible.set(false);
      this.datosPreEditSnapshot = null;
      this.datosToastTimer = null;
    }, 5000);
  }

  dismissDatosToast(): void {
    if (this.datosToastTimer !== null) {
      clearTimeout(this.datosToastTimer);
      this.datosToastTimer = null;
    }
    this.datosToastVisible.set(false);
    this.datosPreEditSnapshot = null;
  }

  undoDatosGenerales(): void {
    const snap = this.datosPreEditSnapshot;
    if (snap === null) {
      this.dismissDatosToast();
      return;
    }
    this.store.setLegadoRetiro({
      edadSeguridad: snap.edadSeguridad,
      edadRetiro: snap.edadRetiro,
      legadoObjetivo: snap.legadoObjetivo,
      continuarCotizaciones: snap.continuarCotizaciones,
    });
    this.dismissDatosToast();
  }

  @HostListener('document:keydown', ['$event'])
  onUndoKeydown(event: KeyboardEvent): void {
    if (!this.datosToastVisible() || this.datosPreEditSnapshot === null) return;
    const isUndo =
      (event.key === 'z' || event.key === 'Z') &&
      (event.metaKey || event.ctrlKey) &&
      !event.shiftKey;
    if (!isUndo) return;
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    event.preventDefault();
    this.undoDatosGenerales();
  }

  private toNumber(value: string | number | null, fallback: number): number {
    if (value === null || value === '') return fallback;
    const next = Number(value);
    return Number.isFinite(next) ? Math.max(0, next) : fallback;
  }
}
