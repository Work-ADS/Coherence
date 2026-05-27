import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  InputComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { InputSize, InputType } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

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
    { property: 'Label', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
    { property: 'Hint', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
    { property: 'Error message', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
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
    { property: 'Typography (sm)', token: '--type-body-sm-400', semantic: '--type-body-sm-400', primitive: '14px / 20px / 400' },
    { property: 'Typography (md, lg)', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '16px / 24px / 400' },
  ],
};

const TYPE_OPTIONS = [
  { value: 'text', label: 'text' },
  { value: 'email', label: 'email' },
  { value: 'number', label: 'number' },
  { value: 'password', label: 'password' },
  { value: 'textarea', label: 'textarea' },
];

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

const STATE_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'readonly', label: 'Readonly' },
  { value: 'error', label: 'Error' },
];

@Component({
  selector: 'site-input-page',
  standalone: true,
  imports: [
    RouterLink,
    InputComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input.page.html',
  styleUrl: './input.page.scss',
})
export class InputPage {
  readonly type = signal<InputType>('text');
  readonly size = signal<InputSize>('md');
  readonly state = signal<'default' | 'disabled' | 'readonly' | 'error'>('default');

  readonly typeOptions = TYPE_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;
  readonly stateOptions = STATE_OPTIONS;

  readonly disabled = computed(() => this.state() === 'disabled');
  readonly readonly = computed(() => this.state() === 'readonly');
  readonly errorText = computed(() =>
    this.state() === 'error' ? 'Introduzca un correo electrónico válido.' : null,
  );

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
