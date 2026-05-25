import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Collapse glyph — "White-label en una línea" blog post thumbnail.
 *
 * Tells the mixin-brand-bind story visually: a stack of varied lines
 * (representing the 90-line per-brand mapping) collapses on hover into a
 * single short bar (the 8-line @include).
 *
 * Hover: rows scale down toward the center and converge on one line.
 */
@Component({
  selector: 'site-collapse-glyph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collapse-glyph.component.html',
  styleUrl: './collapse-glyph.component.scss',
})
export class CollapseGlyphComponent {}
