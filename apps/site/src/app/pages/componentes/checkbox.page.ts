import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CheckboxComponent, SegmentedControlComponent } from '@coherence/ui';
import type { CheckboxSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Background (unchecked)', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Background (checked)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
    { property: 'Background (disabled)', token: '--surface-quiet', semantic: '--surface-quiet', primitive: '--color-afi-control-100' },
    { property: 'Border (idle)', token: '--border-default', semantic: '--border-default', primitive: '--color-afi-gris-300' },
    { property: 'Border (checked)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
    { property: 'Check mark', token: '--brand-secondary-foreground-default', semantic: '--brand-secondary-foreground-default', primitive: '--color-afi-azul-0' },
    { property: 'Label', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
    { property: 'Border radius', token: '--radius-xs', semantic: '--radius-xs', primitive: '4px' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm box', token: '--dimension-4', semantic: '--dimension-4', primitive: '16px' },
    { property: 'md box', token: '--dimension-5', semantic: '--dimension-5', primitive: '20px' },
    { property: 'Gap to label', token: '--space-sm', semantic: '--space-sm', primitive: '12px' },
    { property: 'Typography', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px / 24px / 400' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
];

const STATE_OPTIONS = [
  { value: 'unchecked', label: 'Unchecked' },
  { value: 'checked', label: 'Checked' },
  { value: 'indeterminate', label: 'Indeterminate' },
  { value: 'disabled', label: 'Disabled' },
];

@Component({
  selector: 'site-checkbox-page',
  standalone: true,
  imports: [
    RouterLink,
    CheckboxComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkbox.page.html',
  styleUrl: './checkbox.page.scss',
})
export class CheckboxPage {
  readonly size = signal<CheckboxSize>('md');
  readonly state = signal<'unchecked' | 'checked' | 'indeterminate' | 'disabled'>('checked');

  readonly sizeOptions = SIZE_OPTIONS;
  readonly stateOptions = STATE_OPTIONS;

  readonly checked = computed(() => this.state() === 'checked' || this.state() === 'disabled');
  readonly indeterminate = computed(() => this.state() === 'indeterminate');
  readonly disabled = computed(() => this.state() === 'disabled');

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
