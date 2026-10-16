import type { ElementRef } from '@angular/core';

/**
 * FocusField: the canonical "jump to field" for focus the product moves
 * (a failed Guardar in a drawer or modal, a notice that points at a field).
 *
 * The focus ring is :focus-visible only, so a jump made after a mouse click
 * lands with no visible ring on most controls. `focusField` closes that gap:
 * it resolves the target, scrolls it inside its own scroll container (never
 * the page behind an overlay), focuses it without the browser's own scroll
 * jump, and marks the control's painted box with the ring until blur.
 *
 * Needs the global ring styles in `focus-field/_focus-field.scss`.
 */

export type FocusFieldTarget = HTMLElement | ElementRef<HTMLElement> | string | null | undefined;

export interface FocusFieldOptions {
  /** How the field is brought into view: 'center' (default), 'nearest' (only if out of view, with a small margin) or 'none'. */
  scroll?: 'center' | 'nearest' | 'none';
  /** The scroll container. Default: the nearest scrolling ancestor, else the page. */
  container?: HTMLElement | ElementRef<HTMLElement> | null;
  /** Play the 300ms ring settle. Default true; never plays under prefers-reduced-motion. */
  highlight?: boolean;
}

const FOCUSABLE =
  'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), ' +
  'button:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * Painted boxes that are not the focused element itself. A plain input, the
 * select and multi-select triggers, the switch track and segmented buttons
 * draw their own ring, so they are not listed; the native checkbox and radio
 * are visually hidden and the box next to them is what the user sees.
 */
const BOXES = '.afi-input__shell, .afi-search, .afi-check__box, .afi-radio__ring';

// Scroll margin: mirrors --space-lg (24px); a runtime constant, not a style.
const SCROLL_PAD = 24;
// Cleanup timer for the ring settle: --duration-slow (300ms) plus a little slack.
const SETTLE_MS = 320;

const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toElement(target: FocusFieldTarget | { current?: unknown }): HTMLElement | null {
  if (!target || typeof document === 'undefined') return null;
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target);
  if (target instanceof HTMLElement) return target;
  const native = (target as ElementRef<HTMLElement>).nativeElement;
  return native instanceof HTMLElement ? native : null;
}

function resolve(target: FocusFieldTarget): HTMLElement | null {
  let el = toElement(target);
  if (!el || !el.isConnected) return null;
  if (!el.matches(FOCUSABLE)) el = el.querySelector<HTMLElement>(FOCUSABLE) ?? el;
  return el;
}

function rendered(el: HTMLElement): boolean {
  return el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true });
}

function ringBox(el: HTMLElement): HTMLElement {
  const up = el.closest<HTMLElement>(BOXES);
  if (up) return up;
  const next = el.nextElementSibling;
  return next instanceof HTMLElement && next.matches(BOXES) ? next : el;
}

function scrollerOf(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const overflow = getComputedStyle(p).overflowY;
    if ((overflow === 'auto' || overflow === 'scroll') && p.scrollHeight > p.clientHeight) return p;
  }
  return null;
}

function scrollIntoField(el: HTMLElement, mode: 'center' | 'nearest' | 'none', container: HTMLElement | null): void {
  if (mode === 'none') return;
  // The whole field (label, control, message) is what is revealed.
  const box = el.closest<HTMLElement>('.afi-field, fieldset') ?? el;
  const scroller = container ?? scrollerOf(box);
  const r = box.getBoundingClientRect();
  const s = scroller
    ? scroller.getBoundingClientRect()
    : { top: 0, bottom: window.innerHeight, height: window.innerHeight };
  let delta = 0;
  if (mode === 'center') {
    delta = r.top + r.height / 2 - (s.top + s.height / 2);
  } else if (r.top < s.top + SCROLL_PAD) {
    delta = r.top - (s.top + SCROLL_PAD);
  } else if (r.bottom > s.bottom - SCROLL_PAD) {
    delta = Math.min(r.bottom - (s.bottom - SCROLL_PAD), r.top - (s.top + SCROLL_PAD));
  }
  if (Math.abs(delta) < 1) return;
  const behavior: ScrollBehavior = reducedMotion() ? 'auto' : 'smooth';
  if (scroller) scroller.scrollBy({ top: delta, behavior });
  else window.scrollBy({ top: delta, behavior });
}

function clearRing(box: Element): void {
  box.removeAttribute('data-afi-jump');
  box.removeAttribute('data-afi-jump-tone');
  box.removeAttribute('data-afi-jump-play');
}

/**
 * Move focus to a field the product chose. Returns true when focus landed;
 * a missing, hidden or disabled target returns false and nothing moves.
 */
export function focusField(target: FocusFieldTarget, opts: FocusFieldOptions = {}): boolean {
  const { scroll = 'center', container, highlight = true } = opts;
  const el = resolve(target);
  if (!el || !rendered(el) || el.matches(':disabled') || el.getAttribute('aria-disabled') === 'true') {
    return false;
  }
  scrollIntoField(el, scroll, toElement(container));
  el.focus({ preventScroll: true, focusVisible: true } as FocusOptions);
  if (document.activeElement !== el) return false;

  // One ring at a time, even when a blur never fired (a document without focus).
  document.querySelectorAll('[data-afi-jump]').forEach(clearRing);
  const box = ringBox(el);
  box.setAttribute('data-afi-jump', '');
  if (el.getAttribute('aria-invalid') === 'true') box.setAttribute('data-afi-jump-tone', 'error');
  if (highlight && !reducedMotion()) {
    box.removeAttribute('data-afi-jump-play');
    void box.offsetWidth; // restart the settle if it is already playing
    box.setAttribute('data-afi-jump-play', '');
    setTimeout(() => box.removeAttribute('data-afi-jump-play'), SETTLE_MS);
  }
  const clear = (): void => {
    clearRing(box);
    el.removeEventListener('blur', clear);
  };
  el.addEventListener('blur', clear);
  return true;
}

/**
 * Focus the first `aria-invalid="true"` field inside `root` (default: the open
 * modal, else the open drawer, else the document), scrolling inside the
 * overlay body. Call it after the error messages have rendered.
 */
export function focusFirstInvalid(root?: FocusFieldTarget, opts: FocusFieldOptions = {}): boolean {
  if (typeof document === 'undefined') return false;
  const scope =
    toElement(root) ??
    document.querySelector<HTMLElement>('dialog[open]') ??
    document.querySelector<HTMLElement>('.afi-drawer__panel') ??
    document.body;
  const body = scope.querySelector<HTMLElement>('.afi-modal__body, .afi-drawer__body');
  const invalid = Array.from(scope.querySelectorAll<HTMLElement>('[aria-invalid="true"]'));
  return invalid.some((el) =>
    focusField(el, { scroll: 'center', container: body?.contains(el) ? body : undefined, ...opts }),
  );
}

/** Namespace entry: `FocusField.focus(target, opts)`, `FocusField.firstInvalid(root, opts)`. */
export const FocusField = { focus: focusField, firstInvalid: focusFirstInvalid };
