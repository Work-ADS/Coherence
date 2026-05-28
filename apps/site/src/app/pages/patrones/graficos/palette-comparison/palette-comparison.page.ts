import { ChangeDetectionStrategy, Component } from '@angular/core';

interface AssetClass {
  key: string;
  label: string;
  ratio: number;
}

interface PaletteColor {
  token: string;
  cssVar: string;
  hex: string;
}

interface PaletteSpec {
  id: 'a' | 'b' | 'c';
  name: string;
  tagline: string;
  rationale: string;
  colors: PaletteColor[];
}

interface PaletteSwatch extends PaletteColor {
  index: number;
  assetLabel: string;
}

const ASSET_CLASSES: AssetClass[] = [
  { key: 'inmobiliario', label: 'Inmobiliario', ratio: 0.32 },
  { key: 'inversiones', label: 'Inversiones', ratio: 0.22 },
  { key: 'pensiones', label: 'Pensiones', ratio: 0.16 },
  { key: 'privateEquity', label: 'Private equity', ratio: 0.1 },
  { key: 'participaciones', label: 'Participaciones', ratio: 0.08 },
  { key: 'liquidez', label: 'Liquidez', ratio: 0.07 },
  { key: 'otro', label: 'Otro', ratio: 0.05 },
];

const PALETTES: PaletteSpec[] = [
  {
    id: 'a',
    name: 'A · Azul + Gris',
    tagline: 'Azul oscuro→claro, grises al final',
    rationale:
      'Aprovecha la rampa azul completa; cuando se acaba el azul, los grises desempatan las series adyacentes. Lectura monocromática + máximo contraste.',
    colors: [
      { token: 'afi-azul-profundo-900', cssVar: 'var(--color-afi-azul-profundo-900)', hex: '#020F15' },
      { token: 'afi-azul-900', cssVar: 'var(--color-afi-azul-900)', hex: '#003B5F' },
      { token: 'afi-azul-700', cssVar: 'var(--color-afi-azul-700)', hex: '#00629A' },
      { token: 'afi-azul-500', cssVar: 'var(--color-afi-azul-500)', hex: '#0085CA' },
      { token: 'afi-azul-300', cssVar: 'var(--color-afi-azul-300)', hex: '#80C6E5' },
      { token: 'afi-gris-700', cssVar: 'var(--color-afi-gris-700)', hex: '#6A808A' },
      { token: 'afi-gris-500', cssVar: 'var(--color-afi-gris-500)', hex: '#9CB2BC' },
    ],
  },
  {
    id: 'b',
    name: 'B · Azul puro',
    tagline: 'Escalera de azules, sin grises',
    rationale:
      'Monocromático estricto: una sola familia, sólo cambia la luminancia. Más calmado, pero los pasos adyacentes se confunden cuando hay muchas series.',
    colors: [
      { token: 'afi-azul-profundo-900', cssVar: 'var(--color-afi-azul-profundo-900)', hex: '#020F15' },
      { token: 'afi-azul-900', cssVar: 'var(--color-afi-azul-900)', hex: '#003B5F' },
      { token: 'afi-azul-700', cssVar: 'var(--color-afi-azul-700)', hex: '#00629A' },
      { token: 'afi-azul-500', cssVar: 'var(--color-afi-azul-500)', hex: '#0085CA' },
      { token: 'afi-azul-300', cssVar: 'var(--color-afi-azul-300)', hex: '#80C6E5' },
      { token: 'afi-azul-100', cssVar: 'var(--color-afi-azul-100)', hex: '#CDE9F6' },
      { token: 'afi-azul-25', cssVar: 'var(--color-afi-azul-25)', hex: '#F2FAFE' },
    ],
  },
  {
    id: 'c',
    name: 'C · Mixto: claro → gris → negro → azul',
    tagline: 'Orden no lineal, alto contraste por bloques',
    rationale:
      'Bloques alternos de tonalidad e identidad: arranca claro, salta a grises, después al negro absoluto y baja por azules. Contraste alto pero pierde la lectura de "más oscuro = más cantidad".',
    colors: [
      { token: 'afi-azul-25', cssVar: 'var(--color-afi-azul-25)', hex: '#F2FAFE' },
      { token: 'afi-gris-300', cssVar: 'var(--color-afi-gris-300)', hex: '#C8DAE2' },
      { token: 'afi-gris-500', cssVar: 'var(--color-afi-gris-500)', hex: '#9CB2BC' },
      { token: 'afi-gris-700', cssVar: 'var(--color-afi-gris-700)', hex: '#6A808A' },
      { token: 'afi-azul-profundo-900', cssVar: 'var(--color-afi-azul-profundo-900)', hex: '#020F15' },
      { token: 'afi-azul-700', cssVar: 'var(--color-afi-azul-700)', hex: '#00629A' },
      { token: 'afi-azul-500', cssVar: 'var(--color-afi-azul-500)', hex: '#0085CA' },
    ],
  },
];

