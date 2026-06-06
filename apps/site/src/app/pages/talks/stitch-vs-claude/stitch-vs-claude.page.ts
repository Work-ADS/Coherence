import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '@coherence/ui';

import { LanguageService } from '../../../services/language.service';

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

interface BilingualString {
  es: string;
  en: string;
}

interface MatrixRow {
  tool: string;
  url: string;
  designMd: string;
}

interface BilingualMatrixRow {
  tool: string;
  url: BilingualString;
  designMd: BilingualString;
}

interface MatrixView {
  headers: string[];
  rows: MatrixRow[];
}

interface SlideView {
  kind: SlideKind;
  eyebrow?: string;
  title: string;
  body?: string;
  bullets?: string[];
  callout?: string;
  illustration?: string;
  caption?: string;
  matrix?: MatrixView;
  cta?: { label: string; href: string };
}

interface BilingualSlide {
  kind: SlideKind;
  eyebrow?: BilingualString;
  title: BilingualString;
  body?: BilingualString;
  bullets?: BilingualString[];
  callout?: BilingualString;
  illustration?: string;
  caption?: BilingualString;
  matrix?: {
    headers: BilingualString[];
    rows: BilingualMatrixRow[];
  };
  cta?: { label: BilingualString; href: string };
}

type PromptVariantKey = 'url' | 'designMd';

const PROMPT_BASE: BilingualString = {
  es: `Diseña un planificador de jubilación de dos pantallas para clientes españoles de una firma de asesoramiento patrimonial.

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
- Densidad informativa similar a la imagen adjunta como referencia.`,
  en: `Design a two-screen retirement planner for Spanish clients of a wealth advisory firm.

AUDIENCE
- Adults between 35 and 60 with mid-level financial knowledge.
- Priority: understand in under 30 seconds whether their current plan will reach the desired retirement income.

SCREEN 1 — Data capture
- Current age.
- Target retirement age.
- Accumulated savings in euros.
- Monthly contribution in euros.
- Desired monthly retirement income, in euros.
- Primary button: "Calculate projection".
- Numbers in European format (1.250,50 €) with visible units.

SCREEN 2 — Results
- Headline figure: estimated monthly income at retirement, compared to the target.
- Projection chart of savings growth from today to retirement age.
- Feasibility state: reachable, tight, or not reachable.
- If not reachable, a concrete recommendation (increase the contribution, delay retirement, or adjust the goal) with the quantified delta.
- Secondary button: "Edit data".

STYLE
- Professional, clear tone, no unnecessary financial jargon.
- Positive messages when the plan works; guiding messages when it doesn't.
- Information density similar to the attached reference image.`,
};

const PROMPT_VARIANTS: Record<
  PromptVariantKey,
  { label: string; marca: BilingualString }
> = {
  url: {
    label: 'URL',
    marca: {
      es: `MARCA — fuente: URL adjunta
- Extrae color, tipografía, radios y densidad visibles en la URL adjunta.
- Refleja la marca con fidelidad: jerarquía de botones, contraste, microcopy.
- Si la URL no expone algún token, mantén una paleta sobria coherente con la marca.`,
      en: `BRAND — source: attached URL
- Extract color, typography, radii and density visible at the attached URL.
- Reflect the brand faithfully: button hierarchy, contrast, microcopy.
- If the URL does not expose some token, keep a sober palette consistent with the brand.`,
    },
  },
  designMd: {
    label: 'design.md',
    marca: {
      es: `MARCA — fuente: design.md adjunto
- Aplica todos los tokens y reglas descritos en el design.md adjunto.
- Respeta la paleta, tipografía, radios, espaciado y voz de microcopy que define.
- No introduzcas estilos fuera del design.md, ni inventes tokens.`,
      en: `BRAND — source: attached design.md
- Apply every token and rule described in the attached design.md.
- Respect the palette, typography, radii, spacing and microcopy voice it defines.
- Do not introduce styles outside the design.md, and do not invent tokens.`,
    },
  },
};

function buildPrompt(key: PromptVariantKey, isEn: boolean): string {
  const base = isEn ? PROMPT_BASE.en : PROMPT_BASE.es;
  const marca = isEn ? PROMPT_VARIANTS[key].marca.en : PROMPT_VARIANTS[key].marca.es;
  return `${base}\n\n${marca}`;
}

