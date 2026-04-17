import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Individual tab — used inside `<afi-tabs>`.
 * Content is projected by the parent Tabs component.
 */
@Component({
  selector: 'afi-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class TabComponent {
  readonly label = input.required<string>();
  readonly icon = input<string | null>(null);
  readonly badge = input<number | string | null>(null);
  readonly disabled = input<boolean>(false);
}
