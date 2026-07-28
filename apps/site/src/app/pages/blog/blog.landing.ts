import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { LanguageService } from '../../services/language.service';

type Thumb = 'whitelabel' | 'ia' | 'video';

/**
 * Which landing surface a post belongs to. `methodology` = the redesign-series
 * narrative (Modern UI → Brand strategy → Visual identity), shown on
 * /metodologia. `blog` = everything else, shown on /blog. A single POSTS list
 * feeds both landings; the route's `data.collection` selects the subset.
 */
type Collection = 'methodology' | 'blog';

interface BlogPost {
  slug: string;
  /** Landing this post appears on. */
  collection: Collection;
  eyebrow: { es: string; en: string };
  title: { es: string; en: string };
  date: { es: string; en: string };
  intro: { es: string; en: string };
  thumb: Thumb;
  /**
   * Optional video src (relative to /assets); only used when thumb === 'video'.
   * A per-language pair swaps the clip with the active locale.
   */
  videoSrc?: string | { es: string; en: string };
  /** Optional poster image shown before video starts and on pause. */
  videoPoster?: string;
  /** Optional route override; defaults to `/blog/<slug>`. */
  to?: string;
  /**
   * True when the thumb is a dark surface. Emits `data-nav-tone="dark"` on the
   * card so the glass top bar flips to its inverse palette while the card
   * scrolls behind it.
   */
  darkThumb?: boolean;
}

// Trimmed to the three featured pieces. Other historical posts moved under
// their demo case studies — they aren't standalone editorial pieces.
const POSTS: BlogPost[] = [
  {
    slug: 'identidad-visual',
    collection: 'methodology',
    darkThumb: true,
    eyebrow: {
      es: 'PROCESO · IDENTIDAD VISUAL',
      en: 'PROCESS · VISUAL IDENTITY',
    },
    title: {
      es: 'Cómo construimos la nueva identidad visual',
      en: 'How we built the new visual identity',
    },
    date: {
      es: '27 julio 2026',
      en: 'July 27, 2026',
    },
    intro: {
      es: 'De un encargo difuso a un sistema funcionando en código: moodboards, principios, tokens, componentes y los gráficos que quedan por delante.',
      en: 'From a vague brief to a system running in code: moodboards, principles, tokens, components, and the charts still ahead.',
    },
    thumb: 'ia',
  },
  // Replaces the delisted brand-and-personas card (AI-drafted, factually wrong).
  // The /blog/brand-and-personas route still resolves by direct URL.
  {
    slug: 'estrategia-marca',
    collection: 'methodology',
    darkThumb: true,
    eyebrow: {
      es: 'ESTRATEGIA · MARCA',
      en: 'STRATEGY · BRAND',
    },
    title: {
      es: 'Estrategia de marca: cinco ideas que nos definen',
      en: 'Brand strategy: five ideas that define us',
    },
    date: {
      es: '24 julio 2026',
      en: 'July 24, 2026',
    },
    intro: {
      es: 'Por qué existimos, qué somos, qué creemos y cómo trabajamos. La base de marca que guía el producto y el tono, antes de abrir Figma.',
      en: 'Why we exist, what we are, what we believe, and how we work. The brand foundation that steers the product and the tone, before opening Figma.',
    },
    thumb: 'video',
    videoSrc: {
      es: 'assets/thumbnails/estrategia-marca-es.mp4',
      en: 'assets/thumbnails/estrategia-marca-en.mp4',
    },
    to: '/estrategia-marca',
  },
  {
    slug: 'ui-moderno-2026',
    collection: 'methodology',
    darkThumb: true,
    eyebrow: {
      es: 'INVESTIGACIÓN · UI 2026',
      en: 'RESEARCH · UI 2026',
    },
    title: {
      es: '¿Qué es UI moderna en 2026? La base de investigación del rediseño de Afi',
      en: 'What is modern UI in 2026? The research behind Afi\'s redesign',
    },
    date: {
      es: '24 junio 2026',
      en: 'June 24, 2026',
    },
    intro: {
      es: 'El encargo decía «moderno»; fuimos a averiguar qué significa. Convertir un adjetivo en definición: cómo se ven las interfaces, cómo se comportan, qué las sostiene — y cinco compromisos que se nos pueden auditar.',
      en: 'The brief said "modern"; we went looking for what that means. Turning an adjective into a definition: how interfaces look, how they behave, what holds them together — and five commitments you can hold us to.',
    },
    thumb: 'video',
    // Language-specific renders of the Modern UI graphic (July 2026 upload).
    videoSrc: {
      es: 'assets/thumbnails/ui-moderno-2026-es.mp4',
      en: 'assets/thumbnails/ui-moderno-2026-en.mp4',
    },
  },
  {
    slug: 'wealth-planner-2026',
    collection: 'blog',
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
  darkThumb?: boolean;
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
  private readonly route = inject(ActivatedRoute);
  readonly lang = this.language.lang;

  /**
   * The landing this instance renders. Set via route `data.collection`
   * (/metodologia → 'methodology'); defaults to 'blog'. One component, two
   * surfaces — filtered from the shared POSTS list.
   */
  private readonly collection = toSignal(
    this.route.data.pipe(map((d) => (d['collection'] as Collection) ?? 'blog')),
    { initialValue: 'blog' as Collection },
  );

  /** Methodology renders the centered Design-at-Afi hero instead of the blog header. */
  readonly isMethodology = computed(() => this.collection() === 'methodology');

  readonly headerCopy = computed(() => {
    const isEn = this.lang() === 'en';
    if (this.collection() === 'methodology') {
      // Design at Afi hero — Figma AFI-FOUNDATIONS-MODERN 2975:9948.
      return {
        eyebrow: '',
        title: isEn ? 'Documenting our new era' : 'Documentamos nuestra nueva era',
        intro: isEn
          ? 'We\'re entering a new chapter of technology, where design is what sets you apart. This is how the Afi design team works now, documented as it happens.'
          : 'Entramos en un nuevo capítulo de la tecnología, en el que el diseño es lo que marca la diferencia. Así trabaja ahora el equipo de diseño de Afi, documentado en tiempo real.',
      };
    }
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
    const active = this.collection();
    return POSTS.filter((p) => p.collection === active).map((p) => ({
      slug: p.slug,
      eyebrow: isEn ? p.eyebrow.en : p.eyebrow.es,
      title: isEn ? p.title.en : p.title.es,
      date: isEn ? p.date.en : p.date.es,
      intro: isEn ? p.intro.en : p.intro.es,
      thumb: p.thumb,
      videoSrc: typeof p.videoSrc === 'string' ? p.videoSrc : p.videoSrc?.[isEn ? 'en' : 'es'],
      videoPoster: p.videoPoster,
      to: p.to,
      darkThumb: p.darkThumb,
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
