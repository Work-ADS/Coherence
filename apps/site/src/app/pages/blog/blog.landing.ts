import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../services/language.service';

type Thumb = 'whitelabel' | 'talk';

interface BlogPost {
  slug: string;
  eyebrow: { es: string; en: string };
  title: { es: string; en: string };
  date: { es: string; en: string };
  intro: { es: string; en: string };
  thumb: Thumb;
  /** Optional route override; defaults to `/blog/<slug>`. */
  to?: string;
}

// Most-recent first. Other historical posts (decisiones-* / iteracion-* /
// bitácora) moved under their demo case studies — they aren't standalone
// editorial pieces.
const POSTS: BlogPost[] = [
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
    thumb: 'whitelabel',
  },
  {
    slug: 'stitch-vs-claude',
    eyebrow: {
      es: 'REUNIÓN DE ÁREA · IA',
      en: 'AREA MEETING · AI',
    },
    title: {
      es: 'Stitch o Claude: qué herramienta de IA usamos para conceptos de cliente',
      en: 'Stitch or Claude: which AI tool we use for client concepts',
    },
    date: {
      es: '28 mayo 2026',
      en: 'May 28, 2026',
    },
    intro: {
      es: 'Mismo encargo, cuatro escenarios de marca y una recomendación al final. Presentación navegable con las flechas del teclado.',
      en: 'Same brief, four brand scenarios, one recommendation at the end. Keyboard-navigable slide deck.',
    },
    thumb: 'talk',
    to: '/talks/stitch-vs-claude',
  },
  {
    slug: 'mixin-brand-bind',
    eyebrow: {
      es: 'TOKENS · WHITE LABEL',
      en: 'TOKENS · WHITE LABEL',
    },
    title: {
      es: 'White label en una línea: el mixin coherence-brand-bind',
      en: 'White label in one line: the coherence-brand-bind mixin',
    },
    date: {
      es: '25 mayo 2026',
      en: 'May 25, 2026',
    },
    intro: {
      es: 'De 110 líneas de mapeos por marca a un @include de 8. Cómo cerramos la conversación de tokens del 22 de mayo sin tocar el contrato con programación.',
      en: 'From 110 lines of per-brand mappings to an 8-line @include. How we closed the token conversation from May 22 without touching the contract with engineering.',
    },
    thumb: 'whitelabel',
  },
];

interface ViewPost {
  slug: string;
  eyebrow: string;
  title: string;
  date: string;
  intro: string;
  thumb: Thumb;
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
      to: p.to,
    }));
  });
}
