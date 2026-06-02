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
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: 'Página /listado-planificaciones (3 archivos) con <site-demo-shell> + <site-planner-top-bar> + page header + tabla a mano (badges por estado con intent distinto por fila).',
          href: '/listado-planificaciones',
        },
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: 'WealthPlannerStore extendido — tipos Planificacion + PlanificacionEstado, signal con 3 filas semilla (activa, borrador, archivada), mutaciones add / rename / duplicar / archivar.',
        },
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: '5 decisiones cerradas en el brief 2026-05-27: chrome con <site-demo-shell>, acciones Abrir·Editar nombre·Duplicar·Archivar, nueva planificación hereda Información básica del cliente, intents success/info/neutral, orden inverso-cronológico sin filtros.',
        },
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: 'Modal "Nueva planificación" (solo input nombre) + modal de confirmación de archivado + edición inline del nombre con Enter/Escape.',
        },
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: 'Click en fila → /demos/wealth-planner-2026/familia. Enlace "Ir al listado" en <site-planner-top-bar> repuntado por defecto a la nueva ruta.',
        },
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: 'Renombrado del cliente seed: "Manuel González Sánchez" / "Ricard Vazquez Fajardo" → "Ricardo Vázquez Pérez" en 8 archivos. Cliente identidad ahora seeded en el store (Información básica precargada cross-planificación).',
        },
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: 'Fix transversal: <afi-radio-group> alinea su legend con <afi-input>/<afi-select> (tamaño body-sm + asterisco rojo separado).',
        },
        {
          status: 'Hecho',
          source: 'Brief 1 — listado-planificaciones',
          text: 'Toast "Información del cliente prerellenada" tras Nueva planificación. NotificationStore mínimo (single-slot queue, providedIn root) en apps/site/src/app/services/, familia lo consume en su constructor y reutiliza el <afi-toast> existente con showInfo (5 s en lugar de los 2.5 s del save toast).',
        },
        {
          status: 'Pendiente',
          source: 'Brief 3 — responsive-chrome',
          text: 'Listado a <768 px: tabla overflowea horizontalmente, top-bar y header se aprietan. Se atiende junto con el resto de AWP en Brief 3.',
        },
      ],
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
