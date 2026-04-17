import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-importacion-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Flujos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Importación</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        Flujo de carga masiva de datos: seleccionar archivo, validar filas, mostrar errores
        y confirmar la importación — todo sin salir de la vista actual.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <section class="mb-space-12">
        <h2 id="secuencia" class="text-section text-canvas-fg mb-space-4">Secuencia</h2>
        <ol class="list-decimal pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-3">
          <li>
            <strong>Seleccionar archivo</strong> — el usuario hace clic en "Importar" (Button primary).
            Se abre un Drawer lateral con un área de drop o selector de archivo.
          </li>
          <li>
            <strong>Validación</strong> — LoadingOverlay con progreso mientras se parsean las filas.
            Badge muestra el conteo de filas válidas vs. errores.
          </li>
          <li>
            <strong>Revisión</strong> — Table dentro del Drawer muestra las filas parseadas.
            Las filas con error se marcan con StatusChip variant="error".
          </li>
          <li>
            <strong>Confirmación</strong> — Button "Confirmar importación" ejecuta la carga.
            LoadingOverlay cubre la tabla durante el envío.
          </li>
          <li>
            <strong>Resultado</strong> — Badge de éxito + resumen: "142 filas importadas, 3 omitidas".
          </li>
        </ol>
      </section>

      <section class="mb-space-12">
        <h2 id="composicion" class="text-section text-canvas-fg mb-space-4">Composición</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-drawer</code> — contenedor lateral del flujo</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-table</code> — preview de filas parseadas</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-badge</code> — conteos de válidas / errores</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-loading-overlay</code> — feedback de parsing y envío</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-status-chip</code> — marcador de error por fila</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-button</code> — acciones primarias y secundarias</li>
        </ul>
      </section>

      <section class="mb-space-10">
        <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do &amp; Don't</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 max-w-[720px]">
          <div class="p-space-4 border border-system-success rounded-md">
            <p class="text-body-sm-600 text-system-success mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-600">Muestre siempre un resumen antes de confirmar — el usuario debe ver cuántas filas se importarán.</p>
          </div>
          <div class="p-space-4 border border-system-error rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-600">No cierre el Drawer automáticamente al completar — deje que el usuario revise el resultado.</p>
          </div>
        </div>
      </section>

      <hr class="border-border-hairline mb-space-6" />
      <nav class="flex flex-wrap gap-space-4 text-body-sm">
        <span class="text-neutral-400">Temas relacionados:</span>
        <a routerLink="/componentes/drawer" class="text-action-500 hover:underline">Drawer</a>
        <a routerLink="/componentes/table" class="text-action-500 hover:underline">Table</a>
        <a routerLink="/componentes/loading-overlay" class="text-action-500 hover:underline">LoadingOverlay</a>
        <a routerLink="/patrones/flujos/edicion-de-fila" class="text-action-500 hover:underline">Edición de fila</a>
      </nav>
    </div>
  `,
})
export class ImportacionPage {}
