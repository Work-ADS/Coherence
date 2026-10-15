import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';

import { FloatingPanel, onOverlayEscape } from '../floating-panel';

/**
 * Dropdown Panel — a floating container that anchors below a trigger element.
 *
 * Provides header/body/footer slots, click-outside-to-close, and Escape key dismiss.
 * The panel is portalled and positioned by `FloatingPanel` (flips, clamps to the
 * viewport, follows scroll), and Escape closes only this panel.
 */
@Component({
  selector: 'afi-dropdown-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dropdown-panel.component.html',
  styleUrls: ['./dropdown-panel.component.scss'],
  host: { class: 'dropdown-panel' },
})
export class DropdownPanelComponent implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panelEl = viewChild<ElementRef<HTMLElement>>('panelEl');
  private readonly floating = new FloatingPanel();
  private disposeEscape: (() => void) | null = null;

  readonly open = input<boolean>(false);
  readonly width = input<number>(320);
  readonly maxHeight = input<number>(400);
  readonly ariaLabel = input<string>('');
  /**
   * Anchor edge. 'end' (default) aligns the panel's right edge with the
   * trigger's right edge — the panel extends LEFT. 'start' aligns the
   * panel's left edge with the trigger's left edge — the panel extends
   * RIGHT. Use 'start' when the trigger sits at the LEFT of the viewport
   * (otherwise the panel overflows off-screen).
   */
  readonly placement = input<'start' | 'end'>('end');

  readonly closed = output<void>();

  constructor() {
    effect(() => {
      const panel = this.panelEl()?.nativeElement;
      if (panel) {
        this.floating.attach(panel, this.el.nativeElement, { side: 'bottom', align: this.placement() });
        this.disposeEscape ??= onOverlayEscape(() => this.closed.emit());
      } else {
        this.release();
      }
    });
  }

  ngOnDestroy(): void {
    this.release();
  }

  // A click, not a mousedown: the consumer's own trigger click toggles the panel,
  // and the panel is portalled out of this host, so it is checked by element.
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target as Node | null;
    if (target && (this.el.nativeElement.contains(target) || this.panelEl()?.nativeElement.contains(target))) return;
    this.closed.emit();
  }

  private release(): void {
    this.floating.detach();
    this.disposeEscape?.();
    this.disposeEscape = null;
  }
}
