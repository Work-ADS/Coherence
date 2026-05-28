import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import type { MenuPlacement } from './menu.variants';
import { MenuItemComponent } from './menu-item.component';

interface AnchoredCoords {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

/**
 * Contextual action menu overlay.
 *
 * Positions itself relative to a trigger element. Manages open state,
 * focus, keyboard navigation, and dismiss behavior.
 *
 * **Anchor mode** (added 2026-05-28): pass `[anchor]="triggerElement"`
 * and the panel switches to `position: fixed` with coordinates computed
 * from the anchor's `getBoundingClientRect()`. This escapes ancestor
 * `overflow: hidden / auto` clipping — required when the menu is rendered
 * inside a scrolling table (`<afi-table>`) or any container that would
 * otherwise crop the panel. On scroll/resize the menu auto-dismisses
 * (cheaper than re-anchoring; matches the Notion / Linear UX where a
 * menu disappears the moment the page moves).
 *
 * Without `anchor` set, the panel keeps the original `position: absolute`
 * behavior relative to the menu host — preserves every existing consumer.
 */
@Component({
  selector: 'afi-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './menu.component.scss',
  template: `
    @if (open()) {
      <!-- Backdrop for click-outside dismiss -->
      <div
        class="menu__backdrop"
        (click)="dismiss('click-outside')"
        aria-hidden="true">
      </div>

      <!-- Menu panel -->
      <div
        role="menu"
        [attr.aria-label]="ariaLabel()"
        aria-orientation="vertical"
        [class]="panelClasses()"
        [style.position]="anchor() ? 'fixed' : null"
        [style.top.px]="anchoredCoords()?.top ?? null"
        [style.left.px]="anchoredCoords()?.left ?? null"
        [style.right.px]="anchoredCoords()?.right ?? null"
        [style.bottom.px]="anchoredCoords()?.bottom ?? null"
        (keydown)="onKeydown($event)">
        <ng-content />
      </div>
    }
  `,
})
export class MenuComponent {
  readonly open = input<boolean>(false);
  readonly placement = input<MenuPlacement>('bottom-start');
  readonly ariaLabel = input<string>('Context menu');
  /**
   * Optional trigger element. When set, the menu switches to
   * `position: fixed` + JS-computed coordinates so it escapes any
   * ancestor overflow clipping. Pass the trigger button via a template
   * reference variable (`#triggerRef`) → `[anchor]="triggerRef"`.
   */
  readonly anchor = input<HTMLElement | null>(null);

  readonly openChange = output<boolean>();
  readonly dismissed = output<'escape' | 'click-outside' | 'item-select'>();

  private readonly items = contentChildren(MenuItemComponent, { descendants: true });
  private readonly focusedIndex = signal(-1);
  private readonly el = inject(ElementRef);
  private readonly doc = inject(DOCUMENT);

  /**
   * Coordinates for the panel when in anchor (fixed-position) mode.
   * Recomputed on every open() flip. Only the relevant pair of edges is
   * set per placement so the panel can size naturally.
   */
  private readonly anchorRect = signal<DOMRect | null>(null);

  readonly anchoredCoords = computed<AnchoredCoords | null>(() => {
    const a = this.anchor();
    if (!a) return null;
    const rect = this.anchorRect();
    if (!rect) return null;
    const gap = 4; // matches the original `margin-top: --space-2xs`
    switch (this.placement()) {
      case 'bottom-end':
        return {
          top: rect.bottom + gap,
          right: window.innerWidth - rect.right,
        };
      case 'bottom-start':
        return { top: rect.bottom + gap, left: rect.left };
      case 'top-end':
        return {
          bottom: window.innerHeight - rect.top + gap,
          right: window.innerWidth - rect.right,
        };
      case 'top-start':
        return { bottom: window.innerHeight - rect.top + gap, left: rect.left };
      case 'right-start':
        return { top: rect.top, left: rect.right + gap };
      case 'left-start':
        return { top: rect.top, right: window.innerWidth - rect.left + gap };
    }
  });

  readonly panelClasses = computed(() => {
    const base = `menu__panel placement-${this.placement()}`;
    return this.anchor() ? `${base} menu__panel--anchored` : base;
  });

  constructor() {
    // Whenever the menu opens with an anchor, sample the anchor's rect.
    // Closing clears the rect so the next open re-measures fresh.
    effect(() => {
      const isOpen = this.open();
      const a = this.anchor();
      if (isOpen && a) {
        this.anchorRect.set(a.getBoundingClientRect());
      } else {
        this.anchorRect.set(null);
      }
    });

    // Portal the panel + backdrop to `document.body` when anchored. Without
    // this, `position: fixed` is trapped by any transformed ancestor (e.g.
    // patrimonial's `.tab-panel { transform: translateX(...) }` animation
    // turns `.tab-panel` into the containing block for `fixed`). Yanking the
    // elements to `body` escapes the whole subtree.
    //
    // Runs as an afterRenderEffect so the @if-rendered panel exists in the
    // DOM before we move it. `@if` removes the element when open flips
    // false — Angular still owns the lifecycle, the body parent is just an
    // intermediate location.
    afterRenderEffect(() => {
      if (!this.open() || !this.anchor()) return;
      const host = this.el.nativeElement as HTMLElement;
      const panel = host.querySelector('.menu__panel') as HTMLElement | null;
      const backdrop = host.querySelector('.menu__backdrop') as HTMLElement | null;
      const body = this.doc.body;
      if (panel && panel.parentElement !== body) body.appendChild(panel);
      if (backdrop && backdrop.parentElement !== body) body.appendChild(backdrop);
    });
  }

  /**
   * Auto-dismiss on window scroll / resize when anchored — cheaper than
   * re-anchoring continuously, and matches the Notion / Linear UX.
   */
  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize')
  onWindowMove(event?: Event): void {
    if (!this.open() || !this.anchor()) return;
    // Ignore scroll events from inside the menu itself.
    const target = event?.target as HTMLElement | Document | null;
    if (target && 'closest' in target && target instanceof HTMLElement) {
      if (target.closest('.menu__panel')) return;
    }
    this.dismiss('click-outside');
  }

  dismiss(reason: 'escape' | 'click-outside' | 'item-select'): void {
    this.openChange.emit(false);
    this.dismissed.emit(reason);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.dismiss('escape');
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const itemList = this.items().filter(i => !i.disabled());
    if (!itemList.length) return;

    let idx = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        idx = idx < itemList.length - 1 ? idx + 1 : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        idx = idx > 0 ? idx - 1 : itemList.length - 1;
        break;
      case 'Home':
        event.preventDefault();
        idx = 0;
        break;
      case 'End':
        event.preventDefault();
        idx = itemList.length - 1;
        break;
      case 'Tab':
        this.dismiss('escape');
        return;
      default:
        return;
    }

    this.focusedIndex.set(idx);
    const el = this.el.nativeElement as HTMLElement;
    const buttons = el.querySelectorAll<HTMLElement>('afi-menu-item button:not([disabled])');
    buttons[idx]?.focus();
  }
}
