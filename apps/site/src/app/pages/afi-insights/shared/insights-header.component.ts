import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '@coherence/ui';

@Component({
  selector: 'ai-insights-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './insights-header.component.html',
  styleUrl: './insights-header.component.scss',
})
export class InsightsHeaderComponent {
  readonly subscribeClicked = output<void>();
}
