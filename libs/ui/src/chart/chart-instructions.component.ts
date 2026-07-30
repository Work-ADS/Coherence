import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

import { ModalComponent } from '../modal';
import { ButtonComponent } from '../button';
import { KbdComponent } from '../kbd';
import type { KbdSeparator } from '../kbd';

/** Which chart is asking, so the modal lists only the keys that chart binds. */
export type ChartKind = 'bar' | 'line' | 'heatmap' | 'dumbbell';

interface ShortcutRow {
  /** Stable track key. */
  id: string;
  /** Keycap glyphs, passed to `afi-kbd` so it can speak them in Spanish. */
  keys: string[];
  separator: KbdSeparator;
  description: string;
}

/**
 * Base map, shared by every chart. `Control+Shift` is not decoration: VoiceOver
 * on macOS swallows the arrow keys unless it is held, so without it the chart is
 * unreachable for exactly the users this modal exists for.
 */
const BASE_SHORTCUTS: readonly ShortcutRow[] = [
  {
    id: 'enter',
    keys: ['↵'],
    separator: 'none',
    description: 'Entrar en el gráfico o activar el punto',
  },
  {
    id: 'shift-enter',
    keys: ['⇧', '↵'],
    separator: 'plus',
    description: 'Salir al nivel del gráfico',
  },
  {
    id: 'horizontal',
    keys: ['←', '→'],
    separator: 'none',
    description: 'Navegar entre puntos contiguos',
  },
];

/**
 * Vertical arrows, and what they traverse. Only for charts with a second axis:
 * bar and dumbbell are one-dimensional and bind nothing here, so listing the
 * keys for them would advertise navigation that does not exist.
 */
const CROSS_GROUP_SHORTCUT: Record<ChartKind, ShortcutRow | null> = {
  bar: null,
  dumbbell: null,
  line: {
    id: 'vertical',
    keys: ['↑', '↓'],
    separator: 'none',
    description: 'Navegar entre series',
  },
  heatmap: {
    id: 'vertical',
    keys: ['↑', '↓'],
    separator: 'none',
    description: 'Navegar entre filas',
  },
};

const TRAILING_SHORTCUTS: readonly ShortcutRow[] = [
  {
    id: 'voiceover',
    keys: ['⌃', '⇧'],
    separator: 'plus',
    description:
      'Mantener pulsado junto a las flechas para navegar con VoiceOver en macOS',
  },
  {
    id: 'escape',
    keys: ['⎋'],
    separator: 'none',
    description: 'Cerrar la información emergente',
  },
  {
    id: 'tab',
    keys: ['⇥'],
    separator: 'none',
    description: 'Salir del gráfico',
  },
];

/**
 * Keyboard-instructions modal for chart primitives.
 *
 * Wraps `<afi-modal>` with the keyboard map from `data-viz-skill.md` for the
 * chart that opened it. Opened by a ghost button auto-added to each chart's
 * action slot.
 *
 * The map is assembled per chart rather than hardcoded because the shortcuts
 * genuinely differ: Visa documents `↑ ↓` on line and heatmap only, since bar and
 * dumbbell have no second axis to move along.
 */
@Component({
  selector: 'afi-chart-instructions',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-instructions.component.html',
  styleUrls: ['./chart-instructions.component.scss'],
})
export class ChartInstructionsComponent {
  readonly chartLabel = input('gráfico');

  /** Which chart's map to show. Drives whether the vertical arrows are listed. */
  readonly chartKind = input<ChartKind>('bar');

  readonly opened = output<void>();

  protected readonly isOpen = signal(false);

  protected readonly shortcuts = computed<readonly ShortcutRow[]>(() => {
    const crossGroup = CROSS_GROUP_SHORTCUT[this.chartKind()];
    return [
      ...BASE_SHORTCUTS,
      ...(crossGroup ? [crossGroup] : []),
      ...TRAILING_SHORTCUTS,
    ];
  });

  open(): void {
    this.isOpen.set(true);
    this.opened.emit();
  }

  close(): void {
    this.isOpen.set(false);
  }

  onModalChange(open: boolean): void {
    this.isOpen.set(open);
  }
}