const SLIDES: BilingualSlide[] = [
  {
    kind: 'cover',
    eyebrow: {
      es: 'Reunión de área · 2026-05-28',
      en: 'Area meeting · 2026-05-28',
    },
    title: {
      es: 'Stitch vs Claude: ¿qué herramienta de IA usamos para conceptos de cliente?',
      en: 'Stitch vs Claude: which AI tool do we use for client concepts?',
    },
    body: {
      es: 'Dos plataformas, el mismo prompt, una recomendación.',
      en: 'Two platforms, the same prompt, one recommendation.',
    },
  },
  {
    kind: 'content',
    eyebrow: { es: 'Herramienta 1', en: 'Tool 1' },
    title: {
      es: 'Stitch — el explorador rápido de Google',
      en: 'Stitch — Google\'s quick explorer',
    },
    body: {
      es: 'Para iterar conceptos en minutos y sacar primeros borradores. Acepta URL, archivo adjunto o prompt enriquecido.',
      en: 'For iterating on concepts in minutes and producing first drafts. Takes a URL, attachment, or enriched prompt.',
    },
    bullets: [
      {
        es: '1. Inicio: URL del cliente, archivo adjunto o prompt enriquecido.',
        en: '1. Start: client URL, attachment, or enriched prompt.',
      },
      {
        es: '2. Sistema de diseño: tres plantillas predefinidas, sin personalización profunda.',
        en: '2. Design system: three preset templates, no deep customization.',
      },
      {
        es: '3. Generar: la salida es estática (imágenes); «instant prototype» las vuelve navegables.',
        en: '3. Generate: the output is static (images); «instant prototype» makes them navigable.',
      },
      {
        es: '4. Vista previa: móvil, tableta o escritorio.',
        en: '4. Preview: mobile, tablet, or desktop.',
      },
      {
        es: '5. Exportación: AI Studio o archivo ZIP.',
        en: '5. Export: AI Studio or ZIP file.',
      },
    ],
    callout: { es: 'Mostrar Stitch en vivo.', en: 'Show Stitch live.' },
  },
  {
    kind: 'content',
    eyebrow: { es: 'Herramienta 2', en: 'Tool 2' },
    title: {
      es: 'Claude — el constructor con sistema de diseño',
      en: 'Claude — the builder with a design system',
    },
    body: {
      es: 'Para arrancar proyectos de cliente con más escala y sofisticación. Diseña interacciones completas y entrega a Claude Code sin pérdidas.',
      en: 'For starting client projects at more scale and with more sophistication. Designs complete interactions and hands off to Claude Code without losses.',
    },
    bullets: [
      {
        es: '1. Inicio: tipo de proyecto (prototipo, presentación, plantilla) y sistema de diseño.',
        en: '1. Start: project type (prototype, deck, template) and design system.',
      },
      {
        es: '2. Modo de fidelidad: esquemático o alta fidelidad (en alta fidelidad se incorpora la marca).',
        en: '2. Fidelity mode: wireframe or high-fidelity (high-fidelity brings in the brand).',
      },
      {
        es: '3. Preguntas de aclaración: con URL pregunta para afinar; con design.md va directo.',
        en: '3. Clarifying questions: with a URL it asks to refine; with a design.md it goes straight in.',
      },
      {
        es: '4. Crear: lienzo vacío para bocetar e iterar sobre el prompt.',
        en: '4. Create: empty canvas to sketch and iterate on the prompt.',
      },
      {
        es: '5. Panel de «tweaks»: densidad, color, layout y velocidad en directo.',
        en: '5. «Tweaks» panel: density, color, layout, and speed live.',
      },
      {
        es: '6. Entrega a Claude Code: un comando traslada tokens y primitivas sin pérdida.',
        en: '6. Handoff to Claude Code: one command moves tokens and primitives across without loss.',
      },
    ],
    callout: { es: 'Mostrar Claude en vivo.', en: 'Show Claude live.' },
  },
  {
    kind: 'content',
    eyebrow: { es: 'El caso', en: 'The case' },
    title: {
      es: 'Planificador de jubilación de dos pantallas, inspirado en Mutualidad',
      en: 'Two-screen retirement planner, inspired by Mutualidad',
    },
    body: {
      es: 'Uno de los simuladores más simples: unas preguntas y un resumen. Real y reconocible, sin sobrecomplicar.',
      en: 'One of the simplest simulators: a few questions and a summary. Real and recognizable, without over-complicating.',
    },
    illustration: '/talks/stitch-vs-claude/reference/planificador-jubilacion.png',
    caption: {
      es: 'Mutualidad — Planificador de jubilación (Release candidate 24). Sirve como referencia estructural.',
      en: 'Mutualidad — Retirement planner (Release candidate 24). Used as a structural reference.',
    },
  },
  {
    kind: 'prompt',
    eyebrow: { es: 'El prompt', en: 'The prompt' },
    title: {
      es: 'Mismo texto. Cambia solo la fuente de marca.',
      en: 'Same text. Only the brand source changes.',
    },
    body: {
      es: 'Probamos dos productos y dos fuentes de contexto: URL cuando aún no conocemos al cliente, y design.md cuando lo construimos nosotros (como hace el equipo de diseño). El resultado depende del contexto que demos a la IA, no solo de la herramienta.',
      en: 'We tested two products and two sources of context: URL when we don\'t yet know the client, and design.md when we build it ourselves (as the design team does). The result depends on the context we give the AI, not just on the tool.',
    },
  },
  {
    kind: 'matrix',
    eyebrow: { es: 'La matriz', en: 'The matrix' },
    title: {
      es: 'Cuatro escenarios: misma pregunta, distintas fuentes de marca',
      en: 'Four scenarios: same question, different brand sources',
    },
    body: {
      es: 'Cómo se comporta cada herramienta cuando la marca llega como URL o como design.md externo.',
      en: 'How each tool behaves when the brand arrives as a URL or as an external design.md.',
    },
    matrix: {
      headers: [
        { es: 'Herramienta', en: 'Tool' },
        { es: 'URL', en: 'URL' },
        { es: 'design.md', en: 'design.md' },
      ],
      rows: [
        {
          tool: 'Stitch',
          url: { es: 'Escenario 1', en: 'Scenario 1' },
          designMd: { es: 'Escenario 3', en: 'Scenario 3' },
        },
        {
          tool: 'Claude',
          url: { es: 'Escenario 2', en: 'Scenario 2' },
          designMd: { es: 'Escenario 4', en: 'Scenario 4' },
        },
      ],
    },
    callout: {
      es: 'Si el resultado mejora entre escenarios, la mejora viene del contexto de marca, no de la herramienta.',
      en: 'If the result improves across scenarios, the improvement comes from the brand context, not the tool.',
    },
  },
  {
    kind: 'designMd',
    eyebrow: { es: 'El design.md', en: 'The design.md' },
    title: {
      es: 'Design.md de Mastercard, listo para adjuntar',
      en: 'Mastercard design.md, ready to attach',
    },
    body: {
      es: 'Sacamos este design.md de getdesign.md/mastercard. Elegimos Mastercard porque es una marca muy conocida del mundo financiero — punto de partida creíble y consistente, sin debate sobre qué representa.',
      en: 'We pulled this design.md from getdesign.md/mastercard. We chose Mastercard because it is a well-known financial-world brand — a credible, consistent starting point with no debate about what it represents.',
    },
  },
  {
    kind: 'content',
    eyebrow: { es: 'La entrega', en: 'The handoff' },
    title: {
      es: 'Claude llega al código sin pérdida; Stitch reescribe por el camino',
      en: 'Claude reaches code without loss; Stitch rewrites along the way',
    },
    body: {
      es: 'Es el punto donde el concepto deja de ser una imagen y pasa a producción. Aquí pesa más el flujo que la herramienta.',
      en: 'This is the point where the concept stops being an image and moves to production. The flow weighs more than the tool here.',
    },
    bullets: [
      {
        es: 'De Claude a Claude Code: un comando traslada tokens, primitivas y estructura sin pérdida.',
        en: 'From Claude to Claude Code: one command carries tokens, primitives, and structure across without loss.',
      },
      {
        es: 'De Stitch a AI Studio o archivo ZIP: la marca y la interactividad se degradan, y desarrollo termina rehaciendo trabajo.',
        en: 'From Stitch to AI Studio or a ZIP file: the brand and interactivity degrade, and engineering ends up redoing work.',
      },
      {
        es: 'Si el concepto va a producción, la entrega decide qué herramienta usamos.',
        en: 'If the concept is heading to production, the handoff decides which tool we use.',
      },
    ],
  },
  {
    kind: 'finding',
    eyebrow: { es: 'Aprendizajes', en: 'Findings' },
    title: {
      es: 'Lo que llevamos de los cuatro escenarios',
      en: 'What we take from the four scenarios',
    },
    bullets: [
      {
        es: '1. Interactividad. Claude es navegable de fábrica. Stitch produce imágenes estáticas hasta que se activa «instant prototype».',
        en: '1. Interactivity. Claude is navigable out of the box. Stitch produces static images until «instant prototype» is turned on.',
      },
      {
        es: '2. Fuente de marca. En Stitch, el design.md gana con claridad. En Claude, la URL de Mastercard da el mejor resultado porque la herramienta pregunta para afinar; el design.md entra directo, de una sola pasada. Cuanto más ordenadas lleguen las decisiones de UX/UI, mejor sale el resultado.',
        en: '2. Brand source. In Stitch, the design.md wins clearly. In Claude, Mastercard\'s URL gives the best result because the tool asks to refine; the design.md goes straight in, in one pass. The more organized the UX/UI decisions arrive, the better the result.',
      },
      {
        es: '3. Entrega. Solo Claude conserva la fidelidad al pasar a Claude Code. Stitch exporta a AI Studio o a un archivo ZIP, y parte del estilo se pierde por el camino.',
        en: '3. Handoff. Only Claude keeps fidelity when moving to Claude Code. Stitch exports to AI Studio or a ZIP file, and part of the style is lost on the way.',
      },
      {
        es: '4. Iteración. Trabajamos sobre un prototipo vivo que se conecta sin fricción con nuestro flujo principal.',
        en: '4. Iteration. We work on a live prototype that connects to our main flow without friction.',
      },
    ],
    callout: {
      es: 'Ver la interactividad e iterar sobre ella es como llegamos a un buen diseño.',
      en: 'Seeing interactivity and iterating on it is how we reach a good design.',
    },
  },
  {
    kind: 'ask',
    eyebrow: { es: 'Propuesta', en: 'Proposal' },
    title: {
      es: 'Adoptemos Claude para conceptos de cliente',
      en: 'Let\'s adopt Claude for client concepts',
    },
    body: {
      es: 'Planificamos el proyecto por nuestra cuenta (Claude Code u open-code), llevamos el prompt a Claude Design con URL o con design.md —URL si vamos con prisa— e iteramos ahí mismo. Cuando esté listo, lo paso a producción.',
      en: 'We plan the project on our own (Claude Code or open-code), bring the prompt into Claude Design with a URL or with a design.md — URL if we are in a hurry — and iterate there. When it\'s ready, I take it to production.',
    },
    cta: {
      label: { es: 'Ver los demos', en: 'See the demos' },
      href: '/demos',
    },
  },
  {
    kind: 'close',
    eyebrow: { es: 'Conclusión', en: 'Conclusion' },
    title: {
      es: 'Stitch para explorar rápido; Claude para escalar y llegar al código',
      en: 'Stitch for fast exploration; Claude to scale and reach the code',
    },
    bullets: [
      {
        es: '1. Stitch: para explorar rápido y sacar primeros borradores.',
        en: '1. Stitch: for fast exploration and first drafts.',
      },
      {
        es: '2. Claude: para conceptos que escalan y llegan a Claude Code sin perder fidelidad.',
        en: '2. Claude: for concepts that scale and reach Claude Code without losing fidelity.',
      },
      {
        es: '3. El contexto importa más que la herramienta: URL, design.md y claridad de UX/UI elevan cualquier resultado.',
        en: '3. Context matters more than the tool: URL, design.md, and UX/UI clarity lift any result.',
      },
    ],
  },
];

