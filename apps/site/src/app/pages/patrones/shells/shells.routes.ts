import { Routes } from '@angular/router';

export const shells_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shells.landing').then(m => m.ShellsLandingPage),
  },
  { path: 'workspace', loadComponent: () => import('./workspace.page').then(m => m.WorkspacePage) },
  { path: 'docs', loadComponent: () => import('./docs.page').then(m => m.DocsPage) },
  { path: 'auth', loadComponent: () => import('./auth.page').then(m => m.AuthPage) },
  { path: 'focus', loadComponent: () => import('./focus.page').then(m => m.FocusPage) },
  { path: 'canvas', loadComponent: () => import('./canvas.page').then(m => m.CanvasPage) },
];
