import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

type Secondary = {
  title: string;
  snippet: string;
};

type FeatureBlock =
  | { kind: 'para'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'quote'; text: string; attribution?: string };

type TopicBlock = {
  id: string;
  name: string;
  featureDate: string;
  featureTags: string[];
  featureTitle: string;
  featureBlocks: FeatureBlock[];
  secondaries: Secondary[];
};

type SocialIcon = {
  label: string;
  glyph: string;
};

@Component({
  selector: 'site-newsletter-demo-page',
  standalone: true,
  imports: [RouterLink, BadgeComponent, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas-base">
      <div
        class="flex items-center gap-space-3 border-b border-border-hairline px-space-4 h-10 bg-surface-quiet shrink-0 text-body-sm"
      >
        <a
          routerLink="/novedades/newsletter-decisiones"
          class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-100 text-neutral-500"
          aria-label="Volver a Newsletter — Decisiones"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <a
          routerLink="/novedades"
          [queryParams]="{ tab: 'marketing' }"
          class="text-neutral-500 hover:text-canvas-fg transition-colors"
        >
          Novedades
        </a>
        <span class="text-neutral-400" aria-hidden="true">/</span>
        <a
          routerLink="/novedades/newsletter-decisiones"
          class="text-neutral-500 hover:text-canvas-fg transition-colors"
        >
          Decisiones
        </a>
        <span class="text-neutral-400" aria-hidden="true">/</span>
        <span class="text-canvas-fg font-medium">Demo estructural</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1000px] mx-auto py-space-10 px-space-8">
          <afi-page-header
            title="Newsletter — Demo estructural"
            subtitle="Maqueta mid-fidelity con las nueve decisiones aplicadas. Solo estructura — sin propuestas visuales ni de marca. El contenido es de relleno: léelo como esqueleto, no como copy final."
            [sticky]="false"
            [scrollFade]="false"
          >
            <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
              >NEWSLETTER · DEMO</span
            >
          </afi-page-header>

          <!-- Scope reminder -->
          <div class="mt-space-6 mb-space-8 px-space-4 py-space-3 rounded-md bg-action/5 border border-border-hairline">
            <div class="flex items-start gap-space-3">
              <afi-badge size="sm" intent="info" class="shrink-0 mt-space-1">Nota</afi-badge>
              <p class="text-body-sm text-canvas-fg leading-relaxed flex-1 min-w-0">
                Mid-fidelity estructural. Las imágenes son placeholders, el copy es ilustrativo
                y los iconos sociales son glyphs neutros. La intención es validar el orden de
                bloques y la jerarquía editorial, no el acabado visual.
              </p>
            </div>
          </div>

          <!-- ========== Newsletter mock ========== -->
          <div
            class="mx-auto max-w-[640px] border border-border-hairline rounded-md bg-canvas-base flex flex-col"
          >
            <!-- 1. Header — Afi only, sin keyword line ni fecha -->
            <header class="px-space-6 pt-space-6 pb-space-4">
              <p class="text-body-lg-600 font-serif text-canvas-fg">Afi</p>
            </header>

            <!-- 2. Editorial intro -->
            <section
              class="px-space-6 pb-space-5 border-b border-border-hairline flex flex-col gap-space-3"
            >
              <p class="text-body-md text-canvas-fg leading-relaxed">
                Bienvenido al pulso mensual de los mercados. Esto es lo que está pasando en
                finanzas — los cambios que importan y las lecturas que conviene tener cerca este
                mes.
              </p>
              <div>
                <p class="text-body-sm font-semibold text-canvas-fg mb-space-2">
                  Hoy en la newsletter:
                </p>
                <ul class="flex flex-col gap-space-1 text-body-sm text-neutral-700">
                  <li>
                    · <span class="font-medium text-canvas-fg">Banca:</span> lo que el último
                    informe del BCE cambia en tu posición de tipos.
                  </li>
                  <li>
                    · <span class="font-medium text-canvas-fg">Mercados:</span> por qué la
                    volatilidad de mayo no se parece a la de marzo.
                  </li>
                  <li>
                    · <span class="font-medium text-canvas-fg">Macro:</span> el dato de empleo
                    que el consenso aún no ha digerido.
                  </li>
                </ul>
              </div>
            </section>

            <!-- 3. Preferences strip — top placement -->
            <section class="px-space-6 py-space-4 border-b border-border-hairline">
              <div
                class="flex items-center gap-space-3 px-space-4 py-space-3 rounded-md bg-action/5 border border-action/30 flex-wrap"
              >
                <span class="text-caption uppercase tracking-wider text-action-700 font-medium"
                  >Tus temas</span
                >
                <span class="text-body-sm text-canvas-fg">Banca · Mercados · Macro</span>
                <a
                  href="#"
                  class="text-body-sm text-action-700 font-medium ml-auto whitespace-nowrap hover:underline"
                  >Actualiza tus preferencias ›</a
                >
              </div>
            </section>

            <!-- 4. Per topic — feature + secundarias -->
            @for (topic of topics; track topic.id) {
              <section class="px-space-6 py-space-6 border-b border-border-hairline">
                <p
                  class="text-caption uppercase tracking-wider text-action-700 font-medium mb-space-3"
                >
                  {{ topic.name }}
                </p>

                <!-- Feature -->
                <article
                  class="rounded-md border border-border-hairline overflow-hidden mb-space-4"
                >
                  <div class="aspect-[16/9] bg-neutral-200" aria-hidden="true"></div>
                  <div class="p-space-5 flex flex-col gap-space-3">
                    <p class="text-caption text-neutral-500">{{ topic.featureDate }}</p>
                    <div class="flex flex-wrap gap-space-2">
                      @for (tag of topic.featureTags; track tag) {
                        <afi-badge size="sm" intent="neutral">{{ tag }}</afi-badge>
                      }
                    </div>
                    <h2 class="text-body-lg-600 text-canvas-fg leading-snug">
                      {{ topic.featureTitle }}
                    </h2>
                    @for (block of topic.featureBlocks; track $index) {
                      @switch (block.kind) {
                        @case ('para') {
                          <p class="text-body-sm text-canvas-fg leading-relaxed">
                            {{ block.text }}
                          </p>
                        }
                        @case ('bullets') {
                          <ul class="flex flex-col gap-space-2">
                            @for (item of block.items; track $index) {
                              <li class="flex gap-space-2 text-body-sm text-canvas-fg leading-relaxed">
                                <span class="text-action-700 shrink-0" aria-hidden="true">·</span>
                                <span class="min-w-0 flex-1">{{ item }}</span>
                              </li>
                            }
                          </ul>
                        }
                        @case ('quote') {
                          <blockquote
                            class="border-l-2 border-action pl-space-3 py-space-1 text-body-sm text-canvas-fg italic leading-relaxed"
                          >
                            "{{ block.text }}"
                            @if (block.attribution) {
                              <span
                                class="block text-caption text-neutral-600 mt-space-1 not-italic"
                              >
                                — {{ block.attribution }}
                              </span>
                            }
                          </blockquote>
                        }
                      }
                    }
                    <a
                      href="#"
                      class="text-body-sm text-action-700 font-medium hover:underline w-fit mt-space-1"
                      >Leer el análisis completo ›</a
                    >
                  </div>
                </article>

                <!-- Secundarias: titular + frase + enlace -->
                <ul class="flex flex-col">
                  @for (sec of topic.secondaries; track sec.title) {
                    <li
                      class="py-space-3 border-t border-border-hairline first:border-t-0 flex flex-col gap-space-1"
                    >
                      <p class="text-body-sm font-semibold text-canvas-fg leading-snug">
                        {{ sec.title }}
                      </p>
                      <p class="text-caption text-neutral-700 leading-relaxed">
                        {{ sec.snippet }}
                      </p>
                      <a
                        href="#"
                        class="text-caption text-action-700 font-medium hover:underline w-fit"
                        >Leer más ›</a
                      >
                    </li>
                  }
                </ul>
              </section>
            }

            <!-- 5. Events banner — re-targeted, Afi voice placeholder -->
            <section class="px-space-6 py-space-5 bg-action/5 border-b border-border-hairline">
              <div class="flex items-center justify-between gap-space-4 flex-wrap">
                <div class="min-w-0">
                  <p
                    class="text-caption uppercase tracking-wider text-action-700 mb-space-1"
                  >
                    Eventos
                  </p>
                  <p class="text-body-md font-semibold text-canvas-fg">Próximos eventos Afi</p>
                  <p class="text-body-sm text-neutral-700 mt-space-1">
                    Agenda del trimestre y plazas disponibles. [Copy final pendiente del owner
                    de brand-voice.]
                  </p>
                </div>
                <a
                  href="#"
                  class="text-body-sm text-action-700 font-medium whitespace-nowrap hover:underline shrink-0"
                  >Ver eventos ›</a
                >
              </div>
            </section>

            <!-- 6. Legal row — right after events -->
            <section
              class="px-space-6 py-space-4 border-b border-border-hairline text-center"
            >
              <p class="text-caption text-neutral-600 leading-relaxed">
                <a href="#" class="hover:underline">Cancelar suscripción</a> ·
                <a href="#" class="hover:underline">Política de privacidad</a> ·
                <a href="#" class="hover:underline">Gestionar preferencias</a>
              </p>
            </section>

            <!-- 7. Social footer — only -->
            <footer class="px-space-6 py-space-5 flex items-center justify-center gap-space-4">
              @for (icon of socialIcons; track icon.label) {
                <a
                  href="#"
                  [attr.aria-label]="icon.label"
                  class="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-canvas-fg text-body-sm font-medium inline-flex items-center justify-center transition-colors"
                  >{{ icon.glyph }}</a
                >
              }
            </footer>
          </div>

          <p
            class="text-caption text-neutral-500 mt-space-8 text-center max-w-[640px] mx-auto leading-relaxed"
          >
            Cierre del mock. Para revisar la lógica detrás de cada bloque, vuelve a la
            <a
              routerLink="/novedades/newsletter-decisiones"
              class="text-action-700 hover:underline"
              >página de decisiones</a
            >.
          </p>
        </div>
      </main>
    </div>
  `,
})
export class NewsletterDemoPage {
  readonly topics: TopicBlock[] = [
    {
      id: 'banca',
      name: 'Banca',
      featureDate: '04-may-2026 · Marta Rodríguez',
      featureTags: ['Banca', 'BCE', 'Tipos'],
      featureTitle:
        'BCE: qué dejó el último informe sobre tipos y qué cambia en tu estrategia',
      featureBlocks: [
        {
          kind: 'para',
          text: 'El consejo del BCE puede haberse despedido del consenso esta semana. Cuatro meses después de mantener la pausa, la guía sobre el camino de tipos ha cambiado de tono — y los gestores europeos están tomando nota.',
        },
        {
          kind: 'bullets',
          items: [
            'La tasa de depósito sigue en el 3,25%, sin cambios — pero la guía ha pasado de "data-dependent" a "meeting-by-meeting", un matiz que los futuros del Euribor leyeron como halcón.',
            'Según Reuters, tres miembros del consejo votaron a favor de subir 25 pb. No había ocurrido en cinco reuniones.',
            'El swap a 12 meses se ha movido 14 pb al alza en las dos sesiones posteriores al comunicado.',
            'Lagarde mencionó "inflación de servicios persistente" tres veces en la rueda de prensa. En diciembre, una sola vez.',
          ],
        },
        {
          kind: 'para',
          text: 'Lo que cambia operativamente para una cartera tipo: el carry sigue intacto en el tramo corto, pero la prima de duración se ha encarecido. Los modelos de cobertura calibrados con la curva de marzo están infraestimando el riesgo de cola en la parte larga.',
        },
        {
          kind: 'quote',
          text: 'Lo que importa de la rueda de prensa de Lagarde no es lo que dijo, es lo que dejó de decir.',
          attribution: 'Estratega senior de tipos en BNP Paribas, citado por Bloomberg',
        },
        {
          kind: 'para',
          text: 'Tanto Bloomberg como JPMorgan han revisado sus previsiones para la próxima reunión en la misma dirección: lo que en abril era escenario base de bajada en septiembre, hoy cotiza por debajo del 40% de probabilidad. En el análisis completo, los tres movimientos concretos del comité, los dos riesgos que parece desestimar y cómo cada uno aterriza en un perfil real.',
        },
      ],
      secondaries: [
        {
          title: 'Crédito al consumo: la curva que el sector no está mirando',
          snippet:
            'Datos de abril por segmento — algo se mueve en tarjetas revolving que no encaja con el resto del cuadro.',
        },
        {
          title: 'Solvencia bancaria España vs Italia: comparativa rápida',
          snippet:
            'Tres ratios clave que explican por qué la prima de riesgo bancaria se ha movido distinto en cada país.',
        },
      ],
    },
    {
      id: 'mercados',
      name: 'Mercados',
      featureDate: '02-may-2026 · Carlos Vázquez',
      featureTags: ['Mercados', 'Volatilidad', 'Cobertura'],
      featureTitle: 'Volatilidad de mayo: por qué no se parece a la de marzo',
      featureBlocks: [
        {
          kind: 'para',
          text: 'Mira el VIX y dirás que mayo está siendo un mes tranquilo. Mira los retornos de las diez mayores capitalizaciones de Europa y dirás que mayo está siendo un mes brutal. Las dos lecturas son ciertas — y esa es exactamente la diferencia con marzo.',
        },
        {
          kind: 'bullets',
          items: [
            'VIX mensual cerró en 18,2 en mayo. En marzo cerró en 27,8 — un 53% más alto.',
            'Pero la dispersión cross-sectional de retornos en el Stoxx 600 es la más alta desde febrero de 2022.',
            'Tres nombres (uno de tecnología, dos de utilities) explican el 64% del movimiento neto del índice este mes.',
            'El short interest medio en las 5 mayores capitalizaciones se ha duplicado desde abril.',
          ],
        },
        {
          kind: 'para',
          text: 'Marzo fue una venta amplia con dispersión sectorial baja — todo bajó a la vez. Mayo está siendo una rotación concentrada en pocos nombres, con el resto del mercado virtualmente plano. Para cobertura, la diferencia es enorme: un short del índice no funciona igual cuando el movimiento viene de la concentración, no de la amplitud.',
        },
        {
          kind: 'quote',
          text: 'El índice está mintiendo. La volatilidad real vive en cinco tickers.',
          attribution: 'Gestora de un fondo macro discrecional con base en Londres',
        },
        {
          kind: 'para',
          text: 'Goldman Sachs, en su nota del lunes, recomienda pasar de hedges sobre índice a basket shorts ponderados por contribución a la varianza. JPMorgan llega al mismo sitio desde otro ángulo: doble cobertura — index puts más single-name overwriting en las top 10. En el análisis completo, la descomposición de la varianza por contribución y los gráficos de dispersión que Goldman publica esta semana.',
        },
      ],
      secondaries: [
        {
          title: 'Renta fija: dónde está el carry esta semana',
          snippet:
            'Vencimientos y spreads que merecen una segunda mirada tras las subastas del miércoles.',
        },
        {
          title: 'Emergentes: tres flujos opuestos en LatAm',
          snippet:
            'Brasil entra, México estable, Chile sale. Los gestores institucionales rotan, pero no como esperaba el consenso.',
        },
      ],
    },
    {
      id: 'macro',
      name: 'Macro',
      featureDate: '30-abr-2026 · Elena Martín',
      featureTags: ['Macro', 'Empleo', 'Fed'],
      featureTitle: 'El dato de empleo que el consenso aún no ha digerido',
      featureBlocks: [
        {
          kind: 'para',
          text: 'El dato de empleo del viernes pasado parecía marginalmente bueno. Titulares tranquilizadores, mercados de bonos sin reacción especial. Pero al levantar la tapa, la cifra cuenta una historia distinta — y los bancos centrales lo saben.',
        },
        {
          kind: 'bullets',
          items: [
            'Creación de empleo: 198.000 nóminas, frente a 195.000 esperadas. Aparentemente, en línea.',
            'Pero las horas trabajadas medias por semana cayeron a 34,3, su nivel más bajo desde la pandemia.',
            'El sector servicios añadió 165.000 puestos — el 71% son tiempo parcial. Un máximo de los últimos 18 meses.',
            'La tasa de subempleo (U-6) subió a 7,9% desde el 7,5% del mes anterior — el mayor salto secuencial desde 2019.',
          ],
        },
        {
          kind: 'para',
          text: 'Componer el dato es lo que cambia la conclusión. Más nóminas con menos horas por nómina significa menos masa salarial total y mayor fragilidad del empleo a tiempo completo. Para una Fed que mira el mercado laboral como input principal del calendario de bajadas, este es exactamente el tipo de señal que mueve el calendario hacia delante, no hacia atrás.',
        },
        {
          kind: 'quote',
          text: 'Estamos pasando del modo "fortaleza laboral" al modo "erosión silenciosa". El consenso aún no lo ha procesado.',
          attribution: 'Diane Swonk, economista jefa de KPMG, en CNBC',
        },
        {
          kind: 'para',
          text: 'Lo que implica para los próximos seis meses: el escenario base de Goldman Sachs y Citi todavía contempla una bajada de 25 pb en septiembre, pero el dot plot interno de la Fed se está moviendo. El dot mediano de junio podría reflejar dos bajadas en lugar de una si el dato de mayo confirma la tendencia. En el análisis completo, la descomposición sectorial, los precedentes históricos de divergencia headline vs componentes, y qué activos suelen reaccionar primero.',
        },
      ],
      secondaries: [
        {
          title: 'IPC subyacente: el componente que sigue sin moverse',
          snippet:
            'Servicios sigue siendo el reto. Por qué la moderación que esperan los bancos centrales tarda más de lo que dicen.',
        },
        {
          title: 'Cuenta corriente y energía: una correlación que vuelve',
          snippet:
            'Tras un año desacoplado, el saldo exterior vuelve a moverse con el precio del gas. Lo que cambia para España.',
        },
      ],
    },
  ];

  readonly socialIcons: SocialIcon[] = [
    { label: 'LinkedIn', glyph: 'in' },
    { label: 'X', glyph: '𝕏' },
    { label: 'Instagram', glyph: 'IG' },
    { label: 'YouTube', glyph: 'YT' },
  ];
}
