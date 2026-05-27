import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';

import { ButtonComponent, IconButtonComponent } from '@coherence/ui';

import { HandoffInspectService } from '../../services/handoff-inspect.service';

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

/**
 * Flat-handoff popover — renders the single line the AFI team agreed on
 * 2026-05-22: `{component-token-name}: {hex}` + Copy button.
 *
 * The component-token-name is synthesized from the active component
 * context (set by the page) and the clicked property's slot, NOT from
 * the DS's internal `--brand-*` token. This is intentional: the team's
 * mental model is a flat per-client file with consistent names; the DS's
 * three-layer architecture is an implementation detail behind that
 * facade. Without context the popover falls back to the raw token name.
 *
 * Sibling of the demo-shell's full-chain inspector — different consumer,
 * different render. Same underlying `InspectService` powers both.
 */
@Component({
  selector: 'site-handoff-popover',
  standalone: true,
  imports: [ButtonComponent, IconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './handoff-popover.component.html',
  styleUrl: './handoff-popover.component.scss',
})
export class HandoffPopoverComponent {
  protected readonly svc = inject(HandoffInspectService);

  protected readonly copied = signal(false);

  protected readonly line = computed(() => {
    const a = this.svc.active();
    if (!a) return '';
    const name = this.composeName(a.token.property);
    const value = a.token.hex ?? a.token.property;
    return `${name}: ${value}`;
  });

  protected readonly styleVars = computed(() => {
    const a = this.svc.active();
    if (!a) return null;
    return {
      '--handoff-popover-x': `${a.x}px`,
      '--handoff-popover-y': `${a.y}px`,
    } as Record<string, string>;
  });

  protected async onCopy(): Promise<void> {
    const line = this.line();
    if (!line) return;
    try {
      await navigator.clipboard.writeText(line);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // Clipboard API unavailable or permission denied — silent fail.
    }
  }

  protected onDismiss(): void {
    this.svc.dismiss();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.svc.active()) this.svc.dismiss();
  }

  /**
   * Build the team-style flat-output name from the active component
   * context + the clicked CSS property. Examples:
   *   { name: 'button', variant: 'primary' }, background-color → 'button-primary-background'
   *   { name: 'button', variant: 'primary' }, color            → 'button-primary-foreground'
   *   { name: 'card' },                       background-color → 'card-background'
   *
   * Fallback: if no context registered (page didn't set it), surface the
   * raw token name from the DS chain — better to show *something* than
   * fabricate an invented component name from thin air.
   */
  private composeName(property: string): string {
    const context = this.svc.context();
    const slot = SLOT_BY_PROPERTY[property] ?? property;
    if (!context) {
      const active = this.svc.active();
      return active?.token.token ?? property;
    }
    return context.variant
      ? `${context.name}-${context.variant}-${slot}`
      : `${context.name}-${slot}`;
  }
}
