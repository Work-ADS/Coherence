import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';

import { IconComponent } from '../icon';
import { SIDEBAR_CONTEXT } from './sidebar.token';
import type { SidebarMode, SidebarVariant } from './sidebar.variants';
import { planningVariants, sidebarWidths } from './sidebar.variants';

/**
 * Primary navigation sidebar.
 *
 * Three modes: static (always expanded), collapsible (toggle button),
 * hover-expand (default — expand on hover/focus, collapse on leave).
 * Pin support for hover-expand mode.
 *
 * The `flush-light` and `inset-dark` variants carry the Wealth Planner chrome
 * (compact rows, a narrow rail, section titles that become rules in the rail).
 * In `static` mode their panel is as wide as its longest label, never narrower
 * than `--sidebar-nav-width`.
 */
@Component({
  selector: 'afi-sidebar',
  standalone: true,
  imports: [IconComponent],
  providers: [{ provide: SIDEBAR_CONTEXT, useExisting: forwardRef(() => SidebarComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut($event)',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SidebarComponent {
  readonly mode = input<SidebarMode>('hover-expand');
  readonly variant = input<SidebarVariant>('neutral');
  readonly expanded = input<boolean | null>(null);
  readonly pinned = input<boolean>(false);
  readonly ariaLabel = input<string>('Navegación principal');
  /** Overrides the panel widths. Unset: the new variants read the sidebar tokens, the original chrome keeps 64 and 240. */
  readonly width = input<{ collapsed: string; expanded: string } | null>(null);

  readonly expandedChange = output<boolean>();
  readonly pinnedChange = output<boolean>();

  /** Internal hover/focus state for hover-expand mode */
  private readonly hovered = signal(false);
  private readonly focused = signal(false);

  readonly isExpanded = computed(() => {
    const manual = this.expanded();
    if (manual !== null) return manual;

    const m = this.mode();
    if (m === 'static') return true;
    if (m === 'collapsible') return this._collapsed() === false;
    // hover-expand
    if (this.pinned()) return true;
    return this.hovered() || this.focused();
  });

  /** Wealth Planner chrome: `flush-light` or `inset-dark`. */
  readonly isPlanning = computed(() => planningVariants.includes(this.variant()));

  /** The narrow rail of the Wealth Planner chrome. */
  readonly isRail = computed(() => this.isPlanning() && !this.isExpanded());

  /** `null` lets the stylesheet size the panel (static planning panels fit their labels). */
  readonly currentWidth = computed<string | null>(() => {
    const w = this.width();
    const open = this.isExpanded();
    if (w) return open ? w.expanded : w.collapsed;
    if (!this.isPlanning()) return open ? sidebarWidths.expanded : sidebarWidths.collapsed;
    if (!open) return 'var(--sidebar-rail-width)';
    return this.mode() === 'static' ? null : 'var(--sidebar-nav-width)';
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
        'afi-nav-item .nav-item:not(:disabled)'
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
