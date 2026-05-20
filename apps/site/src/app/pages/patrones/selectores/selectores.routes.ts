import { Routes } from '@angular/router';

export const selectores_routes: Routes = [
  {
    path: 'dropdown',
    loadComponent: () => import('./dropdown/dropdown.page').then((m) => m.DropdownPage),
  },
];
