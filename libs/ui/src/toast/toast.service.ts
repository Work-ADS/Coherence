import { Injectable, signal } from '@angular/core';

import type { ToastTone } from './toast.component';

export interface ToastOptions {
  /** One verb, shown as the underlined action: «Deshacer». Omit for no action. */
  actionLabel?: string;
  /** Runs on the action click; the toast then closes. */
  onAction?: () => void;
  /** Auto-dismiss delay in ms. Paused while the pointer or focus is on the toast. */
  duration?: number;
  /** Leading glyph only. `error` announces as an alert. */
  tone?: ToastTone;
}

export interface ActiveToast {
  readonly id: number;
  readonly message: string;
  readonly actionLabel: string | null;
  readonly onAction: (() => void) | null;
  readonly duration: number;
  readonly tone: ToastTone;
}

export const TOAST_DEFAULT_DURATION = 5000;

/**
 * Confirmation toasts, one per page: a new toast replaces the one showing
 * instead of stacking on it. Render `<afi-toast-host />` once near the app
 * root; it shows whatever this service holds and runs the timer.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;

  /** The toast showing now, or null. */
  readonly current = signal<ActiveToast | null>(null);

  /** Shows a toast and returns a function that dismisses that one (not a later one). */
  show(message: string, options: ToastOptions = {}): () => void {
    const id = ++this.seq;
    this.current.set({
      id,
      message,
      actionLabel: options.actionLabel ?? null,
      onAction: options.onAction ?? null,
      duration: options.duration ?? TOAST_DEFAULT_DURATION,
      tone: options.tone ?? 'neutral',
    });
    return () => this.dismiss(id);
  }

  /** Dismisses the toast with this id, or whichever is showing when no id is given. */
  dismiss(id?: number): void {
    const current = this.current();
    if (current && (id === undefined || current.id === id)) this.current.set(null);
  }
}
