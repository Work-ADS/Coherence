import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@coherence/ui';

import { LanguageService } from '../../../services/language.service';

interface BilingualString {
  es: string;
  en: string;
}

interface BilingualSection {
  heading: BilingualString;
  paragraphs: BilingualString[];
  /** Optional bullet list rendered after the first paragraph(s). */
  bullets?: BilingualString[];
  /** Where to drop the bullets relative to paragraphs (default: at the end). */
  bulletsAfterParagraph?: number;
}

const CONTENT = {
  breadcrumb: {
    parent: { es: 'Blog', en: 'Blog' },
    current: {
      es: 'White label en una línea',
      en: 'White label in one line',
    },
  },
  eyebrow: {
    es: 'TOKENS · WHITE LABEL',
    en: 'TOKENS · WHITE LABEL',
  },
  header: {
    title: {
      es: 'White label en una línea: el mixin coherence-brand-bind',
      en: 'White label in one line: the coherence-brand-bind mixin',
    },
    subtitle: {
      es: 'De 110 líneas de mapeos por marca a un @include de 8. La receta que cierra la conversación de tokens del 22 de mayo sin tocar el contrato con programación.',
      en: 'From 110 lines of per-brand mappings to an 8-line @include. The recipe that closes the token conversation from May 22 without touching the contract with engineering.',
    },
  },
  lead: {
    es: 'Una marca nueva en el DS pasa de mantener sesenta mapeos a mano a pasar seis parámetros a un mixin. Los componentes no se enteran. El contrato de tokens que cerramos con programación el 22 de mayo se mantiene intacto: lo único que cambia es la cantidad de código que sostenemos por marca.',
    en: 'A new brand in the DS goes from maintaining sixty mappings by hand to passing six arguments to a mixin. Components are none the wiser. The token contract we agreed on with engineering on May 22 stays intact — the only thing that changes is how much code we own per brand.',
  },
  closing: {
    es: 'Código:',
    en: 'Code:',
  },
  closingSeparator: ' · ',
  closingExample: {
    es: 'Ejemplo aplicado:',
    en: 'Applied example:',
  },
} as const;

