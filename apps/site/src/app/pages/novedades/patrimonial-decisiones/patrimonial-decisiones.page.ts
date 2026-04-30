import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@coherence/ui';

/**
 * Case study for the Patrimonial proposal.
 *
 * Breaks down the page-chrome decisions behind the Patrimonio page:
 * top bar, breadcrumb, page header, action chips, metrics, tabs, tables.
 * Also proposes the inline alternative for page-level vs section-level
 * filter actions.
 */
@Component({
  selector: 'site-patrimonial-decisiones-page',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-canvas-base">
      <div
        class="flex items-center gap-space-3 border-b border-border-hairline px-space-4 h-10 bg-surface-quiet shrink-0 text-body-sm"
      >
        <a
          routerLink="/novedades"
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
        <a routerLink="/novedades/patrimonial" class="text-neutral-600 hover:text-canvas-fg"
          >Patrimonio</a
        >
        <span class="text-neutral-400" aria-hidden="true">/</span>
        <span class="text-canvas-fg font-medium">Decisiones</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[880px] mx-auto py-space-10">
          <afi-page-header
            title="Patrimonio — decisiones"
            subtitle="Cómo componemos el cromo de la página: top bar, cabecera, acciones, métricas, pestañas y tablas. Cada bloque explica qué sección resuelve qué problema, cuándo encenderla y cuándo apagarla."
            [sticky]="false"
            [scrollFade]="false"
          >
            <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
              >CASO DE ESTUDIO</span
            >
          </afi-page-header>

          <div class="mt-space-8 px-space-8 flex flex-col gap-space-8 pb-space-10">
            <!-- Plantilla de página -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Por qué una plantilla de página</h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Consistencia cognitiva.</strong> Si cada página
                  coloca el título, las acciones y las pestañas en sitios distintos, el usuario paga
                  un coste de aprendizaje por cada vista. Una plantilla común baja ese coste a cero:
                  el ojo ya sabe dónde mirar.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cinco secciones componibles.</strong> Top bar,
                  cabecera (título+subtítulo), barra de acciones, fila de métricas, pestañas. No
                  todas se usan siempre — la página enciende sólo las que necesita. Una página de
                  lista usa top bar + cabecera + tabs; una de detalle simple puede usar sólo título
                  + subtítulo.
                </p>
              </div>
            </article>

            <!-- Top bar -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Top bar — contexto global de la simulación
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Opcional</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Qué contiene.</strong> Identidad de la simulación
                  (ID planificación + estado Borrador/Aprobado), navegación hacia la lista, y
                  acciones globales (notas, ajustes globales). Nada de la página actual — sólo
                  "dónde estoy" a nivel sistema.
                </p>
                <p>
                  <strong class="text-canvas-fg">Por qué arriba.</strong> La convención web pone el
                  chrome global en la parte superior. Al ser siempre visible, funciona de ancla de
                  retorno y de indicador de estado.
                </p>
                <p>
                  <strong class="text-canvas-fg">Iconos con tooltip.</strong> A la derecha — reduce
                  el ancho y evita etiquetas que rompan la densidad.
                </p>
              </div>
            </article>

            <!-- Cabecera de página -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Título y subtítulo — siempre</h2>
                </div>
                <span class="text-caption text-neutral-500">Obligatorio</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Título.</strong> 32/40 Roboto Serif 500. Es la
                  única sección no opcional — sin título, no hay página.
                </p>
                <p>
                  <strong class="text-canvas-fg">Subtítulo.</strong> Una frase que explique qué hace
                  la página. Descarga al usuario de suponer. Si no cabe en una frase, probablemente
                  la página tiene más de un propósito y toca partirla.
                </p>
              </div>
            </article>

            <!-- Acciones por página -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Barra de acciones — chips + búsqueda + primary
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Opcional</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Chips a la izquierda.</strong> Filtros/settings que
                  modifican <em>toda</em> la página (Entidad, Min €, Max €). Misma regla que los
                  filtros del gráfico: 3 visibles máximo; el resto va a un panel secundario.
                </p>
                <p>
                  <strong class="text-canvas-fg">Búsqueda a la derecha.</strong> Restringida al
                  ámbito de la página ("Buscar en patrimonio…"). El placeholder recuerda el ámbito —
                  no es búsqueda global.
                </p>
                <p>
                  <strong class="text-canvas-fg">Primary action al extremo derecho.</strong> La
                  acción más importante de la página — una sola (<code
                    class="font-mono text-caption text-action-700"
                    >+ Añadir</code
                  >). Si aparecen varias, alguna no es primaria: la pasamos al panel Ajustes o a un
                  menú secundario.
                </p>
              </div>
            </article>

            <!-- Filtros: page-level vs section-level (la alternativa inline) -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-action-700"
                    >En exploración</span
                  >
                  <h2 class="text-section text-canvas-fg">Filtros — página vs sección / gráfico</h2>
                </div>
                <span class="text-caption text-neutral-500">Alternativa inline</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  Actualmente manejamos dos filas de filtros: <em>chips de página</em> (arriba, a
                  lado del buscador) y <em>selectores del gráfico</em> (encima del chart, en zonas).
                  El equipo sugirió unificarlos en una sola acción inline para reducir el cromo.
                </p>
                <p>
                  <strong class="text-canvas-fg">La propuesta inline.</strong> En vez de dos
                  ubicaciones, las acciones aparecen <em>junto al contenido que modifican</em>:
                  filtros de página sobre el contenedor de la tabla; selectores del gráfico sobre la
                  cabecera del gráfico. Mismo patrón, distinta jerarquía de proximidad.
                </p>
                <p>
                  <strong class="text-canvas-fg">Qué ganamos.</strong> Menos chrome duplicado,
                  asociación visual clara entre control y dato, menos ambigüedad sobre "qué filtra
                  qué".
                </p>
                <p>
                  <strong class="text-canvas-fg">Qué perdemos.</strong> Escaneabilidad de todas las
                  acciones de la página en un solo golpe de vista. Para páginas con varios widgets
                  (patrimonio, evolución, diagnóstico en una misma pantalla), inline duplica la
                  cantidad de filas de control.
                </p>
                <p>
                  <strong class="text-canvas-fg">Recomendación por ahora.</strong> Dos ubicaciones
                  con reglas estrictas: chips de página = cambios de scope/rango (entidad, mínimo,
                  máximo, periodo); filtros del gráfico = cambios de representación (vista,
                  escenario, detalle). Si el equipo sigue viéndolo como duplicación, migramos a
                  inline en un sprint dedicado.
                </p>
              </div>
            </article>

            <!-- Métricas -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Fila de métricas — contexto antes de las tabs
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Opcional</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Antes de navegar por tabs, el
                  usuario necesita una foto agregada: cuánto tengo, a qué ritmo crece, con qué
                  perfil. Son las 2–4 métricas que responden las preguntas frecuentes sin obligar a
                  cambiar de pestaña.
                </p>
                <p>
                  <strong class="text-canvas-fg">Sin cards.</strong> Label pequeño → valor grande →
                  nota de contexto. Un divisor horizontal arriba separa "acciones" (chips +
                  búsqueda) de "datos" (métricas).
                </p>
                <p>
                  <strong class="text-canvas-fg">Cuándo apagarla.</strong> Listas simples sin
                  agregados; o páginas cuyo contenido principal ya es una métrica (dashboards
                  puros).
                </p>
              </div>
            </article>

            <!-- Tabs -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Tabs — particionan un mismo ámbito</h2>
                </div>
                <span class="text-caption text-neutral-500">Opcional</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Para qué.</strong> Cortar el contenido de la página
                  en slices equivalentes. En Patrimonio: las tabs son el
                  <em>tipo de activo</em> (Todos, Liquidez, Inversiones…). No se usan para navegar a
                  otras <em>páginas</em> — eso es el rol del sidebar.
                </p>
                <p>
                  <strong class="text-canvas-fg">Contadores.</strong> Cada tab muestra el número de
                  elementos — anticipa el peso informativo antes del click.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cuándo apagarlas.</strong> Si hay una sola vista.
                  Nada de tabs fantasma.
                </p>
              </div>
            </article>

            <!-- Cabecera de tabla (consistencia con el gráfico) -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Cabecera de tabla — consistencia con el gráfico
                  </h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Cada sección de tabla (Liquidez,
                  Inversiones, Inmobiliario…) merece el mismo tratamiento de cabecera que la
                  cabecera del gráfico — label → valor titular → contexto. Esto mantiene la rítmica
                  visual entre secciones y ancla el valor agregado antes de entrar en la tabla.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Tres niveles idénticos a la cabecera
                  del gráfico:
                </p>
                <ul class="list-disc pl-space-6 space-y-space-1">
                  <li>
                    <strong class="text-canvas-fg">Label</strong> — "Liquidez" / "Inversiones"
                    (text-body-sm muted).
                  </li>
                  <li>
                    <strong class="text-canvas-fg">Valor titular</strong> — el total del segmento
                    (text-section Roboto Serif).
                  </li>
                  <li>
                    <strong class="text-canvas-fg">Contexto</strong> —
                    <em>2 activos · Total del segmento</em> (text-body-sm muted).
                  </li>
                </ul>
                <p>
                  <strong class="text-canvas-fg">Acción a la derecha.</strong> Botón ghost "+ Añadir
                  [tipo]" alineado a la derecha del bloque de cabecera — añade un activo
                  directamente al segmento sin forzar al usuario a subir al botón Añadir de página.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo
                </p>
                <div class="bg-surface-quiet rounded-md p-space-6">
                  <div class="flex items-start justify-between gap-space-4">
                    <div class="flex flex-col">
                      <p class="text-body-sm text-neutral-500">Liquidez</p>
                      <h3 class="text-section text-canvas-fg">65.200 €</h3>
                      <p class="text-body-sm text-neutral-500 mt-space-1">
                        2 activos · Total del segmento
                      </p>
                    </div>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 px-space-3 h-8 rounded text-body-sm text-canvas-fg hover:bg-surface-muted"
                    >
                      <svg
                        class="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        />
                      </svg>
                      <span>Añadir cuenta</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <!-- Tablas -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Tablas — free-flowing, sin contenedor</h2>
                </div>
                <span class="text-caption text-neutral-500"
                  >Componente guide: Figma <code class="font-mono">318:26863</code></span
                >
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué sin borde.</strong> Las secciones de la
                  página (Liquidez, Inversiones, Inmobiliario…) ya están separadas por titulares y
                  espaciado. Añadir un contenedor a cada tabla duplica la separación visual y
                  fragmenta la página.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Sólo separadores horizontales entre
                  filas (<code class="font-mono text-caption">border-border-hairline</code>).
                  Cabeceras en
                  <code class="font-mono text-caption">font-medium text-canvas-fg</code> (mismo
                  tamaño que el contenido — no uppercase caption). Columnas ordenables muestran un
                  chevron doble <code class="font-mono">↕</code> clickable.
                </p>
                <p>
                  <strong class="text-canvas-fg">Filas con descriptor.</strong> Nombre en bold con
                  descriptores en línea (<em>3 instrumentos · Liquidable</em>); ISIN debajo en
                  caption muted. Cada fila termina con un botón de tres puntos para acciones
                  (editar, eliminar, detalle).
                </p>
                <p>
                  <strong class="text-canvas-fg">Pendiente.</strong> Variantes del
                  <code class="font-mono text-caption">afi-table</code> para agrupación con
                  sub-filas expandibles (Cartera → instrumentos). En el mock actual están planas.
                </p>
              </div>
            </article>

            <!-- Atajo Añadir -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Atajo "+ Añadir" — <kbd class="font-mono">A</kbd> en cualquier momento
                  </h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> La acción más frecuente en
                  Patrimonio es añadir un activo. Un atajo de una sola tecla elimina el
                  desplazamiento del cursor a la esquina superior derecha — patrón
                  Linear/Superhuman.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> El botón primario "+ Añadir" muestra
                  el atajo inline (<code class="font-mono text-caption"
                    >&lt;afi-kbd&gt;A&lt;/afi-kbd&gt;</code
                  >) para que sea descubrible. Pulsar
                  <kbd class="font-mono px-1 py-0.5 bg-surface-muted rounded text-caption">A</kbd>
                  abre el diálogo de añadir.
                </p>
                <p>
                  <strong class="text-canvas-fg">Sólo en la acción global.</strong> Los botones
                  secundarios "+ Añadir cuenta/inversión/…" por segmento no tienen atajo propio —
                  serían conflictivos. El atajo global abre un selector que pregunta a qué segmento
                  añadir.
                </p>
              </div>
            </article>

            <!-- Tablas con columnas variables -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Tablas — columnas diferentes por tipo de activo
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">9 secciones</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Cada clase de activo tiene
                  métricas propias. Deudas habla de <em>Plazo pendiente</em>,
                  <em>Tipo de interés</em> y <em>Capital pendiente</em>; Seguros de vida de
                  <em>Capital de fallecimiento/invalidez</em>; Planes de pensiones y EPSV de
                  <em>Derechos consolidados anteriores a 2007</em>. Obligar a todas esas realidades
                  a compartir las mismas cuatro columnas produce celdas vacías que parecen datos
                  faltantes.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong> Cada
                  <code class="font-mono text-caption text-action-700">section</code> declara su
                  propio <code class="font-mono text-caption text-action-700">columns[]</code> con
                  <em>key, label, align, emphasis, width</em>. Un único
                  <code class="font-mono text-caption text-action-700">&#64;for</code> itera las
                  secciones y construye
                  <code class="font-mono text-caption text-action-700">grid-template-columns</code>
                  al vuelo — el mismo template renderiza 2, 3, 4 o 5 columnas según la sección.
                </p>
                <p>
                  <strong class="text-canvas-fg">Inversiones — jerarquía parent + holdings.</strong>
                  Las Carteras contienen posiciones internas (ETFs, fondos) que tienen sentido
                  mostrar desplegadas. Cada cartera es una fila con chevron; sus holdings aparecen
                  indentados con una guía vertical hairline — se lee como tree view sin cromo extra.
                </p>
                <p>
                  <strong class="text-canvas-fg">Énfasis visual.</strong> La columna
                  <em>importe primario</em> (valor, capital pendiente, capital de invalidez) lleva
                  <code class="font-mono text-caption">emphasis: true</code> → texto más grueso en
                  <code class="font-mono text-caption">text-canvas-fg</code>. El resto en
                  <code class="font-mono text-caption">text-neutral-700</code>. Una sola pieza de
                  negrita por fila — el patrón Granola / Stripe para tablas densas.
                </p>
              </div>
            </article>

            <!-- Tabs macro · filtros micro -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Tabs macro, filtros micro — jerarquía de información
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Reorden v2</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">El problema.</strong> En v1 la fila de búsqueda +
                  chips vivía <em>encima</em> de las tabs. Los filtros afectan a las tablas, las
                  tabs también afectan a las tablas — tenerlos separados por 64px de tarjetas de
                  métricas rompía la conexión visual.
                </p>
                <p>
                  <strong class="text-canvas-fg">La reordenación.</strong> De arriba a abajo:
                  <strong>cabecera</strong> → <strong>métricas</strong> (contexto estable del
                  patrimonio total, no cambia con filtros) → <strong>tabs</strong> (cambio macro:
                  qué categoría veo) → <strong>filtros</strong> (narrow dentro de la categoría) →
                  <strong>tablas</strong>. Cada pieza queda justo encima de lo que afecta.
                </p>
                <p>
                  <strong class="text-canvas-fg">Consecuencia — "+ Añadir" baja.</strong> El primary
                  action vuelve a la fila de filtros (anclado a la derecha tras un hairline divider)
                  y adopta forma de icono cuadrado 32×32
                  <code class="font-mono text-caption">rounded-md</code> — no pill. A su lado, el
                  <em>lápiz</em> ghost entra en modo edición. Ambos con tooltip
                  <code class="font-mono text-caption">.tt-pop</code>.
                </p>
                <p>
                  <strong class="text-canvas-fg">Tab transition.</strong> Al cambiar de pestaña, el
                  subrayado <code class="font-mono text-caption">.tab-indicator</code> desliza con
                  <code class="font-mono text-caption">transition: left/width 260ms</code> y el
                  panel entrante hace <em>translateX(±28px) → 0</em> direccional (forward/backward
                  según el delta de índice). Estilo <em>animate-ui</em>, implementado con un
                  <code class="font-mono text-caption">&#64;for … track</code> que incluye
                  <code class="font-mono text-caption">activeTab()</code> para forzar re-montar el
                  DOM y re-disparar la keyframe.
                </p>
              </div>
            </article>

            <!-- Chips — exit icon + Azul value -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Filter chips — × sale, label en dark, valor en Azul
                  </h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Anatomía del chip activo.</strong> Izquierda:
                  <em>exit-circle</em> (×) que limpia el filtro con un clic — no obliga a abrir el
                  popup. Centro: <strong>label</strong> (Entidad / Min / Max) en
                  <code class="font-mono text-caption">text-canvas-fg</code>. Hairline separador.
                  <strong>Valor aplicado</strong> en
                  <code class="font-mono text-caption">text-action-700</code> para que canta como
                  "esto es lo que has elegido". Derecha: chevron para abrir.
                </p>
                <p>
                  <strong class="text-canvas-fg">Por qué tres niveles de contraste.</strong>
                  Probamos chips que ponían todo en Azul cuando estaban activos — el label se volvía
                  ruido. Separar <em>qué filtro es</em> (dark) de <em>qué vale</em> (Azul) deja
                  clara la distinción. Patrón Linear / Granola.
                </p>
                <p>
                  <strong class="text-canvas-fg">Entidad — multiselect con "Todos".</strong> El
                  dropdown empieza con una fila <em>Todos</em> que selecciona / deselecciona todo de
                  golpe. Si todos están seleccionados, el chip muestra <em>Todas</em> (no
                  <em>6 seleccionadas</em>). Sólo se listan entidades que el usuario tiene en
                  patrimonio — no el catálogo completo de bancos de España.
                </p>
                <p>
                  <strong class="text-canvas-fg">Min / Max — popover con input numérico.</strong>
                  Sin sliders (imprecisos para €). <em>Intl.NumberFormat</em> compact para el label
                  del chip (<code class="font-mono text-caption">100M €</code> en vez de
                  <code class="font-mono text-caption">100.000.000 €</code>) — así la fila de
                  controles no se estira.
                </p>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class PatrimonialDecisionesPage {}
