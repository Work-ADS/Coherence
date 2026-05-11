import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent, PageHeaderComponent } from '@coherence/ui';

import { SectionHeaderComponent } from '../shared/section-header.component';
import { OnThisPageComponent, type TocItem } from '../shared/on-this-page.component';

type DecisionStatus = 'acepto' | 'modificado' | 'rechazo' | 'pendiente';

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

type Decision = {
  id: string;
  topic: string;
  quote: string;
  tags: CommentTag[];
  status: DecisionStatus;
  responseLead: string;
  responseExtras?: string[];
  caveat?: string;
};

@Component({
  selector: 'site-newsletter-decisiones-page',
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
        <span class="text-canvas-fg font-medium">Newsletter — Decisiones</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1200px] mx-auto py-space-10 flex gap-space-10">
          <div class="min-w-0 flex-1">
            <afi-page-header
              title="Newsletter AFI — Decisiones sobre el feedback"
              subtitle="Respuestas del owner a cada uno de los nueve comentarios del equipo. Cada punto lleva estado (Acepto / Modificado / Rechazo / Pendiente) y la razón en inglés. El listado verbatim de los comentarios y la auditoría viven en /novedades/newsletter-feedback."
              [sticky]="false"
              [scrollFade]="false"
            >
              <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
                >NEWSLETTER · DECISIONES</span
              >
            </afi-page-header>

            <!-- ========== Status summary ========== -->
            <div class="mt-space-8 px-space-8">
              <div
                class="flex flex-wrap items-center gap-space-3 px-space-5 py-space-4 rounded-md border border-border-hairline bg-surface-quiet"
              >
                <span class="text-caption uppercase tracking-wider text-neutral-500"
                  >Resumen</span
                >
                <afi-badge size="sm" intent="success"
                  >Acepto · {{ statusCounts.acepto }}</afi-badge
                >
                <afi-badge size="sm" intent="warning"
                  >Modificado · {{ statusCounts.modificado }}</afi-badge
                >
                <afi-badge size="sm" intent="error"
                  >Rechazo · {{ statusCounts.rechazo }}</afi-badge
                >
                <afi-badge size="sm" intent="neutral"
                  >Pendiente · {{ statusCounts.pendiente }}</afi-badge
                >
                <p class="text-body-sm text-neutral-600 ml-auto leading-relaxed min-w-0">
                  Dos Modificado replantean la solución hacia el mismo problema; cero Rechazos.
                </p>
              </div>
            </div>

            <!-- ========== Scope note ========== -->
            <div class="mt-space-4 px-space-8">
              <p class="text-body-sm text-neutral-600 leading-relaxed italic">
                Nota: esta página y la demo enlazada son sobre
                <span class="text-canvas-fg font-medium not-italic">estructura</span>, no
                estilo. No se proponen cambios visuales ni de marca — solo cómo se ordena el
                contenido del newsletter.
              </p>
            </div>

            <!-- ========== Demo CTA ========== -->
            <div class="mt-space-4 px-space-8">
              <a
                routerLink="/novedades/newsletter-demo"
                class="group flex items-center justify-between gap-space-4 px-space-5 py-space-4 rounded-md border border-action/40 bg-action/5 hover:bg-action/10 transition-colors"
              >
                <div class="min-w-0">
                  <p class="text-caption uppercase tracking-wider text-action-700 mb-space-1">
                    Demo estructural
                  </p>
                  <p class="text-body-md font-medium text-canvas-fg">
                    Ver maqueta del newsletter con las decisiones aplicadas
                  </p>
                  <p class="text-body-sm text-neutral-600 mt-space-1">
                    Mid-fidelity, solo estructura: intro editorial, preferencias arriba,
                    feature + secundarias por tema, banner de eventos, legal y pie con redes.
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

            <!-- ========== Decisions list ========== -->
            <div class="mt-space-10 px-space-8 flex flex-col gap-space-4 pb-space-10">
              @for (d of decisions; track d.id; let i = $index) {
                <article
                  [id]="d.id"
                  class="p-space-5 rounded-md border border-border-hairline bg-surface-quiet"
                >
                  <div class="flex items-start gap-space-3 mb-space-3">
                    <afi-badge size="sm" intent="neutral" class="shrink-0 mt-space-1">
                      {{ i + 1 }}
                    </afi-badge>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-space-2 mb-space-2 flex-wrap">
                        <p class="text-caption uppercase tracking-wider text-neutral-500">
                          {{ d.topic }}
                        </p>
                        <span aria-hidden="true" class="text-neutral-400">·</span>
                        <afi-badge size="sm" [intent]="statusIntent(d.status)">
                          {{ statusLabel(d.status) }}
                        </afi-badge>
                        @if (d.caveat) {
                          <afi-badge size="sm" intent="warning">Con reserva</afi-badge>
                        }
                      </div>
                      <blockquote
                        class="border-l-2 border-border-hairline pl-space-3 mb-space-3 text-body-md text-canvas-fg italic leading-relaxed"
                      >
                        {{ d.quote }}
                      </blockquote>
                      @if (d.status === 'pendiente') {
                        <p class="text-body-sm text-neutral-500 italic leading-relaxed">
                          Respuesta pendiente del owner.
                        </p>
                      } @else {
                        <p
                          class="text-body-md text-canvas-fg leading-relaxed mb-space-2"
                        >
                          {{ d.responseLead }}
                        </p>
                        @for (extra of d.responseExtras ?? []; track extra) {
                          <p
                            class="text-body-sm text-neutral-600 leading-relaxed mt-space-2"
                          >
                            {{ extra }}
                          </p>
                        }
                        @if (d.caveat) {
                          <div
                            class="mt-space-3 p-space-4 rounded-md bg-system-warning-bg border border-border-hairline"
                          >
                            <div class="flex items-start gap-space-3">
                              <afi-badge size="sm" intent="warning" class="shrink-0 mt-space-1">
                                Trade-off
                              </afi-badge>
                              <p
                                class="text-body-sm text-canvas-fg leading-relaxed flex-1 min-w-0"
                              >
                                {{ d.caveat }}
                              </p>
                            </div>
                          </div>
                        }
                      }
                      <div class="flex flex-wrap gap-space-2 mt-space-3">
                        @for (t of d.tags; track t) {
                          <afi-badge size="sm" intent="info">{{ t }}</afi-badge>
                        }
                      </div>
                    </div>
                  </div>
                </article>
              }

              <p
                class="text-caption text-neutral-500 pt-space-4 border-t border-border-hairline"
              >
                Las preguntas que afectan a la copy concreta del intro y del banner se delegan al
                brand-voice owner. Estado revisable después de medir tasas de actualización de
                preferencias y unsubscribes post-lanzamiento.
              </p>
            </div>
          </div>

          <site-on-this-page [sections]="tocSections" />
        </div>
      </main>
    </div>
  `,
})
export class NewsletterDecisionesPage {
  readonly tocSections: TocItem[] = [
    { id: 'd-1', label: 'Asunto' },
    { id: 'd-2', label: 'Cabecera' },
    { id: 'd-3', label: 'Metadatos' },
    { id: 'd-4', label: 'Layout' },
    { id: 'd-5', label: 'Editorial' },
    { id: 'd-6', label: 'Preferencias' },
    { id: 'd-7', label: 'Banner / tono' },
    { id: 'd-8', label: 'Legal' },
    { id: 'd-9', label: 'Pie' },
  ];

  readonly decisions: Decision[] = [
    {
      id: 'd-1',
      topic: 'Asunto',
      tags: ['Asunto', 'Editorial'],
      status: 'modificado',
      quote:
        'El asunto no debe estar en el copy del email (keyword, keyword...) porque se generará automáticamente y quizá no sea suficientemente bueno. Recordad que el equipo debe tener la opción de cambiarlo manualmente si no genera algo en condiciones.',
      responseLead:
        'Quitar la línea "keyword, keyword..." del top y reemplazarla con un intro editorial. Estructura en tres partes: (1) una línea genérica de bienvenida sobre el panorama de finanzas y mercados — la misma para todos los lectores; (2) el rótulo "Hoy en la newsletter:"; (3) debajo, frases cortas sobre los temas específicos de esta edición. El intro se convierte en el momento de cercanía y personalización — mucho más Afi que una lista de chips de temas.',
      responseExtras: [
        'El razonamiento: el diseño actual se siente fácilmente automatizable — el backend rellena los nombres de los temas y se lee como una personalización barata generada por AI. Un intro editorial real demuestra que vamos un paso más allá: contenido genuinamente personalizado, no solo etiquetas intercambiables. La diferencia entre "parece personalizado" y "es personalizado".',
        'En fases (v1 → v2) según el bandwidth del equipo. v1: empezar por el camino fácil — sustituir "keyword, keyword..." por una lista corta de temas como la que tenemos hoy (sin esfuerzo editorial extra, lanzable ya). v2: cuando el equipo pueda redactar las frases por tema, subimos al intro personalizado. Es un escalón, no un todo-o-nada.',
      ],
      caveat:
        'Sobre la posición de "Actualizar tus preferencias" arriba: el trade-off completo (cambio de preferencias vs riesgo de unsubscribe) se explica en la decisión 6.',
    },
    {
      id: 'd-2',
      topic: 'Cabecera',
      tags: ['Cabecera'],
      status: 'acepto',
      quote:
        'La fecha en la cabecera no aporta nada. De hecho, confunde, pues cada publicación será de una fecha.',
      responseLead:
        'Aceptado tal cual — la fecha del header se quita. Cada publicación lleva su propia fecha, así que la del header es ruido redundante.',
    },
    {
      id: 'd-3',
      topic: 'Metadatos',
      tags: ['Metadatos'],
      status: 'acepto',
      quote:
        'No veo la etiqueta de "medio", que estará en algunos casos.',
      responseLead:
        'Aceptado tal cual — añadir un slot de tag "medio / fuente" en la tarjeta de publicación. Se usa de forma condicional (solo cuando aplica — por ejemplo, contenido sindicado o de terceros).',
    },
    {
      id: 'd-4',
      topic: 'Layout',
      tags: ['Layout'],
      status: 'modificado',
      quote:
        'Para los que reciban la newsletter mensual o estén suscritos a muchos temas el scroll será infinito. Los bloques deberían aparecer, al menos, en dos columnas. ¿No?',
      responseLead:
        'Mantener stacked en una sola columna, no dos. Sobre esa base, rediseñar cada tarjeta para que tenga peso editorial real (imagen, intro o descripción que aporta contexto, enlace al artículo) y añadir una jerarquía interna por tema. El objetivo: que el lector se informe de verdad solo con leer el email — si quiere profundizar, va a los artículos, pero no debería sentirse obligado. El imprescindible del día va destacado al top, independiente del tema (cruza con la decisión 5).',
      responseExtras: [
        'Por qué no columnas: la carga cognitiva escala mal — más temas = lista larga de parejas, igual de pesada. En móvil colapsa a stacked de todas formas, así que las dos columnas solo pagan en desktop, y ahí el problema es la densidad, no la longitud del scroll. Además, las columnas hacen imposible dar una descripción sustancial dentro del email para que el lector se informe sin hacer click.',
        'Restricción a tener presente en toda esta decisión: el email no es una página web. No podemos usar tabs, acordeones ni componentes interactivos para reducir densidad — lo que se ve se ve, no hay "mostrar más". Esto afecta especialmente a usuarios con muchos temas: no podemos esconder contenido detrás de un click, así que la densidad hay que resolverla con jerarquía editorial, no con interactividad.',
        'Jerarquía propuesta por tema: 1 historia feature (intro o descripción que contextualiza + imagen si aplica + enlace al artículo) + 2-3 secundarias con titular + una frase de descripción + enlace. La feature lleva el peso editorial; las secundarias dan contexto en una línea para que el lector decida si profundizar, sin convertirse en una lista de links sueltos. Es la diferencia entre "te informo y te llevo a profundizar si quieres" y "aquí tienes 10 enlaces, suerte".',
        'Hilo abierto, no bloquea esta decisión: otras publicaciones grandes operan varias newsletters separadas a las que el suscriptor opta una a una. Conversación futura — ¿dividir Afi por tema mayor en vez de empaquetar todo en una mensual? Es un tema de roadmap, no de ahora: post-lanzamiento, medimos la media de temas a los que se suscribe la gente. Si la media es alta, dividir tiene sentido y podemos preguntar directamente a los lectores qué quieren recibir y con qué frecuencia. Si la media es baja, el envío único mensual ya sirve. La decisión espera datos.',
      ],
      caveat:
        '¿Cuántas piezas por tema y cuántos temas máximo mostramos? Si un suscriptor tiene 1 tema le damos varias features; si tiene 10, ¿una feature por cada uno o aplicamos un techo global? Hay que definir un máximo y una degradación elegante (por ejemplo: hasta N temas con feature completa, el resto se colapsa a una lista compacta sin imagen). Decisión de producto + editorial.',
    },
    {
      id: 'd-5',
      topic: 'Editorial',
      tags: ['Editorial'],
      status: 'acepto',
      quote: '¿Con qué lógica se organizan las publicaciones?',
      responseLead:
        'Publicar la regla. Orden = Destacado primero, luego todo lo demás por fecha descendente (lo más reciente arriba). El editor elige un Destacado por edición; el resto es determinístico. Documentarlo en el brief editorial para que la pregunta no vuelva a aparecer en cada edición.',
    },
    {
      id: 'd-6',
      topic: 'Preferencias',
      tags: ['Preferencias'],
      status: 'acepto',
      quote:
        '"Actualiza tus preferencias" debe ser un botón que veas justo al inicio de la newsletter. Como el ejemplo que os mandé de KPMG.',
      responseLead:
        'Colocar "Actualiza tus preferencias" al inicio de la newsletter, al estilo KPMG. Esto cierra el hilo abierto del item 1: la apuesta es que más cambios de preferencias (engagement, personalización, efecto IKEA) compensa el riesgo marginal de unsubscribe que añade la posición alta.',
      responseExtras: [
        'Medir post-lanzamiento — si los unsubscribes se disparan, revisar la posición.',
      ],
      caveat:
        'En la mayoría de las newsletters, "Actualizar tus preferencias" lleva a una página donde el lector también puede darse de baja. Subir el botón al inicio acerca ambas acciones — actualizar Y unsubscribir, y ahí está la preocupación. Si los lectores van a cambiar sus preferencias con frecuencia, vale la pena el riesgo; si no, no. Es una apuesta sobre qué harán con más frecuencia.',
    },
    {
      id: 'd-7',
      topic: 'Banner / tono',
      tags: ['Banner', 'Tono'],
      status: 'acepto',
      quote:
        'El banner de abajo debe ser a la página de "Eventos", no "Sácale partido...". Cuidad por fa el tono de voz. No es nada Afi ;)',
      responseLead:
        'Aceptado en ambos puntos. El banner inferior apunta a la página de Eventos. El copy se reescribe en voz Afi — el owner de brand-voice prepara el borrador. La línea actual "Sácale partido..." está fuera de marca y se quita.',
    },
    {
      id: 'd-8',
      topic: 'Legal',
      tags: ['Legal'],
      status: 'acepto',
      quote:
        'Justo después del banner de eventos deben aparecer las opciones de baja, política, etc.',
      responseLead:
        'Aceptado tal cual — unsubscribe / política / gestión de preferencias se colocan justo debajo del banner de eventos, antes del footer con iconos de redes.',
      responseExtras: [
        'Orden de arriba a abajo en el bloque de cierre: banner de eventos → fila legal/unsubscribe → iconos de redes.',
      ],
    },
    {
      id: 'd-9',
      topic: 'Pie',
      tags: ['Pie'],
      status: 'acepto',
      quote:
        'Creo que el footer con enlaces a las secciones de la web, etc. es excesivo. Tenemos suficientes CTAs. Como mucho los iconos a redes, que si no me equivoco, ya son parte de nuestras plantillas.',
      responseLead:
        'Aceptado tal cual — el footer se reduce a solo los iconos de redes (LinkedIn, X, Instagram, YouTube). Se quitan por completo los bloques de enlaces a secciones de la web. El banner de eventos de arriba ya carga con los CTAs deliberados.',
    },
  ];

  get statusCounts(): Record<DecisionStatus, number> {
    return this.decisions.reduce(
      (acc, d) => {
        acc[d.status] += 1;
        return acc;
      },
      { acepto: 0, modificado: 0, rechazo: 0, pendiente: 0 } as Record<DecisionStatus, number>,
    );
  }

  statusIntent(s: DecisionStatus): 'success' | 'warning' | 'error' | 'neutral' {
    switch (s) {
      case 'acepto':
        return 'success';
      case 'modificado':
        return 'warning';
      case 'rechazo':
        return 'error';
      case 'pendiente':
        return 'neutral';
    }
  }

  statusLabel(s: DecisionStatus): string {
    switch (s) {
      case 'acepto':
        return 'Acepto';
      case 'modificado':
        return 'Modificado';
      case 'rechazo':
        return 'Rechazo';
      case 'pendiente':
        return 'Pendiente';
    }
  }
}
