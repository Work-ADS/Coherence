import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import { ButtonComponent, SegmentedControlComponent } from '@coherence/ui';

import { TokensTableComponent } from '../tokens-table';
import type { DocTokenCategory } from './doc-tokens.types';

/**
 * Reusable "Tokens consumidos" block for component/pattern doc pages.
 *
 * Renders: title row (label + Copy button) → category segmented control → tokens table
 * for the active category. Pages just hand it a list of categories.
 */
@Component({
  selector: 'site-doc-tokens',
  standalone: true,
  imports: [ButtonComponent, SegmentedControlComponent, TokensTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './doc-tokens.component.html',
  styleUrl: './doc-tokens.component.scss',
})
export class DocTokensComponent {
  readonly categories = input.required<DocTokenCategory[]>();
  readonly title = input<string>('Tokens consumidos');

  private readonly userActive = signal<string | null>(null);
  readonly copied = signal(false);

  readonly active = computed<string>(() => {
    const cats = this.categories();
    const picked = this.userActive();
    if (picked && cats.some(c => c.value === picked)) return picked;
    return cats[0]?.value ?? '';
  });

  readonly options = computed(() =>
    this.categories().map(c => ({ value: c.value, label: c.label })),
  );

  readonly activeRows = computed(() => {
    const v = this.active();
    return this.categories().find(c => c.value === v)?.rows ?? [];
  });

  onCategoryChange(value: string): void {
    this.userActive.set(value);
  }

  copyTokens(): void {
    const text = this.activeRows()
      .map(r => `${r.property}: ${r.token}`)
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
