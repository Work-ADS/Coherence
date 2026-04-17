import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'site-blog-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        BLOG
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-3">
        Blog
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-600 mb-space-8">
        Notas de producto escritas al momento del envío.
      </p>

      <div class="border border-border-hairline rounded-md p-space-8 text-center">
        <p class="text-body-md text-neutral-500">
          La primera entrada se publicará con el lanzamiento de v1.
        </p>
      </div>
    </div>
  `,
})
export class BlogLandingPage {}
