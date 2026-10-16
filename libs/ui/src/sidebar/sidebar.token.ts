import { InjectionToken, Signal } from '@angular/core';

/**
 * What a row inside `afi-sidebar` needs to know about it. NavItem and
 * NavSection inject it (optionally) to follow the panel's state without the
 * consumer passing it down by hand.
 */
export interface SidebarContext {
  /** True while the panel shows labels (not the narrow rail). */
  readonly isExpanded: Signal<boolean>;
  /** True while the zip-style rail is showing: a new variant, collapsed. */
  readonly isRail: Signal<boolean>;
}

export const SIDEBAR_CONTEXT = new InjectionToken<SidebarContext>('SIDEBAR_CONTEXT');
