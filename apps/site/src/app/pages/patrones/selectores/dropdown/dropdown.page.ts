import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocPageShellComponent } from '../../../../components/doc-page-shell/doc-page-shell.component';
import { IconButtonComponent, TooltipComponent, SegmentedControlComponent, StatusChipComponent } from '@coherence/ui';

type TriggerType = 'icon-button' | 'tag';

@Component({
  selector: 'site-dropdown-page',
  standalone: true,
  imports: [
    RouterLink,
    DocPageShellComponent,
    IconButtonComponent,
    TooltipComponent,
    SegmentedControlComponent,
    StatusChipComponent,
  ],
  templateUrl: './dropdown.page.html',
  styleUrl: './dropdown.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownPage {
  /* ── Controls ── */
  protected readonly triggerOptions = [
    { value: 'icon-button', label: 'Icon Button' },
    { value: 'tag', label: 'Status Chip' },
  ];
  protected readonly trigger = signal<TriggerType>('icon-button');

  /* ── Preview state ── */
  protected readonly dropdownOpen = signal(false);

  protected toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  protected closeDropdown(): void {
    this.dropdownOpen.set(false);
  }
}
