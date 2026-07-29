import {
  Directive,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  input,
} from '@angular/core';

import { LanguageService } from '../services/language.service';

/**
 * HyperText — a "decode" text animation ported from MagicUI (magicui.design,
 * a React/Framer-Motion library) to a framework-agnostic Angular directive.
 * Each visible character scrambles through random letters, then resolves
 * left-to-right to the real text over a fixed duration.
 *
 * Usage — drop the bare attribute on any text element:
 *
 *   <h1 siteHyperText>Some heading</h1>
 *
 * Blur travels WITH the resolve front (animate-ui hero headline feel): a small
 * band of characters just ahead of the front carries a per-character blur that
 * tapers to sharp at both edges, so the boundary reads as a moving band rather
 * than a uniform whole-element blur. Characters behind the front are resolved
 * and sharp; the band recedes left-to-right and everything lands sharp when the
 * decode completes.
 *
 * Trigger: it plays when the host element mounts, but ONLY once the user has
 * actively switched language (`LanguageService.switched`). On the blog pages
 * the per-language `@if` branches re-create their headings on every toggle, so
 * mounting-after-a-switch is exactly "the user flipped ES/EN" — the effect
 * never fires as a page-load entrance.
 *
 * Hosts that are NOT re-created on a switch — a heading whose text arrives by
 * interpolation, as on the workbench — bind `[siteHyperTextReplayOn]="lang()"`
 * to get the same trigger without re-mounting. Either way the trigger is the
 * user flipping the language, never a re-render.
 *
 * Layout-stable: each character box is pinned to its final glyph's width for the
 * duration, so scramble glyphs of a different width can never re-center a line
 * or change the line count. (Large centered multi-line headings otherwise
 * re-wrap every frame and read as choppy despite a solid frame rate.)
 *
 * Structure-preserving: it wraps only text-node characters in transient
 * per-character `<span>`s (element nodes such as `<em>Liquid Glass</em>` are
 * left in place), and unwraps them back to plain text nodes on completion, so
 * the final DOM is clean. Whitespace is never scrambled or blurred. Opacity is
 * never touched — letters stay visible throughout. Respects
 * `prefers-reduced-motion` (renders the final text with no animation).
 */
