import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InlineEditComponent, TooltipComponent, ToastComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

@Component({
  selector: 'app-inline-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    InlineEditComponent,
    TooltipComponent,
    ToastComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inline-edit.page.html',
  styleUrl: './inline-edit.page.scss',
})
export class InlineEditPage {
  readonly planName = signal('Mi planificación patrimonial');
  readonly toastVisible = signal(false);
  readonly toastMessage = signal('');

  readonly tokenCategories: DocTokenCategory[] = [
    {
      value: 'visual',
      label: 'Visual',
      rows: [
        { property: 'Trigger background (hover)', token: '--surface-secondary-default' },
        { property: 'Input border', token: '--border-hairline' },
        { property: 'Focus ring', token: '--border-focus' },
        { property: 'Text', token: '--foreground-primary-default' },
        { property: 'Icon color', token: '--foreground-tertiary-default' },
        { property: 'Border radius', token: '--radius-control' },
      ],
    },
    {
      value: 'sizing',
      label: 'Sizing',
      rows: [
        { property: 'Input height', token: '--control-h-sm' },
        { property: 'Icon size', token: '--dim-16' },
        { property: 'Gap', token: '--space-2xs' },
      ],
    },
  ];

  onCommit(newValue: string): void {
    this.planName.set(newValue);
    this.toastMessage.set(`Renombrado a "${newValue}"`);
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 5000);
  }

  onUndo(): void {
    this.toastVisible.set(false);
  }
}
