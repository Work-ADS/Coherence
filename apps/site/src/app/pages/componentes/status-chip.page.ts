import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatusChipComponent, SegmentedControlComponent } from '@coherence/ui';
import type { Estado, StatusChipSize, StatusChipVariant } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell/doc-page-shell.component';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

@Component({
  selector: 'app-status-chip-page',
  standalone: true,
  imports: [
    RouterLink,
    StatusChipComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-chip.page.html',
  styleUrl: './status-chip.page.scss',
})
export class StatusChipPage {
  /* ── Controls ── */
  protected readonly estadoOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'aprobada', label: 'Aprobada' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'rechazada', label: 'Rechazada' },
    { value: 'ejecutada', label: 'Ejecutada' },
  ];
  protected readonly variantOptions = [
    { value: 'subtle', label: 'Subtle' },
    { value: 'solid', label: 'Solid' },
  ];
  protected readonly sizeOptions = [
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
  ];
  protected readonly interactiveOptions = [
    { value: 'false', label: 'Static' },
    { value: 'true', label: 'Interactive' },
  ];

  protected readonly estado = signal<Estado>('borrador');
  protected readonly variant = signal<StatusChipVariant>('subtle');
  protected readonly size = signal<StatusChipSize>('md');
  protected readonly interactiveStr = signal('true');

  protected readonly interactive = computed(() => this.interactiveStr() === 'true');

  /* ── Tokens ── */
  protected readonly tokenCategories: DocTokenCategory[] = [
    {
      value: 'color',
      label: 'Color',
      rows: [
        { property: 'Background (subtle)', token: '--status-{estado}-bg', semantic: 'feedback-*-background', primitive: 'color-*-50' },
        { property: 'Text (subtle)', token: '--status-{estado}-fg', semantic: 'feedback-*-foreground', primitive: 'color-*-700' },
        { property: 'Background (solid)', token: '--status-{estado}-dot', semantic: 'color-*-500', primitive: 'color-*-500' },
        { property: 'Dot color', token: '--status-{estado}-dot', semantic: 'color-*-500', primitive: 'color-*-500' },
      ],
    },
    {
      value: 'sizing',
      label: 'Sizing',
      rows: [
        { property: 'Height (sm)', token: '--status-chip-height-sm', semantic: '--dimension-5', primitive: '20px' },
        { property: 'Height (md)', token: '--status-chip-height-md', semantic: '--dimension-6', primitive: '24px' },
        { property: 'Padding inline', token: '--status-chip-padding-x', semantic: '--space-xs', primitive: '8px' },
        { property: 'Dot size', token: '--status-chip-dot-size', semantic: '--space-2xs', primitive: '4px' },
        { property: 'Chevron size', token: '--status-chip-chevron-size', semantic: '--icon-sm', primitive: '16px' },
        { property: 'Border radius', token: '--status-chip-radius', semantic: '--radius-pill', primitive: '9999px' },
      ],
    },
  ];

  protected onTriggered(): void {
    const cycle: Estado[] = ['borrador', 'aprobada', 'pendiente', 'rechazada'];
    const idx = cycle.indexOf(this.estado());
    this.estado.set(cycle[(idx + 1) % cycle.length] as Estado);
  }
}
