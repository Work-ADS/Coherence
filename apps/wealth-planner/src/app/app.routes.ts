import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'diagnostico',
    pathMatch: 'full',
  },
  {
    path: 'diagnostico',
    loadComponent: () =>
      import('./pages/diagnostico/diagnostico.page').then((m) => m.DiagnosticoPage),
  },
  { path: '**', redirectTo: 'diagnostico' },
];
