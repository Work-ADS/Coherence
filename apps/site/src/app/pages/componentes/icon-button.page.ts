import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { IconButtonComponent } from '@coherence/ui';
import type { IconButtonVariant, IconButtonSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const ICON_BUTTON_TOKENS: TokenRow[] = [
  { property: 'Fondo (ghost)', token: 'transparent' },
  { property: 'Fondo (subtle)', token: 'var(--neutral-100)' },
  { property: 'Fondo (outline)', token: 'transparent' },
  { property: 'Borde (outline)', token: 'var(--border-default)' },
  { property: 'Radio', token: 'var(--radius-md)' },
];

@Component({
  selector: 'app-icon-button-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    IconButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Icon Button"
      subtitle="Botón con icono para acciones compactas sin etiqueta de texto."
      docsSource="libs/ui/src/icon-button/"
      buildPromptSlug="coherence-icon-button"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview" class="flex items-center gap-space-4">
            @for (v of variants; track v) {
              <afi-icon-button [variant]="v" [size]="size()" icon="pencil" [ariaLabel]="v" />
            }
          </div>
        </afi-component-playground>

        <section>
          <h2 id="sizes" class="text-section text-canvas-fg mb-space-6">Tamaños</h2>
          <div class="flex items-center gap-space-4">
            @for (s of sizes; track s) {
              <afi-icon-button variant="outline" [size]="s" icon="pencil" [ariaLabel]="s" />
            }
          </div>
        </section>

        <section>
          <h2 id="tokens" class="text-section text-canvas-fg mb-space-6">Tokens consumidos</h2>
          <afi-tokens-table [rows]="tokenRows" title="" />
        </section>
      </div>
    </afi-doc-page-layout>
  `,
})
export class IconButtonPage {
  readonly variant = signal<IconButtonVariant>('ghost');
  readonly size = signal<IconButtonSize>('md');

  readonly variants: IconButtonVariant[] = ['ghost', 'subtle', 'outline'];
  readonly sizes: IconButtonSize[] = ['sm', 'md', 'lg'];
  readonly tokenRows = ICON_BUTTON_TOKENS;

  readonly codeSnippet = signal(`import { IconButtonComponent } from '@coherence/ui';

<afi-icon-button
  variant="ghost"
  size="md"
  icon="pencil"
  ariaLabel="Editar"
/>`);
}
