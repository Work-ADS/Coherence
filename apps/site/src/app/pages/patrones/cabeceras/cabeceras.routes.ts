import { Routes } from '@angular/router';

export const cabeceras_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./cabeceras.landing').then((m) => m.CabecerasLandingPage),
  },
  {
    path: 'cabecera-de-pagina',
    loadComponent: () =>
      import('./cabecera-de-pagina/cabecera-de-pagina.page').then((m) => m.CabeceraDePaginaPage),
  },
  // Redirects: /cabecera-de-seccion and /cabecera-de-subseccion used to be
  // separate pages. Both are now just `level="section|subsection"` on the
  // single afi-page-header demo — redirect rather than 404.
  {
    path: 'cabecera-de-seccion',
    redirectTo: 'cabecera-de-pagina',
    pathMatch: 'full',
  },
  {
    path: 'cabecera-de-subseccion',
    redirectTo: 'cabecera-de-pagina',
    pathMatch: 'full',
  },
  {
    path: 'ejemplo',
    loadComponent: () =>
      import('./ejemplo/ejemplo.page').then((m) => m.CabecerasEjemploPage),
  },
  {
    path: 'top-bar',
    loadComponent: () => import('./top-bar/top-bar.page').then((m) => m.TopBarPatternPage),
  },
  {
    path: 'top-nav',
    loadComponent: () => import('./top-nav/top-nav.page').then((m) => m.TopNavPage),
  },
];
