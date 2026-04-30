import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

/**
 * Tier 2 (semantics) -> PrimeNG component variables.
 * design.md rule: Tier 2 is what we ship to PrimeNG.
 * Action ramp = AzulProfundo (light-mode primary).
 */
const AfiPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  'var(--action-50)',
      100: 'var(--action-100)',
      200: 'var(--action-200)',
      300: 'var(--action-300)',
      400: 'var(--action-400)',
      500: 'var(--action-500)',
      600: 'var(--action-600)',
      700: 'var(--action-700)',
      800: 'var(--action-800)',
      900: 'var(--action-900)',
      950: 'var(--action-900)',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AfiPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
  ],
};
