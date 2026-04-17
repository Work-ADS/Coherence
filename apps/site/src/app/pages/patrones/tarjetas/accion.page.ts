import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accion-tarjeta-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Tarjetas</p>
      <h1 class="text-title text-canvas-fg mb-space-3">Acción</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Card con texto descriptivo y un botón CTA primario — ideal para prompts de onboarding y estados vacíos.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Anatomía</h2>
        <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-4">
          Un bloque de prosa (título + 1–2 líneas de descripción) ocupa la parte superior.
          En la parte inferior, un botón primario invita a la acción. Opcionalmente, un icono
          decorativo o ilustración acompaña el texto.
        </p>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Composición</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li><code>afi-card</code> — contenedor principal</li>
          <li><code>afi-button</code> — CTA primario</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Prompts de onboarding que guían al usuario al siguiente paso.</li>
          <li>CTAs de upgrade o activación de features.</li>
          <li>Empty states con una acción clara para resolver el estado vacío.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Cuándo NO usar</h2>
        <ul class="max-w-[640px] list-disc pl-space-5 text-body-md text-neutral-600 space-y-space-1">
          <li>Múltiples CTAs — elige un solo botón primario.</li>
          <li>Contenido largo o formularios — usa un Drawer o página.</li>
          <li>Información puramente informativa sin acción — usa <strong>Entidad</strong> o <strong>Métrica</strong>.</li>
        </ul>
      </section>

      <section class="mb-space-8">
        <h2 class="text-section text-canvas-fg mb-space-3">Do &amp; Don't</h2>
        <div class="grid grid-cols-2 gap-space-4">
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Usa un solo CTA con copy de acción claro (verbo + objeto).</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No incluyas múltiples botones — un solo CTA primario por tarjeta.</p>
          </div>
          <div class="rounded-lg border border-success-300 bg-success-50 p-space-4">
            <p class="text-body-sm font-semibold text-success-700 mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-700">Mantén la descripción en 1–2 líneas máximo.</p>
          </div>
          <div class="rounded-lg border border-danger-300 bg-danger-50 p-space-4">
            <p class="text-body-sm font-semibold text-danger-700 mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-700">No conviertas la tarjeta en un formulario — es un prompt, no un form.</p>
          </div>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <nav>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="list-disc pl-space-5 text-body-md space-y-space-1">
          <li><a routerLink="/componentes/card" class="text-action-700 underline">Card (primitivo)</a></li>
          <li><a routerLink="/patrones/tarjetas/estado" class="text-action-700 underline">Estado</a></li>
          <li><a routerLink="/patrones/tarjetas/editorial" class="text-action-700 underline">Editorial</a></li>
        </ul>
      </nav>
    </div>
  `,
})
export class AccionPage {}
