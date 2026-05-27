import { afterNextRender, ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ButtonComponent } from '@coherence/ui';

type SlideKind =
  | 'cover'
  | 'content'
  | 'matrix'
  | 'prompt'
  | 'designMd'
  | 'finding'
  | 'ask'
  | 'close';

const DESIGN_MD_PATH = '/talks/stitch-vs-claude/design-mastercard.md';

interface MatrixRow {
  tool: string;
  url: string;
  designMd: string;
  repo: string;
}

interface Slide {
  kind: SlideKind;
  eyebrow?: string;
  title: string;
  body?: string;
  bullets?: string[];
  callout?: string;
  illustration?: string;
  caption?: string;
  matrix?: { headers: string[]; rows: MatrixRow[] };
  /** Copyable code/prompt block. Rendered as a dark snippet with a "Copiar" button. */
  code?: { label: string; body: string };
}

type PromptVariantKey = 'url' | 'designMd' | 'repo';

const PROMPT_BASE = `Diseña un planificador de jubilación de dos pantallas para clientes españoles de una firma de asesoramiento patrimonial.

AUDIENCIA
- Adultos entre 35 y 60 años con conocimiento financiero medio.
- Prioridad: entender en menos de 30 segundos si su plan actual les permitirá alcanzar el ingreso deseado en la jubilación.

PANTALLA 1 — Captura de datos
- Edad actual.
- Edad objetivo de jubilación.
- Ahorro acumulado en euros.
- Aportación mensual en euros.
- Ingreso mensual deseado en la jubilación, en euros.
- Botón primario: "Calcular proyección".
- Cifras en formato europeo (1.250,50 €) y unidades visibles.

PANTALLA 2 — Resultados
- Cifra titular: ingreso mensual estimado al jubilarse, comparado con el objetivo.
- Gráfica de proyección de la evolución del ahorro desde hoy hasta la edad de jubilación.
- Estado de viabilidad: alcanzable, ajustado o no alcanzable.
- Si no es alcanzable, una recomendación concreta (aumentar la aportación, retrasar la jubilación o ajustar el objetivo) con el delta cuantificado.
- Botón secundario: "Editar datos".

ESTILO
- Tono profesional, claro, sin tecnicismos financieros innecesarios.
- Mensajes positivos cuando el plan funciona; mensajes orientativos cuando no.
- Densidad informativa similar a la imagen adjunta como referencia.`;

const PROMPT_VARIANTS: Record<PromptVariantKey, { label: string; marca: string }> = {
  url: {
    label: 'URL',
    marca: `MARCA — fuente: URL adjunta
- Extrae color, tipografía, radios y densidad visibles en la URL adjunta.
- Refleja la marca con fidelidad: jerarquía de botones, contraste, microcopy.
- Si la URL no expone algún token, mantén una paleta sobria coherente con la marca.`,
  },
  designMd: {
    label: 'design.md',
    marca: `MARCA — fuente: design.md adjunto
- Aplica todos los tokens y reglas descritos en el design.md adjunto.
- Respeta la paleta, tipografía, radios, espaciado y voz de microcopy que define.
- No introduzcas estilos fuera del design.md, ni inventes tokens.`,
  },
  repo: {
    label: 'Repositorio',
    marca: `MARCA — fuente: repositorio de diseño disponible
- Consume los tokens, primitivas y convenciones del repositorio de diseño cargado.
- Usa los componentes existentes en lugar de redibujar (botones, inputs, cards, charts).
- Respeta la regla de marca del repositorio (en Afi, el color secundario es la acción).`,
  },
};

function buildPrompt(key: PromptVariantKey): string {
  return `${PROMPT_BASE}\n\n${PROMPT_VARIANTS[key].marca}`;
}

