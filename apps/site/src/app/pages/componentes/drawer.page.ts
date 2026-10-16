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
    { property: 'Scrim', token: '--overlay-blanket-drawer' },
    { property: 'Scrim blur', token: '--overlay-blur' },
    { property: 'Surface', token: '--overlay-modal' },
    { property: 'Border', token: '--border-subtle' },
    { property: 'Shadow', token: '--elevation-xl' },
    { property: 'Radius', token: '--radius-modal' },
    { property: 'Title', token: '--type-body-lg-600' },
    { property: 'Layer (scrim / panel)', token: '--z-drawer / --drawer-panel-z' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'Frame inset', token: '--layout-shell-inset' },
    { property: 'sm width', token: '--drawer-width-sm' },
    { property: 'md width', token: '--drawer-width-md' },
    { property: 'wide left offset', token: '--drawer-wide-offset' },
    { property: 'Button size', token: '--drawer-button-size' },
    { property: 'Header / body padding', token: '--space-lg' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'wide', label: 'wide' },
];

const NAV_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'Row nav' },
];

const SCRIM_OPTIONS = [
  { value: 'on', label: 'Scrim' },
  { value: 'off', label: 'No scrim' },
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
  readonly size = signal<DrawerSize>('sm');
  readonly nav = signal<'on' | 'off'>('off');
  readonly scrim = signal<'on' | 'off'>('on');
  readonly row = signal(2);
  readonly open = signal(false);

  readonly sizeOptions = SIZE_OPTIONS;
  readonly navOptions = NAV_OPTIONS;
  readonly scrimOptions = SCRIM_OPTIONS;
  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];

  openDrawer(): void {
    this.open.set(true);
  }

  closeDrawer(): void {
    this.open.set(false);
  }
}
