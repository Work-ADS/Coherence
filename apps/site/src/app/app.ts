import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
// import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component'; // hidden 2026-07-21 — modern foundation is light-only; see app.component.html
// import { BrandPickerComponent } from './components/brand-picker/brand-picker.component'; // hidden 2026-05-26 — see app.component.html
import { LanguageToggleComponent } from './components/language-toggle/language-toggle.component';
import { FeedbackOverlayComponent } from './components/feedback-overlay/feedback-overlay.component';
import { LanguageService } from './services/language.service';
import { LogoComponent, TopBarComponent, NavbarItemV2Component } from '@coherence/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LogoComponent,
    TopBarComponent,
    NavbarItemV2Component,
    LanguageToggleComponent,
    // ThemeToggleComponent, // hidden 2026-07-21 — see app.component.html
    // BrandPickerComponent, // hidden 2026-05-26 — see app.component.html
    FeedbackOverlayComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /** Current locale for the DS chrome (nav, home, landings). Demos ignore it. */
  readonly lang = this.language.lang;

  private readonly currentUrl = signal(this.router.url);

  /**
   * True when the user is viewing a proposal page inside /demos/* or any
   * /afi-insights/* page. Hides the top nav so the page renders
   * full-viewport with its own product chrome.
   *
   * Note: pure /demos (the landing) does NOT match — only deeper paths.
   */
  readonly isFullScreenRoute = signal(this.matchFullScreen(this.router.url));

  /** True on the homepage — hides top nav, shows centered logo instead */
  readonly isHomepage = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url === '';
  });

  /**
   * True while an element tagged `data-nav-tone="dark"` sits under the glass
   * top bar. Pages tag their dark surfaces (hero images, dark cards); the bar
   * flips its logo + menu to the inverse palette so they stay legible while
   * that content is behind the frost. Garaje-style adaptive contrast, done
   * with a scroll check instead of mix-blend-mode — blend modes fight
   * backdrop-filter compositing in Chromium (see component-reader.scss).
   */
  readonly navOnDark = signal(false);

  /** rAF gate so scroll/resize only trigger one tone check per frame. */
  private toneCheckQueued = false;

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl.set(e.urlAfterRedirects);
        this.isFullScreenRoute.set(this.matchFullScreen(e.urlAfterRedirects));
        // New page → new tagged elements. Check on the next frame, then once
        // more shortly after — lazy chunks can render after the first frame.
        this.queueNavToneCheck();
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => this.queueNavToneCheck(), 150);
        }
      }
    });

    this.setupNavToneWatcher();
  }

  isActive(path: string): boolean {
    return this.currentUrl().startsWith(path);
  }

  navigate(path: string): void {
    this.router.navigateByUrl(path);
  }

  /**
   * Watch scrolling anywhere in the app (capture — scroll events don't
   * bubble) plus resizes, and re-evaluate the nav tone at most once a frame.
   */
  private setupNavToneWatcher(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const queue = () => this.queueNavToneCheck();
    window.addEventListener('scroll', queue, { capture: true, passive: true });
    window.addEventListener('resize', queue, { passive: true });
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', queue, { capture: true });
      window.removeEventListener('resize', queue);
    });
  }

  private queueNavToneCheck(): void {
    if (!isPlatformBrowser(this.platformId) || this.toneCheckQueued) return;
    this.toneCheckQueued = true;
    requestAnimationFrame(() => {
      this.toneCheckQueued = false;
      this.updateNavTone();
    });
  }

  /** True tone check: is any `data-nav-tone="dark"` element under the bar? */
  private updateNavTone(): void {
    if (this.isFullScreenRoute()) {
      this.navOnDark.set(false);
      return;
    }
    const bar = document.querySelector('afi-top-bar');
    const barBottom = bar ? bar.getBoundingClientRect().bottom : 0;
    if (barBottom <= 0) {
      this.navOnDark.set(false);
      return;
    }
    let onDark = false;
    for (const el of document.querySelectorAll('[data-nav-tone="dark"]')) {
      const rect = el.getBoundingClientRect();
      if (rect.top < barBottom && rect.bottom > 0) {
        onDark = true;
        break;
      }
    }
    this.navOnDark.set(onDark);
  }

  private matchFullScreen(url: string): boolean {
    // Demos: full-screen only inside an interactive demo. Demo OVERVIEW pages
    // (depth 2, e.g. /demos/wealth-planner-2026, /demos/laboral-kutxa-sarevi,
    // /demos/sarevi-unicaja, /demos/sarevi-banco-cooperativo) keep the section
    // sidebar. Going deeper (depth 3+, e.g. /demo, /familia, /gastos) hands
    // the chrome to the demo itself.
    const demosFullScreen = /^\/demos\/[^/]+\/.+/.test(url);
    // Top-level demo destinations that aren't under /demos/* but still belong
    // to a demo experience (so DS chrome would feel out of place). /clientes
    // and /listado-planificaciones both bring their own demo-shell + identity
    // bar, so the section nav would be double chrome.
    const topLevelDemoRoutes =
      /^\/clientes(\/|$)/.test(url) ||
      /^\/listado-planificaciones(\/|$)/.test(url);
    // Depth-2 exception: the Nueva simulación · Overview is a platform surface
    // (its own sidebar-v2 + navbar-v2 chrome), so it renders full-screen too.
    const overviewPlatform = /^\/demos\/nueva-simulacion-overview(\/|$)/.test(url);
    // The Modern UI post renders as an immersive dark reading room with its
    // own floating chrome (back link + language toggle), so the DS top bar
    // would be double chrome.
    const immersiveReader = /^\/blog\/ui-moderno-2026(\/|$)/.test(url);
    return (
      demosFullScreen ||
      topLevelDemoRoutes ||
      overviewPlatform ||
      immersiveReader ||
      /^\/afi-insights(\/|$)/.test(url) ||
      /^\/talks\/.+/.test(url)
    );
  }
}
