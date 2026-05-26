import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import {
  CheckboxComponent,
  InputComponent,
  PageHeaderComponent,
  SelectComponent,
  SwitchComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type { LegadoObjetivo } from '../wealth-planner-2026/store';

const retiroAges = new Set([56, 57, 58, 59, 60, 63, 64]);

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

@Component({
  selector: 'site-legado-retiro-page',
  standalone: true,
  imports: [
    CheckboxComponent,
    InputComponent,
    PageHeaderComponent,
    SelectComponent,
    SwitchComponent,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './legado-retiro.page.html',
  styleUrls: ['./legado-retiro.page.scss'],
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

  private readonly euroFormatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  setLegadoRetiroEstablished(value: boolean): void {
    this.store.setLegadoRetiroEstablished(value);
  }

  setEdadSeguridad(value: string | number | null): void {
    this.store.setLegadoRetiro({
      edadSeguridad: this.toNumber(value, 100),
    });
  }

  setLegadoObjetivo(value: string | number | null): void {
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
    this.store.setLegadoRetiro({
      edadRetiro: value === null || value === '' ? null : Number(value),
    });
  }

  setContinuarCotizaciones(value: boolean): void {
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

  private toNumber(value: string | number | null, fallback: number): number {
    if (value === null || value === '') return fallback;
    const next = Number(value);
    return Number.isFinite(next) ? Math.max(0, next) : fallback;
  }
}
