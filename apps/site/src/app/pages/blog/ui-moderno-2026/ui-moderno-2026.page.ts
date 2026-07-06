import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@coherence/ui';

import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'site-ui-moderno-2026-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-moderno-2026.page.html',
  styleUrls: ['./ui-moderno-2026.page.scss'],
})
export class UiModerno2026Page {
  private readonly language = inject(LanguageService);
  readonly isEn = computed(() => this.language.lang() === 'en');
}
