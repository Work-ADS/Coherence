import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { SegmentedControlComponent } from '@coherence/ui';
import type { SegmentedControlSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const SEGMENTED_TOKENS: TokenRow[] = [
  { property: 'Fondo contenedor', token: 'var(--neutral-100)' },
  { property: 'Fondo activo', token: 'var(--canvas-bg)' },
  { property: 'Sombra activo', token: 'var(--shadow-sm)' },
  { property: 'Radio', token: 'var(--radius-md)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'app-segmented-control-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    SegmentedControlComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Segmented Control"
      subtitle="Control de selección exclusiva entre opciones mutuamente excluyentes."
      docsSource="libs/ui/src/segmented-control/"
      buildPromptSlug="coherence-segmented-control"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview" class="flex items-center gap-space-4">
            <afi-segmented-control
              [options]="options"
              [value]="selected()"
              (valueChange)="selected.set($event)"
            />
          </div>
        </afi-component-playground>

        <section>
          <h2 id="tokens" class="text-section text-canvas-fg mb-space-6">Tokens consumidos</h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class SegmentedControlPage {
  readonly options = [
    { value: 'Diario', label: 'Diario' },
    { value: 'Semanal', label: 'Semanal' },
    { value: 'Mensual', label: 'Mensual' },
  ];
  readonly selected = signal('Diario');
  readonly tokenRows = SEGMENTED_TOKENS;

  readonly codeSnippet = signal(`import { SegmentedControlComponent } from '@coherence/ui';

<afi-segmented-control
  [options]="['Diario', 'Semanal', 'Mensual']"
  [value]="selected()"
  (valueChange)="selected.set($event)"
/>`);
}
