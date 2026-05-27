import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DrawerComponent,
  ButtonComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { DrawerSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Backdrop', token: '--overlay-backdrop', semantic: '--overlay-backdrop', primitive: 'rgba(0,0,0,0.5)' },
    { property: 'Surface', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Border (start edge)', token: '--border-hairline', semantic: '--border-hairline', primitive: '--color-afi-gris-200' },
    { property: 'Shadow', token: '--shadow-xl', semantic: '--shadow-xl', primitive: '0 20px 25px rgba(0,0,0,0.10)' },
    { property: 'Title color', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm width', token: '--dimension-drawer-sm', semantic: '--dimension-drawer-sm', primitive: '320px' },
    { property: 'md width', token: '--dimension-drawer-md', semantic: '--dimension-drawer-md', primitive: '480px' },
    { property: 'lg width', token: '--dimension-drawer-lg', semantic: '--dimension-drawer-lg', primitive: '640px' },
    { property: 'Header padding', token: '--space-lg', semantic: '--space-lg', primitive: '24px' },
    { property: 'Content padding', token: '--space-lg', semantic: '--space-lg', primitive: '24px' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

@Component({
  selector: 'site-drawer-page',
  standalone: true,
  imports: [
    RouterLink,
    DrawerComponent,
    ButtonComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawer.page.html',
  styleUrl: './drawer.page.scss',
})
export class DrawerPage {
  readonly size = signal<DrawerSize>('md');
  readonly open = signal(false);

  readonly sizeOptions = SIZE_OPTIONS;
  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];

  openDrawer(): void {
    this.open.set(true);
  }

  closeDrawer(): void {
    this.open.set(false);
  }
}
