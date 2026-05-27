import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ModalComponent,
  ButtonComponent,
  SegmentedControlComponent,
} from '@coherence/ui';
import type { ModalSize } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

const VISUAL_CATEGORY: DocTokenCategory = {
  value: 'visual',
  label: 'Visual',
  rows: [
    { property: 'Backdrop', token: '--overlay-backdrop', semantic: '--overlay-backdrop', primitive: 'rgba(0,0,0,0.5)' },
    { property: 'Surface', token: '--surface-default', semantic: '--surface-default', primitive: '--color-afi-control-0' },
    { property: 'Border radius', token: '--radius-xl', semantic: '--radius-xl', primitive: '16px' },
    { property: 'Shadow', token: '--shadow-2xl', semantic: '--shadow-2xl', primitive: '0 25px 50px rgba(0,0,0,0.25)' },
    { property: 'Title color', token: '--foreground-primary-default', semantic: '--foreground-primary-default', primitive: '--color-afi-control-900' },
    { property: 'Body color', token: '--foreground-secondary-default', semantic: '--foreground-secondary-default', primitive: '--color-afi-control-700' },
  ],
};

const SIZING_CATEGORY: DocTokenCategory = {
  value: 'sizing',
  label: 'Sizing',
  rows: [
    { property: 'sm max-width', token: '--dimension-modal-sm', semantic: '--dimension-modal-sm', primitive: '420px' },
    { property: 'md max-width', token: '--dimension-modal-md', semantic: '--dimension-modal-md', primitive: '560px' },
    { property: 'lg max-width', token: '--dimension-modal-lg', semantic: '--dimension-modal-lg', primitive: '720px' },
    { property: 'Padding', token: '--space-xl', semantic: '--space-xl', primitive: '32px' },
  ],
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

@Component({
  selector: 'site-modal-page',
  standalone: true,
  imports: [
    RouterLink,
    ModalComponent,
    ButtonComponent,
    SegmentedControlComponent,
    DocPageShellComponent,
    DocTokensComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.page.html',
  styleUrl: './modal.page.scss',
})
export class ModalPage {
  readonly size = signal<ModalSize>('md');
  readonly open = signal(false);

  readonly sizeOptions = SIZE_OPTIONS;
  readonly tokenCategories: DocTokenCategory[] = [VISUAL_CATEGORY, SIZING_CATEGORY];

  openModal(): void {
    this.open.set(true);
  }

  closeModal(): void {
    this.open.set(false);
  }
}
