import { Routes } from '@angular/router';

export const blog_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./blog.landing').then((m) => m.BlogLandingPage),
  },
  // wealth-planner-2026 case study lives on /demos/wealth-planner-2026 now
  // (3-tab demo overview). The /blog/wealth-planner-2026 URL is redirected in app.routes.ts.
  {
    path: 'proceso-componente',
    loadComponent: () =>
      import('./proceso-componente/proceso-componente.page').then(
        (m) => m.ProcesoComponentePage,
      ),
  },
  // Source-record entries (preserved verbatim from /novedades).
  {
    path: 'patrimonial-decisiones',
    loadComponent: () =>
      import('./patrimonial-decisiones/patrimonial-decisiones.page').then(
        (m) => m.PatrimonialDecisionesPage,
      ),
  },
  {
    path: 'evolucion-patrimonial-decisiones',
    loadComponent: () =>
      import('./evolucion-patrimonial-decisiones/evolucion-patrimonial-decisiones.page').then(
        (m) => m.EvolucionPatrimonialDecisionesPage,
      ),
  },
  {
    path: 'bitacora',
    loadComponent: () => import('./bitacora/bitacora.page').then((m) => m.BitacoraPage),
  },
  {
    path: 'iteracion-2',
    loadComponent: () => import('./iteracion-2/iteracion-2.page').then((m) => m.Iteracion2Page),
  },
  {
    path: 'iteracion-3',
    loadComponent: () => import('./iteracion-3/iteracion-3.page').then((m) => m.Iteracion3Page),
  },
];
