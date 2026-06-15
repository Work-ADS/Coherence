import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { KbdComponent } from '../kbd';

/**
 * Toast — dark pill notification with optional undo action.
 *
 * Stateless: parent owns visibility + auto-dismiss timer.
 * Animates in from below, fades out. ARIA live region for screen readers.
 *
 * `shortcut` renders an inline `<afi-kbd>` chip next to the Deshacer label
 * (e.g. `['⌘', 'Z']`). Display-only — the actual key binding lives in the
 * consumer. Empty array (default) hides the chip.
 */
@Component({
  selector: 'afi-toast',
  standalone: true,
  imports: [KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  readonly message = input<string>('');
  readonly undoLabel = input<string>('Deshacer');
  readonly visible = input<boolean>(false);
  readonly showUndo = input<boolean>(true);
  readonly shortcut = input<string[]>([]);

  readonly undo = output<void>();
  readonly dismissed = output<void>();
}
