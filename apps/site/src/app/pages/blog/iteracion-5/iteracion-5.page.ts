import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../../../components/section-header';
import { OnThisPageComponent, type TocItem } from '../../demos/shared/on-this-page.component';

type TaskStatus = 'Pendiente' | 'En curso' | 'Hecho';
type TaskSource = 'Brief — banco-cooperativo-redesign';

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
  selector: 'site-iteracion-5-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
    OnThisPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './iteracion-5.page.html',
  styleUrls: ['./iteracion-5.page.scss'],
})
export class Iteracion5Page {
  get tocSections(): TocItem[] {
    return this.surfaces.map((s) => ({ id: s.id, label: s.title }));
  }

  readonly surfaces: Surface[] = [
    {
      id: 'topbar',
      title: 'Topbar de dos bandas',
      eyebrow: 'BC · Chrome',
      snippet:
        'La cabecera del simulador queda en dos zonas visuales: banda verde-oscuro con el logo centrado de Banco Cooperativo Español sobre la fila superior, y banda clara con el stepper debajo. Reproducimos la imagen del producto vivo sin tocar el marcado de la página — el reflow se hace con CSS Grid scoping por marca.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: '.lk-topbar pasa a display:grid con áreas (brand-l / brand / brand-r) y (steps); pseudo-elemento ::before pinta la banda verde-oscuro sobre la fila 1 con align-self: stretch.',
          href: '/demos/sarevi-banco-cooperativo/demo',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Separador interno de la marca oculto en BC; "Sarevi 360" queda en blanco-90% sobre la banda oscura. El código de recuperación y "Descargar PDF" pasan a la derecha de la banda oscura con --color-white-a75.',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Layout de Laboral Kutxa + Unicaja sin cambios — el reflow de grid sólo aplica bajo .lk-sarevi--banco-cooperativo.',
        },
      ],
    },
    {
      id: 'stepper',
      title: 'Stepper con acento de espiga',
      eyebrow: 'BC · Stepper',
      snippet:
        'El stepper se mueve a la banda clara con círculos verde-cooperativo y un subrayado amarillo-espiga sobre la etiqueta del paso activo — la firma visual que el producto vivo del Banco Cooperativo usa en cada cabecera de sección y bajo el paso en curso.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Re-estilo del .step para banda clara: badges sólidos verde-cooperativo-500 para hecho/actual, contorno verde-cooperativo-300 para pendientes. Etiqueta verde-cooperativo-700 + 600 en el paso actual.',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Líneas conectoras entre badges con ::before/::after por step; primer y último escalan a transparente para no sobresalir.',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Subrayado espiga: ::after sobre .step--current .step__label, fondo amarillo-espiga-500, radio --radius-full — el acento BC sin imprimir un primitivo nuevo.',
        },
      ],
    },
    {
      id: 'section-headers',
      title: 'Cabeceras con espiga',
      eyebrow: 'BC · Tipografía',
      snippet:
        'Las cabeceras .surface-header__title del simulador llevan ahora un brushstroke amarillo-espiga de 128 px debajo, color verde-cooperativo-700 — la misma firma visible en cada bloque de la web pública del banco ("Información del cliente", "Resultados", etc.).',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Pseudo ::after en .surface-header__title scoped a BC: ancho --dimension-32, alto --dimension-0-75, fondo amarillo-espiga-500, radio --radius-full. H1 del welcome queda intacto — el acento es de cabeceras de sección.',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Regresión confirmada: Unicaja y Laboral Kutxa siguen sin pseudo-acento (afterContent: "none" verificado en runtime).',
        },
      ],
    },
    {
      id: 'tokens',
      title: 'Disciplina de tokens',
      eyebrow: 'BC · Tokens',
      snippet:
        'Todo el restyle pasa por tokens existentes de Banco Cooperativo. Nada de hex, rgb, rgba ni px crudos en la sección nueva — la arquitectura del token-set se mantiene intacta y los cambios son sólo de valor/scope.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Bloque [data-brand="banco-cooperativo"] de semantic.scss sin cambios estructurales — los slots semánticos existentes ya cubrían todo el chrome BC.',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Sin nuevos color steps en colors-banco-cooperativo.scss — verde-oscuro / verde-cooperativo / amarillo-espiga / neutral / neutral-variant cubren el rediseño completo.',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Grep "[#0-9a-f]{3,8}|rgb|rgba" sobre las adiciones del restyle: 0 hits. Todo color, espacio y radio pasa por var(--…).',
        },
      ],
    },
    {
      id: 'whitelabel',
      title: 'Validación whitelabel',
      eyebrow: 'BC · Arquitectura',
      snippet:
        'El simulador compartido LaboralKutxaSareviPage sirve tres marcas con el mismo componente, el mismo HTML y la misma lógica — sólo cambian los tokens y el SCSS condicional por marca. La iteración 5 demuestra que el contrato whitelabel sobrevive a un rediseño visual completo.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: '.lk-sarevi--banco-cooperativo absorbe todas las reglas del rediseño; .lk-sarevi--unicaja y la base LK quedan intactas. Regresión verificada en /demos/sarevi-unicaja/demo y /demos/laboral-kutxa-sarevi/demo.',
        },
        {
          status: 'Hecho',
          source: 'Brief — banco-cooperativo-redesign',
          text: 'Estructura Sarevi sin cambios: 4 pantallas (welcome → datos → medidas → resumen), mismos campos, mismas primitivas del DS. El alcance del brief se respeta — sólo cambia el look del recorrido BC.',
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