@Directive({
  selector: '[siteHyperText]',
  standalone: true,
})
export class HyperTextDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly language = inject(LanguageService);
  private readonly injector = inject(Injector);

  /**
   * Width of the moving blur band, in characters. The band is a raised-cosine
   * bump that lives just AHEAD of the resolve front — 0 at the front, peak near
   * its middle, 0 again BLUR_BAND characters ahead — so only ~BLUR_BAND
   * characters ever carry a filter at once (no dozens of simultaneous blurs).
   * Being 0 at the front means the resolve boundary is continuous, never a hard
   * step. This is a pure curve-shape number (like the old BLUR_PEAK_AT), not a
   * brand value — the peak HEIGHT comes from the --motion-decode-blur token.
   */
  private static readonly BLUR_BAND = 6;
  private static readonly POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  /** easeOutCubic — decelerates toward the end so the resolve settles softly. */
  private static ease(p: number): number {
    return 1 - Math.pow(1 - p, 3);
  }

  /** One random scramble glyph from the pool. */
  private static randomChar(): string {
    return HyperTextDirective.POOL[(Math.random() * HyperTextDirective.POOL.length) | 0] ?? '';
  }

  /**
   * Read a CSS time custom property as milliseconds, UNIT-AWARE. The production
   * CSS optimizer rewrites `1150ms` to the equivalent `1.15s`, and `parseFloat`
   * is unit-naive (`parseFloat('1.15s')` === 1.15) — so without this the decode
   * runs for ~1ms in prod and looks like nothing happened. Returns NaN if unset.
   */
  private static readMs(value: string): number {
    const raw = value.trim();
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return NaN;
    if (raw.endsWith('ms')) return n;
    if (raw.endsWith('s')) return n * 1000; // seconds → ms
    return n; // unitless — assume ms
  }

  /**
   * Optional replay trigger: pass a value that changes when the decode should
   * run again — in practice the active language.
   *
   * The mount path above covers hosts that are RE-CREATED on a language switch
   * (the blog's per-language `@if` branches). A heading whose text arrives by
   * interpolation is never re-created, so it never re-mounts and the decode
   * would never fire; binding this gives those hosts the same trigger without
   * forcing them to re-mount. Leave it unbound and nothing changes.
   *
   * Still strictly user-initiated: the value only changes when the user flips
   * the language. The first render is skipped — otherwise every page load would
   * decode, which §4.10 explicitly rules out.
   */
  readonly replayOn = input<unknown>(undefined, { alias: 'siteHyperTextReplayOn' });

  private frameId = 0;
  /** Undoes the transient per-character spans; set for the duration of a run. */
  private restore: (() => void) | null = null;
  private primed = false;
  private replayToken: unknown;

  constructor() {
    afterNextRender(() => {
      this.primed = true;
      this.replayToken = this.replayOn();
      if (!this.language.switched()) return; // page load, not a toggle
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.play();
    });

    effect(() => {
      const token = this.replayOn();
      if (!this.primed || token === this.replayToken) return;
      this.replayToken = token;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      // Wait for the render to commit before snapshotting. A bare
      // requestAnimationFrame is NOT enough: Angular's own scheduler also runs
      // change detection from a frame callback, so a rAF queued here can land
      // BEFORE the interpolation has written the new text — the decode then
      // resolves back to the old language and the switch appears not to work.
      afterNextRender(() => this.play(), { injector: this.injector });
    });
  }

  /** Stop a run in flight and put the original text back. */
  private abort(): void {
    cancelAnimationFrame(this.frameId);
    this.restore?.();
    this.restore = null;
  }

  private play(): void {
    // A replay can land while a run is still in flight (toggle ES→EN→ES quickly).
    // Restore first: mid-run the DOM holds transient spans carrying SCRAMBLE
    // glyphs, and snapshotting those would decode toward gibberish and leave it
    // there.
    this.abort();

    // Snapshot the text nodes so element nodes (e.g. <em>) are left untouched.
    const textNodes: { node: Text; text: string }[] = [];
    const walker = document.createTreeWalker(this.host.nativeElement, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      textNodes.push({ node: n as Text, text: (n as Text).nodeValue ?? '' });
    }
    const total = textNodes.reduce((sum, n) => sum + n.text.length, 0);
    if (total === 0) return;

    // Deliberate, first-of-its-kind pattern for this DS: read motion TOKEN
    // VALUES into JS. v2 motion has no semantic-indirection layer, so patterns
    // consume the --motion-* primitives directly — these two ARE the tokens.
    // Read once here (not per frame). If a token is absent — e.g. the host is
    // outside the [data-foundation="modern"] scope — the parse is NaN and we
    // take the reduced-motion path (final text, no animation) with NO hardcoded
    // numeric fallback.
    const styles = getComputedStyle(this.host.nativeElement);
    const durationMs = HyperTextDirective.readMs(styles.getPropertyValue('--motion-decode-duration'));
    const blurPeak = parseFloat(styles.getPropertyValue('--motion-decode-blur'));
    if (Number.isNaN(durationMs) || Number.isNaN(blurPeak)) return; // final text already shown

    // Wrap each text-node character in its own transient <span> so the blur can
    // move per-character. Element nodes (<em>) stay put; only text nodes are
    // replaced. `groups` remembers how to restore each original text node so the
    // final DOM has no leftover spans.
    //
    // Words get an inline-block, nowrap wrapper. Character boxes are width-locked
    // below, and width-locked boxes are atomic inlines the browser may break
    // between — the wrapper keeps line breaks at spaces, never mid-word.
    const cells: { span: HTMLSpanElement; char: string; space: boolean }[] = [];
    const groups: { parent: Node; node: Text; created: HTMLSpanElement[]; text: string }[] = [];
    for (const { node, text } of textNodes) {
      const parent = node.parentNode;
      if (!parent) continue;
      const created: HTMLSpanElement[] = [];
      for (const token of text.match(/\s+|\S+/g) ?? []) {
        if (/^\s/.test(token)) {
          // Whitespace: never scrambled, left as a plain inline so it stays a
          // line-break opportunity.
          for (const char of token) {
            const span = document.createElement('span');
            span.textContent = char;
            parent.insertBefore(span, node);
            created.push(span);
            cells.push({ span, char, space: true });
          }
          continue;
        }
        const word = document.createElement('span');
        word.style.display = 'inline-block';
        word.style.whiteSpace = 'nowrap';
        for (const char of token) {
          const span = document.createElement('span');
          span.textContent = char;
          word.appendChild(span);
          cells.push({ span, char, space: false });
        }
        parent.insertBefore(word, node);
        created.push(word);
      }
      parent.removeChild(node);
      groups.push({ parent, node, created, text });
    }

    // How to put this element back the way it was — used both on completion and
    // by abort() if a replay interrupts the run.
    //
    // Re-inserts the ORIGINAL Text node object, never a fresh one. When the host
    // text comes from an interpolation, Angular keeps a reference to the exact
    // node it created and writes future updates straight into it; swapping in a
    // replacement leaves Angular writing to a detached node, so the heading
    // silently stops updating after the first decode.
    this.restore = () => {
      for (const { parent, node, created, text } of groups) {
        node.nodeValue = text;
        parent.insertBefore(node, created[0] ?? null);
        for (const span of created) parent.removeChild(span);
      }
    };

    // Freeze the layout: pin every character box to the width of its FINAL
    // glyph, so swapping in a wider/narrower scramble glyph cannot re-center a
    // line or change the line count. Without this, a large centered multi-line
    // heading visibly re-wraps every frame — the animation reads as choppy even
    // at a solid 60fps. Spans still hold their final characters here, so this
    // measures the real end-state layout. Reads are batched before writes to
    // keep it to a single layout pass.
    const widths = cells.map((cell) =>
      cell.space ? 0 : cell.span.getBoundingClientRect().width,
    );
    for (const [i, cell] of cells.entries()) {
      if (cell.space) continue;
      cell.span.style.display = 'inline-block';
      cell.span.style.width = `${widths[i]}px`;
      cell.span.style.textAlign = 'center';
    }

    let start = 0;
    const step = (now: number) => {
      if (start === 0) start = now;
      const progress = Math.min((now - start) / durationMs, 1);
      const front = HyperTextDirective.ease(progress) * total; // fractional resolve front
      const locked = Math.floor(front);

      for (const [i, cell] of cells.entries()) {
        if (cell.space) {
          cell.span.textContent = cell.char; // whitespace stays, never blurs
          continue;
        }
        cell.span.textContent = i < locked ? cell.char : HyperTextDirective.randomChar();

        // Blur band: raised-cosine bump ahead of the front — 0 at the front,
        // peak at its middle, 0 by BLUR_BAND characters ahead. Behind the front
        // (resolved) and far ahead it is 0, so only a few filters exist at once.
        const d = i - front;
        if (d >= 0 && d <= HyperTextDirective.BLUR_BAND) {
          const band = Math.sin((Math.PI * d) / HyperTextDirective.BLUR_BAND) ** 2;
          cell.span.style.filter = `blur(${blurPeak * band}px)`;
        } else {
          cell.span.style.filter = '';
        }
      }

      if (progress < 1) {
        this.frameId = requestAnimationFrame(step);
      } else {
        // Restore a clean DOM: swap each group's transient nodes (word wrappers
        // and loose whitespace spans) back to one plain text node.
        this.restore?.();
        this.restore = null;
      }
    };
    this.frameId = requestAnimationFrame(step);
  }
}
