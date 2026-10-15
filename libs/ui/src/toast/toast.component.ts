import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { IconComponent } from '../icon';
import { KbdComponent } from '../kbd';

export type ToastTone = 'neutral' | 'success' | 'error';

/**
 * Toast — dark pill notification with one optional action.
 *
 * Stateless: parent owns visibility + auto-dismiss timer (or use `ToastService`
 * and `<afi-toast-host>`, which own both). Rises in from below. ARIA live
 * region for screen readers; Escape on the focused toast dismisses it.
 *
 * `shortcut` renders an inline `<afi-kbd>` chip next to the Deshacer label
 * (e.g. `['⌘', 'Z']`). Display-only — the actual key binding lives in the
 * consumer. Empty array (default) hides the chip.
 */
@Component({
  selector: 'afi-toast',
  standalone: true,
  imports: [IconComponent, KbdComponent],
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
  /** Leading glyph only; the surface stays neutral. `error` announces as an alert. */
  readonly tone = input<ToastTone>('neutral');

  readonly undo = output<void>();
  readonly dismissed = output<void>();
  /** True while the pointer or focus is on the toast, so an owner of the timer can hold it. */
  readonly paused = output<boolean>();
}
