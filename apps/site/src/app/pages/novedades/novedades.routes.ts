import { Routes } from '@angular/router';

export const novedades_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./novedades.landing').then((m) => m.NovedadesLandingPage),
  },
  {
    path: 'evolucion-patrimonial',
    loadComponent: () =>
      import('./evolucion-patrimonial/evolucion-patrimonial-proposal.page').then(
        (m) => m.EvolucionPatrimonialProposalPage,
      ),
  },
  {
    path: 'patrimonial',
    loadComponent: () =>
      import('./patrimonial/patrimonial-proposal.page').then((m) => m.PatrimonialProposalPage),
  },
  {
    path: 'evolucion-patrimonial-decisiones',
    loadComponent: () =>
      import('./evolucion-patrimonial-decisiones/evolucion-patrimonial-decisiones.page').then(
        (m) => m.EvolucionPatrimonialDecisionesPage,
      ),
  },
  {
    path: 'patrimonial-decisiones',
    loadComponent: () =>
      import('./patrimonial-decisiones/patrimonial-decisiones.page').then(
        (m) => m.PatrimonialDecisionesPage,
      ),
  },
  {
    path: 'sidebar-decisiones',
    loadComponent: () =>
      import('./sidebar-decisiones/sidebar-decisiones.page').then((m) => m.SidebarDecisionesPage),
  },
  {
    path: 'nav-bar-decisiones',
    loadComponent: () =>
      import('./nav-bar-decisiones/nav-bar-decisiones.page').then((m) => m.NavBarDecisionesPage),
  },
  {
    path: 'dialog-decisiones',
    loadComponent: () =>
      import('./dialog-decisiones/dialog-decisiones.page').then((m) => m.DialogDecisionesPage),
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
    path: 'newsletter-feedback',
    loadComponent: () =>
      import('./newsletter-feedback/newsletter-feedback.page').then(
        (m) => m.NewsletterFeedbackPage,
      ),
  },
  {
    path: 'newsletter-decisiones',
    loadComponent: () =>
      import('./newsletter-decisiones/newsletter-decisiones.page').then(
        (m) => m.NewsletterDecisionesPage,
      ),
  },
  {
    path: 'newsletter-demo',
    loadComponent: () =>
      import('./newsletter-demo/newsletter-demo.page').then((m) => m.NewsletterDemoPage),
  },
];
