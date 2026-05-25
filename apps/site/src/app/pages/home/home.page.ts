import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent, LogoComponent } from '@coherence/ui';

interface WorkCard {
  routerLink: string;
  eyebrow: string;
  title: string;
  blurb: string;
  thumb: 'wealth-planner' | 'sarevi' | 'whitelabel';
}

@Component({
  selector: 'site-home',
  standalone: true,
  imports: [RouterLink, LogoComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  readonly recentWork: WorkCard[] = [
    {
      routerLink: '/demos/wealth-planner-2026',
      eyebrow: 'DEMO · DIGITAL SOLUTIONS',
      title: 'Wealth Planner 2026',
      blurb:
        'Rediseño completo — patrimonio, evolución y simulación. Cinco iteraciones con seniors.',
      thumb: 'wealth-planner',
    },
    {
      routerLink: '/demos/laboral-kutxa-sarevi',
      eyebrow: 'DEMO · WHITE-LABEL',
      title: 'Laboral Kutxa Sarevi',
      blurb:
        'Simulador de eficiencia energética sobre Coherence DS aplicando la paleta magenta + berenjena + verde de LK.',
      thumb: 'sarevi',
    },
    {
      routerLink: '/blog/mixin-brand-bind',
      eyebrow: 'BLOG · TOKENS',
      title: 'White-label en una línea',
      blurb:
        'Cómo el mixin coherence-brand-bind colapsa 90 líneas de mapeo por marca en un @include de 8.',
      thumb: 'whitelabel',
    },
  ];
}