const SECTIONS: BilingualSection[] = [
  // ───────────────────── 1 · El acuerdo del 22 de mayo ─────────────────────
  {
    heading: {
      es: 'El acuerdo del 22 de mayo',
      en: 'The May 22 agreement',
    },
    paragraphs: [
      {
        es: 'Nos sentamos con el equipo de programación para definir cómo estructurar los tokens del DS de modo que añadir clientes —Santander, Sabadell, Unicaja, Mutualidad, Laboral Kutxa— no implique reescribir el sistema cada vez.',
        en: 'We sat down with engineering to define how to structure the DS tokens so that adding new clients — Santander, Sabadell, Unicaja, Mutualidad, Laboral Kutxa — would not mean rewriting the system every time.',
      },
      {
        es: 'La conversación se ordenó en tres niveles:',
        en: 'The conversation settled around three levels:',
      },
    ],
    bullets: [
      {
        es: '<strong>Primitivos.</strong> Rampas de color con escala 0–900 y nombres universales. Nada de <code>afi-azul</code> en este nivel.',
        en: '<strong>Primitives.</strong> Color ramps on a 0–900 scale with universal names. No <code>afi-azul</code> at this level.',
      },
      {
        es: '<strong>Semánticos.</strong> Roles funcionales: <code>surface-default</code>, <code>brand-primary-background</code>.',
        en: '<strong>Semantic.</strong> Functional roles: <code>surface-default</code>, <code>brand-primary-background</code>.',
      },
      {
        es: '<strong>De componente.</strong> Granularidad fina por pieza: <code>nav-item-background-default</code>, <code>button-primary-background</code>.',
        en: '<strong>Component-level.</strong> Fine-grained per piece: <code>nav-item-background-default</code>, <code>button-primary-background</code>.',
      },
    ],
    bulletsAfterParagraph: 1,
  },
  // Three follow-up paragraphs + a second bullet list are stitched in via
  // a paired companion section so the template stays simple.
  {
    heading: {
      es: '__inline__',
      en: '__inline__',
    },
    paragraphs: [
      {
        es: 'Y cerramos tres acuerdos sobre la mesa:',
        en: 'And we closed three agreements:',
      },
    ],
    bullets: [
      {
        es: 'Naming funcional, no jerárquico: <code>color-surface-secondary</code> antes que <code>color-brand-light</code>.',
        en: 'Functional naming, not hierarchical: <code>color-surface-secondary</code> over <code>color-brand-light</code>.',
      },
      {
        es: 'Un archivo por cliente con los mismos nombres de variable y valores específicos. Mejor que separar primitivos y semánticos en dos archivos por marca.',
        en: 'One file per client with identical variable names and client-specific values. Better than splitting primitives and semantics into two files per brand.',
      },
      {
        es: 'No sobre-especificar: los casos puntuales se resuelven a mano, sin variable propia.',
        en: 'Do not over-specify: edge cases are handled by hand, without a variable of their own.',
      },
    ],
    bulletsAfterParagraph: 0,
  },
  {
    heading: { es: '__inline__', en: '__inline__' },
    paragraphs: [
      {
        es: 'Quedó pendiente preparar un ejemplo aplicado para la siguiente sesión. Este post es ese ejemplo, ya en producción.',
        en: 'We agreed to bring an applied example to the next session. This post is that example, already in production.',
      },
    ],
  },

  // ───────────────────── 2 · El coste oculto de cada marca ─────────────────────
  {
    heading: {
      es: 'El coste oculto de cada marca',
      en: 'The hidden cost of each brand',
    },
    paragraphs: [
      {
        es: 'Para que <code>afi-button</code>, <code>afi-select</code> o <code>afi-modal</code> se vean «on-brand» en Laboral Kutxa hay que rellenar unas sesenta propiedades CSS en <code>libs/tokens/semantic.scss</code>, dentro de un bloque <code>[data-brand="laboral-kutxa"]</code>. Cada slot del DS apunta a un escalón concreto de una rampa concreta de la marca.',
        en: 'For <code>afi-button</code>, <code>afi-select</code> or <code>afi-modal</code> to look on-brand in Laboral Kutxa, you have to fill in about sixty CSS properties in <code>libs/tokens/semantic.scss</code>, inside a <code>[data-brand="laboral-kutxa"]</code> block. Each DS slot points to a specific step of a specific brand ramp.',
      },
      {
        es: 'Hicimos el ejercicio entero para Laboral Kutxa. Ocupó ciento diez líneas. Multiplicado por Santander, Sabadell, Mutualidad, Unicaja y el cliente que llegue el mes que viene, el coste se acumula —y la mecánica es siempre la misma.',
        en: 'We did the whole exercise for Laboral Kutxa. It took 110 lines. Multiplied by Santander, Sabadell, Mutualidad, Unicaja and whichever client lands next month, the cost compounds — and the mechanics are always the same.',
      },
      {
        es: 'Tres riesgos concretos identificados en la reunión:',
        en: 'Three concrete risks surfaced in the meeting:',
      },
    ],
    bullets: [
      {
        es: '<strong>Olvidos.</strong> Si un slot no se mapea, el componente cae en el valor por defecto de AFI, que es azul. Un botón azul en una página magenta desentona.',
        en: '<strong>Misses.</strong> If a slot is not mapped, the component falls back to AFI\'s default value, which is blue. A blue button on a magenta page looks off.',
      },
      {
        es: '<strong>Deriva.</strong> Cada copia invita a retocar algún detalle. La marca termina divergiendo del centro.',
        en: '<strong>Drift.</strong> Every copy invites a small tweak. The brand ends up drifting from the source.',
      },
      {
        es: '<strong>Coste por marca.</strong> Cada cliente nuevo cuesta un día de tokens antes de poder enseñar la primera pantalla.',
        en: '<strong>Per-brand cost.</strong> Every new client costs a day of tokens before we can show the first screen.',
      },
    ],
  },

  // ───────────────────── 3 · El primer intento, a mano ─────────────────────
  {
    heading: {
      es: 'El primer intento, a mano',
      en: 'First attempt, by hand',
    },
    paragraphs: [
      {
        es: 'Laboral Kutxa fue el banco de pruebas. El encargo: implementar el <a class="post__link" routerLink="/demos/laboral-kutxa-sarevi">simulador de eficiencia energética Sarevi 360</a> sobre el DS, con la marca aplicada únicamente vía tokens.',
        en: 'Laboral Kutxa was the testbed. The brief: build the <a class="post__link" routerLink="/demos/laboral-kutxa-sarevi">Sarevi 360 energy efficiency simulator</a> on top of the DS, with the brand applied through tokens only.',
      },
      {
        es: 'Empezamos por el patrón explícito: un archivo <code>colors-laboral-kutxa.scss</code> con las rampas de la marca (magenta, berenjena, verde, beige, neutral) y un bloque semántico escrito a mano. La página renderizó bien. El bloque semántico, sin embargo, era el copia-pega verboso que queríamos evitar.',
        en: 'We started with the explicit pattern: a <code>colors-laboral-kutxa.scss</code> file with the brand ramps (magenta, eggplant, green, beige, neutral) and a hand-written semantic block. The page rendered fine. The semantic block, however, was exactly the verbose copy-paste we wanted to avoid.',
      },
      {
        es: 'Al releer el archivo aparece la pista: el bloque de Laboral Kutxa es estructuralmente idéntico al de AFI. Lo único que cambia es qué rampa se interpola en cada slot. Si los nombres de rampa entran como parámetros, el cuerpo del bloque se puede generar mecánicamente.',
        en: 'On a second read the hint shows up: Laboral Kutxa\'s block is structurally identical to AFI\'s. The only thing that changes is which ramp is interpolated in each slot. If the ramp names came in as parameters, the body of the block could be generated mechanically.',
      },
      {
        es: 'Eso es, palabra por palabra, lo que hace un mixin de Sass.',
        en: 'That is, word for word, what a Sass mixin does.',
      },
    ],
  },
];

