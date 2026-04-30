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
  {
    path: 'cabecera-de-seccion',
    loadComponent: () =>
      import('./cabecera-de-seccion/cabecera-de-seccion.page').then((m) => m.CabeceraDeSeccionPage),
  },
];
