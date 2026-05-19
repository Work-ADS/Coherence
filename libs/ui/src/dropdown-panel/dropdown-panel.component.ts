import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ElementRef,
  inject,
  HostListener,
} from '@angular/core';

/**
 * Dropdown Panel — a floating container that anchors below a trigger element.
 *
 * Provides header/body/footer slots, click-outside-to-close, and Escape key dismiss.
 */
@Component({
  selector: 'afi-dropdown-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown-panel.component.html',
  styleUrls: ['./dropdown-panel.component.scss'],
  host: { class: 'dropdown-panel' },
})
export class DropdownPanelComponent {
  private readonly el = inject(ElementRef);

  readonly open = input<boolean>(false);
  readonly width = input<number>(320);
  readonly maxHeight = input<number>(400);
  readonly ariaLabel = input<string>('');

  readonly closed = output<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.el.nativeElement.contains(event.target)) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) {
      this.closed.emit();
    }
  }
}
