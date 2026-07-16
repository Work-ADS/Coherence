import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  model,
} from '@angular/core';

import { ButtonV2Component } from '../button-v2';
import { IconButtonV2Component } from '../icon-button-v2';
import { LogoV2Component } from '../logo-v2';
import { NavItemV2Component } from '../nav-item-v2/nav-item-v2.component';

let nextId = 0;

/**
 * Sidebar — identity v2 (foundations-modern).
 *
 * The primary navigation shell: a canvas-blended vertical column that holds a
 * brand header, one or more `<afi-nav-section-v2>` groups, a flexible spacer,
 * and a footer collapse control. Per the Figma annotations the shell carries
 * ZERO embellishment — no border, divider, radius, shadow, or blur — so it melts
 * into the page canvas.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only inside
 * a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Sidebar (2762:5281), Shell
 * (2746:4893) and the Behavior canvas (2762:5297). Two layouts: Expanded
 * (`width/sidebar/expanded`, 280) and Collapsed (`width/sidebar/collapsed`, 72 —
 * icon rail, labels move into tooltips). `collapsed` is a `model()` so the
 * footer control self-toggles it and consumers can two-way bind `[(collapsed)]`.
 *
 * The header logo is `afi-logo-v2` — the monochrome (currentColor) mark remade
 * in code at Figma's exact size: the full "Afi" lockup shows expanded, the
 * icon-only infinity mark shows collapsed. No fixed header row: the logo hugs
 * its natural height, per the Figma shell.
 *
 * Footer controls: expanded → a ghost, full-width `afi-button-v2` carrying the
 * "Contraer barra lateral" label + `aria-expanded`/`aria-controls`; collapsed →
 * a reused `afi-icon-button-v2` in `ghost`. The Figma mock draws
 * the Expand Button with the dark raised primary chrome, but the Icon Button
 * usage doc ("Use Ghost variant inside navigation bars, toolbars, and inline
 * actions") and the design call override it — chrome controls in side panels
 * stay ghost.
 *
 * A11y: the root is a `<nav>` landmark with `aria-label`. The collapse control
 * announces `aria-expanded` and `aria-controls` pointing at the nav. Arrow
 * Up/Down + Home/End rove focus across the flattened, enabled item list;
 * `aria-current="page"` (on the selected item) marks the active destination.
 *
 * Responsive breakpoint behaviour (persistent → rail → mobile overlay) is
 * intentionally out of scope for this build; the shell exposes `collapsed` so a
 * host can drive it from a media query in the meantime.
 */
@Component({
  selector: 'afi-sidebar-v2',
  standalone: true,
  imports: [ButtonV2Component, IconButtonV2Component, LogoV2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-v2.component.html',
  styleUrls: ['./sidebar-v2.component.scss'],
})
export class SidebarV2Component {
  /** Controlled + self-updating collapsed layout. `[(collapsed)]`-bindable. */
  readonly collapsed = model<boolean>(false);

  /** Accessible label for the navigation landmark. RAE Spanish default. */
  readonly ariaLabel = input<string>('Navegación principal');

  /** When set, the header logo becomes a link to this destination. */
  readonly homeHref = input<string | null>(null);

  /** Stable id linking the collapse control's `aria-controls` to the nav. */
  readonly navId = `afi-sidebar-v2-${nextId++}`;

  /** All nav items across every projected section, in DOM order. */
  private readonly items = contentChildren(NavItemV2Component, {
    descendants: true,
  });

  constructor() {
    // Assign each item its position, so arrow-key rotation has a stable order.
    effect(() => {
      this.items().forEach((item, i) => item.index.set(i));
    });
  }

  toggle(): void {
    this.collapsed.update((value) => !value);
  }

  onKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') {
      return;
    }

    const enabled = this.items().filter((item) => !item.disabled());
    const len = enabled.length;
    if (len === 0) return;

    const active = event.target as HTMLElement;
    const currentIdx = enabled.findIndex(
      (item) => item.controlRef()?.nativeElement === active,
    );

    let target: number;
    switch (key) {
      case 'ArrowDown':
        target = currentIdx < 0 ? 0 : (currentIdx + 1) % len;
        break;
      case 'ArrowUp':
        target = currentIdx < 0 ? len - 1 : (currentIdx - 1 + len) % len;
        break;
      case 'Home':
        target = 0;
        break;
      default:
        target = len - 1;
        break;
    }

    event.preventDefault();
    enabled[target]?.focus();
  }
}
