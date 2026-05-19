import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { TooltipComponent } from '@coherence/ui';
import type { TooltipPosition } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const TOOLTIP_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--neutral-900)' },
  { property: 'Texto', token: 'var(--neutral-50)' },
  { property: 'Radio', token: 'var(--radius-sm)' },
  { property: 'Padding', token: 'var(--space-1) var(--space-2)' },
  { property: 'Sombra', token: 'var(--shadow-md)' },
];

@Component({
  selector: 'app-tooltip-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    TooltipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Tooltip"
      subtitle="Información contextual que aparece al pasar el cursor sobre un elemento."
      docsSource="libs/ui/src/tooltip/"
      buildPromptSlug="coherence-tooltip"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview" class="flex items-center gap-space-8 py-space-8">
            @for (pos of positions; track pos) {
              <afi-tooltip [text]="'Tooltip ' + pos" [position]="pos">
                <button class="px-space-3 py-space-2 border border-border-default rounded-md text-body-sm">
                  {{ pos }}
                </button>
              </afi-tooltip>
            }
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
export class TooltipPage {
  readonly positions: TooltipPosition[] = ['top', 'right', 'bottom', 'left'];
  readonly tokenRows = TOOLTIP_TOKENS;

  readonly codeSnippet = signal(`import { TooltipComponent } from '@coherence/ui';

<afi-tooltip text="Guardar cambios" position="top">
  <button>Hover me</button>
</afi-tooltip>`);
}
