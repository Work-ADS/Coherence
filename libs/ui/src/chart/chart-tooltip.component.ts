import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

/**
 * Shared chart tooltip.
 *
 * Positioned absolutely relative to the chart container.
 * Shows on hover and keyboard focus; dismiss via Esc.
 * 120ms fade per motion spec; reduced-motion collapses to 0–80ms.
 */
@Component({
  selector: 'afi-chart-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { pointer-events: none; position: absolute; z-index: 20; }
    .tooltip {
      background: var(--surface-elevated, white);
      border: 1px solid var(--border-hairline, #e5e5e5);
      border-radius: var(--radius-md, 6px);
      box-shadow: var(--elevation-md, 0 2px 8px rgba(0,0,0,0.08));
      padding: var(--spacing-8, 8px) var(--spacing-12, 12px);
      font-size: var(--font-size-body-sm, 12px);
      color: var(--canvas-fg, #1a1a1a);
      white-space: nowrap;
      opacity: 0;
      transition: opacity 120ms ease-out;
    }
    .tooltip--visible { opacity: 1; }
    @media (prefers-reduced-motion: reduce) {
      .tooltip { transition-duration: 0ms; }
    }
  `,
  template: `
    @if (visible()) {
      <div class="tooltip" [class.tooltip--visible]="visible()"
           [style.left.px]="x()" [style.top.px]="y()"
           role="tooltip" [attr.id]="tooltipId()">
        <div class="font-medium">{{ title() }}</div>
        @if (value()) {
          <div class="text-neutral-600">{{ value() }}</div>
        }
        @if (secondary()) {
          <div class="text-neutral-500 mt-1">{{ secondary() }}</div>
        }
      </div>
    }
  `,
})
export class ChartTooltipComponent {
  readonly visible = signal(false);
  readonly x = signal(0);
  readonly y = signal(0);
  readonly title = input('');
  readonly value = input<string | null>(null);
  readonly secondary = input<string | null>(null);
  readonly tooltipId = input('afi-chart-tooltip');

  show(x: number, y: number): void {
    this.x.set(x);
    this.y.set(y);
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }
}
