import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  PageHeaderComponent,
  TabsComponent,
  TabItemComponent,
} from '@coherence/ui';

import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'site-brand-and-personas-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, TabsComponent, TabItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-and-personas.page.html',
  styleUrls: ['./brand-and-personas.page.scss'],
})
export class BrandAndPersonasPage {
  private readonly language = inject(LanguageService);
  readonly isEn = computed(() => this.language.lang() === 'en');
  readonly activePersona = signal(0);
}
