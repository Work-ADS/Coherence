import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'site-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Design at Coherence
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-6">El sistema de diseño interno de AFI</h1>

      <div class="max-w-[640px] flex flex-col gap-space-6 text-body-md text-neutral-600">
        <p>
          Coherence existe para que cada producto de AFI hable el mismo idioma visual. Un catálogo
          de primitivos construidos con rigor, documentados con honestidad y listos para ensamblar
          en cualquier superficie.
        </p>
        <p>
          No es un framework. No es un tema. Es la decisión de que los equipos no repitan trabajo —
          y de que los usuarios no perciban costuras entre productos.
        </p>

        <section class="mt-space-8">
          <h2 class="text-section text-canvas-fg mb-space-6">Cómo trabajamos</h2>
          <ul class="flex flex-col gap-space-3 text-body-md text-neutral-600">
            <li class="flex gap-space-3">
              <span class="text-action-700 shrink-0">01</span>
              <span
                >Primitivos primero — cada pieza se prueba en aislamiento antes de componerse.</span
              >
            </li>
            <li class="flex gap-space-3">
              <span class="text-action-700 shrink-0">02</span>
              <span
                >Tokens como contrato — ningún color, tamaño o sombra vive fuera del sistema de
                tokens.</span
              >
            </li>
            <li class="flex gap-space-3">
              <span class="text-action-700 shrink-0">03</span>
              <span
                >Accesibilidad no es opcional — WCAG 2.1 AA mínimo, teclado completo, lectores de
                pantalla.</span
              >
            </li>
            <li class="flex gap-space-3">
              <span class="text-action-700 shrink-0">04</span>
              <span
                >Documentar con honestidad — si algo está reservado, se dice. Si algo falta, se
                dice.</span
              >
            </li>
          </ul>
        </section>

        <section class="mt-space-8">
          <h2 class="text-section text-canvas-fg mb-space-6">Equipo</h2>
          <p>
            Coherence es mantenido por el equipo de plataforma de AFI. Las contribuciones de los
            equipos de producto son bienvenidas mediante propuestas documentadas.
          </p>
        </section>
      </div>
    </div>
  `,
})
export class HomePage {}
