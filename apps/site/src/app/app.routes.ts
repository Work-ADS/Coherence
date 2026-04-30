import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'fundamentos',
    loadChildren: () =>
      import('./pages/fundamentos/fundamentos.routes').then((m) => m.fundamentos_routes),
  },
  {
    path: 'componentes',
    loadChildren: () =>
      import('./pages/componentes/componentes.routes').then((m) => m.componentes_routes),
  },
  {
    path: 'patrones',
    loadChildren: () => import('./pages/patrones/patrones.routes').then((m) => m.patrones_routes),
  },
  {
    path: 'primeros-pasos',
    loadChildren: () =>
      import('./pages/primeros-pasos/primeros-pasos.routes').then((m) => m.primeros_pasos_routes),
  },
  {
    path: 'recursos',
    loadChildren: () => import('./pages/recursos/recursos.routes').then((m) => m.recursos_routes),
  },
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog.routes').then((m) => m.blog_routes),
  },
  {
    path: 'novedades',
    loadChildren: () =>
      import('./pages/novedades/novedades.routes').then((m) => m.novedades_routes),
  },
  {
    path: 'preview',
    loadComponent: () => import('./preview/preview.page').then((m) => m.PreviewPage),
  },
  { path: '**', redirectTo: '' },
];
