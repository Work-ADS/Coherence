import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-changelog-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Recursos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Changelog</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Registro de cambios del sistema de diseño Coherence. Cada versión documenta
        componentes nuevos, mejoras y correcciones relevantes.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <div class="border-l-2 border-neutral-200 pl-space-6">

        <!-- v1.2.0 -->
        <section class="mb-space-12">
          <p class="text-body-sm text-neutral-400 mb-space-1">15 de marzo de 2026</p>
          <h2 id="v1-2-0" class="text-section text-canvas-fg mb-space-4">v1.2.0</h2>
          <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
            Nuevos componentes de formulario y mejoras de accesibilidad en toda la biblioteca.
          </p>
          <ul class="list-disc list-inside text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
            <li>Componente DatePicker con soporte de rango de fechas.</li>
            <li>Componente Combobox con filtrado asíncrono.</li>
            <li>Mejora del contraste en estados de foco para WCAG 2.2 AA.</li>
            <li>Corrección de alineación vertical en Badge dentro de Button.</li>
          </ul>
        </section>

        <!-- v1.1.0 -->
        <section class="mb-space-12">
          <p class="text-body-sm text-neutral-400 mb-space-1">1 de febrero de 2026</p>
          <h2 id="v1-1-0" class="text-section text-canvas-fg mb-space-4">v1.1.0</h2>
          <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
            Sistema de tokens ampliado y soporte inicial para modo oscuro.
          </p>
          <ul class="list-disc list-inside text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
            <li>Tokens semánticos para modo oscuro disponibles en CSS y Tailwind.</li>
            <li>Componente Tooltip con posicionamiento automático.</li>
            <li>Documentación de tokens de espaciado actualizada.</li>
            <li>Corrección de overflow en Dialog en pantallas móviles.</li>
          </ul>
        </section>

        <!-- v1.0.0 -->
        <section class="mb-space-12">
          <p class="text-body-sm text-neutral-400 mb-space-1">10 de enero de 2026</p>
          <h2 id="v1-0-0" class="text-section text-canvas-fg mb-space-4">v1.0.0</h2>
          <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
            Lanzamiento inicial de Coherence con los componentes fundamentales y el sistema de tokens.
          </p>
          <ul class="list-disc list-inside text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
            <li>Componentes: Button, Input, Select, Dialog, Card, Badge.</li>
            <li>Sistema de tokens: color, tipografía, espaciado, radios, sombras.</li>
            <li>Integración con Tailwind CSS v4.</li>
            <li>Sitio de documentación con ejemplos interactivos.</li>
          </ul>
        </section>

      </div>

      <!-- Temas relacionados -->
      <hr class="border-border-hairline mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-4">Temas relacionados</h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li><a routerLink="/recursos/descargas" class="underline hover:text-action-800">Descargas</a></li>
          <li><a routerLink="/recursos/roadmap" class="underline hover:text-action-800">Roadmap</a></li>
          <li><a routerLink="/recursos/faq" class="underline hover:text-action-800">Preguntas frecuentes</a></li>
        </ul>
      </section>
    </div>
  `,
})
export class ChangelogPage {}
