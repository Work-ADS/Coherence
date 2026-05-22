import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  SegmentedControlComponent,
  TooltipComponent,
} from '@coherence/ui';

import { CommentComposerComponent, ComposerSubmit } from '../../../components/comment-composer';
import { CommentPinComponent } from '../../../components/comment-pin';
import { ConfirmActionComponent } from '../../../components/confirm-action';
import { InspectService } from '../../../services/inspect.service';
import {
  CommentService,
  DemoComment,
  RelativePos,
} from '../../../services/comment.service';

const MODE_KEY = 'coherence-demo-panel-mode';
const WIDTH_KEY = 'coherence-demo-panel-width';
const FLOAT_KEY = 'coherence-demo-panel-float';
const MIN_WIDTH = 280;
const MAX_WIDTH = 600;
const SNAP_PX = 60;

export type PanelMode = 'docked-left' | 'docked-right' | 'floating';

interface FloatPos {
  top: number;
  left: number;
}

interface ViewportOption {
  value: string;
  label: string;
  width: number | null;
}

const VIEWPORTS: ViewportOption[] = [
  { value: 'full', label: 'Full', width: null },
  { value: '1280', label: '1280', width: 1280 },
  { value: '768', label: '768', width: 768 },
  { value: '375', label: '375', width: 375 },
];

interface PinPos {
  comment: DemoComment;
  x: number;
  y: number;
}

