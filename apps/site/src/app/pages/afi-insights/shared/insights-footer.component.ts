import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent, ButtonComponent } from '@coherence/ui';

@Component({
  selector: 'ai-insights-footer',
  standalone: true,
  imports: [RouterLink, InputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-neutral-900 text-white mt-space-16">
      <div class="max-w-[1200px] mx-auto px-space-6 py-space-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-10">
          <!-- Brand -->
          <div>
            <p class="text-body-lg-600 font-serif mb-space-2">AFI Insights</p>
            <p class="text-body-sm text-neutral-400">
              El centro de conocimiento de Afi. Analisis, estudios e informes
              del sector financiero.
            </p>
          </div>

          <!-- Links -->
          <div>
            <p class="text-body-sm font-medium mb-space-3">Categorias</p>
            <ul class="flex flex-col gap-space-1">
              <li><span class="text-body-sm text-neutral-400">Estudios</span></li>
              <li><span class="text-body-sm text-neutral-400">Informes y Notas</span></li>
              <li><span class="text-body-sm text-neutral-400">Articulos</span></li>
              <li><span class="text-body-sm text-neutral-400">Eventos</span></li>
              <li><span class="text-body-sm text-neutral-400">Media</span></li>
            </ul>
          </div>

          <!-- Mini subscribe -->
          <div>
            <p class="text-body-sm font-medium mb-space-3">Newsletter</p>
            <p class="text-body-sm text-neutral-400 mb-space-3">
              Recibe lo mejor de AFI Insights directamente en tu bandeja.
            </p>
            <div class="flex gap-space-2">
              <div class="flex-1">
                <afi-input
                  type="email"
                  placeholder="tu email corporativo"
                  ariaLabel="Email para newsletter"
                  size="sm"
                />
              </div>
              <afi-button variant="primary" size="sm">Suscribir</afi-button>
            </div>
          </div>
        </div>

        <div class="border-t border-neutral-700 mt-space-10 pt-space-6">
          <p class="text-caption text-neutral-500 text-center">
            Coherence DS — Ejemplo de AFI Insights
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class InsightsFooterComponent {}
