import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ToastComponent, ButtonComponent, ToastService } from '@coherence/ui';

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
  private readonly toasts = inject(ToastService);

  readonly toastVisible = signal(false);
  readonly toastMessage = signal('Planificación renombrada correctamente');

  readonly tokenCategories: DocTokenCategory[] = [
    {
      value: 'visual',
      label: 'Visual',
      rows: [
        { property: 'Background', token: '--toast-background' },
        { property: 'Text color', token: '--toast-foreground' },
        { property: 'Border radius', token: '--radius-pill' },
        { property: 'Height', token: '--toast-height' },
        { property: 'Shadow', token: '--elevation-lg' },
        { property: 'Layer', token: '--z-toast' },
      ],
    },
    {
      value: 'motion',
      label: 'Motion',
      rows: [
        { property: 'Enter animation', token: '--duration-fast' },
        { property: 'Easing', token: '--easing-enter' },
        { property: 'Hover transition', token: '--duration-fast' },
      ],
    },
  ];

  showServiceToast(): void {
    this.toasts.show('Coste de adquisición actualizado.', {
      actionLabel: 'Deshacer',
      onAction: () => this.toasts.show('Cambio deshecho.', { tone: 'success' }),
    });
  }

  showErrorToast(): void {
    this.toasts.show('No hemos podido guardar los cambios.', { tone: 'error' });
  }

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
