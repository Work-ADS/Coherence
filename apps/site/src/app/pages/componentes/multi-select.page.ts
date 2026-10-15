import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  FilterChipComponent,
  MultiSelectComponent,
  SegmentedControlComponent,
  SelectComponent,
} from '@coherence/ui';
import type { MultiSelectOption, MultiSelectSummary, SelectOption } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Trigger', token: '--input-background-default', semantic: '--input-background-default', primitive: '--color-base-white' },
      { property: 'Trigger border', token: '--input-border-default', semantic: '--input-border-default', primitive: '--color-afi-control-300' },
      { property: 'Count badge', token: '--control-background-selected', semantic: '--control-background-selected', primitive: '--color-afi-control-200' },
      { property: 'Panel', token: '--overlay-dropdown', semantic: '--overlay-dropdown', primitive: '--color-base-white' },
      { property: 'Row (active)', token: '--nav-item-background-hover', semantic: '--nav-item-background-hover', primitive: '--color-afi-white-50' },
      { property: 'Tick box (on)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'sm height', token: '--control-h-sm', semantic: '--control-h-sm', primitive: '28px (40px below lg)' },
      { property: 'md height', token: '--control-h-md', semantic: '--control-h-md', primitive: '32px (44px below lg)' },
      { property: 'Row', token: '--menu-item-min-height', semantic: '--menu-item-min-height', primitive: '40px' },
      { property: 'Panel minimum width', token: '--dimension-64', semantic: '--dimension-64', primitive: '256px' },
      { property: 'Panel max height', token: '--dimension-72', semantic: '--dimension-72', primitive: '288px' },
      { property: 'Layer', token: '--z-floating', semantic: '--z-floating', primitive: '1050' },
    ],
  },
];

const TIPOS: MultiSelectOption[] = [
  { value: 'inmueble', label: 'Inmuebles', hint: '4', group: 'Activos reales' },
  { value: 'vehiculo', label: 'Vehículos', hint: '2', group: 'Activos reales' },
  { value: 'cuenta', label: 'Cuentas bancarias', hint: '7', group: 'Activos financieros' },
  { value: 'fondo', label: 'Fondos de inversión', hint: '12', group: 'Activos financieros' },
  { value: 'pension', label: 'Planes de pensiones', hint: '2', group: 'Activos financieros', disabled: true },
];

const SUMMARY_OPTIONS = [
  { value: 'count', label: 'count' },
  { value: 'labels', label: 'labels' },
  { value: 'fraction', label: 'fraction' },
];

const ESCENARIOS: SelectOption[] = [
  { value: 'base', label: 'Escenario base' },
  { value: 'optimista', label: 'Optimista' },
  { value: 'prudente', label: 'Prudente' },
];

@Component({
  selector: 'site-multi-select-page',
  standalone: true,
  imports: [
    RouterLink,
    FilterChipComponent,
    MultiSelectComponent,
    SegmentedControlComponent,
    SelectComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './multi-select.page.html',
  styleUrl: './multi-select.page.scss',
})
export class MultiSelectPage {
  readonly summary = signal<MultiSelectSummary>('count');
  readonly summaryOptions = SUMMARY_OPTIONS;
  readonly tipos = TIPOS;
  readonly escenarios = ESCENARIOS;
  readonly tokenCategories = TOKEN_CATEGORIES;

  readonly value = signal<string[]>(['inmueble', 'cuenta']);
  readonly chipValue = signal<string[]>([]);
  readonly escenario = signal<string | number | null>('base');

  /** Wording for the chip stays with the consumer. */
  chipText(labels: readonly string[], count: number): string | null {
    if (count === 0) return null;
    return count === 1 ? (labels[0] ?? null) : `${count} seleccionados`;
  }
}