/**
 * Stitch vs Claude Code — talk slide-show.
 *
 * Self-paced, arrow-key-driven slide-show served at /talks/stitch-vs-claude.
 * Doubles as (a) speaker guide during the 2026-05-28 department talk and
 * (b) draft blog post in the growth.design case-study format.
 *
 * Slide content authored through the afi-redaccion skill — Spanish, 1ª persona
 * del plural, frases cortas, sin gerundios encadenados, fuente + fecha cuando
 * citamos datos externos.
 */
@Component({
  selector: 'site-stitch-vs-claude-talk',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stitch-vs-claude.page.html',
  styleUrl: './stitch-vs-claude.page.scss',
  host: {
    '(document:keydown.arrowLeft)': 'prev()',
    '(document:keydown.arrowRight)': 'next()',
    '(document:keydown.home)': 'goTo(0)',
    '(document:keydown.end)': 'goToLast()',
  },
})
export class StitchVsClaudePage {
  readonly slides: Slide[] = [
    {
      kind: 'cover',
      eyebrow: 'Reunión de área · 2026-05-28',
      title: 'Stitch vs Claude: ¿qué herramienta de IA usamos para conceptos de cliente?',
      body: 'Primero presentamos las dos plataformas. Después lanzamos el mismo prompt en cinco escenarios de marca. Cerramos con una recomendación.',
    },
    {
      kind: 'content',
      eyebrow: 'Herramienta 1',
      title: 'Stitch — el explorador rápido de Google',
      body: 'Pensado para iterar conceptos en minutos. Acepta URL, fichero o prompt enriquecido y entrega pantallas estáticas que se hacen clicables con un paso extra.',
      bullets: [
        'Entradas al iniciar: URL del cliente, fichero adjunto o prompt enriquecido.',
        'Salida por defecto: imágenes estáticas; el modo «instant prototype» las hace navegables.',
        'Sistema de diseño: tres plantillas de color predefinidas, sin personalización profunda.',
        'Vista previa con cambio de viewport (móvil, tablet, escritorio).',
      ],
      callout: 'Aquí cambiamos a Stitch en directo para enseñar la pantalla de inicio.',
    },
    {
      kind: 'content',
      eyebrow: 'Herramienta 2',
      title: 'Claude — el constructor con sistema de diseño',
      body: 'Diseña interacciones completas y se entrega a Claude Code sin pérdidas. Construye el sistema de diseño antes de empezar, a partir de un repo o una URL.',
      bullets: [
        'Modos al iniciar: prototipo, slide deck, plantilla.',
        'Modo de fidelidad: wireframe o hi-fi (en hi-fi se incorpora la marca).',
        'Sistema de diseño construido por adelantado (consume ~20 % de la cuota diaria).',
        'Panel de «tweaks» para ajustar densidad, color, layout o velocidad en directo.',
      ],
      callout: 'Aquí cambiamos a Claude en directo para enseñar las opciones de inicio.',
    },
    {
      kind: 'content',
      eyebrow: '¿Qué modo elegimos?',
      title: 'Wireframe para nuevos productos. Hi-fi cuando ya hay marca.',
      body: 'Wireframe primero valida el flujo sin distracciones de marca. Hi-fi después aplica color, tipografía y tokens sobre un esqueleto ya validado.',
      bullets: [
        'Wireframe: estructura, jerarquía, microcopy. Útil cuando el producto es nuevo.',
        'Hi-fi: marca aplicada. Útil cuando hay un cliente y un sistema de referencia.',
        'Hoy probamos en hi-fi porque la marca (Mastercard, Afi) es parte del experimento.',
      ],
      callout:
        'Hacer wireframe y hi-fi a la vez diluye el flujo en decisiones de marca prematuras.',
    },
    {
      kind: 'content',
      eyebrow: 'El caso',
      title: 'Planificador de jubilación de dos pantallas, inspirado en Mutualidad',
      body: 'Una pantalla recoge edad, ahorro y aportación. Otra muestra la proyección, la viabilidad y la recomendación. Misma estructura para los cinco escenarios.',
      illustration: '/talks/stitch-vs-claude/reference/planificador-jubilacion.png',
      caption:
        'Mutualidad — Planificador de jubilación (Release candidate 24). Sirve como referencia estructural en los cinco escenarios.',
    },
    {
      kind: 'matrix',
      eyebrow: 'La matriz',
      title: 'Cinco escenarios: misma pregunta, distintas fuentes de marca',
      body: 'Comprobamos cómo se comporta cada herramienta cuando la marca llega como URL, como design.md externo o como repositorio propio.',
      matrix: {
        headers: ['Herramienta', 'URL', 'design.md', 'Repositorio'],
        rows: [
          { tool: 'Stitch', url: 'Escenario 1', designMd: 'Escenario 3', repo: '—' },
          { tool: 'Claude', url: 'Escenario 2', designMd: 'Escenario 4', repo: '—' },
          { tool: 'Claude Code', url: '—', designMd: '—', repo: 'Escenario 5' },
        ],
      },
      callout:
        'Si el resultado mejora entre escenarios, la mejora viene del contexto de marca, no de la herramienta.',
    },
    {
      kind: 'prompt',
      eyebrow: 'El prompt',
      title: 'Mismo texto en los cinco escenarios. Cambia solo el adjunto.',
      body: 'Selecciona la fuente de marca con la que vas a ejecutar el prompt. Cada píldora copia la variante correspondiente al portapapeles.',
      callout:
        'Pausa: cambiamos al navegador para ejecutar el prompt en directo en Stitch y en Claude.',
    },
    {
      kind: 'designMd',
      eyebrow: 'El design.md',
      title: 'Design.md de Mastercard, listo para adjuntar',
      body: 'El fichero que usamos en los escenarios 3 y 4. Cópialo con un clic o descárgalo y arrástralo a Stitch o Claude como contexto de marca.',
      callout:
        'Inspirado en el catálogo público de getdesign.md/mastercard, adaptado aquí como fichero estático.',
    },
    {
      kind: 'finding',
      eyebrow: 'Aprendizajes',
      title: 'Lo que llevamos de los cinco escenarios',
      body: 'Resumen rápido mientras seguimos viendo los resultados en directo en Stitch, Claude y Claude Code.',
      bullets: [
        '1. Detalle: Claude entrega microcopy, datos simulados y jerarquía visual al primer intento. Stitch parte de un layout más esquemático que necesita pasos adicionales.',
        '2. Interactividad: Claude es navegable de fábrica. Stitch produce imágenes estáticas hasta activar «instant prototype».',
        '3. Fidelidad de marca: URL < design.md < repositorio propio. El salto entre escenario 4 y 5 no es la herramienta, es la fuente de marca.',
        '4. Handoff: solo Claude conserva la fidelidad al entregarse a Claude Code. Stitch exporta a AI Studio o a un zip y parte del estilo se pierde.',
        '5. Iteración: Claude expone un panel de ajustes para densidad, color o layout en directo. Stitch redirige cada cambio al prompt inicial.',
      ],
      callout:
        'Ver la interactividad e iterar sobre ella es como llegamos a un buen diseño.',
    },
    {
      kind: 'content',
      eyebrow: 'Export y handoff',
      title: 'Claude llega al código sin pérdida; Stitch reescribe por el camino',
      body: 'Es el punto donde el concepto deja de ser una imagen y pasa a producción. Aquí es donde el flujo importa más que la herramienta.',
      bullets: [
        'Claude → Claude Code: un comando de copia entrega tokens, primitivas y estructura intacta.',
        'Stitch → AI Studio o ZIP: la marca y la interactividad se degradan; obliga a re-trabajo de desarrollo.',
        'Si el concepto va a producción, el handoff decide la elección de herramienta.',
      ],
      callout:
        'El handoff no es un detalle técnico: es donde se decide si el diseño llega vivo a la siguiente fase.',
    },
    {
      kind: 'ask',
      eyebrow: 'Propuesta',
      title: 'Adoptemos Claude para conceptos de cliente, con un design.md por cliente como fuente de marca',
      body: 'El design.md de Afi se redacta en quince minutos y vive en nuestro recurso interno. Cualquier developer lo recoge y lo adjunta a Claude o a Stitch como contexto de marca. La inversión se amortiza desde el segundo cliente.',
      bullets: [
        '1. Redactamos el primer design.md de Afi esta semana.',
        '2. Replicamos el ejercicio con un cliente real la semana siguiente.',
        '3. Si funciona, ampliamos la biblioteca cliente a cliente.',
      ],
    },
    {
      kind: 'close',
      eyebrow: 'Recapitulación',
      title: 'Stitch para explorar rápido; Claude para conceptos que sobreviven al handoff',
      body: '¿Preguntas, dudas, contraejemplos? El brief, el prompt y los cinco resultados están en la rama docs/talk-stitch-vs-claude. Gracias.',
    },
  ];

