/**
 * Floating panel: the one place a layer anchored to a trigger is portalled,
 * positioned and kept in place. Select, MultiSelect and Tooltip use it instead
 * of each hand-rolling `appendChild` + `getBoundingClientRect`.
 *
 * The consumer renders the panel in its own template (so Angular still owns
 * it) and calls `attach` once it exists; `detach` hands it back.
 *
 * Portal target: the open `<dialog>` the anchor sits in, else `document.body`.
 * A modal dialog lives in the browser's top layer, which no z-index can beat,
 * so a panel parked on `body` would paint behind it. Body is also the escape
 * from ancestors with `transform`, which would otherwise capture `fixed`.
 *
 * The panel's own CSS supplies `position: fixed`, `z-index` (a `--z-*` token)
 * and a vertical `margin-block` (the gap to the anchor); this reads the margin
 * rather than mirroring it. It also gets `--floating-anchor-width` so a panel
 * can ask for `min-inline-size` of at least the trigger.
 */

export type FloatingSide = 'top' | 'bottom' | 'left' | 'right';
export type FloatingAlign = 'start' | 'center' | 'end';

export interface FloatingPanelOptions {
  /** Side of the anchor the panel prefers; flips to the other when it does not fit. Default `bottom`. */
  side?: FloatingSide;
  /** Alignment along the anchor's edge. Default `start`. */
  align?: FloatingAlign;
  /** Called on a mousedown outside both the panel and the anchor. */
  onOutside?: (event: MouseEvent) => void;
}

/** Closest the panel may come to the viewport edge (mirrors `--space-xs`). */
const VIEWPORT_PADDING = 8;

export class FloatingPanel {
  private panel: HTMLElement | null = null;
  private anchor: HTMLElement | null = null;
  private marker: Comment | null = null;
  private options: FloatingPanelOptions = {};

  /** Moves `panel` to the portal target and starts following `anchor`. Safe to call again to change options. */
  attach(panel: HTMLElement, anchor: HTMLElement, options: FloatingPanelOptions = {}): void {
    if (this.panel !== panel) this.detach();
    this.panel = panel;
    this.anchor = anchor;
    this.options = options;

    const dialog = anchor.closest('dialog');
    const target: HTMLElement = dialog && dialog.open ? dialog : document.body;
    if (panel.parentElement !== target) {
      this.marker ??= document.createComment('floating-panel');
      panel.parentNode?.insertBefore(this.marker, panel);
      target.appendChild(panel);
    }

    document.addEventListener('scroll', this.onScroll, true);
    window.addEventListener('resize', this.update);
    document.addEventListener('mousedown', this.onMouseDown, true);
    this.update();
  }

  /** Recomputes the position from the anchor's current rect. */
  readonly update = (): void => {
    const { panel, anchor } = this;
    if (!panel || !anchor) return;
    const a = anchor.getBoundingClientRect();
    panel.style.setProperty('--floating-anchor-width', `${a.width}px`);
    const p = panel.getBoundingClientRect();
    const cs = getComputedStyle(panel);
    const gapY = parseFloat(cs.marginTop) || 0;
    const gapX = parseFloat(cs.marginLeft) || 0;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const pad = VIEWPORT_PADDING;
    const side = this.options.side ?? 'bottom';
    const align = this.options.align ?? 'start';

    let top: number;
    let left: number;
    if (side === 'bottom' || side === 'top') {
      const below = a.bottom + gapY;
      const above = a.top - gapY - p.height;
      const fitsBelow = below + p.height <= vh - pad;
      const fitsAbove = above >= pad;
      // Preferred side if it fits, else the other if it fits, else whichever has more room
      // (the clamp below trims the panel into the viewport).
      const preferBelow = side === 'bottom';
      const placeBelow = preferBelow
        ? fitsBelow || (!fitsAbove && vh - a.bottom >= a.top)
        : !fitsAbove && (fitsBelow || vh - a.bottom >= a.top);
      top = placeBelow ? below : above;
      left = align === 'start' ? a.left : align === 'end' ? a.right - p.width : a.left + a.width / 2 - p.width / 2;
    } else {
      const after = a.right + gapX;
      const before = a.left - gapX - p.width;
      const fitsAfter = after + p.width <= vw - pad;
      const fitsBefore = before >= pad;
      const placeAfter = side === 'right' ? fitsAfter || !fitsBefore : !fitsBefore && fitsAfter;
      left = placeAfter ? after : before;
      top = align === 'start' ? a.top : align === 'end' ? a.bottom - p.height : a.top + a.height / 2 - p.height / 2;
    }
    top = Math.min(Math.max(top, pad), Math.max(pad, vh - pad - p.height));
    left = Math.min(Math.max(left, pad), Math.max(pad, vw - pad - p.width));
    panel.style.top = `${top - gapY}px`;
    panel.style.left = `${left - gapX}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
  };

  /** Stops following and puts the panel back where it was rendered. */
  detach(): void {
    document.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('resize', this.update);
    document.removeEventListener('mousedown', this.onMouseDown, true);
    // Angular may already have removed the panel (the consumer's @if closed); only a live one goes back.
    if (this.panel?.isConnected && this.marker?.parentNode) {
      this.marker.parentNode.insertBefore(this.panel, this.marker);
    }
    this.marker?.remove();
    this.marker = null;
    this.panel = null;
    this.anchor = null;
  }

  // Scrolling inside the panel's own list never moves the anchor; any other scroll might.
  private readonly onScroll = (event: Event): void => {
    const target = event.target as Node | null;
    if (target && this.panel && this.panel.contains(target)) return;
    this.update();
  };

  private readonly onMouseDown = (event: MouseEvent): void => {
    const target = event.target as Node | null;
    if (!target || !this.options.onOutside) return;
    if (this.panel?.contains(target) || this.anchor?.contains(target)) return;
    this.options.onOutside(event);
  };
}
