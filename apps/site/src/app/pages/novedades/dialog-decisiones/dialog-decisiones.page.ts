import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ButtonComponent,
  InputComponent,
  KbdComponent,
  PageHeaderComponent,
  SelectComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { EvolucionBarChartComponent } from '../../patrones/graficos/evolucion-patrimonial/evolucion-bar-chart.component';

/**
 * Case study for the "+ Añadir" dialog.
 *
 * Covers: Tesler's law motivation, two-pane layout (form + live preview),
 * Stripe-invoice analogy, progressive disclosure, and the keyboard shortcut.
 */
@Component({
  selector: 'site-dialog-decisiones-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    InputComponent,
    KbdComponent,
    PageHeaderComponent,
    SelectComponent,
    EvolucionBarChartComponent,
  ],
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
        <span class="text-canvas-fg font-medium">Diálogo · Añadir activo</span>
      </div>

      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[920px] mx-auto py-space-10">
          <afi-page-header
            title="Diálogo · Añadir activo — decisiones"
            subtitle="Un formulario corto y una vista previa en directo que traduce cada cambio al gráfico de Evolución patrimonial. Inspirado en Stripe (factura que se actualiza al editar) y en la Ley de Tesler: la complejidad no se reduce, pero la movemos del usuario al sistema."
            [sticky]="false"
            [scrollFade]="false"
          >
            <span slot="breadcrumb" class="uppercase tracking-wider text-action-700"
              >CASO DE ESTUDIO</span
            >
          </afi-page-header>

          <div class="mt-space-8 px-space-8 flex flex-col gap-space-8 pb-space-10">
            <!-- Ley de Tesler / Por qué preview -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Vista previa en directo — la Ley de Tesler aplicada
                  </h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Añadir un activo no es sólo un
                  formulario: afecta la proyección global del patrimonio. Si el usuario sólo ve
                  &laquo;guardar / cancelar&raquo;, sigue haciendo la proyección mentalmente — el
                  sistema le pasa la carga cognitiva. La Ley de Tesler dice que
                  <em>la complejidad irreducible se puede desplazar pero no eliminar</em>;
                  preferimos que la absorba el sistema.
                </p>
                <p>
                  <strong class="text-canvas-fg">Referencia — Stripe.</strong> Cuando editas líneas
                  de una factura, la factura se recalcula a la derecha en tiempo real. No hay
                  &laquo;previsualizar&raquo;; la previsualización <em>es</em> la interfaz. Lo mismo
                  aquí: a la izquierda escribes importe, tipo, entidad; a la derecha ves la
                  evolución patrimonial esperada con ese activo incluido.
                </p>
                <p>
                  <strong class="text-canvas-fg">Qué se gana.</strong> (1) El usuario valida lo que
                  hace antes de guardar. (2) Convierte un formulario en una herramienta de
                  simulación ligera — &laquo;¿qué pasa si añado 50k de liquidez?&raquo; se contesta
                  sin salir del diálogo. (3) Reduce cancelaciones / ediciones posteriores.
                </p>
              </div>
              <div class="mt-space-5 pt-space-4 border-t border-border-hairline">
                <p class="text-caption uppercase tracking-wider text-neutral-500 mb-space-3">
                  Ejemplo en vivo
                </p>
                <div
                  class="border border-border-hairline rounded-md overflow-hidden flex h-[460px]"
                >
                  <!-- Left: form. Header (title + close) → content → footer (button row).
                       Footer aligns the buttons to the right and uses the kbd shortcut
                       embedded inside the Cancelar button so the text and the buttons
                       don't compete for visual weight. -->
                  <div class="flex-[1.1] min-w-0 flex flex-col border-r border-border-hairline">
                    <header
                      class="flex items-center justify-between px-space-5 py-space-3 border-b border-border-hairline"
                    >
                      <div class="flex flex-col">
                        <p class="text-caption text-neutral-500">Situación actual · Patrimonio</p>
                        <h3 class="text-body-md font-medium text-canvas-fg">Añadir activo</h3>
                      </div>
                      <button
                        type="button"
                        class="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-surface-100 text-neutral-500"
                        aria-label="Cerrar (demo)"
                      >
                        <svg
                          class="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 01-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </header>
                    <div
                      class="flex-1 overflow-y-auto px-space-5 py-space-4 flex flex-col gap-space-4"
                    >
                      <afi-select
                        label="Tipo de activo"
                        [options]="tipoOptions"
                        [value]="tipo()"
                        (valueChange)="setTipo($event)"
                      />
                      <afi-input
                        label="Importe"
                        type="number"
                        placeholder="0"
                        hint="En euros. El gráfico se recalcula al cambiar este importe."
                        [value]="importe()"
                        (valueChange)="setImporte($event)"
                      />
                    </div>
                    <footer
                      class="flex items-center justify-end gap-space-2 px-space-5 py-space-3 border-t border-border-hairline"
                    >
                      <button
                        type="button"
                        class="inline-flex items-center gap-space-2 h-8 px-space-3 rounded-md text-body-sm text-neutral-700 hover:bg-surface-muted transition-colors"
                      >
                        <span>Cancelar</span>
                        <afi-kbd [keys]="escShortcut" size="sm" />
                      </button>
                      <afi-button variant="primary" size="sm">Guardar</afi-button>
                    </footer>
                  </div>
                  <!-- Right: live preview -->
                  <div class="flex-1 min-w-0 flex flex-col bg-surface-quiet">
                    <header class="px-space-5 py-space-3 border-b border-border-hairline">
                      <p class="text-caption uppercase tracking-wider text-action-700">
                        VISTA PREVIA · IMPACTO
                      </p>
                      <p class="text-body-sm text-canvas-fg mt-0.5">
                        Evolución patrimonial con el activo añadido.
                      </p>
                    </header>
                    <div
                      class="flex-1 overflow-hidden px-space-4 py-space-3 flex flex-col gap-space-2"
                    >
                      <div>
                        <p class="text-caption text-neutral-500">Patrimonio neto al pico (63)</p>
                        <div class="flex items-baseline gap-space-2 mt-0.5">
                          <h4 class="text-body-md font-serif text-canvas-fg">{{ peakLabel() }}</h4>
                          @if (importeNum() > 0) {
                            <span class="text-caption text-action-700 tabular-nums"
                              >+{{ formatEuro(importeNum()) }}</span
                            >
                          }
                        </div>
                      </div>
                      <div class="-mx-space-2 flex-1 min-h-0">
                        <afi-evolucion-bar-chart
                          vista="actual"
                          escenario="medio"
                          detalle="agregada"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p class="mt-space-3 text-caption text-neutral-500">
                  En la propuesta real, el gráfico usa la proyección del tipo de activo (liquidez se
                  mantiene, inmobiliario aprecia ~2% anual, inversiones ~5%, pensiones ~3,5%). Aquí
                  sólo reflejamos el delta agregado para simplificar la demo.
                </p>
              </div>
            </article>

            <!-- Layout en dos paneles -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Layout — formulario a la izquierda, preview a la derecha
                  </h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué izquierda→derecha.</strong> Lectura
                  occidental: el usuario escanea de izquierda a derecha. Los <em>inputs</em> (causa)
                  van a la izquierda, el <em>output</em> (efecto) va a la derecha. Invertirlo fuerza
                  saltos visuales contra-intuitivos.
                </p>
                <p>
                  <strong class="text-canvas-fg">Proporción 1,1 : 1.</strong> El formulario pesa un
                  poco más (<code class="font-mono text-caption">flex-[1.1]</code>) porque es donde
                  el usuario <em>actúa</em>. El preview no tiene que ser grande para confirmar la
                  dirección del cambio — basta con que sea legible.
                </p>
                <p>
                  <strong class="text-canvas-fg">Tamaño del modal.</strong>
                  <code class="font-mono text-caption">1040×640</code>. No full-screen — el usuario
                  no está editando un documento, está haciendo una tarea discreta. Pero bastante
                  ancho para que el gráfico no se vea apretado.
                </p>
                <p>
                  <strong class="text-canvas-fg">Contraste de fondo.</strong> Formulario sobre
                  <code class="font-mono text-caption">canvas-base</code>, preview sobre
                  <code class="font-mono text-caption">surface-quiet</code>. La diferencia sutil de
                  fondo ancla visualmente los dos roles sin pedir un divisor más fuerte.
                </p>
              </div>
            </article>

            <!-- Progresión de campos -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">Orden de campos — esencial primero</h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg"
                    >Tipo &rarr; Importe &rarr; Entidad &rarr; Descripción.</strong
                  >
                  El <em>Tipo</em> cambia radicalmente el modelo de proyección (liquidez vs
                  inversión vs inmobiliario), así que va primero. El <em>Importe</em> es lo que
                  mueve la aguja; en cuanto se teclea, el gráfico reacciona. La <em>Entidad</em> es
                  catálogo: el desplegable sólo contiene los bancos que el usuario ya tiene — no
                  reproducimos la lista completa de bancos de España.
                </p>
                <p>
                  <strong class="text-canvas-fg">Descripción opcional.</strong> No la pedimos
                  primero porque es tiempo de usuario sin impacto en la proyección. Va abajo, sin
                  asterisco.
                </p>
                <p>
                  <strong class="text-canvas-fg"
                    >Nada de &laquo;sección avanzada&raquo; desplegable.</strong
                  >
                  Cuatro campos caben sin acordeones. Un progressive disclosure aquí añadiría ruido
                  sin reducir carga.
                </p>
              </div>
            </article>

            <!-- Atajo de teclado -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Atajo — <afi-kbd [keys]="addShortcut" size="sm" /> abre,
                    <afi-kbd [keys]="escShortcut" size="sm" /> cierra
                  </h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg"
                    >Por qué <afi-kbd [keys]="addShortcut" size="sm" />.</strong
                  >
                  La acción más frecuente en la página de Patrimonio es añadir. &laquo;A&raquo; es
                  mnemotécnico (<em>Añadir</em>) y no choca con los atajos del navegador. Se muestra
                  visualmente junto al botón (<code class="font-mono text-caption"
                    >&lt;afi-kbd&gt;</code
                  >
                  dentro del botón primario) para que el usuario lo aprenda sin tener que buscarlo.
                </p>
                <p>
                  <strong class="text-canvas-fg"
                    >Por qué sin <code class="font-mono text-caption">⌘</code>.</strong
                  >
                  Una letra suelta es más rápida para una acción frecuente — Linear y Notion lo
                  hacen así para sus acciones principales. El handler comprueba que el usuario no
                  está dentro de un input antes de abrir.
                </p>
                <p>
                  <strong class="text-canvas-fg"
                    >Cierre con <afi-kbd [keys]="escShortcut" size="sm" />.</strong
                  >
                  Estándar absoluto. El pie del diálogo recuerda el atajo en texto pequeño para el
                  primer uso.
                </p>
              </div>
            </article>

            <!-- Anatomía -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-neutral-500"
                    >Referencia</span
                  >
                  <h2 class="text-section text-canvas-fg">Anatomía</h2>
                </div>
              </header>
              <ul
                class="text-body-md text-neutral-600 space-y-space-2 max-w-[640px] list-disc pl-space-5"
              >
                <li>
                  <strong class="text-canvas-fg">Overlay</strong> —
                  <code class="font-mono text-caption">fixed inset-0 bg-black/40</code>. Click fuera
                  cierra el diálogo (handler con
                  <code class="font-mono text-caption">stopPropagation</code> dentro del panel).
                </li>
                <li>
                  <strong class="text-canvas-fg">Cabecera</strong> — título arriba a la izquierda,
                  <code class="font-mono text-caption">[X]</code> a la derecha. Sin acciones
                  primarias aquí — solo identidad y salida.
                </li>
                <li>
                  <strong class="text-canvas-fg">Cuerpo</strong> — scroll interno cuando el
                  contenido crece. Formulario a la izquierda, resumen a la derecha.
                </li>
                <li>
                  <strong class="text-canvas-fg">Footer con la barra de acciones</strong> — fila
                  inferior con <em>Cancelar</em> (incluye el atajo
                  <code class="font-mono text-caption">Esc</code> como hint) +
                  <em>Guardar</em> alineados a la derecha. Acciones siempre visibles en la misma
                  franja, sin que compitan tipográficamente con el contenido de arriba.
                </li>
                <li>
                  <strong class="text-canvas-fg">Panel de resumen</strong> — etiqueta
                  <em>VISTA PREVIA · IMPACTO</em> arriba. La etiqueta explícita evita que el usuario
                  crea que ya está guardado. Todo dentro del resumen reacciona al teclear — Tesler's
                  Law.
                </li>
              </ul>
            </article>

            <!-- Cartera — formulario dinámico -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Cartera — el caso más complejo, en el mismo diálogo
                  </h2>
                </div>
                <span class="text-caption text-neutral-500">Inversión → Subtipo = Cartera</span>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué.</strong> Una Cartera no es un activo
                  atómico — agrupa posiciones internas (ETFs, fondos, liquidez) que el asesor quiere
                  introducir de una sola vez. Obligar a crear cinco activos sueltos y luego
                  "agruparlos" después rompe el flujo. El diálogo escala al caso complejo sin abrir
                  otro flow.
                </p>
                <p>
                  <strong class="text-canvas-fg">Progressive disclosure por Tipo + Subtipo.</strong>
                  Al elegir <em>Tipo = Inversión</em> aparece un segundo select <em>Subtipo</em>.
                  Sólo cuando
                  <code class="font-mono text-caption text-action-700">isCartera()</code> devuelve
                  true se revelan los campos específicos — Nombre de la cartera, ISIN opcional, y la
                  sección Composición. Para un simple <em>Fondo</em> o una <em>Acción</em> el
                  formulario queda corto.
                </p>
                <p>
                  <strong class="text-canvas-fg">Composición — lista dinámica.</strong> Header con
                  título + helper a <code class="font-mono text-caption">12px</code> (mismo tamaño,
                  weight/color distinguen). Tabla con <em>Nombre · Tipo · Importe €</em>. El botón
                  <em>+ Añadir posición</em> vive <em>debajo</em> de la última fila (no en el
                  header) — se lee como "otra línea aquí", no como una acción grande.
                </p>
                <p>
                  <strong class="text-canvas-fg">Importe auto-calculado.</strong> Cuando el diálogo
                  está en modo Cartera, el campo <em>Importe</em> global se reemplaza por una suma
                  automática de los holdings (<code class="font-mono text-caption"
                    >Importe total (auto)</code
                  >). Cero posibilidad de inconsistencia entre la cartera y sus posiciones.
                </p>
                <p>
                  <strong class="text-canvas-fg">Resumen en vivo con hijos.</strong> El panel
                  derecho renderiza el row preview con la cartera como padre + cada holding
                  indentado con guía vertical hairline — copia exacta del patrón expandible que usan
                  las tablas reales. El usuario ve literalmente cómo aparecerá la fila antes de
                  guardar.
                </p>
              </div>
            </article>

            <!-- Guardar → switch de tab + toast -->
            <article class="border border-border-hairline rounded-md p-space-6">
              <header class="flex items-center justify-between mb-space-3">
                <div class="flex items-center gap-space-2">
                  <span class="text-caption uppercase tracking-wider text-system-success"
                    >Decidido</span
                  >
                  <h2 class="text-section text-canvas-fg">
                    Al guardar — cambio de pestaña + toast de confirmación
                  </h2>
                </div>
              </header>
              <div class="text-body-md text-neutral-600 space-y-space-3 max-w-[640px]">
                <p>
                  <strong class="text-canvas-fg">Por qué cambiar de tab.</strong> Tras añadir un
                  activo, el usuario quiere ver que efectivamente se creó y dónde. Dejar la página
                  en <em>Todos</em> obliga a buscarlo entre 24 filas. Cambiar automáticamente a la
                  pestaña de la categoría del nuevo activo (Inversiones, Liquidez, Inmobiliario…)
                  lleva al usuario directamente a la tabla correcta.
                </p>
                <p>
                  <strong class="text-canvas-fg">Cómo.</strong>
                  <code class="font-mono text-caption text-action-700">saveNewActivo()</code> lee
                  <code class="font-mono text-caption">addTipo()</code>, mapea al
                  <em>section key</em> (<em>liquidez → liquidez</em>,
                  <em>inversion → inversiones</em>, <em>pension → planes-pensiones</em>…) y llama
                  <code class="font-mono text-caption text-action-700">setActiveTab(key)</code>. La
                  transición de tabs existente (subrayado deslizante + fade-slide del panel) absorbe
                  el cambio sin salto.
                </p>
                <p>
                  <strong class="text-canvas-fg">Toast contextual.</strong> Cartera:
                  <em>Cartera &laquo;&#123;nombre&#125;&raquo; añadida con N posiciones</em>.
                  No-Cartera: <em>Activo añadido a &#123;Sección&#125;</em>. El mensaje menciona la
                  cantidad y la sección — confirma <em>qué</em> se guardó sin necesidad de que el
                  usuario compruebe.
                </p>
                <p>
                  <strong class="text-canvas-fg">Sin falso undo.</strong> El botón secundario del
                  toast reza <em>Cerrar</em>, no <em>Deshacer</em> — esta versión no persiste ni
                  borra (demo). Prometer un deshacer que no existe envenena la confianza; mejor un
                  label honesto.
                </p>
                <p>
                  <strong class="text-canvas-fg">Reset del formulario.</strong> Tras guardar, se
                  limpian importe, descripción, ISIN y holdings (vuelven a 1 fila vacía). Se
                  preserva el <em>Tipo</em> — si el usuario acaba de añadir una cuenta de Liquidez,
                  probablemente quiera añadir otra; el siguiente
                  <kbd class="font-mono">A</kbd> encuentra el diálogo ya en Liquidez.
                </p>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class DialogDecisionesPage {
  readonly tipo = signal<string>('liquidez');
  readonly importe = signal<string>('');
  readonly escShortcut: string[] = ['Esc'];
  readonly addShortcut: string[] = ['A'];

  readonly tipoOptions: SelectOption[] = [
    { value: 'liquidez', label: 'Liquidez' },
    { value: 'inversion', label: 'Inversión' },
    { value: 'inmobiliario', label: 'Inmobiliario' },
    { value: 'pension', label: 'Plan de pensiones' },
  ];

  setTipo(v: string | number | null): void {
    this.tipo.set(v !== null ? String(v) : '');
  }
  setImporte(v: string | number | null): void {
    this.importe.set(v !== null ? String(v) : '');
  }

  importeNum(): number {
    const n = parseFloat(this.importe());
    return isNaN(n) ? 0 : n;
  }

  peakLabel(): string {
    const base = 1_280_000;
    return this.formatEuro(base + this.importeNum());
  }

  formatEuro(n: number): string {
    return Math.round(n).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      // No modal state here; case study is a static page.
    }
  }
}
