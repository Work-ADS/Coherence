import { Injectable, computed, signal } from '@angular/core';

export interface RelativePos {
  xPct: number;
  yPct: number;
}

export interface DemoComment {
  id: string;
  demoSlug: string;
  demoRoute: string;
  viewIndex: number;
  viewLabel: string;
  elementSelector: string;
  relativePos: RelativePos | null;
  text: string;
  author: string;
  timestamp: number;
  resolved: boolean;
}

export interface CommentView {
  index: number;
  label: string;
}

const DEMO_LABELS: Record<string, string> = {
  'wealth-planner': 'Wealth Planner',
};

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly STORAGE_KEY = 'coherence-demo-comments';

  readonly comments = signal<DemoComment[]>(this.load());
  readonly isActive = signal(false);

  readonly openCount = computed(
    () => this.comments().filter((c) => !c.resolved).length,
  );

  activate(): void {
    this.isActive.set(true);
  }

  deactivate(): void {
    this.isActive.set(false);
  }

  toggle(): void {
    this.isActive.set(!this.isActive());
  }

  getForDemo(slug: string): DemoComment[] {
    return this.comments().filter((c) => c.demoSlug === slug && !c.resolved);
  }

  getForView(slug: string, viewIndex: number): DemoComment[] {
    return this.comments().filter(
      (c) => c.demoSlug === slug && c.viewIndex === viewIndex && !c.resolved,
    );
  }

  getForElement(slug: string, viewIndex: number, selector: string): DemoComment[] {
    return this.comments().filter(
      (c) =>
        c.demoSlug === slug &&
        c.viewIndex === viewIndex &&
        c.elementSelector === selector &&
        !c.resolved,
    );
  }

  getAll(): DemoComment[] {
    return this.comments().filter((c) => !c.resolved);
  }

  add(
    slug: string,
    demoRoute: string,
    view: CommentView,
    selector: string,
    relativePos: RelativePos | null,
    text: string,
    author = 'Anonymous',
  ): DemoComment {
    const comment: DemoComment = {
      id: crypto.randomUUID(),
      demoSlug: slug,
      demoRoute,
      viewIndex: view.index,
      viewLabel: view.label,
      elementSelector: selector,
      relativePos,
      text,
      author,
      timestamp: Date.now(),
      resolved: false,
    };
    const updated = [...this.comments(), comment];
    this.comments.set(updated);
    this.save(updated);
    return comment;
  }

  resolve(id: string): void {
    const updated = this.comments().map((c) =>
      c.id === id ? { ...c, resolved: true } : c,
    );
    this.comments.set(updated);
    this.save(updated);
  }

  update(id: string, text: string): void {
    const trimmed = text.trim();
    if (!trimmed) return;
    const updated = this.comments().map((c) =>
      c.id === id ? { ...c, text: trimmed } : c,
    );
    this.comments.set(updated);
    this.save(updated);
  }

  delete(id: string): void {
    const updated = this.comments().filter((c) => c.id !== id);
    this.comments.set(updated);
    this.save(updated);
  }

  clearAll(): void {
    this.comments.set([]);
    this.save([]);
  }

  clearForDemo(slug: string): void {
    const updated = this.comments().filter((c) => c.demoSlug !== slug);
    this.comments.set(updated);
    this.save(updated);
  }

  buildExportFilename(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp =
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
    return `coherence-feedback-${stamp}.md`;
  }

  downloadMarkdown(): void {
    if (typeof window === 'undefined') return;
    const md = this.exportMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.buildExportFilename();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  exportMarkdown(): string {
    const open = this.getAll();
    const lines: string[] = [];
    const stamp = new Date().toISOString();

    lines.push('# Coherence DS — Feedback Export');
    lines.push(`Generated: ${stamp}`);
    lines.push('');

    if (open.length === 0) {
      lines.push('_Sin comentarios pendientes._');
      return lines.join('\n');
    }

    const byDemo = new Map<string, DemoComment[]>();
    for (const c of open) {
      const arr = byDemo.get(c.demoSlug) ?? [];
      arr.push(c);
      byDemo.set(c.demoSlug, arr);
    }

    for (const [slug, demoComments] of byDemo) {
      const label = DEMO_LABELS[slug] ?? slug;
      const route = demoComments[0]!.demoRoute;
      lines.push(`## ${label} (\`${route}\`)`);
      lines.push('');

      const byView = new Map<number, DemoComment[]>();
      for (const c of demoComments) {
        const arr = byView.get(c.viewIndex) ?? [];
        arr.push(c);
        byView.set(c.viewIndex, arr);
      }

      const sortedViews = Array.from(byView.entries()).sort(([a], [b]) => a - b);
      for (const [viewIndex, viewComments] of sortedViews) {
        const viewLabel = viewComments[0]!.viewLabel;
        lines.push(`### ${viewLabel} (vista ${viewIndex})`);
        lines.push('');

        viewComments.sort((a, b) => a.timestamp - b.timestamp);
        viewComments.forEach((c, i) => {
          const when = new Date(c.timestamp).toISOString();
          lines.push(`${i + 1}. **\`${c.elementSelector}\`** — _${c.author}, ${when}_`);
          for (const para of c.text.split('\n')) {
            lines.push(`   > ${para}`);
          }
          lines.push('');
        });
      }
    }

    return lines.join('\n').trimEnd() + '\n';
  }

  private load(): DemoComment[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Partial<DemoComment>[];
      return parsed.map((c) => ({
        id: c.id ?? crypto.randomUUID(),
        demoSlug: c.demoSlug ?? 'unknown',
        demoRoute: c.demoRoute ?? `/demos/${c.demoSlug ?? ''}`,
        viewIndex: c.viewIndex ?? 0,
        viewLabel: c.viewLabel ?? 'default',
        elementSelector: c.elementSelector ?? '',
        relativePos: c.relativePos ?? null,
        text: c.text ?? '',
        author: c.author ?? 'Anonymous',
        timestamp: c.timestamp ?? Date.now(),
        resolved: c.resolved ?? false,
      }));
    } catch {
      return [];
    }
  }

  private save(comments: DemoComment[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // Storage full or disabled
    }
  }
}
