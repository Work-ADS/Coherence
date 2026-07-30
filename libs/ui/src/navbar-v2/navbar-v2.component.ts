import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { IconButtonV2Component } from '../icon-button-v2/icon-button-v2.component';
import type { NavbarV2Action, NavbarV2Layout } from './navbar-v2.variants';

import { AFI_UI_COPY } from '../copy';

/**
 * Navbar — identity v2 (foundations-modern).
 *
 * Full-width flat application chrome: a single, height-bound bar
 * (`navigation/navbar/height`, 64) separated from the content below by a bottom
 * hairline and nothing else — no shadow, no elevation. Consumes only
 * `foundations-modern` tokens, so it renders correctly only inside a
 * `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Navbar (2759:5028), documented
 * at 2777:4723, behaviour canvas at 2775:4656. Three responsive layouts share
 * the same shell (height, fill, bottom hairline); only the zone content changes:
 *   • `desktop` — Left (menu toggle + page label) · Center (full search trigger)
 *     · Right (Help · Notifications · Avatar). Fill is `background/canvas` so the
 *     wide bar melts into the page.
 *   • `compact` — page label · search icon trigger · Notifications · Avatar (no
 *     menu toggle, no Help). Fill is `background/surface`.
 *   • `mobile` — menu toggle + page label · search icon trigger · overflow ·
 *     Avatar. Fill is `background/surface`.
 * `layout` is a one-way `input()` (default `desktop`); a host drives it from a
 * container query. (Unlike `afi-sidebar-v2`'s two-way `collapsed` model, nothing
 * inside the navbar changes its own layout, so no `model()` is warranted.)
 * Because each layout renders only its own controls, hidden controls drop out of
 * the tab order for free (behaviour canvas: "Hidden booleans remove their tab
 * stops").
 *
 * Every icon control is a real `afi-icon-button-v2` in `ghost` (Figma usage
 * rule: "Icon Buttons in the Navbar must always use the Ghost variant"). The
 * search field is a TRIGGER, not a text entry — "Global search for switching
 * only: opens a command-palette overlay, does not filter page content" — so on
 * every layout it is a button that emits `activated('search')`. On desktop it
 * looks like an input (search icon · placeholder · ⌘K hint); on compact/mobile
 * it collapses to a single search icon button. The ⌘K hint renders as plain text
 * (per Figma — not a bordered keycap chip) and is a visual affordance only
 * (`aria-hidden`); the app shell owns the global shortcut (a navbar primitive
 * must not install surprising window-level key listeners).
 *
 * The avatar is rendered inline as a `<button>` (initials only) rather than
 * reusing `afi-avatar`, which is a passive, legacy-token display element — the
 * navbar avatar is an interactive user-menu trigger on the modern foundation.
 * Gap: a dedicated interactive `afi-avatar-v2` on foundations-modern is a future
 * primitive; this inline trigger fills it in the meantime.
 *
 * A11y: the root is a `<nav>` landmark labelled via `ariaLabel` (default
 * "Navegación superior" — distinct from the sidebar's "Navegación principal" so
 * the two landmarks stay uniquely named). Every icon button carries a unique
 * accessible name (Abrir menú de navegación · Buscar · Ayuda · Notificaciones ·
 * Más acciones); the avatar exposes `aria-label` "Menú de usuario, {initials}".
 * Focus order follows the DOM: Left → Center → Right. Focus rings come from the
 * reused primitives' own `:focus-visible` states.
 */
@Component({
  selector: 'afi-navbar-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButtonV2Component, NgTemplateOutlet],
  templateUrl: './navbar-v2.component.html',
  styleUrls: ['./navbar-v2.component.scss'],
})
export class NavbarV2Component {

  /** Optional page-level chrome copy; per-instance inputs still win. */
  private readonly uiCopy = inject(AFI_UI_COPY, { optional: true });

  /** Responsive layout. Host-driven (bind to a container query). */
  readonly layout = input<NavbarV2Layout>('desktop');

  /** Active page label shown in the leading zone. */
  readonly currentPage = input<string>('');

  /** Leading menu-toggle button (desktop + mobile). */
  readonly showMenuToggle = input<boolean>(true);

  /** Global-search trigger (all layouts). */
  readonly showSearch = input<boolean>(true);

  /** Search field placeholder (desktop). RAE Spanish default. */
  readonly searchPlaceholder = input<string>('Buscar');

  /** Accessible names for the bar's icon controls. */
  readonly helpLabel = input<string | null>(null);
  readonly helpLabelText = computed(
    () => this.helpLabel() ?? this.uiCopy?.()?.help ?? 'Ayuda',
  );
  readonly menuLabel = input<string | null>(null);
  readonly menuLabelText = computed(
    () => this.menuLabel() ?? this.uiCopy?.()?.openNav ?? 'Abrir menú de navegación',
  );
  readonly searchLabel = input<string | null>(null);
  readonly searchLabelText = computed(
    () => this.searchLabel() ?? this.uiCopy?.()?.search ?? 'Buscar',
  );
  readonly notificationsLabel = input<string | null>(null);
  readonly notificationsLabelText = computed(
    () => this.notificationsLabel() ?? this.uiCopy?.()?.notifications ?? 'Notificaciones',
  );

  /** Keyboard-shortcut hint shown in the desktop trigger. Empty → omitted. */
  readonly searchShortcut = input<string>('⌘K');

  /** Help icon button (desktop only). */
  readonly showHelp = input<boolean>(true);

  /** Notifications icon button (desktop + compact). */
  readonly showNotifications = input<boolean>(true);

  /** Overflow ("⋮") icon button (mobile only). */
  readonly showOverflow = input<boolean>(true);

  /** User name → avatar initials + user-menu accessible name. */
  readonly userName = input<string>('');

  /** Accessible name for the navigation landmark. */
  readonly ariaLabel = input<string | null>(null);
  readonly ariaLabelText = computed(
    () => this.ariaLabel() ?? this.uiCopy?.()?.topNav ?? 'Navegación superior',
  );

  readonly overflowLabel = input<string | null>(null);
  readonly overflowLabelText = computed(
    () => this.overflowLabel() ?? this.uiCopy?.()?.moreActions ?? 'Más acciones',
  );

  /** A control was interacted with — the app shell routes it to its overlay. */
  readonly activated = output<NavbarV2Action>();

  readonly classes = computed(() => `afi-navbar-v2 afi-navbar-v2--${this.layout()}`);

  /** Up-to-two initials from the user name (matches `afi-avatar`'s rule). */
  readonly initials = computed(() => {
    const parts = this.userName().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return (parts[0]?.[0] ?? '').toUpperCase();
    return ((parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '')).toUpperCase();
  });

  emit(action: NavbarV2Action): void {
    this.activated.emit(action);
  }
}
