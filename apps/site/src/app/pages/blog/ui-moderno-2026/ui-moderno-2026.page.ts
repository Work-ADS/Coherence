import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@coherence/ui';

@Component({
  selector: 'site-ui-moderno-2026-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-moderno-2026.page.html',
  styleUrls: ['./ui-moderno-2026.page.scss'],
})
export class UiModerno2026Page {}
