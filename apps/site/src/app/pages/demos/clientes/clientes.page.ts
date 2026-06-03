import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ProductIdentityBarComponent } from '../../../components/product-identity-bar';
import { PersonaCardComponent } from '../../../components/persona-card';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { AWP_PERSONAS, type Persona } from '../wealth-planner-2026/data/personas';
import { WealthPlannerStore } from '../wealth-planner-2026/store';

/**
 * /clientes — top-level cliente picker for AWP.
 *
 * Renders the 2 personas as interactive cards. Click → activates the
 * persona in the store (snapshot writes into cliente + cónyuge + hijos
 * + ascendientes) and navigates to /listado-planificaciones. The /clientes
 * page is the natural entry point for the demo; /listado-planificaciones
 * still loads directly with whatever persona is active (Marco by default).
 *
 * Chrome: <site-demo-shell> (no DS top nav — matchFullScreen in app.ts
 * covers this route) + <site-product-identity-bar> (AFI logo · Wealth
 * Planner · "Listado de clientes"). No planner sidebar — the §1-§6 only
 * matters once you're inside a planificación.
 */
@Component({
  selector: 'site-clientes',
  standalone: true,
  imports: [
    DemoShellComponent,
    PersonaCardComponent,
    ProductIdentityBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage {
  private readonly router = inject(Router);
  private readonly store = inject(WealthPlannerStore);

  readonly demoSlug = 'clientes';
  readonly demoRoute = '/clientes';

  readonly personas: Persona[] = AWP_PERSONAS;

  onActivate(personaId: string): void {
    const persona = this.personas.find((p) => p.id === personaId);
    if (!persona) return;
    this.store.activatePersona({
      id: persona.id,
      cliente: persona.clienteSnapshot.cliente,
      conyugeStatus: persona.clienteSnapshot.conyugeStatus,
      conyuge: persona.clienteSnapshot.conyuge,
      hijos: persona.clienteSnapshot.hijos,
      ascendientes: persona.clienteSnapshot.ascendientes,
    });
    this.router.navigateByUrl('/listado-planificaciones');
  }
}
