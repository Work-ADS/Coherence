import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { TabsV2Component, TabV2Component } from '@coherence/ui';

import { HyperTextDirective } from '../../directives/hyper-text.directive';
import { LanguageService } from '../../services/language.service';

/**
 * A single principle: bold title + a short gloss (blocks 4–5).
 */
interface Principle {
  title: string;
  desc: string;
}

/**
 * One strategy block: a label (what it is) + payoff (what it earns us), and
 * either a marquee statement (blocks 2–3) or a list of principles (blocks 4–5).
 */
interface Block {
  label: string;
  payoff: string;
  statement?: string;
  principles?: Principle[];
}

/**
 * The mission hero. The statement is split so one word — clara / clearer, the
 * word that *means* clear — can be rendered as frosted glass inline.
 */
interface Hero {
  label: string;
  payoff: string;
  pre: string;
  glass: string;
  post: string;
}

/**
 * One of the 11 numbered design principles (Design Principles PDF). The aside
 * is the labelled list the PDF prints alongside some principles (PREFER,
 * QUESTIONS TO ASK, REMOVE…). Principles 09–11 have no aside.
 */
interface DesignPrinciple {
  n: string;
  title: string;
  desc: string;
  asideLabel?: string;
  asideItems?: string[];
}

/** One benchmark product + the aspects we reference it for. */
interface Benchmark {
  name: string;
  referenceFor: string[];
}

/** One anti-pattern to avoid + why, with an optional list of specifics. */
interface AntiPattern {
  name: string;
  desc: string;
  items?: string[];
}

/** The four tab labels. */
interface TabsCopy {
  brand: string;
  principles: string;
  benchmark: string;
  avoid: string;
}

/** A short question + one-line answer (the Principles getting-started row). */
interface QA {
  q: string;
  a: string;
}

interface Copy {
  eyebrow: string;
  scrollCue: string;
  hero: Hero;
  tabs: TabsCopy;
  blocks: Block[];
  designPrinciples: { eyebrow: string; gettingStarted: QA[]; items: DesignPrinciple[] };
  benchmark: { intro: string; referenceLabel: string; items: Benchmark[] };
  avoid: {
    intro: string;
    items: AntiPattern[];
    filterLabel: string;
    filterIntro: string;
    filter: string[];
  };
}

/**
 * Brand strategy — internal brand-strategy narrative.
 *
 * A full-viewport black-and-white mission hero (the statement at display scale
 * with the word clara / clearer as a CSS frosted-glass lozenge — form = meaning),
 * then an `afi-tabs` bar organising the rest into four panels: Brand strategy
 * (the editorial narrative blocks), Principios (the 11 Afi Next design
 * principles), Benchmark (reference products), and Qué evitar (anti-patterns +
 * the decision filter). Sources: docs/brand/brand-strategy.md and the Design
 * Principles / Benchmarks & What to Avoid Figma boards.
 *
 * Bilingual: mirrors the site-wide LanguageService (the ES/EN toggle). The glass
 * word stays real DOM text, so it swaps with the locale. Spanish is usted
 * register.
 *
 * Built on the identity-v2 modern foundation (data-foundation="modern": IBM
 * Plex Sans, --type-*, --content-* colours). The dark hero inverts the two
 * neutral endpoints (--content-primary as background, --content-inverse as
 * text) via component-scoped aliases, since the modern set has no authored
 * dark-neutral surface yet. Token-only — the clean-code hook blocks raw values.
 */
