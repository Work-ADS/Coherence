import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';

export interface PlanNote {
  id: string;
  text: string;
  timestamp: Date;
}

/**
 * Notes Dropdown — a floating panel for timestamped advisor notes.
 *
 * Replaces the previous full-width drawer. Anchors below the trigger icon button.
 * Pattern: Fireflies-style — list of notes with timestamps, input at the bottom.
 */
@Component({
  selector: 'site-notes-dropdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notes-dropdown.component.html',
  styleUrls: ['./notes-dropdown.component.scss'],
})
export class NotesDropdownComponent {
  private readonly el = inject(ElementRef);

  readonly open = input<boolean>(false);
  readonly notes = input<PlanNote[]>([]);

  readonly closed = output<void>();
  readonly noteAdded = output<string>();
  readonly noteDeleted = output<string>();

  readonly draft = signal('');

  @ViewChild('textareaEl') textareaEl?: ElementRef<HTMLTextAreaElement>;

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

  addNote(): void {
    const text = this.draft().trim();
    if (text) {
      this.noteAdded.emit(text);
      this.draft.set('');
    }
  }

  deleteNote(id: string): void {
    this.noteDeleted.emit(id);
  }

  onKeydown(event: KeyboardEvent): void {
    // Cmd/Ctrl+Enter to submit
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.addNote();
    }
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
