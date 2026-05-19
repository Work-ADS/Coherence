import { Routes } from '@angular/router';

export const primeros_pasos_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./primeros-pasos.landing').then((m) => m.PrimerosPasosLandingPage),
  },
  {
    path: 'cambiar-marca-diseno',
    loadComponent: () =>
      import('./cambiar-marca-diseno.page').then((m) => m.CambiarMarcaDisenoPage),
  },
  {
    path: 'cambiar-marca-desarrollo',
    loadComponent: () =>
      import('./cambiar-marca-desarrollo.page').then((m) => m.CambiarMarcaDesarrolloPage),
  },
  {
    path: 'git-ramas',
    loadComponent: () => import('./git-ramas.page').then((m) => m.GitRamasPage),
  },
];
