import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';

import { ToastComponent } from './toast.component';
import { ActiveToast, ToastService } from './toast.service';

/**
 * Shows the toast held by `ToastService` and owns its timer. Render it once,
 * near the app root (outside any transformed container, so the toast's fixed
 * position is the viewport's).
 */
@Component({
  selector: 'afi-toast-host',
  standalone: true,
  imports: [ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.scss',
})
export class ToastHostComponent implements OnDestroy {
  protected readonly service = inject(ToastService);
  protected readonly toast = this.service.current;

  private timer: ReturnType<typeof setTimeout> | null = null;
  private remaining = 0;
  private startedAt = 0;

  constructor() {
    // A new toast (including one that replaces another) restarts the clock.
    effect(() => {
      const t = this.toast();
      this.clear();
      if (!t) return;
      this.remaining = t.duration;
      this.start(t.id);
    });
  }

  ngOnDestroy(): void {
    this.clear();
  }

  onAction(t: ActiveToast): void {
    t.onAction?.();
    this.service.dismiss(t.id);
  }

  /** Hover or focus holds the clock; leaving resumes with what was left. */
  onPaused(paused: boolean): void {
    const t = this.toast();
    if (!t) return;
    if (paused) {
      if (this.timer === null) return;
      this.remaining -= Date.now() - this.startedAt;
      this.clear();
    } else if (this.timer === null) {
      this.start(t.id);
    }
  }

  private start(id: number): void {
    this.startedAt = Date.now();
    this.timer = setTimeout(() => this.service.dismiss(id), Math.max(this.remaining, 0));
  }

  private clear(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }
}
