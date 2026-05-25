import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Lang = 'es' | 'en';

const STORAGE_KEY = 'coherence-lang';
const DEFAULT_LANG: Lang = 'es';

/**
 * App-wide language signal for the Coherence DS site chrome (nav, home,
 * landing pages). Demo pages under /demos/* stay Spanish regardless.
 *
 * Persists to localStorage and mirrors onto `<html lang="…">` so the
 * browser / screen readers / spellcheck see the right value.
 *
 * Sibling of theme-toggle / brand-picker: same lifecycle, but exposed as
 * an injectable service because template strings need to react to it.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _lang = signal<Lang>(this.readInitial());
  readonly lang = this._lang.asReadonly();

  constructor() {
    this.apply(this._lang());
  }

  set(next: Lang): void {
    this._lang.set(next);
    this.apply(next);
    this.persist(next);
  }

  private readInitial(): Lang {
    if (!isPlatformBrowser(this.platformId)) return DEFAULT_LANG;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') return stored;
    } catch {
      // localStorage disabled — fall through.
    }
    return DEFAULT_LANG;
  }

  private apply(lang: Lang): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.documentElement.setAttribute('lang', lang);
  }

  private persist(lang: Lang): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Disabled / quota — switching still works for the session.
    }
  }
}
