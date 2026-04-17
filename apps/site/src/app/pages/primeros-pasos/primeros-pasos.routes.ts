import { Routes } from '@angular/router';

export const primeros_pasos_routes: Routes = [
  { path: '', loadComponent: () => import('./primeros-pasos.landing').then(m => m.PrimerosPasosLandingPage) },
  { path: 'nuevo-proyecto', loadComponent: () => import('./nuevo-proyecto.page').then(m => m.NuevoProyectoPage) },
  { path: 'nueva-marca', loadComponent: () => import('./nueva-marca.page').then(m => m.NuevaMarcaPage) },
  { path: 'clonar-producto', loadComponent: () => import('./clonar-producto.page').then(m => m.ClonarProductoPage) },
  { path: 'git-ramas', loadComponent: () => import('./git-ramas.page').then(m => m.GitRamasPage) },
  { path: 'actualizar-ds', loadComponent: () => import('./actualizar-ds.page').then(m => m.ActualizarDsPage) },
];
