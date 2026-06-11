import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

/**
 * Binds a Cmd/Ctrl + key keyboard shortcut to a host element. When the
 * shortcut fires, the directive `event.preventDefault()`s the browser's
 * default (e.g. Cmd+A → Select-All) and synthesizes a click on the host.
 *
 * Usage:
 *
 *   <afi-button siteKeyShortcut="a" (clicked)="open()">
 *     + Añadir patrimonio
 *     <afi-kbd [keys]="['⌘', 'A']" size="sm" />
 *   </afi-button>
 *
 * The directive listens at `document` level so the shortcut works no matter
 * where the user has focus on the page.
 */
@Directive({
  selector: '[siteKeyShortcut]',
  standalone: true,
})
export class KeyShortcutDirective {
  /** Single-character key (case-insensitive). e.g. "a", "s", "n". */
  readonly siteKeyShortcut = input.required<string>();

  /** Disable the binding without removing the directive. */
  readonly siteKeyShortcutDisabled = input<boolean>(false);

  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.siteKeyShortcutDisabled()) return;

    const meta = event.metaKey || event.ctrlKey;
    if (!meta) return;

    if (event.key.toLowerCase() !== this.siteKeyShortcut().toLowerCase()) {
      return;
    }

    // Don't hijack the shortcut while the user is typing in a form field.
    const target = event.target as HTMLElement | null;
    if (target) {
      const tag = target.tagName;
      const isTextEntry =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable;
      if (isTextEntry) return;
    }

    event.preventDefault();

    // Look for a native <button> inside the host (afi-button's inner button,
    // etc.) and trigger it; fall back to the host itself if none found.
    // Using .click() — not dispatchEvent — lets Angular's NgZone observe the
    // call so OnPush parents re-render.
    const host = this.el.nativeElement;
    const innerBtn = host.querySelector('button') as HTMLButtonElement | null;
    if (innerBtn) {
      innerBtn.click();
    } else if (typeof (host as HTMLElement).click === 'function') {
      (host as HTMLElement).click();
    } else {
      host.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  }
}
