import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'site-git-ramas-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Primeros pasos</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Ramas de Git</h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Convenciones y flujo de trabajo para crear, enviar y eliminar ramas
        dentro del equipo de Coherence.
      </p>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Convención de nombres -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Convención de nombres</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Usamos prefijos para identificar el tipo de cambio:</p>
          <ul class="list-disc pl-space-5 space-y-space-1">
            <li><code class="text-body-sm bg-neutral-100 px-1 rounded">feature/</code> — nueva funcionalidad.</li>
            <li><code class="text-body-sm bg-neutral-100 px-1 rounded">fix/</code> — corrección de un bug.</li>
            <li><code class="text-body-sm bg-neutral-100 px-1 rounded">chore/</code> — mantenimiento, dependencias, CI.</li>
          </ul>
          <p>Ejemplo: <code class="text-body-sm bg-neutral-100 px-1 rounded">feature/token-dark-mode</code></p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Crear una rama -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Crear una rama</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Parte siempre de <code class="text-body-sm bg-neutral-100 px-1 rounded">main</code> actualizado:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>git checkout main
git pull origin main
git checkout -b feature/mi-cambio</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Enviar cambios -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Enviar cambios</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Sigue el formato de commit convencional:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>git add .
git commit -m "feat(tokens): add dark-mode palette"
git push -u origin feature/mi-cambio</code></pre>
          <p>
            Prefijos válidos: <code class="text-body-sm bg-neutral-100 px-1 rounded">feat</code>,
            <code class="text-body-sm bg-neutral-100 px-1 rounded">fix</code>,
            <code class="text-body-sm bg-neutral-100 px-1 rounded">chore</code>,
            <code class="text-body-sm bg-neutral-100 px-1 rounded">docs</code>,
            <code class="text-body-sm bg-neutral-100 px-1 rounded">refactor</code>.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Solicitar revisión -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Solicitar revisión (PR)</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>
            Abre un Pull Request en GitHub apuntando a <code class="text-body-sm bg-neutral-100 px-1 rounded">main</code>.
            Describe el cambio, enlaza el issue y solicita revisión de al menos un compañero.
          </p>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-8" />

      <!-- Eliminar una rama -->
      <section class="mb-space-10">
        <h2 class="text-section text-canvas-fg mb-space-3">Eliminar una rama</h2>
        <div class="max-w-[640px] text-body-md text-neutral-700 space-y-space-3">
          <p>Después de que el PR se fusione, limpia la rama local y remota:</p>
          <pre class="bg-neutral-50 border border-neutral-200 rounded-md p-space-4 text-body-sm overflow-x-auto"><code>git branch -d feature/mi-cambio
git push origin --delete feature/mi-cambio</code></pre>
        </div>
      </section>

      <hr class="border-neutral-200 mb-space-10" />

      <!-- Temas relacionados -->
      <footer>
        <h2 class="text-section text-canvas-fg mb-space-3">Temas relacionados</h2>
        <ul class="space-y-space-2">
          <li><a routerLink="/primeros-pasos/cambiar-marca-diseno" class="text-body-md text-action-700 hover:underline">Cambiar de marca · Diseño</a></li>
          <li><a routerLink="/primeros-pasos/cambiar-marca-desarrollo" class="text-body-md text-action-700 hover:underline">Cambiar de marca · Desarrollo</a></li>
        </ul>
      </footer>
    </div>
  `,
})
export class GitRamasPage {}
