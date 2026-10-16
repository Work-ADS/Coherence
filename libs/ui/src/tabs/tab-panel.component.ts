import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

/**
 * Tab panel for a consumer that owns its panel markup (a bar drawn with
 * `items`, a Drawer header). Pass the ACTIVE tab value: when it changes the
 * content plays the tab-change enter animation. The first render does not
 * animate; under `prefers-reduced-motion` the animation is a short fade.
 *
 * @example
 * ```html
 * <afi-tabs [items]="tabs" [value]="tab()" (valueChange)="tab.set($event)" />
 * <afi-tab-panel [value]="tab()">…</afi-tab-panel>
 * ```
 */
@Component({
  selector: 'afi-tab-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.scss',
})
export class TabPanelComponent {
  /** The active tab's value. */
  readonly value = input<string | null>(null);

  /** The `idPrefix` given to the bar: names the panel after its tab (`aria-labelledby`). */
  readonly idPrefix = input<string | null>(null);

  /** Accessible name when there is no bar id to point at. */
  readonly ariaLabel = input<string | null>(null);

  protected readonly labelledBy = computed(() => {
    const prefix = this.idPrefix();
    const value = this.value();
    return prefix && value !== null ? `${prefix}-${value}` : null;
  });

  /** Counts changes after the first value. */
  private readonly changes = signal(0);
  private seeded = false;
  private last: string | null = null;

  /** Two identical animations alternate so a quick second change restarts the motion. */
  protected readonly enterA = computed(() => this.changes() % 2 === 1);
  protected readonly enterB = computed(() => this.changes() > 0 && this.changes() % 2 === 0);

  constructor() {
    effect(() => {
      const next = this.value();
      if (!this.seeded) {
        this.seeded = true;
        this.last = next;
        return;
      }
      if (next === this.last) return;
      this.last = next;
      this.changes.update((n) => n + 1);
    });
  }
}
