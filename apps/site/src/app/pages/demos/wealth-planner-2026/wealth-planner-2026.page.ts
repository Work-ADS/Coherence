import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ButtonComponent,
  TabItemComponent,
  TabsComponent,
} from '@coherence/ui';

import {
  DemoOverviewShellComponent,
  type DemoOverviewRelatedPost,
} from '../../../components/demo-overview-shell';
import { PersonaCardComponent } from '../../../components/persona-card';
import {
  buildSemanticCssString,
  exportSemanticCss,
} from '../../../utils/export-semantic-css';
import { AWP_PERSONAS, type Persona } from './data/personas';

/**
 * Wealth Planner 2026 — demo overview surface.
 *
 * Lives at /demos/wealth-planner-2026. Uses `<site-demo-overview-shell>`
 * for the hero + CTA + related-posts chrome, and projects three tabs into
 * the shell body:
 *
 *   1. **Visión general** — what the product is, who it's for, when it
 *      shipped, who built it.
 *   2. **Caso de estudio** — problems, solutions, processes. The narrative
 *      thread is "start with the hardest screens first".
 *   3. **Bitácora** — condensed change-log per iteration with links into
 *      the full per-iteration records preserved in /blog.
 */
@Component({
  selector: 'site-wealth-planner-2026-overview',
  standalone: true,
  imports: [
    RouterLink,
    DemoOverviewShellComponent,
    TabsComponent,
    TabItemComponent,
    ButtonComponent,
    PersonaCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wealth-planner-2026.page.html',
  styleUrl: './wealth-planner-2026.page.scss',
})
export class WealthPlannerOverviewPage {
  readonly activeTab = signal(0);

  /**
   * Inner sub-tab indices for the two product-scoped tabs (Documento
   * funcional, Semántica CSS). Each is independent so the user can leave
   * one on Familia while exploring the other on Listado.
   */
  readonly activeFuncionalSubTab = signal(0);
  readonly activeSemanticaSubTab = signal(0);

  readonly personas: Persona[] = AWP_PERSONAS;

  /**
   * Same content that "Descargar CSS semántico" produces — rendered inline
   * inside the Semántica CSS tab. Lazy: computed on first access so SSR
   * never touches the DOM probe.
   */
  private cachedSemanticCss: string | null = null;
  get semanticCss(): string {
    if (this.cachedSemanticCss == null) {
      this.cachedSemanticCss = buildSemanticCssString();
    }
    return this.cachedSemanticCss;
  }

  downloadSemanticCss(): void {
    exportSemanticCss();
  }

  readonly relatedPosts: DemoOverviewRelatedPost[] = [
    {
      title: 'Patrimonio — decisiones de diseño',
      slug: 'patrimonial-decisiones',
      eyebrow: 'BLOG',
      description:
        'Registro detallado de cada decisión de chrome y contenido en la pantalla Patrimonio.',
    },
    {
      title: 'Evolución Patrimonial — decisiones de diseño',
      slug: 'evolucion-patrimonial-decisiones',
      eyebrow: 'BLOG',
      description:
        'Mismo registro para Evolución, cada decisión acompañada de un snippet "Ejemplo".',
    },
    {
      title: 'Proceso de componentes',
      slug: 'proceso-componente',
      eyebrow: 'BLOG',
      description:
        'Cómo pasamos de "veo una necesidad" a un spec de primitivo listo para handoff.',
    },
  ];
}
