import { Injectable, signal } from '@angular/core';

import type { HandoffToken } from './inspect.service';

/**
 * Property → slot mapping for the team-style flat-output name.
 * Per May 22 the team writes names like `button-primary-background` —
 * a short slot suffix, NOT the literal CSS property.
 */
const SLOT_BY_PROPERTY: Record<string, string> = {
  'background-color': 'background',
  color: 'foreground',
  'border-color': 'border',
  'border-top-color': 'border',
  'border-right-color': 'border',
  'border-bottom-color': 'border',
  'border-left-color': 'border',
  'box-shadow': 'shadow',
};

export interface ActiveHandoff {
  token: HandoffToken;
  x: number;
  y: number;
}

/**
 * Component context the page registers so the popover can synthesize the
 * team-style flat-output name. Per May 22, the team wants
 * `button-primary-background: #0805d7` — a component-style name, not the
 * DS's raw `--brand-*` token (which is an implementation detail). The
 * page tells the service which component + variant is currently active;
 * the popover composes the name from `{name}-{variant}-{slot}`.
 */
export interface HandoffContext {
  /** Component name slug, e.g. 'button', 'card', 'status-chip'. */
  name: string;
  /** Active variant — 'primary', 'secondary', 'danger', etc. Omit if the component is variantless. */
  variant?: string;
}

/**
 * Handoff inspect mode — sibling of `InspectService.activeResult` flow.
 *
 * Holds the on/off toggle for "click any preview element to copy its
 * token line," plus the currently-displayed popover payload. Component
 * pages bind a click listener on their preview area that consults
 * `isActive()` and, when true, calls `show()` with the leaf token data.
 *
 * Why a service (not component-local state): the toggle lives in
 * `<site-brand-context-row>`, the popover lives elsewhere on the page,
 * and the click capture lives on the playground preview. Three siblings
 * coordinating one piece of state — a `providedIn: 'root'` signal-based
 * service is the simplest wiring.
 */
/** Transient record of the most recent click-to-copy on a component page. */
export interface LastCopied {
  /** Team-style flat name, e.g. `button-primary-background`. */
  name: string;
  /** Painted value (hex or raw). */
  value: string;
  /** The leaf token key (e.g. `--brand-secondary-background-default`) — used to highlight the matching row in Tokens consumidos. */
  tokenKey: string;
  /** Epoch ms — drives the auto-clear timer. */
  at: number;
}

@Injectable({ providedIn: 'root' })
export class HandoffInspectService {
  readonly isActive = signal(true);
  readonly active = signal<ActiveHandoff | null>(null);

  /**
   * Set by the component page when it mounts. Drives the popover's
   * team-style name synthesis. Cleared on page unmount so a stale context
   * never leaks to the next page.
   */
  readonly context = signal<HandoffContext | null>(null);

  /**
   * Most recent click-to-copy from a component page's preview. The shell
   * sets this on inspect click; brand-context-row reads it to show a
   * transient "Copiado: …" indicator; doc-tokens reads `tokenKey` to
   * highlight the matching row in the Tokens consumidos table.
   */
  readonly lastCopied = signal<LastCopied | null>(null);

  private clearTimer: ReturnType<typeof setTimeout> | null = null;

  toggle(): void {
    const next = !this.isActive();
    this.isActive.set(next);
    if (!next) this.active.set(null);
  }

  enable(): void {
    this.isActive.set(true);
  }

  disable(): void {
    this.isActive.set(false);
    this.active.set(null);
  }

  show(token: HandoffToken, x: number, y: number): void {
    this.active.set({ token, x, y });
  }

  dismiss(): void {
    this.active.set(null);
  }

  setContext(context: HandoffContext | null): void {
    this.context.set(context);
  }

  /**
   * Build the team-style flat-output name from the active component
   * context + the clicked CSS property. Returns the raw token key as a
   * fallback when no context is registered.
   */
  composeName(property: string, fallbackTokenKey: string): string {
    const context = this.context();
    const slot = SLOT_BY_PROPERTY[property] ?? property;
    if (!context) return fallbackTokenKey;
    return context.variant
      ? `${context.name}-${context.variant}-${slot}`
      : `${context.name}-${slot}`;
  }

  /**
   * Record a click-to-copy: synthesizes the team-style name, writes the
   * flat line to clipboard, and exposes the leaf token key so doc-tokens
   * can highlight the matching row. Auto-clears after 1.8s.
   */
  async copyLeaf(token: HandoffToken): Promise<void> {
    const name = this.composeName(token.property, token.token);
    const value = token.hex ?? token.property;
    const line = `${name}: ${value}`;
    try {
      await navigator.clipboard.writeText(line);
    } catch {
      // Clipboard unavailable — still surface the visual feedback.
    }
    this.lastCopied.set({ name, value, tokenKey: token.token, at: Date.now() });
    if (this.clearTimer) clearTimeout(this.clearTimer);
    this.clearTimer = setTimeout(() => {
      this.lastCopied.set(null);
      this.clearTimer = null;
    }, 1800);
  }
}
