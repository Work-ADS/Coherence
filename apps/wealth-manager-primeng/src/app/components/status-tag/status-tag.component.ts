import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ProposalStatus, STATUS_VISUAL } from '../../data/propuestas.data';

/**
 * Status tag with a 5-dot progress indicator and a label.
 * Reads bg/fg/dot from the --status-{semantic}-* Tier 2 tokens
 * (libs/tokens/semantic/status.json).
 */
@Component({
  selector: 'awmp-status-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="status-tag" [attr.data-semantic]="visual().semantic">
      <span class="status-tag__dots" aria-hidden="true">
        @for (i of dotIndices(); track i) {
          <span class="status-tag__dot" [class.is-filled]="i < visual().filled"></span>
        }
      </span>
      <span class="status-tag__label">{{ visual().label }}</span>
      @if (visual().icon; as icon) {
        <i [class]="'pi ' + icon" aria-hidden="true"></i>
      }
    </span>
  `,
  imports: [],
  styles: [
    `
      :host {
        display: inline-block;
      }

      .status-tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: 0.8125rem;
        font-weight: 500;
        white-space: nowrap;
      }

      .status-tag__dots {
        display: inline-flex;
        align-items: center;
        gap: 3px;
      }

      .status-tag__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--color-neutral-200);
      }

      .status-tag__dot.is-filled {
        background: var(--dot-color, var(--color-neutral-500));
      }

      .status-tag__label {
        color: var(--canvas-fg);
        letter-spacing: 0.01em;
      }

      .status-tag i {
        font-size: 0.875rem;
      }

      /* Pull dot + label color from --status-{semantic}-* tokens. */
      .status-tag[data-semantic='in-review'] {
        --dot-color: var(--status-in-review-dot);
      }

      .status-tag[data-semantic='approved'] {
        --dot-color: var(--status-approved-dot);
        .status-tag__label { color: var(--status-approved-fg); }
      }

      .status-tag[data-semantic='rejected'] {
        --dot-color: var(--status-rejected-dot);
        .status-tag__label { color: var(--status-rejected-fg); }
      }

      .status-tag[data-semantic='pending'] {
        --dot-color: var(--status-pending-dot);
        .status-tag__label { color: var(--status-pending-fg); }
      }

      .status-tag[data-semantic='draft'] {
        --dot-color: var(--status-draft-dot);
      }

      .status-tag i {
        color: var(--status-pending-fg);
      }
    `,
  ],
})
export class StatusTagComponent {
  readonly status = input.required<ProposalStatus>();

  readonly visual = computed(() => STATUS_VISUAL[this.status()]);
  readonly dotIndices = computed(() =>
    Array.from({ length: this.visual().total }, (_, i) => i),
  );
}
