import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LanguageService } from '../../services/language.service';

type NodeKind = 'step' | 'decision' | 'impact' | 'target';

interface FlowNode {
  id: string;
  col: number;
  row: number;
  kind: NodeKind;
  lines: { es: string[]; en: string[] };
}

interface FlowEdge {
  from: string;
  to: string;
  label?: { es: string; en: string };
}

// Geometry — one place, so nodes and edge paths cannot drift apart.
const NODE_W = 168;
const NODE_H = 84;
const COL_PITCH = 204;
const ROW_Y: readonly number[] = [10, 130, 290];
const LAST_ROW_Y = 290;
const PAD_X = 10;

/**
 * The reactive-delivery cycle as a flowchart: how short-notice work, unagreed
 * requirements and late design involvement feed one another. Describes shared
 * working conditions, not individuals. Data-driven so labels follow the locale.
 */
@Component({
  selector: 'site-reactive-cycle-flow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reactive-cycle-flow.component.html',
  styleUrl: './reactive-cycle-flow.component.scss',
})
export class ReactiveCycleFlowComponent {
  private readonly language = inject(LanguageService);
  private readonly lang = this.language.lang;

  readonly width = PAD_X * 2 + COL_PITCH * 4 + NODE_W;
  readonly height = LAST_ROW_Y + NODE_H + 10;
  readonly nodeW = NODE_W;
  readonly nodeH = NODE_H;

  private readonly nodes: FlowNode[] = [
    { id: 'a', col: 0, row: 1, kind: 'step', lines: { en: ['Work arrives with', 'a short deadline'], es: ['El trabajo llega', 'con un plazo corto'] } },
    { id: 'b', col: 1, row: 1, kind: 'decision', lines: { en: ['Is design involved', 'from the start?'], es: ['¿Participa diseño', 'desde el principio?'] } },
    { id: 'c', col: 2, row: 1, kind: 'step', lines: { en: ['Development begins', 'before designs', 'are agreed'], es: ['Desarrollo empieza', 'antes de acordar', 'los diseños'] } },
    { id: 'd', col: 3, row: 1, kind: 'step', lines: { en: ['Requirements keep', 'changing during', 'implementation'], es: ['Los requisitos', 'cambian durante', 'la implementación'] } },
    { id: 'e', col: 4, row: 1, kind: 'impact', lines: { en: ['Work is revised', 'and rebuilt'], es: ['Se revisa y se', 'rehace el trabajo'] } },
    { id: 'f', col: 4, row: 2, kind: 'impact', lines: { en: ['Delivery runs longer;', 'the design process', 'is questioned'], es: ['La entrega se alarga;', 'se cuestiona el', 'proceso de diseño'] } },
    { id: 'g', col: 3, row: 2, kind: 'step', lines: { en: ['Design proactively', 'proposes a process'], es: ['Diseño propone', 'un proceso de', 'forma proactiva'] } },
    { id: 'h', col: 2, row: 2, kind: 'step', lines: { en: ['Proposal has no agreed', 'priorities or decision', 'owner behind it'], es: ['La propuesta no tiene', 'prioridades acordadas', 'ni responsable'] } },
    { id: 'i', col: 1, row: 2, kind: 'step', lines: { en: ['Expectation restated:', 'design first, lead,', 'be proactive'], es: ['Se repite la expectativa:', 'liderar el diseño,', 'ser proactivo'] } },
    { id: 'j', col: 0, row: 2, kind: 'impact', lines: { en: ['The cycle restarts'], es: ['El ciclo se reinicia'] } },
    { id: 'n', col: 1, row: 0, kind: 'target', lines: { en: ['Target state: agreed', 'priorities and', 'requirements, design', 'involved early'], es: ['Situación objetivo:', 'prioridades y requisitos', 'acordados, diseño', 'desde el inicio'] } },
  ];

  private readonly edges: FlowEdge[] = [
    { from: 'a', to: 'b' },
    { from: 'b', to: 'c', label: { en: 'No', es: 'No' } },
    { from: 'c', to: 'd' },
    { from: 'd', to: 'e' },
    { from: 'e', to: 'f' },
    { from: 'f', to: 'g' },
    { from: 'g', to: 'h' },
    { from: 'h', to: 'i' },
    { from: 'i', to: 'j' },
    { from: 'j', to: 'a' },
    { from: 'b', to: 'n', label: { en: 'Yes', es: 'Sí' } },
  ];

  readonly title = computed(() =>
    this.lang() === 'en' ? 'The reactive delivery cycle' : 'El ciclo de la entrega reactiva',
  );

  readonly view = computed(() => {
    const l = this.lang();
    const pos = (n: FlowNode) => ({ x: PAD_X + n.col * COL_PITCH, y: ROW_Y[n.row] ?? 0 });
    const byId = new Map(this.nodes.map((n) => [n.id, n]));

    const nodes = this.nodes.map((n) => {
      const { x, y } = pos(n);
      const lines = n.lines[l];
      const first = y + NODE_H / 2 - ((lines.length - 1) * 16) / 2;
      return {
        id: n.id,
        kind: n.kind,
        x,
        y,
        lines: lines.map((text, i) => ({ text, y: first + i * 16 + 4 })),
      };
    });

    const edges = this.edges.map((e) => {
      const a = byId.get(e.from)!;
      const b = byId.get(e.to)!;
      const pa = pos(a);
      const pb = pos(b);
      const cx = pa.x + NODE_W / 2;
      const cy = pa.y + NODE_H / 2;
      let x1 = cx, y1 = cy, x2 = pb.x + NODE_W / 2, y2 = pb.y + NODE_H / 2;
      if (pa.y === pb.y) {
        // Same row: leave the facing side, enter the facing side.
        const right = pb.x > pa.x;
        x1 = right ? pa.x + NODE_W : pa.x;
        x2 = right ? pb.x : pb.x + NODE_W;
      } else if (pb.y > pa.y) {
        y1 = pa.y + NODE_H;
        y2 = pb.y;
      } else {
        y1 = pa.y;
        y2 = pb.y + NODE_H;
      }
      return {
        d: `M${x1} ${y1} L${x2} ${y2}`,
        label: e.label?.[l],
        // Vertical edges carry their label beside the line, not on it.
        lx: x1 === x2 ? x1 + 10 : (x1 + x2) / 2,
        ly: x1 === x2 ? (y1 + y2) / 2 + 4 : (y1 + y2) / 2 - 6,
        anchor: x1 === x2 ? 'start' : 'middle',
      };
    });

    return { nodes, edges };
  });
}
