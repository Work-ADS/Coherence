import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { IconButtonComponent } from '@coherence/ui';

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
 * Composes afi-icon-button (variant="ghost"). [pressed] mirrors theme()==='dark'
 * so the button reads as a stateful toggle to assistive tech.
 */
@Component({
  selector: 'site-theme-toggle',
  standalone: true,
  imports: [IconButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
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
