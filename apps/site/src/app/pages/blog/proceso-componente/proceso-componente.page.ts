import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@coherence/ui';

@Component({
  selector: 'site-proceso-componente-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proceso-componente.page.html',
  styleUrls: ['./proceso-componente.page.scss'],
})
export class ProcesoComponentePage {
  readonly figjamUrl =
    'https://www.figma.com/board/GXsvf7GIFWvK76zKSfkA8z/Design-flow?node-id=891-206';
}
