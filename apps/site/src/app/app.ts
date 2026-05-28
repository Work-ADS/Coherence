import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PasswordGateComponent } from './components/password-gate/password-gate.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
// import { BrandPickerComponent } from './components/brand-picker/brand-picker.component'; // hidden 2026-05-26 — see app.component.html
import { LanguageToggleComponent } from './components/language-toggle/language-toggle.component';
import { FeedbackOverlayComponent } from './components/feedback-overlay/feedback-overlay.component';
import { LanguageService } from './services/language.service';
import {
  LogoComponent,
  TopBarComponent,
  SidebarComponent,
  NavItemComponent,
  NavSectionComponent,
} from '@coherence/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LogoComponent,
    TopBarComponent,
    SidebarComponent,
    NavItemComponent,
    NavSectionComponent,
    PasswordGateComponent,
    ThemeToggleComponent,
    // BrandPickerComponent, // hidden 2026-05-26 — see app.component.html
    LanguageToggleComponent,
    FeedbackOverlayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  private static readonly STORAGE_KEY = 'coherence-unlocked';

  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);

  /** Current locale for the DS chrome (nav, home, landings). Demos ignore it. */
  readonly lang = this.language.lang;

  readonly unlocked = signal(
    typeof localStorage !== 'undefined' &&
      localStorage.getItem(App.STORAGE_KEY) === '1',
  );

  private readonly currentUrl = signal(this.router.url);

  /**
   * True when the user is viewing a proposal page inside /demos/* or any
   * /afi-insights/* page. Hides the top nav so the page renders
   * full-viewport with its own product chrome.
   *
   * Note: pure /demos (the landing) does NOT match — only deeper paths.
   */
  readonly isFullScreenRoute = signal(this.matchFullScreen(this.router.url));

  /** Which top-level section is active (drives contextual sidebar) */
  readonly activeSection = computed(() => {
    const url = this.currentUrl();
    if (url.startsWith('/fundamentos')) return 'fundamentos';
    if (url.startsWith('/componentes')) return 'componentes';
    if (url.startsWith('/patrones')) return 'patrones';
    if (url.startsWith('/recursos')) return 'recursos';
    if (url.startsWith('/demos')) return 'demos';
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

  isActive(path: string): boolean {
    return this.currentUrl().startsWith(path);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  private matchFullScreen(url: string): boolean {
    // Demos: full-screen only inside an interactive demo. Demo OVERVIEW pages
    // (depth 2, e.g. /demos/wealth-planner-2026 or /demos/laboral-kutxa-sarevi)
    // keep the section sidebar so users can navigate between AFI demos and
    // Sarevi demos. Going deeper (depth 3+, e.g. /demo, /familia, /gastos)
    // hands the chrome to the demo itself. `/demos/sarevi-unicaja` is the
    // demo surface directly (no overview page) so it's also full-screen.
    const demosFullScreen =
      /^\/demos\/[^/]+\/.+/.test(url) || /^\/demos\/sarevi-unicaja(?:\/|$)/.test(url);
    return (
      demosFullScreen ||
      /^\/afi-insights(\/|$)/.test(url) ||
      /^\/talks\/.+/.test(url)
    );
  }
}
