import { InjectionToken, Signal } from '@angular/core';

/** What a row inside `afi-nav-section` can ask of it: the section's name, for rail tooltips and accessible names. */
export interface NavSectionContext {
  readonly label: Signal<string>;
}

export const NAV_SECTION_CONTEXT = new InjectionToken<NavSectionContext>('NAV_SECTION_CONTEXT');
