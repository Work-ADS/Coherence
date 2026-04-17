import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-shell-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">Patterns / Shells</p>
      <h1 class="text-title text-canvas-fg mb-space-4">Auth</h1>
      <p class="text-body-md text-neutral-500 max-w-[640px] mb-space-10">
        El shell de autenticación — centrado, sin sidebar, optimizado para flujos de login,
        signup y recuperación de contraseña.
      </p>

      <hr class="border-border-hairline mb-space-10" />

      <section class="mb-space-12">
        <h2 id="anatomia" class="text-section text-canvas-fg mb-space-4">Anatomía</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-6">
          Pantalla completa con un contenedor centrado vertical y horizontalmente.
          Sin sidebar, sin header, sin navegación global — el usuario debe completar el flujo
          o salir explícitamente.
        </p>
        <div class="flex justify-center mb-space-6">
          <div class="w-80 h-48 rounded-md bg-surface-quiet border border-border-hairline flex items-center justify-center text-body-sm text-neutral-500">
            Formulario centrado
          </div>
        </div>
      </section>

      <section class="mb-space-12">
        <h2 id="composicion" class="text-section text-canvas-fg mb-space-4">Composición</h2>
        <ul class="list-disc pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-shell</code> con <code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">type="auth"</code></li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-input</code> — email, password</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-button</code> — submit primario</li>
          <li><code class="text-body-sm bg-surface-quiet px-space-2 py-0.5 rounded">afi-loading-overlay</code> — feedback de envío</li>
        </ul>
      </section>

      <section class="mb-space-12">
        <h2 id="flujos" class="text-section text-canvas-fg mb-space-4">Flujos</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px] mb-space-4">
          Tres pantallas estándar que comparten el mismo shell:
        </p>
        <ol class="list-decimal pl-space-6 text-body-md text-neutral-600 max-w-[640px] space-y-space-2">
          <li><strong>Login</strong> — email + password + "Olvidé mi contraseña"</li>
          <li><strong>Signup</strong> — email + password + confirmar + términos</li>
          <li><strong>Reset</strong> — email + instrucciones enviadas</li>
        </ol>
      </section>

      <section class="mb-space-10">
        <h2 id="do-dont" class="text-section text-canvas-fg mb-space-4">Do &amp; Don't</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-space-4 max-w-[720px]">
          <div class="p-space-4 border border-system-success rounded-md">
            <p class="text-body-sm-600 text-system-success mb-space-2">✓ Do</p>
            <p class="text-body-sm text-neutral-600">Incluya un enlace visible para volver al login desde signup y reset.</p>
          </div>
          <div class="p-space-4 border border-system-error rounded-md">
            <p class="text-body-sm-600 text-system-error mb-space-2">✗ Don't</p>
            <p class="text-body-sm text-neutral-600">No muestre la sidebar ni la navegación global — el contexto auth es aislado.</p>
          </div>
        </div>
      </section>

      <hr class="border-border-hairline mb-space-6" />
      <nav class="flex flex-wrap gap-space-4 text-body-sm">
        <span class="text-neutral-400">Temas relacionados:</span>
        <a routerLink="/componentes/shell" class="text-action-500 hover:underline">Shell</a>
        <a routerLink="/componentes/input" class="text-action-500 hover:underline">Input</a>
        <a routerLink="/componentes/button" class="text-action-500 hover:underline">Button</a>
      </nav>
    </div>
  `,
})
export class AuthPage {}
