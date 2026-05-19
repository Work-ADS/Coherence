import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'coherence-theme';

/**
 * Theme toggle for the Coherence DS site.
 *
 * Reads/writes the `data-theme` attribute on `<html>`. The semantic tokens
 * in libs/tokens/semantic.scss `[data-theme="dark"]` block re-bind every
 * relevant CSS custom property — components automatically follow.
 *
 * Persists the user's choice to localStorage so the theme survives reloads.
 * SSR-safe via `isPlatformBrowser` guards.
 *
 * Pattern is identical to Figma's variable-mode toggle: one attribute on the
 * root element, cascade does the rest. The component itself is just chrome.
 */
@Component({
  selector: 'site-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      class="inline-flex items-center justify-center w-9 h-9 rounded-md
             bg-surface-base hover:bg-surface-muted
             border border-border-hairline
             text-canvas-fg
             transition-colors duration-fast
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
             focus-visible:ring-offset-2"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-pressed]="theme() === 'dark'"
      [title]="ariaLabel()"
    >
      @if (theme() === 'light') {
        <!-- Moon icon — click to switch to dark -->
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      } @else {
        <!-- Sun icon — click to switch to light -->
        <svg
          class="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly theme = signal<Theme>(this.readInitialTheme());

  constructor() {
    // Apply theme on init so a stored preference survives reload.
    this.applyTheme(this.theme());
  }

  protected toggle(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.applyTheme(next);
    this.persist(next);
  }

  protected ariaLabel(): string {
    return this.theme() === 'light'
      ? 'Cambiar a modo oscuro'
      : 'Cambiar a modo claro';
  }

  private readInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'light';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      // localStorage might be disabled (incognito, etc.); fall through.
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }

  private persist(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Disabled / quota / etc. — toggling still works for the session.
    }
  }
}