interface StackSegment {
  label: string;
  ratio: number;
  y: number;
  h: number;
  color: string;
  hex: string;
}

interface YearStack {
  age: number;
  total: number;
  segments: StackSegment[];
}

@Component({
  selector: 'site-palette-comparison-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './palette-comparison.page.html',
  styleUrl: './palette-comparison.page.scss',
})
export class PaletteComparisonPage {
  readonly palettes = PALETTES;
  readonly assetClasses = ASSET_CLASSES;

  readonly ages = [55, 60, 65, 70, 75, 80, 85];

  readonly chartHeight = 260;
  readonly chartWidth = 320;
  readonly padTop = 12;
  readonly padBottom = 28;
  readonly padLeft = 42;
  readonly padRight = 8;
  readonly innerH = this.chartHeight - this.padTop - this.padBottom;
  readonly innerW = this.chartWidth - this.padLeft - this.padRight;
  readonly columnWidth = this.innerW / this.ages.length;
  readonly barWidth = this.columnWidth * 0.62;

  readonly yMax = 1_800_000;
  readonly yTicks = [0, 500_000, 1_000_000, 1_500_000];

  private totalFor(age: number): number {
    const t = (age - 55) / (90 - 55);
    return Math.round(900_000 + t * (1_550_000 - 900_000));
  }

  private yFor(value: number): number {
    const t = Math.max(0, Math.min(1, value / this.yMax));
    return this.padTop + (1 - t) * this.innerH;
  }

  columnX(age: number): number {
    const i = this.ages.indexOf(age);
    return this.padLeft + i * this.columnWidth;
  }

  stacksFor(palette: PaletteSpec): YearStack[] {
    return this.ages.map((age) => {
      const total = this.totalFor(age);
      let running = 0;
      const segments: StackSegment[] = ASSET_CLASSES.map((ac, i) => {
        const color = palette.colors[i] ?? palette.colors[palette.colors.length - 1]!;
        const value = total * ac.ratio;
        const yBottom = this.yFor(running);
        const yTop = this.yFor(running + value);
        running += value;
        return {
          label: ac.label,
          ratio: ac.ratio,
          y: Math.min(yTop, yBottom),
          h: Math.abs(yBottom - yTop),
          color: color.cssVar,
          hex: color.hex,
        };
      });
      return { age, total, segments };
    });
  }

  swatchesFor(palette: PaletteSpec): PaletteSwatch[] {
    return palette.colors.map((c, i) => ({
      ...c,
      index: i + 1,
      assetLabel: ASSET_CLASSES[i]?.label ?? '—',
    }));
  }

  formatTick(v: number): string {
    if (v === 0) return '0 €';
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M €`;
    return `${v / 1_000}K €`;
  }

  yPosFor(v: number): number {
    return this.yFor(v);
  }
}
