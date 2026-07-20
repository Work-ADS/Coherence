import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@coherence/ui';

import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'site-arquitectura-informacion-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arquitectura-informacion.page.html',
  styleUrls: ['./arquitectura-informacion.page.scss'],
})
export class ArquitecturaInformacionPage {
  private readonly language = inject(LanguageService);
  readonly isEn = computed(() => this.language.lang() === 'en');
}
