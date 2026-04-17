import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Recursos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Preguntas frecuentes</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Respuestas a las dudas más comunes sobre instalación, personalización,
        accesibilidad y contribución al sistema de diseño Coherence.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <div class="max-w-[640px] divide-y divide-border-hairline">

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Cómo instalo Coherence en mi proyecto?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Ejecute <code class="font-mono text-body-sm bg-surface-quiet px-space-1 rounded">npm install &#64;coherence/ui</code>
            en la raíz de su proyecto Angular. El paquete incluye componentes, tokens y utilidades.
            Consulte la guía de inicio rápido en la documentación para configurar los imports necesarios.
          </p>
        </details>

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Cómo personalizo los tokens de diseño?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Coherence expone sus tokens como variables CSS y clases de Tailwind. Puede sobreescribir
            cualquier token en su archivo de configuración de Tailwind o directamente en CSS. Los tokens
            semánticos permiten cambiar la paleta completa modificando solo los valores primitivos.
          </p>
        </details>

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Qué navegadores son compatibles?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Coherence soporta las dos últimas versiones estables de Chrome, Firefox, Safari y Edge.
            No se garantiza compatibilidad con Internet Explorer. Los componentes utilizan APIs
            modernas del navegador con degradación grácil cuando es posible.
          </p>
        </details>

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Cuál es el compromiso de accesibilidad?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Todos los componentes de Coherence cumplen con WCAG 2.2 nivel AA como mínimo. Esto incluye
            contraste de color, navegación por teclado, atributos ARIA y compatibilidad con lectores
            de pantalla. Cada componente se prueba con axe-core y navegación manual.
          </p>
        </details>

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Cómo puedo contribuir al sistema?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Abra un issue en el repositorio de GitHub describiendo la mejora o componente que propone.
            El equipo evaluará la propuesta según la hoja de ruta. Para contribuciones de código,
            siga la guía de contribución y asegúrese de que los tests pasen antes de enviar un PR.
          </p>
        </details>

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Cómo reporto un error?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Cree un issue en GitHub con la etiqueta «bug». Incluya una descripción clara del problema,
            pasos para reproducirlo, el comportamiento esperado y capturas de pantalla si aplica.
            El equipo triará el reporte en un plazo máximo de 48 horas.
          </p>
        </details>

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Puedo usar Coherence sin Tailwind CSS?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Sí. Aunque Tailwind es la integración recomendada, los tokens se exportan también como
            variables CSS estándar. Puede consumirlos directamente en sus hojas de estilo sin
            dependencia de Tailwind.
          </p>
        </details>

        <details class="group">
          <summary class="text-body-lg-500 cursor-pointer py-space-3 text-canvas-fg">
            ¿Con qué frecuencia se publican nuevas versiones?
          </summary>
          <p class="text-body-md text-neutral-600 pb-space-6">
            Coherence sigue un ciclo de publicación mensual para versiones menores. Las correcciones
            críticas se publican como parches en cuanto están listas. Consulte el changelog para
            el historial completo de cambios.
          </p>
        </details>

      </div>

      <!-- Temas relacionados -->
      <hr class="border-border-hairline mt-space-12 mb-space-6" />
      <section>
        <h2 id="temas-relacionados" class="text-section text-canvas-fg mb-space-4">Temas relacionados</h2>
        <ul class="text-body-sm text-action-700 space-y-space-2">
          <li><a routerLink="/recursos/descargas" class="underline hover:text-action-800">Descargas</a></li>
          <li><a routerLink="/recursos/changelog" class="underline hover:text-action-800">Changelog</a></li>
          <li><a routerLink="/recursos/roadmap" class="underline hover:text-action-800">Roadmap</a></li>
        </ul>
      </section>
    </div>
  `,
})
export class FaqPage {}
