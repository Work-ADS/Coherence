import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/propuestas-list.page').then((m) => m.PropuestasListPage),
  },
  {
    path: 'propuesta/:id/ajustes',
    loadComponent: () =>
      import('./pages/ajustes/ajustes.page').then((m) => m.AjustesPage),
  },
  {
    path: 'propuesta/:id/formalizar',
    loadComponent: () =>
      import('./pages/formalizar/formalizar.page').then((m) => m.FormalizarPage),
  },
  {
    path: 'propuesta/:id/enviar',
    loadComponent: () =>
      import('./pages/enviar/enviar.page').then((m) => m.EnviarPage),
  },
  { path: '**', redirectTo: '' },
];
