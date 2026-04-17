import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edicion-de-fila-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Flujos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Edición de fila</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Patrón de edición inline: seleccionar una fila en la tabla, abrir un Drawer lateral
        con el formulario de edición y guardar sin abandonar la vista de listado.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <section class="mb-space-12">
        <h2 id="secuencia" class="text-section text-canvas-fg mb-space-4">Secuencia</h2>
        <ol class="list-decimal pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-3">
          <li>
            <strong>Selección</strong> — el usuario hace clic en una fila de la Table.
            La fila se resalta con <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">bg-surface-quiet</code>.
          </li>
          <li>
            <strong>Apertura</strong> — Drawer se abre desde la derecha con los campos de la entidad
            pre-populados. El foco se mueve al primer campo editable.
          </li>
          <li>
            <strong>Edición</strong> — Input, Select, Checkbox según el esquema de la entidad.
            Validación en tiempo real con mensajes de error inline.
          </li>
          <li>
            <strong>Guardado</strong> — Button "Guardar" en el footer del Drawer.
            LoadingOverlay durante el envío. La fila en la tabla se actualiza al cerrar.
          </li>
        </ol>
      </section>

      <section class="mb-space-12">
        <h2 id="composicion" class="text-section text-canvas-fg mb-space-4">Composición</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-table</code> — listado principal con selección de fila</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-drawer</code> — panel de edición lateral</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-input</code>, <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-select</code>, <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-checkbox</code> — campos del formulario</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-button</code> — Guardar / Cancelar</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-loading-overlay</code> — feedback de guardado</li>
        </ul>
      </section>

      <section class="mb-space-10">
        <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do &amp; Don't</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 max-w-[720px]">
          <div class="p-space-4 border border-system-success rounded-md">
            <p class="text-body-sm-600 text-system-success mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-600">Mantenga la tabla visible detrás del Drawer para que el usuario conserve contexto.</p>
          </div>
          <div class="p-space-4 border border-system-error rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-600">No use un Modal para editar — el Drawer permite mantener la tabla visible.</p>
          </div>
        </div>
      </section>

      <hr class="border-border-hairline mb-space-6" />
      <nav class="flex flex-wrap gap-space-4 text-body-sm">
        <span class="text-neutral-400">Temas relacionados:</span>
        <a routerLink="/componentes/table" class="text-action-500 hover:underline">Table</a>
        <a routerLink="/componentes/drawer" class="text-action-500 hover:underline">Drawer</a>
        <a routerLink="/componentes/input" class="text-action-500 hover:underline">Input</a>
        <a routerLink="/patrones/flujos/importacion" class="text-action-500 hover:underline">Importación</a>
      </nav>
    </div>
  `,
})
export class EdicionDeFilaPage {}
