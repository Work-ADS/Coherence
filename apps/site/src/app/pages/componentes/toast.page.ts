import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ToastComponent } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const TOAST_TOKENS: TokenRow[] = [
  { property: 'Fondo', token: 'var(--canvas-bg)' },
  { property: 'Borde', token: 'var(--border-hairline)' },
  { property: 'Sombra', token: 'var(--shadow-lg)' },
  { property: 'Radio', token: 'var(--radius-lg)' },
  { property: 'Duración animación', token: 'var(--duration-normal)' },
];

@Component({
  selector: 'app-toast-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    ToastComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Toast"
      subtitle="Notificación temporal no intrusiva para feedback del sistema."
      docsSource="libs/ui/src/toast/"
      buildPromptSlug="coherence-toast"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview" class="space-y-space-3">
            <afi-toast intent="success" message="Guardado correctamente" />
            <afi-toast intent="error" message="Error al guardar" />
            <afi-toast intent="info" message="Procesando solicitud" />
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
export class ToastPage {
  readonly tokenRows = TOAST_TOKENS;

  readonly codeSnippet = signal(`import { ToastComponent } from '@coherence/ui';

<afi-toast
  intent="success"
  message="Guardado correctamente"
  [duration]="4000"
/>`);
}
