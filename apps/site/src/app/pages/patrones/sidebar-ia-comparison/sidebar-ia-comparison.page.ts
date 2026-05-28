import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  LogoComponent,
  NavItemComponent,
  NavSectionComponent,
  SidebarComponent,
} from '@coherence/ui';

type SiteVariant = 'may19' | 'pre-may22' | 'ds-progress';
type SectionId = 'fundamentos' | 'componentes' | 'patrones' | 'recursos';
// 'todo' = task hasn't been done yet (open ring).
// 'update' = a related page got edited and this one needs review (solid dot).
// 'done' = no indicator shown at all.
type Status = 'todo' | 'update' | 'done';

interface VariantSpec {
  id: SiteVariant;
  label: string;
  date: string;
  tagline: string;
  rationale: string;
  whatChanged: string;
}

interface ProgressItem {
  label: string;
  href: string;
  status: Status;
}

interface ProgressSection {
  id: SectionId;
  label: string;
  href: string;
  icon: 'layers' | 'grid' | 'template' | 'book';
  items: ProgressItem[];
}

const VARIANTS: VariantSpec[] = [
  {
    id: 'may19',
    label: 'May 19',
    date: '2026-05-19',
    tagline: 'Sub-nav cambia según la sección activa',
    rationale:
      'Cada sección de nivel superior (Fundamentos / Componentes / Patrones / Recursos) muestra sus propios hijos. La barra lateral se reconfigura al navegar. El usuario sólo ve los enlaces relevantes al contexto.',
    whatChanged:
      'Original. Vivió en el repo desde el primer commit de app.component.html el 2026-05-19 hasta que el refactor de IA del 2026-05-22 la sustituyó por un sidebar plano.',
  },
  {
    id: 'pre-may22',
    label: 'Pre-May 22',
    date: '2026-05-22',
    tagline: 'Sidebar plano con dos secciones fijas',
    rationale:
      'Una sola lista de Components + Patterns que aparece en todas las páginas, idéntica. Más simple de mantener, pero descontextualizada — el sidebar no responde a dónde estés.',
    whatChanged:
      'Vino del refactor del 2026-05-22 (commit 1b7b632 — /novedades → /demos + team taxonomy). El sidebar plano duró pocos días: el 2026-05-25 se reemplazó por la versión actual que sí usa @switch para diferenciar Fundamentos / Demos / Default, pero ya sin el detalle de Patrones / Recursos del original.',
  },
  {
    id: 'ds-progress',
    label: 'Custom · DS-progress',
    date: 'propuesta',
    tagline: 'Títulos en mayúsculas + icono + indicador discreto a la derecha',
    rationale:
      'Sidebar plano (sin chevrons) que muestra TODAS las secciones a la vez. Cada cabecera lleva un icono distintivo y enlaza a la landing de la sección. Las páginas en buen estado no llevan indicador; sólo aparece un círculo a la derecha cuando hay algo que atender — anillo abierto = pendiente por hacer, círculo lleno = otra página relacionada ha cambiado y conviene revisar ésta. Se renderiza en dos tonos para ver cómo queda sobre fondo claro y sobre el azul-profundo del planner sidebar.',
    whatChanged:
      'No existe en el repo todavía — esta variante recoge la versión que recordabas (mayúsculas, indicadores de estado a la derecha, sin chevron, icono por sección, dos temas). Si la eliges la implementamos en app.component.html.',
  },
];

