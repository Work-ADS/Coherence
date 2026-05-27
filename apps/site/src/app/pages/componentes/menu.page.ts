import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  MenuComponent,
  MenuItemComponent,
  ButtonComponent,
  SegmentedControlComponent,
  KbdComponent,
} from '@coherence/ui';
import type { MenuPlacement } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const TOKEN_CATEGORIES: DocTokenCategory[] = [
  {
    value: 'visual',
    label: 'Visual',
    rows: [
      { property: 'Background', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
      { property: 'Border', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
      { property: 'Shadow', token: '--shadow-lg', semantic: '--shadow-lg', primitive: '0 10px 15px rgba(0,0,0,0.10)' },
      { property: 'Item hover', token: '--surface-subtle', semantic: '--surface-subtle', primitive: '--color-afi-control-50' },
      { property: 'Item active', token: '--surface-muted', semantic: '--surface-muted', primitive: '--color-afi-control-100' },
      { property: 'Item text', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
      { property: 'Danger item text', token: '--feedback-error-foreground', semantic: '--feedback-error-foreground', primitive: '--color-error-700' },
      { property: 'Border radius', token: '--radius-lg', semantic: '--radius-lg', primitive: '12px' },
    ],
  },
  {
    value: 'sizing',
    label: 'Sizing',
    rows: [
      { property: 'Padding (panel)', token: '--space-xs', semantic: '--space-xs', primitive: '8px' },
      { property: 'Item height', token: '--control-h-sm', semantic: '--control-h-sm', primitive: '32px' },
      { property: 'Item padding', token: '--space-sm', semantic: '--space-sm', primitive: '12px' },
    ],
  },
];

const PLACEMENT_OPTIONS = [
  { value: 'bottom-start', label: 'Bottom · start' },
  { value: 'bottom-end', label: 'Bottom · end' },
  { value: 'top-start', label: 'Top · start' },
  { value: 'top-end', label: 'Top · end' },
];

@Component({
  selector: 'site-menu-page',
  standalone: true,
  imports: [
    RouterLink,
    MenuComponent,
    MenuItemComponent,
    ButtonComponent,
    SegmentedControlComponent,
    KbdComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.page.html',
  styleUrl: './menu.page.scss',
})
export class MenuPage {
  readonly placement = signal<MenuPlacement>('bottom-start');
  readonly open = signal(false);

  readonly placementOptions = PLACEMENT_OPTIONS;
  readonly tokenCategories = TOKEN_CATEGORIES;

  toggle(): void {
    this.open.set(!this.open());
  }

  close(): void {
    this.open.set(false);
  }
}
