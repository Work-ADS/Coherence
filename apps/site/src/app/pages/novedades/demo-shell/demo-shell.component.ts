import { ChangeDetectionStrategy, Component, inject, signal, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InspectService } from '../../../services/inspect.service';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'site-demo-shell',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-shell.component.html',
  styleUrl: './demo-shell.component.scss',
})
export class DemoShellComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  readonly inspect = inject(InspectService);
  readonly comments = inject(CommentService);

  readonly activeMode = signal<'inspect' | 'comment' | null>(null);
  readonly commentText = signal('');
  readonly commentTarget = signal<string | null>(null);
  readonly demoSlug = signal('wealth-planner');

  /** Which view/state the demo shows */
  readonly activeView = signal(0);
  readonly views = signal<string[]>(['Patrimonio', 'Evolución']);

  @ViewChild('demoArea') demoArea!: ElementRef<HTMLElement>;

  private hoverListener: ((e: MouseEvent) => void) | null = null;
  private clickListener: ((e: MouseEvent) => void) | null = null;
  private highlightedEl: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.setupListeners();
  }

  ngOnDestroy(): void {
    this.teardownListeners();
    this.inspect.deactivate();
    this.comments.deactivate();
  }

  toggleInspect(): void {
    if (this.activeMode() === 'inspect') {
      this.activeMode.set(null);
      this.inspect.deactivate();
    } else {
      this.activeMode.set('inspect');
      this.inspect.activate();
      this.comments.deactivate();
    }
  }

  toggleComment(): void {
    if (this.activeMode() === 'comment') {
      this.activeMode.set(null);
      this.comments.deactivate();
    } else {
      this.activeMode.set('comment');
      this.comments.activate();
      this.inspect.deactivate();
    }
  }

  goBack(): void {
    this.router.navigate(['/novedades']);
  }

  restart(): void {
    // Re-trigger current view
    const current = this.activeView();
    this.activeView.set(-1);
    setTimeout(() => this.activeView.set(current), 0);
  }

  nextView(): void {
    const next = (this.activeView() + 1) % this.views().length;
    this.activeView.set(next);
  }

  submitComment(): void {
    const text = this.commentText().trim();
    const target = this.commentTarget();
    if (!text || !target) return;

    this.comments.add(this.demoSlug(), target, text);
    this.commentText.set('');
    this.commentTarget.set(null);
  }

  get demoComments() {
    return this.comments.getForDemo(this.demoSlug());
  }

  private setupListeners(): void {
    this.hoverListener = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target === this.demoArea?.nativeElement) return;

      if (this.activeMode() === 'inspect') {
        this.clearHighlight();
        this.highlightedEl = target;
        target.style.outline = '2px solid var(--brand-primary-background-default)';
        target.style.outlineOffset = '1px';
        this.inspect.inspect(target);
      }

      if (this.activeMode() === 'comment') {
        this.clearHighlight();
        this.highlightedEl = target;
        target.style.outline = '2px dashed var(--color-warning-500)';
        target.style.outlineOffset = '1px';
      }
    };

    this.clickListener = (e: MouseEvent) => {
      if (this.activeMode() === 'comment') {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const selector = this.buildSelector(target);
        this.commentTarget.set(selector);
      }
    };

    // Delay to ensure demoArea is rendered
    setTimeout(() => {
      const area = this.demoArea?.nativeElement;
      if (area) {
        area.addEventListener('mouseover', this.hoverListener!);
        area.addEventListener('click', this.clickListener!, true);
        area.addEventListener('mouseleave', () => {
          this.clearHighlight();
          this.inspect.clear();
        });
      }
    }, 100);
  }

  private teardownListeners(): void {
    const area = this.demoArea?.nativeElement;
    if (area && this.hoverListener) {
      area.removeEventListener('mouseover', this.hoverListener);
    }
    if (area && this.clickListener) {
      area.removeEventListener('click', this.clickListener, true);
    }
    this.clearHighlight();
  }

  private clearHighlight(): void {
    if (this.highlightedEl) {
      this.highlightedEl.style.outline = '';
      this.highlightedEl.style.outlineOffset = '';
      this.highlightedEl = null;
    }
  }

  private buildSelector(el: HTMLElement): string {
    const parts: string[] = [];
    let current: HTMLElement | null = el;
    let depth = 0;
    while (current && depth < 3) {
      let part = current.tagName.toLowerCase();
      if (current.classList.length > 0) {
        part += '.' + Array.from(current.classList).slice(0, 2).join('.');
      }
      parts.unshift(part);
      current = current.parentElement;
      depth++;
    }
    return parts.join(' > ');
  }
}
