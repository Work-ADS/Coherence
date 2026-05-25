import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Evolution glyph — Wealth Planner thumbnail.
 *
 * A small monochrome SVG: a line climbing up-and-to-the-right with five
 * iteration dots along the way. Tells the story of "five iterations with
 * seniors, wealth evolution" in one diagram.
 *
 * Hover (driven by the parent card via `.card:hover &`): the line redraws
 * via stroke-dashoffset, and each dot pops in sequence.
 */
@Component({
  selector: 'site-evolution-glyph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './evolution-glyph.component.html',
  styleUrl: './evolution-glyph.component.scss',
})
export class EvolutionGlyphComponent {}
