import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Visual reference for the 171 AFI semantic color tokens — scaffolded.
 *
 * Each entry: swatch + name + role + use-case. Organized by the 12 categories
 * AFI's Figma uses (canvas / surface / brand-{primary,secondary,...} /
 * control / input / nav / overlay / feedback / disabled / foreground / border
 * / chart).
 *
 * SCAFFOLDED. ~10 illustrative entries; the rest populate alongside component
 * build sessions. See semantic.scss for the source of truth + inline
 * `// Role:` comments.
 */
@Component({
  selector: 'site-color-semantic-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Fundamentos
      </p>
      <h1 class="text-title text-canvas-fg mb-space-4">Color semántico</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        171 tokens semánticos de color organizados en 12 categorías (canvas, surface,
        brand, control, input, nav, overlay, feedback, disabled, foreground, border, chart).
        Cada token tiene un rol y un caso de uso explícito.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Aviso de andamio -->
      <section class="mb-space-10 p-space-5 border border-border-hairline rounded-md bg-neutral-50">
        <h2 class="text-section text-canvas-fg mb-space-2">⚠️ Página en construcción</h2>
        <p class="max-w-[640px] text-body-sm text-neutral-700">
          Esta página es un andamio con ~10 tokens de muestra de cada categoría clave.
          El resto (≈160 entradas) se rellena a medida que construimos componentes y validamos
          casos de uso reales. La fuente de la verdad es
          <code class="text-body-sm bg-neutral-100 px-1 rounded">libs/tokens/semantic.scss</code>
          — cada token tiene un comentario inline <code class="text-body-sm bg-neutral-100 px-1 rounded">// Role: ...</code>.
        </p>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Categoría: Canvas -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Canvas</h2>
        <p class="text-body-sm text-neutral-600 mb-space-5">
          Superficies a nivel página (2 tokens).
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          @for (t of canvasTokens; track t.name) {
            <article class="border border-border-hairline rounded-md overflow-hidden">
              <div
                class="h-20 border-b border-border-hairline"
                [style.background-color]="'var(' + t.name + ')'"></div>
              <div class="p-space-4">
                <code class="block text-body-sm-600 text-canvas-fg mb-space-2">{{ t.name }}</code>
                <p class="text-body-sm text-neutral-700 mb-space-2">{{ t.role }}</p>
                <p class="text-caption text-neutral-500">{{ t.useCase }}</p>
              </div>
            </article>
          }
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Categoría: Brand · Primary -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Brand · Primary</h2>
        <p class="text-body-sm text-neutral-600 mb-space-5">
          afi-azul. La marca más visible — usar sólo para CTAs principales.
          12 tokens (background / foreground / border × default / hover / active / disabled).
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          @for (t of brandPrimaryTokens; track t.name) {
            <article class="border border-border-hairline rounded-md overflow-hidden">
              <div
                class="h-20 border-b border-border-hairline"
                [style.background-color]="'var(' + t.name + ')'"></div>
              <div class="p-space-4">
                <code class="block text-body-sm-600 text-canvas-fg mb-space-2">{{ t.name }}</code>
                <p class="text-body-sm text-neutral-700 mb-space-2">{{ t.role }}</p>
                <p class="text-caption text-neutral-500">{{ t.useCase }}</p>
              </div>
            </article>
          }
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Categoría: Feedback (muestra) -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Feedback</h2>
        <p class="text-body-sm text-neutral-600 mb-space-5">
          Estados del sistema: success, error, warning, info. 15 tokens en total.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          @for (t of feedbackTokens; track t.name) {
            <article class="border border-border-hairline rounded-md overflow-hidden">
              <div
                class="h-20 border-b border-border-hairline"
                [style.background-color]="'var(' + t.name + ')'"></div>
              <div class="p-space-4">
                <code class="block text-body-sm-600 text-canvas-fg mb-space-2">{{ t.name }}</code>
                <p class="text-body-sm text-neutral-700 mb-space-2">{{ t.role }}</p>
                <p class="text-caption text-neutral-500">{{ t.useCase }}</p>
              </div>
            </article>
          }
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Categorías restantes -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Resto de categorías</h2>
        <p class="max-w-[640px] text-body-md text-neutral-700 mb-space-4">
          Las 9 categorías restantes (surface, brand-secondary, brand-secondary-neutral,
          brand-tertiary, control, input, nav, overlay, disabled, foreground, border, chart)
          se documentarán a medida que se construyan los componentes correspondientes.
        </p>
        <p class="max-w-[640px] text-body-sm text-neutral-600">
          Mientras tanto, consulta
          <code class="text-body-sm bg-neutral-100 px-1 rounded">libs/tokens/semantic.scss</code>
          — cada token tiene su comentario <code class="text-body-sm bg-neutral-100 px-1 rounded">// Role:</code>
          inline.
        </p>
      </section>
    </div>
  `,
})
export class ColorSemanticPage {
  readonly canvasTokens = [
    {
      name: '--canvas-primary',
      role: 'Fondo principal de la página.',
      useCase: 'Wrapper de toda ruta. Capa más baja del layout.',
    },
    {
      name: '--canvas-secondary',
      role: 'Banda recesada dentro de la página.',
      useCase: 'Sub-secciones, raíles de filtros, bloques de contenido secundarios.',
    },
  ];

  readonly brandPrimaryTokens = [
    {
      name: '--brand-primary-background-default',
      role: 'Fondo del CTA primario.',
      useCase: 'Botones "Guardar", "Continuar", "Enviar". Sólo para la acción principal.',
    },
    {
      name: '--brand-primary-background-hover',
      role: 'Fondo del CTA primario al hover.',
      useCase: 'Estado intermedio antes del active. Cambio sutil hacia más oscuro.',
    },
    {
      name: '--brand-primary-background-active',
      role: 'Fondo del CTA primario al pulsar.',
      useCase: 'Estado momentáneo durante el click/tap. Confirma la acción visualmente.',
    },
    {
      name: '--brand-primary-foreground-default',
      role: 'Texto/icono sobre CTA primario.',
      useCase: 'El texto blanco que va sobre el fondo afi-azul.',
    },
  ];

  readonly feedbackTokens = [
    {
      name: '--feedback-success-background',
      role: 'Fondo de notificación / chip de éxito.',
      useCase: 'Toasts "Guardado correctamente", chips de estado "Aprobado".',
    },
    {
      name: '--feedback-error-background',
      role: 'Fondo de notificación / chip de error.',
      useCase: 'Toasts de error, chips "Rechazado", alertas críticas.',
    },
    {
      name: '--feedback-warning-background',
      role: 'Fondo de notificación / chip de aviso.',
      useCase: 'Toasts "Acción requerida", chips "Pendiente", advertencias no críticas.',
    },
    {
      name: '--feedback-info-background',
      role: 'Fondo de notificación / chip informativo.',
      useCase: 'Mensajes informativos, chips "En revisión", banners de novedades.',
    },
  ];
}
