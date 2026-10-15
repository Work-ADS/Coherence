import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { FloatingPanel, onOverlayEscape } from '../floating-panel';
import { KbdComponent } from '../kbd';
import { TooltipPosition } from './tooltip.variants';

let nextId = 0;

/**
 * Tooltip — wraps any element and shows a label on hover/focus.
 *
 * Usage:
 *   <afi-tooltip text="Guardar cambios">
 *     <button>💾</button>
 *   </afi-tooltip>
 *
 *   <!-- With keyboard shortcut hint -->
 *   <afi-tooltip text="Renombrar" [shortcut]="['Enter']">
 *     <button>✏️</button>
 *   </afi-tooltip>
 *
 *   <!-- Help text: opens on click and tap too, wraps over several lines -->
 *   <afi-tooltip text="…" [openOnClick]="true" [multiline]="true" [maxWidth]="280">…</afi-tooltip>
 *
 * The bubble is portalled to <body> (or the open dialog) and positioned fixed,
 * so a scroll container around the trigger can neither clip it nor grow a
 * scrollbar because of it. It follows the trigger on scroll and flips at the
 * viewport edge. Escape closes an open tooltip and stops there, so a dialog or
 * drawer behind it stays open (see overlay-escape).
 */
@Component({
  selector: 'afi-tooltip',
  standalone: true,
  imports: [KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent implements OnDestroy {
  readonly text = input.required<string>();
  readonly position = input<TooltipPosition>('bottom');
  readonly disabled = input<boolean>(false);

  /** Keyboard shortcut keys to display via afi-kbd inside the tooltip. */
  readonly shortcut = input<string[] | null>(null);

  /** Delay in ms before showing on hover or focus. */
  readonly delayMs = input<number>(250);

  /** Also opens on click or tap. Focus alone misses a trigger that already has
   *  focus after Escape, browsers that do not focus buttons on click, and touch.
   *  Opens, never toggles, so a click after hover does not close it. */
  readonly openOnClick = input<boolean>(false);

  /** Wraps the bubble over several lines (help text) instead of one line. */
  readonly multiline = input<boolean>(false);

  /** Widest the bubble grows, as a pixel number or any CSS length. Default `--tooltip-max-width`. */
  readonly maxWidth = input<number | string | null>(null);

  private readonly anchorEl = viewChild<ElementRef<HTMLElement>>('anchorEl');
  private readonly bubbleEl = viewChild<ElementRef<HTMLElement>>('bubbleEl');

  private readonly visible = signal(false);
  private readonly dismissed = signal(false);
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly floating = new FloatingPanel();
  private disposeEscape: (() => void) | null = null;

  readonly tooltipId = `afi-tooltip-${nextId++}`;

  readonly popClass = computed(() => {
    const parts = ['tooltip__pop'];
    if (this.visible()) parts.push('tooltip__pop--in');
    if (this.multiline()) parts.push('tooltip__pop--multiline');
    return parts.join(' ');
  });

  readonly maxWidthStyle = computed(() => {
    const w = this.maxWidth();
    return w === null ? null : typeof w === 'number' ? `${w}px` : w;
  });

  constructor() {
    // After the template has applied `--in`, so the bubble has a size to place.
    afterRenderEffect(() => {
      const bubble = this.bubbleEl()?.nativeElement;
      const anchor = this.anchorEl()?.nativeElement;
      if (this.visible() && bubble && anchor) {
        this.floating.attach(bubble, anchor, { side: this.position(), align: 'center' });
        this.disposeEscape ??= onOverlayEscape(() => this.dismiss());
      } else {
        this.release();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.release();
  }

  onEnter(): void {
    this.dismissed.set(false);
    this.clearTimer();
    const delay = this.delayMs();
    if (delay <= 0) this.show();
    else this.showTimer = setTimeout(() => this.show(), delay);
  }

  onLeave(): void {
    this.clearTimer();
    this.visible.set(false);
  }

  onClick(): void {
    if (!this.openOnClick() || this.disabled()) return;
    this.dismissed.set(false);
    this.clearTimer();
    this.show();
  }

  private show(): void {
    if (this.disabled() || this.dismissed()) return;
    this.visible.set(true);
  }

  private dismiss(): void {
    this.dismissed.set(true);
    this.visible.set(false);
  }

  private clearTimer(): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    this.showTimer = null;
  }

  private release(): void {
    this.floating.detach();
    this.disposeEscape?.();
    this.disposeEscape = null;
  }
}
