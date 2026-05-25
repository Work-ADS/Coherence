import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@coherence/ui';

@Component({
  selector: 'site-mixin-brand-bind-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mixin-brand-bind.page.html',
  styleUrl: './mixin-brand-bind.page.scss',
})
export class MixinBrandBindPage {}