/**
 * Stitch vs Claude Code — talk slide-show.
 *
 * Self-paced, arrow-key-driven slide-show served at /talks/stitch-vs-claude.
 * Doubles as (a) speaker guide during the 2026-05-28 department talk and
 * (b) draft blog post in the growth.design case-study format.
 *
 * Bilingual: content shape carries { es, en } for every prose field. The
 * resolved slides come out of a computed signal tied to LanguageService —
 * matches the home page / blog landing pattern.
 */
@Component({
  selector: 'site-stitch-vs-claude-talk',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
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
  private readonly language = inject(LanguageService);
  readonly lang = this.language.lang;

  readonly slides = computed<SlideView[]>(() => {
    const isEn = this.lang() === 'en';
    const pick = (s: BilingualString) => (isEn ? s.en : s.es);
    return SLIDES.map<SlideView>((s) => ({
      kind: s.kind,
      eyebrow: s.eyebrow ? pick(s.eyebrow) : undefined,
      title: pick(s.title),
      body: s.body ? pick(s.body) : undefined,
      bullets: s.bullets?.map(pick),
      callout: s.callout ? pick(s.callout) : undefined,
      illustration: s.illustration,
      caption: s.caption ? pick(s.caption) : undefined,
      matrix: s.matrix
        ? {
            headers: s.matrix.headers.map(pick),
            rows: s.matrix.rows.map((r) => ({
              tool: r.tool,
              url: pick(r.url),
              designMd: pick(r.designMd),
            })),
          }
        : undefined,
      cta: s.cta ? { label: pick(s.cta.label), href: s.cta.href } : undefined,
    }));
  });

  // Chrome strings that vary by language: section labels around the prompt
  // block, the design.md block, and the talk-shell nav buttons.
  readonly chrome = computed(() => {
    const isEn = this.lang() === 'en';
    return {
      promptLabel: isEn
        ? 'Prompt — retirement planner'
        : 'Prompt — planificador de jubilación',
      promptVariantsAriaLabel: isEn
        ? 'Copy prompt variant'
        : 'Copiar variante del prompt',
      copied: isEn ? 'Copied' : 'Copiado',
      designMdActionsAriaLabel: isEn
        ? 'design.md actions'
        : 'Acciones del design.md',
      copy: isEn ? 'Copy' : 'Copiar',
      download: isEn ? 'Download' : 'Descargar',
      navAriaLabel: isEn ? 'Slide navigation' : 'Navegación de diapositivas',
      previous: isEn ? '← Previous' : '← Anterior',
      next: isEn ? 'Next →' : 'Siguiente →',
      previousAria: isEn ? 'Previous slide' : 'Diapositiva anterior',
      nextAria: isEn ? 'Next slide' : 'Siguiente diapositiva',
      exitLabel: isEn ? 'Exit' : 'Salir',
      exitAria: isEn
        ? 'Exit the presentation and return to Coherence'
        : 'Salir de la presentación y volver a Coherence',
      designMdCopyAria: (copied: boolean) =>
        copied
          ? isEn
            ? 'design.md copied to clipboard'
            : 'Design.md copiado al portapapeles'
          : isEn
            ? 'Copy design.md to clipboard'
            : 'Copiar design.md al portapapeles',
      designMdAria: isEn ? 'Download design-mastercard.md' : 'Descargar design-mastercard.md',
      copyVariantAria: (label: string, copied: boolean) =>
        copied
          ? isEn
            ? `Variant ${label} copied`
            : `Variante ${label} copiada`
          : isEn
            ? `Copy variant ${label}`
            : `Copiar variante ${label}`,
    };
  });

  readonly index = signal(0);

  // Prompt variant state — which BRAND branch is currently visible and copyable.
  readonly activeVariant = signal<PromptVariantKey>('url');
  readonly copiedVariant = signal<PromptVariantKey | null>(null);
  readonly promptVariantKeys: readonly PromptVariantKey[] = ['url', 'designMd'];
  readonly promptVariants = PROMPT_VARIANTS;

  readonly activePromptBody = computed(() =>
    buildPrompt(this.activeVariant(), this.lang() === 'en'),
  );

  // Design.md content is fetched from the public asset on first paint.
  readonly designMdContent = signal<string>('');
  readonly designMdCopied = signal(false);
  readonly designMdDownloadHref = DESIGN_MD_PATH;

  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;
  private designMdCopyResetTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const loadingMsg = this.lang() === 'en' ? 'Loading design.md…' : 'Cargando design.md…';
    this.designMdContent.set(loadingMsg);
    afterNextRender(() => {
      void this.loadDesignMd();
    });
  }

  private async loadDesignMd(): Promise<void> {
    const isEn = this.lang() === 'en';
    const errorMsg = isEn
      ? 'Could not load design.md. Attach it manually from talks/stitch-vs-claude/design-mastercard.md.'
      : 'No se pudo cargar el design.md. Adjúntalo manualmente desde talks/stitch-vs-claude/design-mastercard.md.';
    try {
      const res = await fetch(DESIGN_MD_PATH, { cache: 'force-cache' });
      if (res.ok) {
        this.designMdContent.set(await res.text());
      } else {
        this.designMdContent.set(errorMsg);
      }
    } catch {
      this.designMdContent.set(errorMsg);
    }
  }

  // `index` is always guarded inside the bounds of `slides` by prev/next/goTo,
  // so the non-null assertion is safe and avoids SlideView | undefined narrowing
  // headaches in the template (strict templates + noUncheckedIndexedAccess).
  readonly current = computed(() => this.slides()[this.index()]!);
  readonly total = computed(() => this.slides().length);
  readonly isFirst = computed(() => this.index() === 0);
  readonly isLast = computed(() => this.index() === this.slides().length - 1);
  readonly progressPct = computed(() =>
    Math.round(((this.index() + 1) / this.slides().length) * 100),
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
    if (target < 0 || target >= this.slides().length) return;
    this.index.set(target);
  }

  goToLast(): void {
    this.index.set(this.slides().length - 1);
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
    const text = buildPrompt(key, this.lang() === 'en');
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
