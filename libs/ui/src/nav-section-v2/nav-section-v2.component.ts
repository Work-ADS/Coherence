import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';

import { SidebarV2Component } from '../sidebar-v2/sidebar-v2.component';

/**
 * Nav section — identity v2 (foundations-modern).
 *
 * A labelled group of `<afi-nav-item-v2>` rows inside `<afi-sidebar-v2>`. Two
 * roles compose from the same primitive: a Static group (persistent tools) and a
 * Dynamic group (contextual/recent work) — the difference is only whether it
 * declares `empty`. Anatomy: optional Section Label (`content/tertiary`,
 * uppercase caption) + a stacked list of projected items, or an empty-state line
 * when Dynamic content is absent.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only inside
 * a `[data-foundation="modern"]` scope.
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Sidebar / Dynamic group
 * (2762:5065) and Sidebar (2762:5281). In the collapsed rail the section label
 * and empty-state text are suppressed — only the icon rows remain.
 */
@Component({
  selector: 'afi-nav-section-v2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-section-v2.component.html',
  styleUrls: ['./nav-section-v2.component.scss'],
  host: { class: 'afi-nav-section-v2-host' },
})
export class NavSectionV2Component {
  /** Section heading (e.g. "Planificación"). Empty → no label node renders. */
  readonly label = input<string>('');

  /** Marks a Dynamic group with no items — shows `emptyText` when expanded. */
  readonly empty = input<boolean>(false);

  /** Message shown when `empty` and the sidebar is expanded. RAE Spanish. */
  readonly emptyText = input<string>('No hay elementos recientes');

  private readonly sidebar = inject<SidebarV2Component>(
    forwardRef(() => SidebarV2Component),
  );

  /** True when the parent sidebar is in its collapsed icon-rail layout. */
  readonly collapsed = computed(() => this.sidebar.collapsed());

  /** Show the heading only when it exists and there is room (expanded). */
  readonly showLabel = computed(() => this.label() !== '' && !this.collapsed());

  /** Show the empty-state line only when empty and expanded. */
  readonly showEmpty = computed(() => this.empty() && !this.collapsed());
}
