import { Routes } from '@angular/router';

export const talks_routes: Routes = [
  {
    path: 'stitch-vs-claude',
    loadComponent: () =>
      import('./stitch-vs-claude/stitch-vs-claude.page').then((m) => m.StitchVsClaudePage),
  },
];
