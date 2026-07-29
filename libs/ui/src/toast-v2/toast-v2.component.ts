import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { KbdComponent } from '../kbd';
import type { ToastV2Placement } from './toast-v2.variants';

/**
 * Toast v2 — identity v2 (foundations-modern).
 *
 * The v2 successor of `afi-toast`: same anatomy and same contract, restyled onto
 * the modern semantic layer (inverse surface, IBM Plex Sans, control gaps,
 * motion tokens). Renders correctly only inside a `[data-foundation="modern"]`
 * scope.
 *
 * Anatomy, left to right: [undo action + optional keycap] · divider · message ·
 * divider · dismiss.
 *
 * Stateless by design — the parent owns visibility and the auto-dismiss timer,
 * so the same component serves a 5s undo toast and a sticky error. `shortcut`
 * renders an inline `<afi-kbd>` (e.g. `['⌘', 'Z']`); display-only, the binding
 * lives in the consumer.
 *
 * A11y: the pill is a `role="status"` / `aria-live="polite"` region, so the
 * message is announced without stealing focus. Both controls are real buttons
 * with explicit labels.
 */
@Component({
  selector: 'afi-toast-v2',
  standalone: true,
  imports: [KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-v2.component.html',
  styleUrls: ['./toast-v2.component.scss'],
})
export class ToastV2Component {
  readonly message = input<string>('');
  readonly undoLabel = input<string>('Deshacer');
  readonly visible = input<boolean>(false);
  readonly showUndo = input<boolean>(true);
  readonly shortcut = input<string[]>([]);
  readonly placement = input<ToastV2Placement>('bottom-center');
  /** Overrides the dismiss control's accessible name. */
  readonly dismissLabel = input<string>('Cerrar aviso');

  readonly undo = output<void>();
  readonly dismissed = output<void>();
}
