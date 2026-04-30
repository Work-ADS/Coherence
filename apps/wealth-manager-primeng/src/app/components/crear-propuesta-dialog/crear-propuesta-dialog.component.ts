import { ChangeDetectionStrategy, Component, output, model } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { ProposalType, PROPOSAL_TYPE_OPTIONS } from '../../data/propuestas.data';

/**
 * Modal dialog shown when the user clicks "Crear propuesta" on the list page.
 * Displays the available proposal types as selectable cards.
 */
@Component({
  selector: 'awmp-crear-propuesta-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      header="Crear propuesta"
      [modal]="true"
      [draggable]="false"
      [dismissableMask]="true"
      [resizable]="false"
      [style]="{ width: '560px' }"
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
    >
      <p class="dialog-subtitle">
        Selecciona el tipo de propuesta que quieres crear para este cliente.
      </p>

      <ul class="type-list" role="list">
        @for (option of options; track option.type) {
          <li>
            <button
              type="button"
              class="type-card"
              (click)="select(option.type)"
              [attr.aria-label]="'Crear propuesta: ' + option.title"
            >
              <span class="type-card__icon" aria-hidden="true">
                <i [class]="'pi ' + option.icon"></i>
              </span>
              <span class="type-card__copy">
                <span class="type-card__title">{{ option.title }}</span>
                <span class="type-card__description">{{ option.description }}</span>
              </span>
              <i class="type-card__chevron pi pi-chevron-right" aria-hidden="true"></i>
            </button>
          </li>
        }
      </ul>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="visible.set(false)" />
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .dialog-subtitle {
        margin: 0 0 var(--space-md) 0;
        color: var(--color-neutral-500);
        font-size: 0.9375rem;
      }

      .type-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
      }

      .type-card {
        display: flex;
        align-items: center;
        gap: var(--space-md);
        width: 100%;
        padding: var(--space-md);
        background: var(--canvas-base);
        border: 1px solid var(--color-neutral-200);
        border-radius: var(--radius-md);
        cursor: pointer;
        text-align: left;
        font: inherit;
        color: inherit;
        transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;
      }

      .type-card:hover {
        border-color: var(--action-300);
        background: var(--action-50);
      }

      .type-card:focus-visible {
        outline: 2px solid var(--action-500);
        outline-offset: 2px;
      }

      .type-card:active {
        transform: scale(0.998);
      }

      .type-card__icon {
        flex: 0 0 auto;
        width: 40px;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--action-50);
        color: var(--action-500);
        border-radius: var(--radius-md);
      }

      .type-card__icon i {
        font-size: 1.125rem;
      }

      .type-card__copy {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1 1 auto;
        min-width: 0;
      }

      .type-card__title {
        font-weight: 500;
        color: var(--canvas-fg);
        font-size: 0.9375rem;
      }

      .type-card__description {
        font-size: 0.8125rem;
        color: var(--color-neutral-500);
        line-height: 1.35;
      }

      .type-card__chevron {
        flex: 0 0 auto;
        font-size: 0.875rem;
        color: var(--color-neutral-400);
      }
    `,
  ],
})
export class CrearPropuestaDialogComponent {
  readonly visible = model.required<boolean>();
  readonly typeSelected = output<ProposalType>();

  readonly options = PROPOSAL_TYPE_OPTIONS;

  select(type: ProposalType): void {
    this.typeSelected.emit(type);
    this.visible.set(false);
  }
}
