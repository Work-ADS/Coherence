import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardComponent, SegmentedControlComponent } from '@coherence/ui';
import type { CardVariant, CardPadding } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

// Token rows mirror libs/ui/src/card/card.variants.ts `tokenUsage`. Source of
// truth is the component SCSS — keep these in sync when the primitive moves.
const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Fondo (default)', token: '--surface-subtle', semantic: '--surface-subtle', primitive: 'AFI Gris 50' },
    { property: 'Fondo (elevated)', token: '--surface-raised', semantic: '--surface-raised', primitive: 'AFI Gris 0' },
    { property: 'Fondo (quiet)', token: '--surface-default', semantic: '--surface-default', primitive: 'AFI White 25' },
    { property: 'Sombra (elevated)', token: '--elevation-sm', semantic: '--elevation-sm' },
    { property: 'Sombra hover (interactive)', token: '--elevation-card-hover', semantic: '--elevation-card-hover', note: 'sube 2 px' },
    { property: 'Sombra (on-brand)', token: '--elevation-card-on-brand', semantic: '--elevation-card-on-brand' },
    { property: 'Borde (bordered)', token: '--border-subtle', semantic: '--border-subtle' },
    { property: 'Foco (interactive)', token: '--border-focus', semantic: '--border-focus', note: 'anillo de 2 px' },
    { property: 'Radio', token: '--radius-card', semantic: '--radius-card' },
    { property: 'Radio (bordered)', token: '--radius-section', semantic: '--radius-section' },
    { property: 'Transición', token: '--duration-base / --easing-standard' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'Header / footer padding', token: '--space-sm / --space-md', note: 'block / inline' },
    { property: 'Body padding (sm)', token: '--space-sm', semantic: '--space-sm' },
    { property: 'Body padding (md)', token: '--space-md', semantic: '--space-md' },
    { property: 'Body padding (lg)', token: '--space-lg', semantic: '--space-lg' },
    { property: 'Body padding (none)', token: '0' },
  ],
};

const VARIANT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'subtle', label: 'Subtle (= default)' },
  { value: 'raised', label: 'Raised (= elevated)' },
];

const PADDING_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

@Component({
  selector: 'site-card-page',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.page.html',
  styleUrl: './card.page.scss',
})
export class CardPage {
  readonly variant = signal<CardVariant>('default');
  readonly padding = signal<CardPadding>('md');
  readonly clicks = signal(0);

  readonly variantOptions = VARIANT_OPTIONS;
  readonly paddingOptions = PADDING_OPTIONS;

  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];
}
