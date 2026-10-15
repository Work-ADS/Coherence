import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  TooltipComponent,
  SegmentedControlComponent,
  IconButtonComponent,
} from '@coherence/ui';
import type { TooltipPosition } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

@Component({
  selector: 'app-tooltip-page',
  standalone: true,
  imports: [
    RouterLink,
    TooltipComponent,
    SegmentedControlComponent,
    IconButtonComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.page.html',
  styleUrl: './tooltip.page.scss',
})
export class TooltipPage {
  readonly position = signal<TooltipPosition>('bottom');
  readonly showShortcut = signal(false);

  readonly positionOptions = [
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ];

  readonly tokenCategories: DocTokenCategory[] = [
    {
      value: 'visual',
      label: 'Visual',
      rows: [
        { property: 'Background', token: '--tooltip-background' },
        { property: 'Text color', token: '--tooltip-foreground' },
        { property: 'Border radius', token: '--radius-control' },
        { property: 'Shadow', token: '--elevation-lg' },
        { property: 'Padding block', token: '--space-2xs' },
        { property: 'Padding inline', token: '--space-xs' },
        { property: 'Gap to trigger', token: '--tooltip-gap' },
        { property: 'Max width', token: '--tooltip-max-width' },
      ],
    },
    {
      value: 'layer',
      label: 'Layer',
      rows: [
        { property: 'Stacking layer', token: '--z-tooltip' },
      ],
    },
    {
      value: 'motion',
      label: 'Motion',
      rows: [
        { property: 'Fade duration', token: '--duration-fast' },
        { property: 'Easing', token: '--easing-enter' },
      ],
    },
  ];

  toggleShortcut(): void {
    this.showShortcut.set(!this.showShortcut());
  }
}