const DS_PROGRESS_SECTIONS: ProgressSection[] = [
  {
    id: 'fundamentos',
    label: 'Fundamentos',
    href: '/fundamentos',
    icon: 'layers',
    items: [
      { label: 'Color', href: '/fundamentos/color', status: 'done' },
      { label: 'Tipografía', href: '/fundamentos/tipografia', status: 'update' },
      { label: 'Espacio', href: '/fundamentos/espacio', status: 'done' },
      { label: 'Movimiento', href: '/fundamentos/movimiento', status: 'done' },
      { label: 'Accesibilidad', href: '/fundamentos/accesibilidad', status: 'todo' },
    ],
  },
  {
    id: 'componentes',
    label: 'Componentes',
    href: '/componentes',
    icon: 'grid',
    items: [
      { label: 'Button', href: '/componentes/button', status: 'done' },
      { label: 'Input', href: '/componentes/input', status: 'done' },
      { label: 'Checkbox', href: '/componentes/checkbox', status: 'update' },
      { label: 'Card', href: '/componentes/card', status: 'done' },
      { label: 'Modal', href: '/componentes/modal', status: 'done' },
      { label: 'Drawer', href: '/componentes/drawer', status: 'done' },
      { label: 'Table', href: '/componentes/table', status: 'done' },
      { label: 'Tabs', href: '/componentes/tabs', status: 'done' },
      { label: 'Sidebar', href: '/componentes/sidebar', status: 'done' },
      { label: 'Nav Item', href: '/componentes/nav-item', status: 'todo' },
      { label: 'Nav Section', href: '/componentes/nav-section', status: 'todo' },
      { label: 'Page Header', href: '/componentes/page-header', status: 'done' },
      { label: 'Shell', href: '/componentes/shell', status: 'done' },
      { label: 'Menu', href: '/componentes/menu', status: 'done' },
      { label: 'Filter Chip', href: '/componentes/filter-chip', status: 'todo' },
      { label: 'Search', href: '/componentes/search', status: 'todo' },
    ],
  },
  {
    id: 'patrones',
    label: 'Patrones',
    href: '/patrones',
    icon: 'template',
    items: [
      { label: 'Shells', href: '/patrones/shells', status: 'done' },
      { label: 'Cabeceras', href: '/patrones/cabeceras', status: 'done' },
      { label: 'Gráficos', href: '/patrones/graficos', status: 'update' },
      { label: 'Tablas', href: '/patrones/tablas', status: 'done' },
      { label: 'Tarjetas', href: '/patrones/tarjetas', status: 'todo' },
      { label: 'Selectores', href: '/patrones/selectores', status: 'done' },
      { label: 'Flujos', href: '/patrones/flujos', status: 'todo' },
    ],
  },
  {
    id: 'recursos',
    label: 'Recursos',
    href: '/recursos',
    icon: 'book',
    items: [
      { label: 'Descargas', href: '/recursos/descargas', status: 'todo' },
      { label: 'Changelog', href: '/recursos/changelog', status: 'update' },
      { label: 'Roadmap', href: '/recursos/roadmap', status: 'todo' },
      { label: 'FAQ', href: '/recursos/faq', status: 'todo' },
    ],
  },
];

@Component({
  selector: 'site-sidebar-ia-comparison-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-ia-comparison.page.html',
  styleUrl: './sidebar-ia-comparison.page.scss',
  imports: [SidebarComponent, NavSectionComponent, NavItemComponent, LogoComponent],
})
export class SidebarIaComparisonPage {
  readonly variants = VARIANTS;
  readonly selectedVariant = signal<SiteVariant>('may19');
  readonly may19Section = signal<SectionId>('componentes');
  readonly dsProgressSections = DS_PROGRESS_SECTIONS;

  readonly selectedSpec = computed(
    () => this.variants.find((v) => v.id === this.selectedVariant())!,
  );

  readonly sectionOptions: { value: SectionId; label: string }[] = [
    { value: 'fundamentos', label: 'Fundamentos' },
    { value: 'componentes', label: 'Componentes' },
    { value: 'patrones', label: 'Patrones' },
    { value: 'recursos', label: 'Recursos' },
  ];

  // ── May 19 — sub-nav per active section ────────────────────────────────────

  readonly may19Fundamentos: { label: string; href: string }[] = [
    { label: 'Color', href: '/fundamentos/color' },
    { label: 'Typography', href: '/fundamentos/tipografia' },
    { label: 'Space', href: '/fundamentos/espacio' },
    { label: 'Motion', href: '/fundamentos/movimiento' },
    { label: 'Accessibility', href: '/fundamentos/accesibilidad' },
  ];

