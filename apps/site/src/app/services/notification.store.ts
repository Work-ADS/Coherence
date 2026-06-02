import { Injectable, signal } from '@angular/core';

/**
 * NotificationStore — single-slot toast queue that survives a route
 * navigation. Used to surface a one-shot informational toast on the
 * destination page after a router.navigate from elsewhere.
 *
 * Listado → Nueva planificación queues "Información del cliente
 * prerellenada"; Familia consumes the message on init and shows it via
 * its existing <afi-toast>.
 *
 * Stays a single-slot queue intentionally — if multiple producers race,
 * later wins. No history, no per-route routing — destination decides
 * what to do with the pending message.
 */
@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly _pending = signal<string | null>(null);

  /** Read-only view for templates / effects. */
  readonly pending = this._pending.asReadonly();

  /** Set the next message to display. Overrides any previous unread message. */
  queue(message: string): void {
    this._pending.set(message);
  }

  /** Return the pending message (if any) and clear the slot. */
  consume(): string | null {
    const msg = this._pending();
    if (msg !== null) {
      this._pending.set(null);
    }
    return msg;
  }
}
