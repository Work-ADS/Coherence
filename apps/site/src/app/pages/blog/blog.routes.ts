import { Routes } from '@angular/router';

export const blog_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog.landing').then(m => m.BlogLandingPage),
  },
];
