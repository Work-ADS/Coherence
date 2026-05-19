import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'site-accesibilidad-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accesibilidad.page.html',
  styleUrl: './accesibilidad.page.scss',
})
export class AccesibilidadPage {
  readonly contrastRules = [
    { ratio: '4.5:1', applies: 'Normal text (< 18px / < 14px bold)', level: 'AA' },
    { ratio: '3:1', applies: 'Large text (≥ 18px / ≥ 14px bold), UI components', level: 'AA' },
    { ratio: '7:1', applies: 'Normal text — enhanced level', level: 'AAA' },
  ];

  readonly focusRules = [
    'Every interactive element has a visible focus indicator.',
    'Focus ring: 2px solid, offset 2px, uses --border-focus token.',
    'Focus order follows DOM order — no tabindex hacks.',
    'Keyboard traps are never allowed. CDK FocusTrap for modals/drawers only.',
  ];

  readonly checklist = [
    'aria-label or aria-labelledby on every interactive element without visible text.',
    'role attribute when native semantics are insufficient (custom dropdowns, tabs).',
    'Color is never the sole indicator — pair with icon, text, or pattern.',
    'Reduced motion: every animation has a prefers-reduced-motion fallback.',
    'Touch targets: minimum 44×44px (--control-h-sm).',
  ];
}
