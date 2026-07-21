import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { LanguageService } from '../../services/language.service';

type Thumb = 'whitelabel' | 'talk' | 'video';

/**
 * Which landing surface a post belongs to. `methodology` = the redesign-series
 * narrative (Modern UI → Brand & personas → Information architecture), shown on
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
  /** Optional video src (relative to /assets); only used when thumb === 'video'. */
  videoSrc?: string;
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
    slug: 'arquitectura-informacion',
    collection: 'methodology',
    darkThumb: true,
    eyebrow: {
      es: 'PRODUCTO · ARQUITECTURA DE LA INFORMACIÓN',
      en: 'PRODUCT · INFORMATION ARCHITECTURE',
    },
    title: {
      es: 'Wealth Planner: arquitectura de la información',
      en: 'Wealth Planner: information architecture',
    },
    date: {
      es: '20 julio 2026',
      en: 'July 20, 2026',
    },
    intro: {
      es: 'Puedes modernizar los componentes y seguir sin tener una plataforma moderna. Por qué el flujo del Wealth Planner refleja cómo se construye un plan — y no cómo lo usan los asesores.',
      en: 'You can modernize the components and still not have a modern platform. Why the Wealth Planner\'s flow reflects how a plan gets built — not how advisors use it.',
    },
    thumb: 'talk',
  },
  {
    slug: 'brand-and-personas',
    collection: 'methodology',
    darkThumb: true,
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
    videoSrc: 'assets/thumbnails/ui-moderno-2026.mp4',
    videoPoster: 'assets/thumbnails/ui-moderno-2026-poster.jpg',
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

  readonly headerCopy = computed(() => {
    const isEn = this.lang() === 'en';
    if (this.collection() === 'methodology') {
      return {
        eyebrow: isEn ? 'METHODOLOGY' : 'METODOLOGÍA',
        title: isEn ? 'How we design' : 'Cómo diseñamos',
        intro: isEn
          ? 'The redesign series — the research, the brand and personas, and the information architecture behind Afi\'s modern platform. Read in order or dip in.'
          : 'La serie del rediseño — la investigación, la marca y las personas, y la arquitectura de la información detrás de la plataforma moderna de Afi. Léela en orden o entra por donde quieras.',
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
      videoSrc: p.videoSrc,
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
