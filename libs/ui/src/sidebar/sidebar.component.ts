import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { AvatarComponent } from '../avatar';
import { IconComponent } from '../icon';
import { TooltipComponent } from '../tooltip';
import { DEFAULT_DOT_LABEL, SIDEBAR_CONTEXT } from './sidebar.token';
import type {
  SidebarExpandMotion,
  SidebarMode,
  SidebarUser,
  SidebarVariant,
} from './sidebar.variants';
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
  imports: [AvatarComponent, IconComponent, TooltipComponent],
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
  /**
   * Wording of the status dot (`dot` on a nav item): appended to the row's
   * accessible name and shown, capitalised, in its tooltip. A nav item's own
   * `dotLabel` wins.
   */
  readonly dotLabel = input<string>(DEFAULT_DOT_LABEL);
  /** Brand logotype, shown expanded. `[slot=top]` still works for a custom brand. */
  readonly logoSrc = input<string | null>(null);
  readonly logoAlt = input<string>('Afi');
  /** Brand mark shown in the rail; it gives way to the toggle on hover and keyboard focus. */
  readonly logoMarkSrc = input<string | null>(null);
  readonly logoMarkAlt = input<string>('Afi');
  /** Product name beside the logotype, as one lockup. Dropped in the rail. */
  readonly product = input<string | null>(null);
  /** Who is signed in: avatar, name and role above the footer; only the avatar in the rail. */
  readonly user = input<SidebarUser | null>(null);
  /**
   * How the Wealth Planner panel opens from the rail. `instant` (default): a
   * cut. `reveal`: the width runs from the rail to the panel in
   * `--duration-slow` on `--easing-enter` and the nav fades in after it starts.
   * Nothing moves under `prefers-reduced-motion`.
   */
  readonly expandMotion = input<SidebarExpandMotion>('instant');
  /** Overrides the panel widths. Unset: the new variants read the sidebar tokens, the original chrome keeps 64 and 240. */
  readonly width = input<{ collapsed: string; expanded: string } | null>(null);

  readonly expandedChange = output<boolean>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly destroyRef = inject(DestroyRef);
  private wasExpanded = true;
  private railWidth = 0;
  private revealTimer: ReturnType<typeof setTimeout> | null = null;

  /** True while the reveal runs; fades the nav in. */
  readonly revealing = signal(false);
  readonly pinnedChange = output<boolean>();

  constructor() {
    // The reveal animates a width that `max-content` cannot interpolate, so after render this
    // reads the panel's width (offsetWidth), the motion tokens (getComputedStyle) and the
    // reduced-motion preference (matchMedia), then writes one Web Animations animation between
    // the two widths. Imperative on purpose: a template binding cannot animate to a measured size.
    afterRenderEffect(() => {
      const el = this.panel()?.nativeElement;
      const open = this.isExpanded();
      if (!el) return;
      const was = this.wasExpanded;
      this.wasExpanded = open;
      if (!open) {
        this.railWidth = el.offsetWidth;
        return;
      }
      if (was || this.expandMotion() !== 'reveal' || !this.isPlanning()) return;
      if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const target = el.offsetWidth;
      const style = getComputedStyle(el);
      const duration = parseFloat(style.getPropertyValue('--duration-slow')) || 0;
      const easing = style.getPropertyValue('--easing-enter').trim() || 'ease-out';
      if (!this.railWidth || !duration) return;
      el.animate(
        [
          { width: `${this.railWidth}px`, minWidth: 0 },
          { width: `${target}px`, minWidth: `${target}px` },
        ],
        { duration, easing },
      );
      this.revealing.set(true);
      if (this.revealTimer) clearTimeout(this.revealTimer);
      // The nav fade starts after --duration-fast and runs --duration-base: keep the class until it ends.
      const fade =
        (parseFloat(style.getPropertyValue('--duration-fast')) || 0) +
        (parseFloat(style.getPropertyValue('--duration-base')) || 0);
      this.revealTimer = setTimeout(() => this.revealing.set(false), Math.max(duration, fade));
    });
    this.destroyRef.onDestroy(() => {
      if (this.revealTimer) clearTimeout(this.revealTimer);
    });
  }

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
