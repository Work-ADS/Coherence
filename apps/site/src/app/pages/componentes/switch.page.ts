import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SwitchComponent, SegmentedControlComponent } from '@coherence/ui';
import type { SwitchSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Track (off)', token: '--surface-quiet', semantic: '--surface-quiet', primitive: '--color-afi-control-100' },
    { property: 'Track (on)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
    { property: 'Thumb', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Track border radius', token: '--radius-full', semantic: '--radius-full', primitive: '999px' },
    { property: 'Thumb shadow', token: '--shadow-sm', semantic: '--shadow-sm', primitive: '0 1px 2px rgba(0,0,0,0.06)' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm track', token: 'w 28 / h 16 px', semantic: '--dimension-7 / --dimension-4', primitive: '28px / 16px' },
    { property: 'md track', token: 'w 36 / h 20 px', semantic: '--dimension-9 / --dimension-5', primitive: '36px / 20px' },
    { property: 'Typography', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px / 24px / 400' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
];

const STATE_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
  { value: 'disabled', label: 'Disabled' },
];

@Component({
  selector: 'site-switch-page',
  standalone: true,
  imports: [
    RouterLink,
    SwitchComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './switch.page.html',
  styleUrl: './switch.page.scss',
})
export class SwitchPage {
  readonly size = signal<SwitchSize>('md');
  readonly state = signal<'off' | 'on' | 'disabled'>('on');

  readonly sizeOptions = SIZE_OPTIONS;
  readonly stateOptions = STATE_OPTIONS;

  readonly checked = computed(() => this.state() === 'on' || this.state() === 'disabled');
  readonly disabled = computed(() => this.state() === 'disabled');

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
