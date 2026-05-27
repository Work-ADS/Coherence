import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SelectComponent, SegmentedControlComponent } from '@coherence/ui';
import type { SelectSize, SelectOption } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const DEMO_OPTIONS: SelectOption[] = [
  { value: 'mx', label: 'México' },
  { value: 'co', label: 'Colombia' },
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'pe', label: 'Perú' },
];

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Background', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Border (idle)', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
    { property: 'Border (hover)', token: '--border-default', semantic: '--border-default', primitive: '--color-afi-gris-300' },
    { property: 'Border (focus)', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
    { property: 'Border (error)', token: '--feedback-error-border', semantic: '--feedback-error-border', primitive: '--color-error-300' },
    { property: 'Foreground', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
    { property: 'Placeholder', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-500' },
    { property: 'Chevron icon', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm height', token: '--control-h-sm', semantic: '--control-h-sm', primitive: '32px' },
    { property: 'md height', token: '--control-h-md', semantic: '--control-h-md', primitive: '40px' },
    { property: 'lg height', token: '--control-h-lg', semantic: '--control-h-lg', primitive: '48px' },
    { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '6px' },
    { property: 'Typography', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px / 24px / 400' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'error', label: 'Error' },
];

@Component({
  selector: 'site-select-page',
  standalone: true,
  imports: [
    RouterLink,
    SelectComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select.page.html',
  styleUrl: './select.page.scss',
})
export class SelectPage {
  readonly size = signal<SelectSize>('md');
  readonly state = signal<'default' | 'disabled' | 'error'>('default');
  readonly selectedValue = signal<string | number | null>(null);

  readonly sizeOptions = SIZE_OPTIONS;
  readonly stateOptions = STATE_OPTIONS;
  readonly demoOptions = DEMO_OPTIONS;

  readonly disabled = computed(() => this.state() === 'disabled');
  readonly errorText = computed(() => (this.state() === 'error' ? 'Seleccione un país.' : null));

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
