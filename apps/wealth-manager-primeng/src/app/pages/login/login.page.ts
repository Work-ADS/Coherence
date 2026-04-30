import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

import { LogoComponent } from '../../components/logo/logo.component';

@Component({
  selector: 'awmp-login',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    InputTextModule,
    LogoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  readonly email = signal('rgriner@afi.es');
  readonly password = signal('demoPassword123');
  readonly rememberMe = signal(false);

  onSubmit(): void {
    // Presentation-only experiment — no auth wired.
    // Logs to confirm the submit handler fires.
    // eslint-disable-next-line no-console
    console.log('login submit', { email: this.email(), rememberMe: this.rememberMe() });
  }

  onProvider(provider: 'microsoft' | 'afi'): void {
    // eslint-disable-next-line no-console
    console.log('login provider', provider);
  }
}
