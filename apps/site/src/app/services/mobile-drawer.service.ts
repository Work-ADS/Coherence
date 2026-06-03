import { Injectable, signal } from '@angular/core';

/**
 * Mobile-drawer state shared between the planner-top-bar's hamburger
 * trigger and the planner-sidebar's off-canvas slide-in behavior. Both
 * inject this singleton — top-bar toggles, sidebar binds a host class.
 *
 * Lives only as long as the demo session — no persistence.
 */
@Injectable({ providedIn: 'root' })
export class MobileDrawerService {
  private readonly _open = signal<boolean>(false);

  readonly open = this._open.asReadonly();

  toggle(): void {
    this._open.update((v) => !v);
  }

  setOpen(value: boolean): void {
    this._open.set(value);
  }

  close(): void {
    this._open.set(false);
  }
}
