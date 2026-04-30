import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ModalComponent,
  ButtonComponent,
} from '@coherence/ui';

import { TelemetryService } from '../../data/telemetry.service';

import AJUSTES_DATA from '../../../assets/data/ajustes.json';

interface Position {
  isin: string;
  name: string;
  class: string;
  pesoActual: number;
  pesoObjetivo: number;
}

@Component({
  selector: 'awm-formalizar',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <afi-modal
      [open]="true"
      (openChange)="onClose()"
      (closed)="onModalClosed($event)"
      title="Formalizar propuesta"
      size="xl"
      [closeOnBackdrop]="true"
    >
      <!-- PDF-styled preview -->
      <div class="bg-white border border-border-hairline rounded-md p-space-8 max-h-[60vh] overflow-y-auto shadow-sm">
        <!-- Letterhead -->
        <div class="flex items-center justify-between mb-space-8 pb-space-4 border-b border-border-hairline">
          <div>
            <h2 class="font-serif text-section text-canvas-fg">AFI Wealth Manager</h2>
            <p class="text-body-xs text-neutral-400 mt-space-1">Propuesta de inversión</p>
          </div>
          <div class="text-right text-body-sm text-neutral-500">
            {{ today }}
          </div>
        </div>

        <!-- Propuesta info -->
        <div class="mb-space-6">
          <h3 class="font-serif text-body-lg text-canvas-fg mb-space-2">{{ view.propuestaName }}</h3>
          <dl class="grid grid-cols-2 gap-x-space-8 gap-y-space-2 text-body-sm">
            <dt class="text-neutral-500">Cliente</dt>
            <dd class="text-canvas-fg">{{ view.client }}</dd>
            <dt class="text-neutral-500">Cartera</dt>
            <dd class="text-canvas-fg">{{ view.cartera }}</dd>
            <dt class="text-neutral-500">Modelo</dt>
            <dd class="text-canvas-fg">{{ view.carteraModelo ?? 'Sin modelo' }}</dd>
          </dl>
        </div>

        <!-- Positions table -->
        <h4 class="font-serif text-body-md text-canvas-fg mb-space-3">Composición propuesta</h4>
        <table class="w-full text-body-sm mb-space-6 border border-border-hairline">
          <thead>
            <tr class="bg-surface-100 border-b border-border-hairline">
              <th class="text-left px-space-3 py-space-2 font-medium text-neutral-500">Activo</th>
              <th class="text-left px-space-3 py-space-2 font-medium text-neutral-500">ISIN</th>
              <th class="text-right px-space-3 py-space-2 font-medium text-neutral-500">Peso objetivo</th>
            </tr>
          </thead>
          <tbody>
            @for (pos of positions; track pos.isin) {
              <tr class="border-b border-border-hairline last:border-b-0">
                <td class="px-space-3 py-space-2 text-canvas-fg">{{ pos.name }}</td>
                <td class="px-space-3 py-space-2 text-neutral-500 tabular-nums">{{ pos.isin }}</td>
                <td class="px-space-3 py-space-2 text-right tabular-nums text-canvas-fg">{{ pos.pesoObjetivo.toFixed(1) }}%</td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Summary -->
        <div class="mb-space-6 p-space-4 bg-surface-100 rounded-md">
          <h4 class="font-serif text-body-md text-canvas-fg mb-space-2">Resumen</h4>
          <dl class="grid grid-cols-2 gap-y-space-2 text-body-sm">
            <dt class="text-neutral-500">Total peso objetivo</dt>
            <dd class="text-canvas-fg tabular-nums text-right">{{ totalWeight.toFixed(1) }}%</dd>
            <dt class="text-neutral-500">Posiciones</dt>
            <dd class="text-canvas-fg text-right">{{ positions.length }}</dd>
          </dl>
        </div>

        <!-- Disclosures -->
        <div class="text-body-xs text-neutral-400 leading-relaxed mb-space-6">
          La presente propuesta de inversión ha sido elaborada por AFI Inversiones Globales SGIIC, S.A.,
          entidad registrada en la CNMV con el número 225, y tiene carácter meramente informativo.
          La rentabilidad pasada no garantiza resultados futuros. El cliente declara haber recibido y
          comprendido la información precontractual exigida por la normativa MIFID II vigente.
        </div>

        <!-- Signature block -->
        <div class="border-t border-border-hairline pt-space-6 mt-space-6">
          <div class="w-[280px]">
            <p class="text-body-sm text-neutral-500 mb-space-8">Firma del cliente</p>
            <div class="border-b border-neutral-300"></div>
          </div>
        </div>
      </div>

      <!-- Footer actions -->
      <ng-container slot="footer">
        <afi-button variant="ghost" size="sm" (clicked)="onClose()">
          Volver a ajustes
        </afi-button>
        <afi-button variant="primary" size="sm" (clicked)="enviar()">
          Enviar para firma
        </afi-button>
      </ng-container>
    </afi-modal>
  `,
})
export class FormalizarPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly telemetry = inject(TelemetryService);

  private propuestaId = '';
  readonly today = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  // Load view data
  private readonly data = (AJUSTES_DATA as Record<string, any>);
  readonly view = Object.values(this.data)[0] ?? {
    propuestaName: '', client: '', cartera: '', carteraModelo: null, carteras: [],
  };
  readonly positions: Position[] = this.view.carteras?.[0]?.positions ?? [];
  readonly totalWeight = this.positions.reduce((sum: number, p: Position) => sum + p.pesoObjetivo, 0);

  ngOnInit(): void {
    this.propuestaId = this.route.snapshot.paramMap.get('id') ?? '';
    this.telemetry.emit('propuestas.formalizar.step-start', { stepOrdinal: 6, propuestaId: this.propuestaId });
  }

  onClose(): void {
    this.telemetry.emit('propuestas.formalizar.cancelled');
    void this.router.navigate(['/propuesta', this.propuestaId, 'ajustes']);
  }

  onModalClosed(reason: 'esc' | 'backdrop' | 'button'): void {
    if (reason === 'esc' || reason === 'backdrop') {
      this.onClose();
    }
  }

  enviar(): void {
    this.telemetry.emit('propuestas.formalizar.confirmed', { propuestaId: this.propuestaId });
    void this.router.navigate(['/propuesta', this.propuestaId, 'enviar']);
  }
}
