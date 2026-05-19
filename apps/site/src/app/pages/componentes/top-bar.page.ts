import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { TopBarComponent } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const TOP_BAR_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--canvas-bg)' },
  { property: 'Borde inferior', token: 'var(--border-hairline)' },
  { property: 'Altura', token: 'h-14' },
  { property: 'Padding horizontal', token: 'var(--space-4)' },
  { property: 'Z-index', token: 'var(--z-sticky)' },
];

@Component({
  selector: 'app-top-bar-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    TopBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Top Bar"
      subtitle="Barra superior de navegación con slots para logo, acciones y búsqueda."
      docsSource="libs/ui/src/top-bar/"
      buildPromptSlug="coherence-top-bar"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview" class="w-full border border-border-hairline rounded-lg overflow-hidden">
            <afi-top-bar>
              <span slot="start" class="font-semibold">Logo</span>
              <span slot="end" class="text-body-sm text-neutral-500">Acciones</span>
            </afi-top-bar>
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
export class TopBarPage {
  readonly tokenRows = TOP_BAR_TOKENS;

  readonly codeSnippet = signal(`import { TopBarComponent } from '@coherence/ui';

<afi-top-bar>
  <img slot="start" src="logo.svg" alt="Logo" />
  <afi-icon-button slot="end" icon="bell" ariaLabel="Notificaciones" />
</afi-top-bar>`);
}
