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
    { property: 'Track (off)', token: '--color-afi-control-300', semantic: '--color-afi-control-300', primitive: '#D0D5DD' },
    { property: 'Track (off, hover)', token: '--color-afi-control-400', semantic: '--color-afi-control-400', primitive: '#98A2B3' },
    { property: 'Track (on)', token: '--color-afi-azul-profundo-700', semantic: '--color-afi-azul-profundo-700', primitive: '#041F2C' },
    { property: 'Track (on, hover)', token: '--color-afi-azul-profundo-800', semantic: '--color-afi-azul-profundo-800', primitive: '#031823' },
    { property: 'Track padding (inset)', token: '--space-3xs', semantic: '--space-3xs', primitive: '2px' },
    { property: 'Thumb', token: '--surface-default', semantic: '--surface-default', primitive: '#FFFFFF' },
    { property: 'Track border radius', token: '--radius-pill', semantic: '--radius-pill', primitive: '999px' },
    { property: 'Thumb shadow', token: '--elevation-sm', semantic: '--elevation-sm', primitive: '0 1px 2px rgba(0,0,0,0.06)' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm track', token: 'w 32 / h 20 px', semantic: '--dimension-8 / --dimension-5', primitive: '32px / 20px' },
    { property: 'sm thumb', token: '16 × 16 px', semantic: '--dimension-4', primitive: '16px / 16px' },
    { property: 'md track', token: 'w 40 / h 24 px', semantic: '--dimension-10 / --dimension-6', primitive: '40px / 24px' },
    { property: 'md thumb', token: '20 × 20 px', semantic: '--dimension-5', primitive: '20px / 20px' },
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

  /**
   * Mirrors switch clicks back into the demo's state signal so the playground
   * is genuinely interactive. The State segmented control still works as a
   * direct setter; clicking the switch just flips between 'off' ↔ 'on'.
   * Disabled state ignores clicks (the switch primitive's `disabled` input
   * blocks the event before we get here).
   */
  onCheckedChange(next: boolean): void {
    this.state.set(next ? 'on' : 'off');
  }
}
