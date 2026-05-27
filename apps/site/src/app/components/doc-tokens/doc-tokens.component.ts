import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { ButtonComponent, SegmentedControlComponent } from '@coherence/ui';

import { TokensTableComponent } from '../tokens-table';
import type { DocTokenCategory } from './doc-tokens.types';
import { HandoffInspectService } from '../../services/handoff-inspect.service';

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

  private readonly handoff = inject(HandoffInspectService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  private readonly userActive = signal<string | null>(null);
  readonly copied = signal(false);

  /**
   * CSS variable key of the row that should currently be highlighted.
   * Driven by the most recent inspect-click on the surrounding shell's
   * live preview.
   */
  readonly highlightToken = computed<string | null>(
    () => this.handoff.lastCopied()?.tokenKey ?? null,
  );

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

  constructor() {
    // Auto-switch to the category that contains the inspected token, then
    // scroll the matching row into view. Skipped if the token is already
    // visible in the active category or not present in any category.
    effect(() => {
      const key = this.highlightToken();
      if (!key) return;
      const cats = this.categories();
      const activeCat = cats.find(c => c.value === this.active());
      const inActive = activeCat?.rows.some(r => r.token === key) ?? false;
      if (!inActive) {
        const target = cats.find(c => c.rows.some(r => r.token === key));
        if (target) this.userActive.set(target.value);
      }
      // Defer until the row has rendered (or re-rendered if we just switched).
      queueMicrotask(() => this.scrollRowIntoView(key));
    });
  }

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

  private scrollRowIntoView(tokenKey: string): void {
    const row = this.activeRows().find(r => r.token === tokenKey);
    if (!row) return;
    const selector = `tr[data-row-key="${CSS.escape(row.property)}"]`;
    const el = this.host.nativeElement.querySelector(selector) as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
