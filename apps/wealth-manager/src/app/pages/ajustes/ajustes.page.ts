import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ButtonComponent,
  InputComponent,
  ModalComponent,
  PageHeaderComponent,
  StatusChipComponent,
  TabsComponent,
  TabComponent,
} from '@coherence/ui';
import type { Estado } from '@coherence/ui';

import { TelemetryService } from '../../data/telemetry.service';
import { RestrictionsPanelComponent } from '../../restrictions-panel/restrictions-panel.component';

import AJUSTES_DATA from '../../../assets/data/ajustes.json';
import RESTRICTIONS_DATA from '../../../assets/data/restrictions.json';

interface Position {
  isin: string;
  name: string;
  class: string;
  pesoActual: number;
  pesoObjetivo: number;
}

interface Cartera {
  id: string;
  name: string;
  positions: Position[];
}

interface AjustesView {
  propuestaId: string;
  propuestaName: string;
  client: string;
  cartera: string;
  carteraModelo: string | null;
  carteras: Cartera[];
}

@Component({
  selector: 'awm-ajustes',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    ModalComponent,
    PageHeaderComponent,
    StatusChipComponent,
    TabsComponent,
    TabComponent,
    RestrictionsPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-canvas-base flex flex-col">
      <!-- Breadcrumb header -->
      <afi-page-header [title]="view().propuestaName" subtitle="Ajustes de cartera" [sticky]="true">
        <nav slot="breadcrumb" aria-label="Navegación">
          <ol class="flex items-center gap-space-2 text-body-sm">
            <li><button type="button" class="text-action hover:underline" (click)="goBack()">Propuestas</button></li>
            <li class="text-neutral-400">/</li>
            <li class="text-canvas-fg font-medium">{{ view().propuestaName }}</li>
          </ol>
        </nav>
      </afi-page-header>

      <!-- Main content + restrictions panel -->
      <div class="flex-1 flex max-w-[1440px] mx-auto w-full">
        <!-- Left: Ajustes body (~70%) -->
        <div class="flex-1 px-space-8 py-space-6 overflow-y-auto">

          <!-- Cartera modelo chip -->
          <div class="flex items-center gap-space-3 mb-space-4">
            @if (view().carteraModelo) {
              <afi-status-chip estado="aprobada" size="sm" />
              <span class="text-body-sm text-canvas-fg">Modelo: {{ view().carteraModelo }}</span>
            } @else {
              <afi-status-chip estado="borrador" size="sm" />
              <span class="text-body-sm text-neutral-500">Sin modelo asignado</span>
            }
          </div>

          <h2 class="text-section text-canvas-fg mb-space-6">Ajustes de cartera</h2>

          <!-- Reclasificación banner -->
          <div class="mb-space-4 px-space-4 py-space-3 rounded-md border border-border-hairline bg-surface-100 text-body-sm text-neutral-600">
            Este tipo de operación puede implicar reclasificación fiscal.
          </div>

          <!-- Cartera tabs -->
          <afi-tabs
            [activeIndex]="activeCartera()"
            (activeChange)="activeCartera.set($event)"
            ariaLabel="Carteras"
            size="sm"
          >
            @for (c of view().carteras; track c.id; let i = $index) {
              <afi-tab [label]="c.name" [disabled]="i > 0" />
            }
          </afi-tabs>

          <!-- Positions table -->
          <div class="mt-space-4 overflow-x-auto rounded-lg border border-border-hairline">
            <table class="w-full text-body-sm">
              <thead>
                <tr class="bg-surface-100 border-b border-border-hairline">
                  <th class="text-left px-space-3 py-space-3 font-medium text-neutral-500" style="width: 320px">Activo</th>
                  <th class="text-right px-space-3 py-space-3 font-medium text-neutral-500" style="width: 120px">Peso actual</th>
                  <th class="text-right px-space-3 py-space-3 font-medium text-neutral-500" style="width: 140px">Peso objetivo</th>
                  <th class="text-right px-space-3 py-space-3 font-medium text-neutral-500" style="width: 120px">Desviación</th>
                </tr>
              </thead>
              <tbody>
                @for (pos of activePositions(); track pos.isin) {
                  <tr class="border-b border-border-hairline last:border-b-0
                             transition-colors duration-fast hover:bg-surface-100">
                    <td class="px-space-3 py-space-2">
                      <div class="text-canvas-fg font-medium">{{ pos.name }}</div>
                      <div class="text-body-xs text-neutral-400">{{ pos.isin }} · {{ pos.class }}</div>
                    </td>
                    <td class="px-space-3 py-space-2 text-right text-neutral-500 tabular-nums">
                      {{ pos.pesoActual.toFixed(1) }}%
                    </td>
                    <td class="px-space-3 py-space-2 text-right">
                      <afi-input
                        type="number"
                        size="sm"
                        [value]="pos.pesoObjetivo"
                        [readonly]="true"
                        ariaLabel="Peso objetivo de {{ pos.name }}"
                        (focused)="onEditAttempt(pos)"
                      />
                    </td>
                    <td class="px-space-3 py-space-2 text-right tabular-nums"
                        [class]="deviationClass(pos)">
                      {{ deviation(pos) }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Add asset button -->
          <div class="mt-space-4">
            <afi-button variant="secondary" size="sm" (clicked)="onAddAsset()">
              Añadir activo
            </afi-button>
          </div>

          <!-- Bottom action bar -->
          <div class="mt-space-8 pt-space-4 border-t border-border-hairline flex items-center gap-space-3">
            <afi-button variant="ghost" size="sm" (clicked)="saveAsDraft()">
              Guardar como borrador
            </afi-button>
            <afi-button variant="ghost" size="sm" (clicked)="discardOpen.set(true)">
              Descartar
            </afi-button>
            <div class="flex-1"></div>
            <afi-button variant="primary" size="sm" (clicked)="formalizar()">
              Formalizar
            </afi-button>
          </div>
        </div>

        <!-- Right: Restrictions panel (~30%) -->
        <awm-restrictions-panel [data]="restrictionsData" />
      </div>

      <!-- Discard confirmation modal -->
      <afi-modal
        [open]="discardOpen()"
        (openChange)="discardOpen.set($event)"
        title="Descartar cambios"
        size="sm"
      >
        <p class="text-body-md text-neutral-600 mb-space-6">
          Se perderán todos los cambios realizados en esta propuesta.
        </p>
        <ng-container slot="footer">
          <afi-button variant="ghost" size="sm" (clicked)="discardOpen.set(false)">
            Cancelar
          </afi-button>
          <afi-button variant="danger" size="sm" (clicked)="confirmDiscard()">
            Descartar
          </afi-button>
        </ng-container>
      </afi-modal>
    </div>
  `,
})
export class AjustesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly telemetry = inject(TelemetryService);

  readonly activeCartera = signal(0);
  readonly discardOpen = signal(false);

  private propuestaId = '';

  // Load fake data — fallback to first entry
  readonly view = signal<AjustesView>(this.loadView());
  readonly restrictionsData = this.loadRestrictions();

  readonly activePositions = computed(() => {
    const idx = this.activeCartera();
    return this.view().carteras[idx]?.positions ?? [];
  });

  ngOnInit(): void {
    this.propuestaId = this.route.snapshot.paramMap.get('id') ?? '';
    this.telemetry.emit('propuestas.ajustes.step-start', { stepOrdinal: 4, propuestaId: this.propuestaId });
  }

  private loadView(): AjustesView {
    const data = AJUSTES_DATA as Record<string, AjustesView>;
    const first = Object.values(data)[0];
    return first ?? { propuestaId: '', propuestaName: '', client: '', cartera: '', carteraModelo: null, carteras: [] };
  }

  private loadRestrictions(): { regulatoria: any[]; esg: any[]; contrato: any[] } {
    const data = RESTRICTIONS_DATA as Record<string, any>;
    const first = Object.values(data)[0];
    return first ?? { regulatoria: [], esg: [], contrato: [] };
  }

  deviation(pos: Position): string {
    const diff = pos.pesoObjetivo - pos.pesoActual;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}pp`;
  }

  deviationClass(pos: Position): string {
    const diff = pos.pesoObjetivo - pos.pesoActual;
    if (Math.abs(diff) < 0.5) return 'text-neutral-500';
    return diff > 0 ? 'text-status-positive' : 'text-status-negative';
  }

  onEditAttempt(pos: Position): void {
    this.telemetry.emit('propuestas.ajustes.edit-attempt-static', { isin: pos.isin });
  }

  onAddAsset(): void {
    this.telemetry.emit('propuestas.ajustes.add-asset-attempt-static');
  }

  formalizar(): void {
    this.telemetry.emit('propuestas.ajustes.formalizar-clicked', { propuestaId: this.propuestaId });
    void this.router.navigate(['/propuesta', this.propuestaId, 'formalizar']);
  }

  saveAsDraft(): void {
    void this.router.navigate(['/']);
  }

  confirmDiscard(): void {
    this.discardOpen.set(false);
    void this.router.navigate(['/']);
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }
}
