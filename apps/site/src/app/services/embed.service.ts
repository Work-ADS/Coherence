import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

/**
 * Whether the app is rendering inside someone else's page.
 *
 * `?embed=1` on any route strips the chrome that only earns its space when the
 * site owns the whole window: the glass top bar, the feedback overlay, and — on
 * component doc pages — the breadcrumb, overline, title, description, use-cases,
 * accessibility and dos-and-donts sections. What survives is the controls row
 * (Marca plus the per-page filters), the live preview, and the tokens table.
 *
 * It exists for the portfolio, which frames `/componentes/<name>` as a live demo
 * in a narrow card. Without this the first screenful of that card is a docs
 * header, so the brand picker and the token table both sit below the fold — and a
 * cross-origin iframe can't be scrolled from the parent page.
 *
 * Read from the URL rather than from `window.self !== window.top`: being framed
 * and wanting the stripped layout are different questions, and a query param is
 * the one you can check by typing it into the address bar.
 *
 * Anything but `0` / `false` counts as on, so `?embed`, `?embed=1` and
 * `?embed=true` all work and a typo fails toward the normal page.
 */
@Injectable({ providedIn: 'root' })
export class EmbedService {
  private readonly router = inject(Router);

  /** Full URL including the query string, refreshed on every navigation. */
  private readonly url = signal(this.router.url);

  readonly on = computed(() => {
    const query = this.url().split('?')[1];
    if (!query) return false;
    const value = new URLSearchParams(query).get('embed');
    return value !== null && value !== '0' && value !== 'false';
  });

  constructor() {
    // Root-provided, so it outlives every route; no unsubscribe needed.
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.url.set(e.urlAfterRedirects);
    });
  }
}
