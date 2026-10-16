import { Routes } from '@angular/router';

export const componentes_routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes.landing').then(m => m.ComponentesLandingPage),
  },
  // ─── Ready (new DS atoms) ─────────────────────────────────────────────────
  { path: 'logo', loadComponent: () => import('./logo.page').then(m => m.LogoPage) },
  { path: 'icon-button', loadComponent: () => import('./icon-button.page').then(m => m.IconButtonPage) },
  { path: 'avatar', loadComponent: () => import('./avatar.page').then(m => m.AvatarPage) },
  { path: 'segmented-control', loadComponent: () => import('./segmented-control.page').then(m => m.SegmentedControlPage) },
  { path: 'dropdown-panel', loadComponent: () => import('./dropdown-panel.page').then(m => m.DropdownPanelPage) },
  { path: 'inline-edit', loadComponent: () => import('./inline-edit.page').then(m => m.InlineEditPage) },
  { path: 'editable-text', redirectTo: 'inline-edit', pathMatch: 'full' },
  // The bar primitive (variants, shell band, exit) is documented at /componentes/top-bar below;
  // the composed site nav bar stays a pattern at /patrones/cabeceras/top-bar.
  { path: 'tooltip', loadComponent: () => import('./tooltip.page').then(m => m.TooltipPage) },
  { path: 'focus-field', loadComponent: () => import('./focus-field.page').then(m => m.FocusFieldPage) },
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
  { path: 'search', loadComponent: () => import('./search.page').then(m => m.SearchPage) },
  { path: 'multi-select', loadComponent: () => import('./multi-select.page').then(m => m.MultiSelectPage) },
  { path: 'select', loadComponent: () => import('./select.page').then(m => m.SelectPage) },
  // The IA exploration still lives at /patrones/sidebar-ia-comparison; the
  // primitive itself (variants, rail, tokens) is documented here.
  { path: 'sidebar', loadComponent: () => import('./sidebar.page').then(m => m.SidebarPage) },
  { path: 'stepper', loadComponent: () => import('./stepper.page').then(m => m.StepperPage) },
  { path: 'top-bar', loadComponent: () => import('./top-bar.page').then(m => m.TopBarPage) },
  { path: 'nav-section', loadComponent: () => import('./nav-section.page').then(m => m.NavSectionPage) },
  { path: 'menu', loadComponent: () => import('./menu.page').then(m => m.MenuPage) },
  { path: 'table', loadComponent: () => import('./table.page').then(m => m.TablePage) },
  { path: 'page-header', loadComponent: () => import('./page-header.page').then(m => m.PageHeaderPage) },
  { path: 'status-chip', loadComponent: () => import('./status-chip.page').then(m => m.StatusChipPage) },
  { path: 'filter-chip', loadComponent: () => import('./filter-chip.page').then(m => m.FilterChipPage) },
  { path: 'field-help', loadComponent: () => import('./field-help.page').then(m => m.FieldHelpPage) },
  { path: 'icon', loadComponent: () => import('./icon.page').then(m => m.IconPage) },
  { path: 'kbd', loadComponent: () => import('./kbd.page').then(m => m.KbdPage) },
  { path: 'shell', loadComponent: () => import('./shell.page').then(m => m.ShellPage) },
  { path: 'nav-item', loadComponent: () => import('./nav-item.page').then(m => m.NavItemPage) },
  { path: 'badge', loadComponent: () => import('./badge.page').then(m => m.BadgePage) },
  { path: 'radio-group', loadComponent: () => import('./radio-group.page').then(m => m.RadioGroupPage) },
];
