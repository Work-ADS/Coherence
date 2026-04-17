import { Routes } from '@angular/router';

export const fundamentos_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./fundamentos.landing').then(m => m.FundamentosLandingPage),
  },
  { path: 'principios', loadComponent: () => import('./principios.page').then(m => m.PrincipiosPage) },
  { path: 'color', loadComponent: () => import('./color.page').then(m => m.ColorPage) },
  { path: 'tipografia', loadComponent: () => import('./tipografia.page').then(m => m.TipografiaPage) },
  { path: 'espacio', loadComponent: () => import('./espacio.page').then(m => m.EspacioPage) },
  { path: 'movimiento', loadComponent: () => import('./movimiento.page').then(m => m.MovimientoPage) },
  { path: 'accesibilidad', loadComponent: () => import('./accesibilidad.page').then(m => m.AccesibilidadPage) },
  { path: 'copy', loadComponent: () => import('./copy.page').then(m => m.CopyPage) },
  { path: 'tokens', loadComponent: () => import('./tokens.page').then(m => m.TokensPage) },
];