// Sections 4–8 ship as standalone bilingual fragments because they contain
// code blocks, callouts or step lists that don't fit the simple paragraph +
// bullets shape used above. Their template lives inline in the .html.

@Component({
  selector: 'site-mixin-brand-bind-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mixin-brand-bind.page.html',
  styleUrl: './mixin-brand-bind.page.scss',
})
export class MixinBrandBindPage {
  private readonly language = inject(LanguageService);
  readonly lang = this.language.lang;

  readonly content = computed(() => {
    const isEn = this.lang() === 'en';
    const pick = (s: BilingualString) => (isEn ? s.en : s.es);
    return {
      breadcrumb: {
        parent: pick(CONTENT.breadcrumb.parent),
        current: pick(CONTENT.breadcrumb.current),
      },
      eyebrow: pick(CONTENT.eyebrow),
      title: pick(CONTENT.header.title),
      subtitle: pick(CONTENT.header.subtitle),
      lead: pick(CONTENT.lead),
      sections: SECTIONS.map((s) => ({
        heading: pick(s.heading),
        showHeading: pick(s.heading) !== '__inline__',
        paragraphs: s.paragraphs.map(pick),
        bullets: (s.bullets ?? []).map(pick),
        bulletsAfterParagraph: s.bulletsAfterParagraph ?? Number.MAX_SAFE_INTEGER,
      })),
      closing: pick(CONTENT.closing),
      closingExample: pick(CONTENT.closingExample),
      // ── Section 4 — La receta ──────────────────────────────────────
      receta: {
        heading: isEn
          ? 'The recipe:'
          : 'La receta:',
        intro: isEn
          ? 'A mixin in <code>libs/tokens/_mixins.scss</code> that takes six arguments and emits the ~60 matching semantic tokens:'
          : 'Un mixin en <code>libs/tokens/_mixins.scss</code> que recibe seis parámetros y emite los ~60 tokens semánticos correspondientes:',
        between: isEn
          ? 'The Laboral Kutxa block in <code>semantic.scss</code> drops from 110 lines to eight:'
          : 'El bloque de Laboral Kutxa en <code>semantic.scss</code> pasa de 110 líneas a ocho:',
        outro: isEn
          ? 'The contract engineering asked for stays intact: components keep consuming the same semantic tokens (<code>--brand-primary-background-default</code>, etc.). All that changes is how those tokens materialize per brand — by hand before, via recipe now.'
          : 'El contrato que pidió programación queda intacto: los componentes siguen consumiendo los mismos tokens semánticos (<code>--brand-primary-background-default</code>, etc.). Solo cambia cómo se materializan esos tokens para cada marca: antes a mano, ahora vía receta.',
        calloutTitle: isEn
          ? 'And the non-color cases?'
          : '¿Y los casos no-color?',
        calloutBody1: isEn
          ? 'Sabadell draws its inputs with an underline instead of a full border. Laboral Kutxa uses pill-style buttons with a very high border-radius. These decisions do not belong inside the mixin: they live as overrides after the <code>@include</code>, inside the same brand block.'
          : 'Sabadell dibuja los inputs con subrayado en lugar de borde completo. Laboral Kutxa usa botones tipo píldora, con un border-radius muy alto. Estas decisiones no entran en el mixin: van como override después del <code>@include</code>, dentro del mismo bloque de marca.',
        calloutBody2: isEn
          ? 'It works because this is <strong>plain CSS cascade</strong>: the mixin writes first, the override wins after. No magic.'
          : 'Funciona porque es <strong>la cascada normal de CSS</strong>: el mixin escribe primero, el override gana después. Sin magia.',
      },
      // ── Section 5 — Lo que cambia al aplicarla ─────────────────────
      cambia: {
        heading: isEn ? 'What changes when we apply it' : 'Lo que cambia al aplicarla',
        intro: isEn
          ? 'We validated the recipe in Laboral Kutxa with four observations:'
          : 'Validamos la receta en Laboral Kutxa con cuatro observaciones:',
        bullets: isEn
          ? [
              '<strong>From 110 to 8 lines.</strong> The recipe is the new code; the rest is gone.',
              '<strong>The Sarevi page picked up the brand on its own.</strong> <code>afi-button[variant="primary"]</code> went from eggplant to magenta without touching a single component.',
              '<strong>The brand switcher works at runtime.</strong> Flip from AFI to Laboral Kutxa in the top-bar dropdown and the screens repaint instantly. Same mechanism for Santander when it lands.',
              '<strong>The magenta header gradient</strong> consumes primitives directly (<code>var(--color-laboral-kutxa-magenta-700)</code> → <code>magenta-400</code>). When a decision is clearly brand-specific it can skip the semantic layer with no penalty.',
            ]
          : [
              '<strong>De 110 a 8 líneas.</strong> La receta es el código nuevo; el resto desapareció.',
              '<strong>La página Sarevi adoptó la marca sola.</strong> <code>afi-button[variant="primary"]</code> pasó de berenjena a magenta sin tocar ningún componente.',
              '<strong>El selector de marca funciona en caliente.</strong> Al cambiar de AFI a Laboral Kutxa en el desplegable de la barra superior, las pantallas se repintan al momento. El mismo mecanismo nos vale cuando entre Santander.',
              '<strong>El gradiente magenta de la cabecera</strong> consume los primitivos directamente (<code>var(--color-laboral-kutxa-magenta-700)</code> → <code>magenta-400</code>). Cuando una decisión es claramente brand-específica, puede saltar el sistema semántico sin penalización.',
            ],
      },
      // ── Section 6 — Añadir una marca nueva ─────────────────────────
      pasos: {
        heading: isEn ? 'Adding a new brand, step by step' : 'Añadir una marca nueva, paso a paso',
        intro: isEn
          ? 'Imagine <strong>Santander</strong> lands tomorrow. These are the six steps:'
          : 'Imaginemos que entra <strong>Santander</strong> mañana. Estos son los seis pasos:',
        step1Title: isEn ? '1. Create the primitives file' : '1. Crear el archivo de primitivos',
        step1Body: isEn
          ? '<code>libs/tokens/colors-santander.scss</code>, with 12-step ramps per color, scoped to <code>[data-brand="santander"]</code>. Same shape as <code>colors-laboral-kutxa.scss</code>. If Santander is red and grey, the ramps are called <code>rojo</code> and <code>gris</code>:'
          : '<code>libs/tokens/colors-santander.scss</code>, con rampas de 12 escalones por color, scopeadas a <code>[data-brand="santander"]</code>. Mismo formato que <code>colors-laboral-kutxa.scss</code>. Si Santander es rojo y gris, las rampas se llaman <code>rojo</code> y <code>gris</code>:',
        step1CodeComment1: isEn ? '// Santander signature red' : '// rojo Santander de referencia',
        step1CodeComment2: isEn ? '// ...12 steps per ramp' : '// ...12 escalones por rampa',
        step2Title: isEn ? '2. Register the file' : '2. Registrar el archivo',
        step2Body: isEn
          ? 'Add <code>@import \'./colors-santander.scss\';</code> in <code>libs/tokens/variables.scss</code>, under «Layer 2 — Other brands».'
          : 'Añadir <code>@import \'./colors-santander.scss\';</code> en <code>libs/tokens/variables.scss</code>, bajo «Layer 2 — Other brands».',
        step3Title: isEn
          ? '3. Wire it into the semantic system (8 lines)'
          : '3. Conectar al sistema semántico (8 líneas)',
        step3Body: isEn
          ? 'At the end of the brand block in <code>libs/tokens/semantic.scss</code>:'
          : 'Al final del bloque de marcas en <code>libs/tokens/semantic.scss</code>:',
        step4Title: isEn
          ? '4. Brand-specific overrides (if any)'
          : '4. Overrides brand-específicos (si los hay)',
        step4Body: isEn
          ? 'For non-color differences — squarer radius, a custom font, any brand-specific detail — the override goes after the <code>@include</code>:'
          : 'Para diferencias no-color —radio más cuadrado, fuente propia, cualquier detalle de la marca— el override va después del <code>@include</code>:',
        step4CodeComment1: isEn
          ? '// Squarer corners on controls'
          : '// Esquinas más cuadradas en los controles',
        step4CodeComment2: isEn ? '// Custom display font' : '// Fuente de display propia',
        step5Title: isEn
          ? '5. Register Santander in the brand picker'
          : '5. Registrar Santander en el selector',
        step5Body: isEn
          ? 'Edit <code>apps/site/src/app/components/brand-picker/brand-picker.component.ts</code>: the <code>Brand</code> type and the <code>BRAND_OPTIONS</code> list. Two lines.'
          : 'Editar <code>apps/site/src/app/components/brand-picker/brand-picker.component.ts</code>: el tipo <code>Brand</code> y la lista <code>BRAND_OPTIONS</code>. Dos líneas.',
        step6Title: isEn ? '6. Test at runtime' : '6. Probar en caliente',
        step6Body: isEn
          ? 'Start the dev server, open any demo, pick Santander in the brand switcher. <code>afi-button</code>, <code>afi-input</code>, etc. repaint with the new tokens. No component was touched.'
          : 'Arrancar el servidor de desarrollo, abrir cualquier demo y seleccionar Santander en el selector. Los <code>afi-button</code>, <code>afi-input</code>, etc. se repintan con los tokens nuevos. Ningún componente se ha tocado.',
      },
      // ── Section 7 — Lo que entrega diseño ──────────────────────────
      diseno: {
        heading: isEn ? 'What design hands over' : 'Lo que entrega diseño',
        intro: isEn
          ? 'Design does not write Sass, but it hands over the recipe\'s ingredients. For each new client we need:'
          : 'Diseño no escribe Sass, pero entrega los ingredientes de la receta. Por cada cliente nuevo necesitamos:',
        bullets: isEn
          ? [
              '<strong>Four 12-step ramps</strong> (accent, neutral and, if the brand calls for it, secondary and tertiary). Best exported from Figma as JSON: hex values get copied into the primitives file.',
              '<strong>Three ink values</strong> (default, soft, muted) for text greys.',
              '<strong>The list of non-color differences.</strong> Pill buttons? Inputs with an underline? A specific font? Each decision is a one-line override.',
            ]
          : [
              '<strong>Cuatro rampas de 12 escalones</strong> (acento, neutral y, si la marca lo pide, secundaria y terciaria). Mejor exportadas desde Figma como JSON: los valores hexadecimales se copian al archivo de primitivos.',
              '<strong>Tres valores de ink</strong> (default, soft, muted) para los grises de texto.',
              '<strong>La lista de diferencias no-color.</strong> ¿Botones píldora? ¿Inputs con subrayado? ¿Una fuente específica? Cada decisión es un override de una línea.',
            ],
        outro: isEn
          ? 'It pays for design to know the recipe exists. When a brand asks for a specific change ("we want a darker border on the selects"), the conversation with engineering is direct: either the change affects every select for that brand — and it lives in the override — or it is a one-off and we handle it by hand. The meeting decided it; the mixin applies it.'
          : 'Conviene que diseño sepa que la receta existe. Cuando una marca pide un cambio puntual («queremos un borde más oscuro en los selects»), la conversación con programación es directa: o el cambio afecta a todos los selects de la marca —y vive en el override—, o es un caso puntual y se resuelve a mano. Lo decidió la reunión; lo aplica el mixin.',
      },
      // ── Section 8 — Cierre ─────────────────────────────────────────
      cierre: {
        heading: isEn ? 'Closing' : 'Cierre',
        p1: isEn
          ? 'The mixin does not replace anything we agreed on May 22. The three levels are still there, the names are still functional, and components still consume semantic tokens without knowing which brand is active.'
          : 'El mixin no sustituye nada de lo que acordamos el 22 de mayo. Los tres niveles siguen ahí, los nombres siguen siendo funcionales y los componentes siguen consumiendo tokens semánticos sin saber qué marca está activa.',
        p2: isEn
          ? 'What it adds is a shortcut for the mechanical part: that 80% of the per-brand block that was predictable copy-paste. A new brand drops from a day of tokens to half an hour. The recovered time goes where it actually matters: the non-color differences (border-radius, underlined inputs, header gradients) that do call for design decisions.'
          : 'Lo que añade es un atajo para la parte mecánica: ese 80 % del bloque por marca que era copia-pega predecible. Una marca nueva pasa de un día de tokens a media hora. El tiempo recuperado se invierte donde de verdad importa: las diferencias no-color (border-radius, subrayado en inputs, gradientes de cabecera) que sí piden decisiones de diseño.',
        p3: isEn
          ? 'In the next session with engineering we show it live: Santander vs. Unicaja, brand switcher running, the same screens with two distinct identities.'
          : 'En la próxima sesión con programación lo enseñamos en vivo: Santander frente a Unicaja, selector de marca corriendo, las mismas pantallas y dos identidades distintas.',
      },
    };
  });
}
