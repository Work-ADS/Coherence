import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  BadgeV2Component,
  ButtonV2Component,
  CheckboxV2Component,
  IconButtonV2Component,
  InputV2Component,
  RadioGroupV2Component,
  RadioV2Component,
  ToggleV2Component,
} from '@coherence/ui';

import { HyperTextDirective } from '../../../directives/hyper-text.directive';
import { LanguageService } from '../../../services/language.service';
import { MOODBOARD_SLIDES } from './moodboard-slides';

/** States of the send-button motion demo (section 8). */
type SendDemoState = 'idle' | 'sending' | 'sent';

/**
 * Part 3 of the redesign series — the build log of the modern visual identity.
 * Same `.post` shell as ui-moderno-2026 (modern foundation, ghost back button,
 * siteHyperText headings) so the series reads as one. Served at
 * `/blog/identidad-visual`; the original `/blog/arquitectura-informacion` URL
 * shipped first, so blog.routes.ts keeps it alive as a redirect.
 *
 * Source of truth for the copy: docs/blog-drafts/visual-identity-process.en.md —
 * edit there first, then sync here. Sections 6 and 8 embed live v2 primitives
 * instead of screenshots: the article runs on the design system it describes.
 */
@Component({
  selector: 'site-identidad-visual-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeV2Component,
    ButtonV2Component,
    CheckboxV2Component,
    IconButtonV2Component,
    InputV2Component,
    RadioGroupV2Component,
    RadioV2Component,
    ToggleV2Component,
    HyperTextDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './identidad-visual.page.html',
  styleUrls: ['./identidad-visual.page.scss'],
})
export class IdentidadVisualPage {
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  readonly isEn = computed(() => this.language.lang() === 'en');

  /** Send → sending → sent demo. Timers only run after a user click. */
  readonly sendState = signal<SendDemoState>('idle');

  /**
   * Moodboard gallery (section 3) — the Mobbin screens we each saved, ordered
   * Wise → the products the post names as references → the rest of the board.
   * See moodboard-slides.ts for the list and where the images come from.
   */
  readonly moodboardSlides = MOODBOARD_SLIDES;
  readonly moodboardIndex = signal(0);
  readonly moodboardSlide = computed(
    () => this.moodboardSlides[this.moodboardIndex()] ?? this.moodboardSlides[0],
  );

  /** Wraps at both ends so arrowing past the last screen returns to the first. */
  moodboardStep(delta: number): void {
    const total = this.moodboardSlides.length;
    this.moodboardIndex.update((i) => (i + delta + total) % total);
  }

  /** Ghost back button → the methodology / Design at Afi series index. */
  back(): void {
    void this.router.navigate(['/metodologia']);
  }

  runSendDemo(): void {
    if (this.sendState() !== 'idle') return;
    this.sendState.set('sending');
    setTimeout(() => {
      this.sendState.set('sent');
      setTimeout(() => this.sendState.set('idle'), 1600);
    }, 1400);
  }
}
