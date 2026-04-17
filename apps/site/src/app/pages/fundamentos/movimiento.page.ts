import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movimiento-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Foundations</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Movimiento</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Motion en Coherence comunica estado, no decora. Siete reglas de disciplina gobiernan
        cada transición. El sitio de documentación es el único lugar donde el movimiento decorativo está autorizado.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <!-- 7 rules -->
      <section class="mb-space-12">
        <h2 id="siete-reglas" class="text-section text-canvas-fg mb-space-4">Siete reglas de disciplina</h2>
        <div class="flex flex-col gap-space-4 max-w-[720px]">
          @for (rule of rules; track rule.num) {
            <div class="p-space-4 border border-border-hairline rounded-md">
              <p class="text-body-sm-600 text-canvas-fg mb-space-1">
                {{ rule.num }}. {{ rule.title }}
              </p>
              <p class="text-body-sm text-neutral-600">{{ rule.desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- Duration tokens -->
      <section class="mb-space-12">
        <h2 id="tokens-de-duracion" class="text-section text-canvas-fg mb-space-4">Tokens de duración</h2>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Token</th>
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Valor</th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Uso</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">--duration-fast</td>
                <td class="py-space-3 pr-space-4">120ms</td>
                <td class="py-space-3">Hover, focus, press</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">--duration-base</td>
                <td class="py-space-3 pr-space-4">200ms</td>
                <td class="py-space-3">Transiciones de componente</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">--duration-slow</td>
                <td class="py-space-3 pr-space-4">300ms</td>
                <td class="py-space-3">Modales, drawers, overlays</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Easing tokens -->
      <section class="mb-space-12">
        <h2 id="tokens-de-easing" class="text-section text-canvas-fg mb-space-4">Tokens de easing</h2>
        <div class="overflow-x-auto max-w-[720px]">
          <table class="w-full text-body-sm">
            <thead>
              <tr class="border-b border-border-hairline text-left">
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Token</th>
                <th class="py-space-3 pr-space-4 text-body-sm-600 text-canvas-fg">Curva</th>
                <th class="py-space-3 text-body-sm-600 text-canvas-fg">Cuándo</th>
              </tr>
            </thead>
            <tbody class="text-neutral-600">
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">--easing-standard</td>
                <td class="py-space-3 pr-space-4">ease</td>
                <td class="py-space-3">Genérico</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">--easing-enter</td>
                <td class="py-space-3 pr-space-4">ease-out</td>
                <td class="py-space-3">Elementos que aparecen (settling in)</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">--easing-exit</td>
                <td class="py-space-3 pr-space-4">ease-in</td>
                <td class="py-space-3">Elementos que salen (accelerating away)</td>
              </tr>
              <tr class="border-b border-border-hairline">
                <td class="py-space-3 pr-space-4 font-mono">--easing-spring-soft</td>
                <td class="py-space-3 pr-space-4">cubic-bezier(0.34, 1.56, 0.64, 1)</td>
                <td class="py-space-3">Rebote suave (popovers, tooltips)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 3 tiers -->
      <section class="mb-space-12">
        <h2 id="tres-niveles" class="text-section text-canvas-fg mb-space-4">Tres niveles de implementación</h2>
        <div class="flex flex-col gap-space-4 max-w-[720px]">
          <div class="p-space-4 border border-action-500 rounded-md bg-surface-quiet">
            <p class="text-body-sm-600 text-canvas-fg mb-space-1">Nivel 1 — CSS Transitions (95%)</p>
            <p class="text-body-sm text-neutral-600">
              <code class="font-mono">transition: all var(--duration-fast) var(--easing-standard)</code>.
              Hovers, focus, color changes. El default para todo.
            </p>
          </div>
          <div class="p-space-4 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-canvas-fg mb-space-1">Nivel 2 — Angular Animations</p>
            <p class="text-body-sm text-neutral-600">
              Enter/exit, route transitions, staged sequences. Cuando CSS transitions no alcanzan.
            </p>
          </div>
          <div class="p-space-4 border border-border-hairline rounded-md">
            <p class="text-body-sm-600 text-canvas-fg mb-space-1">Nivel 3 — Motion One (raro)</p>
            <p class="text-body-sm text-neutral-600">
              Stagger, spring physics, coordinated sequences. Solo cuando niveles 1 y 2 no pueden.
            </p>
          </div>
        </div>
      </section>

      <!-- Reduced motion -->
      <section class="mb-space-12">
        <h2 id="movimiento-reducido" class="text-section text-canvas-fg mb-space-4">Movimiento reducido</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          <code class="font-mono text-body-sm">prefers-reduced-motion: reduce</code> colapsa cada transición
          a 0–80ms de fade. Se preserva la comunicación de estado — se elimina el desplazamiento.
          Una sola regla CSS global lo maneja.
        </p>
        <div class="p-space-6 bg-surface-quiet rounded-md max-w-[720px]">
          <p class="font-mono text-body-sm text-neutral-600">
            &#64;media (prefers-reduced-motion: reduce) &#123;<br/>
            &nbsp;&nbsp;*, *::before, *::after &#123;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;animation-duration: 0.01ms !important;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;transition-duration: 0.01ms !important;<br/>
            &nbsp;&nbsp;&#125;<br/>
            &#125;
          </p>
        </div>
      </section>

      <!-- Live demo -->
      <section class="mb-space-12">
        <h2 id="demostracion" class="text-section text-canvas-fg mb-space-4">Demostración</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Pase el cursor sobre los elementos para ver las transiciones en acción.
        </p>
        <div class="flex gap-space-6 max-w-[720px]">
          <button class="px-space-6 py-space-3 bg-action-500 text-canvas-fg-on-action rounded-md
                         text-button transition-all duration-fast
                         hover:-translate-y-0.5 hover:shadow-md
                         active:translate-y-0 active:shadow-none
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            hover-lift
          </button>
          <button class="px-space-6 py-space-3 border border-border-hairline rounded-md
                         text-button text-canvas-fg transition-all duration-fast
                         hover:bg-surface-muted
                         active:scale-[0.97]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            hover-tint
          </button>
          <button class="px-space-6 py-space-3 bg-action-500 text-canvas-fg-on-action rounded-md
                         text-button transition-all duration-fast
                         active:scale-[0.96]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            press-scale
          </button>
        </div>
      </section>

      <!-- Related -->
      <hr class="border-border-hairline mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-4">Temas relacionados</h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li><a routerLink="/fundamentos/accesibilidad" class="underline hover:text-action-800">Accesibilidad</a></li>
          <li><a routerLink="/fundamentos/tokens" class="underline hover:text-action-800">Tokens</a></li>
          <li><a routerLink="/componentes/button" class="underline hover:text-action-800">Button (consumidor de motion)</a></li>
          <li><a routerLink="/componentes/modal" class="underline hover:text-action-800">Modal (enter/exit animation)</a></li>
        </ul>
        <p class="text-body-sm text-neutral-400 mt-space-4">
          Fuente: <code class="font-mono text-body-sm">docs/motion-templates.md</code>
        </p>
      </section>
    </div>
  `,
})
export class MovimientoPage {
  readonly rules = [
    { num: 1, title: 'Contenedor primero', desc: 'Anime el objeto como unidad — borde, fondo y label juntos. Nunca texto suelto dentro de un contenedor estático.' },
    { num: 2, title: 'Mínimas propiedades', desc: 'Prefiera transform + opacity (GPU-composited, sin layout). Evite animar width / height / top / left.' },
    { num: 3, title: 'Ease correcto', desc: 'ease-out para entradas (settling in). ease-in para salidas (accelerating away). ease-in-out para ida y vuelta.' },
    { num: 4, title: 'Duración proporcional al peso', desc: 'Chip focus: 80–150ms. Button hover: 150–200ms. Modal enter: 200–300ms. Nunca > 400ms para respuesta interactiva.' },
    { num: 5, title: 'Respete el estado de reposo', desc: 'Hover / pressed / focus se leen como variantes del default, no como reemplazos.' },
    { num: 6, title: 'No anime lo que no ha decidido', desc: 'La animación clarifica intención; animación aleatoria la confunde. Si el propósito no es claro, déjelo estático.' },
    { num: 7, title: 'Movimiento reducido = respeto', desc: 'prefers-reduced-motion: reduce colapsa a 0–80ms fades. Preservar comunicación de estado, eliminar desplazamiento.' },
  ];
}
