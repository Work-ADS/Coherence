import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../services/language.service';

type Thumb = 'whitelabel' | 'talk' | 'video';

interface BlogPost {
  slug: string;
  eyebrow: { es: string; en: string };
  title: { es: string; en: string };
  date: { es: string; en: string };
  intro: { es: string; en: string };
  thumb: Thumb;
  /** Optional video src (relative to /assets); only used when thumb === 'video'. */
  videoSrc?: string;
  /** Optional poster image shown before video starts and on pause. */
  videoPoster?: string;
  /** Optional route override; defaults to `/blog/<slug>`. */
  to?: string;
}

// Trimmed to the three featured pieces. Other historical posts moved under
// their demo case studies — they aren't standalone editorial pieces.
const POSTS: BlogPost[] = [
  {
    slug: 'brand-and-personas',
    eyebrow: {
      es: 'ESTRATEGIA · MARCA',
      en: 'STRATEGY · BRAND',
    },
    title: {
      es: 'Marca y personas: la base que el moodboard no puede inventar',
      en: 'Brand and personas: what the moodboard can\'t make up',
    },
    date: {
      es: '25 junio 2026',
      en: 'June 25, 2026',
    },
    intro: {
      es: 'Antes de abrir Figma, el brief: seis campos de marca y cinco personas. Por qué los demos en código nos dejan enseñar casos de uso de verdad, no sólo pantallas.',
      en: 'Before opening Figma, the brief: six brand fields and five personas. Why code-based demos let us show real use cases, not just screens.',
    },
    thumb: 'video',
    videoSrc: 'assets/thumbnails/brand-and-personas.mp4',
  },
  {
    slug: 'ui-moderno-2026',
    eyebrow: {
      es: 'INVESTIGACIÓN · UI 2026',
      en: 'RESEARCH · UI 2026',
    },
    title: {
      es: '¿Qué es UI moderna en 2026? Contexto del rediseño visual de Afi',
      en: 'What is modern UI in 2026? Context for Afi\'s visual redesign',
    },
    date: {
      es: '24 junio 2026',
      en: 'June 24, 2026',
    },
    intro: {
      es: 'El encargo era un moodboard; la investigación nos llevó a un sitio distinto. Cuatro fuentes, ocho temas, cinco compromisos — la base sobre la que se construye el resto del rediseño.',
      en: 'The brief was a moodboard; research took us somewhere else. Four sources, eight themes, five commitments — the foundation the rest of the redesign rests on.',
    },
    thumb: 'video',
    videoSrc: 'assets/thumbnails/ui-moderno-2026.mp4',
    videoPoster: 'assets/thumbnails/ui-moderno-2026-poster.jpg',
  },
  {
    slug: 'wealth-planner-2026',
    eyebrow: {
      es: 'DEMO · DIGITAL SOLUTIONS',
      en: 'DEMO · DIGITAL SOLUTIONS',
    },
    title: {
      es: 'Wealth Planner 2026',
      en: 'Wealth Planner 2026',
    },
    date: {
      es: 'Junio 2026',
      en: 'June 2026',
    },
    intro: {
      es: 'Rediseño completo del planificador patrimonial — situación, objetivos, diagnóstico, plan de acción. Cinco iteraciones con asesores senior.',
      en: 'Full redesign of the wealth planner — situation, goals, diagnosis, action plan. Five iterations with senior advisors.',
    },
    thumb: 'video',
    videoSrc: 'assets/thumbnails/wealth-planner-2026.mp4',
    videoPoster: 'assets/thumbnails/wealth-planner-2026-poster.jpg',
    to: '/demos/wealth-planner-2026',
  },
];

interface ViewPost {
  slug: string;
  eyebrow: string;
  title: string;
  date: string;
  intro: string;
  thumb: Thumb;
  videoSrc?: string;
  videoPoster?: string;
  to?: string;
}

@Component({
  selector: 'site-blog-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog.landing.html',
  styleUrl: './blog.landing.scss',
})
export class BlogLandingPage {
  private readonly language = inject(LanguageService);
  readonly lang = this.language.lang;

  readonly headerCopy = computed(() => {
    const isEn = this.lang() === 'en';
    return {
      eyebrow: isEn ? 'BLOG' : 'BLOG',
      title: isEn ? 'Notes from the DS' : 'Notas del DS',
      intro: isEn
        ? 'Design and architecture decisions, written when the work ships. Per-demo case studies live inside their corresponding /demos/… page.'
        : 'Decisiones de diseño y arquitectura, escritas al cerrar la entrega. Los casos de estudio por demo viven dentro de su /demos/… correspondiente.',
    };
  });

  readonly posts = computed<ViewPost[]>(() => {
    const isEn = this.lang() === 'en';
    return POSTS.map((p) => ({
      slug: p.slug,
      eyebrow: isEn ? p.eyebrow.en : p.eyebrow.es,
      title: isEn ? p.title.en : p.title.es,
      date: isEn ? p.date.en : p.date.es,
      intro: isEn ? p.intro.en : p.intro.es,
      thumb: p.thumb,
      videoSrc: p.videoSrc,
      videoPoster: p.videoPoster,
      to: p.to,
    }));
  });

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