  // Componentes — split in "Ready" + "All" groups per the May 19 source.
  readonly may19ComponentesReady: { label: string; href: string }[] = [
    { label: 'IconButton', href: '/componentes/icon-button' },
    { label: 'Avatar', href: '/componentes/avatar' },
    { label: 'SegmentedControl', href: '/componentes/segmented-control' },
    { label: 'DropdownPanel', href: '/componentes/dropdown-panel' },
    { label: 'EditableText', href: '/componentes/editable-text' },
    { label: 'TopBar', href: '/componentes/top-bar' },
    { label: 'Tooltip', href: '/componentes/tooltip' },
    { label: 'Toast', href: '/componentes/toast' },
  ];
  readonly may19ComponentesAll: { label: string; href: string }[] = [
    { label: 'Button', href: '/componentes/button' },
    { label: 'Input', href: '/componentes/input' },
    { label: 'Select', href: '/componentes/select' },
    { label: 'Checkbox', href: '/componentes/checkbox' },
    { label: 'Switch', href: '/componentes/switch' },
    { label: 'RadioGroup', href: '/componentes/radio-group' },
    { label: 'Card', href: '/componentes/card' },
    { label: 'Modal', href: '/componentes/modal' },
    { label: 'Tabs', href: '/componentes/tabs' },
    { label: 'Table', href: '/componentes/table' },
    { label: 'Drawer', href: '/componentes/drawer' },
    { label: 'Sidebar', href: '/componentes/sidebar' },
    { label: 'NavItem', href: '/componentes/nav-item' },
    { label: 'StatusChip', href: '/componentes/status-chip' },
    { label: 'Badge', href: '/componentes/badge' },
    { label: 'LoadingOverlay', href: '/componentes/loading-overlay' },
    { label: 'PageHeader', href: '/componentes/page-header' },
    { label: 'Shell', href: '/componentes/shell' },
    { label: 'Kbd', href: '/componentes/kbd' },
    { label: 'NavSection', href: '/componentes/nav-section' },
    { label: 'Menu', href: '/componentes/menu' },
  ];

  readonly may19Patrones: { label: string; href: string }[] = [
    { label: 'Shells', href: '/patrones/shells' },
    { label: 'Flujos', href: '/patrones/flujos' },
    { label: 'Gráficos', href: '/patrones/graficos' },
    { label: 'Tarjetas', href: '/patrones/tarjetas' },
    { label: 'Cabeceras', href: '/patrones/cabeceras' },
    { label: 'Tablas', href: '/patrones/tablas' },
    { label: 'Sidebar', href: '/patrones/sidebar-decisiones' },
    { label: 'Top Bar', href: '/patrones/nav-bar-decisiones' },
    { label: 'Diálogo', href: '/patrones/dialog-decisiones' },
  ];

  readonly may19Recursos: { label: string; href: string }[] = [
    { label: 'Descargas', href: '/recursos/descargas' },
    { label: 'Changelog', href: '/recursos/changelog' },
    { label: 'Roadmap', href: '/recursos/roadmap' },
    { label: 'FAQ', href: '/recursos/faq' },
  ];

  // ── Pre-May-22 — flat curated sidebar (always the same) ───────────────────

  readonly preMay22Components: { label: string; href: string }[] = [
    { label: 'Logo', href: '/componentes/logo' },
    { label: 'Segmented Control', href: '/componentes/segmented-control' },
    { label: 'Tabs', href: '/componentes/tabs' },
    { label: 'Nav Item', href: '/componentes/nav-item' },
    { label: 'Icon Button', href: '/componentes/icon-button' },
    { label: 'Inline Edit', href: '/componentes/inline-edit' },
    { label: 'Status Chip', href: '/componentes/status-chip' },
    { label: 'Filter Chip', href: '/componentes/filter-chip' },
  ];

  readonly preMay22Patterns: { label: string; href: string }[] = [
    { label: 'Sidebar', href: '/componentes/sidebar' },
    { label: 'Headers', href: '/patrones/cabeceras/cabecera-de-pagina' },
    { label: 'Dropdown', href: '/patrones/selectores/dropdown' },
  ];
}
