import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  ViewChild,
  viewChild,
} from '@angular/core';

import type { IconName } from '../icon';

/**
 * Individual tab item — used inside `<afi-tabs>`.
 * Holds metadata (label, badge, disabled) that the parent reads via contentChildren.
 * Content is projected by the parent TabsComponent.
 */
@Component({
  selector: 'afi-tab-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #content>
      <ng-content />
    </ng-template>
  `,
})
export class TabItemComponent {
  readonly label = input.required<string>();
  /** Stable key of the tab for `value` mode. Unset: the tab's position, as a string. */
  readonly value = input<string | null>(null);
  readonly icon = input<IconName | null>(null);
  /** Trailing count chip. `badge` is the older name for the same chip. */
  readonly count = input<number | string | null>(null);
  readonly badge = input<number | string | null>(null);
  readonly disabled = input<boolean>(false);

  /** Template ref for lazy/conditional projection by the parent. */
  readonly contentTpl = viewChild<TemplateRef<unknown>>('content');
}
