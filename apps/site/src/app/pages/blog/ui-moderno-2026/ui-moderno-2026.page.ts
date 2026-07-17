// external
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

// relative
import { LanguageToggleComponent } from '../../../components/language-toggle/language-toggle.component';
import { LanguageService } from '../../../services/language.service';

interface BeatItem {
  kind: 'beat';
  weight: 'headline' | 'body';
  es: string;
  en: string;
}

interface DiagramItem {
  kind: 'diagram';
  file: string;
  altEs: string;
  altEn: string;
}

type StreamItem = BeatItem | DiagramItem;

interface SourceLink {
  label: string;
  href: string;
}

const BEAT = (weight: BeatItem['weight'], es: string, en: string): BeatItem => ({
  kind: 'beat',
  weight,
  es,
  en,
});

const DIAGRAM = (file: string, altEs: string, altEn: string): DiagramItem => ({
  kind: 'diagram',
  file,
  altEs,
  altEn,
});

/**
 * Immersive dark reading room for the Modern UI 2026 post. The long-form
 * article (see git history) is condensed into thirty self-contained beats;
 * a scroll-driven focus treatment keeps the line at the viewport center
 * crisp while neighbors sit dimmed and blurred (Figma AFI-FOUNDATIONS-MODERN,
 * "Animation frames" 2920:5691). Browsers without scroll-driven animations —
 * and reduced-motion users — read every line crisp.
 */
