import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeaderComponent, TableComponent } from '@coherence/ui';
import type { TableCellTone, TableColumn } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';

interface ConsecucionRow {
  // Index signature so the literal satisfies `<afi-table>`'s
  // `Record<string, unknown>[]` rows input. The named fields remain
  // strictly typed for editor support.
  [key: string]: unknown;
  id: 'objetivo' | 'optimista' | 'medio' | 'pesimista';
  escenario: string;
  coberturaAntes: string;
  inmoAntes: string;
  finAntes: string;
  coberturaDespues: string;
  inmoDespues: string;
  finDespues: string;
  tCobAntes?: TableCellTone;
  tInmoAntes?: TableCellTone;
  tFinAntes?: TableCellTone;
  tCobDespues?: TableCellTone;
  tInmoDespues?: TableCellTone;
  tFinDespues?: TableCellTone;
  /** Marks the Objetivo reference row — italic + tertiary foreground via the primitive. */
  muted?: boolean;
}

/**
 * Conclusiones · Consecución de objetivos (PDF §5.b).
 *
 * One read-out table: per-scenario cobertura vital y legado (inmobiliario,
 * financiero), antes y después del plan de acción. No charts, no modals,
 * no state — the spec fixes the data.
 *
 * Color encoding (verde/naranja/rojo) lives on the row data via the
 * `tCob*` / `tInmo*` / `tFin*` fields; each numeric column reads its
 * tone through `TableColumn.toneKey`, mapped to `--feedback-*-foreground`
 * by the primitive.
 *
 * The "Objetivo" row is the reference target — its `Después` cells render
 * as em-dashes because the target itself does not change with the plan.
 *
 * PDF: `CambiosAfiWealthPlanner20260226.pdf` p.10, §5.b.
 */
@Component({
  selector: 'site-consecucion-objetivos-page',
  standalone: true,
  imports: [PageHeaderComponent, TableComponent, ObjetivosPageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './consecucion-objetivos.page.html',
  styleUrls: ['./consecucion-objetivos.page.scss'],
})
export class ConsecucionObjetivosPage {
  readonly scenarioColumns: TableColumn[] = [
    { key: 'escenario', label: 'Escenario' },
    {
      key: 'coberturaAntes',
      label: 'Cobertura vital',
      align: 'end',
      toneKey: 'tCobAntes',
      group: 'antes',
      groupLabel: 'Antes del plan de acción',
    },
    {
      key: 'inmoAntes',
      label: 'Legado inmobiliario',
      align: 'end',
      toneKey: 'tInmoAntes',
      group: 'antes',
    },
    {
      key: 'finAntes',
      label: 'Legado financiero',
      align: 'end',
      toneKey: 'tFinAntes',
      group: 'antes',
    },
    {
      key: 'coberturaDespues',
      label: 'Cobertura vital',
      align: 'end',
      toneKey: 'tCobDespues',
      group: 'despues',
      groupLabel: 'Después del plan de acción',
    },
    {
      key: 'inmoDespues',
      label: 'Legado inmobiliario',
      align: 'end',
      toneKey: 'tInmoDespues',
      group: 'despues',
    },
    {
      key: 'finDespues',
      label: 'Legado financiero',
      align: 'end',
      toneKey: 'tFinDespues',
      group: 'despues',
    },
  ];

  readonly scenarioRows: ConsecucionRow[] = [
    {
      id: 'objetivo',
      escenario: 'Objetivo',
      // Reference baseline — same values in both groups (the target is
      // constant; the plan does not change it). Row renders italic +
      // tertiary foreground via the primitive's `muted` flag.
      muted: true,
      coberturaAntes: '100+ años',
      inmoAntes: '3,02 M €',
      finAntes: '1,52 M €',
      coberturaDespues: '100+ años',
      inmoDespues: '3,02 M €',
      finDespues: '1,52 M €',
    },
    {
      id: 'optimista',
      escenario: 'Optimista',
      coberturaAntes: '100+ años',
      inmoAntes: '4,12 M €',
      finAntes: '1,93 M €',
      tFinAntes: 'success',
      coberturaDespues: '100+ años',
      inmoDespues: '4,12 M €',
      finDespues: '2,33 M €',
      tFinDespues: 'success',
    },
    {
      id: 'medio',
      escenario: 'Medio',
      coberturaAntes: '100+ años',
      inmoAntes: '2,73 M €',
      finAntes: '1,22 M €',
      tFinAntes: 'warning',
      coberturaDespues: '100+ años',
      inmoDespues: '2,73 M €',
      finDespues: '1,99 M €',
      tFinDespues: 'success',
    },
    {
      id: 'pesimista',
      escenario: 'Pesimista',
      coberturaAntes: '87 años',
      tCobAntes: 'danger',
      inmoAntes: '1,03 M €',
      finAntes: '0,00 M €',
      tFinAntes: 'danger',
      coberturaDespues: '92 años',
      tCobDespues: 'danger',
      inmoDespues: '1,03 M €',
      finDespues: '0,00 M €',
      tFinDespues: 'danger',
    },
  ];
}
