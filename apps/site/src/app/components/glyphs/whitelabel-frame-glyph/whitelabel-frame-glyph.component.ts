import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Whitelabel-frame glyph — Sarevi (LK on Coherence DS) thumbnail.
 *
 * The frame stays constant (the DS shell); the internal bars shift position
 * on hover — same structure, different arrangement for each client. Mirrors
 * the metaphor in richardgriner.com/components/motion/glyphs/whitelabel.tsx.
 *
 * Hover (driven by parent card): rows swap left ↔ right inside the frame.
 */
@Component({
  selector: 'site-whitelabel-frame-glyph',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './whitelabel-frame-glyph.component.html',
  styleUrl: './whitelabel-frame-glyph.component.scss',
})
export class WhitelabelFrameGlyphComponent {}
