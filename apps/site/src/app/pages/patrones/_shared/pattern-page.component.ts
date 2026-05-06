import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import {
  PageHeaderComponent,
  TabsComponent,
  TabComponent,
} from '@coherence/ui';

@Component({
  selector: 'site-pattern-page',
  standalone: true,
  imports: [PageHeaderComponent, TabsComponent, TabComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas-base">
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1200px] mx-auto py-space-10 px-space-8">
          <afi-page-header
            [title]="title()"
            [subtitle]="subtitle()"
            [sticky]="false"
            [scrollFade]="false"
          >
            @if (eyebrow(); as e) {
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700">
                {{ e }}
              </span>
            }
            <ng-content select="[slot=actions]" />
          </afi-page-header>

          <div class="mt-space-8">
            <afi-tabs
              [activeIndex]="activeTab()"
              ariaLabel="Vistas del patrón"
              (activeChange)="onTabChange($event)"
            >
              <afi-tab label="Decisiones" />
              <afi-tab label="Handoff" />
            </afi-tabs>

            <div class="mt-space-8">
              @switch (activeTab()) {
                @case (0) {
                  <ng-content select="[slot=decisiones]" />
                }
                @case (1) {
                  <ng-content select="[slot=handoff]" />
                }
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class PatternPageComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly eyebrow = input<string | null>(null);

  protected readonly activeTab = signal(0);

  protected onTabChange(index: number): void {
    this.activeTab.set(index);
  }
}
