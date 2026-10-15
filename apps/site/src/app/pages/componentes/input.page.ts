import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  InputComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { InputShape, InputSize, InputType } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
      { property: 'Background', token: '--input-background-default', semantic: '--input-background-default', primitive: '--color-base-white' },
      { property: 'Border (idle)', token: '--input-border-default', semantic: '--input-border-default', primitive: '--color-afi-control-300' },
      { property: 'Border (hover)', token: '--input-border-hover', semantic: '--input-border-hover', primitive: '--color-afi-control-500' },
      { property: 'Border (focus)', token: '--input-border-focus', semantic: '--input-border-focus', primitive: '--border-focus' },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
      { property: 'Border (error)', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Value', token: '--input-foreground-default', semantic: '--input-foreground-default', primitive: '--foreground-secondary-default' },
      { property: 'Placeholder', token: '--input-foreground-placeholder', semantic: '--input-foreground-placeholder', primitive: '--color-afi-control-500' },
      { property: 'Icon', token: '--input-icon-default', semantic: '--input-icon-default', primitive: '--color-afi-control-500' },
      { property: 'Label', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Hint', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-500' },
      { property: 'Error message', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Disabled (fill, border, value)', token: '--input-background-disabled', semantic: '--input-background-disabled', primitive: '--disabled-background' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
      { property: 'sm height', token: '--control-h-sm', semantic: '--control-h-sm', primitive: '28px (40px below lg)' },
      { property: 'md height', token: '--control-h-md', semantic: '--control-h-md', primitive: '32px (44px below lg)' },
      { property: 'lg height', token: '--control-h-lg', semantic: '--control-h-lg', primitive: '40px (48px below lg)' },
      { property: 'Inline padding', token: '--space-sm', semantic: '--space-sm', primitive: '12px' },
      { property: 'Border radius', token: '--radius-control', semantic: '--radius-control', primitive: '10px' },
      { property: 'Border radius (pill)', token: '--radius-full', semantic: '--radius-full', primitive: '9999px' },
      { property: 'Typography', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '14px / 20px / 400 at every size' },
      { property: 'Label gap', token: '--space-2xs', semantic: '--space-2xs', primitive: '4px' },
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

const SHAPE_OPTIONS = [
  { value: 'rect', label: 'rect' },
  { value: 'pill', label: 'pill' },
];

const EXTRA_OPTIONS = [
  { value: 'none', label: 'Ninguno' },
  { value: 'help', label: 'Ayuda' },
  { value: 'icons', label: 'Iconos' },
  { value: 'numeric', label: 'Numeric' },
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
  readonly shape = signal<InputShape>('rect');
  readonly extra = signal<'none' | 'help' | 'icons' | 'numeric'>('none');
  readonly state = signal<'default' | 'disabled' | 'readonly' | 'error'>('default');

  readonly typeOptions = TYPE_OPTIONS;
  readonly sizeOptions = SIZE_OPTIONS;
  readonly shapeOptions = SHAPE_OPTIONS;
  readonly extraOptions = EXTRA_OPTIONS;
  readonly stateOptions = STATE_OPTIONS;

  readonly disabled = computed(() => this.state() === 'disabled');
  readonly readonly = computed(() => this.state() === 'readonly');
  readonly errorText = computed(() =>
    this.state() === 'error' ? 'Introduzca un correo electrónico válido.' : null,
  );

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
