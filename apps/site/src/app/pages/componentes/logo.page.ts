import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LogoComponent,
  SelectComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { LogoVariant, SelectOption } from '@coherence/ui';

import type { TokenRow } from '../../components/tokens-table';
import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

type LogoShape = 'wordmark' | 'icon';

@Component({
  selector: 'app-logo-page',
  standalone: true,
  imports: [
    RouterLink,
    LogoComponent,
    SelectComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo.page.html',
  styleUrl: './logo.page.scss',
})
export class LogoPage {
  readonly shape = signal<LogoShape>('wordmark');
  readonly variant = signal<LogoVariant>('color');
  readonly size = signal<string>('md');

  readonly shapeOptions = [
    { value: 'icon', label: 'Icon only' },
    { value: 'wordmark', label: 'Logo + Wordmark' },
  ];

  readonly variantOptions = [
    { value: 'color', label: 'Brand' },
    { value: 'monochrome', label: 'Monochrome' },
  ];

  readonly sizeOptions: SelectOption[] = [
    { value: 'sm', label: 'sm (24px)' },
    { value: 'md', label: 'md (32px)' },
    { value: 'lg', label: 'lg (48px)' },
    { value: 'xl', label: 'xl (64px)' },
  ];


  readonly tokenCategories = computed<DocTokenCategory[]>(() => {
    const v = this.variant();
    const s = this.size();
    const sizeToken = { sm: '--dim-24', md: '--dim-32', lg: '--dim-48', xl: '--dim-64' }[s] ?? '--dim-32';
    const sizeValue = { sm: '24px', md: '32px', lg: '48px', xl: '64px' }[s] ?? '32px';

    const rows: TokenRow[] = [
      v === 'color'
        ? { property: 'Symbol fill', token: '--brand-mark-symbol', semantic: '--brand-mark-symbol', primitive: '--color-afi-azul-500' }
        : { property: 'Symbol fill', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-950' },
    ];

    if (this.shape() === 'wordmark') {
      rows.push({
        property: 'Wordmark fill',
        token: '--foreground-primary-default',
        semantic: '--foreground-primary-default',
        primitive: '--color-afi-control-950',
      });
    }

    rows.push(
      { property: 'Height', token: sizeToken, semantic: sizeToken, primitive: sizeValue },
      { property: 'Focus ring', token: '--border-focus', semantic: '--border-focus', primitive: '--color-afi-azul-500' },
      { property: 'Border radius', token: '--radius-xs', semantic: '--radius-xs', primitive: '4px' },
    );

    return [{ value: 'all', label: 'All', rows }];
  });
}
