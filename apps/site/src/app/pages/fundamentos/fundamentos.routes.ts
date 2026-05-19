import { Routes } from '@angular/router';

export const fundamentos_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./fundamentos.landing').then(m => m.FundamentosLandingPage),
  },
  { path: 'color', loadComponent: () => import('./color/color.page').then(m => m.ColorPage) },
  { path: 'tipografia', loadComponent: () => import('./tipografia/tipografia.page').then(m => m.TipografiaPage) },
  { path: 'espacio', loadComponent: () => import('./espacio/espacio.page').then(m => m.EspacioPage) },
  { path: 'movimiento', loadComponent: () => import('./movimiento/movimiento.page').then(m => m.MovimientoPage) },
  { path: 'accesibilidad', loadComponent: () => import('./accesibilidad/accesibilidad.page').then(m => m.AccesibilidadPage) },
];
