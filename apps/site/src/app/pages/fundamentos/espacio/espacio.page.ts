import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'site-espacio-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './espacio.page.html',
  styleUrl: './espacio.page.scss',
})
export class EspacioPage {
  readonly baseScale = [
    { index: '0', px: '0' },
    { index: '0.25', px: '1' },
    { index: '0.5', px: '2' },
    { index: '1', px: '4' },
    { index: '1.5', px: '6' },
    { index: '2', px: '8' },
    { index: '2.5', px: '10' },
    { index: '3', px: '12' },
    { index: '4', px: '16' },
    { index: '5', px: '20' },
    { index: '6', px: '24' },
    { index: '8', px: '32' },
    { index: '10', px: '40' },
    { index: '12', px: '48' },
    { index: '14', px: '56' },
    { index: '16', px: '64' },
    { index: '20', px: '80' },
  ];

  readonly semanticSpacing = [
    { name: '--space-2xs', maps: '--dimension-1 (4px)', use: 'Icon-to-label gap, tight internal padding' },
    { name: '--space-xs', maps: '--dimension-2 (8px)', use: 'List item gaps, compact padding' },
    { name: '--space-sm', maps: '--dimension-3 (12px)', use: 'Card internal padding, button padding-inline' },
    { name: '--space-md', maps: '--dimension-4 (16px)', use: 'Standard component padding, section gaps' },
    { name: '--space-lg', maps: '--dimension-6 (24px)', use: 'Between sections, generous padding' },
    { name: '--space-xl', maps: '--dimension-8 (32px)', use: 'Page-level margins, major section breaks' },
    { name: '--space-2xl', maps: '--dimension-12 (48px)', use: 'Hero sections, page top padding' },
    { name: '--space-3xl', maps: '--dimension-16 (64px)', use: 'Landing page vertical rhythm' },
  ];

  readonly radiusScale = [
    { name: '--radius-none', value: '0', use: 'Tables, full-bleed containers' },
    { name: '--radius-sm', value: '4px', use: 'Chips, tags, small badges' },
    { name: '--radius-md', value: '8px', use: 'Buttons, inputs, cards' },
    { name: '--radius-lg', value: '12px', use: 'Panels, dialogs' },
    { name: '--radius-xl', value: '16px', use: 'Large cards, hero containers' },
    { name: '--radius-full', value: '9999px', use: 'Avatars, pills, dots' },
  ];
}
