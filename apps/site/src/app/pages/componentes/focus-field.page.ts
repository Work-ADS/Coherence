import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent, DrawerComponent, FocusField, InputComponent } from '@coherence/ui';

import { DocPageShellComponent } from '../../components/doc-page-shell';
import { DocTokensComponent, type DocTokenCategory } from '../../components/doc-tokens';

@Component({
  selector: 'app-focus-field-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, InputComponent, DrawerComponent, DocPageShellComponent, DocTokensComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './focus-field.page.html',
  styleUrl: './focus-field.page.scss',
})
export class FocusFieldPage {
  private readonly lastField = viewChild.required<InputComponent, ElementRef<HTMLElement>>(
    'lastField',
    { read: ElementRef },
  );

  readonly drawerField = viewChild.required<InputComponent, ElementRef<HTMLElement>>('drawerInput', {
    read: ElementRef,
  });

  readonly drawerOpen = signal(false);
  readonly result = signal('');
  readonly showErrors = signal(false);

  readonly tokenCategories: DocTokenCategory[] = [
    {
      value: 'ring',
      label: 'Ring',
      rows: [
        { property: 'Ring colour', token: '--border-focus' },
        { property: 'Ring colour (invalid field)', token: '--feedback-error-border' },
        { property: 'Border (invalid field)', token: '--feedback-error-foreground' },
        { property: 'Ring width', token: '--border-width-thick' },
        { property: 'Border (focused)', token: '--input-border-focus' },
      ],
    },
    {
      value: 'motion',
      label: 'Motion',
      rows: [
        { property: 'Settle duration', token: '--duration-slow' },
        { property: 'Settle easing', token: '--easing-enter' },
      ],
    },
  ];

  jumpToLast(): void {
    const landed = FocusField.focus(this.lastField().nativeElement, { scroll: 'center' });
    this.result.set(landed ? 'Focus landed: true' : 'Focus landed: false');
  }

  saveWithErrors(): void {
    this.showErrors.set(true);
    // Let the error props render (and set aria-invalid) before the search.
    requestAnimationFrame(() => {
      const landed = FocusField.firstInvalid('.preview__form');
      this.result.set(landed ? 'First invalid field focused' : 'No invalid field found');
    });
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  reset(): void {
    this.showErrors.set(false);
    this.result.set('');
  }
}
