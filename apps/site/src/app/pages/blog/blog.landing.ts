import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type Thumb = 'whitelabel' | 'proceso' | 'talk';

interface BlogPost {
  slug: string;
  title: string;
  eyebrow: string;
  date: string;
  intro: string;
  thumb: Thumb;
  /** Optional route override; defaults to `/blog/<slug>`. */
  to?: string;
}

// Most-recent first. Other historical posts (decisiones-* / iteracion-* /
// bitácora) moved under their demo case studies — they aren't standalone
// editorial pieces.
const POSTS: BlogPost[] = [
  {
    slug: 'stitch-vs-claude',
    title: 'Stitch vs Claude: ¿qué herramienta de IA usamos para conceptos de cliente?',
    eyebrow: 'REUNIÓN DE ÁREA · IA',
    date: '28 mayo 2026',
    intro:
      'Probamos las dos herramientas con el mismo encargo, cinco contextos de marca y una recomendación al final. Slide-show navegable con las flechas del teclado.',
    thumb: 'talk',
    to: '/talks/stitch-vs-claude',
  },
  {
    slug: 'mixin-brand-bind',
    title: 'White-label en una línea: el mixin coherence-brand-bind',
    eyebrow: 'TOKENS · WHITE-LABEL',
    date: '25 mayo 2026',
    intro:
      'De 90 líneas de mapeos por marca a un @include de 8 líneas. Cómo el mixin resuelve la conversación de tokens del meeting del 22 de mayo sin romper el contrato con programación.',
    thumb: 'whitelabel',
  },
  {
    slug: 'proceso-componente',
    title: 'Proceso de componentes',
    eyebrow: 'PROCESO',
    date: '12 mayo 2026',
    intro:
      'Cómo pasamos de "veo una necesidad de UI" a "spec listo para handoff". Primera entrada del blog.',
    thumb: 'proceso',
  },
];

@Component({
  selector: 'site-blog-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './blog.landing.html',
  styleUrl: './blog.landing.scss',
})
export class BlogLandingPage {
  readonly posts = POSTS;
}
