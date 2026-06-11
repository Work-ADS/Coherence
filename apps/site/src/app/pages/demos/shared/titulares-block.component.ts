import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import {
  IconButtonComponent,
  InputComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

/**
 * Single titular row inside the block. `titularId` resolves to a
 * `SelectOption` from `titularOptions` in the host. `porcentaje` is
 * a 0–100 number; the host owns whether to allow > 100 with a warning
 * or hard-clamp.
 */
export interface TitularRow {
  id: string;
  titularId: string | null;
  porcentaje: number;
}

/**
 * Multi-row "Titulares" sub-block reused across every patrimonio + futuro
 * dialog (Figma: organism/dialog/anadir-* — every per-tipo screen has the
 * same `Titular* + Porcentaje*` row, the trash icon, the "+ Añadir" link,
 * and the green "Total: 100 %" validator at the bottom-left).
 *
 * State is owned by the host. The component:
 *   - emits `rowsChange` on every mutation (add / remove / edit cell)
 *   - exposes a `total` computed signal so the host can disable Aceptar
 *     when the sum != 100
 */
@Component({
  selector: 'site-titulares-block',
  standalone: true,
  imports: [IconButtonComponent, InputComponent, SelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './titulares-block.component.html',
  styleUrls: ['./titulares-block.component.scss'],
})
export class TitularesBlockComponent {
  readonly rows = input.required<TitularRow[]>();
  readonly titularOptions = input.required<SelectOption[]>();
  readonly label = input<string>('Titulares');

  readonly rowsChange = output<TitularRow[]>();

  readonly total = computed(() =>
    this.rows().reduce((sum, r) => sum + (Number.isFinite(r.porcentaje) ? r.porcentaje : 0), 0),
  );

  readonly isValid = computed(() => Math.round(this.total()) === 100);

  /** Synthesizes the next short id ("t-3") from existing rows. */
  private nextId(rows: TitularRow[]): string {
    const used = new Set(rows.map((r) => r.id));
    let n = rows.length + 1;
    while (used.has(`t-${n}`)) n++;
    return `t-${n}`;
  }

  addRow(): void {
    const current = this.rows();
    const remaining = Math.max(0, 100 - this.total());
    const next: TitularRow = {
      id: this.nextId(current),
      titularId: null,
      porcentaje: remaining,
    };
    this.rowsChange.emit([...current, next]);
  }

  removeRow(id: string): void {
    this.rowsChange.emit(this.rows().filter((r) => r.id !== id));
  }

  setTitular(id: string, value: string | number | null): void {
    const next = this.rows().map((r) =>
      r.id === id ? { ...r, titularId: value === null ? null : String(value) } : r,
    );
    this.rowsChange.emit(next);
  }

  setPorcentaje(id: string, value: string | number | null): void {
    const num = value === null || value === '' ? 0 : Number(value);
    const safe = Number.isFinite(num) ? num : 0;
    const next = this.rows().map((r) => (r.id === id ? { ...r, porcentaje: safe } : r));
    this.rowsChange.emit(next);
  }
}
