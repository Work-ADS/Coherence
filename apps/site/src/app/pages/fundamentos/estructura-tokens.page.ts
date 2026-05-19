import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Token file structure — concise reference for the team.
 *
 * One card per .scss file under libs/tokens/. Each card: file name + a short
 * description (≤16 words per sentence, ≤2 sentences). Designed to be
 * scannable in under a minute.
 */
@Component({
  selector: 'site-estructura-tokens-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Fundamentos
      </p>
      <h1 class="text-title text-canvas-fg mb-space-4">Estructura de tokens</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Cómo está organizado <code class="text-body-sm bg-neutral-100 px-1 rounded">libs/tokens/</code>.
        Cada archivo tiene un propósito específico — esta página explica cuál.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- PRIMITIVOS -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Primitivos</h2>
        <p class="text-body-sm text-neutral-600 mb-space-5">
          Valores en bruto. No los referencias desde un componente.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          @for (f of primitivos; track f.name) {
            <article class="border border-border-hairline rounded-md p-space-5">
              <code class="block text-body-sm-600 text-canvas-fg mb-space-2">{{ f.name }}</code>
              <p class="text-body-sm text-neutral-700">{{ f.desc }}</p>
            </article>
          }
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- MARCAS ALTERNATIVAS -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Marcas alternativas</h2>
        <p class="text-body-sm text-neutral-600 mb-space-5">
          AFI vive en <code class="text-body-sm bg-neutral-100 px-1 rounded">:root</code>. Otras marcas se activan con
          <code class="text-body-sm bg-neutral-100 px-1 rounded">&lt;html data-brand="…"&gt;</code>.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          @for (f of marcas; track f.name) {
            <article class="border border-border-hairline rounded-md p-space-5">
              <code class="block text-body-sm-600 text-canvas-fg mb-space-2">{{ f.name }}</code>
              <p class="text-body-sm text-neutral-700">{{ f.desc }}</p>
            </article>
          }
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- SEMÁNTICO + SOPORTE -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Semántico y soporte</h2>
        <p class="text-body-sm text-neutral-600 mb-space-5">
          Donde viven los roles que los componentes consumen y la infraestructura del sistema.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          @for (f of semanticoSoporte; track f.name) {
            <article class="border border-border-hairline rounded-md p-space-5">
              <code class="block text-body-sm-600 text-canvas-fg mb-space-2">{{ f.name }}</code>
              <p class="text-body-sm text-neutral-700">{{ f.desc }}</p>
            </article>
          }
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <hr class="border-neutral-200 mb-space-8" />

      <!-- TOKENS A NIVEL DE PRODUCTO -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">Tokens a nivel de producto</h2>
        <p class="text-body-sm text-neutral-600 mb-space-5">
          Tokens específicos de un producto (no del sistema). Viven fuera de
          <code class="text-body-sm bg-neutral-100 px-1 rounded">libs/tokens/</code> y referencian roles del DS.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4">
          @for (f of productLevel; track f.name) {
            <article class="border border-border-hairline rounded-md p-space-5">
              <code class="block text-body-sm-600 text-canvas-fg mb-space-2">{{ f.name }}</code>
              <p class="text-body-sm text-neutral-700">{{ f.desc }}</p>
            </article>
          }
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- LA REGLA -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-2">La regla</h2>
        <p class="max-w-[640px] text-body-md text-neutral-700 mb-space-3">
          Los componentes consumen sólo tokens semánticos (<code class="text-body-sm bg-neutral-100 px-1 rounded">var(--button-height)</code>,
          <code class="text-body-sm bg-neutral-100 px-1 rounded">var(--feedback-success-background)</code>).
          Nunca primitivos. Nunca valores en bruto.
        </p>
        <p class="max-w-[640px] text-body-md text-neutral-700">
          La capa semántica de color sigue Figma 1:1 — 171 tokens en 12 categorías
          (canvas / surface / brand-primary / brand-secondary / brand-secondary-neutral /
          brand-tertiary / control / input / nav / overlay / feedback / disabled /
          foreground / border / chart). Ver
          <a routerLink="/fundamentos/color-semantic" class="text-action-700 hover:underline">Color semántico</a>.
        </p>
      </section>
    </div>
  `,
  imports: [RouterLink],
})
export class EstructuraTokensPage {
  readonly primitivos = [
    {
      name: 'colors.scss',
      desc: 'Paleta primitiva de AFI. Define las rampas afi-azul, afi-control, info, success, warning, error y data-viz.',
    },
    {
      name: 'dimensions.scss',
      desc: 'Escala completa de 137 dimensiones, radios y breakpoints. Universal entre marcas.',
    },
    {
      name: 'typography.scss',
      desc: 'Familia tipográfica y escala de texto. Define --font-family-serif y --type-*.',
    },
    {
      name: 'elevation.scss',
      desc: 'Sombras y motion (duración, easing). Pendiente de mapear contra Figma.',
    },
  ];

  readonly marcas = [
    {
      name: 'colors-mutualidad.scss',
      desc: 'Paleta de Mutualidad. Activa con <html data-brand="mutualidad">.',
    },
    {
      name: 'colors-unicaja.scss',
      desc: 'Paleta de Unicaja. Activa con <html data-brand="unicaja">.',
    },
  ];

  readonly productLevel = [
    {
      name: 'apps/site/src/styles/wealth-planner.scss',
      desc: 'Tokens del producto Wealth Planner. Define --plan-state-borrador/cumplimentada/descargada/entregada, cada uno apuntando a un rol --feedback-* del DS.',
    },
  ];

  readonly semanticoSoporte = [
    {
      name: 'semantic.scss',
      desc: 'Roles que los componentes consumen. Aquí vive el responsive, las marcas alternativas y el modo oscuro.',
    },
    {
      name: '_mixins.scss',
      desc: 'Utilidad Sass interna. Contiene responsive-token, que emite un token con valores por breakpoint.',
    },
    {
      name: 'aliases.scss',
      desc: 'Compatibilidad con nombres antiguos. Se borra cuando dejen de usarse.',
    },
    {
      name: 'variables.scss',
      desc: 'Punto de entrada. Sólo @imports en orden de cascada — lo único que importa la app.',
    },
  ];
}
