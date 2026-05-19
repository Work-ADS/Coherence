import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../shared/section-header.component';
import { OnThisPageComponent, type TocItem } from '../shared/on-this-page.component';

type TaskStatus = 'Pendiente' | 'En curso' | 'Hecho';
type TaskSource = 'Sesión modo oscuro 2026-05-19';

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
  selector: 'site-iteracion-3-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
    OnThisPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './iteracion-3.page.html',
  styleUrls: ['./iteracion-3.page.scss'],
})
export class Iteracion3Page {
  get tocSections(): TocItem[] {
    return this.surfaces.map((s) => ({ id: s.id, label: s.title }));
  }

  readonly surfaces: Surface[] = [
    {
      id: 'modo-oscuro',
      title: 'Modo oscuro',
      eyebrow: 'Foundations · DS',
      snippet:
        'Toggle en la sidebar, overrides semánticos completos y persistencia local. La cascada de tokens responde sola — los componentes que consumen roles semánticos no necesitan cambios.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Componente <site-theme-toggle /> con icono luna/sol, focus-visible y aria-pressed. SSR-safe vía isPlatformBrowser.',
        },
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Toggle montado en el footer cluster de la sidebar — accesible desde cualquier página del shell.',
        },
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Bloque [data-theme="dark"] en semantic.scss con 98 overrides: canvas, surfaces, foreground, border, control, input, nav, overlay, feedback, chart.',
        },
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Persistencia en localStorage (clave coherence-theme) — la preferencia sobrevive al reload.',
        },
        {
          status: 'Pendiente',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Decidir si activar el auto-modo según prefers-color-scheme. El bloque @media está preparado y comentado en semantic.scss; pendiente decisión de producto.',
        },
      ],
    },
    {
      id: 'tipografia',
      title: 'Tipografía',
      eyebrow: 'Foundations · Tokens',
      snippet:
        'Tres focos: arreglar el @import de Google Fonts mal colocado, eliminar los font-family/font-size hardcoded en sidebar y page-template, y dejar pendiente la decisión sobre las etiquetas a 11px de gráficos.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: '@import url(Google Fonts) movido fuera de styles.scss — ahora carga vía <link rel="stylesheet"> en index.html con preconnect. La posición anterior (después de una regla) era ignorada por la spec de CSS.',
        },
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'sidebar.scss: section-label y nav-link migrados a font: var(--type-body-sm-600) y font: var(--type-body-md-400). Letter-spacing usa var(--tracking-wider).',
        },
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'page-template.component.scss: eyebrow, title, role y .pt-why migrados a var(--type-body-sm-500) / var(--type-display) / var(--type-subtitle-body) / var(--type-body).',
        },
        {
          status: 'Pendiente',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Etiquetas a 11px en chart chrome y novedades top-bar (planner-sidebar, planner-top-bar, evolucion-bar-chart) — el scale más pequeño actual es 12px. Decidir: extender el scale con un token de "caption-xs" o aceptar 11px como chart chrome fuera del scale.',
        },
      ],
    },
    {
      id: 'elevacion',
      title: 'Elevación',
      eyebrow: 'Foundations · Tokens',
      snippet:
        'elevation.scss ya expone --elevation-none/sm/md/lg/xl, pero los valores son aproximaciones a mano. La sincronía contra "Primitive Elevation" en Figma (48 tokens) queda pendiente.',
      tasks: [
        {
          status: 'Hecho',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Verificado que ningún componente usa box-shadow literal — todos los usos pasan por --elevation-*. El swap a valores reales no romperá nada.',
        },
        {
          status: 'Pendiente',
          source: 'Sesión modo oscuro 2026-05-19',
          text: 'Exportar la colección "Primitive Elevation" del Figma de AFI (48 tokens) y reemplazar los placeholders en libs/tokens/elevation.scss. Las semánticas en semantic.scss se resolverán solas.',
        },
      ],
    },
  ];
}
