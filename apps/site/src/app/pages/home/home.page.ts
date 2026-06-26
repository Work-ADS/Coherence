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

interface WorkCard {
  routerLink: string;
  eyebrow: { es: string; en: string };
  title: { es: string; en: string };
  blurb: { es: string; en: string };
  thumb: 'wealth-planner' | 'sarevi' | 'whitelabel' | 'slides' | 'video';
  /** Optional video src (relative to /assets); only used when thumb === 'video'. */
  videoSrc?: string;
  /** Optional poster image shown before video starts and on pause. */
  videoPoster?: string;
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
      routerLink: '/blog/brand-and-personas',
      eyebrow: {
        es: 'ESTRATEGIA · MARCA',
        en: 'STRATEGY · BRAND',
      },
      title: {
        es: 'Marca y personas',
        en: 'Brand and personas',
      },
      blurb: {
        es: 'Antes del moodboard, el brief: seis campos de marca y cinco personas que los demos en código sí pueden modelar.',
        en: 'Before the moodboard, the brief: six brand fields and five personas the code-based demos can actually model.',
      },
      thumb: 'video',
      videoSrc: 'assets/thumbnails/brand-and-personas.mp4',
    },
    {
      routerLink: '/blog/ui-moderno-2026',
      eyebrow: {
        es: 'INVESTIGACIÓN · UI 2026',
        en: 'RESEARCH · UI 2026',
      },
      title: {
        es: '¿Qué es UI moderna en 2026?',
        en: 'What is modern UI in 2026?',
      },
      blurb: {
        es: 'Cuatro fuentes, ocho temas, cinco compromisos. La base sobre la que se construye el rediseño visual de Afi.',
        en: 'Four sources, eight themes, five commitments. The foundation Afi’s visual redesign rests on.',
      },
      thumb: 'video',
      videoSrc: 'assets/thumbnails/ui-moderno-2026.mp4',
      videoPoster: 'assets/thumbnails/ui-moderno-2026-poster.jpg',
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
      thumb: 'video',
      videoSrc: 'assets/thumbnails/wealth-planner-2026.mp4',
      videoPoster: 'assets/thumbnails/wealth-planner-2026-poster.jpg',
    },
  ];

  /** Cards flattened to the active locale so the template stays simple. */
  readonly recentWork = computed(() =>
    this.cards.map((c) => ({
      routerLink: c.routerLink,
      thumb: c.thumb,
      videoSrc: c.videoSrc,
      videoPoster: c.videoPoster,
      eyebrow: c.eyebrow[this.lang()],
      title: c.title[this.lang()],
      blurb: c.blurb[this.lang()],
    })),
  );

  /**
   * Ensure the thumb video is muted, then start playback. Browsers block
   * autoplay on unmuted videos; Angular's bare `muted` attribute doesn't
   * survive the template renderer, so we set it explicitly here once the
   * video can play.
   */
  playMuted(event: Event): void {
    const video = event.target as HTMLVideoElement;
    video.muted = true;
    video.play().catch(() => {
      /* autoplay blocked: video will start on next user interaction */
    });
  }
}
