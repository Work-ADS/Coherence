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
  // Methodology — the redesign-series narrative. Reuses BlogLandingPage,
  // filtered to the 'methodology' collection via route data.
  {
    path: 'metodologia',
    loadComponent: () =>
      import('./pages/blog/blog.landing').then((m) => m.BlogLandingPage),
    data: { collection: 'methodology' },
  },
  {
    path: 'demos',
    loadChildren: () =>
      import('./pages/demos/demos.routes').then((m) => m.demos_routes),
  },
  {
    path: 'talks',
    loadChildren: () => import('./pages/talks/talks.routes').then((m) => m.talks_routes),
  },
  // ─── Case-study consolidation — old /blog/wealth-planner-2026 lives on /demos now ───
  { path: 'blog/wealth-planner-2026', redirectTo: '/demos/wealth-planner-2026' },
  // ─── Legacy /novedades redirects (kept until external links retire) ───
  { path: 'novedades', pathMatch: 'full', redirectTo: '/demos' },
  { path: 'novedades/wealth-planner', redirectTo: '/demos/wealth-planner-2026' },
  { path: 'novedades/wealth-planner-demo', redirectTo: '/demos/wealth-planner-2026/demo' },
  { path: 'novedades/patrimonial', redirectTo: '/demos/wealth-planner-2026/patrimonial' },
  { path: 'novedades/evolucion-patrimonial', redirectTo: '/demos/wealth-planner-2026/evolucion-patrimonial' },
  { path: 'novedades/proceso-componente', redirectTo: '/blog/proceso-componente' },
  { path: 'novedades/patrimonial-decisiones', redirectTo: '/blog/patrimonial-decisiones' },
  { path: 'novedades/evolucion-patrimonial-decisiones', redirectTo: '/blog/evolucion-patrimonial-decisiones' },
  { path: 'novedades/bitacora', redirectTo: '/blog/bitacora' },
  { path: 'novedades/iteracion-2', redirectTo: '/blog/iteracion-2' },
  { path: 'novedades/iteracion-3', redirectTo: '/blog/iteracion-3' },
  { path: 'novedades/sidebar-decisiones', redirectTo: '/patrones/sidebar-decisiones' },
  { path: 'novedades/nav-bar-decisiones', redirectTo: '/patrones/top-bar-decisiones' },
  { path: 'novedades/dialog-decisiones', redirectTo: '/patrones/dialog-decisiones' },
  { path: 'novedades', redirectTo: '/demos' }, // catchall for any nested /novedades/*
  // ─── Clientes — top-level cliente picker for AWP ───
  {
    path: 'clientes',
    loadComponent: () =>
      import('./pages/demos/clientes/clientes.page').then((m) => m.ClientesPage),
  },
  // ─── Listado de planificaciones — top-level per-cliente hub ───
  {
    path: 'listado-planificaciones',
    loadComponent: () =>
      import('./pages/demos/listado-planificaciones/listado-planificaciones.page').then(
        (m) => m.ListadoPlanificacionesPage,
      ),
  },
  {
    path: 'afi-insights',
    loadChildren: () =>
      import('./pages/afi-insights/afi-insights.routes').then((m) => m.afi_insights_routes),
  },
  {
    path: 'preview',
    loadComponent: () => import('./preview/preview.page').then((m) => m.PreviewPage),
  },
  { path: '**', redirectTo: '' },
];
