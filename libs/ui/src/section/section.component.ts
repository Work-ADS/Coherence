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
 * Boxed section container — title row + body, optionally collapsible.
 *
 * Graduated from the `.dd-section` / `.familia-section` pattern that was
 * being reinvented across multiple pages. Use anywhere you need a labelled
 * group of fields/content with a clear surface boundary.
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
  readonly title = input<string>('');
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

  onToggle(): void {
    if (!this.isCollapsible()) return;
    const next = !this.expanded();
    this.expanded.set(next);
    this.toggled.emit(next);
  }
}
