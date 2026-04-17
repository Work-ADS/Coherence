import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import type { SidebarMode } from './sidebar.variants';
import { sidebarWidths } from './sidebar.variants';

/**
 * Primary navigation sidebar.
 *
 * Three modes: static (always expanded), collapsible (toggle button),
 * hover-expand (default — expand on hover/focus, collapse on leave).
 * Pin support for hover-expand mode.
 */
@Component({
  selector: 'afi-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    <nav
      [attr.aria-label]="ariaLabel()"
      [attr.aria-expanded]="isExpanded() ? 'true' : 'false'"
      [style.width]="currentWidth()"
      class="h-full bg-surface-quiet border-r border-border-hairline flex flex-col transition-[width] duration-200 ease-out overflow-hidden shrink-0">

      <!-- Top slot (logo) -->
      <div class="h-16 flex items-center px-space-4 border-b border-border-hairline shrink-0">
        <ng-content select="[slot=top]" />
      </div>

      <!-- Pin / Toggle buttons -->
      @if (mode() === 'hover-expand' && isExpanded()) {
        <button
          type="button"
          class="absolute top-3 right-2 p-1 rounded hover:bg-surface-100 transition-colors duration-fast z-10"
          [attr.aria-label]="pinned() ? 'Desfijar barra lateral' : 'Fijar barra lateral'"
          (click)="togglePin()">
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
            [class.text-action]="pinned()"
            [class.text-neutral-400]="!pinned()">
            <path d="M10 2a.75.75 0 01.75.75v5.59l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06l3.22 3.22V2.75A.75.75 0 0110 2z" />
          </svg>
        </button>
      }

      @if (mode() === 'collapsible') {
        <button
          type="button"
          class="mx-space-2 mt-space-2 p-1 rounded hover:bg-surface-100 transition-colors duration-fast self-end"
          [attr.aria-label]="isExpanded() ? 'Ocultar navegación' : 'Mostrar navegación'"
          (click)="toggleCollapse()">
          <svg class="h-5 w-5 transition-transform duration-fast" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
            [class.rotate-180]="!isExpanded()">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
      }

      <!-- Nav items -->
      <div class="flex-1 overflow-y-auto py-space-2 px-space-2" role="list">
        <ng-content />
      </div>

      <!-- Bottom slot (user/settings) -->
      <div class="border-t border-border-hairline px-space-4 py-space-2 shrink-0">
        <ng-content select="[slot=bottom]" />
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    @media (prefers-reduced-motion: reduce) {
      nav {
        transition-duration: 0ms !important;
      }
    }
  `],
})
export class SidebarComponent {
  readonly mode = input<SidebarMode>('hover-expand');
  readonly expanded = input<boolean | null>(null);
  readonly pinned = input<boolean>(false);
  readonly ariaLabel = input<string>('Navegación principal');
  readonly width = input<{ collapsed: string; expanded: string }>(sidebarWidths);

  readonly expandedChange = output<boolean>();
  readonly pinnedChange = output<boolean>();

  /** Internal hover/focus state for hover-expand mode */
  private readonly hovered = signal(false);
  private readonly focused = signal(false);

  readonly isExpanded = computed(() => {
    // Manual override
    const manual = this.expanded();
    if (manual !== null) return manual;

    const m = this.mode();
    if (m === 'static') return true;
    if (m === 'collapsible') return this._collapsed() === false;
    // hover-expand
    if (this.pinned()) return true;
    return this.hovered() || this.focused();
  });

  readonly currentWidth = computed(() => {
    const w = this.width();
    return this.isExpanded() ? w.expanded : w.collapsed;
  });

  /** For collapsible mode internal state */
  private readonly _collapsed = signal(false);

  onMouseEnter(): void {
    if (this.mode() === 'hover-expand' && !this.pinned()) {
      this.hovered.set(true);
    }
  }

  onMouseLeave(): void {
    if (this.mode() === 'hover-expand' && !this.pinned()) {
      this.hovered.set(false);
    }
  }

  onFocusIn(): void {
    if (this.mode() === 'hover-expand' && !this.pinned()) {
      this.focused.set(true);
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (this.mode() === 'hover-expand' && !this.pinned()) {
      const related = event.relatedTarget as Node | null;
      // Only collapse if focus left the sidebar entirely
      // Use a microtask to check since relatedTarget may not be set yet
      queueMicrotask(() => {
        if (related && !(event.currentTarget as HTMLElement)?.contains(related)) {
          this.focused.set(false);
        } else if (!related) {
          this.focused.set(false);
        }
      });
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const items = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(
        'afi-nav-item button:not([disabled])'
      )
    );
    const idx = items.indexOf(target);
    if (idx < 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  togglePin(): void {
    this.pinnedChange.emit(!this.pinned());
  }

  toggleCollapse(): void {
    const next = !this._collapsed();
    this._collapsed.set(next);
    this.expandedChange.emit(!next);
  }
}
