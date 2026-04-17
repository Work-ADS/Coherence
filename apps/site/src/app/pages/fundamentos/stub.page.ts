import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'site-fundamentos-stub',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[920px] mx-auto px-space-10 py-space-10">
      <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-2">
        Foundations
      </p>
      <h1 class="text-subtitle text-canvas-fg mb-space-6 capitalize">
        {{ topic$ | async }}
      </h1>
      <p class="max-w-[640px] text-body-md text-neutral-500">
        Contenido detallado próximamente.
      </p>
    </div>
  `,
})
export class FundamentosStubPage {
  private readonly route = inject(ActivatedRoute);
  readonly topic$ = this.route.paramMap.pipe(map(p => p.get('topic') ?? ''));
}
