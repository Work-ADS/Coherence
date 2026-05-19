import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * Toast — dark pill notification with optional undo action.
 *
 * Stateless: parent owns visibility + auto-dismiss timer.
 * Animates in from below, fades out. ARIA live region for screen readers.
 */
@Component({
  selector: 'afi-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  readonly message = input<string>('');
  readonly undoLabel = input<string>('Deshacer');
  readonly visible = input<boolean>(false);
  readonly showUndo = input<boolean>(true);

  readonly undo = output<void>();
  readonly dismissed = output<void>();
}
