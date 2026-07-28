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
  {
    path: 'iteracion-4',
    loadComponent: () => import('./iteracion-4/iteracion-4.page').then((m) => m.Iteracion4Page),
  },
  {
    path: 'iteracion-5',
    loadComponent: () => import('./iteracion-5/iteracion-5.page').then((m) => m.Iteracion5Page),
  },
  {
    path: 'iteracion-6',
    loadComponent: () => import('./iteracion-6/iteracion-6.page').then((m) => m.Iteracion6Page),
  },
  // White-label tokens — the brand-bind Sass mixin
  {
    path: 'mixin-brand-bind',
    loadComponent: () =>
      import('./mixin-brand-bind/mixin-brand-bind.page').then(
        (m) => m.MixinBrandBindPage,
      ),
  },
  // UI moderna en 2026 — research + commitments for the visual redesign
  {
    path: 'ui-moderno-2026',
    loadComponent: () =>
      import('./ui-moderno-2026/ui-moderno-2026.page').then(
        (m) => m.UiModerno2026Page,
      ),
  },
  // Brand and personas — Part 2 of the redesign series
  {
    path: 'brand-and-personas',
    loadComponent: () =>
      import('./brand-and-personas/brand-and-personas.page').then(
        (m) => m.BrandAndPersonasPage,
      ),
  },
  // How we built the new visual identity — Part 3 of the redesign series
  {
    path: 'identidad-visual',
    loadComponent: () =>
      import('./identidad-visual/identidad-visual.page').then(
        (m) => m.IdentidadVisualPage,
      ),
  },
  // The post shipped first as an information-architecture piece; it was renamed
  // once it became the full build log. Keep the original URL resolving.
  {
    path: 'arquitectura-informacion',
    redirectTo: 'identidad-visual',
    pathMatch: 'full',
  },
];
