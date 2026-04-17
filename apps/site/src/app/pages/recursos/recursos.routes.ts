import { Routes } from '@angular/router';

export const recursos_routes: Routes = [
  { path: '', loadComponent: () => import('./recursos.landing').then(m => m.RecursosLandingPage) },
  { path: 'descargas', loadComponent: () => import('./descargas.page').then(m => m.DescargasPage) },
  { path: 'changelog', loadComponent: () => import('./changelog.page').then(m => m.ChangelogPage) },
  { path: 'roadmap', loadComponent: () => import('./roadmap.page').then(m => m.RoadmapPage) },
  { path: 'faq', loadComponent: () => import('./faq.page').then(m => m.FaqPage) },
];
