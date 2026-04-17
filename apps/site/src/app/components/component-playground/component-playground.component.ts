import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

/**
 * Component playground: preview/code toggle on the left + controls rail on the right.
 * Rev5 layout — controls on RIGHT, nested [Vista previa | Código] toggle at top.
 *
 * Slots:
 *   [slot=preview]  — live primitive with bound state
 *   [slot=controls] — the right-rail form (radios, checkboxes, text inputs)
 */
@Component({
  selector: 'afi-component-playground',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-lg border border-border-hairline overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <!-- Left: preview/code area -->
        <div class="flex-1 min-w-0">
          <!-- Top bar: nested toggle -->
          <div class="flex items-center px-space-4 py-space-2 border-b border-border-hairline bg-neutral-50/60">
            <div class="flex" role="tablist" aria-label="Alternar vista">
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="!showCode()"
                class="px-space-3 py-space-1 text-body-sm rounded-l-md border border-border-hairline
                       transition-colors duration-fast"
                [class.bg-white]="!showCode()"
                [class.text-canvas-fg]="!showCode()"
                [class.font-medium]="!showCode()"
                [class.text-neutral-400]="showCode()"
                [class.bg-transparent]="showCode()"
                [class.border-transparent]="showCode()"
                (click)="showCode.set(false)"
              >Vista previa</button>
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="showCode()"
                class="px-space-3 py-space-1 text-body-sm rounded-r-md border border-border-hairline -ml-px
                       transition-colors duration-fast"
                [class.bg-white]="showCode()"
                [class.text-canvas-fg]="showCode()"
                [class.font-medium]="showCode()"
                [class.text-neutral-400]="!showCode()"
                [class.bg-transparent]="!showCode()"
                [class.border-transparent]="!showCode()"
                (click)="showCode.set(true)"
              >Código</button>
            </div>
          </div>

          <!-- Content area -->
          @if (!showCode()) {
            <div class="flex items-center justify-center min-h-[200px] p-space-8 bg-white">
              <ng-content select="[slot=preview]" />
            </div>
          } @else {
            <pre
              class="overflow-x-auto p-space-5 text-body-sm font-mono leading-relaxed bg-surface-quiet text-canvas-fg min-h-[200px]"
              aria-label="Código de ejemplo"
            ><code>{{ code() }}</code></pre>
          }
        </div>

        <!-- Right rail: controls -->
        <div class="md:w-[240px] shrink-0 border-t md:border-t-0 md:border-l border-border-hairline bg-neutral-50/40">
          <div class="px-space-5 py-space-4">
            <p class="text-body-sm font-medium text-canvas-fg mb-space-4">Configurar</p>
            <div class="space-y-space-4 text-body-sm">
              <ng-content select="[slot=controls]" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <span class="sr-only" aria-live="polite">Vista: {{ showCode() ? 'Código' : 'Vista previa' }}</span>
  `,
})
export class ComponentPlaygroundComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('html');

  readonly showCode = signal(false);
}
