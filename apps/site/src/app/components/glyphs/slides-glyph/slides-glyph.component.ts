import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Slides glyph — talk / slide-show thumbnail.
 *
 * Three small slide cards stacked with a forward arrow. On hover the cards
 * shift right with staggered delay (suggesting arrow-key navigation) and the
 * arrow fades in to its full position. Matches the visual language of the
 * blog landing card for /talks/stitch-vs-claude.
 */
@Component({
  selector: 'site-slides-glyph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './slides-glyph.component.html',
  styleUrl: './slides-glyph.component.scss',
})
export class SlidesGlyphComponent {}
