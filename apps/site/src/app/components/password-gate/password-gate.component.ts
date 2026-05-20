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
  templateUrl: './password-gate.component.html',
  styleUrl: './password-gate.component.scss',
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
