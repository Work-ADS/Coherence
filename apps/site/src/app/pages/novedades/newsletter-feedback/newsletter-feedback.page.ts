import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../shared/section-header.component';
import { OnThisPageComponent, type TocItem } from '../shared/on-this-page.component';

type CommentTag =
  | 'Asunto'
  | 'Cabecera'
  | 'Metadatos'
  | 'Layout'
  | 'Editorial'
  | 'Preferencias'
  | 'Banner'
  | 'Tono'
  | 'Legal'
  | 'Pie';

type Comment = {
  body: string;
  tags: CommentTag[];
};

type CategoryScore = {
  label: string;
  score: number;
};

type ImpactLevel = 'Alto' | 'Medio' | 'Bajo';

type TopFix = {
  title: string;
  impact: ImpactLevel;
  effort: ImpactLevel;
  whatsBroken: string;
  fix: string;
  principles: string[];
};

type Verdict = 'strong' | 'partial' | 'missing';

type Finding = {
  principle: string;
  verdict: Verdict;
  note: string;
};

type AuditCategory = {
  id: string;
  label: string;
  description: string;
  score: number;
  findings: Finding[];
};

const FIGMA_V1_URL =
  'https://www.figma.com/design/TrpEXddDF1KNjz3C7e2a0L/Afi-insights---feedback?node-id=29-7674';
const FIGMA_V2_URL =
  'https://www.figma.com/design/TrpEXddDF1KNjz3C7e2a0L/Afi-insights---feedback?node-id=29-7578';

