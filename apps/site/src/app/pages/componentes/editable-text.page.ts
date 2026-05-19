import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { EditableTextComponent } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const EDITABLE_TOKENS: TokenRow[] = [
  { property: 'Borde hover', token: 'var(--border-default)' },
  { property: 'Fondo edición', token: 'var(--canvas-bg)' },
  { property: 'Outline focus', token: 'var(--action-500)' },
  { property: 'Texto', token: 'var(--canvas-fg)' },
  { property: 'Transición', token: 'var(--duration-fast) ease-out' },
];

@Component({
  selector: 'app-editable-text-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    EditableTextComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Editable Text"
      subtitle="Texto que se convierte en campo editable al hacer clic."
      docsSource="libs/ui/src/editable-text/"
      buildPromptSlug="coherence-editable-text"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview">
            <afi-editable-text
              [value]="text()"
              (committed)="text.set($event)"
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
export class EditableTextPage {
  readonly text = signal('Haz clic para editar');
  readonly tokenRows = EDITABLE_TOKENS;

  readonly codeSnippet = signal(`import { EditableTextComponent } from '@coherence/ui';

<afi-editable-text
  [value]="title()"
  (valueChange)="title.set($event)"
/>`);
}
