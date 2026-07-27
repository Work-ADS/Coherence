import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

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

interface Copy {
  eyebrow: string;
  scrollCue: string;
  hero: Hero;
  blocks: Block[];
}

/**
 * Brand strategy — internal brand-strategy narrative.
 *
 * First section redesigned as a full-viewport, black-and-white hero: the
 * mission statement at display scale with the word clara / clearer as a
 * CSS frosted-glass lozenge (form = meaning), plus a scroll cue. The remaining
 * blocks follow below on the same dark canvas — they'll get their own passes.
 *
 * Bilingual: mirrors the site-wide LanguageService (the ES/EN toggle). Because
 * the glass word stays real DOM text, it swaps with the locale. Spanish is
 * usted register; source of truth is docs/brand/brand-strategy.md.
 *
 * Built on the identity-v2 modern foundation (data-foundation="modern": IBM
 * Plex Sans, --type-*, --content-* colours). The dark canvas inverts the two
 * neutral endpoints (--content-primary as background, --content-inverse as
 * text) via component-scoped aliases, since the modern set has no authored
 * dark-neutral surface yet. Token-only — the clean-code hook blocks raw values.
 */
@Component({
  selector: 'site-estrategia-marca-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estrategia-marca.page.html',
  styleUrls: ['./estrategia-marca.page.scss'],
})
export class EstrategiaMarcaPage {
  private readonly language = inject(LanguageService);
  readonly isEn = computed(() => this.language.lang() === 'en');

  readonly content = computed<Copy>(() => (this.isEn() ? EN : ES));
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
};
