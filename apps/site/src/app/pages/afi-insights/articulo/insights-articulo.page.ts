import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, throttleTime } from 'rxjs';
import { BadgeComponent, ButtonComponent, InputComponent } from '@coherence/ui';
import { InsightsHeaderComponent } from '../shared/insights-header.component';
import { InsightsFooterComponent } from '../shared/insights-footer.component';
import { ArticleCardComponent } from '../shared/article-card.component';
import { MOCK_ARTICLES, ARTICLE_BODY_SECTIONS, CATEGORIES } from '../data/mock-articles';

const FEATURED = MOCK_ARTICLES[0]!;

@Component({
  selector: 'ai-insights-articulo',
  standalone: true,
  imports: [
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    InsightsHeaderComponent,
    InsightsFooterComponent,
    ArticleCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas">
      <ai-insights-header />

      <main class="flex-1">
        <!-- Hero — image background + floating white card -->
        <section class="relative overflow-hidden">
          <!-- Background image (gradient placeholder approximating the Figma photo) -->
          <div
            class="relative h-[320px] sm:h-[400px] md:h-[480px]"
            style="
              background:
                radial-gradient(ellipse 55% 50% at 50% 38%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 55%),
                radial-gradient(ellipse 90% 90% at 50% 30%, #5a83d8 0%, #1e3a8a 40%, #0a1428 100%);
            "
          >
            <!-- Subtle noise overlay -->
            <div
              class="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
              style="background-image: url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>&quot;);"
            ></div>
          </div>

          <!-- Overlapping white card -->
          <div class="relative -mt-[120px] sm:-mt-[160px] md:-mt-[200px] z-10">
            <div class="max-w-[1100px] mx-auto px-space-6">
              <div class="relative">
                <!-- Folder-shaped white surface drawn as SVG so the title block
                     can "dive down" into a concave notch where the tabs sit.
                     preserveAspectRatio="none" stretches the path; small corner
                     radii (16-20px) absorb the distortion. -->
                <svg
                  class="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 320"
                  aria-hidden="true"
                >
                  <path
                    d="M 12 0
                       L 700 0
                       Q 716 0 716 16
                       L 716 56
                       Q 716 72 732 72
                       L 988 72
                       Q 1000 72 1000 88
                       L 1000 308
                       Q 1000 320 988 320
                       L 12 320
                       Q 0 320 0 308
                       L 0 12
                       Q 0 0 12 0
                       Z"
                    fill="white"
                  />
                </svg>

                <!-- Folder tabs — straddle the lower-portion top edge of the
                     SVG folder (viewBox y≈72, ~22% of card height) so the top
                     half pokes up into the notch and the bottom half sits on
                     the white surface, reading as classic file tabs. -->
                <div
                  class="absolute top-[calc(22%-16px)] right-space-6 flex items-center gap-space-2 z-20"
                >
                  <span
                    class="text-body-sm font-medium px-space-4 py-2 rounded-md bg-[#2563eb] text-white shadow-sm"
                  >
                    {{ categoryLabel }}
                  </span>
                  <span
                    class="text-body-sm px-space-4 py-2 rounded-md bg-[#dbeafe] text-[#1e3a8a] border border-[#bfdbfe]"
                  >
                    {{ shortDate }}
                  </span>
                </div>

                <!-- Title block — narrower so it stays in the upper-left
                     part of the folder, leaving the notch on the right empty -->
                <div
                  class="relative p-space-6 sm:p-space-8 md:p-space-10 pb-space-6 md:pb-space-8"
                  style="max-width: 71%;"
                >
                  <h1
                    class="font-serif text-canvas-fg leading-[1.15] text-[26px] sm:text-[32px] md:text-[40px]"
                  >
                    {{ article.title }}
                  </h1>
                </div>

                <!-- Author strip + share icons — full width on the bottom -->
                <div class="relative px-space-6 sm:px-space-8 md:px-space-10 pb-space-6">
                  <div
                    class="flex flex-wrap items-center justify-between gap-space-4 pt-space-4 border-t border-border-hairline"
                  >
                    <div class="flex items-center gap-space-3">
                      <div class="flex -space-x-2">
                        @for (
                          author of article.authors;
                          track author.name;
                          let i = $index
                        ) {
                          <img
                            [src]="avatarUrl(author.name)"
                            [alt]="author.name"
                            class="w-9 h-9 rounded-full ring-2 ring-white object-cover bg-surface-quiet"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                          />
                        }
                      </div>
                      <div class="min-w-0">
                        <p class="text-body-sm text-canvas-fg flex flex-wrap items-center gap-x-1">
                          @for (
                            author of article.authors;
                            track author.name;
                            let i = $index, count = $count
                          ) {
                            <span class="inline-flex items-center gap-1">
                              <span class="font-medium">{{ author.name }}</span>
                              <a
                                [href]="authorLinkedinUrl(author.name)"
                                target="_blank"
                                rel="noopener noreferrer"
                                [attr.aria-label]="'LinkedIn de ' + author.name"
                                class="inline-flex items-center justify-center w-5 h-5 rounded text-neutral-500 hover:text-[#0a66c2] hover:bg-surface-quiet transition-colors"
                              >
                                <svg
                                  class="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                                  />
                                </svg>
                              </a>
                              <a
                                [href]="authorEmailUrl(author.name)"
                                [attr.aria-label]="'Email a ' + author.name"
                                class="inline-flex items-center justify-center w-5 h-5 rounded text-neutral-500 hover:text-canvas-fg hover:bg-surface-quiet transition-colors"
                              >
                                <svg
                                  class="w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                  <polyline points="22,6 12,13 2,6" />
                                </svg>
                              </a>
                            </span>
                            @if (i < count - 1) {
                              <span class="text-neutral-400 mx-1">{{
                                i === count - 2 ? '&' : ','
                              }}</span>
                            }
                          }
                        </p>
                        <p class="text-[14px] leading-tight text-neutral-500 mt-1">
                          {{ formattedDate }} · {{ article.readingTimeMinutes }} min lectura
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-space-1">
                      <button
                        type="button"
                        aria-label="Compartir en Facebook"
                        class="w-8 h-8 rounded-full bg-surface-quiet hover:bg-surface-muted flex items-center justify-center text-neutral-600 hover:text-canvas-fg transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Compartir en X"
                        class="w-8 h-8 rounded-full bg-surface-quiet hover:bg-surface-muted flex items-center justify-center text-neutral-600 hover:text-canvas-fg transition-colors"
                      >
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Compartir en LinkedIn"
                        class="w-8 h-8 rounded-full bg-surface-quiet hover:bg-surface-muted flex items-center justify-center text-neutral-600 hover:text-canvas-fg transition-colors"
                      >
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path
                            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label="Copiar enlace"
                        class="w-8 h-8 rounded-full bg-surface-quiet hover:bg-surface-muted flex items-center justify-center text-neutral-600 hover:text-canvas-fg transition-colors"
                      >
                        <svg
                          class="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Content + TOC layout -->
        <section class="max-w-[1200px] mx-auto px-space-6 py-space-12">
          <div class="flex gap-space-12">
            <!-- Main content column -->
            <article class="flex-1 max-w-[720px]">
              <!-- Article body (example content) -->
              <div class="prose-coherence">
                <section id="introduccion">
                  <h2 class="text-subtitle font-serif text-canvas-fg mb-space-4">Introduccion</h2>
                  <p class="text-body-md text-neutral-600 mb-space-4 leading-relaxed">
                    El estilo quality en renta variable ha sido historicamente uno de los
                    factores mas consistentes en la generacion de alfa. Sin embargo,
                    existen periodos en los que su comportamiento relativo se deteriora
                    significativamente frente a otras estrategias.
                  </p>
                  <p class="text-body-md text-neutral-600 mb-space-8 leading-relaxed">
                    En este articulo analizamos los principales factores que explican estos
                    episodios, con especial atencion al contexto macroeconomico actual.
                  </p>
                </section>

                <section id="contexto">
                  <h2 class="text-subtitle font-serif text-canvas-fg mb-space-4">Contexto historico</h2>
                  <p class="text-body-md text-neutral-600 mb-space-4 leading-relaxed">
                    Desde 2000, hemos identificado cuatro episodios significativos en los
                    que el factor quality ha experimentado drawdowns superiores al 15% en
                    terminos relativos. Estos periodos comparten caracteristicas comunes
                    que permiten anticipar su recurrencia.
                  </p>
                  <!-- Blockquote -->
                  <blockquote class="border-l-4 border-action pl-space-4 py-space-2 my-space-8 bg-surface-quiet rounded-r-md">
                    <p class="text-body-md text-neutral-600 italic">
                      "Los periodos de peor rendimiento del estilo quality coinciden
                      sistematicamente con rotaciones agresivas hacia activos de mayor
                      beta y menor calidad fundamentalr."
                    </p>
                    <cite class="text-caption text-neutral-400 mt-space-2 block">
                      — Departamento de Analisis, AFI
                    </cite>
                  </blockquote>
                </section>

                <section id="factores">
                  <h2 class="text-subtitle font-serif text-canvas-fg mb-space-4">Factores determinantes</h2>
                  <p class="text-body-md text-neutral-600 mb-space-6 leading-relaxed">
                    Tres factores principales explican la mayor parte de la variabilidad
                    en el comportamiento relativo del estilo quality.
                  </p>

                  <section id="factor-macro">
                    <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">Entorno macroeconomico</h3>
                    <p class="text-body-md text-neutral-600 mb-space-6 leading-relaxed">
                      Las fases de expansion economica rapida tienden a favorecer
                      estrategias de mayor riesgo. Cuando el crecimiento del PIB supera
                      las expectativas del consenso, los inversores rotan hacia companias
                      ciclicas de menor calidad.
                    </p>
                  </section>

                  <section id="factor-valoracion">
                    <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">Diferencial de valoracion</h3>
                    <p class="text-body-md text-neutral-600 mb-space-6 leading-relaxed">
                      Cuando la prima de valoracion de las companias quality se situa
                      por encima de su media historica, el margen de seguridad se reduce
                      y aumenta la vulnerabilidad ante correcciones.
                    </p>
                  </section>
                </section>

                <!-- Mid-article subscribe CTA -->
                <div class="my-space-12 p-space-8 rounded-md bg-surface-quiet border border-border-hairline text-center">
                  <p class="text-body-md font-medium text-canvas-fg mb-space-2">
                    No te pierdas el analisis que mueve el sector
                  </p>
                  <p class="text-body-sm text-neutral-500 mb-space-4">
                    Recibe contenido como este directamente en tu bandeja.
                  </p>
                  <div class="flex items-center justify-center gap-space-3 max-w-[400px] mx-auto">
                    <div class="flex-1">
                      <afi-input
                        type="email"
                        placeholder="tu email corporativo"
                        ariaLabel="Email para suscripcion"
                        size="sm"
                      />
                    </div>
                    <afi-button variant="primary" size="sm">Suscribir</afi-button>
                  </div>
                </div>

                <section id="datos">
                  <h2 class="text-subtitle font-serif text-canvas-fg mb-space-4">Datos clave</h2>
                  <!-- Data callout grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-space-4 mb-space-8">
                    @for (d of dataPoints; track d.label) {
                      <div class="p-space-4 rounded-md bg-surface-quiet border border-border-hairline text-center">
                        <p class="text-title font-serif text-action-700">{{ d.value }}</p>
                        <p class="text-caption text-neutral-500 mt-space-1">{{ d.label }}</p>
                      </div>
                    }
                  </div>
                  <p class="text-body-md text-neutral-600 mb-space-8 leading-relaxed">
                    Estos datos confirman que los episodios de bajo rendimiento relativo
                    del quality son temporales y tienden a revertir en plazos de 12 a 18
                    meses, ofreciendo oportunidades de entrada para inversores con
                    horizonte de medio plazo.
                  </p>
                </section>

                <section id="conclusion">
                  <h2 class="text-subtitle font-serif text-canvas-fg mb-space-4">Conclusion</h2>
                  <p class="text-body-md text-neutral-600 mb-space-4 leading-relaxed">
                    Comprender los factores que impulsan los episodios de peor
                    comportamiento del estilo quality es esencial para gestionar
                    adecuadamente las expectativas de los inversores y aprovechar
                    las oportunidades taticas que estos periodos generan.
                  </p>
                </section>
              </div>

              <!-- Related articles -->
              <div class="mt-space-16 pt-space-8 border-t border-border-hairline">
                <h2 class="text-body-lg-600 text-canvas-fg mb-space-6">Insights relacionados</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-4">
                  @for (a of relatedArticles; track a.id) {
                    <ai-article-card [article]="a" />
                  }
                </div>
              </div>
            </article>

            <!-- TOC sidebar (hidden below xl) -->
            <nav
              class="sticky top-[80px] self-start hidden xl:block w-[220px] shrink-0"
              aria-label="En esta pagina"
            >
              <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                En esta pagina
              </p>
              <ul class="flex flex-col gap-space-1 border-l border-border-hairline">
                @for (s of tocSections; track s.id) {
                  <li>
                    <a
                      [href]="'#' + s.id"
                      (click)="scrollToSection($event, s.id)"
                      class="block py-space-1 text-body-sm transition-colors -ml-px border-l-2 hover:text-canvas-fg"
                      [class.pl-space-3]="s.level === 0"
                      [class.pl-space-6]="s.level === 1"
                      [class.text-action-700]="activeSection() === s.id"
                      [class.font-medium]="activeSection() === s.id"
                      [class.border-action-700]="activeSection() === s.id"
                      [class.text-neutral-500]="activeSection() !== s.id"
                      [class.border-transparent]="activeSection() !== s.id"
                    >
                      {{ s.label }}
                    </a>
                  </li>
                }
              </ul>

              <div class="mt-space-8 pt-space-4 border-t border-border-hairline">
                <p class="text-[14px] text-neutral-400">
                  {{ article.readingTimeMinutes }} min lectura
                </p>
              </div>
            </nav>
          </div>
        </section>
      </main>

      <ai-insights-footer />
    </div>
  `,
})
export class InsightsArticuloPage implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly article = FEATURED;
  readonly tocSections = ARTICLE_BODY_SECTIONS;
  readonly relatedArticles = MOCK_ARTICLES.filter((a) => a.id !== FEATURED.id).slice(0, 2);
  readonly activeSection = signal('introduccion');

  readonly dataPoints = [
    { value: '4', label: 'Episodios desde 2000' },
    { value: '15%+', label: 'Drawdown medio relativo' },
    { value: '12-18m', label: 'Plazo de reversion' },
  ];

  get categoryLabel(): string {
    return CATEGORIES.find((c) => c.key === this.article.category)?.label ?? this.article.category;
  }

  get formattedDate(): string {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    const d = new Date(this.article.publishedAt);
    return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
  }

  get shortDate(): string {
    const d = new Date(this.article.publishedAt);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  // Stable portrait per author name. Pravatar serves consistent stock photos
  // for a given numeric id (1–70). Suitable for design mockups; swap for
  // self-hosted images before production.
  avatarUrl(name: string): string {
    const ids: Record<string, number> = {
      'Aitana Bryant Cano': 47,
      'Aitor Milner': 13,
      'Carmen Diaz': 5,
      'Pablo Reyes': 60,
    };
    const id = ids[name] ?? 1;
    return `https://i.pravatar.cc/96?img=${id}`;
  }

  // Demo links — replace with real per-author URLs / emails once we have them.
  authorLinkedinUrl(name: string): string {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
    return `https://www.linkedin.com/in/${slug}`;
  }

  authorEmailUrl(name: string): string {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .split(' ')
      .slice(0, 2)
      .join('.');
    return `mailto:${slug}@afi.es`;
  }

  // "A", "A & B", "A, B & C" — Spanish-style join with & for the last pair.
  joinSeparator(i: number, count: number): string {
    if (i === count - 1) return '';
    if (i === count - 2) return ' & ';
    return ', ';
  }

  ngAfterViewInit(): void {
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(80, undefined, { leading: true, trailing: true }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateActiveSection());

    queueMicrotask(() => this.updateActiveSection());
  }

  scrollToSection(e: Event, id: string): void {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeSection.set(id);
    history.replaceState(null, '', `#${id}`);
  }

  private updateActiveSection(): void {
    const threshold = 160;
    let current = '';
    for (const s of this.tocSections) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= threshold) current = s.id;
      else break;
    }
    if (current) {
      this.activeSection.set(current);
    }
  }
}
