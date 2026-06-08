import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Banco Cooperativo Español site footer.
 *
 * Used on the BC demo route only (rendered conditionally by the simulator
 * page on `[data-sarevi-brand="banco-cooperativo"]`). Verde-cooperativo
 * band with the BC wordmark left, link list center, Ruralvía mark right,
 * copyright row below. Token-only — no raw hex / rgb / px.
 *
 * Reference: Figma file rw0MpBWVyKNmLZIkLJ9oyS, welcome node 2:20973.
 */
@Component({
  selector: 'site-bc-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bc-footer.component.html',
  styleUrl: './bc-footer.component.scss',
})
export class BcFooterComponent {
  readonly year = 2026;
}
