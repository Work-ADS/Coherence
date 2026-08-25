// external
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

// internal (libs)
import { CardV2Component, TagV2Component } from '@coherence/ui';

// relative
import { LanguageService } from '../../services/language.service';

/** A string the site carries in both locales. */
interface Localized {
  es: string;
  en: string;
}

export interface DemoCard {
  slug: string;
  title: Localized;
  intro: Localized;
  /** Which identity system the demo showcases — drives the landing grouping. */
  system: 'v2' | 'traditional';
  status?: Localized;
  overviewRoute: string;
}

/** A DemoCard resolved to the active locale — what the template renders. */
interface ViewDemo {
  slug: string;
  title: string;
  intro: string;
  system: 'v2' | 'traditional';
  status?: string;
  overviewRoute: string;
}

const DEMOS: DemoCard[] = [
  // NOTE: 'nueva-simulacion-overview' is intentionally NOT listed here yet —
  // the page + route exist at /demos/nueva-simulacion-overview for iteration,
  // but it's hidden from the demos landing until the look is ready.
  // NOTE: the Sarevi demos (laboral-kutxa-sarevi, sarevi-unicaja) and AWM are
  // hidden from the landing (2026-07-22) — routes stay live for direct links.
  // NOTE: the panel-asesor cards (hero-lab, producto, editorial, trazos) and the
  // foundations-modern workbench are hidden from the landing (2026-07-28) while
  // Demo 1 is the single v2 card — routes stay live for direct links.
  {
    slug: 'demo-1',
    // Product names carry across locales unchanged; the pair is kept so a
    // future card whose name DOES translate needs no shape change.
    title: { es: 'Demo 1', en: 'Demo 1' },
    intro: {
      es: 'Primer dashboard de la reestructura: el desglose del patrimonio sobre la banda de composición, con el resto de bloques como marcadores.',
      en: 'First dashboard of the restructure: the wealth breakdown over the composition band, with the remaining blocks as placeholders.',
    },
    system: 'v2',
    status: { es: 'En curso', en: 'In progress' },
    overviewRoute: '/demos/demo-1',
  },
  {
    slug: 'wealth-planner-2026',
    title: { es: 'Wealth Planner 2026', en: 'Wealth Planner 2026' },
    intro: {
      es: 'Rediseño completo — patrimonio, evolución, simulación. Entra por el listado de planificaciones del cliente.',
      en: "Full redesign — wealth, evolution, simulation. Start from the client's plan listing.",
    },
    system: 'traditional',
    status: { es: 'Identidad tradicional', en: 'Traditional identity' },
    // Card lands on the listado (the per-cliente hub). The overview
    // (case study + bitácora + documento funcional + tokens) is still
    // reachable at /demos/wealth-planner-2026 for direct links.
    overviewRoute: '/listado-planificaciones',
  },
];

/**
 * Demos landing — identity v2 (foundations-modern).
 *
 * «Productos»: the v2 demos as action cards (card-v2 + tag-v2 inside a
 * routerLink), then the «AFI tradicional» divider with the legacy-identity
 * demos beneath. Single view — the team switch was retired 2026-07-22.
 *
 * Bilingual as of 2026-08-25: this is a landing surface, so it follows the
 * site chrome's ES/EN toggle. The demo surfaces it links to stay Spanish.
 * Copy resolves here, in a computed — the template never reads `lang()`.
 */
@Component({
  selector: 'site-demos-landing',
  standalone: true,
  imports: [RouterLink, CardV2Component, TagV2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demos.landing.html',
  styleUrl: './demos.landing.scss',
})
export class DemosLandingPage {
  private readonly language = inject(LanguageService);
  readonly lang = this.language.lang;

  readonly headerCopy = computed(() => {
    const en = this.lang() === 'en';
    return {
      title: en ? 'Products' : 'Productos',
      subtitle: en
        ? 'Complete flows. Each demo shows interactive designs.'
        : 'Flujos completos. Cada demo muestra diseños interactivos.',
      traditional: en ? 'Traditional AFI' : 'AFI tradicional',
    };
  });

  private readonly demos = computed<ViewDemo[]>(() => {
    const lang = this.lang();
    return DEMOS.map((demo) => ({
      slug: demo.slug,
      title: demo.title[lang],
      intro: demo.intro[lang],
      system: demo.system,
      status: demo.status?.[lang],
      overviewRoute: demo.overviewRoute,
    }));
  });

  readonly v2Demos = computed(() => this.demos().filter((d) => d.system === 'v2'));
  readonly traditionalDemos = computed(() =>
    this.demos().filter((d) => d.system === 'traditional'),
  );
}
