import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SearchComponent, SegmentedControlComponent } from '@coherence/ui';
import type { SearchShape, SearchSize, SearchSuggestion } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background', token: '--input-background-default', semantic: '--input-background-default', primitive: '--color-base-white' },
      { property: 'Border (idle)', token: '--input-border-default', semantic: '--input-border-default', primitive: '--color-afi-control-300' },
      { property: 'Border (hover)', token: '--input-border-hover', semantic: '--input-border-hover', primitive: '--color-afi-control-500' },
      { property: 'Border and ring (focus)', token: '--input-border-focus', semantic: '--input-border-focus', primitive: '--border-focus' },
      { property: 'Icon', token: '--input-icon-default', semantic: '--input-icon-default', primitive: '--color-afi-control-500' },
      { property: 'Placeholder', token: '--input-foreground-placeholder', semantic: '--input-foreground-placeholder', primitive: '--color-afi-control-500' },
      { property: 'Panel', token: '--overlay-dropdown', semantic: '--overlay-dropdown', primitive: '--color-base-white' },
      { property: 'Row (hover)', token: '--control-background-hover', semantic: '--control-background-hover', primitive: '--color-afi-control-100' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'sm height', token: '--control-h-sm', semantic: '--control-h-sm', primitive: '28px (40px below lg)' },
      { property: 'md height', token: '--control-h-md', semantic: '--control-h-md', primitive: '32px (44px below lg)' },
      { property: 'lg height', token: '--control-h-lg', semantic: '--control-h-lg', primitive: '40px (48px below lg)' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
      { property: 'Border radius (pill)', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
      { property: 'Row', token: '--menu-item-min-height', semantic: '--menu-item-min-height', primitive: '40px' },
      { property: 'Rows shown', token: 'máximo 10', semantic: 'máximo 10', primitive: '10' },
    ],
  },
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

const SHAPE_OPTIONS = [
  { value: 'rect', label: 'rect' },
  { value: 'pill', label: 'pill' },
];

const EXTRA_OPTIONS = [
  { value: 'none', label: 'Ninguno' },
  { value: 'help', label: 'Ayuda' },
  { value: 'required', label: 'Obligatorio' },
];

const ACTIVOS: SearchSuggestion[] = [
  { id: 'inm-1', label: 'Vivienda habitual', description: 'Inmueble · Madrid', trailing: '420.000 €' },
  { id: 'inm-2', label: 'Apartamento en la costa', description: 'Inmueble · Málaga', trailing: '185.000 €' },
  { id: 'cta-1', label: 'Cuenta corriente', description: 'Cuenta bancaria', trailing: '12.300 €' },
  { id: 'fnd-1', label: 'Fondo de renta variable global', description: 'Fondo de inversión', trailing: '58.700 €' },
  { id: 'pen-1', label: 'Plan de pensiones', description: 'Plan de pensiones', trailing: '31.900 €' },
];

@Component({
  selector: 'site-search-page',
  standalone: true,
  imports: [RouterLink, SearchComponent, SegmentedControlComponent, DocPageShellComponent, DocTokensComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.page.html',
  styleUrl: './search.page.scss',
})
export class SearchPage {
  readonly size = signal<SearchSize>('md');
  readonly shape = signal<SearchShape>('rect');
  readonly extra = signal<'none' | 'help' | 'required'>('none');
  readonly query = signal('');
  readonly picked = signal<string | null>(null);

  readonly sizeOptions = SIZE_OPTIONS;
  readonly shapeOptions = SHAPE_OPTIONS;
  readonly extraOptions = EXTRA_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;

  /** The consumer owns the filtering; the primitive caps the list at ten rows. */
  readonly suggestions = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return [];
    return ACTIVOS.filter((a) => a.label.toLowerCase().includes(q) || (a.description ?? '').toLowerCase().includes(q));
  });

  onPicked(s: SearchSuggestion): void {
    this.picked.set(s.label);
    this.query.set(s.label);
  }
}
