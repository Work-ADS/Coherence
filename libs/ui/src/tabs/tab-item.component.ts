import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  ViewChild,
  viewChild,
} from '@angular/core';

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
  readonly icon = input<string | null>(null);
  readonly badge = input<number | string | null>(null);
  readonly disabled = input<boolean>(false);

  /** Template ref for lazy/conditional projection by the parent. */
  readonly contentTpl = viewChild<TemplateRef<unknown>>('content');
}
