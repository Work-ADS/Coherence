import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AvatarComponent } from '@coherence/ui';
import type { AvatarSize } from '@coherence/ui';

import { DocPageLayoutComponent } from '../../components/doc-page-layout';
import { ComponentPlaygroundComponent } from '../../components/component-playground';
import { CodeBlockComponent } from '../../components/code-block';
import { TokensTableComponent, type TokenRow } from '../../components/tokens-table';

const AVATAR_TOKENS: TokenRow[] = [
  { property: 'Tamaño (sm)', token: 'w-6 h-6' },
  { property: 'Tamaño (md)', token: 'w-8 h-8' },
  { property: 'Tamaño (lg)', token: 'w-10 h-10' },
  { property: 'Radio', token: 'rounded-full' },
  { property: 'Fondo fallback', token: 'var(--neutral-200)' },
];

@Component({
  selector: 'app-avatar-page',
  standalone: true,
  imports: [
    DocPageLayoutComponent,
    ComponentPlaygroundComponent,
    CodeBlockComponent,
    TokensTableComponent,
    AvatarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-doc-page-layout
      kicker="COMPONENTS"
      title="Avatar"
      subtitle="Representación visual circular de un usuario o entidad."
      docsSource="libs/ui/src/avatar/"
      buildPromptSlug="coherence-avatar"
    >
      <div slot="code-tab">
        <afi-component-playground [code]="codeSnippet()">
          <div slot="preview" class="flex items-center gap-space-4">
            @for (s of sizes; track s) {
              <afi-avatar [size]="s" name="Ana López" />
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
export class AvatarPage {
  readonly sizes: AvatarSize[] = ['sm', 'md', 'lg'];
  readonly tokenRows = AVATAR_TOKENS;

  readonly codeSnippet = signal(`import { AvatarComponent } from '@coherence/ui';

<afi-avatar
  size="md"
  name="Ana López"
  src="https://i.pravatar.cc/40"
/>`);
}
