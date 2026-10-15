import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InputComponent, SegmentedControlComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Label', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
      { property: 'Required marker', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'ⓘ (idle)', token: '--foreground-tertiary-default', semantic: '--foreground-tertiary-default', primitive: '--color-afi-control-500' },
      { property: 'ⓘ (hover)', token: '--button-neutral-background-active', semantic: '--button-neutral-background-active', primitive: '--color-afi-control-200' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Label typography', token: '--type-body-md-400', semantic: '--type-body-md-400', primitive: '14px / 20px / 400' },
      { property: 'Gap label to control', token: '--space-2xs', semantic: '--space-2xs', primitive: '4px' },
      { property: 'Gap label to ⓘ', token: '--space-2xs', semantic: '--space-2xs', primitive: '4px' },
      { property: 'ⓘ button', token: '--icon-button-size-sm', semantic: '--icon-button-size-sm', primitive: '24px' },
      { property: 'Tooltip max width', token: '--dimension-60', semantic: '--dimension-60', primitive: '240px' },
    ],
  },
];

const LABEL_OPTIONS = [
  { value: 'short', label: 'Corto' },
  { value: 'long', label: 'Largo (ajusta línea)' },
];

@Component({
  selector: 'site-field-help-page',
  standalone: true,
  imports: [
    RouterLink,
    InputComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-help.page.html',
  styleUrl: './field-help.page.scss',
})
export class FieldHelpPage {
  readonly labelLength = signal<'short' | 'long'>('short');
  readonly labelOptions = LABEL_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;

  readonly helpText =
    'Es el importe que figura en la escritura. Si todavía no la tiene, indique una estimación y corríjala más tarde.';
  readonly shortLabel = 'Valor de compra';
  readonly longLabel =
    'Valor de compra del inmueble según la escritura de adquisición, sin gastos ni impuestos';
}
