import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavSectionComponent } from './components/nav-section/nav-section.component';
import { LogoComponent } from '@coherence/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavSectionComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen bg-surface-base text-canvas-fg">
      @if (!isFullScreenRoute()) {
        <!-- Sidebar: 260px, bg-surface-quiet, NO border-right -->
        <nav
          class="w-[260px] shrink-0 bg-surface-quiet px-space-6 py-space-8 flex flex-col gap-space-4"
          aria-label="Navegacion principal"
        >
          <!-- Brand lockup: AFI logo | divider | submarca -->
          <div class="mb-space-4 flex items-center gap-space-3">
            <coherence-logo variant="positivo" size="md" href="/" />
            <div class="w-px h-6 bg-neutral-300 shrink-0"></div>
            <span class="text-body-sm font-light text-canvas-fg whitespace-nowrap tracking-wide"
              >Coherence</span
            >
          </div>

          <!-- Home -->
          <a
            routerLink="/"
            routerLinkActive="bg-surface-muted text-canvas-fg font-medium"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center px-3 py-1 rounded-sm
                  text-sm text-canvas-fg
                  hover:bg-surface-muted
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
                  transition-colors"
          >
            Design at AFI
          </a>

          <!-- Novedades (top-level, highlights current proposals) -->
          <a
            routerLink="/novedades"
            routerLinkActive="bg-surface-muted text-canvas-fg font-medium"
            class="flex items-center px-3 py-1 rounded-sm
                  text-sm text-canvas-fg
                  hover:bg-surface-muted
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
                  transition-colors"
          >
            Novedades
          </a>

          <!-- Primeros pasos -->
          <site-nav-section label="Primeros pasos" routePrefix="/primeros-pasos">
            <li>
              <a
                routerLink="/primeros-pasos/nuevo-proyecto"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Nuevo proyecto</a
              >
            </li>
            <li>
              <a
                routerLink="/primeros-pasos/nueva-marca"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Nueva marca</a
              >
            </li>
            <li>
              <a
                routerLink="/primeros-pasos/clonar-producto"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Clonar producto</a
              >
            </li>
            <li>
              <a
                routerLink="/primeros-pasos/git-ramas"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Git y ramas</a
              >
            </li>
            <li>
              <a
                routerLink="/primeros-pasos/actualizar-ds"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Actualizar DS</a
              >
            </li>
          </site-nav-section>

          <!-- Foundations -->
          <site-nav-section label="Fundamentos" routePrefix="/fundamentos">
            <li>
              <a
                routerLink="/fundamentos/principios"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Principios</a
              >
            </li>
            <li>
              <a
                routerLink="/fundamentos/color"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Color</a
              >
            </li>
            <li>
              <a
                routerLink="/fundamentos/tipografia"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Tipografia</a
              >
            </li>
            <li>
              <a
                routerLink="/fundamentos/espacio"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Espacio</a
              >
            </li>
            <li>
              <a
                routerLink="/fundamentos/movimiento"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Movimiento</a
              >
            </li>
            <li>
              <a
                routerLink="/fundamentos/accesibilidad"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Accesibilidad</a
              >
            </li>
            <li>
              <a
                routerLink="/fundamentos/copy"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Copy</a
              >
            </li>
            <li>
              <a
                routerLink="/fundamentos/tokens"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Tokens</a
              >
            </li>
          </site-nav-section>

          <!-- Components -->
          <site-nav-section label="Componentes" routePrefix="/componentes">
            <li>
              <a
                routerLink="/componentes/button"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Button</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/input"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Input</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/select"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Select</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/checkbox"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Checkbox</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/switch"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Switch</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/radio-group"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >RadioGroup</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/card"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Card</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/modal"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Modal</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/tabs"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Tabs</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/table"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Table</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/drawer"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Drawer</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/sidebar"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Sidebar</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/nav-item"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >NavItem</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/status-chip"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >StatusChip</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/badge"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Badge</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/loading-overlay"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >LoadingOverlay</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/page-header"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >PageHeader</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/shell"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Shell</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/kbd"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Kbd</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/nav-section"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >NavSection</a
              >
            </li>
            <li>
              <a
                routerLink="/componentes/menu"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Menu</a
              >
            </li>
          </site-nav-section>

          <!-- Patrones -->
          <site-nav-section label="Patrones" routePrefix="/patrones">
            <li>
              <a
                routerLink="/patrones/shells"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Shells</a
              >
            </li>
            <li>
              <a
                routerLink="/patrones/flujos"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Flujos</a
              >
            </li>
            <li>
              <a
                routerLink="/patrones/graficos"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Gráficos</a
              >
            </li>
            <li>
              <a
                routerLink="/patrones/tarjetas"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Tarjetas</a
              >
            </li>
            <li>
              <a
                routerLink="/patrones/cabeceras"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Cabeceras</a
              >
            </li>
            <li>
              <a
                routerLink="/patrones/tablas"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Tablas</a
              >
            </li>
          </site-nav-section>

          <!-- Recursos -->
          <site-nav-section label="Recursos" routePrefix="/recursos">
            <li>
              <a
                routerLink="/recursos/descargas"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Descargas</a
              >
            </li>
            <li>
              <a
                routerLink="/recursos/changelog"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Changelog</a
              >
            </li>
            <li>
              <a
                routerLink="/recursos/roadmap"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >Roadmap</a
              >
            </li>
            <li>
              <a
                routerLink="/recursos/faq"
                routerLinkActive="bg-surface-muted font-medium"
                class="nav-link"
                >FAQ</a
              >
            </li>
          </site-nav-section>

          <!-- Blog -->
          <a
            routerLink="/blog"
            routerLinkActive="bg-surface-muted text-canvas-fg font-medium"
            class="flex items-center px-3 py-1 rounded-sm
                  text-sm text-canvas-fg
                  hover:bg-surface-muted
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
                  transition-colors"
          >
            Blog
          </a>

          <!-- Preview gallery (dev) -->
          <a
            routerLink="/preview"
            routerLinkActive="bg-surface-muted text-canvas-fg font-medium"
            class="flex items-center px-3 py-1 rounded-sm
                  text-sm text-neutral-400
                  hover:bg-surface-muted
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus
                  transition-colors mt-auto"
          >
            Galeria (dev)
          </a>
        </nav>
      }

      <!-- Main content -->
      <main class="flex-1 min-w-0" id="main-content">
        <router-outlet />
      </main>
    </div>
  `,
})
export class App {
  private readonly router = inject(Router);
  /**
   * True when the user is viewing a proposal page inside /novedades/* or any
   * /afi-insights/* page. Hides the DS site sidebar so the proposal renders
   * full-viewport with its own product chrome.
   */
  readonly isFullScreenRoute = signal(this.matchFullScreen(this.router.url));

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.isFullScreenRoute.set(this.matchFullScreen(e.urlAfterRedirects));
      }
    });
  }

  private matchFullScreen(url: string): boolean {
    return /^\/novedades\/.+/.test(url) || /^\/afi-insights(\/|$)/.test(url);
  }
}
