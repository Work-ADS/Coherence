import { Routes } from '@angular/router';

export const patrones_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./patrones.landing').then((m) => m.PatronesLandingPage),
  },
  {
    path: 'shells',
    loadChildren: () => import('./shells/shells.routes').then((m) => m.shells_routes),
  },
  {
    path: 'flujos',
    loadChildren: () => import('./flujos/flujos.routes').then((m) => m.flujos_routes),
  },
  {
    path: 'graficos',
    loadChildren: () => import('./graficos/graficos.routes').then((m) => m.graficos_routes),
  },
  {
    path: 'tarjetas',
    loadChildren: () => import('./tarjetas/tarjetas.routes').then((m) => m.tarjetas_routes),
  },
  {
    path: 'cabeceras',
    loadChildren: () => import('./cabeceras/cabeceras.routes').then((m) => m.cabeceras_routes),
  },
  {
    path: 'tablas',
    loadChildren: () => import('./tablas/tablas.routes').then((m) => m.tablas_routes),
  },
  {
    path: 'sidebar-decisiones',
    loadComponent: () =>
      import('../novedades/sidebar-decisiones/sidebar-decisiones.page').then(
        (m) => m.SidebarDecisionesPage,
      ),
  },
  {
    path: 'top-bar-decisiones',
    loadComponent: () =>
      import('../novedades/nav-bar-decisiones/nav-bar-decisiones.page').then(
        (m) => m.NavBarDecisionesPage,
      ),
  },
  {
    path: 'dialog-decisiones',
    loadComponent: () =>
      import('../novedades/dialog-decisiones/dialog-decisiones.page').then(
        (m) => m.DialogDecisionesPage,
      ),
  },
];
