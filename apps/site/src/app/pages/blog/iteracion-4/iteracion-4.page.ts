import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../../../components/section-header';
import { OnThisPageComponent, type TocItem } from '../../demos/shared/on-this-page.component';

type TaskStatus = 'Pendiente' | 'En curso' | 'Hecho';
type TaskSource =
  | 'Brief 1 — listado-planificaciones'
  | 'Brief 2 — demo-overview-tabs'
  | 'Brief 3 — responsive-chrome'
  | 'Brief 4 — clientes-multi-cliente';

type Task = {
  text: string;
  status: TaskStatus;
  source: TaskSource;
  href?: string;
};

type Surface = {
  id: string;
  title: string;
  eyebrow: string;
  snippet: string;
  tasks: Task[];
};

@Component({
  selector: 'site-iteracion-4-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
    OnThisPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './iteracion-4.page.html',
  styleUrls: ['./iteracion-4.page.scss'],
})
export class Iteracion4Page {
  get tocSections(): TocItem[] {
    return this.surfaces.map((s) => ({ id: s.id, label: s.title }));
  }

  readonly surfaces: Surface[] = [
    {
      id: 'listado',
      title: 'Listado de planificaciones',
      eyebrow: 'AWP · Página',
      snippet:
        'Nueva página /listado-planificaciones — hub por cliente con sus planificaciones (creada, nombre, estado, gestor). Punto de entrada al flujo de simulación.',
      tasks: [],
    },
    {
      id: 'documentacion-demo',
      title: 'Documentación demo',
      eyebrow: 'AWP · Demo overview',
      snippet:
        'Tres pestañas nuevas en /demos/wealth-planner-2026: Documento funcional, Semántica CSS y User personas. Estructura primero, contenido en próximas iteraciones.',
      tasks: [],
    },
    {
      id: 'responsive',
      title: 'Responsive',
      eyebrow: 'AWP · Chrome',
      snippet:
        'Sidebar colapsable a hamburguesa en breakpoints estrechos, escala de padding consistente entre páginas. Familia es la referencia visual.',
      tasks: [],
    },
    {
      id: 'multi-cliente',
      title: 'Multi-cliente',
      eyebrow: 'AWP · Flujo · Diferido',
      snippet:
        'Página /clientes + parametrización del listado por cliente. Brief diferido — se activa después de que aterrice el listado de planificaciones.',
      tasks: [],
    },
  ];

  readonly totalTasks = computed(() =>
    this.surfaces.reduce((acc, s) => acc + s.tasks.length, 0),
  );
  readonly doneCount = computed(() =>
    this.surfaces.reduce(
      (acc, s) => acc + s.tasks.filter((t) => t.status === 'Hecho').length,
      0,
    ),
  );
  readonly pendingCount = computed(() =>
    this.surfaces.reduce(
      (acc, s) => acc + s.tasks.filter((t) => t.status === 'Pendiente').length,
      0,
    ),
  );
  readonly enCursoCount = computed(() =>
    this.surfaces.reduce(
      (acc, s) => acc + s.tasks.filter((t) => t.status === 'En curso').length,
      0,
    ),
  );
}
