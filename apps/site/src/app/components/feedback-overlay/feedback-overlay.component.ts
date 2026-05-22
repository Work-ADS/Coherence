import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  ButtonComponent,
  DrawerComponent,
  IconButtonComponent,
  InputComponent,
} from '@coherence/ui';

import { ConfirmActionComponent } from '../confirm-action';
import { CommentService, DemoComment } from '../../services/comment.service';

interface ViewGroup {
  viewIndex: number;
  viewLabel: string;
  comments: DemoComment[];
}

interface DemoGroup {
  demoSlug: string;
  demoRoute: string;
  label: string;
  views: ViewGroup[];
  totalCount: number;
}

const DEMO_LABELS: Record<string, string> = {
  'wealth-planner': 'Wealth Planner',
};

@Component({
  selector: 'site-feedback-overlay',
  standalone: true,
  imports: [ButtonComponent, DrawerComponent, IconButtonComponent, InputComponent, ConfirmActionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feedback-overlay.component.html',
  styleUrl: './feedback-overlay.component.scss',
})
export class FeedbackOverlayComponent {
  private readonly router = inject(Router);
  readonly commentService = inject(CommentService);

  readonly drawerOpen = signal(false);

  readonly editingId = signal<string | null>(null);
  readonly editingText = signal('');

  readonly deleteConfirmAnchor = signal<HTMLElement | null>(null);
  readonly deleteConfirmId = signal<string | null>(null);

  readonly clearAllAnchor = signal<HTMLElement | null>(null);

  readonly demoGroups = computed<DemoGroup[]>(() => {
    const all = this.commentService.getAll();
    const byDemo = new Map<string, DemoComment[]>();

    for (const c of all) {
      const arr = byDemo.get(c.demoSlug) ?? [];
      arr.push(c);
      byDemo.set(c.demoSlug, arr);
    }

    const groups: DemoGroup[] = [];
    for (const [slug, demoComments] of byDemo) {
      const byView = new Map<number, ViewGroup>();
      for (const c of demoComments) {
        const existing = byView.get(c.viewIndex);
        if (existing) {
          existing.comments.push(c);
        } else {
          byView.set(c.viewIndex, {
            viewIndex: c.viewIndex,
            viewLabel: c.viewLabel,
            comments: [c],
          });
        }
      }
      const views = Array.from(byView.values())
        .map((v) => ({
          ...v,
          comments: v.comments.sort((a, b) => b.timestamp - a.timestamp),
        }))
        .sort((a, b) => a.viewIndex - b.viewIndex);

      groups.push({
        demoSlug: slug,
        demoRoute: demoComments[0]!.demoRoute,
        label: DEMO_LABELS[slug] ?? slug,
        views,
        totalCount: demoComments.length,
      });
    }
    return groups;
  });

  formatTime(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  }

  jumpTo(route: string): void {
    this.drawerOpen.set(false);
    this.router.navigateByUrl(route);
  }

  resolve(id: string): void {
    this.commentService.resolve(id);
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }

  downloadMarkdown(): void {
    this.commentService.downloadMarkdown();
  }

  startEdit(c: DemoComment): void {
    this.editingId.set(c.id);
    this.editingText.set(c.text);
  }

  onEditInput(value: string | number | null): void {
    this.editingText.set(value == null ? '' : String(value));
  }

  onEditKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.saveEdit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }
  }

  saveEdit(): void {
    const id = this.editingId();
    const text = this.editingText().trim();
    if (id && text) this.commentService.update(id, text);
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingText.set('');
  }

  askDelete(id: string, event: Event): void {
    const anchor = event.currentTarget as HTMLElement | null;
    if (!anchor) return;
    this.deleteConfirmAnchor.set(anchor);
    this.deleteConfirmId.set(id);
  }

  confirmDelete(): void {
    const id = this.deleteConfirmId();
    if (id) this.commentService.delete(id);
    this.cancelDelete();
  }

  cancelDelete(): void {
    this.deleteConfirmAnchor.set(null);
    this.deleteConfirmId.set(null);
  }

  askClearAll(event: Event): void {
    const anchor = event.currentTarget as HTMLElement | null;
    if (!anchor) return;
    this.clearAllAnchor.set(anchor);
  }

  confirmClearAll(): void {
    this.commentService.clearAll();
    this.clearAllAnchor.set(null);
  }

  cancelClearAll(): void {
    this.clearAllAnchor.set(null);
  }
}
