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
import { BadgeComponent } from '@coherence/ui';
import { InsightsHeaderComponent } from '../shared/insights-header.component';
import { InsightsFooterComponent } from '../shared/insights-footer.component';

type TocEntry = { id: string; label: string; level: 0 | 1 };

@Component({
  selector: 'ai-insights-caso-de-estudio',
  standalone: true,
  imports: [BadgeComponent, InsightsHeaderComponent, InsightsFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas">
      <ai-insights-header />

      <main class="flex-1">
        <div class="max-w-[1200px] mx-auto px-space-6 py-space-16">
          <div class="flex gap-space-12">
            <!-- =========== Main column =========== -->
            <article class="flex-1 max-w-[760px]">
              <p class="text-caption uppercase tracking-wider text-action-700 mb-space-3">
                Caso de estudio
              </p>
              <h1
                class="font-serif text-canvas-fg tracking-tight mb-space-4 leading-[1.1] text-[32px] md:text-[40px]"
              >
                AFI Insights: decisiones de diseno
              </h1>
              <p class="text-body-lg text-neutral-500 mb-space-12">
                Cuatro pantallas, un objetivo: convertir lectores en suscriptores. Las
                decisiones de cada pantalla, ordenadas por flujo.
              </p>

              <!-- =========== El reto =========== -->
              <section id="reto" class="mb-space-16">
                <h2 class="text-subtitle font-serif text-canvas-fg mb-space-4">El reto</h2>
                <p class="text-body-md text-neutral-600 leading-relaxed mb-space-3">
                  AFI Insights es el hub de contenido. El objetivo unico:
                  <strong class="text-canvas-fg"
                    >convertir visitantes en suscriptores de la newsletter</strong
                  >.
                </p>
                <p class="text-body-md text-neutral-600 leading-relaxed">
                  El formulario pide email, nombre, apellido, empresa, temas y
                  frecuencia. Mucho para pedir de golpe. Repasamos pantalla por pantalla.
                </p>
              </section>

              <!-- =========== Pantalla 01 · Home =========== -->
              <section id="home" class="mb-space-20">
                <div
                  class="flex items-center gap-space-4 mb-space-6 pb-space-3 border-b border-border-hairline"
                >
                  <span
                    class="shrink-0 w-12 h-12 rounded-md bg-action text-white font-serif text-[24px] flex items-center justify-center"
                  >
                    01
                  </span>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-caption uppercase tracking-wider text-neutral-500 mb-1"
                    >
                      Pantalla · /afi-insights/home
                    </p>
                    <h2 class="text-title font-serif text-canvas-fg leading-tight">
                      Home
                    </h2>
                  </div>
                  <a
                    href="/afi-insights/home"
                    target="_blank"
                    rel="noopener"
                    class="shrink-0 inline-flex items-center gap-1 px-space-3 h-8 rounded-md border border-border-hairline text-body-sm text-canvas-fg hover:bg-surface-quiet transition-colors"
                    aria-label="Abrir Home en una nueva pestana"
                  >
                    Abrir
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>

                <!-- Mini-mockup: Home -->
                <a
                  href="/afi-insights/home"
                  target="_blank"
                  rel="noopener"
                  class="block mb-space-8 rounded-md border border-border-hairline bg-surface-quiet hover:bg-surface-muted transition-colors p-space-6 group"
                  aria-label="Abrir pantalla Home en una nueva pestana"
                >
                  <div class="bg-white rounded-sm border border-border-hairline p-space-4 flex flex-col gap-space-3">
                    <div class="flex items-center justify-between">
                      <p class="text-body-sm font-serif text-canvas-fg">AFI Insights</p>
                      <div class="flex gap-space-2">
                        <span class="w-12 h-1.5 rounded-sm bg-neutral-200"></span>
                        <span class="w-10 h-1.5 rounded-sm bg-neutral-200"></span>
                      </div>
                    </div>
                    <div class="border-t border-border-hairline -mx-space-4"></div>
                    <p class="text-title font-serif text-canvas-fg leading-tight max-w-[60%]">
                      AFI Insights
                    </p>
                    <p class="text-caption text-neutral-500 max-w-[70%]">
                      No te pierdas el analisis que mueve el sector.
                    </p>
                    <div class="flex gap-space-2 items-center">
                      <div class="flex-1 h-7 rounded-sm bg-neutral-100 border border-neutral-200 px-space-2 flex items-center text-[10px] text-neutral-400">
                        tu email corporativo
                      </div>
                      <div class="h-7 px-space-3 rounded-sm bg-action text-[10px] text-white flex items-center font-medium">
                        Suscribir
                      </div>
                    </div>
                    <div class="grid grid-cols-3 gap-space-2 mt-space-2">
                      @for (_ of [0, 1, 2]; track $index) {
                        <div class="aspect-[4/3] rounded-sm bg-surface-quiet"></div>
                      }
                    </div>
                  </div>
                  <p
                    class="text-caption text-neutral-500 mt-space-3 group-hover:text-canvas-fg transition-colors flex items-center gap-1"
                  >
                    Ver pantalla en vivo
                    <span aria-hidden="true">→</span>
                  </p>
                </a>

                <div id="home-suscripcion" class="mb-space-10">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Serial Position</afi-badge>
                    <afi-badge intent="neutral" size="sm">Loss Aversion</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    Suscripcion above the fold
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    El objetivo principal de la pagina es captar suscriptores. Si el CTA
                    esta abajo, la mayoria no lo ve. Subimos un campo de email con copy
                    de loss aversion ("No te pierdas el analisis que mueve el sector")
                    justo bajo el titulo. Sin scroll para convertir.
                  </p>
                </div>

                <div id="home-hero" class="mb-space-10">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Cognitive Load</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    Hero claro: o sin foto, o con contexto encima
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed mb-space-3">
                    El hero original es una foto grande de gente mirando. No dice de que
                    va el contenido — el lector ve "AFI Insights" y no sabe si es
                    research, articulos, podcasts o que.
                  </p>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    Dos opciones validas: (1) eliminar la foto y dejar tipografia + CTA,
                    como Designit; (2) mantener la foto pero anadir copy encima que
                    diga que se publica ahi. La foto sola es decoracion sin informacion.
                  </p>
                </div>

                <!-- The subscription flow lives on the home — these are the same
                     decisions that originally sat on a separate /suscripcion page. -->
                <div id="home-business-email" class="mb-space-10">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Lead quality</afi-badge>
                    <afi-badge intent="neutral" size="sm">Validation</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    Solo emails corporativos
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed mb-space-3">
                    AFI Insights va dirigido a profesionales del sector. Aceptar
                    suscripciones desde gmail/hotmail/yahoo ensucia la base de datos y
                    rompe la utilidad de la segmentacion por empresa.
                  </p>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    Si el dominio del email es de un proveedor gratuito, mostramos
                    <span class="text-canvas-fg italic"
                      >"Solo aceptamos emails corporativos. Usa el de tu empresa."</span
                    > El input usa el placeholder
                    <span class="text-canvas-fg italic">"nombre@empresa.es"</span> para
                    insinuar el formato esperado antes de que el usuario teclee. Asi
                    cada suscriptor llega ya con el dominio de empresa, que ademas nos
                    ahorra pedirle "empresa" como campo separado.
                  </p>
                </div>

                <div id="home-email-primero" class="mb-space-10">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Progressive Disclosure</afi-badge>
                    <afi-badge intent="neutral" size="sm">Commitment</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    Email primero, todo lo demas despues
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    El formulario completo necesita email + nombre + apellido + empresa
                    + temas + frecuencia. Pedirlo todo de golpe rompe la conversion. La
                    home solo pide el email; tras suscribirse aparece un CTA secundario
                    "Personaliza preferencias" que abre el resto. El usuario ya esta
                    dentro — completar el perfil pesa mucho menos.
                  </p>
                </div>

                <div id="home-defaults">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Default Effect</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    Defaults inteligentes en preferencias
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    En el panel de preferencias, "Estudios" y "Articulos" llevan badge
                    <span class="text-canvas-fg italic">"Popular"</span> y vienen
                    pre-seleccionados; la frecuencia por defecto es semanal. Los usuarios
                    casi nunca cambian los defaults — los nuestros maximizan engagement
                    desde el primer envio.
                  </p>
                </div>
              </section>

              <!-- =========== Pantalla 02 · Articulos =========== -->
              <section id="articulos" class="mb-space-20">
                <div
                  class="flex items-center gap-space-4 mb-space-6 pb-space-3 border-b border-border-hairline"
                >
                  <span
                    class="shrink-0 w-12 h-12 rounded-md bg-action text-white font-serif text-[24px] flex items-center justify-center"
                  >
                    02
                  </span>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-caption uppercase tracking-wider text-neutral-500 mb-1"
                    >
                      Pantalla · /afi-insights/articulos
                    </p>
                    <h2 class="text-title font-serif text-canvas-fg leading-tight">
                      Articulos
                    </h2>
                  </div>
                  <a
                    href="/afi-insights/articulos"
                    target="_blank"
                    rel="noopener"
                    class="shrink-0 inline-flex items-center gap-1 px-space-3 h-8 rounded-md border border-border-hairline text-body-sm text-canvas-fg hover:bg-surface-quiet transition-colors"
                    aria-label="Abrir Articulos en una nueva pestana"
                  >
                    Abrir
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>

                <!-- Mini-mockup: Articulos -->
                <a
                  href="/afi-insights/articulos"
                  target="_blank"
                  rel="noopener"
                  class="block mb-space-8 rounded-md border border-border-hairline bg-surface-quiet hover:bg-surface-muted transition-colors p-space-6 group"
                  aria-label="Abrir pantalla Articulos en una nueva pestana"
                >
                  <div class="bg-white rounded-sm border border-border-hairline p-space-4 flex flex-col gap-space-3">
                    <p class="text-caption text-neutral-500">
                      Perspectivas y analisis del sector financiero
                    </p>
                    <div
                      class="flex gap-space-3 text-[10px] border-b border-border-hairline pb-space-2"
                    >
                      <span class="text-action-700 font-medium border-b-2 border-action-700 pb-[3px]">
                        Estudios
                      </span>
                      <span class="text-neutral-400">Informes</span>
                      <span class="text-neutral-400">Articulos</span>
                      <span class="text-neutral-400">Eventos</span>
                      <span class="text-neutral-400">Media</span>
                    </div>
                    <div class="grid grid-cols-3 gap-space-2">
                      @for (_ of [0, 1, 2, 3, 4, 5]; track $index) {
                        <div class="rounded-sm bg-surface-quiet aspect-[4/3] p-1.5 flex flex-col gap-1">
                          <span class="h-1 w-3/4 rounded-sm bg-neutral-200"></span>
                          <span class="h-1 w-full rounded-sm bg-neutral-100"></span>
                          <span class="h-1 w-5/6 rounded-sm bg-neutral-100"></span>
                        </div>
                      }
                    </div>
                    <div class="flex justify-center mt-space-1">
                      <span
                        class="px-space-3 py-1 rounded-sm border border-border-hairline text-[10px] text-canvas-fg"
                      >
                        Ver mas ↓
                      </span>
                    </div>
                  </div>
                  <p
                    class="text-caption text-neutral-500 mt-space-3 group-hover:text-canvas-fg transition-colors flex items-center gap-1"
                  >
                    Ver pantalla en vivo
                    <span aria-hidden="true">→</span>
                  </p>
                </a>

                <div id="articulos-listado">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Hick's Law</afi-badge>
                    <afi-badge intent="neutral" size="sm">In-place expand</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    Propuesta de valor + tabs + "Ver mas" en la misma pagina
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed mb-space-3">
                    El listado original es un scroll largo de tarjetas, sin estructura.
                    Lo simplificamos a tres elementos:
                  </p>
                  <ul
                    class="flex flex-col gap-space-2 mb-space-3 text-body-md text-neutral-600 leading-relaxed pl-space-4"
                  >
                    <li>
                      <strong class="text-canvas-fg">Propuesta de valor</strong> arriba —
                      una linea que dice de que va Insights y para quien es.
                    </li>
                    <li>
                      <strong class="text-canvas-fg">Tabs por categoria</strong> (Estudios,
                      Informes, Articulos, Eventos, Media) — el lector elige que mirar
                      sin desplazarse.
                    </li>
                    <li>
                      <strong class="text-canvas-fg">"Ver mas" que expande inline</strong> —
                      al pulsarlo, la lista crece en su sitio. No hay navegacion a otra
                      pagina, no hay paginado, no hay scroll infinito sorpresa.
                    </li>
                  </ul>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    El usuario nunca pierde el contexto. Si esta filtrado por "Estudios"
                    y pulsa "Ver mas", sigue en "Estudios". Vuelta atras desde un
                    articulo le devuelve al mismo punto, no al inicio.
                  </p>
                </div>
              </section>

              <!-- =========== Pantalla 03 · Articulo =========== -->
              <section id="articulo" class="mb-space-20">
                <div
                  class="flex items-center gap-space-4 mb-space-6 pb-space-3 border-b border-border-hairline"
                >
                  <span
                    class="shrink-0 w-12 h-12 rounded-md bg-action text-white font-serif text-[24px] flex items-center justify-center"
                  >
                    03
                  </span>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-caption uppercase tracking-wider text-neutral-500 mb-1"
                    >
                      Pantalla · /afi-insights/articulo
                    </p>
                    <h2 class="text-title font-serif text-canvas-fg leading-tight">
                      Articulo (detalle)
                    </h2>
                  </div>
                  <a
                    href="/afi-insights/articulo"
                    target="_blank"
                    rel="noopener"
                    class="shrink-0 inline-flex items-center gap-1 px-space-3 h-8 rounded-md border border-border-hairline text-body-sm text-canvas-fg hover:bg-surface-quiet transition-colors"
                    aria-label="Abrir Articulo en una nueva pestana"
                  >
                    Abrir
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>

                <!-- Mini-mockup: Articulo -->
                <a
                  href="/afi-insights/articulo"
                  target="_blank"
                  rel="noopener"
                  class="block mb-space-8 rounded-md border border-border-hairline bg-surface-quiet hover:bg-surface-muted transition-colors p-space-6 group"
                  aria-label="Abrir pantalla Articulo en una nueva pestana"
                >
                  <div
                    class="rounded-sm overflow-hidden flex flex-col"
                    style="
                      background:
                        radial-gradient(ellipse 55% 50% at 50% 38%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 55%),
                        radial-gradient(ellipse 90% 90% at 50% 30%, #5a83d8 0%, #1e3a8a 40%, #0a1428 100%);
                    "
                  >
                    <div class="h-16"></div>
                    <div class="bg-white mx-space-4 mb-space-4 rounded-sm p-space-3 relative">
                      <!-- Folder tabs -->
                      <div class="absolute top-1 right-3 flex items-center gap-1">
                        <span
                          class="text-[8px] font-medium px-1.5 py-0.5 rounded bg-[#2563eb] text-white"
                        >
                          Articulos
                        </span>
                        <span
                          class="text-[8px] px-1.5 py-0.5 rounded bg-[#dbeafe] text-[#1e3a8a] border border-[#bfdbfe]"
                        >
                          30/4
                        </span>
                      </div>
                      <p
                        class="text-[10px] font-serif text-canvas-fg leading-tight max-w-[60%] mt-space-3"
                      >
                        Claves de los episodios de peor comportamiento
                      </p>
                      <div
                        class="border-t border-border-hairline mt-space-2 pt-space-2 flex items-center justify-between gap-space-2"
                      >
                        <div class="flex items-center gap-1">
                          <div class="flex -space-x-1">
                            <span class="w-3 h-3 rounded-full bg-action-300 ring border-white"></span>
                            <span class="w-3 h-3 rounded-full bg-system-warning ring border-white"></span>
                          </div>
                          <span class="text-[8px] text-canvas-fg font-medium">Aitana &amp; Aitor</span>
                          <span class="text-[8px] text-neutral-400">⊙ ✉</span>
                        </div>
                        <div class="flex gap-0.5">
                          @for (_ of [0, 1, 2, 3]; track $index) {
                            <span
                              class="w-2.5 h-2.5 rounded-full bg-surface-quiet"
                            ></span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-space-3 mt-space-3 px-space-2">
                    <div class="flex-1 flex flex-col gap-1.5">
                      <span class="h-2 w-3/4 rounded-sm bg-neutral-200"></span>
                      <span class="h-1.5 w-full rounded-sm bg-neutral-100"></span>
                      <span class="h-1.5 w-5/6 rounded-sm bg-neutral-100"></span>
                      <span class="h-1.5 w-full rounded-sm bg-neutral-100"></span>
                    </div>
                    <div class="w-16 flex flex-col gap-1 border-l border-border-hairline pl-space-2">
                      <p class="text-[8px] uppercase tracking-wider text-neutral-500">
                        En esta pagina
                      </p>
                      <span class="h-1 w-full rounded-sm bg-action-700"></span>
                      <span class="h-1 w-3/4 rounded-sm bg-neutral-200"></span>
                      <span class="h-1 w-full rounded-sm bg-neutral-200"></span>
                      <span class="h-1 w-2/3 rounded-sm bg-neutral-200"></span>
                    </div>
                  </div>
                  <p
                    class="text-caption text-neutral-500 mt-space-3 group-hover:text-canvas-fg transition-colors flex items-center gap-1"
                  >
                    Ver pantalla en vivo
                    <span aria-hidden="true">→</span>
                  </p>
                </a>

                <div id="articulo-autores" class="mb-space-10">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Information density</afi-badge>
                    <afi-badge intent="neutral" size="sm">Trust</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    Autor compacto, contacto a un click
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed mb-space-3">
                    El bloque grande de autor (avatar + nombre + rol, repetido por
                    persona) ocupaba mucho y aportaba poco. Lo redujimos a una linea:
                    avatares apilados y nombres inline.
                  </p>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    Para no perder la senal de credibilidad, anadimos un icono de
                    LinkedIn y otro de email junto a cada nombre — contacto directo sin
                    listar el rol completo. Los iconos de compartir AFI van a la derecha
                    de esa misma linea, en lugar de una fila propia. Toda la cabecera
                    ocupa ahora la mitad de alto.
                  </p>
                </div>

                <div id="articulo-toc">
                  <div class="flex items-center gap-space-2 mb-space-3">
                    <afi-badge intent="info" size="sm">Wayfinding</afi-badge>
                  </div>
                  <h3 class="text-body-lg-600 text-canvas-fg mb-space-3">
                    "En esta pagina" sigue al lector
                  </h3>
                  <p class="text-body-md text-neutral-600 leading-relaxed mb-space-3">
                    Los articulos son largos. Sin navegacion interna, el lector pierde el
                    hilo y no puede saltar a la seccion que le interesa. Anadimos una
                    barra lateral
                    <strong class="text-canvas-fg">"En esta pagina"</strong> que es
                    sticky a 80 px del borde superior.
                  </p>
                  <p class="text-body-md text-neutral-600 leading-relaxed">
                    Resalta automaticamente la seccion activa, anuncia el tiempo de
                    lectura, y permite saltar a cualquier seccion con un click. Esta
                    misma pagina lo usa — la columna de la derecha sigue al cursor para
                    que veas el patron en accion.
                  </p>
                </div>
              </section>

              <!-- =========== Pantalla 04 · Suscripcion (consolidated into Home) ===========
                   The subscription flow lives inline on the home page, so the
                   standalone /suscripcion view is no longer a separate "pantalla"
                   in the case study. The page still exists in the codebase as a
                   deep-link landing for users coming from external CTAs. -->
              <section id="suscripcion-deep-link" class="mb-space-20">
                <div
                  class="flex items-center gap-space-4 mb-space-6 pb-space-3 border-b border-border-hairline"
                >
                  <span
                    class="shrink-0 w-12 h-12 rounded-md border-2 border-action text-action font-serif text-[24px] flex items-center justify-center"
                  >
                    04
                  </span>
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-caption uppercase tracking-wider text-neutral-500 mb-1"
                    >
                      Apunte · /afi-insights/suscripcion
                    </p>
                    <h2 class="text-title font-serif text-canvas-fg leading-tight">
                      Suscripcion (deep link)
                    </h2>
                  </div>
                  <a
                    href="/afi-insights/suscripcion"
                    target="_blank"
                    rel="noopener"
                    class="shrink-0 inline-flex items-center gap-1 px-space-3 h-8 rounded-md border border-border-hairline text-body-sm text-canvas-fg hover:bg-surface-quiet transition-colors"
                    aria-label="Abrir Suscripcion en una nueva pestana"
                  >
                    Abrir
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>

                <p class="text-body-md text-neutral-600 leading-relaxed mb-space-4">
                  El flujo de suscripcion <strong class="text-canvas-fg">vive en la home</strong>
                  — email primero, preferencias despues, defaults inteligentes. Las
                  decisiones detalladas estan arriba, en la pantalla 01.
                </p>
                <p class="text-body-md text-neutral-600 leading-relaxed">
                  La pagina dedicada
                  <code class="text-body-sm bg-surface-quiet px-1 rounded-sm"
                    >/afi-insights/suscripcion</code
                  >
                  existe como landing de apoyo para usuarios que llegan desde un enlace
                  externo (email marketing, banner). Aplica las mismas reglas — solo
                  emails corporativos, tres pasos, defaults — y muestra explicitamente
                  <span class="text-canvas-fg italic">"Paso 1 de 3"</span> con barra de
                  progreso (<em>Goal Gradient</em>) porque el usuario llega frio y
                  necesita ver el final del tunel.
                </p>
              </section>

              <!-- =========== Psychology references =========== -->
              <section id="psicologia" class="mb-space-16">
                <h2 class="text-subtitle font-serif text-canvas-fg mb-space-2">
                  Principios psicologicos aplicados
                </h2>
                <p class="text-body-sm text-neutral-500 mb-space-6">
                  Cada principio enlaza a la pantalla y elemento donde se ve en el
                  diseno. Si no esta listado aqui, no esta en el diseno.
                </p>
                <div class="flex flex-col gap-space-3">
                  @for (row of principlesTable; track row.principle) {
                    <a
                      [href]="row.href"
                      target="_blank"
                      rel="noopener"
                      class="block rounded-md border border-border-hairline bg-surface-quiet hover:bg-surface-muted transition-colors p-space-4 group"
                    >
                      <div class="flex flex-wrap items-baseline gap-space-2 mb-space-1">
                        <span class="text-body-md font-medium text-canvas-fg">
                          {{ row.principle }}
                        </span>
                        <span class="text-caption text-neutral-500">·</span>
                        <span class="text-caption text-action-700 font-medium">
                          {{ row.screen }}
                        </span>
                        <span class="text-caption text-neutral-500">
                          {{ row.element }}
                        </span>
                      </div>
                      <p class="text-body-sm text-neutral-600 leading-relaxed">
                        @if (row.quote) {
                          <span class="text-canvas-fg italic">"{{ row.quote }}"</span> —
                        }
                        {{ row.note }}
                      </p>
                      <span
                        class="inline-flex items-center gap-1 mt-space-2 text-caption text-neutral-500 group-hover:text-canvas-fg transition-colors"
                      >
                        Ver en pantalla
                        <span aria-hidden="true">→</span>
                      </span>
                    </a>
                  }
                </div>
              </section>
            </article>

            <!-- =========== Sticky TOC sidebar =========== -->
            <nav
              class="sticky top-[80px] self-start hidden xl:block w-[240px] shrink-0"
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
            </nav>
          </div>
        </div>
      </main>

      <ai-insights-footer />
    </div>
  `,
})
export class InsightsCasoDeEstudioPage implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly activeSection = signal('reto');

  readonly tocSections: TocEntry[] = [
    { id: 'reto', label: 'El reto', level: 0 },
    { id: 'home', label: '01 · Home', level: 0 },
    { id: 'home-suscripcion', label: 'Suscripcion above the fold', level: 1 },
    { id: 'home-hero', label: 'Hero claro', level: 1 },
    { id: 'home-business-email', label: 'Solo emails corporativos', level: 1 },
    { id: 'home-email-primero', label: 'Email primero', level: 1 },
    { id: 'home-defaults', label: 'Defaults inteligentes', level: 1 },
    { id: 'articulos', label: '02 · Articulos', level: 0 },
    { id: 'articulos-listado', label: 'Valor + tabs + "Ver mas"', level: 1 },
    { id: 'articulo', label: '03 · Articulo', level: 0 },
    { id: 'articulo-autores', label: 'Autor compacto', level: 1 },
    { id: 'articulo-toc', label: 'En esta pagina', level: 1 },
    { id: 'suscripcion-deep-link', label: '04 · Suscripcion (deep link)', level: 0 },
    { id: 'psicologia', label: 'Principios', level: 0 },
  ];

  // Each principle points to a screen + a concrete element + (where applicable)
  // verbatim copy that lives in that screen's source. If you can't find the
  // quote on the screen, the entry is wrong — fix it, don't paper over it.
  readonly principlesTable = [
    {
      principle: 'Cognitive Load',
      screen: 'Home',
      element: 'hero',
      quote: 'AFI Insights',
      note: 'hero tipografico sin foto. Solo titulo + subhead + un campo de email.',
      href: '/afi-insights/home',
    },
    {
      principle: 'Serial Position',
      screen: 'Home',
      element: 'hero · primer elemento above the fold',
      quote: 'Analisis, estudios e informes del sector financiero.',
      note: 'subhead + email CTA en posicion de primacia, lo primero que ve el lector.',
      href: '/afi-insights/home',
    },
    {
      principle: 'Social Proof',
      screen: 'Home',
      element: 'debajo del email CTA',
      quote: 'Mas de 2.000 profesionales del sector financiero ya suscritos',
      note: 'cifra concreta, segmento concreto. Reduce la friccion de ser el primero.',
      href: '/afi-insights/home',
    },
    {
      principle: "Hick's Law",
      screen: 'Articulos',
      element: 'tabs de categorias',
      quote: 'Estudios · Informes · Articulos · Eventos · Media',
      note: '5 opciones cerradas, no un buscador abierto. Decision rapida.',
      href: '/afi-insights/articulos',
    },
    {
      principle: 'Loss Aversion',
      screen: 'Articulo',
      element: 'CTA mid-article (despues de "Factores determinantes")',
      quote: 'No te pierdas el analisis que mueve el sector',
      note:
        'el lector ya invirtio tiempo leyendo. La frase enmarca el suscribirse como "no perder", no como "ganar".',
      href: '/afi-insights/articulo',
    },
    {
      principle: 'Wayfinding',
      screen: 'Articulo',
      element: 'columna derecha "En esta pagina"',
      quote: 'En esta pagina',
      note:
        'sticky a 80 px, resalta la seccion activa, anuncia tiempo de lectura. Al scroll, la columna acompana.',
      href: '/afi-insights/articulo',
    },
    {
      principle: 'Information Density',
      screen: 'Articulo',
      element: 'cabecera del articulo',
      quote: '',
      note:
        'autor compacto: avatares apilados + nombres inline + iconos LinkedIn/email a un click. Sustituye el bloque grande original.',
      href: '/afi-insights/articulo',
    },
    {
      principle: 'Lead Quality',
      screen: 'Home',
      element: 'validacion del campo email',
      quote: 'Solo aceptamos emails corporativos. Usa el de tu empresa.',
      note:
        'rechazamos dominios gratuitos (gmail, hotmail, yahoo, outlook…) en submit. Insights solo tiene sentido para profesionales del sector.',
      href: '/afi-insights/home',
    },
    {
      principle: 'Progressive Disclosure',
      screen: 'Home',
      element: 'flujo inline tras el email',
      quote: '',
      note:
        'la home solo pide email. Tras suscribirse aparece el CTA "Personaliza preferencias" que abre el resto en su sitio. Nada se pide de golpe.',
      href: '/afi-insights/home',
    },
    {
      principle: 'Commitment & Consistency',
      screen: 'Home',
      element: 'panel de preferencias tras suscribirse',
      quote: '',
      note:
        'una vez dado el email, el coste percibido de completar nombre/temas/frecuencia es mucho menor. El usuario ya esta dentro.',
      href: '/afi-insights/home',
    },
    {
      principle: 'Default Effect',
      screen: 'Home',
      element: 'panel de preferencias · selector de temas',
      quote: 'Popular',
      note:
        '"Estudios" y "Articulos" llevan badge "Popular" y vienen pre-seleccionados. Frecuencia semanal pre-seleccionada.',
      href: '/afi-insights/home',
    },
    {
      principle: 'Goal Gradient',
      screen: 'Suscripcion (deep link)',
      element: 'cabecera del flujo dedicado',
      quote: 'Paso 1 de 3',
      note:
        'la pagina dedicada /suscripcion muestra una barra de progreso de tres tramos. Indica cuanto falta cuando el usuario llega frio desde un enlace externo.',
      href: '/afi-insights/suscripcion',
    },
  ];

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
