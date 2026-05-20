import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SegmentedControlComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell/doc-page-shell.component';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

@Component({
  selector: 'app-filter-chip-page',
  standalone: true,
  imports: [
    RouterLink,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-chip.page.html',
  styleUrl: './filter-chip.page.scss',
})
export class FilterChipPage {
  /* ── Preview state ── */
  protected readonly filters = signal([
    { label: 'Tipo', active: false },
    { label: 'Estado', active: true },
    { label: 'Fecha', active: false },
    { label: 'Importe', active: false },
  ]);

  protected toggleFilter(index: number): void {
    this.filters.update((arr) =>
      arr.map((f, i) => (i === index ? { ...f, active: !f.active } : f)),
    );
  }

  /* ── Tokens ── */
  protected readonly tokenCategories: DocTokenCategory[] = [
    {
      value: 'color',
      label: 'Color',
      rows: [
        { property: 'Background (inactive)', token: '--filter-chip-bg-default', semantic: '--surface-default', primitive: 'white-0' },
        { property: 'Background (active)', token: '--filter-chip-bg-active', semantic: '--brand-secondary-neutral-background-default', primitive: 'control-100' },
        { property: 'Border', token: '--filter-chip-border', semantic: '--border-default', primitive: 'control-200' },
        { property: 'Text (inactive)', token: '--filter-chip-fg-default', semantic: '--foreground-secondary-default', primitive: 'control-600' },
        { property: 'Text (active)', token: '--filter-chip-fg-active', semantic: '--foreground-primary-default', primitive: 'control-900' },
      ],
    },
    {
      value: 'sizing',
      label: 'Sizing',
      rows: [
        { property: 'Height', token: '--filter-chip-height', semantic: '--dimension-7', primitive: '28px' },
        { property: 'Padding inline', token: '--filter-chip-padding-x', semantic: '--space-sm', primitive: '12px' },
        { property: 'Gap', token: '--filter-chip-gap', semantic: '--space-xs', primitive: '8px' },
        { property: 'Border radius', token: '--filter-chip-radius', semantic: '--radius-pill', primitive: '9999px' },
        { property: 'Icon size', token: '--filter-chip-icon-size', semantic: '--icon-xs', primitive: '12px' },
      ],
    },
  ];
}
