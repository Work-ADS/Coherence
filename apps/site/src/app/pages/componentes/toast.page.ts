import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastComponent, ButtonComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

@Component({
  selector: 'app-toast-page',
  standalone: true,
  imports: [
    RouterLink,
    ToastComponent,
    ButtonComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.page.html',
  styleUrl: './toast.page.scss',
})
export class ToastPage {
  readonly toastVisible = signal(false);
  readonly toastMessage = signal('Planificación renombrada correctamente');

  readonly tokenCategories: DocTokenCategory[] = [
    {
      value: 'visual',
      label: 'Visual',
      rows: [
        { property: 'Background', token: '--color-neutral-900' },
        { property: 'Text color', token: '--color-base-white' },
        { property: 'Border radius', token: '--radius-full' },
        { property: 'Height', token: '--dim-40' },
        { property: 'Shadow', token: '--elevation-2' },
      ],
    },
    {
      value: 'motion',
      label: 'Motion',
      rows: [
        { property: 'Enter animation', token: '--duration-normal' },
        { property: 'Easing', token: '--easing-enter' },
        { property: 'Hover transition', token: '--duration-fast' },
      ],
    },
  ];

  showToast(): void {
    this.toastVisible.set(true);
    setTimeout(() => this.toastVisible.set(false), 5000);
  }

  onUndo(): void {
    this.toastVisible.set(false);
  }

  onDismiss(): void {
    this.toastVisible.set(false);
  }
}
