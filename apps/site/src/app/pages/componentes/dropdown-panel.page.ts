import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DropdownPanelComponent } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const DROPDOWN_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--canvas-bg)' },
  { property: 'Borde', token: 'var(--border-hairline)' },
  { property: 'Sombra', token: 'var(--shadow-lg)' },
  { property: 'Radio', token: 'var(--radius-lg)' },
  { property: 'Padding', token: 'var(--space-2)' },
];

@Component({
  selector: 'app-dropdown-panel-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    DropdownPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Dropdown Panel"
      subtitle="Panel flotante para menús desplegables y contenido contextual."
      docsSource="libs/ui/src/dropdown-panel/"
      buildPromptSlug="coherence-dropdown-panel"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview" class="relative">
            <afi-dropdown-panel [open]="true">
              <div class="p-space-3 text-body-sm">Contenido del dropdown</div>
            </afi-dropdown-panel>
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
export class DropdownPanelPage {
  readonly tokenRows = DROPDOWN_TOKENS;

  readonly codeSnippet = signal(`import { DropdownPanelComponent } from '@coherence/ui';

<afi-dropdown-panel [open]="isOpen()">
  <button>Opción 1</button>
  <button>Opción 2</button>
</afi-dropdown-panel>`);
}
