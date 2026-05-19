import { Routes } from '@angular/router';

export const componentes_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes.landing').then(m => m.ComponentesLandingPage),
  },
  // ─── Ready (new DS atoms) ─────────────────────────────────────────────────
  { path: 'icon-button', loadComponent: () => import('./icon-button.page').then(m => m.IconButtonPage) },
  { path: 'avatar', loadComponent: () => import('./avatar.page').then(m => m.AvatarPage) },
  { path: 'segmented-control', loadComponent: () => import('./segmented-control.page').then(m => m.SegmentedControlPage) },
  { path: 'dropdown-panel', loadComponent: () => import('./dropdown-panel.page').then(m => m.DropdownPanelPage) },
  { path: 'editable-text', loadComponent: () => import('./editable-text.page').then(m => m.EditableTextPage) },
  { path: 'top-bar', loadComponent: () => import('./top-bar.page').then(m => m.TopBarPage) },
  { path: 'tooltip', loadComponent: () => import('./tooltip.page').then(m => m.TooltipPage) },
  { path: 'toast', loadComponent: () => import('./toast.page').then(m => m.ToastPage) },
  // ─── Legacy ───────────────────────────────────────────────────────────────
  // Explicit primitive detail pages
  { path: 'button', loadComponent: () => import('./button.page').then(m => m.ButtonPage) },
  { path: 'input', loadComponent: () => import('./input.page').then(m => m.InputPage) },
  { path: 'checkbox', loadComponent: () => import('./checkbox.page').then(m => m.CheckboxPage) },
  { path: 'switch', loadComponent: () => import('./switch.page').then(m => m.SwitchPage) },
  { path: 'loading-overlay', loadComponent: () => import('./loading-overlay.page').then(m => m.LoadingOverlayPage) },
  { path: 'card', loadComponent: () => import('./card.page').then(m => m.CardPage) },
  { path: 'tabs', loadComponent: () => import('./tabs.page').then(m => m.TabsPage) },
  { path: 'modal', loadComponent: () => import('./modal.page').then(m => m.ModalPage) },
  { path: 'drawer', loadComponent: () => import('./drawer.page').then(m => m.DrawerPage) },
  { path: 'select', loadComponent: () => import('./select.page').then(m => m.SelectPage) },
  { path: 'sidebar', loadComponent: () => import('./sidebar.page').then(m => m.SidebarPage) },
  { path: 'nav-section', loadComponent: () => import('./nav-section.page').then(m => m.NavSectionPage) },
  { path: 'menu', loadComponent: () => import('./menu.page').then(m => m.MenuPage) },
  { path: 'table', loadComponent: () => import('./table.page').then(m => m.TablePage) },
  { path: 'page-header', loadComponent: () => import('./page-header.page').then(m => m.PageHeaderPage) },
  { path: 'status-chip', loadComponent: () => import('./status-chip.page').then(m => m.StatusChipPage) },
  { path: 'kbd', loadComponent: () => import('./kbd.page').then(m => m.KbdPage) },
  { path: 'shell', loadComponent: () => import('./shell.page').then(m => m.ShellPage) },
  { path: 'nav-item', loadComponent: () => import('./nav-item.page').then(m => m.NavItemPage) },
  { path: 'badge', loadComponent: () => import('./badge.page').then(m => m.BadgePage) },
  { path: 'radio-group', loadComponent: () => import('./radio-group.page').then(m => m.RadioGroupPage) },
];
