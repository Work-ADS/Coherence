import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { SegmentedControlComponent, type SegmentedOption } from '@coherence/ui';

import { LanguageService, type Lang } from '../../services/language.service';

/**
 * Language toggle for the Coherence DS site chrome.
 *
 * Composes afi-segmented-control (sm) with two options: ES / EN.
 * Reads / writes the app-wide LanguageService — the service mirrors the
 * value onto `<html lang>` and persists to localStorage.
 *
 * Lives in the top-bar `slot="end"` next to brand-picker and theme-toggle.
 * Hidden by the parent on /demos/* routes (those stay Spanish).
 */
@Component({
  selector: 'site-language-toggle',
  standalone: true,
  imports: [SegmentedControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.scss',
})
export class LanguageToggleComponent {
  private readonly language = inject(LanguageService);

  protected readonly options: SegmentedOption[] = [
    { value: 'es', label: 'ES' },
    { value: 'en', label: 'EN' },
  ];

  protected readonly value = computed(() => this.language.lang());

  protected onChange(next: string): void {
    if (next === 'es' || next === 'en') {
      this.language.set(next as Lang);
    }
  }
}
