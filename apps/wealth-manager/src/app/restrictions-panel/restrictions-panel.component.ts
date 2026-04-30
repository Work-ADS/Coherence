import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  inject,
} from '@angular/core';

import {
  TabsComponent,
  TabComponent,
  StatusChipComponent,
} from '@coherence/ui';
import type { Estado } from '@coherence/ui';

import { TelemetryService } from '../data/telemetry.service';

interface Restriction {
  id: string;
  name: string;
  threshold: string | null;
  status: 'ok' | 'atencion' | 'restringido';
  reference: string;
  rationale?: string;
}

interface RestrictionsData {
  regulatoria: Restriction[];
  esg: Restriction[];
  contrato: Restriction[];
}

const STATUS_TO_ESTADO: Record<string, Estado> = {
  'ok': 'aprobada',
  'atencion': 'en-revision',
  'restringido': 'rechazada',
};

@Component({
  selector: 'awm-restrictions-panel',
  standalone: true,
  imports: [TabsComponent, TabComponent, StatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="w-[320px] border-l border-border-hairline bg-surface-quiet flex flex-col h-full">
      <!-- Sticky header -->
      <div class="px-space-4 pt-space-4 pb-space-3 border-b border-border-hairline">
        <h3 class="text-section text-canvas-fg">Restricciones</h3>
      </div>

      <!-- Tabs -->
      <afi-tabs
        [activeIndex]="activeTab()"
        (activeChange)="switchTab($event)"
        ariaLabel="Categorías de restricciones"
        size="sm"
      >
        <afi-tab label="Regulatoria" />
        <afi-tab label="ESG" />
        <afi-tab label="Contrato" />
      </afi-tabs>

      <!-- Scrollable restriction list -->
      <div class="flex-1 overflow-y-auto px-space-4 py-space-3">
        <ul class="space-y-space-2" role="list">
          @for (item of activeItems(); track item.id) {
            <li
              class="flex items-start gap-space-3 p-space-3 rounded-md hover:bg-surface-100
                     transition-colors duration-fast cursor-default"
              [title]="item.reference + (item.rationale ? ' — ' + item.rationale : '')"
              (mouseenter)="onHover(item)"
            >
              <afi-status-chip [estado]="mapStatus(item.status)" size="sm" />
              <div class="flex-1 min-w-0">
                <span class="text-body-sm text-canvas-fg block">{{ item.name }}</span>
                @if (item.threshold) {
                  <span class="text-body-xs text-neutral-400 block mt-0.5">{{ item.threshold }}</span>
                }
              </div>
            </li>
          }
        </ul>
      </div>
    </aside>
  `,
})
export class RestrictionsPanelComponent {
  private readonly telemetry = inject(TelemetryService);

  readonly data = input.required<RestrictionsData>();
  readonly activeTab = signal(0);

  private readonly tabKeys: (keyof RestrictionsData)[] = ['regulatoria', 'esg', 'contrato'];

  activeItems(): Restriction[] {
    const key = this.tabKeys[this.activeTab()] ?? 'regulatoria';
    return this.data()[key] ?? [];
  }

  mapStatus(status: string): Estado {
    return STATUS_TO_ESTADO[status] ?? 'borrador';
  }

  switchTab(index: number): void {
    this.activeTab.set(index);
    this.telemetry.emit('propuestas.restrictions-panel.tab-switched', {
      segment: this.tabKeys[index],
    });
  }

  onHover(item: Restriction): void {
    this.telemetry.emit('propuestas.restrictions-panel.hovered', { id: item.id });
  }
}
