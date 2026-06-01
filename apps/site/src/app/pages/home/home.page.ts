import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, LogoComponent } from '@coherence/ui';

import {
  CollapseGlyphComponent,
  EvolutionGlyphComponent,
  SlidesGlyphComponent,
  WhitelabelFrameGlyphComponent,
} from '../../components/glyphs';
import { LanguageService } from '../../services/language.service';
import { exportSemanticCss } from '../../utils/export-semantic-css';

interface WorkCard {
  routerLink: string;
  eyebrow: { es: string; en: string };
  title: { es: string; en: string };
  blurb: { es: string; en: string };
  thumb: 'wealth-planner' | 'sarevi' | 'whitelabel' | 'slides';
}

@Component({
  selector: 'site-home',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    ButtonComponent,
    EvolutionGlyphComponent,
    WhitelabelFrameGlyphComponent,
    CollapseGlyphComponent,
    SlidesGlyphComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly language = inject(LanguageService);
  readonly lang = this.language.lang;

  private readonly cards: WorkCard[] = [
    {
      routerLink: '/talks/stitch-vs-claude',
      eyebrow: {
        es: 'REUNIÓN DE ÁREA · IA',
        en: 'AREA MEETING · AI',
      },
      title: {
        es: 'Stitch vs Claude para conceptos de cliente',
        en: 'Stitch vs Claude for client concepts',
      },
      blurb: {
        es: 'Mismo prompt, cinco escenarios de marca y una recomendación. Slide-show navegable con flechas y design.md descargable.',
        en: 'Same prompt, five brand scenarios, one recommendation. Arrow-navigable slide-show with a downloadable design.md.',
      },
      thumb: 'slides',
    },
    {
      routerLink: '/demos/wealth-planner-2026',
      eyebrow: {
        es: 'DEMO · DIGITAL SOLUTIONS',
        en: 'DEMO · DIGITAL SOLUTIONS',
      },
      title: {
        es: 'Wealth Planner 2026',
        en: 'Wealth Planner 2026',
      },
      blurb: {
        es: 'Rediseño completo — patrimonio, evolución y simulación. Cinco iteraciones con seniors.',
        en: 'Full redesign — wealth, evolution, simulation. Five iterations with senior advisors.',
      },
      thumb: 'wealth-planner',
    },
    {
      routerLink: '/demos/laboral-kutxa-sarevi',
      eyebrow: {
        es: 'DEMO · WHITE-LABEL',
        en: 'DEMO · WHITE-LABEL',
      },
      title: {
        es: 'Laboral Kutxa Sarevi',
        en: 'Laboral Kutxa Sarevi',
      },
      blurb: {
        es: 'Simulador de eficiencia energética sobre Coherence DS aplicando la paleta magenta + berenjena + verde de LK.',
        en: 'Energy-efficiency simulator on Coherence DS using LK’s magenta + aubergine + green palette.',
      },
      thumb: 'sarevi',
    },
    {
      routerLink: '/blog/mixin-brand-bind',
      eyebrow: {
        es: 'BLOG · TOKENS',
        en: 'BLOG · TOKENS',
      },
      title: {
        es: 'White-label en una línea',
        en: 'White-label in one line',
      },
      blurb: {
        es: 'Cómo el mixin coherence-brand-bind colapsa 90 líneas de mapeo por marca en un @include de 8.',
        en: 'How the coherence-brand-bind mixin collapses 90 lines of per-brand mapping into an 8-line @include.',
      },
      thumb: 'whitelabel',
    },
  ];

  /** Cards flattened to the active locale so the template stays simple. */
  readonly recentWork = computed(() =>
    this.cards.map((c) => ({
      routerLink: c.routerLink,
      thumb: c.thumb,
      eyebrow: c.eyebrow[this.lang()],
      title: c.title[this.lang()],
      blurb: c.blurb[this.lang()],
    })),
  );

  downloadSemanticCss(): void {
    exportSemanticCss();
  }
}
