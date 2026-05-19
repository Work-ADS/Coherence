import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';

/**
 * Editable Text — inline text that becomes an input on edit trigger.
 *
 * Flow: display text + pencil icon → click → input with value → check (commit) or X (cancel)
 */
@Component({
  selector: 'afi-editable-text',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss'],
})
export class EditableTextComponent {
  readonly value = input.required<string>();
  readonly placeholder = input<string>('');
  readonly ariaLabel = input<string>('texto');

  readonly committed = output<string>();
  readonly cancelled = output<void>();

  readonly editing = signal(false);
  readonly draft = signal('');

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  startEdit(): void {
    this.draft.set(this.value());
    this.editing.set(true);
    setTimeout(() => this.inputEl?.nativeElement.focus(), 0);
  }

  commit(event?: Event): void {
    event?.preventDefault();
    const trimmed = this.draft().trim();
    if (trimmed && trimmed !== this.value()) {
      this.committed.emit(trimmed);
    }
    this.editing.set(false);
  }

  cancel(): void {
    this.editing.set(false);
    this.cancelled.emit();
  }
}
