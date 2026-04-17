import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-docs-shell-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Shells</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Docs</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        El shell de documentación — este mismo sitio lo usa. Sidebar con secciones expandibles,
        columna de lectura estrecha y TOC en el rail derecho.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <section class="mb-space-12">
        <h2 id="anatomia" class="text-section text-canvas-fg mb-space-4">Anatomía</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Sidebar persistente (260 px), columna de contenido centrada (max 920 px) y rail derecho
          opcional para el índice de la página (TOC con scroll-spy).
        </p>
        <div class="grid grid-cols-4 gap-space-3 max-w-[720px] mb-space-6">
          <div class="h-32 rounded-md bg-surface-quiet border border-border-hairline flex items-center justify-center text-body-sm text-neutral-500">
            Sidebar
          </div>
          <div class="col-span-2 h-32 rounded-md bg-surface-quiet border border-border-hairline flex items-center justify-center text-body-sm text-neutral-500">
            Contenido
          </div>
          <div class="h-32 rounded-md bg-surface-quiet border border-border-hairline flex items-center justify-center text-body-sm text-neutral-500">
            TOC
          </div>
        </div>
      </section>

      <section class="mb-space-12">
        <h2 id="composicion" class="text-section text-canvas-fg mb-space-4">Composición</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-shell</code> con <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">type="docs"</code></li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-sidebar</code> — secciones expandibles con NavSection</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-toc</code> — IntersectionObserver scroll-spy en rail derecho</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-doc-page-layout</code> — kicker + título + tabs Code/Design</li>
        </ul>
      </section>

      <section class="mb-space-12">
        <h2 id="cuando-usar" class="text-section text-canvas-fg mb-space-4">Cuándo usar</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Sitios de documentación de sistemas de diseño o productos internos</li>
          <li>Bases de conocimiento con jerarquía de secciones</li>
          <li>Guías de onboarding con contenido largo y navegación lateral</li>
        </ul>
      </section>

      <section class="mb-space-12">
        <h2 id="cuando-no-usar" class="text-section text-canvas-fg mb-space-4">Cuándo NO usar</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Paneles operacionales con tablas — use Workspace</li>
          <li>Landing pages de marketing — no aplica el shell de docs</li>
        </ul>
      </section>

      <section class="mb-space-10">
        <h2 id="meta" class="text-section text-canvas-fg mb-space-4">Meta: este sitio</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px]">
          El sitio de Coherence DS es la implementación canónica del shell Docs.
          Cada decisión de layout visible aquí — el ancho de la columna, la sidebar sin borde derecho,
          los hairline dividers — sigue la especificación documentada en
          <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">docs/build-prompts/coherence-site-bootstrap.md</code>.
        </p>
      </section>

      <hr class="border-border-hairline mb-space-6" />
      <nav class="flex flex-wrap gap-space-4 text-body-sm">
        <span class="text-neutral-400">Temas relacionados:</span>
        <a routerLink="/componentes/shell" class="text-action-500 hover:underline">Shell</a>
        <a routerLink="/componentes/sidebar" class="text-action-500 hover:underline">Sidebar</a>
        <a routerLink="/patrones/shells/workspace" class="text-action-500 hover:underline">Workspace shell</a>
      </nav>
    </div>
  `,
})
export class DocsPage {}
