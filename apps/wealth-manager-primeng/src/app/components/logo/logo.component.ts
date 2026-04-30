import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * AFI Wealth Manager logo: stylized "W" mark + wordmark.
 * The W mark is a placeholder — three slanted bars in the AFI blue ramp.
 * Swap for the real brand SVG once design provides it.
 */
@Component({
  selector: 'awmp-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="logo">
      <svg
        class="logo__mark"
        width="60"
        height="50"
        viewBox="0 0 60 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M2 6 L18 44 L22 44 L11 6 Z" fill="var(--color-afi-azul-300)" />
        <path d="M18 6 L34 44 L38 44 L27 6 Z" fill="var(--color-afi-azul-500)" />
        <path d="M34 6 L50 44 L54 44 L43 6 Z" fill="var(--action-500)" />
      </svg>
      <div class="logo__wordmark">
        <div class="logo__line">
          <span class="logo__afi">Afi</span><span class="logo__wealth">Wealth</span>
        </div>
        <div class="logo__manager">Manager</div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .logo {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
      }
      .logo__mark {
        flex: 0 0 auto;
      }
      .logo__wordmark {
        font-family: 'Roboto', system-ui, sans-serif;
        line-height: 1.05;
        letter-spacing: -0.01em;
      }
      .logo__line {
        font-size: 1.25rem;
        font-weight: 500;
      }
      .logo__afi {
        color: var(--color-afi-azul-500);
      }
      .logo__wealth {
        color: var(--color-afi-azul-500);
      }
      .logo__manager {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--action-500);
      }
    `,
  ],
})
export class LogoComponent {}
