import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SegmentedControlComponent, StepperComponent } from '@coherence/ui';
import type { StepperItem, StepperLayout, StepperOrientation, StepperSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'markers',
    label: 'Markers',
    rows: [
      { property: 'Done fill', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Current ring', token: '--brand-secondary-background-default', semantic: 'thick border on --surface-default', primitive: '--border-width-thick' },
      { property: 'Current number', token: '--foreground-brand-default', semantic: '--foreground-brand-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Pending', token: '--surface-subtle', semantic: '--surface-subtle + hairline --border-subtle', primitive: 'subtle fill' },
      { property: 'Marker size', token: '--stepper-marker-size', semantic: '--dimension-8', primitive: '32px' },
      { property: 'Marker size (compact)', token: '--stepper-marker-size-compact', semantic: '--dimension-6', primitive: '24px' },
    ],
  },
  {
    value: 'connectors',
    label: 'Connectors',
    rows: [
      { property: 'Rule thickness', token: '--stepper-connector-width', semantic: '--border-width-thick', primitive: '2px' },
      { property: 'Rule (to do)', token: '--border-subtle', semantic: '--border-subtle', primitive: '--color-afi-control-200' },
      { property: 'Rule (done run)', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-profundo-500' },
      { property: 'Gap between steps (plain)', token: '--stepper-gap-plain', semantic: '--space-xl', primitive: '32px' },
    ],
  },
  {
    value: 'type',
    label: 'Type',
    rows: [
      { property: 'Marker number', token: '--type-body-md-600', semantic: '--type-body-md-600', primitive: '14px / 20px 600, tabular figures' },
      { property: 'Label', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '14px / 20px 400' },
      { property: 'Label (current)', token: '--type-body-md-600', semantic: '--type-body-md-600', primitive: '14px / 20px 600' },
      { property: 'Second line', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '12px / 16px 400' },
    ],
  },
];

const LAYOUT_OPTIONS = [
  { value: 'inline', label: 'Inline' },
  { value: 'stacked', label: 'Stacked' },
  { value: 'plain', label: 'Plain' },
];
const SIZE_OPTIONS = [
  { value: 'md', label: 'md' },
  { value: 'compact', label: 'compact' },
];
const ORIENTATION_OPTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' },
];
const CURRENT_OPTIONS = [
  { value: '0', label: 'Step 1' },
  { value: '1', label: 'Step 2' },
  { value: '2', label: 'Step 3' },
  { value: '3', label: 'Step 4' },
];
const OFF_ON_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
];

@Component({
  selector: 'site-stepper-page',
  standalone: true,
  imports: [RouterLink, SegmentedControlComponent, StepperComponent, DocPageShellComponent, DocTokensComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stepper.page.html',
  styleUrl: './stepper.page.scss',
})
export class StepperPage {
  readonly layout = signal<StepperLayout>('inline');
  readonly size = signal<StepperSize>('md');
  readonly orientation = signal<StepperOrientation>('horizontal');
  readonly current = signal<string>('1');
  readonly interactive = signal<'off' | 'on'>('on');
  readonly sub = signal<'off' | 'on'>('off');
  readonly skipped = signal<'off' | 'on'>('off');
  readonly lastClicked = signal<string>('none yet');

  readonly layoutOptions = LAYOUT_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;
  readonly orientationOptions = ORIENTATION_OPTIONS;
  readonly currentOptions = CURRENT_OPTIONS;
  readonly offOnOptions = OFF_ON_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;

  readonly steps = computed<StepperItem[]>(() => {
    const withSub = this.sub() === 'on';
    const skipped = this.skipped() === 'on';
    return [
      { key: 'activos', label: 'Activos', sub: withSub ? '3 cuentas' : undefined },
      { key: 'pasivos', label: 'Pasivos', sub: withSub ? 'Sin deudas' : undefined, state: skipped ? 'done' : undefined },
      { key: 'objetivos', label: 'Objetivos', sub: withSub ? 'Jubilación' : undefined },
      { key: 'resumen', label: 'Resumen' },
    ];
  });

  readonly currentIndex = computed(() => Number(this.current()));

  onStepClicked(event: { key: string; index: number }): void {
    this.lastClicked.set(`${event.key} (paso ${event.index})`);
  }
}
