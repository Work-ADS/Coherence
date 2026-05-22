import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface BlogPost {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
}

const POSTS: BlogPost[] = [
  {
    slug: 'proceso-componente',
    title: 'Proceso de componentes',
    eyebrow: 'PROCESO',
    intro:
      'Cómo pasamos de "veo una necesidad de UI" a "spec listo para handoff". Primera entrada del blog.',
  },
  {
    slug: 'patrimonial-decisiones',
    title: 'Patrimonio — decisiones de diseño',
    eyebrow: 'CASO DE ESTUDIO',
    intro:
      'Registro detallado de las decisiones de chrome y contenido en la pantalla Patrimonio del Wealth Planner 2026.',
  },
  {
    slug: 'evolucion-patrimonial-decisiones',
    title: 'Evolución Patrimonial — decisiones de diseño',
    eyebrow: 'CASO DE ESTUDIO',
    intro:
      'Mismo registro para Evolución, cada decisión acompañada de un snippet "Ejemplo" en vivo.',
  },
  {
    slug: 'bitacora',
    title: 'Bitácora de iteraciones',
    eyebrow: 'REGISTRO',
    intro:
      'Lista plana de todos los cambios por iteración, con área afectada y estado.',
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
