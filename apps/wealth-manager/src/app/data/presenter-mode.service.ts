import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'awm-propuestas.presenter-mode';

@Injectable({ providedIn: 'root' })
export class PresenterModeService {
  readonly active = signal(this.readStored());

  toggle(): void {
    const next = !this.active();
    this.active.set(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    this.emit(next);
  }

  private readStored(): boolean {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'false');
    } catch {
      return false;
    }
  }

  private emit(state: boolean): void {
    console.info('[telemetry] propuestas.presenter-mode.toggled', { state, timestamp: new Date().toISOString() });
  }
}
