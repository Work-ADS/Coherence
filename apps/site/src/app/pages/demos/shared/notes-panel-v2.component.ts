// external
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

// internal (libs)
import { ButtonV2Component, IconButtonV2Component, InputV2Component } from '@coherence/ui';

// relative
import type { PlanNote } from './notes-dropdown.component';

/**
 * Notes panel — identity v2 (foundations-modern).
 *
 * The v2 successor of `site-notes-dropdown`: same contract (timestamped
 * advisor notes, add + delete, document-click / Esc close), rebuilt from v2
 * primitives — input-v2 for the draft, button-v2 to add, icon-button-v2 to
 * close and delete — over a modern surface (hairline border, xl radius,
 * tooltip elevation). Anchors below its trigger inside a relative wrapper.
 */
@Component({
  selector: 'site-notes-panel-v2',
  standalone: true,
  imports: [ButtonV2Component, IconButtonV2Component, InputV2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notes-panel-v2.component.html',
  styleUrls: ['./notes-panel-v2.component.scss'],
})
export class NotesPanelV2Component {
  private readonly el = inject(ElementRef);

  readonly open = input<boolean>(false);
  readonly notes = input<PlanNote[]>([]);

  readonly closed = output<void>();
  readonly noteAdded = output<string>();
  readonly noteDeleted = output<string>();

  readonly draft = signal('');

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
    if (!text) return;
    this.noteAdded.emit(text);
    this.draft.set('');
  }

  onDraftKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
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
