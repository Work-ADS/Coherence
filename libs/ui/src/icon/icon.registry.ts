// Icon registry for afi-icon. Data only: every glyph is a list of SVG shapes
// drawn on a fixed grid, rendered by the component template (no innerHTML, so
// nothing passes through the sanitizer). Ported from the Wealth Planner zip's
// SidebarIcon set; milestone glyphs share their geometry with the chart
// milestone lane, so a list beside a chart shows the identical icon.

export interface IconShape {
  readonly tag: 'path' | 'circle' | 'rect' | 'line';
  readonly d?: string;
  readonly cx?: string;
  readonly cy?: string;
  readonly r?: string;
  readonly x?: string;
  readonly y?: string;
  readonly width?: string;
  readonly height?: string;
  readonly rx?: string;
  readonly ry?: string;
  readonly x1?: string;
  readonly x2?: string;
  readonly y1?: string;
  readonly y2?: string;
  /** Filled with currentColor and no stroke (dots on a line glyph). */
  readonly solid?: true;
}

/** Glyphs on the 24 grid (Lucide geometry). */
export const ICON_GLYPHS = {
  wallet: [
    { tag: 'path', d: 'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1' },
    { tag: 'path', d: 'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4' },
  ],
  target: [
    { tag: 'circle', cx: '12', cy: '12', r: '10' },
    { tag: 'circle', cx: '12', cy: '12', r: '6' },
    { tag: 'circle', cx: '12', cy: '12', r: '2' },
  ],
  'clipboard-list': [
    { tag: 'rect', width: '8', height: '4', x: '8', y: '2', rx: '1', ry: '1' },
    { tag: 'path', d: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' },
    { tag: 'path', d: 'M12 11h4' },
    { tag: 'path', d: 'M12 16h4' },
    { tag: 'path', d: 'M8 11h.01' },
    { tag: 'path', d: 'M8 16h.01' },
  ],
  route: [
    { tag: 'circle', cx: '6', cy: '19', r: '3' },
    { tag: 'path', d: 'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15' },
    { tag: 'circle', cx: '18', cy: '5', r: '3' },
  ],
  flag: [
    { tag: 'path', d: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z' },
    { tag: 'line', x1: '4', x2: '4', y1: '22', y2: '15' },
  ],
  'file-text': [
    { tag: 'path', d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' },
    { tag: 'path', d: 'M14 2v4a2 2 0 0 0 2 2h4' },
    { tag: 'path', d: 'M10 9H8' },
    { tag: 'path', d: 'M16 13H8' },
    { tag: 'path', d: 'M16 17H8' },
  ],
  'panel-left': [
    { tag: 'rect', width: '18', height: '18', x: '3', y: '3', rx: '2' },
    { tag: 'path', d: 'M9 3v18' },
  ],
  'chevron-down': [
    { tag: 'path', d: 'm6 9 6 6 6-6' },
  ],
  'chevron-up': [
    { tag: 'path', d: 'm18 15-6-6-6 6' },
  ],
  'chevron-right': [
    { tag: 'path', d: 'm9 18 6-6-6-6' },
  ],
  'chevron-left': [
    { tag: 'path', d: 'm15 18-6-6 6-6' },
  ],
  x: [
    { tag: 'path', d: 'M18 6 6 18' },
    { tag: 'path', d: 'm6 6 12 12' },
  ],
  users: [
    { tag: 'path', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' },
    { tag: 'circle', cx: '9', cy: '7', r: '4' },
    { tag: 'path', d: 'M22 21v-2a4 4 0 0 0-3-3.87' },
    { tag: 'path', d: 'M16 3.13a4 4 0 0 1 0 7.75' },
  ],
  'building-2': [
    { tag: 'path', d: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z' },
    { tag: 'path', d: 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' },
    { tag: 'path', d: 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' },
    { tag: 'path', d: 'M10 6h4' },
    { tag: 'path', d: 'M10 10h4' },
    { tag: 'path', d: 'M10 14h4' },
    { tag: 'path', d: 'M10 18h4' },
  ],
  banknote: [
    { tag: 'rect', width: '20', height: '12', x: '2', y: '6', rx: '2' },
    { tag: 'circle', cx: '12', cy: '12', r: '2' },
    { tag: 'path', d: 'M6 12h.01M18 12h.01' },
  ],
  receipt: [
    { tag: 'path', d: 'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z' },
    { tag: 'path', d: 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8' },
    { tag: 'path', d: 'M12 17.5v-11' },
  ],
  landmark: [
    { tag: 'path', d: 'M10 18v-7' },
    { tag: 'path', d: 'M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z' },
    { tag: 'path', d: 'M14 18v-7' },
    { tag: 'path', d: 'M18 18v-7' },
    { tag: 'path', d: 'M3 22h18' },
    { tag: 'path', d: 'M6 18v-7' },
  ],
  armchair: [
    { tag: 'path', d: 'M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3' },
    { tag: 'path', d: 'M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z' },
    { tag: 'path', d: 'M5 18v2' },
    { tag: 'path', d: 'M19 18v2' },
  ],
  'trending-up': [
    { tag: 'path', d: 'M16 7h6v6' },
    { tag: 'path', d: 'm22 7-8.5 8.5-5-5L2 17' },
  ],
  shield: [
    { tag: 'path', d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' },
  ],
  'hand-coins': [
    { tag: 'path', d: 'M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17' },
    { tag: 'path', d: 'm7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9' },
    { tag: 'path', d: 'm2 16 6 6' },
    { tag: 'circle', cx: '16', cy: '9', r: '2.9' },
    { tag: 'circle', cx: '6', cy: '5', r: '3' },
  ],
  'pie-chart': [
    { tag: 'path', d: 'M21.21 15.89A10 10 0 1 1 8 2.83' },
    { tag: 'path', d: 'M22 12A10 10 0 0 0 12 2v10z' },
  ],
  droplets: [
    { tag: 'path', d: 'M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z' },
    { tag: 'path', d: 'M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97' },
  ],
  lightbulb: [
    { tag: 'path', d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' },
    { tag: 'path', d: 'M9 18h6' },
    { tag: 'path', d: 'M10 22h4' },
  ],
  'help-circle': [
    { tag: 'circle', cx: '12', cy: '12', r: '10' },
    { tag: 'path', d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' },
    { tag: 'path', d: 'M12 17h.01' },
  ],
  info: [
    { tag: 'circle', cx: '12', cy: '12', r: '10' },
    { tag: 'path', d: 'M12 16v-4' },
    { tag: 'path', d: 'M12 8h.01' },
  ],
  pencil: [
    { tag: 'path', d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' },
    { tag: 'path', d: 'm15 5 4 4' },
  ],
  'trash-2': [
    { tag: 'path', d: 'M3 6h18' },
    { tag: 'path', d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' },
    { tag: 'path', d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' },
    { tag: 'line', x1: '10', x2: '10', y1: '11', y2: '17' },
    { tag: 'line', x1: '14', x2: '14', y1: '11', y2: '17' },
  ],
  eye: [
    { tag: 'path', d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' },
    { tag: 'circle', cx: '12', cy: '12', r: '3' },
  ],
  copy: [
    { tag: 'rect', width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' },
    { tag: 'path', d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' },
  ],
  download: [
    { tag: 'path', d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' },
    { tag: 'path', d: 'm7 10 5 5 5-5' },
    { tag: 'path', d: 'M12 15V3' },
  ],
  plus: [
    { tag: 'path', d: 'M5 12h14' },
    { tag: 'path', d: 'M12 5v14' },
  ],
  sparkles: [
    { tag: 'path', d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' },
    { tag: 'path', d: 'M20 3v4' },
    { tag: 'path', d: 'M22 5h-4' },
    { tag: 'path', d: 'M4 17v2' },
    { tag: 'path', d: 'M5 18H3' },
  ],
} as const satisfies Readonly<Record<string, readonly IconShape[]>>;

/** Milestone glyphs on the 16 grid. The component scales them to the 24 grid. */
export const ICON_MILESTONES = {
  investment: [
    { tag: 'path', d: 'M2 12 L6 8 L9 10 L14 4.5 M10.5 4.5 H14 V8' },
  ],
  vehicle: [
    { tag: 'path', d: 'M2.5 10.5 L4 6.5 C4.3 5.8 4.8 5.5 5.5 5.5 H10.5 C11.2 5.5 11.7 5.8 12 6.5 L13.5 10.5 V12.5 H2.5 Z M2.5 10.5 H13.5' },
    { tag: 'circle', cx: '5', cy: '12.5', r: '1.2', solid: true },
    { tag: 'circle', cx: '11', cy: '12.5', r: '1.2', solid: true },
  ],
  education: [
    { tag: 'path', d: 'M1.5 6.5 L8 3.5 L14.5 6.5 L8 9.5 Z M4.5 8 V11 C6.5 12.6 9.5 12.6 11.5 11 V8 M14.5 6.5 V10' },
  ],
  home: [
    { tag: 'path', d: 'M2 8 L8 3 L14 8 M4 7 V13 H12 V7 M6.8 13 V10 H9.2 V13' },
  ],
  retirement: [
    { tag: 'path', d: 'M8.67 5.33 c0 -1.84 -1.64 -3.33 -3.67 -3.33 S1.33 3.49 1.33 5.33 h1.33 l0.67 -0.67 0.67 0.67 h2.67' },
    { tag: 'path', d: 'M8.67 4.76 A3.88 3.88 0 0 1 11 4 c2.03 0 3.67 1.49 3.67 3.33 h-2 l-0.67 -0.67 -0.67 0.67 h-2' },
    { tag: 'path', d: 'M3.93 6.47 c-1.43 1.43 -1.53 3.65 -0.23 4.95 l2.83 -2.83 0.47 -0.47 0.47 -0.47 1.41 -1.41 c-1.3 -1.31 -3.51 -1.2 -4.95 0.23' },
    { tag: 'path', d: 'M7.33 10.33 c0.33 1.67 -0.11 3 -0.67 4.33 h2.67 c1.33 -3.67 -0.33 -8 -0.67 -9.33' },
  ],
  gift: [
    { tag: 'circle', cx: '10.5', cy: '5', r: '2.3' },
    { tag: 'path', d: 'M1.5 11 H4 L7 12.5 H10.5 C11.3 12.5 11.3 11 10.5 11 H7.5 M4 9.5 H6.5 C7.5 9.5 8 10 8.3 11 M10.8 12.3 L13.8 10.3 C14.5 9.8 15 10.8 14.4 11.4 L11.5 14 H6.5 L4 13' },
  ],
  bank: [
    { tag: 'path', d: 'M2 6.2 L8 2.8 L14 6.2 Z M3.8 7.5 V12 M6.6 7.5 V12 M9.4 7.5 V12 M12.2 7.5 V12 M2 13.5 H14' },
  ],
  alert: [
    { tag: 'path', d: 'M14.49 12 L9.15 2.67 A1.33 1.33 0 0 0 6.83 2.67 L1.49 12 A1.33 1.33 0 0 0 2.67 14 H13.33 A1.33 1.33 0 0 0 14.49 12 Z M8 6 V8.67' },
    { tag: 'circle', cx: '8', cy: '11.2', r: '0.8', solid: true },
  ],
  depleted: [
    { tag: 'rect', x: '1.5', y: '4.5', width: '13', height: '7', rx: '1.5' },
    { tag: 'circle', cx: '8', cy: '8', r: '1.7' },
    { tag: 'path', d: 'M2.5 2.5 L13.5 13.5' },
  ],
} as const satisfies Readonly<Record<string, readonly IconShape[]>>;

export const ICON_MILESTONE_SCALE = 1.5;
export const ICON_STROKE_WIDTH = 1.75;

export type IconName = keyof typeof ICON_GLYPHS | keyof typeof ICON_MILESTONES;

interface IconEntry {
  readonly shapes: readonly IconShape[];
  readonly milestone: boolean;
}

function entriesOf<K extends string>(
  source: Readonly<Record<K, readonly IconShape[]>>,
  milestone: boolean,
): Record<K, IconEntry> {
  const entries = {} as Record<K, IconEntry>;
  for (const name of Object.keys(source) as K[]) {
    entries[name] = { shapes: source[name], milestone };
  }
  return entries;
}

export const ICON_REGISTRY: Readonly<Record<IconName, IconEntry>> = {
  ...entriesOf(ICON_GLYPHS, false),
  ...entriesOf(ICON_MILESTONES, true),
};
