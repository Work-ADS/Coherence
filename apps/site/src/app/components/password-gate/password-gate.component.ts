import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ButtonComponent, InputComponent, LogoComponent } from '@coherence/ui';

const PASSWORD = 'simulatorinnovation2026';

@Component({
  selector: 'site-password-gate',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent, ButtonComponent, LogoComponent],
  template: `
    <div
      class="min-h-screen flex items-center justify-center
             bg-surface-base text-canvas-fg
             px-space-6 py-space-8"
    >
      <div class="w-full max-w-md flex flex-col gap-space-6 items-center">
        <coherence-logo variant="positivo" size="lg" />

        <div
          class="w-full bg-surface-elevated rounded-md shadow-md
                 p-space-6 flex flex-col gap-space-4"
        >
          <div class="flex flex-col gap-space-1">
            <h1 class="text-section font-medium text-canvas-fg">Coherence</h1>
            <p class="text-body-sm text-canvas-fg-muted">
              Introduce la contrasena para acceder al sistema de diseno.
            </p>
          </div>

          <form (submit)="onSubmit($event)" class="flex flex-col gap-space-4">
            <div #firstInput>
              <afi-input
                type="password"
                label="Contrasena"
                autocomplete="current-password"
                [value]="value()"
                [error]="error()"
                (valueChange)="onValueChange($event)"
              />
            </div>

            <afi-button variant="primary" type="submit" [fullWidth]="true">
              Entrar
            </afi-button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class PasswordGateComponent {
  readonly unlocked = output<void>();

  readonly value = signal('');
  readonly error = signal<string | null>(null);

  private readonly firstInput = viewChild<ElementRef<HTMLDivElement>>('firstInput');

  constructor() {
    afterNextRender(() => {
      this.firstInput()?.nativeElement.querySelector('input')?.focus();
    });
  }

  onValueChange(next: string | number | null): void {
    this.value.set(typeof next === 'string' ? next : String(next ?? ''));
    if (this.error()) this.error.set(null);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.value() === PASSWORD) {
      this.error.set(null);
      this.unlocked.emit();
      return;
    }
    this.error.set('Contrasena incorrecta. Intentalo de nuevo.');
    this.firstInput()?.nativeElement.querySelector('input')?.focus();
  }
}
