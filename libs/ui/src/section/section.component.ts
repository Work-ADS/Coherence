import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export type SectionVariant = 'default' | 'collapsible';

let nextId = 0;

/**
 * Boxed section container — eyebrow + title + subtitle + body, optionally
 * collapsible. Header text stack and action slot live side-by-side in the
 * header row; the body is gated below by `--section-gap`.
 *
 * Visual spec — locked 2026-06-03 to Figma file `pajleACyFdm5y`,
 * node `466:28470`. All values flow through tokens:
 *  - Eyebrow: `--type-section-eyebrow`, all-caps, foreground/secondary/default.
 *  - Title:   `--type-section-title` medium, foreground/primary/default.
 *  - Subtitle: `--type-section-subtitle` regular, foreground/secondary/default.
 *  - Card: `--section-padding-inline` + `--section-padding-block`,
 *    `--section-radius`, surface/subtle background, hairline border-subtle.
 *  - Header → body gap: `--section-gap`.
 *
 * Variants:
 *  - `default`     — static container, always shows the body.
 *  - `collapsible` — header is a button; clicking toggles the body. Chevron
 *                    rotates 180°. `expanded` is a model signal so callers
 *                    can do `[(expanded)]="state"`.
 *
 * Optional decorations in the header (right-aligned, before the chevron):
 *  - `count`    — small text chip. Pass `null` to hide. Strings or numbers.
 *  - `complete` — renders a check icon (success token).
 *  - `[slot="header-actions"]` — anything you want (e.g. a delete button).
 */
@Component({
  selector: 'afi-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-expanded]': 'isExpanded()',
  },
})
export class SectionComponent {
  /** Small all-caps text rendered above the title (e.g. "OBJETIVOS"). */
  readonly eyebrow = input<string | null>(null);
  readonly title = input<string>('');
  /** Optional descriptive line under the title (14/16 regular). */
  readonly subtitle = input<string | null>(null);
  readonly variant = input<SectionVariant>('default');
  readonly expanded = model<boolean>(true);
  readonly count = input<string | number | null>(null);
  readonly complete = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly toggled = output<boolean>();

  readonly sectionId = `afi-section-${nextId++}`;
  readonly bodyId = `${this.sectionId}-body`;

  readonly isCollapsible = computed(() => this.variant() === 'collapsible');
  readonly isExpanded = computed(() =>
    this.isCollapsible() ? this.expanded() : true,
  );

  readonly hasCount = computed(() => {
    const c = this.count();
    return c !== null && c !== undefined && c !== '';
  });

  readonly hasEyebrow = computed(() => {
    const e = this.eyebrow();
    return e !== null && e !== undefined && e.trim() !== '';
  });

  readonly hasSubtitle = computed(() => {
    const s = this.subtitle();
    return s !== null && s !== undefined && s.trim() !== '';
  });

  readonly hasTitle = computed(() => {
    const t = this.title();
    return t !== null && t !== undefined && t.trim() !== '';
  });

  onToggle(): void {
    if (!this.isCollapsible()) return;
    const next = !this.expanded();
    this.expanded.set(next);
    this.toggled.emit(next);
  }
}
