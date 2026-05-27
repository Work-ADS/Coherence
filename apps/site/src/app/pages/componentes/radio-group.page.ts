import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  RadioGroupComponent,
  RadioGroupItemComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { RadioSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Background (unchecked)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Background (checked)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
    { property: 'Border (idle)', token: '--border-default', semantic: '--border-default', primitive: '--color-afi-gris-300' },
    { property: 'Border (checked)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
    { property: 'Dot', token: '--brand-secondary-foreground-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-0' },
    { property: 'Label', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
    { property: 'Border radius', token: '--radius-full', semantic: '--radius-full', primitive: '999px' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm dot', token: '--dimension-4', semantic: '--dimension-4', primitive: '16px' },
    { property: 'md dot', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
    { property: 'Gap between items', token: '--space-sm', semantic: '--space-sm', primitive: '12px' },
    { property: 'Typography', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px / 24px / 400' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'disabled', label: 'Disabled' },
];

const ITEMS = [
  { value: 'tarjeta', label: 'Tarjeta de crédito' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'paypal', label: 'PayPal' },
];

@Component({
  selector: 'site-radio-group-page',
  standalone: true,
  imports: [
    RouterLink,
    RadioGroupComponent,
    RadioGroupItemComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './radio-group.page.html',
  styleUrl: './radio-group.page.scss',
})
export class RadioGroupPage {
  readonly size = signal<RadioSize>('md');
  readonly state = signal<'default' | 'disabled'>('default');
  readonly selectedValue = signal<string>('tarjeta');

  readonly sizeOptions = SIZE_OPTIONS;
  readonly stateOptions = STATE_OPTIONS;
  readonly items = ITEMS;

  readonly disabled = computed(() => this.state() === 'disabled');

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
