import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  Search,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Send,
  RefreshCw,
  Bell,
  Monitor,
  Calculator,
  Receipt,
  Upload,
  Accessibility,
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Search,
        Users,
        FileText,
        MessageSquare,
        Settings,
        Send,
        RefreshCw,
        Bell,
        Monitor,
        Calculator,
        Receipt,
        Upload,
        Accessibility,
      }),
    ),
  ],
};