@Component({
  selector: 'site-newsletter-feedback-page',
  standalone: true,
  imports: [
    RouterLink,
    BadgeComponent,
    PageHeaderComponent,
    SectionHeaderComponent,
    OnThisPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas-base">
      <div
        class="flex items-center gap-space-3 border-b border-border-hairline px-space-4 h-10 bg-surface-quiet shrink-0 text-body-sm"
      >
        <a
          routerLink="/novedades"
          [queryParams]="{ tab: 'marketing' }"
          class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-100 text-neutral-500"
          aria-label="Volver a Novedades"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <span class="text-neutral-500">Novedades</span>
        <span class="text-neutral-400" aria-hidden="true">/</span>
        <span class="text-canvas-fg font-medium">Newsletter — Feedback</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1200px] mx-auto py-space-10 flex gap-space-10">
          <div class="min-w-0 flex-1">
            <afi-page-header
              title="Newsletter AFI — Feedback y auditoría"
              subtitle="Diez comentarios anclados del equipo y una auditoría psicológica growth.design sobre el frame v1. Los CTAs arriba abren las versiones v1 (diseño actual) y v2 (propuesta) en Figma."
              [sticky]="false"
              [scrollFade]="false"
            >
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                >NEWSLETTER · FEEDBACK</span
              >
            </afi-page-header>

            <!-- ========== Primary CTAs — v1 + v2 en Figma ========== -->
            <div class="mt-space-8 px-space-8 grid grid-cols-1 md:grid-cols-2 gap-space-3">
              <a
                [href]="figmaV1Url"
                target="_blank"
                rel="noopener"
                class="group flex items-center justify-between gap-space-4 px-space-5 py-space-4 rounded-md border border-border-hairline bg-surface-quiet hover:bg-surface-muted transition-colors"
              >
                <div class="min-w-0">
                  <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-1">
                    v1 · Diseño actual
                  </p>
                  <p class="text-body-md font-medium text-canvas-fg">
                    Abrir v1 en Figma
                  </p>
                  <p class="text-body-sm text-neutral-600 mt-space-1">
                    Frame 29-7674. Sobre este diseño se han recogido los comentarios y la auditoría.
                  </p>
                </div>
                <svg
                  class="w-5 h-5 text-neutral-500 shrink-0 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>

              <a
                [href]="figmaV2Url"
                target="_blank"
                rel="noopener"
                class="group flex items-center justify-between gap-space-4 px-space-5 py-space-4 rounded-md border border-action/40 bg-action/5 hover:bg-action/10 transition-colors"
              >
                <div class="min-w-0">
                  <p class="text-caption uppercase tracking-wider text-action-700 mb-space-1">
                    v2 · Propuesta
                  </p>
                  <p class="text-body-md font-medium text-canvas-fg">
                    Abrir v2 en Figma
                  </p>
                  <p class="text-body-sm text-neutral-600 mt-space-1">
                    Frame 29-7578. Próxima iteración a partir del feedback y la auditoría.
                  </p>
                </div>
                <svg
                  class="w-5 h-5 text-action-700 shrink-0 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>

            <!-- ========== Comentarios ========== -->
            <div id="comentarios" class="mt-space-12 px-space-8">
              <afi-section-header
                eyebrow="Comentarios"
                title="Feedback recibido"
                snippet="Diez comentarios anclados del equipo sobre el diseño actual. Texto literal — no se ha reformulado nada."
              />

              <ul class="flex flex-col gap-space-3">
                @for (c of comments; track $index) {
                  <li
                    class="flex items-start gap-space-3 p-space-5 rounded-md border border-border-hairline bg-surface-quiet"
                  >
                    <afi-badge size="sm" intent="neutral" class="shrink-0 mt-space-1">
                      {{ $index + 1 }}
                    </afi-badge>
                    <div class="min-w-0 flex-1">
                      <p class="text-body-md text-canvas-fg leading-relaxed">{{ c.body }}</p>
                      <div class="flex flex-wrap gap-space-2 mt-space-3">
                        @for (t of c.tags; track t) {
                          <afi-badge size="sm" intent="info">{{ t }}</afi-badge>
                        }
                      </div>
                    </div>
                  </li>
                }
              </ul>
            </div>

            <!-- ========== Auditoría ========== -->
            <div id="auditoria" class="mt-space-12 px-space-8">
              <afi-section-header
                eyebrow="Auditoría"
                title="Auditoría growth.design"
                snippet="Treinta y seis principios de psicología conductual aplicados sobre el mismo frame — solo los que tienen sentido en formato email. Marco inspirado en growth.design/psychology/cheatsheet."
              />

              <!-- Overall score -->
              <div
                class="flex items-end gap-space-6 px-space-5 py-space-4 rounded-md border border-border-hairline bg-surface-quiet mb-space-4"
              >
                <div class="min-w-0">
                  <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-1">
                    Puntuación global
                  </p>
                  <p class="text-subtitle text-canvas-fg">
                    {{ overallScore }}<span class="text-body-md text-neutral-500">/100</span>
                  </p>
                </div>
                <p class="text-body-sm text-neutral-600 leading-relaxed">
                  Diseño con buena base institucional (autoridad, polish, reciprocidad), pero con
                  decisiones débiles en jerarquía editorial, carga cognitiva y momentos de
                  pertenencia. Tres movimientos clave abajo.
                </p>
              </div>

              <!-- How to read the score -->
              <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-4">
                Cada categoría puntúa de 0 a 100 según cuántos principios del catálogo se aplican
                bien en este diseño — 1 punto si <span class="text-canvas-fg font-medium">Fuerte</span>,
                0,5 si <span class="text-canvas-fg font-medium">Parcial</span>, 0 si
                <span class="text-canvas-fg font-medium">Ausente</span>. Ejemplo —
                <em>Emotion & Trust</em> = 60/100 porque de los 5 principios de la categoría, 2
                están Fuertes + 2 Parciales + 1 Ausente → (2 + 1) / 5 = 60 %.
              </p>

              <!-- Per-category score table -->
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-space-2 mb-space-6">
                @for (cat of categories; track cat.id) {
                  <li
                    class="flex items-center justify-between gap-space-3 px-space-4 py-space-3 rounded-md border border-border-hairline"
                  >
                    <a
                      [href]="'#cat-' + cat.id"
                      class="text-body-sm text-canvas-fg hover:text-action-700"
                      >{{ cat.label }}</a
                    >
                    <span class="text-body-sm font-medium text-canvas-fg tabular-nums"
                      >{{ cat.score }}<span class="text-neutral-500">/100</span></span
                    >
                  </li>
                }
              </ul>

              <!-- Top fixes -->
              <h3
                class="text-body-lg-600 text-canvas-fg mb-space-3 pb-space-2 border-b border-border-hairline"
              >
                Top fixes priorizados
              </h3>
              <ol class="flex flex-col gap-space-3 mb-space-8">
                @for (fix of topFixes; track $index) {
                  <li
                    class="p-space-5 rounded-md border border-border-hairline bg-surface-quiet"
                  >
                    <div class="flex items-start justify-between gap-space-3 mb-space-2">
                      <p class="text-body-md font-semibold text-canvas-fg min-w-0 flex-1">
                        {{ $index + 1 }}. {{ fix.title }}
                      </p>
                      <div class="flex gap-space-2 shrink-0">
                        <afi-badge size="sm" [intent]="impactIntent(fix.impact)">
                          Impacto · {{ fix.impact }}
                        </afi-badge>
                        <afi-badge size="sm" intent="neutral">
                          Esfuerzo · {{ fix.effort }}
                        </afi-badge>
                      </div>
                    </div>
                    <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-2">
                      <span class="text-canvas-fg font-medium">Qué falla: </span>{{ fix.whatsBroken }}
                    </p>
                    <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-3">
                      <span class="text-canvas-fg font-medium">Cómo arreglarlo: </span>{{ fix.fix }}
                    </p>
                    <div class="flex flex-wrap gap-space-1">
                      @for (p of fix.principles; track p) {
                        <afi-badge size="sm" intent="info">{{ p }}</afi-badge>
                      }
                    </div>
                  </li>
                }
              </ol>

              <!-- Full checklist by category -->
              <h3
                class="text-body-lg-600 text-canvas-fg mb-space-2 pb-space-2 border-b border-border-hairline"
              >
                Checklist completo
              </h3>
              <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-2">
                Una fila por principio del catálogo growth.design — solo los que aplican al
                formato newsletter. La etiqueta a la izquierda indica el veredicto:
                <span class="text-canvas-fg font-medium">Fuerte</span> (aplicado y bien
                ejecutado), <span class="text-canvas-fg font-medium">Parcial</span> (presente pero
                débil o inconsistente), <span class="text-canvas-fg font-medium">Ausente</span>
                (falta y haría falta aquí).
              </p>
              <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-4">
                <span class="text-canvas-fg font-medium">Léelo con cautela.</span> Es un marco
                heurístico, no una verdad absoluta — los principios se contraponen entre sí
                (compromiso temprano vs fricción inicial, autoridad vs cercanía, scarcity vs
                trust) y maximizarlos todos no es el objetivo. Algunas <em>Ausentes</em> pueden
                ser decisiones deliberadas de marca o de estrategia. La auditoría sirve para
                enmarcar la conversación, no para ejecutar al pie de la letra.
              </p>
              <div class="flex flex-col gap-space-8">
                @for (cat of categories; track cat.id) {
                  <section [id]="'cat-' + cat.id">
                    <div class="flex items-baseline justify-between mb-space-2">
                      <h4 class="text-body-md font-semibold text-canvas-fg">{{ cat.label }}</h4>
                      <span class="text-body-sm text-neutral-500 tabular-nums"
                        >{{ cat.score }}/100</span
                      >
                    </div>
                    <p class="text-body-sm text-neutral-600 leading-relaxed mb-space-3">
                      {{ cat.description }}
                    </p>
                    <ul class="flex flex-col">
                      @for (f of cat.findings; track f.principle) {
                        <li
                          class="flex items-start gap-space-3 py-space-3 border-b border-border-hairline last:border-b-0"
                        >
                          <afi-badge
                            size="sm"
                            [intent]="verdictIntent(f.verdict)"
                            class="shrink-0 mt-space-1"
                          >
                            {{ verdictLabel(f.verdict) }}
                          </afi-badge>
                          <p class="text-body-sm text-canvas-fg min-w-0 flex-1 leading-relaxed">
                            <span class="font-medium">{{ f.principle }}</span>
                            <span class="text-neutral-600"> — {{ f.note }}</span>
                          </p>
                        </li>
                      }
                    </ul>
                  </section>
                }
              </div>

              <p
                class="text-caption text-neutral-500 mt-space-8 pt-space-4 border-t border-border-hairline"
              >
                Marco de auditoría inspirado en growth.design/psychology/cheatsheet. Catálogo de
                principios curado a partir de Kahneman, Cialdini, Thaler, Fogg, Eyal y Ariely.
              </p>
            </div>

            <!-- ========== Boceto v2 ========== -->
            <div id="boceto" class="mt-space-12 px-space-8">
              <afi-section-header
                eyebrow="Boceto"
                title="Propuesta v2 — top fixes aplicados"
                snippet="Mock estilizado que aplica los tres fixes prioritarios sobre el diseño actual. Las anotaciones a la derecha cruzan cada cambio con su fix correspondiente."
              />

              <div class="flex flex-col md:flex-row gap-space-6">
                <!-- Mock -->
                <div
                  class="flex-1 min-w-0 rounded-md border border-border-hairline bg-surface-quiet p-space-4 flex flex-col gap-space-3"
                >
                  <!-- Header: AFI logo only (sin keyword line, sin fecha) -->
                  <div
                    class="px-space-3 py-space-3 rounded-sm bg-canvas-base border border-border-hairline"
                  >
                    <p class="text-body-md font-serif text-canvas-fg">Afi</p>
                    <p class="text-body-sm text-neutral-500 mt-space-1">
                      Estos son los análisis que hemos seleccionado este mes para ti.
                    </p>
                  </div>

                  <!-- Preferences strip — top placement -->
                  <div
                    class="flex items-center gap-space-2 px-space-3 py-space-2 rounded-sm bg-action/5 border border-action/30 flex-wrap"
                  >
                    <span class="text-caption text-action-700 uppercase tracking-wider"
                      >Tus temas</span
                    >
                    @for (t of ['Banca', 'Mercados', 'Macro']; track t) {
                      <span
                        class="text-caption px-space-2 py-0.5 rounded-full bg-canvas-base border border-action/40 text-canvas-fg"
                        >{{ t }}</span
                      >
                    }
                    <span
                      class="text-caption text-action-700 font-medium ml-auto whitespace-nowrap"
                      >Actualiza tus preferencias ›</span
                    >
                  </div>

                  <!-- Lead — full width destacado -->
                  <div
                    class="rounded-sm border border-border-hairline bg-canvas-base p-space-3 flex gap-space-3"
                  >
                    <div class="w-24 h-20 rounded-sm bg-neutral-200 shrink-0"></div>
                    <div class="min-w-0 flex-1 flex flex-col gap-space-1">
                      <div class="flex items-center gap-space-2">
                        <span
                          class="text-caption px-space-2 py-0.5 rounded-full bg-action text-canvas-base font-medium tracking-wider uppercase"
                          >Destacado</span
                        >
                        <span class="text-caption text-neutral-500">Estudio · Banca</span>
                      </div>
                      <p class="text-body-sm font-medium text-canvas-fg leading-snug">
                        Título destacado del mes
                      </p>
                      <p class="text-caption text-neutral-600">
                        Takeaway de una línea para enganchar.
                      </p>
                    </div>
                  </div>

                  <!-- 2-column grid -->
                  <div class="grid grid-cols-2 gap-space-2">
                    @for (n of bocetoCards; track n) {
                      <div
                        class="rounded-sm border border-border-hairline bg-canvas-base p-space-3 flex flex-col gap-space-1"
                      >
                        <span class="text-caption text-neutral-500">04-may · Tema</span>
                        <p class="text-caption font-medium text-canvas-fg leading-snug">
                          Título de la publicación
                        </p>
                        <div class="h-1 w-3/4 rounded-sm bg-neutral-200"></div>
                        <div class="h-1 w-full rounded-sm bg-neutral-200"></div>
                      </div>
                    }
                  </div>

                  <!-- Events banner — properly themed -->
                  <div
                    class="rounded-sm bg-action/5 border border-action/30 px-space-3 py-space-3 flex items-center justify-between gap-space-3"
                  >
                    <div class="min-w-0">
                      <p class="text-caption font-medium text-canvas-fg">Próximos eventos Afi</p>
                      <p class="text-caption text-neutral-600">Agenda del trimestre</p>
                    </div>
                    <span class="text-caption text-action-700 font-medium whitespace-nowrap"
                      >Ver eventos ›</span
                    >
                  </div>

                  <!-- Unsubscribe / policy right after events -->
                  <p class="text-caption text-neutral-500 text-center px-space-3">
                    Cancelar suscripción · Política de privacidad · Gestionar preferencias
                  </p>

                  <!-- Trimmed footer — social only -->
                  <div
                    class="flex items-center justify-center gap-space-3 pt-space-2 border-t border-border-hairline"
                  >
                    @for (icon of ['in', '𝕏', 'IG', 'YT']; track icon) {
                      <span
                        class="w-6 h-6 rounded-full bg-neutral-200 text-canvas-fg text-caption font-medium inline-flex items-center justify-center"
                        >{{ icon }}</span
                      >
                    }
                  </div>
                </div>

                <!-- Annotations -->
                <ol class="md:w-72 flex flex-col gap-space-3 shrink-0">
                  @for (note of bocetoNotes; track note.title) {
                    <li
                      class="p-space-3 rounded-md border border-border-hairline bg-surface-quiet"
                    >
                      <div class="flex items-center gap-space-2 mb-space-1">
                        <afi-badge size="sm" intent="info">Fix {{ note.fix }}</afi-badge>
                        <p class="text-body-sm font-medium text-canvas-fg min-w-0">
                          {{ note.title }}
                        </p>
                      </div>
                      <p class="text-caption text-neutral-600 leading-relaxed">{{ note.body }}</p>
                    </li>
                  }
                </ol>
              </div>

              <p
                class="text-caption text-neutral-500 mt-space-4 pt-space-3 border-t border-border-hairline"
              >
                Esto es un boceto estilizado para ilustrar las recomendaciones — el diseño
                completo y de alta fidelidad vive en el frame v2 de Figma (29-7578).
              </p>
            </div>
          </div>

          <site-on-this-page [sections]="tocSections" />
        </div>
      </main>
    </div>
  `,
})
export class NewsletterFeedbackPage {
  readonly figmaV1Url = FIGMA_V1_URL;
  readonly figmaV2Url = FIGMA_V2_URL;

  readonly tocSections: TocItem[] = [
    { id: 'comentarios', label: 'Comentarios' },
    { id: 'auditoria', label: 'Auditoría' },
    { id: 'boceto', label: 'Boceto v2' },
  ];

  readonly bocetoCards = [1, 2, 3, 4];

  readonly bocetoNotes = [
    {
      fix: 1,
      title: 'Preferencias al inicio',
      body: 'Banda con los temas activos del lector más enlace a "Actualiza" — al principio en vez de al final.',
    },
    {
      fix: 2,
      title: 'Destacado + grid 2 columnas',
      body: 'Una pieza lead a ancho completo crea ancla editorial; el resto en mosaic reduce scroll y aporta jerarquía.',
    },
    {
      fix: 3,
      title: 'Header y pie limpios',
      body: 'Fuera la línea "Keyword, keyword..." y la fecha del header. El pie se reduce a iconos sociales — el banner de eventos es ahora el cierre.',
    },
  ];

  readonly comments: Comment[] = [
    {
      body: "The subject line shouldn't be in the email copy (keyword, keyword...) because it will be generated automatically and might not be good enough.",
      tags: ['Asunto', 'Cabecera'],
    },
    {
      body: "Remember the team should have the option to change it manually if it doesn't generate something suitable.",
      tags: ['Asunto', 'Editorial'],
    },
    {
      body: "The date in the header doesn't add anything. In fact, it's confusing, since each publication will have its own date.",
      tags: ['Cabecera'],
    },
    {
      body: "I don't see the 'media/source' tag, which will be needed in some cases.",
      tags: ['Metadatos'],
    },
    {
      body: 'For people who receive the monthly newsletter or are subscribed to many topics, the scroll will be endless. The blocks should appear in at least two columns, right?',
      tags: ['Layout'],
    },
    {
      body: 'What logic is being used to organize the publications?',
      tags: ['Editorial'],
    },
    {
      body: '"Update your preferences" should be a button visible right at the beginning of the newsletter, like in the KPMG example I sent you.',
      tags: ['Preferencias'],
    },
    {
      body: 'The banner at the bottom should link to the "Events" page, not "Make the most of…". Please pay attention to the tone of voice—it doesn\'t feel like Afi at all 😉',
      tags: ['Banner', 'Tono'],
    },
    {
      body: 'Right after the events banner, the unsubscribe options, policy, etc., should appear.',
      tags: ['Legal'],
    },
    {
      body: 'I think the footer with links to website sections is excessive. We already have enough CTAs. At most, include social media icons, which I believe are already part of our templates.',
      tags: ['Pie'],
    },
  ];

  readonly overallScore = 42;

  readonly categories: AuditCategory[] = [
    {
      id: 'perception',
      label: 'Perception & Attention',
      description:
        'Cómo el ojo del lector ve, nota y prioriza la información visual. Mide si lo importante destaca, si hay jerarquía clara y si el lector encuentra rápido lo que tiene que encontrar.',
      score: 33,
      findings: [
        {
          principle: 'Von Restorff',
          verdict: 'partial',
          note: 'el CTA inferior destaca, pero todas las tarjetas se ven iguales — nada gana la mirada',
        },
        {
          principle: 'Serial Position',
          verdict: 'partial',
          note: 'la primera tarjeta gana primacía; el slot de recencia se gasta en el banner de upgrade',
        },
        {
          principle: "Hick's Law",
          verdict: 'missing',
          note: 'cada tarjeta expone varios link targets; el pie suma ~20 más',
        },
        {
          principle: "Fitts's Law",
          verdict: 'partial',
          note: 'la acción principal (preferencias) queda muy abajo; los chips son pequeños',
        },
        {
          principle: "Miller's Law",
          verdict: 'missing',
          note: '6+ tarjetas + ~25 enlaces en el pie supera holgadamente el budget de memoria de trabajo',
        },
        {
          principle: 'Gestalt',
          verdict: 'partial',
          note: 'agrupación dentro de cada tarjeta es buena; la fecha y el keyword line del header flotan sin anclaje',
        },
      ],
    },
    {
      id: 'load',
      label: 'Cognitive Load',
      description:
        'Cuánto esfuerzo mental exige el diseño para entenderlo y procesarlo. Mide si la información está bien dosificada, si hay claridad sin jerga y si el lector no se ve abrumado por opciones o densidad.',
      score: 38,
      findings: [
        {
          principle: 'Cognitive Load Theory',
          verdict: 'missing',
          note: 'flujo uniforme de tarjetas + 25 enlaces en el pie + banner = coste mental alto para el payoff que ofrece',
        },
        {
          principle: 'Chunking',
          verdict: 'partial',
          note: 'cada tarjeta agrupa bien sus campos; el digest no agrupa las tarjetas por tema o recencia',
        },
        {
          principle: 'Cognitive Ease',
          verdict: 'partial',
          note: 'tipografía y espaciado limpios; el lorem ipsum impide un juicio más completo',
        },
        {
          principle: "Jakob's Law",
          verdict: 'partial',
          note: 'columna única es atípica para digests con este volumen — el patrón industria es mosaic',
        },
      ],
    },
    {
      id: 'decision',
      label: 'Decision-Making',
      description:
        'Cómo el diseño guía al lector a elegir y a comprometerse. Mide si hay anclajes editoriales, framing claro y defaults sensatos que reducen la fricción en cada momento de decisión.',
      score: 25,
      findings: [
        {
          principle: 'Anchoring',
          verdict: 'missing',
          note: 'no hay ancla editorial ("Destacado", "Must-read") que ordene la lectura',
        },
        {
          principle: 'Framing',
          verdict: 'partial',
          note: 'el banner inferior usa gain-framing, pero el tono no se siente AFI según el equipo',
        },
        {
          principle: 'Loss Aversion',
          verdict: 'missing',
          note: 'no hay gancho de propiedad / exclusividad ("members-only", "porque leíste X")',
        },
        {
          principle: 'Default Effect',
          verdict: 'partial',
          note: 'el asunto se auto-genera sin override manual — default trampa que el equipo ya señala',
        },
        {
          principle: 'Paradox of Choice',
          verdict: 'partial',
          note: 'manejable en las tarjetas, saturado en el pie',
        },
        {
          principle: 'Hyperbolic Discounting',
          verdict: 'missing',
          note: 'no hay payoff inmediato dentro del email — el reader tiene que hacer click para extraer valor',
        },
      ],
    },
    {
      id: 'social',
      label: 'Social Influence',
      description:
        'Cómo el comportamiento, la presencia y la credibilidad de otros moldean al lector. Mide autoridad institucional, testimonios reales, reciprocidad y otras señales sociales que reducen incertidumbre.',
      score: 60,
      findings: [
        {
          principle: 'Social Proof',
          verdict: 'missing',
          note: 'no hay "lo más leído", recuentos de lectores ni señales sociales entre pares',
        },
        {
          principle: 'Authority',
          verdict: 'strong',
          note: 'marca AFI + filiales en el pie + atribución de autor por tarjeta = peso institucional sólido',
        },
        {
          principle: 'Reciprocity',
          verdict: 'strong',
          note: 'el digest mismo es el regalo recíproco — research curada gratis',
        },
        {
          principle: 'Commitment & Consistency',
          verdict: 'partial',
          note: 'las preferencias existen pero se descubren tarde — no funcionan como compromiso temprano',
        },
        {
          principle: 'Liking',
          verdict: 'partial',
          note: 'fotos reales ayudan; la voz del banner no encaja con la marca según el equipo',
        },
      ],
    },
    {
      id: 'motivation',
      label: 'Motivation & Habit',
      description:
        'Qué empuja al lector a empezar, a persistir y a volver edición tras edición. Mide si hay triggers claros, payoffs rápidos en cada número y bucles de inversión que generan retorno sin manipular.',
      score: 30,
      findings: [
        {
          principle: 'Fogg Behavior Model',
          verdict: 'partial',
          note: 'trigger claro, ability media, motivación no se refuerza ("¿por qué este número?")',
        },
        {
          principle: 'Self-Determination',
          verdict: 'partial',
          note: 'las preferencias apoyan la autonomía pero quedan enterradas',
        },
        {
          principle: 'Progress Principle',
          verdict: 'missing',
          note: 'no hay señal de progreso del lector entre ediciones',
        },
        {
          principle: 'Variable Rewards',
          verdict: 'partial',
          note: 'el contenido varía por naturaleza, pero el formato es demasiado uniforme para sentirse descubrimiento',
        },
        {
          principle: 'Hook Model',
          verdict: 'missing',
          note: 'sin loop de inversión (guardados, historial de lectura, etc.)',
        },
      ],
    },
    {
      id: 'memory',
      label: 'Memory & Experience',
      description:
        'Cómo se codifica, se recuerda y se re-vive la experiencia. Mide los picos y los cierres (Peak-End), la continuidad entre ediciones y la consistencia que construye familiaridad con la marca.',
      score: 50,
      findings: [
        {
          principle: 'Peak-End',
          verdict: 'missing',
          note: 'cierra con texto legal en cuerpo pequeño — falta un sign-off memorable',
        },
        {
          principle: 'Zeigarnik',
          verdict: 'partial',
          note: 'oportunidad perdida de surfacer "no terminaste de leer X"',
        },
        {
          principle: 'Availability Heuristic',
          verdict: 'partial',
          note: 'los tags son abstractos; falta un gancho concreto en el copy',
        },
        {
          principle: 'Mere Exposure',
          verdict: 'strong',
          note: 'branding consistente entre header, banner y pie',
        },
        {
          principle: 'IKEA Effect',
          verdict: 'partial',
          note: 'el momento IKEA son las preferencias, pero quedan enterradas y no se reflejan visiblemente en el digest',
        },
      ],
    },
    {
      id: 'trust',
      label: 'Emotion & Trust',
      description:
        'Credibilidad, sensaciones y el chequeo intuitivo de "¿esto es seguro y para mí?". Mide polish visual, señales de confianza, sentido de pertenencia y el halo que la calidad del diseño proyecta sobre todo lo demás.',
      score: 60,
      findings: [
        {
          principle: 'Halo Effect',
          verdict: 'strong',
          note: 'polish visual alto y consistente',
        },
        {
          principle: 'Aesthetic-Usability',
          verdict: 'strong',
          note: 'tipografía y espaciado refuerzan la credibilidad',
        },
        {
          principle: 'Endowment Effect',
          verdict: 'missing',
          note: 'no se muestra estado personalizado (sin "tus temas")',
        },
        {
          principle: 'Trust Signals',
          verdict: 'partial',
          note: 'pie corporativo + disclaimer presentes; conviene subir unsubscribe/política tras el banner',
        },
        {
          principle: 'Confirmation Bias',
          verdict: 'partial',
          note: 'los tags permitirían alinear contenido a intereses, pero no se ve personalización',
        },
      ],
    },
  ];

  readonly topFixes: TopFix[] = [
    {
      title: 'Subir "Actualiza tus preferencias" al inicio y mostrar el estado actual',
      impact: 'Alto',
      effort: 'Bajo',
      whatsBroken:
        'el CTA de preferencias solo vive abajo, tras un scroll largo. El lector llega al único momento de personalización al final, y en ningún punto ve "sus temas" — falta sentido de propiedad.',
      fix: 'añadir una banda fina justo bajo el header con los temas activos del lector como chips removibles y un enlace "Actualiza tus preferencias". Si conviene mantener el banner inferior, mantenerlo — pero el ancla útil es la de arriba. Referencia KPMG.',
      principles: ['Commitment & Consistency', 'Self-Determination', 'Endowment', "Fitts's Law"],
    },
    {
      title: 'Mosaic a dos columnas con un destacado a ancho completo',
      impact: 'Alto',
      effort: 'Medio',
      whatsBroken:
        'seis tarjetas casi idénticas en una sola columna = sin jerarquía editorial y con scroll infinito. Nada destaca, nada se lee como "el imprescindible del mes".',
      fix: 'promover una tarjeta a "Destacado" full-width (imagen + titular más grande + 1 línea de takeaway), y resto en grid 2 columnas. Añadir slot de tag media/source. Ordenar por una regla documentada (fecha desc o prioridad temática) y mencionar esa regla en una nota editorial.',
      principles: ['Von Restorff', "Miller's Law", 'Cognitive Load', 'Anchoring', 'Serial Position'],
    },
    {
      title: 'Retirar la fecha del header y el "Keyword, keyword..." del cuerpo',
      impact: 'Medio',
      effort: 'Bajo',
      whatsBroken:
        'la fecha del header es redundante (cada tarjeta lleva la suya) y el placeholder del asunto colado en el cuerpo expone la auto-generación. El asunto inline bloquea además la posibilidad de que el equipo lo sobrescriba manualmente cuando la generación automática no acierte.',
      fix: 'eliminar la fecha del header. Sustituir el "Keyword, keyword..." por una intro editorial corta (1-2 frases) y desacoplar el asunto que llega al inbox del copy del cuerpo — el asunto pasa por un campo de override manual upstream.',
      principles: ['Cognitive Load', 'Halo', 'Default Effect'],
    },
  ];

  verdictIntent(v: Verdict): 'success' | 'warning' | 'error' {
    switch (v) {
      case 'strong':
        return 'success';
      case 'partial':
        return 'warning';
      case 'missing':
        return 'error';
    }
  }

  verdictLabel(v: Verdict): string {
    switch (v) {
      case 'strong':
        return 'Fuerte';
      case 'partial':
        return 'Parcial';
      case 'missing':
        return 'Ausente';
    }
  }

  impactIntent(level: ImpactLevel): 'error' | 'warning' | 'neutral' {
    switch (level) {
      case 'Alto':
        return 'error';
      case 'Medio':
        return 'warning';
      case 'Bajo':
        return 'neutral';
    }
  }
}
