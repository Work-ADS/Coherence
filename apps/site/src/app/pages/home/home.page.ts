import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LogoComponent } from '@coherence/ui';

import {
  CollapseGlyphComponent,
  EvolutionGlyphComponent,
  SlidesGlyphComponent,
  WhitelabelFrameGlyphComponent,
} from '../../components/glyphs';
import { LanguageService } from '../../services/language.service';

interface WorkCard {
  routerLink: string;
  eyebrow: { es: string; en: string };
  title: { es: string; en: string };
  blurb: { es: string; en: string };
  thumb: 'wealth-planner' | 'sarevi' | 'whitelabel' | 'slides' | 'video';
  /** Optional per-language video src (relative to /assets); only used when thumb === 'video'. */
  videoSrc?: { es: string; en: string };
  /** Optional poster image shown before video starts and on pause. */
  videoPoster?: string;
}

interface ExpandRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

@Component({
  selector: 'site-home',
  standalone: true,
  imports: [
    LogoComponent,
    EvolutionGlyphComponent,
    WhitelabelFrameGlyphComponent,
    CollapseGlyphComponent,
    SlidesGlyphComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  readonly lang = this.language.lang;

  /** Frozen viewport rect of the clicked card while it morphs to full screen. */
  readonly expandRect = signal<ExpandRect | null>(null);
  /** Second phase of the morph: rect → full viewport, background blurs away. */
  readonly expandGrowing = signal(false);

  // Brand-and-personas and Wealth Planner demo cards hidden — home features
  // the redesign series: Modern UI (surface) + Information Architecture (structure).
  private readonly cards: WorkCard[] = [
    {
      routerLink: '/blog/arquitectura-informacion',
      eyebrow: {
        es: 'PRODUCTO · ARQUITECTURA DE LA INFORMACIÓN',
        en: 'PRODUCT · INFORMATION ARCHITECTURE',
      },
      title: {
        es: 'Wealth Planner: arquitectura de la información',
        en: 'Wealth Planner: information architecture',
      },
      blurb: {
        es: 'Puedes modernizar los componentes y seguir sin tener una plataforma moderna. Reorganizar el planificador en torno a cómo lo usan los asesores.',
        en: 'You can modernize the components and still not have a modern platform. Reorganizing the planner around how advisors use it.',
      },
      thumb: 'wealth-planner',
    },
    {
      routerLink: '/blog/ui-moderno-2026',
      eyebrow: {
        es: 'INVESTIGACIÓN · UI 2026',
        en: 'RESEARCH · UI 2026',
      },
      title: {
        es: '¿Qué es UI moderna en 2026?',
        en: 'What is modern UI in 2026?',
      },
      blurb: {
        es: 'Cuatro fuentes, ocho temas, cinco compromisos. La base sobre la que se construye el rediseño visual de Afi.',
        en: 'Four sources, eight themes, five commitments. The foundation Afi’s visual redesign rests on.',
      },
      thumb: 'video',
      videoSrc: {
        es: 'assets/thumbnails/ui-moderno-2026-es.mp4',
        en: 'assets/thumbnails/ui-moderno-2026-en.mp4',
      },
    },
  ];

  /** Cards flattened to the active locale so the template stays simple. */
  readonly recentWork = computed(() =>
    this.cards.map((c) => ({
      routerLink: c.routerLink,
      thumb: c.thumb,
      videoSrc: c.videoSrc?.[this.lang()],
      videoPoster: c.videoPoster,
      eyebrow: c.eyebrow[this.lang()],
      title: c.title[this.lang()],
      blurb: c.blurb[this.lang()],
    })),
  );

  /**
   * Ensure the thumb video is muted, then start playback. Browsers block
   * autoplay on unmuted videos; Angular's bare `muted` attribute doesn't
   * survive the template renderer, so we set it explicitly here once the
   * video can play.
   */
  playMuted(event: Event): void {
    const video = event.target as HTMLVideoElement;
    video.muted = true;
    video.play().catch(() => {
      /* autoplay blocked: video will start on next user interaction */
    });
  }

  /**
   * Cinematic open: freeze the card at its viewport rect, then let CSS morph
   * it to full screen while the rest of the page blurs away; navigate once
   * the morph lands. Modifier clicks keep native anchor behavior (new tab),
   * and reduced-motion users navigate immediately.
   */
  onCardClick(event: MouseEvent, routerLink: string): void {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (this.expandRect() !== null) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.router.navigateByUrl(routerLink);
      return;
    }

    // Rect read via the event's own target (allowed pointer interaction) —
    // it seeds the fixed-position start frame of the CSS morph.
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.expandRect.set({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    // Two frames so the fixed start rect paints before the morph target kicks in.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.expandGrowing.set(true)),
    );
    setTimeout(() => this.router.navigateByUrl(routerLink), 680);
  }
}
