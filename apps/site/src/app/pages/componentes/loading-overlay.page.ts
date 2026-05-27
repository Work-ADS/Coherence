import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LoadingOverlayComponent,
  ButtonComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { LoadingOverlayVariant } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Backdrop (blocking)', token: '--overlay-backdrop-soft', semantic: '--overlay-backdrop-soft', primitive: 'rgba(255,255,255,0.65)' },
      { property: 'Spinner color', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
      { property: 'Line color', token: '--brand-secondary-background-default', semantic: '--brand-secondary-background-default', primitive: '--color-afi-azul-500' },
      { property: 'Message color', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
    ],
  },
];

const VARIANT_OPTIONS = [
  { value: 'quiet-spinner', label: 'Quiet spinner' },
  { value: 'line-reveal', label: 'Line reveal' },
];

@Component({
  selector: 'site-loading-overlay-page',
  standalone: true,
  imports: [
    RouterLink,
    LoadingOverlayComponent,
    ButtonComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loading-overlay.page.html',
  styleUrl: './loading-overlay.page.scss',
})
export class LoadingOverlayPage {
  readonly variant = signal<LoadingOverlayVariant>('quiet-spinner');
  readonly visible = signal(true);

  readonly variantOptions = VARIANT_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;

  toggle(): void {
    this.visible.set(!this.visible());
  }
}
