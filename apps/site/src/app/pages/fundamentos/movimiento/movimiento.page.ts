import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'site-movimiento-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimiento.page.html',
  styleUrl: './movimiento.page.scss',
})
export class MovimientoPage {
  readonly durations = [
    { name: '--duration-fast', value: '150ms', use: 'Small elements — chips, icons, focus rings. Feels instant.' },
    { name: '--duration-base', value: '200ms', use: 'Default for most transitions — buttons, inputs, hovers.' },
    { name: '--duration-slow', value: '300ms', use: 'Large elements — modals, drawers, page-level shifts.' },
  ];

  readonly easings = [
    { name: '--easing-standard', value: 'cubic-bezier(0.4, 0, 0.2, 1)', use: 'General purpose — state changes within the page.' },
    { name: '--easing-enter', value: 'cubic-bezier(0.16, 1, 0.3, 1)', use: 'Elements appearing — decelerates into resting position.' },
    { name: '--easing-exit', value: 'cubic-bezier(0.7, 0, 0.84, 0)', use: 'Elements leaving — accelerates out of view.' },
  ];

  readonly principles = [
    'Container-first — transition the container, not individual children.',
    'Enter = ease-out (decelerate into view). Exit = ease-in (accelerate out).',
    'Duration scales with size: small = fast, medium = base, large = slow.',
    'Respect prefers-reduced-motion — provide instant fallback, never disable entirely.',
  ];
}
