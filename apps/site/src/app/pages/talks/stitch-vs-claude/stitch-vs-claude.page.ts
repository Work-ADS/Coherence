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

type PromptVariantKey = 'url' | 'designMd';

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
      body: 'Dos plataformas, el mismo prompt, una recomendación.',
    },
    {
      kind: 'content',
      eyebrow: 'Herramienta 1',
      title: 'Stitch — el explorador rápido de Google',
      body: 'Para iterar conceptos en minutos y sacar primeros borradores. Acepta URL, fichero o prompt enriquecido.',
      bullets: [
        '1. Inicio: URL del cliente, fichero adjunto o prompt enriquecido.',
        '2. Sistema de diseño: tres plantillas predefinidas, sin personalización profunda.',
        '3. Generar → salida estática: imágenes; «instant prototype» las hace navegables.',
        '4. Vista previa: móvil, tablet o escritorio.',
        '5. Export: AI Studio o ZIP.',
      ],
      callout: 'Mostrar Stitch en vivo.',
    },
    {
      kind: 'content',
      eyebrow: 'Herramienta 2',
      title: 'Claude — el constructor con sistema de diseño',
      body: 'Para arrancar proyectos de cliente de forma más escalable y sofisticada. Diseña interacciones completas y se entrega a Claude Code sin pérdidas.',
      bullets: [
        '1. Inicio: tipo de proyecto (prototipo, slide deck, plantilla) y sistema de diseño.',
        '2. Modo de fidelidad: wireframe o hi-fi (en hi-fi se incorpora la marca).',
        '3. Preguntas de aclaración: con URL pregunta para afinar; con design.md, va directo.',
        '4. Crear → lienzo vacío: bocetamos e iteramos directamente sobre el prompt.',
        '5. Panel de «tweaks»: densidad, color, layout y velocidad en directo.',
        '6. Handoff a Claude Code: un comando conserva tokens y primitivas.',
      ],
      callout: 'Mostrar Claude en vivo.',
    },
    {
      kind: 'content',
      eyebrow: 'El caso',
      title: 'Planificador de jubilación de dos pantallas, inspirado en Mutualidad',
      body: 'Sale de nuestros simuladores. Es el más simple: unas preguntas y un resumen en una página. Algo real con lo que el equipo puede identificarse, sin sobrecomplicarlo.',
      illustration: '/talks/stitch-vs-claude/reference/planificador-jubilacion.png',
      caption:
        'Mutualidad — Planificador de jubilación (Release candidate 24). Sirve como referencia estructural.',
    },
    {
      kind: 'prompt',
      eyebrow: 'El prompt',
      title: 'Mismo texto. Cambia solo la fuente de marca.',
      body: 'Queríamos probar dos productos y dos fuentes de contexto: URL cuando aún no conocemos al cliente, y design.md cuando podemos construirlo nosotros (como hace el equipo de diseño). La salida depende del contexto que demos a la IA, no solo de la herramienta.',
    },
    {
      kind: 'matrix',
      eyebrow: 'La matriz',
      title: 'Cuatro escenarios: misma pregunta, distintas fuentes de marca',
      body: 'Cómo se comporta cada herramienta cuando la marca llega como URL o como design.md externo.',
      matrix: {
        headers: ['Herramienta', 'URL', 'design.md'],
        rows: [
          { tool: 'Stitch', url: 'Escenario 1', designMd: 'Escenario 3' },
          { tool: 'Claude', url: 'Escenario 2', designMd: 'Escenario 4' },
        ],
      },
      callout:
        'Si el resultado mejora entre escenarios, la mejora viene del contexto de marca, no de la herramienta.',
    },
    {
      kind: 'designMd',
      eyebrow: 'El design.md',
      title: 'Design.md de Mastercard, listo para adjuntar',
      body: 'Sacamos este design.md de getdesign.md/mastercard. Elegimos Mastercard porque es una marca muy conocida del mundo financiero — punto de partida creíble y consistente, sin debate sobre qué representa.',
    },
    {
      kind: 'finding',
      eyebrow: 'Aprendizajes',
      title: 'Lo que llevamos de los cuatro escenarios',
      body: 'Resumen rápido mientras seguimos viendo los resultados en directo.',
      bullets: [
        '1. Detalle: Claude entrega microcopy, datos simulados y jerarquía visual al primer intento. Stitch parte de un layout más esquemático que necesita pasos adicionales.',
        '2. Interactividad: Claude es navegable de fábrica. Stitch produce imágenes estáticas hasta activar «instant prototype».',
        '3. Fuente de marca: el design.md eleva claramente a Stitch. En Claude, URL y design.md son equivalentes — incluso la URL de Mastercard saca un punto más.',
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
    },
    {
      kind: 'ask',
      eyebrow: 'Propuesta',
      title: 'Adoptemos Claude para conceptos de cliente',
      body: 'Planifica el proyecto por tu cuenta (Claude Code o Claude), trae el prompt a Claude con URL o design.md (URL si vas con prisa) e itera ahí mismo. Cuando esté listo, comparte el enlace conmigo y lo adapto para producción.',
    },
    {
      kind: 'close',
      eyebrow: 'Conclusión',
      title: 'Stitch para explorar rápido; Claude para escalar y sobrevivir al handoff',
      body: '¿Preguntas, dudas, contraejemplos? El brief, el prompt y los cuatro resultados están en la rama docs/talk-stitch-vs-claude. Gracias.',
    },
  ];

  readonly index = signal(0);

  // Prompt variant state — which MARCA branch is currently visible and copyable.
  readonly activeVariant = signal<PromptVariantKey>('url');
  readonly copiedVariant = signal<PromptVariantKey | null>(null);
  readonly promptVariantKeys: readonly PromptVariantKey[] = ['url', 'designMd'];
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
