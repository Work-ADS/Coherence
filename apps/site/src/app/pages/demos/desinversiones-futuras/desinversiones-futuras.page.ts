import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonComponent, IconButtonComponent } from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { ObjetivosPageShellComponent } from '../wealth-planner-2026/shared/objetivos-page-shell.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type { DesinversionObjetivo } from '../wealth-planner-2026/store';

/**
 * Objetivos · Desinversiones futuras — list page (Brief G).
 *
 * Optional section. Lists planned divestments (assets the family intends to
 * sell to generate liquidez or rentas). Clicking a row or the inline edit
 * icon routes to the detail page; the "+ Añadir" CTA creates a new empty
 * desinversion and routes straight to its detail page for editing.
 *
 * Figma reference: node `32:275620`. PDF: pp.5–6.
 */
@Component({
  selector: 'site-desinversiones-futuras-page',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    RouterLink,
    ObjetivosPageShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './desinversiones-futuras.page.html',
  styleUrls: ['./desinversiones-futuras.page.scss'],
})
export class DesinversionesFuturasPage {
  readonly store = inject(WealthPlannerStore);
  private readonly router = inject(Router);

  // ── Objetivo labels (mirrors the detail-page options) ────────────────
  private readonly objetivoOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Generar liquidez' },
    { value: 'rentas', label: 'Generar rentas' },
  ];

  objetivoLabel(objetivo: DesinversionObjetivo | null): string {
    return this.objetivoOptions.find((o) => o.value === objetivo)?.label ?? '—';
  }

  formatEuro(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  // ── Actions ───────────────────────────────────────────────────────────
  openAdd(): void {
    const next = this.store.addDesinversion();
    this.router.navigate([
      '/demos/wealth-planner-2026/desinversiones-futuras',
      next.id,
    ]);
  }

  removeRow(id: string, event?: Event): void {
    event?.stopPropagation();
    this.store.removeDesinversion(id);
  }
}
