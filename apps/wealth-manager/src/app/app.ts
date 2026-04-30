import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  SidebarComponent,
  NavItemComponent,
  LogoComponent,
} from '@coherence/ui';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'awm-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    NavItemComponent,
    LogoComponent,
    LucideAngularModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-screen bg-canvas-base text-canvas-fg">
      <afi-sidebar mode="collapsible" [expanded]="sidebarExpanded()" (expandedChange)="sidebarExpanded.set($event)">
        <!-- Brand lockup: AFI logo | divider | submarca -->
        <div slot="top" class="flex items-center gap-space-3 overflow-hidden cursor-pointer"
             (click)="sidebarExpanded.set(!sidebarExpanded())">
          <coherence-logo variant="positivo" size="md" />
          @if (sidebarExpanded()) {
            <div class="w-px h-6 bg-neutral-300 shrink-0"></div>
            <span class="text-body-sm font-light text-canvas-fg whitespace-nowrap tracking-wide">Wealth Manager</span>
          }
        </div>

        <!-- Main nav items -->
        <afi-nav-item label="Buscar" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="search" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Personas" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="users" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Contratos" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="file-text" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Propuestas" [active]="true" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="message-square" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Administración" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="settings" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Envíos" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="send" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Conciliaciones" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="refresh-cw" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Alertas" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="bell" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Cuadros" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="monitor" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Calculadoras" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="calculator" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Facturación" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="receipt" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <afi-nav-item label="Importar" [sidebarExpanded]="sidebarExpanded()">
          <lucide-icon slot="icon" name="upload" [size]="20" [strokeWidth]="1.5" />
        </afi-nav-item>

        <!-- Bottom: accessibility + user -->
        <div slot="bottom" class="flex flex-col gap-space-2">
          <button type="button"
                  class="flex items-center gap-space-2 p-space-2 rounded hover:bg-surface-100 transition-colors text-neutral-500"
                  aria-label="Accesibilidad">
            <lucide-icon name="accessibility" [size]="20" [strokeWidth]="1.5" class="shrink-0" />
            @if (sidebarExpanded()) {
              <span class="text-body-sm whitespace-nowrap">Accesibilidad</span>
            }
          </button>
          <div class="flex items-center gap-space-2 p-space-2">
            <span class="shrink-0 h-8 w-8 rounded-full bg-action/10 text-action flex items-center justify-center text-body-sm font-semibold">P</span>
            @if (sidebarExpanded()) {
              <span class="text-body-sm text-canvas-fg whitespace-nowrap">Pablo García</span>
            }
          </div>
        </div>
      </afi-sidebar>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class App {
  readonly sidebarExpanded = signal(true);
}
