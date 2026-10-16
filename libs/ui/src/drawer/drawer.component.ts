import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { focusField } from '../focus-field';
import { onOverlayEscape } from '../floating-panel';
import { IconComponent } from '../icon';
import type { DrawerSize } from './drawer.variants';

let nextId = 0;

/**
 * Right-side panel over the content: the shell for a side task (a record's
 * detail, a settings panel, a short form). Not a Modal: it does not demand a
 * decision, it sits beside the work it annotates.
 *
 * Floating frame (`--layout-shell-inset` on top, right and bottom, every corner
 * rounded) over a scrim that tints and blurs the page. `scrim` off leaves the
 * page unobscured (a tool drawer such as the feedback overlay) but a press on
 * the page still closes it.
 *
 * `role="dialog"` with `aria-modal="false"`. Focus lands on the panel itself
 * (a landing spot, no ring) unless `initialFocusRef` names a control inside, and
 * returns to `returnFocusRef`, else the opener. Escape closes only the topmost
 * layer: a Select or Tooltip open inside the drawer takes it first.
 *
 * Ours, not the zip's: row navigation (`position`, `navigated`) for the
 * row-detail pattern, and the `scrim` input.
 */
@Component({
  selector: 'afi-drawer',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent implements OnDestroy {
  readonly open = input<boolean>(false);
  /** `sm` (default), `md`, or `wide` (right of the sidebar column). `lg` is a deprecated alias of `md`. */
  readonly size = input<DrawerSize>('sm');
  readonly title = input<string | null>(null);
  readonly position = input<{ current: number; total: number } | null>(null);
  readonly closeOnEsc = input<boolean>(true);
  readonly closeOnOutsideClick = input<boolean>(true);
  /** Tints and blurs the page behind, and locks its scroll. Off for a tool drawer that sits beside live content. */
  readonly scrim = input<boolean>(true);
  readonly ariaLabel = input<string | null>(null);
  /** Where focus lands on open. Defaults to the panel. Must be inside the drawer. */
  readonly initialFocusRef = input<HTMLElement | ElementRef<HTMLElement> | null>(null);
  /** Where focus goes on close. Defaults to the element that had it when the drawer opened. */
  readonly returnFocusRef = input<HTMLElement | ElementRef<HTMLElement> | null>(null);

  readonly openChange = output<boolean>();
  readonly closed = output<'esc' | 'outside' | 'button'>();
  readonly navigated = output<'prev' | 'next'>();

  readonly titleId = `afi-drawer-title-${nextId++}`;

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  /** In the DOM: while open and for the length of the exit animation. */
  protected readonly rendered = signal(false);
  protected readonly leaving = signal(false);

  private leaveTimer: ReturnType<typeof setTimeout> | null = null;
  private opener: HTMLElement | null = null;
  private shown = false;
  private lockedScroll: string | null = null;
  private disposeEscape: (() => void) | null = null;

  protected readonly panelClasses = computed(() => {
    const size = this.size() === 'lg' ? 'md' : this.size();
    return `afi-drawer afi-drawer--${size}${this.leaving() ? ' afi-drawer--leaving' : ''}`;
  });

  constructor() {
    // Open: render. Close: play the exit, then drop the DOM.
    effect(() => {
      if (this.open()) {
        this.clearLeaveTimer();
        this.leaving.set(false);
        this.rendered.set(true);
      } else if (this.rendered() && !this.leaving()) {
        this.leaving.set(true);
        this.scheduleRemoval();
      }
    });

    // Focus in, lock scroll and listen for Escape while the panel is up; undo on the way out.
    effect(() => {
      const panel = this.panel()?.nativeElement;
      const active = !!panel && this.open();
      if (active && !this.shown) {
        this.shown = true;
        this.opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        if (this.scrim()) {
          this.lockedScroll = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
        }
        const target = this.resolve(this.initialFocusRef());
        this.focusInitial(panel, target);
        if (this.closeOnEsc()) this.disposeEscape = onOverlayEscape(() => this.onClose('esc'));
      } else if (!active && this.shown) {
        this.release();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearLeaveTimer();
    this.release();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.position()) return;
    // Row navigation by arrow, unless a field inside the drawer wants the key.
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.onNavigate('prev');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.onNavigate('next');
    }
  }

  onClose(reason: 'esc' | 'outside' | 'button'): void {
    this.openChange.emit(false);
    this.closed.emit(reason);
  }

  onOutsideClick(): void {
    if (this.closeOnOutsideClick()) this.onClose('outside');
  }

  onNavigate(direction: 'prev' | 'next'): void {
    const pos = this.position();
    if (!pos) return;
    if (direction === 'prev' && pos.current <= 1) return;
    if (direction === 'next' && pos.current >= pos.total) return;
    this.navigated.emit(direction);
  }

  /** Waits out the exit animation (none under reduced motion), then removes the panel. */
  private scheduleRemoval(): void {
    queueMicrotask(() => {
      const el = this.panel()?.nativeElement;
      const seconds = el ? parseFloat(getComputedStyle(el).animationDuration) || 0 : 0;
      this.clearLeaveTimer();
      this.leaveTimer = setTimeout(() => {
        this.leaveTimer = null;
        this.rendered.set(false);
        this.leaving.set(false);
      }, seconds * 1000);
    });
  }

  private clearLeaveTimer(): void {
    if (this.leaveTimer !== null) clearTimeout(this.leaveTimer);
    this.leaveTimer = null;
  }

  private release(): void {
    this.disposeEscape?.();
    this.disposeEscape = null;
    if (this.lockedScroll !== null) {
      document.body.style.overflow = this.lockedScroll;
      this.lockedScroll = null;
    }
    if (this.shown) {
      this.shown = false;
      const preferred = this.resolve(this.returnFocusRef());
      const back = this.usable(preferred) ? preferred : this.usable(this.opener) ? this.opener : null;
      back?.focus({ preventScroll: true });
      this.opener = null;
    }
  }

  /** Focus the named control (scrolled into the body, ringed in every input modality) or the panel. */
  private focusInitial(panel: HTMLElement, target: HTMLElement | null): void {
    const body = panel.querySelector<HTMLElement>('.afi-drawer__body');
    if (target && body?.contains(target) && focusField(target, { scroll: 'nearest', container: body })) return;
    (target && panel.contains(target) ? target : panel).focus({ preventScroll: true });
  }

  private resolve(ref: HTMLElement | ElementRef<HTMLElement> | null): HTMLElement | null {
    if (!ref) return null;
    return ref instanceof ElementRef ? ref.nativeElement : ref;
  }

  private usable(el: HTMLElement | null): el is HTMLElement {
    return !!el && el.isConnected && !(el as HTMLButtonElement).disabled && el !== document.body;
  }
}