@Component({
  selector: 'site-ui-moderno-2026-page',
  standalone: true,
  imports: [RouterLink, LanguageToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-moderno-2026.page.html',
  styleUrls: ['./ui-moderno-2026.page.scss'],
})
export class UiModerno2026Page {
  private readonly language = inject(LanguageService);
  readonly isEn = computed(() => this.language.lang() === 'en');

  private readonly items: StreamItem[] = [
    // Acto 1 · El encargo
    BEAT(
      'headline',
      'El encargo decía «moderno». Fuimos a averiguar qué significa.',
      'The brief said "modern". We went looking for what that means.',
    ),
    BEAT(
      'body',
      'Nadie definió «moderno», así que cada revisión se convierte en un debate de gustos.',
      'Nobody defined "modern", so every review turns into a taste debate.',
    ),
    BEAT(
      'body',
      'La preferencia — incluso cuando acierta — no escala a cinco marcas y cuatro equipos.',
      "Preference — even when it's right — doesn't scale across five brands and four teams.",
    ),
    BEAT(
      'headline',
      'Antes de abrir Figma, convertimos «moderno» de adjetivo en definición.',
      'Before opening Figma, we turned "modern" from an adjective into a definition.',
    ),
    BEAT('body', 'Primero la definición; después el moodboard.', 'Definition first; moodboard second.'),

    // Acto 2 · Tres problemas
    BEAT(
      'headline',
      'Tres problemas que una paleta nueva no resuelve.',
      "Three problems a new palette won't fix.",
    ),
    BEAT('body', 'El gusto no escala. El lenguaje compartido, sí.', "Taste doesn't scale. Shared language does."),
    BEAT(
      'body',
      'El antídoto no es discutir el gusto: es subir la conversación a tokens, patrones e intención.',
      "The antidote isn't debating taste: it's raising the conversation to tokens, patterns and intent.",
    ),
    BEAT(
      'body',
      'La madurez de diseño se mide por cuánta organización participa con un lenguaje compartido.',
      'Design maturity is measured by how much of the organization takes part with a shared language.',
    ),
    BEAT(
      'body',
      'No hace falta consensuar el gusto; basta con consensuar la intención.',
      "You don't need to agree on taste; agreeing on intent is enough.",
    ),
    BEAT(
      'body',
      'Los layouts estáticos sirven la misma pantalla a todos, vengan a lo que vengan.',
      'Static layouts serve everyone the same screen, whatever they came to do.',
    ),
    DIAGRAM(
      'static-vs-personalized.svg',
      'Animación que muestra un layout estático reorganizándose según la intención del usuario (Patrimonio, Planificación, Riesgos).',
      'Animation showing a static layout reorganizing according to user intent (Wealth, Planning, Risk).',
    ),

    // Acto 3 · Cómo se ven
    BEAT(
      'headline',
      '«Moderno» en 2026 son tres respuestas: cómo se ven las interfaces, cómo se comportan y qué las sostiene.',
      '"Modern" in 2026 is three answers: how interfaces look, how they behave, and what holds them together.',
    ),
    BEAT(
      'body',
      'Calma antes que espectáculo: profundidad sí, distorsión no.',
      'Calm over spectacle: depth yes, distortion no.',
    ),
    BEAT(
      'body',
      'El modo oscuro pasa a ser el estado por defecto. Nunca negro puro: off-blacks.',
      'Dark mode becomes the default state. Never pure black: off-blacks.',
    ),
    BEAT(
      'body',
      'La rejilla bento aporta jerarquía sin columnas rígidas.',
      'The bento grid delivers hierarchy without rigid columns.',
    ),
    DIAGRAM(
      'list-vs-bento.svg',
      'Animación que transforma una lista plana de cuatro filas iguales en una rejilla bento asimétrica.',
      'Animation transforming a flat list of four equal rows into an asymmetric bento grid.',
    ),

    // Acto 4 · Cómo se comportan
    BEAT(
      'headline',
      'De «cómo lo hago» a «qué quiero conseguir».',
      'From "how do I do it" to "what do I want".',
    ),
    DIAGRAM(
      'tree-vs-intent.svg',
      'Animación comparando un árbol de menús (muchos saltos) frente a un acceso directo guiado por intención (ruta corta).',
      'Animation comparing a menu tree (many hops) against direct access guided by intent (short route).',
    ),
    BEAT(
      'body',
      'Una pausa de 150-250 ms genera más confianza que una confirmación instantánea.',
      'A 150–250 ms pause builds more trust than an instant confirmation.',
    ),
    DIAGRAM(
      'pause-confidence.svg',
      'Animación con dos botones: uno confirma instantáneamente, el otro hace una pausa de 150-250 ms antes de confirmar.',
      'Animation with two buttons: one confirms instantly, the other pauses 150–250 ms before confirming.',
    ),
    BEAT(
      'body',
      'La confianza es una fórmula: transparencia + consistencia + capacidad de respuesta.',
      'Trust is a formula: transparency + consistency + responsiveness.',
    ),
    BEAT(
      'body',
      'Anticipar la intención sin sustituirla: prerrellenar sí; ejecutar sin confirmar, no.',
      'Anticipate intent without replacing it: pre-fill yes; execute without confirming, no.',
    ),

    // Acto 5 · Qué las sostiene
    BEAT(
      'headline',
      'Los tokens semánticos son un mapa que también las máquinas pueden leer.',
      'Semantic tokens are a map machines can read too.',
    ),
    BEAT(
      'body',
      'button-primary dice para qué sirve; blue-500 solo dice qué es.',
      "button-primary says what it's for; blue-500 only says what it is.",
    ),
    DIAGRAM(
      'token-hierarchy.svg',
      'Animación que muestra la cascada de tokens: un cambio en el nivel primitivo se propaga a los semánticos y luego a los componentes.',
      'Animation showing the token cascade: a change at the primitive level propagates to the semantic tokens and then to the components.',
    ),
    BEAT(
      'body',
      'Misma estructura, distinto contenido: el principio que sostiene Coherence.',
      'Same structure, different content: the principle Coherence is built on.',
    ),
    BEAT(
      'body',
      'El siguiente salto de madurez ya no depende del equipo de diseño.',
      'The next maturity jump no longer depends on the design team.',
    ),
    DIAGRAM(
      'design-maturity-stages.svg',
      'Animación de los cinco estados de madurez de diseño con un marcador entre Managed (Afi hoy) y Defined (Afi mañana).',
      'Animation of the five design-maturity stages with a marker between Managed (Afi today) and Defined (Afi tomorrow).',
    ),

    // Acto 6 · Compromisos
    BEAT(
      'headline',
      'Cinco compromisos que se nos pueden auditar.',
      'Five commitments you can hold us to.',
    ),
    BEAT(
      'body',
      '1 — Calm design como referencia estética y funcional.',
      '1 — Calm design as the aesthetic and functional reference.',
    ),
    BEAT(
      'body',
      '2 — Diseño basado en intención, no en árboles de menús.',
      '2 — Intent-based design, not menu trees.',
    ),
    BEAT(
      'body',
      '3 — Tokens semánticos como fuente única de verdad.',
      '3 — Semantic tokens as the single source of truth.',
    ),
    BEAT('body', '4 — Movimiento funcional, no decorativo.', '4 — Functional motion, not decorative.'),
    BEAT(
      'body',
      '5 — Accesibilidad como contrato de confianza.',
      '5 — Accessibility as a trust contract.',
    ),
    BEAT(
      'headline',
      'El moodboard es el siguiente paso — y ahora tiene contra qué medirse.',
      'The moodboard is the very next step — and now it has something to be measured against.',
    ),
  ];

  /** Stream flattened to the active locale so the template stays simple. */
  readonly stream = computed(() => {
    const en = this.isEn();
    const assetDir = en ? 'modern-ui-2026' : 'ui-moderno-2026';
    return this.items.map((item) =>
      item.kind === 'beat'
        ? { kind: 'beat' as const, weight: item.weight, text: en ? item.en : item.es }
        : {
            kind: 'diagram' as const,
            src: `assets/blog/${assetDir}/${item.file}`,
            alt: en ? item.altEn : item.altEs,
          },
    );
  });

  readonly sources: SourceLink[] = [
    { label: 'Gowtham V — Evolution of UI Design: 2026 Trends', href: 'https://www.linkedin.com/pulse/evolution-ui-design-2026-trends-shaping-modern-digital-gowtham-v-c6k4c' },
    { label: 'Tubik Studio — UI Design Trends 2026', href: 'https://tubikstudio.com/blog/ui-design-trends-2026/' },
    { label: 'Blushush — Top 5 UI Design Trends for Modern Websites', href: 'https://www.blushush.co.uk/blogs/top-5-user-interface-design-trends-for-modern-websites' },
    { label: 'Sohan Talukder — 2026 UI/UX Trends', href: 'https://www.linkedin.com/posts/sohan-talukder_2026-uiux-trends-activity-7414988664407023616-3yMo' },
    { label: 'UX Collective — The most popular experience design trends of 2026', href: 'https://uxdesign.cc/the-most-popular-experience-design-trends-of-2026-3ca85c8a3e3d' },
    { label: 'Envato Elements — Web Design Trends', href: 'https://elements.envato.com/learn/web-design-trends' },
    { label: 'Spunk — UI Design Trends 2026', href: 'https://spunk.pics/blog/ui-design-trends-2026' },
    { label: 'Velvetum — UX/UI Design Tools 2026', href: 'https://velvetum.com/en/journal/ux-ui-design-tools-2026' },
    { label: 'Stan Vision — Fintech UX in 2026', href: 'https://www.stan.vision/journal/fintech-ux-in-2026-what-users-expect-from-modern-financial-products' },
    { label: 'Veza Digital — Fintech Web Design Trends', href: 'https://www.vezadigital.com/post/fintech-web-design-trends' },
    { label: 'Merveilleux — UI/UX Trends 2026', href: 'https://www.merveilleux.design/en/blog/article/ui-ux-trends-2026' },
    { label: 'Find a SaaS — SaaS UX Trends 2026', href: 'https://findasaas.com/blog/saas-ux-trends-2026' },
    { label: 'Don Norman — Emotional Design', href: 'https://www.nngroup.com/books/emotional-design/' },
    { label: 'Figma — The future of design systems is semantic', href: 'https://www.figma.com/blog/the-future-of-design-systems-is-semantic/' },
    { label: 'Google PAIR — People + AI Guidebook', href: 'https://pair.withgoogle.com/guidebook/' },
    { label: 'dsruptr — The Ultimate Design Maturity Guide for Tech Leaders', href: 'https://dsruptr.com/2026/01/19/the-ultimate-design-maturity-guide-for-tech-leaders/' },
    { label: 'Emil Kowalski — intentional pause in high-impact interactions', href: 'https://emilkowal.ski/' },
  ];
}
