import { Routes } from '@angular/router';

export const tarjetas_routes: Routes = [
  { path: '', loadComponent: () => import('./tarjetas.landing').then(m => m.TarjetasLandingPage) },
  { path: 'metrica', loadComponent: () => import('./metrica.page').then(m => m.MetricaPage) },
  { path: 'grafico', loadComponent: () => import('./grafico.page').then(m => m.GraficoPage) },
  { path: 'fila-de-lista', loadComponent: () => import('./fila-de-lista.page').then(m => m.FilaDeListaPage) },
  { path: 'accion', loadComponent: () => import('./accion.page').then(m => m.AccionPage) },
  { path: 'entidad', loadComponent: () => import('./entidad.page').then(m => m.EntidadPage) },
  { path: 'lista-de-indicadores', loadComponent: () => import('./lista-de-indicadores.page').then(m => m.ListaDeIndicadoresPage) },
  { path: 'composicion', loadComponent: () => import('./composicion.page').then(m => m.ComposicionPage) },
  { path: 'convertidor', loadComponent: () => import('./convertidor.page').then(m => m.ConvertidorPage) },
  { path: 'estado', loadComponent: () => import('./estado.page').then(m => m.EstadoPage) },
  { path: 'editorial', loadComponent: () => import('./editorial.page').then(m => m.EditorialPage) },
];
