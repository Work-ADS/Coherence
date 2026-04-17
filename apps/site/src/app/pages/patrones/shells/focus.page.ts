import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-focus-shell-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Shells</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Focus <span class="text-body-md text-neutral-400">(reservado)</span></h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        El shell de flujo guiado — pasos progresivos, sin navegación lateral, enfocado en completar
        una tarea de principio a fin.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <section class="mb-space-12">
        <h2 id="contrato" class="text-section text-canvas-fg mb-space-4">Contrato</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Este shell está reservado para v2. El contrato documentado establece:
        </p>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Barra de progreso superior con pasos numerados</li>
          <li>Área de contenido centrada (max 640 px) — un paso a la vez</li>
          <li>Botones Anterior / Siguiente fijos en el footer</li>
          <li>Sin sidebar, sin header global — salida explícita vía "Cancelar"</li>
          <li>Estado persistido en memoria hasta confirmación final</li>
        </ul>
      </section>

      <section class="mb-space-12">
        <h2 id="casos-de-uso" class="text-section text-canvas-fg mb-space-4">Casos de uso previstos</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Onboarding de nuevo usuario (3–5 pasos)</li>
          <li>Creación de entidad compleja con validación paso a paso</li>
          <li>Configuración inicial de workspace</li>
        </ul>
      </section>

      <section class="mb-space-10">
        <h2 id="composicion" class="text-section text-canvas-fg mb-space-4">Composición prevista</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-shell</code> con <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">type="focus"</code></li>
          <li>Stepper component (por definir)</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-button</code> — navegación entre pasos</li>
        </ul>
      </section>

      <hr class="border-border-hairline mb-space-6" />
      <nav class="flex flex-wrap gap-space-4 text-body-sm">
        <span class="text-neutral-400">Temas relacionados:</span>
        <a routerLink="/componentes/shell" class="text-action-500 hover:underline">Shell</a>
        <a routerLink="/patrones/shells/auth" class="text-action-500 hover:underline">Auth shell</a>
      </nav>
    </div>
  `,
})
export class FocusPage {}
