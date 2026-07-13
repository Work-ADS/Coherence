import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonV2Component, InputV2Component } from '@coherence/ui';
import type { ButtonV2Size, ButtonV2Variant, InputV2Size } from '@coherence/ui';

import { DemoShellComponent } from '../demo-shell/demo-shell.component';

/**
 * Identity v2 workbench — the foundations-modern proving ground.
 *
 * Shows every variant × size × state grid for the v2 primitives as they land
 * (button first, input next). Throwaway chrome by design: this page grows into
 * the component moodboard for Borja, so styling stays minimal and local.
 *
 * The `data-foundation="modern"` attribute on the root div activates the
 * scoped token mirror; the demo-shell chrome around it stays on the legacy
 * foundation on purpose.
 */
@Component({
  selector: 'site-foundations-modern-workbench-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonV2Component, InputV2Component, DemoShellComponent],
  templateUrl: './foundations-modern-workbench.page.html',
  styleUrls: ['./foundations-modern-workbench.page.scss'],
})
export class FoundationsModernWorkbenchPage {
  readonly variants: ButtonV2Variant[] = ['primary', 'secondary', 'ghost', 'destructive'];
  readonly sizes: ButtonV2Size[] = ['xs', 'sm', 'md', 'lg'];

  readonly inputSizes: InputV2Size[] = ['sm', 'md', 'lg'];

  readonly labels: Record<ButtonV2Variant, string> = {
    primary: 'Guardar',
    secondary: 'Cancelar',
    ghost: 'Ver detalle',
    destructive: 'Eliminar',
  };

  readonly simulating = signal(false);

  onSimulate(): void {
    if (this.simulating()) {
      return;
    }

    this.simulating.set(true);
    setTimeout(() => this.simulating.set(false), 2000);
  }
}