@Component({
  selector: 'site-demo-shell',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    SegmentedControlComponent,
    TooltipComponent,
    CommentComposerComponent,
    CommentPinComponent,
    ConfirmActionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-shell.component.html',
  styleUrl: './demo-shell.component.scss',
})
export class DemoShellComponent implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  readonly inspect = inject(InspectService);
  readonly comments = inject(CommentService);

  readonly activeMode = signal<'inspect' | 'comment' | null>(null);
  readonly demoSlug = signal('wealth-planner');
  readonly demoRoute = signal('/demos/wealth-planner-2026/demo');

  readonly activeView = signal(0);
  readonly views = signal<string[]>(['Patrimonio', 'Evolución']);

  readonly viewOptions = computed(() =>
    this.views().map((label, i) => ({ value: String(i), label })),
  );
  readonly activeViewValue = computed(() => String(this.activeView()));
  readonly currentViewLabel = computed(() => this.views()[this.activeView()] ?? 'default');

  readonly viewportPresets = VIEWPORTS;
  readonly viewportValue = signal('full');
  readonly viewportWidth = computed(() => {
    const preset = VIEWPORTS.find((v) => v.value === this.viewportValue());
    return preset?.width ?? null;
  });

  readonly composerAnchor = signal<HTMLElement | null>(null);
  readonly composerSelector = signal('');

  readonly activeCommentId = signal<string | null>(null);

  readonly panelMode = signal<PanelMode>(this.loadMode());
  readonly panelWidth = signal<number>(this.loadWidth());
  readonly panelFloatPos = signal<FloatPos>(this.loadFloat());
  readonly isDragging = signal(false);

  readonly editingId = signal<string | null>(null);
  readonly editingText = signal('');

  readonly deleteConfirmAnchor = signal<HTMLElement | null>(null);
  readonly deleteConfirmId = signal<string | null>(null);

  readonly clearDemoAnchor = signal<HTMLElement | null>(null);

  readonly copiedToken = signal<string | null>(null);
  readonly copiedList = signal(false);

  readonly demoCommentCount = computed(
    () => this.comments.getForDemo(this.demoSlug()).length,
  );

  readonly viewComments = computed(() =>
    this.comments.getForView(this.demoSlug(), this.activeView()),
  );

  private readonly pinTick = signal(0);

  readonly pins = computed<PinPos[]>(() => {
    this.pinTick();
    const list = this.viewComments();
    const area = this.demoArea?.nativeElement;
    if (!area) return [];
    const areaRect = area.getBoundingClientRect();
    const scrollW = area.scrollWidth || areaRect.width;
    const scrollH = area.scrollHeight || areaRect.height;

    return list.map((comment) => {
      let x = 0;
      let y = 0;
      try {
        const el = area.querySelector(comment.elementSelector) as HTMLElement | null;
        if (el) {
          const r = el.getBoundingClientRect();
          x = r.right - areaRect.left + area.scrollLeft - 4;
          y = r.top - areaRect.top + area.scrollTop + 4;
        } else if (comment.relativePos) {
          x = comment.relativePos.xPct * scrollW;
          y = comment.relativePos.yPct * scrollH;
        }
      } catch {
        if (comment.relativePos) {
          x = comment.relativePos.xPct * scrollW;
          y = comment.relativePos.yPct * scrollH;
        }
      }
      return { comment, x, y };
    });
  });

  @ViewChild('demoArea') demoArea!: ElementRef<HTMLElement>;

  private hoverListener: ((e: MouseEvent) => void) | null = null;
  private clickListener: ((e: MouseEvent) => void) | null = null;
  private leaveListener: (() => void) | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private highlightedEl: HTMLElement | null = null;
  private pinnedEl: HTMLElement | null = null;

  constructor() {
    effect(() => {
      this.viewportValue();
      this.activeView();
      this.viewComments();
      this.panelWidth();
      this.panelMode();
      this.panelFloatPos();
      queueMicrotask(() => this.pinTick.update((v) => v + 1));
    });

    effect(() => {
      const mode = this.panelMode();
      const width = this.panelWidth();
      const float = this.panelFloatPos();
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(MODE_KEY, mode);
        localStorage.setItem(WIDTH_KEY, String(width));
        localStorage.setItem(FLOAT_KEY, JSON.stringify(float));
      } catch {
        // storage disabled
      }
    });
  }

  private loadMode(): PanelMode {
    if (typeof window === 'undefined') return 'docked-right';
    try {
      const v = localStorage.getItem(MODE_KEY);
      if (v === 'docked-left' || v === 'docked-right' || v === 'floating') return v;
      const legacy = localStorage.getItem('coherence-demo-panel-dock');
      if (legacy === 'left') return 'docked-left';
      if (legacy === 'right') return 'docked-right';
    } catch {
      // ignore
    }
    return 'docked-right';
  }

  private loadWidth(): number {
    if (typeof window === 'undefined') return 400;
    try {
      const v = Number(localStorage.getItem(WIDTH_KEY) ?? '');
      if (!Number.isNaN(v) && v >= MIN_WIDTH && v <= MAX_WIDTH) return v;
    } catch {
      // ignore
    }
    return 400;
  }

  private loadFloat(): FloatPos {
    if (typeof window === 'undefined') return { top: 96, left: 240 };
    try {
      const raw = localStorage.getItem(FLOAT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FloatPos>;
        if (typeof parsed.top === 'number' && typeof parsed.left === 'number') {
          return { top: parsed.top, left: parsed.left };
        }
      }
    } catch {
      // ignore
    }
    return { top: 96, left: 240 };
  }

  setMode(mode: PanelMode): void {
    if (mode === 'floating' && this.panelMode() !== 'floating') {
      const width = this.panelWidth();
      const desiredLeft = Math.max(
        16,
        Math.min(window.innerWidth - width - 16, window.innerWidth / 2 - width / 2),
      );
      this.panelFloatPos.set({ top: 96, left: desiredLeft });
    }
    this.panelMode.set(mode);
  }

  startResize(event: PointerEvent): void {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = this.panelWidth();
    const mode = this.panelMode();
    const target = event.target as HTMLElement | null;
    try {
      target?.setPointerCapture?.(event.pointerId);
    } catch {
      // ignore
    }

    const move = (e: PointerEvent) => {
      const delta =
        mode === 'docked-right'
          ? startX - e.clientX
          : mode === 'docked-left'
            ? e.clientX - startX
            : e.clientX - startX;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta));
      this.panelWidth.set(next);
    };

    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  startDrag(event: PointerEvent): void {
    if (this.panelMode() !== 'floating') return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, textarea, [role="button"]')) return;
    event.preventDefault();

    const start = this.panelFloatPos();
    const startX = event.clientX;
    const startY = event.clientY;
    this.isDragging.set(true);

    const move = (e: PointerEvent) => {
      const nextTop = Math.max(0, start.top + (e.clientY - startY));
      const nextLeft = Math.max(
        -(this.panelWidth() - 80),
        Math.min(window.innerWidth - 80, start.left + (e.clientX - startX)),
      );
      this.panelFloatPos.set({ top: nextTop, left: nextLeft });
    };

    const up = (e: PointerEvent) => {
      this.isDragging.set(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);

      const pos = this.panelFloatPos();
      if (pos.left <= SNAP_PX) {
        this.setMode('docked-left');
      } else if (pos.left + this.panelWidth() >= window.innerWidth - SNAP_PX) {
        this.setMode('docked-right');
      }
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
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
    if (id && text) this.comments.update(id, text);
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingText.set('');
  }

  askDelete(id: string, anchorEvent: Event): void {
    const anchor = anchorEvent.currentTarget as HTMLElement | null;
    if (!anchor) return;
    this.deleteConfirmAnchor.set(anchor);
    this.deleteConfirmId.set(id);
  }

  confirmDelete(): void {
    const id = this.deleteConfirmId();
    if (id) {
      this.comments.delete(id);
      if (this.activeCommentId() === id) this.activeCommentId.set(null);
    }
    this.cancelDelete();
    setTimeout(() => this.pinTick.update((v) => v + 1), 0);
  }

  cancelDelete(): void {
    this.deleteConfirmAnchor.set(null);
    this.deleteConfirmId.set(null);
  }

  askClearDemo(event: Event): void {
    const anchor = event.currentTarget as HTMLElement | null;
    if (!anchor) return;
    this.clearDemoAnchor.set(anchor);
  }

  confirmClearDemo(): void {
    this.comments.clearForDemo(this.demoSlug());
    this.clearDemoAnchor.set(null);
    this.activeCommentId.set(null);
    setTimeout(() => this.pinTick.update((v) => v + 1), 0);
  }

  cancelClearDemo(): void {
    this.clearDemoAnchor.set(null);
  }

  copyToken(token: string): void {
    if (!navigator?.clipboard) return;
    navigator.clipboard
      .writeText(token)
      .then(() => {
        this.copiedToken.set(token);
        setTimeout(() => {
          if (this.copiedToken() === token) this.copiedToken.set(null);
        }, 1200);
      })
      .catch(() => {});
  }

  copyInspectList(): void {
    const md = this.inspect.exportCurrentMarkdown();
    if (!md || !navigator?.clipboard) return;
    navigator.clipboard
      .writeText(md)
      .then(() => {
        this.copiedList.set(true);
        setTimeout(() => this.copiedList.set(false), 1200);
      })
      .catch(() => {});
  }

  ngAfterViewInit(): void {
    this.setupListeners();
    queueMicrotask(() => this.pinTick.update((v) => v + 1));
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
      this.clearPinned();
    } else {
      this.activeMode.set('inspect');
      this.inspect.activate();
      this.comments.deactivate();
      this.closeComposer();
    }
  }

  toggleComment(): void {
    if (this.activeMode() === 'comment') {
      this.activeMode.set(null);
      this.comments.deactivate();
      this.closeComposer();
    } else {
      this.activeMode.set('comment');
      this.comments.activate();
      this.inspect.deactivate();
      this.clearPinned();
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  restart(): void {
    const current = this.activeView();
    this.activeView.set(-1);
    setTimeout(() => this.activeView.set(current), 0);
  }

  setView(value: string): void {
    const next = Number(value);
    if (!Number.isNaN(next)) {
      this.activeView.set(next);
      this.closeComposer();
      this.activeCommentId.set(null);
    }
  }

  setViewport(value: string): void {
    this.viewportValue.set(value);
    this.closeComposer();
  }

  onComposerSubmit(payload: ComposerSubmit): void {
    const target = this.composerAnchor();
    const selector = this.composerSelector();
    if (!target || !selector) return;

    const relPos = this.computeRelativePos(target);
    const added = this.comments.add(
      this.demoSlug(),
      this.demoRoute(),
      { index: this.activeView(), label: this.currentViewLabel() },
      selector,
      relPos,
      payload.text,
    );
    this.closeComposer();
    this.activeCommentId.set(added.id);
    setTimeout(() => this.pinTick.update((v) => v + 1), 0);
  }

  onComposerCancel(): void {
    this.closeComposer();
  }

  onPinActivated(id: string): void {
    this.activeCommentId.set(id);
    if (this.activeMode() !== 'comment') {
      this.activeMode.set('comment');
      this.comments.activate();
      this.inspect.deactivate();
    }
    setTimeout(() => {
      const el = document.querySelector(`[data-comment-id="${id}"]`);
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 50);
  }

  resolveComment(id: string): void {
    this.comments.resolve(id);
    if (this.activeCommentId() === id) {
      this.activeCommentId.set(null);
    }
    setTimeout(() => this.pinTick.update((v) => v + 1), 0);
  }

  downloadMarkdown(): void {
    this.comments.downloadMarkdown();
  }

  private closeComposer(): void {
    this.composerAnchor.set(null);
    this.composerSelector.set('');
  }

  private computeRelativePos(el: HTMLElement): RelativePos | null {
    const area = this.demoArea?.nativeElement;
    if (!area) return null;
    const areaRect = area.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const scrollW = area.scrollWidth || areaRect.width;
    const scrollH = area.scrollHeight || areaRect.height;
    if (!scrollW || !scrollH) return null;
    return {
      xPct: (r.right - areaRect.left + area.scrollLeft - 4) / scrollW,
      yPct: (r.top - areaRect.top + area.scrollTop + 4) / scrollH,
    };
  }

  private setupListeners(): void {
    this.hoverListener = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target === this.demoArea?.nativeElement) return;
      if (this.activeMode() === null) return;
      if (target.closest('.pin-layer')) return;

      this.clearHoverHighlight();
      if (target === this.pinnedEl) return;

      this.highlightedEl = target;
      if (this.activeMode() === 'inspect') {
        target.classList.add('demo-shell-highlight-inspect');
      } else if (this.activeMode() === 'comment') {
        target.classList.add('demo-shell-highlight-comment');
      }
    };

    this.clickListener = (e: MouseEvent) => {
      if (this.activeMode() === null) return;
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest('.pin-layer') || target.closest('site-comment-composer')) return;

      e.preventDefault();
      e.stopPropagation();

      if (this.activeMode() === 'inspect') {
        this.pinElement(target, 'inspect');
        this.inspect.inspect(target);
      } else if (this.activeMode() === 'comment') {
        const selector = this.buildSelector(target);
        this.pinElement(target, 'comment');
        this.zone.run(() => {
          this.composerSelector.set(selector);
          this.composerAnchor.set(target);
        });
      }
    };

    this.leaveListener = () => {
      this.clearHoverHighlight();
    };

    this.scrollListener = () => {
      this.pinTick.update((v) => v + 1);
    };

    setTimeout(() => {
      const area = this.demoArea?.nativeElement;
      if (area) {
        area.addEventListener('mouseover', this.hoverListener!);
        area.addEventListener('click', this.clickListener!, true);
        area.addEventListener('mouseleave', this.leaveListener!);
        area.addEventListener('scroll', this.scrollListener!, true);
        if (typeof ResizeObserver !== 'undefined') {
          this.resizeObserver = new ResizeObserver(() => {
            this.pinTick.update((v) => v + 1);
          });
          this.resizeObserver.observe(area);
        }
      }
      window.addEventListener('resize', this.scrollListener!);
    }, 100);
  }

  private teardownListeners(): void {
    const area = this.demoArea?.nativeElement;
    if (area) {
      if (this.hoverListener) area.removeEventListener('mouseover', this.hoverListener);
      if (this.clickListener) area.removeEventListener('click', this.clickListener, true);
      if (this.leaveListener) area.removeEventListener('mouseleave', this.leaveListener);
      if (this.scrollListener) area.removeEventListener('scroll', this.scrollListener, true);
    }
    if (this.scrollListener) window.removeEventListener('resize', this.scrollListener);
    this.resizeObserver?.disconnect();
    this.clearHoverHighlight();
    this.clearPinned();
  }

  private pinElement(el: HTMLElement, mode: 'inspect' | 'comment'): void {
    this.clearPinned();
    this.clearHoverHighlight();
    this.pinnedEl = el;
    el.classList.add(
      mode === 'inspect' ? 'demo-shell-pinned-inspect' : 'demo-shell-pinned-comment',
    );
  }

  private clearHoverHighlight(): void {
    if (this.highlightedEl && this.highlightedEl !== this.pinnedEl) {
      this.highlightedEl.classList.remove(
        'demo-shell-highlight-inspect',
        'demo-shell-highlight-comment',
      );
    }
    this.highlightedEl = null;
  }

  private clearPinned(): void {
    if (this.pinnedEl) {
      this.pinnedEl.classList.remove(
        'demo-shell-pinned-inspect',
        'demo-shell-pinned-comment',
      );
      this.pinnedEl = null;
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
