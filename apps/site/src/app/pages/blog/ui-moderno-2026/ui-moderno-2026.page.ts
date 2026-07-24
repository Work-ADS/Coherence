import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonV2Component } from '@coherence/ui';

import { HyperTextDirective } from '../../../directives/hyper-text.directive';
import { LanguageService } from '../../../services/language.service';

/**
 * Part 1 of the redesign series — the research behind Afi's visual redesign.
 * Rebuilt on the shared `.post` article shell (see brand-and-personas and
 * arquitectura-informacion) so all three parts read as one series. Copy is the
 * edited bilingual draft (docs/blog-drafts/{ui-moderno-2026,modern-ui-2026.en}.md);
 * the six diagrams live under public/assets/blog/{ui-moderno-2026,modern-ui-2026}.
 *
 * Chrome: the route is NOT full-screen (see app.ts matchFullScreen), so the
 * global glass top bar — nav + language toggle — sits above it. The article
 * carries only a ghost "back to Design at Afi" button in place of a breadcrumb.
 */
@Component({
  selector: 'site-ui-moderno-2026-page',
  standalone: true,
  imports: [ButtonV2Component, HyperTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-moderno-2026.page.html',
  styleUrls: ['./ui-moderno-2026.page.scss'],
})
export class UiModerno2026Page {
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  readonly isEn = computed(() => this.language.lang() === 'en');

  /** Ghost back button → the methodology / Design at Afi series index. */
  back(): void {
    void this.router.navigate(['/metodologia']);
  }
}
