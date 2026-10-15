import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
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
 *   <afi-tooltip text="…" [openOnClick]="true" [multiline]="true">…</afi-tooltip>
 *
 * Escape closes an open tooltip and stops there, so a dialog or drawer behind
 * it stays open; with no tooltip showing, Escape passes through untouched.
 */
@Component({
  selector: 'afi-tooltip',
  standalone: true,
  imports: [KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
})
export class TooltipComponent {
  readonly text = input.required<string>();
  readonly position = input<TooltipPosition>('bottom');
  readonly disabled = input<boolean>(false);

  /** Keyboard shortcut keys to display via afi-kbd inside the tooltip. */
  readonly shortcut = input<string[] | null>(null);

  /** Delay in ms before showing the tooltip (CSS transition-delay). */
  readonly delayMs = input<number>(250);

  /** Also opens on click or tap. Focus alone misses a trigger that already has
   *  focus after Escape, browsers that do not focus buttons on click, and touch.
   *  Opens, never toggles, so a click after hover does not close it. */
  readonly openOnClick = input<boolean>(false);

  /** Wraps the bubble over several lines (help text) instead of one line. */
  readonly multiline = input<boolean>(false);

  private readonly engaged = signal(false);
  private readonly pinned = signal(false);
  private readonly dismissed = signal(false);

  readonly tooltipId = `afi-tooltip-${nextId++}`;

  readonly popClass = computed(() => {
    const parts = ['tooltip__pop', `tooltip__pop--${this.position()}`];
    if (this.multiline()) parts.push('tooltip__pop--multiline');
    return parts.join(' ');
  });

  readonly hostClasses = computed(() => {
    const parts = ['tooltip'];
    if (this.pinned()) parts.push('tooltip--open');
    if (this.dismissed()) parts.push('tooltip--dismissed');
    return parts.join(' ');
  });

  readonly delayStyle = computed(() => `${this.delayMs()}ms`);

  onEnter(): void {
    this.engaged.set(true);
    this.dismissed.set(false);
  }

  onLeave(): void {
    this.engaged.set(false);
    this.pinned.set(false);
  }

  onClick(): void {
    if (!this.openOnClick() || this.disabled()) return;
    this.dismissed.set(false);
    this.pinned.set(true);
  }

  onEscape(event: Event): void {
    if (this.disabled() || this.dismissed() || !(this.engaged() || this.pinned())) return;
    event.stopPropagation();
    this.pinned.set(false);
    this.dismissed.set(true);
  }
}
