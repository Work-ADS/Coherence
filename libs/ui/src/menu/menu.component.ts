import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

import { FloatingPanel, onOverlayEscape } from '../floating-panel';
import type { FloatingAlign, FloatingSide } from '../floating-panel';
import type { MenuPlacement } from './menu.variants';

const PLACEMENT: Record<MenuPlacement, { side: FloatingSide; align: FloatingAlign }> = {
  'bottom-start': { side: 'bottom', align: 'start' },
  'bottom-end': { side: 'bottom', align: 'end' },
  'top-start': { side: 'top', align: 'start' },
  'top-end': { side: 'top', align: 'end' },
  'right-start': { side: 'right', align: 'start' },
  'left-start': { side: 'left', align: 'start' },
};

/**
 * Contextual action menu overlay.
 *
 * The panel is portalled and positioned by `FloatingPanel` (to the open dialog
 * or `<body>`, fixed, flipped and clamped to the viewport, following scroll),
 * so no scroll container or transformed ancestor can clip or move it.
 *
 * **Anchor.** Pass `[anchor]="triggerElement"` (the element that opened it) so
 * the panel lines up with it and a click on the trigger toggles instead of
 * dismissing and reopening. Without `anchor` the panel sits against the menu
 * host, and the element just before the menu counts as the trigger.
 *
 * Keyboard: opens with focus on the first enabled row; arrows wrap, Home/End,
 * Enter/Space activate the row, Tab dismisses. Escape closes only this menu
 * (a dialog or drawer behind it stays open) and focus returns to the opener.
 */
@Component({
  selector: 'afi-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnDestroy {
  readonly open = input<boolean>(false);
  readonly placement = input<MenuPlacement>('bottom-start');
  readonly ariaLabel = input<string>('Context menu');
  /** The element that opened the menu (pass the trigger button). */
  readonly anchor = input<HTMLElement | null>(null);
  /**
   * When true the panel is never narrower than the anchor. It can still grow
   * wider for long item labels.
   */
  readonly matchAnchorWidth = input<boolean>(false);

  readonly openChange = output<boolean>();
  readonly dismissed = output<'escape' | 'click-outside' | 'item-select'>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly panelRoot = viewChild<ElementRef<HTMLElement>>('panelRoot');
  private readonly floating = new FloatingPanel();
  private disposeEscape: (() => void) | null = null;
  private opener: HTMLElement | null = null;
  private shown = false;

  readonly panelClasses = computed(() => {
    const parts = ['menu__panel', `placement-${this.placement()}`];
    if (this.matchAnchorWidth()) parts.push('menu__panel--match');
    return parts.join(' ');
  });

  constructor() {
    effect(() => {
      const panel = this.panelRoot()?.nativeElement;
      if (!panel) {
        this.release();
        return;
      }
      const { side, align } = PLACEMENT[this.placement()];
      const anchor = this.anchor() ?? this.host;
      this.floating.attach(panel, anchor, { side, align, onOutside: (event) => this.onOutside(event) });
      this.disposeEscape ??= onOverlayEscape(() => this.dismiss('escape'));
      if (!this.shown) {
        this.shown = true;
        this.opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        this.enabledRows(panel)[0]?.focus();
      }
    });
  }

  ngOnDestroy(): void {
    this.release();
  }

  dismiss(reason: 'escape' | 'click-outside' | 'item-select'): void {
    this.openChange.emit(false);
    this.dismissed.emit(reason);
  }

  onKeydown(event: KeyboardEvent): void {
    const rows = this.enabledRows(event.currentTarget as HTMLElement);
    if (!rows.length) return;
    const current = rows.indexOf(document.activeElement as HTMLElement);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = current < rows.length - 1 ? current + 1 : 0;
        break;
      case 'ArrowUp':
        next = current > 0 ? current - 1 : rows.length - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = rows.length - 1;
        break;
      case 'Tab':
        this.dismiss('escape');
        return;
      default:
        return;
    }
    event.preventDefault();
    rows[next]?.focus();
  }

  // The trigger is not "outside": its own click toggles the menu, and dismissing
  // on mousedown would reopen it. Without an anchor the trigger is taken to be the
  // element just before the menu.
  private onOutside(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!this.anchor() && target && this.host.previousElementSibling?.contains(target)) return;
    this.dismiss('click-outside');
  }

  private enabledRows(panel: HTMLElement): HTMLElement[] {
    return Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
  }

  private release(): void {
    const panel = this.panelRoot()?.nativeElement;
    // Focus that was inside the panel is lost when it goes; hand it back.
    const hadFocus = !!panel && panel.contains(document.activeElement);
    this.floating.detach();
    this.disposeEscape?.();
    this.disposeEscape = null;
    if (this.shown) {
      this.shown = false;
      if ((hadFocus || document.activeElement === document.body) && this.opener?.isConnected) {
        this.opener.focus();
      }
      this.opener = null;
    }
  }
}
