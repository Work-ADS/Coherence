import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'site-fundamentos-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fundamentos.landing.html',
  styleUrl: './fundamentos.landing.scss',
})
export class FundamentosLandingPage {
  readonly foundations = [
    { slug: 'color', name: 'Color', description: 'Brand ramps, semantic roles, surfaces, signals. All in one place.' },
    { slug: 'tipografia', name: 'Typography', description: 'One family (Roboto Serif), hierarchy through weight + size + tracking.' },
    { slug: 'espacio', name: 'Space', description: '4px grid, dimension scale, semantic spacing, radius.' },
    { slug: 'movimiento', name: 'Motion', description: '3 durations, 3 easings, container-first animation.' },
    { slug: 'accesibilidad', name: 'Accessibility', description: 'Contrast, focus, ARIA, keyboard — shipped from day one.' },
  ];
}
