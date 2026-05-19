import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'site-tipografia-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tipografia.page.html',
  styleUrl: './tipografia.page.scss',
})
export class TipografiaPage {
  readonly headingScale = [
    { name: 'Display', token: '--type-display', sample: 'Wealth Planner', note: 'Hero headlines only. Scales 48→96px at lg breakpoint.' },
    { name: 'Title', token: '--type-title', sample: 'Fundamentos del sistema', note: 'Page titles. 24→32px responsive.' },
    { name: 'Subtitle', token: '--type-subtitle', sample: 'Escala de acción', note: 'Section headers. 20→24px responsive.' },
    { name: 'Section', token: '--type-section', sample: 'Colores de sistema', note: 'Sub-sections within a page. 18→20px responsive.' },
  ];

  readonly bodyScale = [
    { name: 'Body', token: '--type-body', spec: '400 16px/24px', note: 'Default reading text.' },
    { name: 'Body LG 600', token: '--type-body-lg-600', spec: '600 16px/24px', note: 'Emphasized body — labels, bold callouts.' },
    { name: 'Body MD 500', token: '--type-body-md-500', spec: '500 14px/20px', note: 'Nav links, table headers, medium emphasis.' },
    { name: 'Body MD 400', token: '--type-body-md-400', spec: '400 14px/20px', note: 'Secondary text, descriptions.' },
    { name: 'Body SM 400', token: '--type-body-sm-400', spec: '400 12px/16px', note: 'Captions, metadata, timestamps.' },
    { name: 'Button', token: '--type-button', spec: '500 14px/14px', note: 'Button labels. Tight line-height for vertical centering.' },
  ];

  readonly trackingScale = [
    { name: 'Tight', token: '--tracking-tight', value: '-0.025em', use: 'Display headings — negative tracking aids readability at large sizes.' },
    { name: 'Snug', token: '--tracking-snug', value: '-0.02em', use: 'Titles and subtitles.' },
    { name: 'Normal', token: '--tracking-normal', value: '0', use: 'Body text — browser default.' },
    { name: 'Wide', token: '--tracking-wide', value: '0.025em', use: 'Uppercase labels, overlines.' },
    { name: 'Wider', token: '--tracking-wider', value: '0.06em', use: 'Small-caps, all-caps section markers.' },
  ];
}
