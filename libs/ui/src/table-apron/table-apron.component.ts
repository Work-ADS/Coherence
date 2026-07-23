import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { IconButtonV2Component } from '../icon-button-v2';
import type {
  TableApronSelectionAction,
  TableApronSize,
  TableApronToken,
} from './table-apron.variants';

/**
 * Table apron — identity v2 (foundations-modern).
 *
 * A floating status strip for a data table (the "apron" under the tabletop):
 * it reads out the live result count (`shown` / `total`) and the active filters
 * as removable tokens. Presentation-only — the consumer owns the filter/search
 * state and passes the resolved values, mirroring `afi-table-v2`'s
 * "does not sort/filter itself" contract.
 *
 * Consumes only `foundations-modern` tokens, so it renders correctly only
 * inside a `[data-foundation="modern"]` scope. Pair it with `afi-table-v2`.
 *
 * A11y: the count lives in a `role="status"` `aria-live="polite"` region so a
 * change ("6 de 30 resultados") is announced to assistive tech. The visible
 * "shown / total" reading is `aria-hidden`; a screen-reader-only phrase using
 * "de" is announced instead so the "/" is never read aloud as "barra". Each
 * removable token exposes its dismiss control as a `<button>` named
 * "Quitar {label}".
 *
 * Figma source of truth: AFI-FOUNDATIONS-MODERN → Table apron (pending).
 */
@Component({
  selector: 'afi-table-apron',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButtonV2Component],
  templateUrl: './table-apron.component.html',
  styleUrls: ['./table-apron.component.scss'],
})
export class TableApronComponent {
  /** Rows currently shown (after filter/search). */
  readonly shown = input.required<number>();
  /** Total rows before any filter. */
  readonly total = input.required<number>();
  /** Singular noun for the counted thing (RAE, lowercase). Default "resultado". */
  readonly noun = input<string>('resultado');
  /**
   * Explicit plural — pass when the noun's plural is not `noun + "s"`
   * (e.g. "pensión" → "pensiones"). Defaults to `noun + "s"`.
   */
  readonly nounPlural = input<string | null>(null);
  /** Active-filter tokens (readouts, not controls). */
  readonly tokens = input<TableApronToken[]>([]);
  /** Density — pair with the table's density. */
  readonly size = input<TableApronSize>('md');

  /**
   * Number of currently-selected rows. When > 0 the apron shows a selection
   * token — same chrome as a filter token (check icon + label + clear ×),
   * filled with the table's selected-row tint, since a selection is a clearable
   * state just like a filter. Leave 0 to hide it.
   */
  readonly selectedCount = input<number>(0);
  /**
   * Override the selection chip text. Defaults to `{n} seleccionados`; pass a
   * feminine/other form (e.g. `3 seleccionadas`) when the row noun needs it.
   */
  readonly selectedText = input<string | null>(null);
  /**
   * Bulk actions offered while rows are selected — rendered as icon buttons
   * beside the selection chip (e.g. Borrar). Emits `selectionAction` on click.
   */
  readonly selectionActions = input<TableApronSelectionAction[]>([]);

  /** Emitted when a token's × is activated. Consumer clears that filter. */
  readonly tokenDismissed = output<TableApronToken>();
  /** Emitted when the selection chip's × is activated. Consumer clears selection. */
  readonly selectionCleared = output<void>();
  /** Emitted when a bulk selection action's icon button is activated. */
  readonly selectionAction = output<TableApronSelectionAction>();

  /** Noun agrees with the total collection size (30 resultados, 1 resultado). */
  readonly nounForm = computed(() =>
    this.total() === 1 ? this.noun() : (this.nounPlural() ?? `${this.noun()}s`),
  );

  /** Screen-reader phrase for the live region — RAE "de", never the "/" glyph. */
  readonly statusText = computed(() => `${this.shown()} de ${this.total()} ${this.nounForm()}`);

  readonly rootClasses = computed(() => `afi-table-apron afi-table-apron--${this.size()}`);

  readonly hasSelection = computed(() => this.selectedCount() > 0);

  /** Visible + announced selection text. */
  readonly selectionLabel = computed(
    () => this.selectedText() ?? `${this.selectedCount()} seleccionados`,
  );

  isRemovable(token: TableApronToken): boolean {
    return token.removable !== false;
  }

  onDismiss(token: TableApronToken): void {
    this.tokenDismissed.emit(token);
  }

  onClearSelection(): void {
    this.selectionCleared.emit();
  }

  onSelectionAction(action: TableApronSelectionAction): void {
    this.selectionAction.emit(action);
  }
}