@Component({
  selector: 'site-estrategia-marca-page',
  standalone: true,
  imports: [TabsV2Component, TabV2Component, HyperTextDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estrategia-marca.page.html',
  styleUrls: ['./estrategia-marca.page.scss'],
})
export class EstrategiaMarcaPage {
  private readonly language = inject(LanguageService);
  readonly isEn = computed(() => this.language.lang() === 'en');

  readonly content = computed<Copy>(() => (this.isEn() ? EN : ES));

  readonly activeTab = signal(0);
}

const ES: Copy = {
  eyebrow: 'Estrategia de marca',
  scrollCue: 'Desplázate',
  hero: {
    label: 'Nuestra misión',
    payoff: 'Por qué existimos',
    pre: 'Una forma más ',
    glass: 'clara',
    post: ' de tomar grandes decisiones',
  },
  tabs: {
    brand: 'Estrategia de marca',
    principles: 'Principios',
    benchmark: 'Benchmark',
    avoid: 'Qué evitar',
  },
  blocks: [
    {
      label: 'Qué somos',
      payoff: 'Esto nos hace relevantes',
      statement: 'Construimos la mejor forma de planificar, gestionar y entender su patrimonio',
    },
    {
      label: 'Qué creemos',
      payoff: 'Esto nos hace diferentes',
      statement: 'Nadie debería sentirse perdido con su propio dinero',
    },
    {
      label: 'Cómo construimos',
      payoff: 'Esto nos hace creíbles',
      principles: [
        {
          title: 'Hacer claras las grandes decisiones',
          desc: 'convertir modelos complejos en respuestas que cualquiera entiende.',
        },
        {
          title: 'Mostrar el panorama completo',
          desc: 'explicar desde el principio los supuestos, las contrapartidas y la incertidumbre.',
        },
        {
          title: 'Poner a las personas al mando',
          desc: 'dejar que exploren escenarios, comparen opciones y vean qué cambia.',
        },
        {
          title: 'Construir para las decisiones que importan',
          desc: 'ser rigurosos y fiables, y estar preparados para el mundo real.',
        },
      ],
    },
    {
      label: 'Cómo comunicamos',
      payoff: 'Esto nos hace memorables',
      principles: [
        {
          title: 'Empezar por el resultado',
          desc: 'decir qué significa antes de explicar cómo funciona.',
        },
        {
          title: 'Hacer que los números signifiquen algo',
          desc: 'convertir los datos en un relato fácil de seguir.',
        },
        {
          title: 'Hablar con claridad y seguridad',
          desc: 'emplear un lenguaje sencillo sin renunciar al rigor.',
        },
        {
          title: 'Transmitir calma y optimismo',
          desc: 'reconocer lo que está en juego y hacer sentir que avanzar es posible.',
        },
      ],
    },
  ],
  designPrinciples: {
    eyebrow: 'Para empezar',
    gettingStarted: [
      {
        q: '¿Qué son los principios de diseño?',
        a: 'Enunciados claros que ayudan a los equipos a decidir y a resolver contrapartidas de forma coherente al diseñar.',
      },
      {
        q: '¿Por qué usarlos?',
        a: 'Mantienen la resolución de problemas cohesionada: eficiente, coherente y centrada en el usuario.',
      },
      {
        q: '¿Quién los usa?',
        a: 'Equipos de producto, de sistema de diseño y de marca: cualquiera que busque decisiones compartidas y repetibles.',
      },
    ],
    items: [
      {
        n: '01',
        title: 'Densidad de información sin densidad visual',
        desc: 'Mostrar gran cantidad de información manteniendo la calma visual. La densidad nace de la organización, no de la compresión. Cada pantalla debe seguir siendo fácil de escanear, sea cual sea el volumen de datos.',
        asideLabel: 'Preguntas que hacerse',
        asideItems: [
          '¿Puede mostrarse más información sin que la interfaz se sienta más pesada?',
          '¿Puede la jerarquía sustituir al espacio en blanco en lugar de eliminar información?',
        ],
      },
      {
        n: '02',
        title: 'Compacto por defecto',
        desc: 'Cada componente debe ocupar solo el espacio que realmente necesita. Nunca reduzca la tipografía por debajo de una lectura cómoda. El espacio en blanco es intencionado, no generoso.',
        asideLabel: 'Preferir',
        asideItems: [
          'Controles más pequeños',
          'Espaciados más ajustados',
          'Diálogos más cortos',
          'Barras de herramientas condensadas',
        ],
      },
      {
        n: '03',
        title: 'Interfaces en calma',
        desc: 'La interfaz nunca debe competir con el trabajo del usuario. El color se usa con moderación. Cada pantalla debe sentirse tranquila.',
        asideLabel: 'El énfasis visual viene de',
        asideItems: ['Jerarquía', 'Espaciado', 'Tipografía', 'Movimiento'],
      },
      {
        n: '04',
        title: 'Minimalismo funcional',
        desc: 'Cada elemento visible debe justificar su existencia. Los flujos complejos son aceptables; los visuales complejos, no.',
        asideLabel: 'Eliminar',
        asideItems: [
          'Bordes decorativos',
          'Etiquetas innecesarias',
          'Acciones duplicadas',
          'Iconos redundantes',
          'Ruido visual',
        ],
      },
      {
        n: '05',
        title: 'Divulgación progresiva',
        desc: 'Exponga la complejidad solo cuando el usuario la pida. Primero la vista general. Después, el detalle. Luego, la edición. Por último, la configuración avanzada.',
        asideLabel: 'Ejemplos',
        asideItems: [
          'Tablas expandibles',
          'Paneles laterales',
          'Diálogos',
          'Acciones contextuales',
          'Filtros progresivos',
        ],
      },
      {
        n: '06',
        title: 'Consistencia antes que novedad',
        desc: 'El usuario aprende un patrón una vez. Cada interacción similar se comporta de forma idéntica. Nunca invente una interacción nueva cuando ya existe una que resuelve el problema.',
        asideLabel: 'Se aplica a',
        asideItems: ['Botones', 'Diálogos', 'Tablas', 'Filtros', 'Navegación', 'Animaciones'],
      },
      {
        n: '07',
        title: 'El movimiento explica el estado',
        desc: 'La animación existe para comunicar. Nunca anime solo por decorar. Las animaciones deben ser sutiles y rápidas.',
        asideLabel: 'El movimiento explica',
        asideItems: ['Jerarquía', 'Navegación', 'Causa y efecto', 'Carga', 'Éxito', 'Foco'],
      },
      {
        n: '08',
        title: 'El color comunica significado',
        desc: 'El color se reserva para la información. Evite usarlo solo para aumentar el interés visual. Las interfaces neutras envejecen mejor.',
        asideLabel: 'Usos principales',
        asideItems: ['Estados semánticos', 'Objetos seleccionados', 'Gráficos', 'Acciones principales'],
      },
      {
        n: '09',
        title: 'Empresa no significa anticuado',
        desc: 'El software financiero debe sentirse contemporáneo. La experiencia debe parecerse al mejor software de productividad, no al software empresarial heredado. La profesionalidad se logra con refinamiento, no con conservadurismo.',
      },
      {
        n: '10',
        title: 'Construir sistemas, no pantallas',
        desc: 'Cada pantalla se ensambla con bloques reutilizables. Cada decisión debe mejorar el sistema de diseño antes que una página concreta. Los componentes siempre tienen prioridad sobre las soluciones puntuales.',
      },
      {
        n: '11',
        title: 'Contexto antes que páginas',
        desc: 'La navegación existe para preservar el contexto. El usuario debe permanecer en su flujo de trabajo siempre que sea posible. Prefiera paneles laterales, divulgación progresiva, edición en línea, tarjetas expandibles y acciones contextuales antes que transiciones de página innecesarias. Reserve la navegación a página completa para tareas fundamentalmente distintas.',
      },
    ],
  },
  benchmark: {
    intro:
      'Productos que tomamos como referencia. Cada uno marca el listón en un aspecto concreto de la experiencia.',
    referenceLabel: 'Referencia para',
    items: [
      {
        name: 'Wise',
        referenceFor: [
          'Color',
          'Gráficos e ilustración',
          'Microinteracciones',
          'Animación en micromomentos',
        ],
      },
      {
        name: 'Cursor',
        referenceFor: [
          'Controles compactos',
          'Navegación mínima',
          'Densidad',
          'Espaciado',
          'Color contenido',
          'Sombras sutiles',
        ],
      },
      {
        name: 'Granola',
        referenceFor: ['Tipografía', 'Jerarquía', 'Diálogos', 'Campos pulidos', 'Diseños en calma'],
      },
      {
        name: 'Shopify',
        referenceFor: [
          'Cuadros de mando',
          'Tarjetas',
          'Analítica',
          'Gráficos',
          'Información financiera',
          'Pulido de interacciones',
        ],
      },
      {
        name: 'Clerk',
        referenceFor: [
          'Flujos de autenticación',
          'Tarjetas',
          'Menús',
          'Diálogos',
          'Microinteracciones',
        ],
      },
      {
        name: 'Vercel',
        referenceFor: [
          'Estructura de página',
          'Pestañas',
          'Superficies de comando',
          'Herramientas para desarrolladores',
          'Interfaces mínimas',
        ],
      },
      {
        name: 'Notion',
        referenceFor: [
          'Jerarquía de navegación',
          'Arquitectura de la información',
          'Divulgación progresiva',
          'Contenido anidado',
        ],
      },
      {
        name: 'Resend',
        referenceFor: ['Menús', 'Paletas de comandos', 'Composición de desplegables', 'Espaciado'],
      },
      {
        name: 'Linear',
        referenceFor: [
          'Calidad de interacción',
          'Capacidad de respuesta',
          'Precisión',
          'Flujos centrados en el teclado',
        ],
      },
    ],
  },
  avoid: {
    intro: 'Antipatrones que mantenemos fuera de Afi Next, y por qué.',
    items: [
      {
        name: 'Material Design',
        desc: 'Los controles sobredimensionados, la elevación excesiva, el espaciado generoso y el aspecto genérico de Android minan la precisión que espera el usuario profesional.',
        items: [
          'Controles sobredimensionados',
          'Elevación excesiva',
          'Espaciado generoso',
          'Aspecto genérico de Android',
        ],
      },
      {
        name: 'Glassmorphism excesivo',
        desc: 'El software financiero debe seguir siendo nítido. Las superficies borrosas, translúcidas o con brillo ocultan los datos.',
        items: ['Superficies borrosas', 'Tarjetas translúcidas', 'Efectos de brillo'],
      },
      {
        name: 'Gradientes excesivos',
        desc: 'Los gradientes pueden aparecer solo en el onboarding, los estados vacíos o los diálogos de marketing. Nunca como elementos estructurales de la interfaz.',
      },
      {
        name: 'Cuadros de mando sobrecoloreados',
        desc: 'Evite los cuadros de mando en los que cada KPI tiene su propio color saturado. Use la jerarquía antes que el color.',
      },
      {
        name: 'Esquinas demasiado redondeadas',
        desc: 'Evite la estética lúdica de producto de consumo. El radio debe ser contenido y sistemático.',
      },
      {
        name: 'Iconos decorativos',
        desc: 'Los iconos apoyan el reconocimiento; no decoran el diseño. Cada icono debe justificar su presencia.',
      },
      {
        name: 'Grandes espacios vacíos',
        desc: 'El espacio en blanco debe mejorar la comprensión, no señalar lujo. Al usuario profesional le beneficia la densidad.',
      },
      {
        name: 'Navegación oculta',
        desc: 'Los flujos de trabajo principales deben ser localizables de inmediato. No sacrifique la eficiencia por la limpieza visual.',
      },
    ],
    filterLabel: 'Filtro de decisión',
    filterIntro: 'Antes de introducir cualquier elemento de interfaz, pregúntese:',
    filter: [
      '¿Reduce el esfuerzo cognitivo?',
      '¿Mejora la velocidad de lectura?',
      '¿Puede resolverlo un componente existente?',
      '¿El color comunica información?',
      '¿Puede convertirse en un componente reutilizable?',
      '¿Tomarían esta decisión Cursor, Granola o Shopify?',
      '¿Aumenta la confianza?',
      '¿Elimina clics innecesarios?',
      '¿Seguirá pareciendo moderno dentro de cinco años?',
      '¿Da soporte a flujos de trabajo a escala empresarial?',
    ],
  },
};

const EN: Copy = {
  eyebrow: 'Brand strategy',
  scrollCue: 'Scroll',
  hero: {
    label: 'Our mission',
    payoff: 'Why we exist',
    pre: 'A ',
    glass: 'clearer',
    post: ' way to make big decisions',
  },
  tabs: {
    brand: 'Brand strategy',
    principles: 'Principles',
    benchmark: 'Benchmark',
    avoid: 'What to avoid',
  },
  blocks: [
    {
      label: 'What we are',
      payoff: 'This makes us relevant',
      statement: 'Building the best way to plan, manage, understand your wealth',
    },
    {
      label: 'What we believe',
      payoff: 'This makes us different',
      statement: 'You should never feel lost about your own money',
    },
    {
      label: 'How we deliver',
      payoff: 'This makes us credible',
      principles: [
        {
          title: 'Make big decisions clear',
          desc: 'turn complex models into answers people can understand.',
        },
        {
          title: 'Show the full picture',
          desc: 'make assumptions, trade-offs, and uncertainty clear upfront.',
        },
        {
          title: 'Put people in control',
          desc: 'let people explore scenarios, compare options, and see what changes.',
        },
        {
          title: 'Build for decisions that matter',
          desc: 'be rigorous, reliable, and ready for the real world.',
        },
      ],
    },
    {
      label: 'How we communicate',
      payoff: 'This makes us memorable',
      principles: [
        {
          title: 'Start with the outcome',
          desc: 'say what it means before explaining how it works.',
        },
        {
          title: 'Make numbers mean something',
          desc: 'turn data into a story people can follow.',
        },
        {
          title: 'Speak clearly and confidently',
          desc: 'use plain language, without losing the expertise.',
        },
        {
          title: 'Be calm and optimistic',
          desc: 'acknowledge what is at stake and make the way forward feel possible.',
        },
      ],
    },
  ],
  designPrinciples: {
    eyebrow: 'Getting started',
    gettingStarted: [
      {
        q: 'What are design principles?',
        a: 'Clear statements that help teams make consistent decisions and trade-offs when designing.',
      },
      {
        q: 'Why use them?',
        a: 'They keep problem-solving cohesive — efficient, consistent, and centred on the user.',
      },
      {
        q: 'Who uses them?',
        a: 'Product, design-system, and brand teams — anyone who wants shared, repeatable decisions.',
      },
    ],
    items: [
      {
        n: '01',
        title: 'Information density without visual density',
        desc: 'Show a large amount of information while maintaining visual calm. Density comes from organization rather than compression. Every screen should remain highly scannable regardless of the amount of data displayed.',
        asideLabel: 'Questions to ask',
        asideItems: [
          'Can more information be shown without making the interface feel heavier?',
          'Can hierarchy replace whitespace instead of removing information?',
        ],
      },
      {
        n: '02',
        title: 'Compact by default',
        desc: 'Components should occupy only the space they genuinely require. Never shrink typography below comfortable readability. Whitespace exists intentionally rather than generously.',
        asideLabel: 'Prefer',
        asideItems: ['Smaller controls', 'Tighter paddings', 'Shorter dialogs', 'Condensed toolbars'],
      },
      {
        n: '03',
        title: 'Calm interfaces',
        desc: "The interface should never compete with the user's work. Color is used sparingly. Every screen should feel quiet.",
        asideLabel: 'Visual emphasis from',
        asideItems: ['Hierarchy', 'Spacing', 'Typography', 'Motion'],
      },
      {
        n: '04',
        title: 'Functional minimalism',
        desc: 'Every visible element must justify its existence. Complex workflows are acceptable. Complex visuals are not.',
        asideLabel: 'Remove',
        asideItems: [
          'Decorative borders',
          'Unnecessary labels',
          'Duplicate actions',
          'Redundant icons',
          'Visual noise',
        ],
      },
      {
        n: '05',
        title: 'Progressive disclosure',
        desc: 'Only expose complexity when the user requests it. Overview first. Details second. Editing third. Advanced configuration last.',
        asideLabel: 'Examples',
        asideItems: [
          'Expandable tables',
          'Drawers',
          'Dialogs',
          'Contextual actions',
          'Progressive filters',
        ],
      },
      {
        n: '06',
        title: 'Consistency above novelty',
        desc: 'Users should learn a pattern once. Every similar interaction behaves identically. Never invent a new interaction when an existing one solves the problem.',
        asideLabel: 'Applies to',
        asideItems: ['Buttons', 'Dialogs', 'Tables', 'Filters', 'Navigation', 'Animations'],
      },
      {
        n: '07',
        title: 'Motion explains state',
        desc: 'Animation exists to communicate. Never animate purely for decoration. Animations should remain subtle and fast.',
        asideLabel: 'Motion explains',
        asideItems: ['Hierarchy', 'Navigation', 'Cause and effect', 'Loading', 'Success', 'Focus'],
      },
      {
        n: '08',
        title: 'Color communicates meaning',
        desc: 'Color is reserved for information. Avoid using color simply to increase visual interest. Neutral interfaces age better.',
        asideLabel: 'Primary uses',
        asideItems: ['Semantic states', 'Selected objects', 'Charts', 'Primary actions'],
      },
      {
        n: '09',
        title: 'Enterprise does not mean outdated',
        desc: 'Financial software should feel contemporary. The experience should resemble the best productivity software rather than legacy enterprise software. Professionalism is achieved through refinement rather than conservatism.',
      },
      {
        n: '10',
        title: 'Build systems, not screens',
        desc: 'Every screen is assembled from reusable building blocks. Every decision should improve the design system before improving an individual page. Components always take priority over one-off solutions.',
      },
      {
        n: '11',
        title: 'Context over pages',
        desc: 'Navigation exists to preserve context. Users should remain within their current workflow whenever possible. Prefer drawers, progressive disclosure, inline editing, expandable cards, and contextual actions over unnecessary page transitions. Reserve full-page navigation for fundamentally different tasks.',
      },
    ],
  },
  benchmark: {
    intro: 'The products we reference. Each one sets the bar on a specific aspect of the experience.',
    referenceLabel: 'Reference for',
    items: [
      {
        name: 'Wise',
        referenceFor: [
          'Color',
          'Graphics & illustration',
          'Micro-interactions',
          'Micro-moment animation',
        ],
      },
      {
        name: 'Cursor',
        referenceFor: [
          'Compact controls',
          'Minimal navigation',
          'Density',
          'Spacing',
          'Restrained color',
          'Subtle shadows',
        ],
      },
      {
        name: 'Granola',
        referenceFor: ['Typography', 'Hierarchy', 'Dialogs', 'Polished inputs', 'Calm layouts'],
      },
      {
        name: 'Shopify',
        referenceFor: [
          'Dashboards',
          'Cards',
          'Analytics',
          'Graphs',
          'Financial information',
          'Interaction polish',
        ],
      },
      {
        name: 'Clerk',
        referenceFor: ['Authentication flows', 'Cards', 'Menus', 'Dialogs', 'Micro-interactions'],
      },
      {
        name: 'Vercel',
        referenceFor: [
          'Page structure',
          'Tabs',
          'Command surfaces',
          'Developer tooling',
          'Minimal interfaces',
        ],
      },
      {
        name: 'Notion',
        referenceFor: [
          'Navigation hierarchy',
          'Information architecture',
          'Progressive disclosure',
          'Nested content',
        ],
      },
      {
        name: 'Resend',
        referenceFor: ['Menus', 'Command palettes', 'Dropdown composition', 'Spacing'],
      },
      {
        name: 'Linear',
        referenceFor: [
          'Interaction quality',
          'Responsiveness',
          'Precision',
          'Keyboard-first workflows',
        ],
      },
    ],
  },
  avoid: {
    intro: 'Anti-patterns we keep out of Afi Next, and why.',
    items: [
      {
        name: 'Material Design',
        desc: 'Oversized controls, excessive elevation, generous spacing, and a generic Android appearance undermine the precision enterprise users expect.',
        items: [
          'Oversized controls',
          'Excessive elevation',
          'Generous spacing',
          'Generic Android appearance',
        ],
      },
      {
        name: 'Heavy glassmorphism',
        desc: 'Financial software should remain crisp. Blurred, translucent, or glowing surfaces obscure data.',
        items: ['Blurred surfaces', 'Translucent cards', 'Glowing effects'],
      },
      {
        name: 'Excessive gradients',
        desc: 'Gradients may appear in onboarding, empty states, or marketing dialogs only. Never as structural UI elements.',
      },
      {
        name: 'Colorful enterprise dashboards',
        desc: 'Avoid dashboards where every KPI has its own saturated color. Use hierarchy before color.',
      },
      {
        name: 'Excessive rounded corners',
        desc: 'Avoid playful consumer aesthetics. Radius should remain restrained and systematic.',
      },
      {
        name: 'Decorative icons',
        desc: 'Icons support recognition. They do not decorate layouts. Every icon must earn its presence.',
      },
      {
        name: 'Large empty spaces',
        desc: 'Whitespace should improve comprehension, not signal luxury. Enterprise users benefit from density.',
      },
      {
        name: 'Hidden navigation',
        desc: 'Primary workflows must remain immediately discoverable. Do not sacrifice efficiency for visual cleanliness.',
      },
    ],
    filterLabel: 'Decision filter',
    filterIntro: 'Before introducing any UI element, ask:',
    filter: [
      'Does it reduce cognitive effort?',
      'Does it improve scan speed?',
      'Can an existing component solve this?',
      'Is color communicating information?',
      'Can this become a reusable component?',
      'Would Cursor, Granola or Shopify make this decision?',
      'Does this increase confidence?',
      'Does this remove unnecessary clicks?',
      'Will this still feel modern in five years?',
      'Does this support enterprise-scale workflow?',
    ],
  },
};
