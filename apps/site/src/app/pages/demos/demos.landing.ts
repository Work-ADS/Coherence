import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SegmentedControlComponent, type SegmentedOption } from '@coherence/ui';

export type DemoTeam = 'digital-solutions' | 'communications';

export interface DemoCard {
  slug: string;
  title: string;
  intro: string;
  team: DemoTeam;
  status?: string;
  overviewRoute: string;
}

const DEMOS: DemoCard[] = [
  {
    slug: 'wealth-planner-2026',
    title: 'Wealth Planner 2026',
    intro:
      'Rediseño completo — patrimonio, evolución, simulación. Caso de estudio + demo interactivo.',
    team: 'digital-solutions',
    status: 'En curso',
    overviewRoute: '/demos/wealth-planner-2026',
  },
  {
    slug: 'laboral-kutxa-sarevi',
    title: 'Laboral kutxa sarevi',
    intro:
      'Simulador de eficiencia energética Sarevi 360 — rebrand del flujo sobre Coherence DS aplicando la paleta beige + berenjena + verde de Laboral Kutxa.',
    team: 'digital-solutions',
    status: 'Nuevo',
    overviewRoute: '/demos/laboral-kutxa-sarevi',
  },
  {
    slug: 'sarevi-unicaja',
    title: 'Sarevi Unicaja',
    intro:
      'Nueva versión del simulador Sarevi con marca Unicaja: Manrope, canvas blanco, controles tipo radio-card y acentos teal.',
    team: 'digital-solutions',
    status: 'Nuevo',
    overviewRoute: '/demos/sarevi-unicaja',
  },
];

const TEAM_OPTIONS: SegmentedOption[] = [
  { value: 'digital-solutions', label: 'Digital solutions' },
  { value: 'communications', label: 'Communications' },
];

@Component({
  selector: 'site-demos-landing',
  standalone: true,
  imports: [RouterLink, SegmentedControlComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demos.landing.html',
  styleUrl: './demos.landing.scss',
})
export class DemosLandingPage {
  readonly activeTeam = signal<DemoTeam>('digital-solutions');

  readonly teamOptions = TEAM_OPTIONS;

  readonly visibleDemos = computed<DemoCard[]>(() =>
    DEMOS.filter((d) => d.team === this.activeTeam()),
  );

  readonly emptyStateCopy = computed(() => {
    switch (this.activeTeam()) {
      case 'communications':
        return 'Próximamente — demos del equipo de Communications.';
      case 'digital-solutions':
      default:
        return 'Aún no hay demos publicados por este equipo.';
    }
  });

  setTeam(team: string | number | null): void {
    if (team === 'digital-solutions' || team === 'communications') {
      this.activeTeam.set(team);
    }
  }
}