  readonly index = signal(0);

  // Prompt variant state — which MARCA branch is currently visible and copyable.
  readonly activeVariant = signal<PromptVariantKey>('url');
  readonly copiedVariant = signal<PromptVariantKey | null>(null);
  readonly promptVariantKeys: readonly PromptVariantKey[] = ['url', 'designMd', 'repo'];
  readonly promptVariants = PROMPT_VARIANTS;

  readonly activePromptBody = computed(() => buildPrompt(this.activeVariant()));

  // Design.md content is fetched from the public asset on first paint.
  readonly designMdContent = signal<string>('Cargando design.md…');
  readonly designMdCopied = signal(false);
  readonly designMdDownloadHref = DESIGN_MD_PATH;

  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  private designMdCopyResetTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    afterNextRender(() => {
      void this.loadDesignMd();
    });
  }

  private async loadDesignMd(): Promise<void> {
    try {
      const res = await fetch(DESIGN_MD_PATH, { cache: 'force-cache' });
      if (res.ok) {
        this.designMdContent.set(await res.text());
      } else {
        this.designMdContent.set(
          'No se pudo cargar el design.md. Adjúntalo manualmente desde talks/stitch-vs-claude/design-mastercard.md.',
        );
      }
    } catch {
      this.designMdContent.set(
        'No se pudo cargar el design.md. Adjúntalo manualmente desde talks/stitch-vs-claude/design-mastercard.md.',
      );
    }
  }

  // `index` is always guarded inside the bounds of `slides` by prev/next/goTo,
  // so the non-null assertion is safe and avoids Slide | undefined narrowing
  // headaches in the template (strict templates + noUncheckedIndexedAccess).
  readonly current = computed(() => this.slides[this.index()]!);
  readonly total = computed(() => this.slides.length);
  readonly isFirst = computed(() => this.index() === 0);
  readonly isLast = computed(() => this.index() === this.slides.length - 1);
  readonly progressPct = computed(() =>
    Math.round(((this.index() + 1) / this.slides.length) * 100),
  );

  prev(): void {
    if (this.isFirst()) return;
    this.index.update((i) => i - 1);
  }

  next(): void {
    if (this.isLast()) return;
    this.index.update((i) => i + 1);
  }

  goTo(target: number): void {
    if (target < 0 || target >= this.slides.length) return;
    this.index.set(target);
  }

  goToLast(): void {
    this.index.set(this.slides.length - 1);
  }

  async copyDesignMd(): Promise<void> {
    const text = this.designMdContent();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(ta);
      }
    }
    this.designMdCopied.set(true);
    if (this.designMdCopyResetTimer) clearTimeout(this.designMdCopyResetTimer);
    this.designMdCopyResetTimer = setTimeout(() => this.designMdCopied.set(false), 2200);
  }

  async copyVariant(key: PromptVariantKey): Promise<void> {
    this.activeVariant.set(key);
    const text = buildPrompt(key);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(ta);
      }
    }
    this.copiedVariant.set(key);
    if (this.copyResetTimer) clearTimeout(this.copyResetTimer);
    this.copyResetTimer = setTimeout(() => this.copiedVariant.set(null), 2200);
  }
}
