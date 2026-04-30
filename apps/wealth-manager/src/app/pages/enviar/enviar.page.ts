import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ButtonComponent,
  StatusChipComponent,
} from '@coherence/ui';

import { TelemetryService } from '../../data/telemetry.service';

import AJUSTES_DATA from '../../../assets/data/ajustes.json';

@Component({
  selector: 'awm-enviar',
  standalone: true,
  imports: [ButtonComponent, StatusChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-canvas-base flex items-center justify-center"
         aria-live="polite">
      @if (sending()) {
        <!-- State 1: Sending -->
        <div class="text-center">
          <div class="mb-space-6">
            <div class="mx-auto w-10 h-10 border-4 border-neutral-200 border-t-action-500 rounded-full animate-spin"></div>
          </div>
          <h2 class="font-serif text-section text-canvas-fg mb-space-3">Enviando a Signaturit…</h2>
          <p class="text-body-md text-neutral-500">Estamos preparando la propuesta para la firma del cliente.</p>
        </div>
      } @else {
        <!-- State 2: Sent -->
        <div class="max-w-[640px] w-full text-center">
          <!-- Success icon -->
          <div class="mx-auto mb-space-6 w-16 h-16 rounded-full bg-status-positive/10 flex items-center justify-center">
            <svg class="w-8 h-8 text-status-positive" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 class="font-serif text-subtitle text-canvas-fg mb-space-3">Propuesta enviada para firma</h2>
          <p class="text-body-md text-neutral-500 mb-space-8">
            {{ clientName }} recibirá un SMS con el enlace de firma en los próximos minutos.
          </p>

          <!-- Summary card -->
          <div class="mx-auto max-w-[400px] border border-border-hairline rounded-md bg-surface-100 p-space-6 mb-space-8 text-left">
            <dl class="space-y-space-3 text-body-sm">
              <div class="flex justify-between">
                <dt class="text-neutral-500">Propuesta</dt>
                <dd class="text-canvas-fg font-medium">{{ propuestaName }}</dd>
              </div>
              <div class="flex justify-between items-center">
                <dt class="text-neutral-500">Estado</dt>
                <dd><afi-status-chip estado="pendiente" size="sm" /></dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-neutral-500">Cliente</dt>
                <dd class="text-canvas-fg">{{ clientName }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-neutral-500">Cartera</dt>
                <dd class="text-canvas-fg">{{ carteraName }}</dd>
              </div>
            </dl>
          </div>

          <!-- Actions -->
          <div class="flex justify-center gap-space-4">
            <afi-button variant="ghost" size="sm" (clicked)="viewPropuesta()">
              Ver propuesta
            </afi-button>
            <afi-button variant="primary" size="sm" (clicked)="goToList()">
              Volver a propuestas
            </afi-button>
          </div>
        </div>
      }
    </div>
  `,
})
export class EnviarPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly telemetry = inject(TelemetryService);

  readonly sending = signal(true);
  private propuestaId = '';

  // Load view data
  private readonly data = Object.values(AJUSTES_DATA as Record<string, any>)[0] ?? {};
  readonly propuestaName: string = this.data.propuestaName ?? '';
  readonly clientName: string = this.data.client ?? '';
  readonly carteraName: string = this.data.cartera ?? '';

  ngOnInit(): void {
    this.propuestaId = this.route.snapshot.paramMap.get('id') ?? '';
    this.telemetry.emit('propuestas.enviado.step-start', { stepOrdinal: 7, propuestaId: this.propuestaId });

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delay = prefersReduced ? 0 : 1200;

    setTimeout(() => {
      this.sending.set(false);
      this.telemetry.emit('propuestas.enviado.handoff-complete', { propuestaId: this.propuestaId });
    }, delay);
  }

  goToList(): void {
    this.telemetry.emit('propuestas.enviado.action-clicked', { action: 'volver' });
    void this.router.navigate(['/']);
  }

  viewPropuesta(): void {
    this.telemetry.emit('propuestas.enviado.action-clicked', { action: 'ver' });
    void this.router.navigate(['/propuesta', this.propuestaId, 'ajustes']);
  }
}
