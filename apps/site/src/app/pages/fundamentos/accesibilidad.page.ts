import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accesibilidad-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Accesibilidad</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        WCAG 2.2 AA mínimo, AAA para texto y touch. Cada primitivo de Coherence pasa un checklist de
        accesibilidad antes de merge. No hay excepciones.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- 10 non-negotiables -->
      <section class="mb-space-12">
        <h2 id="diez-no-negociables" class="text-section text-canvas-fg mb-space-6">
          Diez no negociables
        </h2>
        <div class="flex flex-col gap-space-3 max-w-[720px]">
          @for (rule of nonNegotiables; track rule.num) {
            <div class="flex gap-space-3 p-space-4 border border-border-hairline rounded-md">
              <span class="text-body-sm-600 text-action-700 shrink-0 w-space-6 text-center">{{
                rule.num
              }}</span>
              <div>
                <p class="text-body-sm-600 text-canvas-fg">{{ rule.title }}</p>
                <p class="text-body-sm text-neutral-600">{{ rule.desc }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Per-primitive checklists -->
      <section class="mb-space-12">
        <h2 id="checklists-por-primitivo" class="text-section text-canvas-fg mb-space-6">
          Checklists por primitivo
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Cada primitivo tiene requisitos específicos de accesibilidad. Aquí los más relevantes.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 max-w-[720px]">
          @for (item of primitiveChecks; track item.name) {
            <div class="p-space-4 border border-border-hairline rounded-md">
              <p class="text-body-sm-600 text-canvas-fg mb-space-2">{{ item.name }}</p>
              <ul class="list-disc list-inside text-body-sm text-neutral-600 space-y-space-1">
                @for (check of item.checks; track check) {
                  <li>{{ check }}</li>
                }
              </ul>
            </div>
          }
        </div>
      </section>

      <!-- Anti-patterns -->
      <section class="mb-space-12">
        <h2 id="antipatrones" class="text-section text-canvas-fg mb-space-6">Antipatrones</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Errores comunes que bloquean accesibilidad. Coherence los detecta en pre-flight.
        </p>
        <div class="flex flex-col gap-space-3 max-w-[720px]">
          @for (ap of antiPatterns; track ap) {
            <div
              class="flex items-start gap-space-3 p-space-3 border border-system-error-base/20 rounded-md bg-system-error-bg/30"
            >
              <span class="text-system-error shrink-0">✕</span>
              <p class="text-body-sm text-neutral-600">{{ ap }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Pre-flight -->
      <section class="mb-space-12">
        <h2 id="pre-flight" class="text-section text-canvas-fg mb-space-6">
          Pre-flight de accesibilidad
        </h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Antes de merge, cada componente pasa estos checks:
        </p>
        <ul
          class="list-disc list-inside text-body-md text-neutral-600 max-w-[640px] space-y-space-2"
        >
          <li>Navegación completa por teclado (Tab, Enter, Escape, flechas)</li>
          <li>Focus visible en todo estado interactivo</li>
          <li>Texto alternativo en contenido no textual</li>
          <li>Contraste ≥ 4.5:1 (AA) para texto, ≥ 3:1 para UI grande</li>
          <li>Touch targets ≥ 44×44px</li>
          <li>Movimiento reducido respetado</li>
          <li>Live regions para cambios dinámicos</li>
          <li>Prueba con VoiceOver (macOS) y NVDA (Windows)</li>
        </ul>
      </section>

      <!-- Related -->
      <hr class="border-border-hairline mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-6">
          Temas relacionados
        </h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li>
            <a routerLink="/fundamentos/color" class="underline hover:text-action-800"
              >Color (contraste)</a
            >
          </li>
          <li>
            <a routerLink="/fundamentos/movimiento" class="underline hover:text-action-800"
              >Movimiento (reduced motion)</a
            >
          </li>
          <li>
            <a routerLink="/fundamentos/espacio" class="underline hover:text-action-800"
              >Espacio (touch targets)</a
            >
          </li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/accessibility.md</code>
        </p>
      </section>
    </div>
  `,
})
export class AccesibilidadPage {
  readonly nonNegotiables = [
    {
      num: 1,
      title: 'HTML semántico primero',
      desc: 'Usar <button>, <input>, <select> nativos. Nunca <div onclick>.',
    },
    {
      num: 2,
      title: 'Etiquetar cada control',
      desc: 'Visible <label> asociado vía for/id, o aria-label cuando el label es visual.',
    },
    {
      num: 3,
      title: 'Focus ring visible',
      desc: 'Usando --focus-ring token. Nunca outline: none sin reemplazo.',
    },
    {
      num: 4,
      title: 'Focus order = visual order',
      desc: 'Tab sequence sigue el flujo visual. Sin tabindex > 0.',
    },
    {
      num: 5,
      title: 'Anunciar cambios dinámicos',
      desc: 'aria-live="polite" para toasts, badges, estados cambiantes.',
    },
    {
      num: 6,
      title: 'Color nunca como único indicador',
      desc: 'Siempre texto, icono o patrón adicional junto al color.',
    },
    {
      num: 7,
      title: 'Touch targets ≥ 44×44px',
      desc: 'WCAG AAA para touch. Padding expandido si el elemento visual es menor.',
    },
    {
      num: 8,
      title: 'Movimiento reducido',
      desc: 'prefers-reduced-motion respetado en cada animación.',
    },
    {
      num: 9,
      title: 'Skip links',
      desc: 'Enlace oculto "Ir al contenido principal" al inicio del DOM.',
    },
    {
      num: 10,
      title: 'Errores anunciados en formularios',
      desc: 'aria-invalid + aria-describedby apuntando al mensaje de error.',
    },
  ];

  readonly primitiveChecks = [
    {
      name: 'Button',
      checks: [
        'role="button" nativo',
        'aria-disabled vs disabled attr',
        'aria-busy para loading',
        'Focus ring visible',
      ],
    },
    {
      name: 'Input',
      checks: [
        '<label> asociado',
        'aria-invalid + aria-describedby',
        'placeholder no reemplaza label',
        'Autocomplete attrs',
      ],
    },
    {
      name: 'Modal',
      checks: [
        'role="dialog" + aria-modal',
        'Focus trap activo',
        'Escape cierra',
        'Retorno de focus al trigger',
      ],
    },
    {
      name: 'Table',
      checks: [
        '<th scope="col/row">',
        'aria-sort en columnas ordenables',
        'caption o aria-label',
        'Navegación por flechas',
      ],
    },
    {
      name: 'Tabs',
      checks: [
        'role="tablist/tab/tabpanel"',
        'Flechas navegan tabs',
        'aria-selected en tab activo',
        'tabpanel labelledby tab',
      ],
    },
    {
      name: 'Drawer',
      checks: [
        'Focus trap activo',
        'Escape cierra',
        'aria-label descriptivo',
        'Retorno de focus al trigger',
      ],
    },
  ];

  readonly antiPatterns = [
    '<div> o <span> como botón — usar <button> nativo',
    'Placeholder como única etiqueta de input',
    'outline: none sin reemplazo de focus visible',
    'tabindex > 0 — rompe el flujo natural',
    'aria-hidden="true" en contenido interactivo',
    'Autoplay de video/audio sin controles de pausa',
    'Color rojo como único indicador de error',
  ];
}
