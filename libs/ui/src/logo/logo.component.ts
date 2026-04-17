// TODO(brand-manifest): once brand/mode architecture lands, read variant from a provider instead of input.
import { Component, computed, input } from '@angular/core';

const SIZE_MAP: Record<string, string> = {
  sm: 'var(--dim-24)',
  md: 'var(--dim-32)',
  lg: 'var(--dim-48)',
  xl: 'var(--dim-64)',
};

/**
 * AFI Logo component.
 *
 * Renders the AFI brand mark as an `<img>` inside either an `<a>` (when `href`
 * is provided) or a `<span>` (when it is not). SVGs live in `public/brand/`
 * and are referenced by URL — no inline embedding.
 *
 * @example
 * ```html
 * <coherence-logo variant="color" size="md" href="/" />
 * ```
 */
@Component({
  selector: 'coherence-logo',
  standalone: true,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent {
  /** Logo color variant. */
  readonly variant = input<'color' | 'positivo' | 'negativo'>('color');

  /** Display size mapped to --dim-* tokens. */
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  /** When set, wraps the logo in an anchor. */
  readonly href = input<string | null>(null);

  readonly src = computed(() => `brand/afi-${this.variant()}.svg`);

  readonly heightVar = computed(() => SIZE_MAP[this.size()] ?? SIZE_MAP['md']);
}
