import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ButtonComponent,
  InputComponent,
  SectionComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

/**
 * Patrón · Sección.
 *
 * Documents the `<afi-section>` primitive — the boxed container with an
 * uppercase title, optional collapsible variant, optional count chip and
 * complete check. The pattern was graduated from `.dd-section` /
 * `.familia-section` / `.lr-section` etc., which were rebuilding the same
 * card visual under different page-local class names.
 */
@Component({
  selector: 'site-patron-section-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    InputComponent,
    SectionComponent,
    SelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section.page.html',
  styleUrls: ['./section.page.scss'],
})
export class PatronSectionPage {
  // Live state for the collapsible demo so the chevron actually moves.
  readonly collapsibleExpanded = signal<boolean>(true);
  readonly countDemoExpanded = signal<boolean>(false);
  readonly completeDemoExpanded = signal<boolean>(true);

  readonly demoOptions: SelectOption[] = [
    { value: 'a', label: 'Opción A' },
    { value: 'b', label: 'Opción B' },
    { value: 'c', label: 'Opción C' },
  ];

  readonly demoFieldValue = signal<string>('');
  readonly demoSelectValue = signal<string>('');

  setFieldValue(v: string | number | null): void {
    this.demoFieldValue.set(v === null ? '' : String(v));
  }

  setSelectValue(v: string | number | null): void {
    this.demoSelectValue.set(v === null ? '' : String(v));
  }
}
