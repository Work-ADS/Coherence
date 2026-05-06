import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PatternPageComponent } from '../../_shared/pattern-page.component';
import {
  AtomCardComponent,
  type AtomSpec,
} from '../../_shared/atom-card.component';
import type { PrimitiveRef } from '../../_shared/primitives-used.component';

@Component({
  selector: 'site-top-bar-pattern-page',
  standalone: true,
  imports: [PatternPageComponent, AtomCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <site-pattern-page
      title="Top bar (nav bar)"
      subtitle="Chrome superior del Wealth Planner — identidad de la planificación a la izquierda, acciones globales a la derecha. Página-scope vive en el body; el top bar siempre habla de la simulación entera."
      eyebrow="Patrones · Cabeceras"
    >
      <!-- ============================================ -->
      <!-- Handoff tab                                  -->
      <!-- ============================================ -->
      <div slot="handoff" class="flex flex-col gap-space-6">
        <p class="text-body-md text-neutral-600 max-w-[760px]">
          Siete átomos. Cada tarjeta enumera el primitivo que lo respalda, sus atributos
          de Figma y el snippet de código que un desarrollador puede pegar tal cual. Los
          átomos con primitivos faltantes muestran la dependencia y se desbloquearán
          cuando se construya el primitivo en
          <code class="font-mono">libs/ui</code>.
        </p>

        @for (a of atoms; track a.name) {
          <site-atom-card [atom]="a" />
        }
      </div>

      <!-- ============================================ -->
      <!-- Decisiones tab                               -->
      <!-- ============================================ -->
      <div slot="decisiones" class="max-w-[760px] flex flex-col gap-space-10">
        <!-- Problema -->
        <section>
          <h2 class="text-section text-canvas-fg mb-space-4">El problema</h2>
          <p class="text-body-md text-neutral-600 mb-space-4">
            La versión anterior del top bar se sentía vieja y poco funcional. No era
            obvio que se podía interactuar con sus elementos, mostraba información que
            nadie necesita, y el orden no respondía a ninguna jerarquía clara.
          </p>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2">
            <li>
              <strong class="text-canvas-fg">Sin contexto inmediato.</strong> El usuario no
              sabía en qué cliente ni en qué planificación estaba — el dato más importante
              quedaba enterrado.
            </li>
            <li>
              <strong class="text-canvas-fg">Información inútil arriba.</strong> El nombre
              del propio asesor ocupaba espacio premium; el asesor ya sabe quién es. Ese
              dato pertenece al sidebar, no al chrome.
            </li>
            <li>
              <strong class="text-canvas-fg">Affordances opacas.</strong> Iconos y textos
              se mezclaban sin distinguir lo clicable de lo decorativo.
            </li>
            <li>
              <strong class="text-canvas-fg">Arquitectura rushed.</strong> No hubo
              dedicación a la IA — se diseñó "lo que cupiera" en lugar de "lo que importa".
            </li>
          </ul>
        </section>

        <!-- Solución -->
        <section>
          <h2 class="text-section text-canvas-fg mb-space-4">La solución</h2>
          <p class="text-body-md text-neutral-600 mb-space-4">
            Top bar más pequeño, más interactivo, con jerarquía explícita:
            <em>identidad y estado</em> a la izquierda, <em>acciones globales</em> a la
            derecha.
          </p>
          <ul class="list-disc pl-space-6 text-body-md text-neutral-600 space-y-space-2">
            <li>
              <strong class="text-canvas-fg">Cliente · Plan visibles siempre.</strong> Lo
              load-bearing primero. Tipografía, no icono — porque es texto que se lee, no
              se reconoce.
            </li>
            <li>
              <strong class="text-canvas-fg">Renombrar inline.</strong> Click sobre el
              nombre del plan → input en sitio. Enter guarda, Esc cancela. Toast con
              <em>Deshacer</em> al confirmar. Sin modal, sin formulario aparte.
            </li>
            <li>
              <strong class="text-canvas-fg">Estado como dropdown.</strong> Pequeño,
              compacto, hablando el lenguaje del estado de la planificación
              (borrador → cumplimentada → descargada → entregada). Cambio confirma con
              toast deshacible.
            </li>
            <li>
              <strong class="text-canvas-fg">Iconos sin texto + tooltip.</strong> Las
              acciones secundarias (cambiar planificación, notas, ajustes) son icon-only
              con tooltip al hover. Reduce ruido visual; preserva la jerarquía
              tipográfica del centro.
            </li>
          </ul>
        </section>

        <!-- Distinción crítica -->
        <section>
          <h2 class="text-section text-canvas-fg mb-space-4">
            Distinción crítica · página-scope vs global-scope
          </h2>
          <p class="text-body-md text-neutral-600 mb-space-4">
            Esta es la regla de IA que organiza todo el chrome:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
            <div class="rounded-md border border-border-hairline bg-surface-elevated p-space-4">
              <p class="text-body-sm font-medium text-canvas-fg mb-space-2">
                Top bar · global-scope
              </p>
              <p class="text-body-sm text-neutral-600">
                Habla de la <em>simulación entera</em>. Ajustes que viven aquí
                (esperanza de vida, perfil de riesgo) afectan a todas las páginas.
                Notas son del cliente / la planificación, no de la página actual.
              </p>
            </div>
            <div class="rounded-md border border-border-hairline bg-surface-elevated p-space-4">
              <p class="text-body-sm font-medium text-canvas-fg mb-space-2">
                Page header · page-scope
              </p>
              <p class="text-body-sm text-neutral-600">
                Habla de <em>la pantalla actual</em>. Filtros, pestañas y acciones
                de cabecera de página afectan solo lo que el usuario ve ahora.
              </p>
            </div>
          </div>
          <p class="text-body-md text-neutral-600 mt-space-4">
            Si una acción cambia algo global → top bar derecha. Si cambia solo lo de
            esta pantalla → page header. Esta regla decide cualquier disputa de
            ubicación futura.
          </p>
        </section>

        <!-- Precedentes -->
        <section>
          <h2 class="text-section text-canvas-fg mb-space-4">Precedentes externos</h2>
          <ul class="space-y-space-3">
            <li class="text-body-md text-neutral-600">
              <strong class="text-canvas-fg">Notion</strong> — top bar mínimo enfocado
              en navegación contextual. <em>Por qué funciona:</em> la jerarquía
              tipográfica del documento hace el trabajo, no el chrome.
            </li>
            <li class="text-body-md text-neutral-600">
              <strong class="text-canvas-fg">Linear</strong> — chip de estado compacto +
              acciones inline. <em>Por qué funciona:</em> demuestra que el estado de un
              recurso (issue / proyecto / planificación) merece ser interactivo, no
              solo visible.
            </li>
            <li class="text-body-md text-neutral-600">
              <strong class="text-canvas-fg">Stripe</strong> — rename inline en lugar
              de modal. <em>Por qué funciona:</em> reduce un click + cambio de contexto;
              casa con la Ley de Tesler (la complejidad inevitable se queda en el
              sistema, no en el usuario).
            </li>
            <li class="text-body-md text-neutral-600">
              <strong class="text-canvas-fg">Granola</strong> — restraint tipográfico,
              menos elementos en chrome. <em>Por qué funciona:</em> cada cosa que
              añades al chrome es una cosa que el usuario tiene que ignorar
              durante el resto del día.
            </li>
          </ul>
        </section>
      </div>
    </site-pattern-page>
  `,
})
export class TopBarPatternPage {
  readonly primitives: readonly PrimitiveRef[] = [
    {
      name: 'afi-button',
      slug: 'button',
      status: 'exists',
      note: 'Variante ghost + size sm para los icon-only buttons del top bar.',
    },
    {
      name: 'afi-status-chip',
      slug: 'status-chip',
      status: 'partial',
      note: 'Hace falta variante interactiva (click → menú de estados).',
    },
    {
      name: 'afi-menu',
      slug: 'menu',
      status: 'exists',
      note: 'Para el menú de selección de estado.',
    },
    {
      name: 'afi-drawer',
      slug: 'drawer',
      status: 'exists',
      note: 'Para los Ajustes de simulación (global-scope).',
    },
    {
      name: 'afi-kbd',
      slug: 'kbd',
      status: 'exists',
      note: 'Para mostrar atajos en tooltips (Enter / Esc) durante el rename inline.',
    },
    {
      name: 'afi-tooltip',
      slug: 'tooltip',
      status: 'missing',
      note: 'Bloqueante: cada icon-only button necesita tooltip. Hay que construirlo antes de cerrar este patrón.',
    },
    {
      name: 'afi-inline-edit',
      slug: 'inline-edit',
      status: 'missing',
      note: 'Bloqueante: el renombrar-en-sitio del nombre de la planificación.',
    },
    {
      name: 'afi-toast',
      slug: 'toast',
      status: 'missing',
      note: 'Bloqueante: existe como action-toast en novedades/shared, hay que promover a primitivo de libs/ui.',
    },
  ];

  readonly atoms: readonly AtomSpec[] = [
    {
      number: 1,
      name: 'Botón "Cambiar planificación"',
      description:
        'Botón único con dos iconos (líneas + flecha atrás), sin texto. Tooltip al hover muestra "Cambiar planificación". Click navega al listado de planificaciones del cliente.',
      backingPrimitives: [
        { name: 'afi-button', slug: 'button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'sm' },
        { key: 'iconStart', value: 'lucide-menu' },
        { key: 'iconEnd', value: 'lucide-arrow-left' },
        { key: 'aria-label', value: '"Cambiar planificación"' },
        { key: 'tooltip', value: '"Cambiar planificación"' },
      ],
      codeSnippet:
        '<!-- Pendiente: bloqueado por <afi-tooltip>.\n     Cuando exista, este snippet pasa a usar <afi-tooltip> envolviendo <afi-button>. -->',
    },
    {
      number: 2,
      name: 'Identidad: Cliente · Plan',
      description:
        'Composición tipográfica que muestra el cliente activo y el nombre de la planificación. Lo único load-bearing del top bar — siempre visible, no se trunca antes de tiempo.',
      backingPrimitives: [],
      figmaAttrs: [
        { key: 'cliente · clase', value: 'text-body-md font-medium text-canvas-fg' },
        { key: 'separador', value: '" · " (middot, neutral-400)' },
        { key: 'plan · clase', value: 'text-body-md text-canvas-fg' },
        { key: 'gap', value: 'space-2' },
      ],
      codeSnippet:
        '<div class="flex items-center gap-space-2 text-body-md">\n  <span class="font-medium text-canvas-fg">{{ clienteName() }}</span>\n  <span class="text-neutral-400" aria-hidden="true">·</span>\n  <!-- el plan se renderiza con afi-inline-edit (átomo siguiente) -->\n</div>',
    },
    {
      number: 3,
      name: 'Renombrar planificación inline',
      description:
        'Click sobre el nombre del plan → se transforma en un text input. Enter guarda; Esc cancela. Iconos check (✓) y X aparecen al lado del input con tooltips "Guardar" y "Cancelar" mostrando los atajos. Confirmación → toast deshacible.',
      backingPrimitives: [
        { name: 'afi-inline-edit', slug: 'inline-edit' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-kbd', slug: 'kbd' },
        { name: 'afi-toast', slug: 'toast' },
      ],
      figmaAttrs: [
        { key: 'estado · idle', value: 'texto + icono lápiz al hover (tooltip "Renombrar planificación")' },
        { key: 'estado · editing', value: 'input + check + X · auto-focus + select-all' },
        { key: 'shortcut · guardar', value: 'Enter' },
        { key: 'shortcut · cancelar', value: 'Esc' },
        { key: 'toast · mensaje', value: '"Nombre actualizado a {nuevo}"' },
        { key: 'toast · acción', value: '"Deshacer"' },
      ],
      codeSnippet:
        '<!-- Pendiente: bloqueado por <afi-inline-edit>, <afi-tooltip>, <afi-toast>.\n     Tres primitivos faltantes — este átomo es el que más motiva su construcción. -->',
    },
    {
      number: 4,
      name: 'Estado de la planificación',
      description:
        'Chip clicable que muestra el estado actual (borrador / cumplimentada / descargada / entregada). Click abre menú con los demás estados; selección dispara toast deshacible.',
      backingPrimitives: [
        { name: 'afi-status-chip', slug: 'status-chip' },
        { name: 'afi-menu', slug: 'menu' },
        { name: 'afi-toast', slug: 'toast' },
      ],
      figmaAttrs: [
        { key: 'estado · default', value: 'borrador' },
        { key: 'transiciones', value: 'borrador → cumplimentada → descargada → entregada' },
        { key: 'interacción', value: 'click → afi-menu de estados disponibles' },
        { key: 'toast · mensaje', value: '"Estado actualizado a {nuevo}"' },
        { key: 'toast · acción', value: '"Deshacer"' },
      ],
      codeSnippet:
        '<!-- Compone <afi-status-chip> (extender a interactivo) + <afi-menu> + <afi-toast>.\n     Bloqueado por la extensión de status-chip y la promoción de toast a libs/ui. -->',
    },
    {
      number: 5,
      name: 'Disparador "Notas"',
      description:
        'Icon-only en el lado derecho. Notas son del cliente / planificación — global-scope, no page-scope. La forma del panel (drawer en prototipo, dropdown en producto actual) está PENDIENTE de definir.',
      backingPrimitives: [
        { name: 'afi-button', slug: 'button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'sm' },
        { key: 'icon', value: 'lucide-notebook-pen' },
        { key: 'aria-label', value: '"Notas"' },
        { key: 'tooltip', value: '"Notas"' },
        { key: 'panel · forma', value: 'TBD · drawer (prototipo) vs dropdown (producto actual)' },
      ],
      codeSnippet:
        '<!-- Pendiente: bloqueado por <afi-tooltip> + decisión drawer-vs-dropdown. -->',
    },
    {
      number: 6,
      name: 'Disparador "Ajustes de simulación"',
      description:
        'Icon-only en el lado derecho. Click abre drawer con ajustes globales de la simulación: esperanza de vida, perfil de riesgo, etc. Lo que cambies aquí afecta a todas las páginas — esto es lo que define el global-scope del top bar.',
      backingPrimitives: [
        { name: 'afi-button', slug: 'button' },
        { name: 'afi-tooltip', slug: 'tooltip' },
        { name: 'afi-drawer', slug: 'drawer' },
      ],
      figmaAttrs: [
        { key: 'variant', value: 'ghost' },
        { key: 'size', value: 'sm' },
        { key: 'icon', value: 'lucide-sliders-horizontal' },
        { key: 'aria-label', value: '"Ajustes de simulación"' },
        { key: 'tooltip', value: '"Ajustes · Aplica a toda la simulación"' },
        { key: 'panel', value: '<afi-drawer size="md" side="right">' },
      ],
      codeSnippet:
        '<!-- Pendiente: bloqueado por <afi-tooltip>.\n     Una vez exista, compone <afi-tooltip> + <afi-button (clicked)="ajustes.open()"> + <afi-drawer #ajustes>. -->',
    },
    {
      number: 7,
      name: 'Toast de confirmación',
      description:
        'Aparece tras renombrar y tras cambiar estado. Mensaje + botón "Deshacer" + X de cierre. Auto-dismiss 5s; Deshacer revierte la acción; X cierra inmediato.',
      backingPrimitives: [{ name: 'afi-toast', slug: 'toast' }],
      figmaAttrs: [
        { key: 'posición', value: 'bottom-center, mt-space-6 desde el borde' },
        { key: 'auto-dismiss', value: '5000ms' },
        { key: 'acciones', value: 'Deshacer · Cerrar (X)' },
        { key: 'origen', value: 'novedades/shared/action-toast.component.ts (a promover)' },
      ],
      codeSnippet:
        '<!-- Pendiente: bloqueado por la promoción de action-toast a <afi-toast> en libs/ui. -->',
    },
  ];
}
