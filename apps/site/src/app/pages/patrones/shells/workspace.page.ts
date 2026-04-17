import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workspace-shell-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Shells</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Workspace</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        El shell de datos y operación — el contexto principal de AWM donde los usuarios gestionan
        entidades, navegan tablas y ejecutan acciones masivas.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <section class="mb-space-12">
        <h2 id="anatomia" class="text-section text-canvas-fg mb-space-4">Anatomía</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Tres regiones fijas: sidebar colapsable a la izquierda, barra de acciones superior
          y área de contenido principal que aloja tablas, formularios o vistas de detalle.
        </p>
        <div class="grid grid-cols-3 gap-space-3 max-w-[720px] mb-space-6">
          <div class="h-32 rounded-md bg-surface-quiet border border-border-hairline flex items-center justify-center text-body-sm text-neutral-500">
            Sidebar
          </div>
          <div class="col-span-2 h-32 rounded-md bg-surface-quiet border border-border-hairline flex items-center justify-center text-body-sm text-neutral-500">
            Contenido principal
          </div>
        </div>
      </section>

      <section class="mb-space-12">
        <h2 id="composicion" class="text-section text-canvas-fg mb-space-4">Composición</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Workspace combina los siguientes primitivos:
        </p>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-shell</code> con <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">type="workspace"</code></li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-sidebar</code> — nav colapsable con hover-expand</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-page-header</code> — título, breadcrumb, acciones</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-table</code> — vista tabular principal</li>
        </ul>
      </section>

      <section class="mb-space-12">
        <h2 id="cuando-usar" class="text-section text-canvas-fg mb-space-4">Cuándo usar</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Pantallas de listado CRUD con tablas y filtros</li>
          <li>Dashboards operacionales con métricas y gráficos</li>
          <li>Vistas de detalle de entidad con acciones contextuales</li>
        </ul>
      </section>

      <section class="mb-space-12">
        <h2 id="cuando-no-usar" class="text-section text-canvas-fg mb-space-4">Cuándo NO usar</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li>Flujos de autenticación — use el shell Auth</li>
          <li>Documentación pública — use el shell Docs</li>
          <li>Flujos guiados paso a paso — use el shell Focus</li>
        </ul>
      </section>

      <section class="mb-space-10">
        <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do &amp; Don't</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 max-w-[720px]">
          <div class="p-space-4 border border-system-success rounded-md">
            <p class="text-body-sm-600 text-system-success mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-600">Mantenga la sidebar colapsada por defecto en pantallas menores a 1280 px.</p>
          </div>
          <div class="p-space-4 border border-system-error rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-600">No anidar un shell Workspace dentro de otro — cada vista tiene un solo shell raíz.</p>
          </div>
        </div>
      </section>

      <hr class="border-border-hairline mb-space-6" />
      <nav class="flex flex-wrap gap-space-4 text-body-sm">
        <span class="text-neutral-400">Temas relacionados:</span>
        <a routerLink="/componentes/shell" class="text-action-500 hover:underline">Shell</a>
        <a routerLink="/componentes/sidebar" class="text-action-500 hover:underline">Sidebar</a>
        <a routerLink="/componentes/table" class="text-action-500 hover:underline">Table</a>
        <a routerLink="/patrones/shells/docs" class="text-action-500 hover:underline">Docs shell</a>
      </nav>
    </div>
  `,
})
export class WorkspacePage {}
