import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  LogoComponent,
  NavItemComponent,
  NavSectionComponent,
  SidebarComponent,
} from '@coherence/ui';

type SiteVariant = 'may19' | 'pre-may22';
type SectionId = 'fundamentos' | 'componentes' | 'patrones' | 'recursos';

interface VariantSpec {
  id: SiteVariant;
  label: string;
  date: string;
  tagline: string;
  rationale: string;
  whatChanged: string;
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
