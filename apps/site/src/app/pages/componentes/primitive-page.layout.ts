import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export type PrimitiveTab = 'demo' | 'api' | 'accesibilidad' | 'dodont';

const TAB_LABELS: Record<PrimitiveTab, string> = {
  demo: 'Demo',
  api: 'API',
  accesibilidad: 'Accesibilidad',
  dodont: "Do & Don't",
};

const TAB_ORDER: PrimitiveTab[] = ['demo', 'api', 'accesibilidad', 'dodont'];

/**
 * Shared layout for all primitive detail pages.
 * Provides: breadcrumb, title, role description, 4-tab bar, and content area.
 * Each tab's content is projected via named slots.
 *
 * Uses @switch on a signal instead of <afi-tabs> (content projection bug).
 */
@Component({
  selector: 'site-primitive-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-12">
      <!-- Breadcrumb -->
      <nav class="text-body-sm text-neutral-400 mb-space-4" aria-label="Migas de pan">
        <a routerLink="/componentes" class="hover:text-canvas-fg transition-colors duration-fast">Componentes</a>
        <span class="mx-1.5 text-neutral-300">/</span>
        <span class="text-canvas-fg">{{ name() }}</span>
      </nav>

      <!-- Title + role -->
      <h1 class="text-subtitle text-canvas-fg mb-space-3">{{ name() }}</h1>
      <p class="max-w-[640px] text-body-md text-neutral-500 mb-space-8">{{ role() }}</p>

      <!-- Tab bar -->
      <div
        class="flex gap-space-1 border-b border-border-hairline mb-space-10"
        role="tablist"
        aria-label="Secciones del primitivo"
      >
        @for (tab of tabs; track tab) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="activeTab() === tab"
            class="px-space-4 py-space-3 text-body-sm transition-colors duration-fast -mb-px"
            [class.border-b-2]="activeTab() === tab"
            [class.border-action]="activeTab() === tab"
            [class.text-canvas-fg]="activeTab() === tab"
            [class.font-medium]="activeTab() === tab"
            [class.text-neutral-400]="activeTab() !== tab"
            [class.hover:text-canvas-fg]="activeTab() !== tab"
            (click)="activeTab.set(tab)"
          >{{ tabLabels[tab] }}</button>
        }
      </div>

      <!-- Tab content via @switch -->
      @switch (activeTab()) {
        @case ('demo') {
          <ng-content select="[tab=demo]" />
        }
        @case ('api') {
          <ng-content select="[tab=api]" />
        }
        @case ('accesibilidad') {
          <ng-content select="[tab=accesibilidad]" />
        }
        @case ('dodont') {
          <ng-content select="[tab=dodont]" />
        }
      }
    </div>
  `,
})
export class PrimitivePageLayout {
  readonly name = input.required<string>();
  readonly role = input<string>('');

  readonly activeTab = signal<PrimitiveTab>('demo');
  readonly tabs = TAB_ORDER;
  readonly tabLabels = TAB_LABELS;
}
