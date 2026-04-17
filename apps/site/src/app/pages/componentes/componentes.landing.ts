import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TeaserTileComponent } from '../../components/teaser-tile/teaser-tile.component';

@Component({
  selector: 'site-componentes-landing',
  standalone: true,
  imports: [TeaserTileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Components
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">
        Primitivos del sistema
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cada primitivo se construye en aislamiento, con accesibilidad completa,
        tokens como única fuente de estilo y documentación honesta.
      </p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-space-4">
        @for (p of primitives; track p.slug) {
          <site-teaser-tile
            [title]="p.name"
            [href]="'/componentes/' + p.slug"
            [description]="p.description" />
        }
      </div>
    </div>
  `,
})
export class ComponentesLandingPage {
  readonly primitives = [
    { slug: 'button', name: 'Button', description: '4 variantes, 3 tamaños, estado de carga' },
    { slug: 'input', name: 'Input', description: 'Texto, textarea, número, email, contraseña' },
    { slug: 'select', name: 'Select', description: 'Select nativo con optgroup' },
    { slug: 'checkbox', name: 'Checkbox', description: 'Nativo, indeterminado, 44px hit area' },
    { slug: 'switch', name: 'Switch', description: 'Botón role=switch con animación' },
    { slug: 'card', name: 'Card', description: '3 variantes: default, elevated, quiet' },
    { slug: 'modal', name: 'Modal', description: 'Dialog nativo, focus trap, backdrop' },
    { slug: 'tabs', name: 'Tabs', description: 'ARIA tablist, nav por teclado, badge' },
    { slug: 'table', name: 'Table', description: 'Sort, selección, estados vacío/carga' },
    { slug: 'drawer', name: 'Drawer', description: 'Panel lateral no bloqueante' },
    { slug: 'sidebar', name: 'Sidebar', description: '3 modos: static, collapsible, hover' },
    { slug: 'nav-item', name: 'NavItem', description: 'Icono + label + badge + tooltip' },
    { slug: 'status-chip', name: 'StatusChip', description: '8 estados, subtle/solid' },
    { slug: 'badge', name: 'Badge', description: '5 intents, modo dot, sm/md' },
    { slug: 'loading-overlay', name: 'LoadingOverlay', description: 'Spinner + line-reveal' },
    { slug: 'page-header', name: 'PageHeader', description: 'Chrome adaptativo con slots' },
    { slug: 'shell', name: 'Shell', description: '5 tipos via @switch dispatcher' },
  ];
}
