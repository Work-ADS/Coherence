import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavSectionComponent } from './components/nav-section/nav-section.component';
import { PasswordGateComponent } from './components/password-gate/password-gate.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { LogoComponent, TopBarComponent } from '@coherence/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavSectionComponent,
    LogoComponent,
    TopBarComponent,
    PasswordGateComponent,
    ThemeToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  private static readonly STORAGE_KEY = 'coherence-unlocked';

  private readonly router = inject(Router);

  readonly unlocked = signal(
    typeof localStorage !== 'undefined' &&
      localStorage.getItem(App.STORAGE_KEY) === '1',
  );

  private readonly currentUrl = signal(this.router.url);

  /**
   * True when the user is viewing a proposal page inside /novedades/* or any
   * /afi-insights/* page. Hides the top nav so the page renders
   * full-viewport with its own product chrome.
   */
  readonly isFullScreenRoute = signal(this.matchFullScreen(this.router.url));

  /** Which top-level section is active (drives contextual sidebar) */
  readonly activeSection = computed(() => {
    const url = this.currentUrl();
    if (url.startsWith('/fundamentos')) return 'fundamentos';
    if (url.startsWith('/componentes')) return 'componentes';
    if (url.startsWith('/patrones')) return 'patrones';
    if (url.startsWith('/recursos')) return 'recursos';
    return null;
  });

  /** Show sidebar only inside sections that have sub-pages */
  readonly showSidebar = computed(() => {
    return this.activeSection() !== null && !this.isFullScreenRoute() && !this.isHomepage();
  });

  /** True on the homepage — hides top nav, shows centered logo instead */
  readonly isHomepage = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url === '';
  });

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl.set(e.urlAfterRedirects);
        this.isFullScreenRoute.set(this.matchFullScreen(e.urlAfterRedirects));
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key !== App.STORAGE_KEY) return;
        this.unlocked.set(e.newValue === '1');
      });
    }
  }

  onUnlocked(): void {
    try {
      localStorage.setItem(App.STORAGE_KEY, '1');
    } catch {
      // Private mode / storage disabled — gate stays open for this tab only.
    }
    this.unlocked.set(true);
  }

  private matchFullScreen(url: string): boolean {
    return /^\/novedades\/.+/.test(url) || /^\/afi-insights(\/|$)/.test(url);
  }
}
