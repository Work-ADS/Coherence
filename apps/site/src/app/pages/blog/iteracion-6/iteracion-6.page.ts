import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../../../components/section-header';
import { OnThisPageComponent, type TocItem } from '../../demos/shared/on-this-page.component';

type TaskStatus = 'Pendiente' | 'En curso' | 'Hecho';
type TaskSource = 'Brief — wave-1-evolucion-comparada';

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
  selector: 'site-iteracion-6-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
    OnThisPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './iteracion-6.page.html',
  styleUrls: ['./iteracion-6.page.scss'],
})
export class Iteracion6Page {
  get tocSections(): TocItem[] {
    return this.surfaces.map((s) => ({ id: s.id, label: s.title }));
  }

  readonly surfaces: Surface[] = [
    {
      id: 'shell',
      title: 'Envuelta en <site-objetivos-page-shell> + slot discipline',
      eyebrow: 'AWP · Chrome',
      snippet:
        'La página vivía como un <div class="h-screen flex"> con sidebar y top-bar embebidos a mano y todos los controles aglutinados en slot="actions". Migración al shell compartido + reordenación de slots según page-structure-skill §5/§9: slot=actions hospeda UNA acción página-wide (descargar como tabla HTML); slot=filters hospeda los selectores y la dropdown de ajustes; el body queda en el slot por defecto del page-header. Página single-section, sin cabecera intermedia del gráfico (el page-header ES el título).',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Reemplazado el <div class="h-screen flex bg-canvas-base"> + <site-planner-sidebar> + <site-planner-top-bar> por <site-objetivos-page-shell> con activeKey="evolucion-comparada".',
          href: '/demos/wealth-planner-2026/evolucion-patrimonial',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'slot="actions" → un único <afi-icon-button> de descarga (genera una tabla HTML del gráfico y dispara el download). slot="filters" → 3 chip-dropdowns + ajustes. Body en el default slot del page-header (Shape A, page-structure-skill §4b).',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Removido el <afi-graph-card-header> intermedio (título redundante en una página single-section) y todo el toggle V1/V2/V3 page-level.',
        },
      ],
    },
    {
      id: 'palette',
      title: 'Paleta canónica del gráfico',
      eyebrow: 'AWP · Data-viz',
      snippet:
        'El gráfico consumía paletas legacy (v1/v2/v3) heredadas del A/B de Q1. La winner del 2026-Q2 quedó locked como --chart-stacked-{1..7}; ahora el chart recibe palette="a" hard-coded y TODOS_SERIES (los 3 escenarios superpuestos) leen también desde el set canónico.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: '<afi-evolucion-bar-chart [palette]="\'a\'"> en lugar de [palette]="version()" — el chart deja de depender del switcher de capa página.',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'TODOS_SERIES (evolucion-bar-chart.component.ts:159-163): pesimista → --chart-stacked-5, medio → --chart-stacked-1, optimista → --chart-stacked-3. Jerarquía perceptual preservada (medio = ancla, optimista = mid, pesimista = lightest).',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Marcadores (diamond / square / circle) sin tocar — color emparejado con forma per data-viz-skill (el color nunca es la única pista).',
        },
      ],
    },
    {
      id: 'chips',
      title: 'Filtros como chip-dropdowns (patrón Patrimonio)',
      eyebrow: 'AWP · Filtros',
      snippet:
        'Vista / Escenario / Detalle dejan de ser <afi-select> y pasan al patrón chip-dropdown que Patrimonio usa para Tipo / Entidad: un trigger pill-shaped con label + valor + chevron que abre un <afi-menu> con las opciones (single-select). La caja "ajustes" (3 switches del gráfico) sigue siendo <afi-icon-button> + <afi-dropdown-panel> y vive en el mismo filter row.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Trigger del chip — botón nativo styled en SCSS con tokens: --control-h-sm, --radius-full, --border-hairline, --surface-base. Hover y aria-expanded cambian fondo y borde a --surface-muted / --color-action-700.',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Menú — <afi-menu [anchor]="triggerRef"> con <afi-menu-item label="…"> por opción. El anchor hace que el panel portee a document.body, escapa el overflow ancestor. Selección invoca selectVista/Escenario/Detalle y cierra el menú.',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Ajustes — <afi-icon-button> + <afi-dropdown-panel> con los 3 <afi-switch> existentes (mostrar objetivos / incluir patrimonio inmobiliario / mostrar hitos vitales). El popup vive en el filter row, no en actions (page-structure-skill §9).',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'El menú anterior de Accesibilidad (5 items no-op) queda eliminado — el flujo de "ver tabla / descargar CSV" se consolida en la acción de descarga del page-header. El resto (alto contraste / lectura fácil / describir gráfico) son features que merecen su propio brief.',
        },
      ],
    },
    {
      id: 'structure',
      title: 'Page-structure compliance',
      eyebrow: 'AWP · §4 + §11',
      snippet:
        'La página estaba en la lista de "audit candidates" de page-structure-skill §15. Adoptamos Shape A — body proyectado en el default slot del <afi-page-header>, alineado con el title via el padding --space-lg del primitivo. Wrapper compartido .page__wrap con --content-xl (1140px) y @container viewport para responsive.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Wrapper único — .page__wrap rodea page-header + body, no sólo el header (page-structure-skill §4a). Drop del max-w-[1180px] arbitrario.',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Shape A — graph-card-header + chart + legend + explainer viven dentro del <ng-content> default del page-header. Title y label de la card-header comparten left-edge (§13).',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: '@container viewport (max-width: 40rem) reemplaza cualquier @media de layout. La página responde al preview sizer del demo-shell, no a la ventana del navegador.',
        },
      ],
    },
    {
      id: 'tokens',
      title: 'Disciplina de tokens',
      eyebrow: 'AWP · Clean-code',
      snippet:
        'El template estaba lleno de utilidades Tailwind — text-body-sm, max-w-[1180px], gap-space-2, bg-surface-elevated. Clean-code.md §8 prohibe utilidades Tailwind para estilizado visual. SCSS BEM + var(--…) en todos los puntos de color, espaciado, radio, tipografía.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'page.scss reescrito desde el placeholder vacío (3 líneas) a ~80 líneas BEM .evcomp__ con tokens semánticos.',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Sidebar state — planner-sidebar flip de state: "empty" → state: this.store.evolucionComparadaState(). Store gana evolucionComparadaState computed (mirror de consecucionObjetivosState).',
        },
        {
          status: 'Hecho',
          source: 'Brief — wave-1-evolucion-comparada',
          text: 'Cero hex / rgba / px crudo introducido. Pre-commit verde (scripts/clean-code-check.sh).',
        },
      ],
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
