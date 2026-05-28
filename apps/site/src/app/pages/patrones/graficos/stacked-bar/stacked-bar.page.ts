import { ChangeDetectionStrategy, Component } from '@angular/core';

interface StackSegment {
  label: string;
  ratio: number;
  tokenSlot: number;
  hex: string;
}

interface YearStack {
  age: number;
  total: number;
  segments: { y: number; h: number; color: string; label: string }[];
}

const SEGMENTS: StackSegment[] = [
  { label: 'Inmobiliario',    ratio: 0.32, tokenSlot: 1, hex: '#020F15' },
  { label: 'Inversiones',     ratio: 0.22, tokenSlot: 2, hex: '#003B5F' },
  { label: 'Pensiones',       ratio: 0.16, tokenSlot: 3, hex: '#00629A' },
  { label: 'Private equity',  ratio: 0.10, tokenSlot: 4, hex: '#0085CA' },
  { label: 'Participaciones', ratio: 0.08, tokenSlot: 5, hex: '#80C6E5' },
  { label: 'Liquidez',        ratio: 0.07, tokenSlot: 6, hex: '#6A808A' },
  { label: 'Otro',            ratio: 0.05, tokenSlot: 7, hex: '#9CB2BC' },
];

@Component({
  selector: 'site-stacked-bar-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stacked-bar.page.html',
  styleUrl: './stacked-bar.page.scss',
})
export class StackedBarPage {
  readonly segments = SEGMENTS;

  readonly ages = [55, 60, 65, 70, 75, 80, 85];

  readonly chartHeight = 320;
  readonly chartWidth = 720;
  readonly padTop = 16;
  readonly padBottom = 32;
  readonly padLeft = 56;
  readonly padRight = 12;
  readonly innerH = this.chartHeight - this.padTop - this.padBottom;
  readonly innerW = this.chartWidth - this.padLeft - this.padRight;
  readonly columnWidth = this.innerW / this.ages.length;
  readonly barWidth = this.columnWidth * 0.58;

  readonly yMax = 1_800_000;
  readonly yTicks = [0, 500_000, 1_000_000, 1_500_000];

  private totalFor(age: number): number {
    const t = (age - 55) / (90 - 55);
    return Math.round(900_000 + t * (1_550_000 - 900_000));
  }

  yFor(value: number): number {
    const t = Math.max(0, Math.min(1, value / this.yMax));
    return this.padTop + (1 - t) * this.innerH;
  }

  columnX(age: number): number {
    return this.padLeft + this.ages.indexOf(age) * this.columnWidth;
  }

  readonly stacks: YearStack[] = this.ages.map((age) => {
    const total = this.totalFor(age);
    let running = 0;
    const segments = SEGMENTS.map((seg, i) => {
      const value = total * seg.ratio;
      const yBottom = this.yFor(running);
      const yTop = this.yFor(running + value);
      running += value;
      // One-pixel canvas-tinted gap above each non-bottom segment.
      const gapPx = i === 0 ? 0 : 1;
      return {
        y: Math.min(yTop, yBottom),
        h: Math.max(0, Math.abs(yBottom - yTop) - gapPx),
        color: `var(--chart-stacked-${seg.tokenSlot})`,
        label: seg.label,
      };
    });
    return { age, total, segments };
  });

  formatTick(v: number): string {
    if (v === 0) return '0 €';
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M €`;
    return `${v / 1_000}K €`;
  }
}
