import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'afi-primitive-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-space-8 first:pt-0 border-b border-border-hairline last:border-b-0">
      <header class="mb-space-5">
        <h2 class="text-section text-canvas-fg mb-space-1">{{ name() }}</h2>
        <p class="text-body-md text-neutral-600 max-w-[640px]">{{ description() }}</p>
      </header>
      <div class="flex flex-wrap items-start gap-space-4 max-w-[720px]">
        <ng-content />
      </div>
    </section>
  `,
})
export class PrimitiveCardComponent {
  readonly name = input.required<string>();
  readonly description = input.required<string>();
}
