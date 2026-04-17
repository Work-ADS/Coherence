import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'site-patrones-stub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Patterns
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-6">
        Sección en construcción
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-500">
        Contenido detallado próximamente.
      </p>
    </div>
  `,
})
export class PatronesStubPage {}
