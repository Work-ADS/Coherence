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
    slug: 'wealth-planner-2026',
    title: 'Wealth Planner 2026 — caso de estudio',
    eyebrow: 'CASO DE ESTUDIO',
    intro:
      'Decisiones de diseño y bitácora de iteraciones del rediseño completo. Patrimonio, Evolución, Bitácora — todo en una sola entrada con tabs.',
  },
  {
    slug: 'proceso-componente',
    title: 'Proceso de componentes',
    eyebrow: 'PROCESO',
    intro:
      'Cómo pasamos de "veo una necesidad de UI" a "spec listo para handoff". Primera entrada del blog.',
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
