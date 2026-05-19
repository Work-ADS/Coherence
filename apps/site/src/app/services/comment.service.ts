import { Injectable, signal } from '@angular/core';

export interface DemoComment {
  id: string;
  demoSlug: string;
  elementSelector: string;
  text: string;
  author: string;
  timestamp: number;
  resolved: boolean;
}

/**
 * Manages comments on demo elements.
 * Currently localStorage — will migrate to Firebase Firestore.
 */
@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly STORAGE_KEY = 'coherence-demo-comments';

  readonly comments = signal<DemoComment[]>(this.load());
  readonly isActive = signal(false);

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

  getForElement(slug: string, selector: string): DemoComment[] {
    return this.comments().filter(
      (c) => c.demoSlug === slug && c.elementSelector === selector && !c.resolved,
    );
  }

  add(slug: string, selector: string, text: string, author = 'Anonymous'): void {
    const comment: DemoComment = {
      id: crypto.randomUUID(),
      demoSlug: slug,
      elementSelector: selector,
      text,
      author,
      timestamp: Date.now(),
      resolved: false,
    };
    const updated = [...this.comments(), comment];
    this.comments.set(updated);
    this.save(updated);
  }

  resolve(id: string): void {
    const updated = this.comments().map((c) =>
      c.id === id ? { ...c, resolved: true } : c,
    );
    this.comments.set(updated);
    this.save(updated);
  }

  delete(id: string): void {
    const updated = this.comments().filter((c) => c.id !== id);
    this.comments.set(updated);
    this.save(updated);
  }

  private load(): DemoComment[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
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
