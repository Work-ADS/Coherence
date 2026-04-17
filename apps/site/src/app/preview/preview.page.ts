import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { PrimitiveCardComponent } from './primitive-card.component';
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
  CheckboxComponent,
  SwitchComponent,
  CardComponent,
  ModalComponent,
  TabsComponent,
  TabComponent,
  TableComponent,
  DrawerComponent,
  SidebarComponent,
  NavItemComponent,
  StatusChipComponent,
  BadgeComponent,
  LoadingOverlayComponent,
  PageHeaderComponent,
  ChartBarComponent,
  ChartLineComponent,
  ChartHeatmapComponent,
  ChartDumbbellComponent,
} from '@coherence/ui';
import type { SelectOption, TableColumn, BarDatum, LineSeries, HeatmapCell, DumbbellDatum } from '@coherence/ui';

@Component({
  selector: 'afi-preview-page',
  standalone: true,
  imports: [
    PrimitiveCardComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    SwitchComponent,
    CardComponent,
    ModalComponent,
    TabsComponent,
    TabComponent,
    TableComponent,
    DrawerComponent,
    SidebarComponent,
    NavItemComponent,
    StatusChipComponent,
    BadgeComponent,
    LoadingOverlayComponent,
    PageHeaderComponent,
    ChartBarComponent,
    ChartLineComponent,
    ChartHeatmapComponent,
    ChartDumbbellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="px-space-10 py-space-10 max-w-[920px] mx-auto">
      <header class="mb-space-10 pb-space-8 border-b border-border-hairline">
        <p class="text-body-sm uppercase tracking-wider text-action-700 mb-space-3">
          Coherence DS
        </p>
        <h1 class="text-subtitle text-canvas-fg mb-space-3">Galería de primitivos</h1>
        <p class="text-body text-neutral-600 max-w-[640px]">
          Vista previa de todos los primitivos enviados hasta la fecha. Cada tarjeta
          muestra un componente con sus variantes principales.
        </p>
      </header>

      <div class="flex flex-col">

        <!-- Button -->
        <afi-primitive-card
          name="Button"
          description="Acción primaria. Cuatro variantes (primary, secondary, ghost, danger) y tres tamaños (sm, md, lg).">
          <div class="flex flex-wrap items-center gap-space-3">
            <afi-button variant="primary">Guardar</afi-button>
            <afi-button variant="secondary">Cancelar</afi-button>
            <afi-button variant="ghost">Descartar</afi-button>
            <afi-button variant="danger">Eliminar</afi-button>
          </div>
          <div class="flex flex-wrap items-center gap-space-3 mt-space-3">
            <afi-button variant="primary" size="sm">Pequeño</afi-button>
            <afi-button variant="primary" size="md">Mediano</afi-button>
            <afi-button variant="primary" size="lg">Grande</afi-button>
            <afi-button variant="primary" [loading]="true">Cargando</afi-button>
          </div>
        </afi-primitive-card>

        <!-- StatusChip -->
        <afi-primitive-card
          name="StatusChip"
          description="Indicador de estado de un recurso. Ocho estados con variante sutil y sólida.">
          <div class="flex flex-wrap items-center gap-space-3">
            <afi-status-chip estado="borrador" />
            <afi-status-chip estado="pendiente" />
            <afi-status-chip estado="aprobada" />
            <afi-status-chip estado="rechazada" />
            <afi-status-chip estado="ejecutada" />
            <afi-status-chip estado="cancelada" />
            <afi-status-chip estado="en-revision" />
            <afi-status-chip estado="archivada" />
          </div>
          <div class="flex flex-wrap items-center gap-space-3 mt-space-3">
            <afi-status-chip estado="aprobada" variant="solid" />
            <afi-status-chip estado="rechazada" variant="solid" />
            <afi-status-chip estado="pendiente" variant="solid" />
            <afi-status-chip estado="ejecutada" variant="solid" size="sm" />
          </div>
        </afi-primitive-card>

        <!-- Badge -->
        <afi-primitive-card
          name="Badge"
          description="Indicador de estado o conteo. Cinco intenciones semánticas, modo punto y tamaño sm.">
          <div class="flex flex-wrap items-center gap-space-3">
            <afi-badge intent="neutral">Borrador</afi-badge>
            <afi-badge intent="info">En revisión</afi-badge>
            <afi-badge intent="success">Importado</afi-badge>
            <afi-badge intent="warning">Pendiente</afi-badge>
            <afi-badge intent="error">Error</afi-badge>
          </div>
          <div class="flex flex-wrap items-center gap-space-3 mt-space-3">
            <afi-badge intent="neutral" size="sm">sm</afi-badge>
            <afi-badge intent="info" size="sm">12</afi-badge>
            <afi-badge intent="success" [dot]="true" ariaLabel="Conectado" />
            <afi-badge intent="warning" [dot]="true" ariaLabel="Advertencia" />
            <afi-badge intent="error" [dot]="true" ariaLabel="Error activo" />
          </div>
        </afi-primitive-card>

        <!-- LoadingOverlay -->
        <afi-primitive-card
          name="LoadingOverlay"
          description="Capa de carga transitoria. Variante quiet-spinner por defecto. Delay de 300 ms para evitar parpadeo.">
          <div class="flex items-start gap-space-4">
            <div class="relative w-[200px] h-[120px] border border-border-hairline rounded-md overflow-hidden">
              <afi-loading-overlay [visible]="overlayDemo()" variant="quiet-spinner" message="Cargando datos…" />
              <div class="p-space-3 text-body-sm text-neutral-500">Contenido bajo overlay</div>
            </div>
            <div class="flex flex-col gap-space-2">
              <afi-button variant="secondary" (clicked)="toggleOverlay()">
                {{ overlayDemo() ? 'Ocultar' : 'Mostrar' }} overlay
              </afi-button>
              <span class="text-body-sm text-neutral-400">Delay: 300 ms</span>
            </div>
          </div>
        </afi-primitive-card>

        <!-- PageHeader -->
        <afi-primitive-card
          name="PageHeader"
          description="Chrome de página. Adapta su altura a los slots poblados. Sticky con scroll-fade.">
          <div class="w-full border border-border-hairline rounded-md overflow-hidden">
            <afi-page-header
              title="Propuestas"
              subtitle="Listado de propuestas del cliente"
              estado="pendiente"
              [sticky]="false"
              density="default">
              <span slot="breadcrumb" class="text-body-sm text-neutral-500">Personas / Cliente</span>
              <afi-button slot="primaryAction" variant="primary" size="sm">Enviar ajuste</afi-button>
            </afi-page-header>
          </div>
        </afi-primitive-card>

        <!-- Input -->
        <afi-primitive-card
          name="Input"
          description="Entrada de formulario. Tipos text, textarea, number, email y password con etiqueta, pista y error integrados.">
          <div class="flex flex-col gap-space-3 w-full max-w-[400px]">
            <afi-input label="Nombre completo" placeholder="Ingrese su nombre" [required]="true" />
            <afi-input label="Correo electrónico" type="email" placeholder="usuario@ejemplo.com" autocomplete="email" />
            <afi-input label="Notas" type="textarea" hint="Máximo 500 caracteres." />
            <afi-input label="Contraseña" type="password" error="La contraseña debe tener al menos 8 caracteres." />
          </div>
        </afi-primitive-card>

        <!-- Select -->
        <afi-primitive-card
          name="Select"
          description="Selección de una opción. Modo nativo con agrupación por optgroup y variante de error.">
          <div class="flex flex-col gap-space-3 w-full max-w-[400px]">
            <afi-select
              label="Proveedor"
              placeholder="Seleccione un proveedor"
              [options]="providerOptions"
              [required]="true" />
            <afi-select
              label="Estado"
              [options]="statusOptions"
              error="Seleccione un estado válido." />
          </div>
        </afi-primitive-card>

        <!-- Checkbox -->
        <afi-primitive-card
          name="Checkbox"
          description="Selección múltiple. Soporta estado indeterminado para filas padre en tablas.">
          <div class="flex flex-col gap-space-2">
            <afi-checkbox label="Aceptar los términos" [required]="true" />
            <afi-checkbox label="Recibir notificaciones" [checked]="true" />
            <afi-checkbox label="Opción deshabilitada" [disabled]="true" />
            <afi-checkbox label="Con error" error="Este campo es obligatorio." />
          </div>
        </afi-primitive-card>

        <!-- Switch -->
        <afi-primitive-card
          name="Switch"
          description="Alternador binario con role=switch. Para cambios de estado inmediatos.">
          <div class="flex flex-col gap-space-3">
            <afi-switch label="Modo oscuro" hint="Cambia la apariencia de la interfaz." />
            <afi-switch label="Notificaciones" [checked]="true" />
            <afi-switch label="Deshabilitado" [disabled]="true" />
          </div>
        </afi-primitive-card>

        <!-- Card -->
        <afi-primitive-card
          name="Card"
          description="Contenedor de agrupación. Tres variantes (default, elevated, quiet) con slots para header, body y footer.">
          <div class="flex gap-space-4 w-full">
            <afi-card variant="default" class="flex-1">
              <div slot="header"><h3 class="text-body-md font-medium">Default</h3></div>
              Contenido con borde y fondo base.
            </afi-card>
            <afi-card variant="elevated" class="flex-1">
              <div slot="header"><h3 class="text-body-md font-medium">Elevated</h3></div>
              Contenido con sombra elevada.
            </afi-card>
            <afi-card variant="quiet" class="flex-1">
              <div slot="header"><h3 class="text-body-md font-medium">Quiet</h3></div>
              Contenido sobre fondo discreto.
            </afi-card>
          </div>
        </afi-primitive-card>

        <!-- Modal -->
        <afi-primitive-card
          name="Modal"
          description="Diálogo bloqueante con foco atrapado. Usa el elemento nativo dialog.">
          <afi-button variant="primary" (clicked)="modalOpen.set(true)">Abrir modal</afi-button>
          <afi-modal
            [open]="modalOpen()"
            (openChange)="modalOpen.set($event)"
            title="Confirmar acción"
            description="Esta operación no se puede deshacer.">
            <p>Contenido del diálogo de ejemplo.</p>
            <div slot="footer">
              <afi-button variant="secondary" (clicked)="modalOpen.set(false)">Cancelar</afi-button>
              <afi-button variant="danger" (clicked)="modalOpen.set(false)">Eliminar</afi-button>
            </div>
          </afi-modal>
        </afi-primitive-card>

        <!-- Tabs -->
        <afi-primitive-card
          name="Tabs"
          description="Navegación por pestañas con patrón ARIA tablist/tab/tabpanel y navegación por teclado.">
          <div class="w-full">
            <afi-tabs ariaLabel="Secciones de ejemplo">
              <afi-tab label="General">
                <div class="p-space-4">Contenido de la pestaña General.</div>
              </afi-tab>
              <afi-tab label="Detalles" badge="3">
                <div class="p-space-4">Contenido de la pestaña Detalles con insignia.</div>
              </afi-tab>
              <afi-tab label="Historial">
                <div class="p-space-4">Contenido de la pestaña Historial.</div>
              </afi-tab>
              <afi-tab label="Deshabilitada" [disabled]="true">
                <div class="p-space-4">No visible.</div>
              </afi-tab>
            </afi-tabs>
          </div>
        </afi-primitive-card>

        <!-- Table -->
        <afi-primitive-card
          name="Table"
          description="Tabla de datos con ordenación, selección de filas y estados vacío/cargando.">
          <div class="w-full">
            <afi-table
              [columns]="tableColumns"
              [rows]="tableRows"
              [selectable]="true"
              [selected]="tableSelected()"
              (selectedChange)="tableSelected.set($event)"
              density="compact" />
          </div>
        </afi-primitive-card>

        <!-- Drawer -->
        <afi-primitive-card
          name="Drawer"
          description="Panel lateral no bloqueante. Sin overlay, click-fuera cierra, navegación por flechas.">
          <afi-button variant="secondary" (clicked)="drawerOpen.set(true)">Abrir drawer</afi-button>
          <afi-drawer
            [open]="drawerOpen()"
            (openChange)="drawerOpen.set($event)"
            title="Detalle de póliza"
            [position]="{ current: 2, total: 5 }">
            <div class="flex flex-col gap-space-3">
              <p class="text-body-sm text-neutral-600">Nombre: Póliza Hogar</p>
              <p class="text-body-sm text-neutral-600">Estado: Pendiente</p>
              <p class="text-body-sm text-neutral-600">Monto: $850</p>
            </div>
            <div slot="footer" class="flex justify-end gap-space-2 px-space-4 py-space-3 border-t border-border-hairline">
              <afi-button variant="secondary" (clicked)="drawerOpen.set(false)">Cerrar</afi-button>
              <afi-button variant="primary">Guardar</afi-button>
            </div>
          </afi-drawer>
        </afi-primitive-card>

        <!-- Sidebar + NavItem -->
        <afi-primitive-card
          name="Sidebar + NavItem"
          description="Barra de navegación principal. Modo hover-expand por defecto con NavItem, badge y tooltip.">
          <div class="h-[300px] w-full border border-border-hairline rounded-md overflow-hidden flex">
            <afi-sidebar mode="static" ariaLabel="Navegación de ejemplo">
              <span slot="top" class="text-body-md font-medium truncate">Coherence</span>
              <afi-nav-item label="Inicio" [active]="true" [sidebarExpanded]="true">
                <svg slot="icon" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              </afi-nav-item>
              <afi-nav-item label="Importaciones" badge="3" [sidebarExpanded]="true">
                <svg slot="icon" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
              </afi-nav-item>
              <afi-nav-item label="Configuración" [sidebarExpanded]="true">
                <svg slot="icon" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>
              </afi-nav-item>
              <span slot="bottom" class="text-body-sm text-neutral-500 truncate">v0.1.0</span>
            </afi-sidebar>
            <div class="flex-1 flex items-center justify-center text-neutral-400 text-body-sm">
              Área de contenido
            </div>
          </div>
        </afi-primitive-card>

        <!-- Shell -->
        <afi-primitive-card
          name="Shell"
          description="Compositor de layout raíz. Cinco tipos bloqueados: workspace, docs, auth (envío v1); focus, canvas (reservados). Lee route.data.shell y renderiza el tipo correspondiente.">
          <div class="flex flex-col gap-space-6 w-full">
            <!-- Workspace shell preview -->
            <div>
              <h4 class="text-body-sm font-medium text-canvas-fg mb-space-2">workspace</h4>
              <p class="text-body-sm text-neutral-500 mb-space-3">Sidebar + PageHeader + main + rail opcional. Grid de tres columnas.</p>
              <div class="h-[200px] w-full border border-border-hairline rounded-md overflow-hidden">
                <div class="grid h-full" style="grid-template-columns: 180px 1fr 140px;">
                  <div class="bg-surface-quiet border-r border-border-hairline p-space-3 flex flex-col gap-space-1">
                    <span class="text-body-sm font-medium mb-space-2">Nav</span>
                    <span class="text-body-sm text-neutral-500 bg-surface-muted rounded px-space-2 py-space-1">Propuestas</span>
                    <span class="text-body-sm text-neutral-400 px-space-2 py-space-1">Pólizas</span>
                    <span class="text-body-sm text-neutral-400 px-space-2 py-space-1">Clientes</span>
                  </div>
                  <div class="bg-surface-base flex flex-col">
                    <div class="border-b border-border-hairline p-space-3">
                      <span class="text-body-sm font-medium">PageHeader</span>
                    </div>
                    <div class="flex-1 p-space-3 text-body-sm text-neutral-400">Contenido principal</div>
                  </div>
                  <div class="bg-surface-quiet border-l border-border-hairline p-space-3">
                    <span class="text-body-sm text-neutral-400">Rail</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Auth shell preview -->
            <div>
              <h4 class="text-body-sm font-medium text-canvas-fg mb-space-2">auth</h4>
              <p class="text-body-sm text-neutral-500 mb-space-3">Columna centrada, max 400px. Logo + card sobre surface-quiet.</p>
              <div class="h-[200px] w-full border border-border-hairline rounded-md overflow-hidden bg-surface-quiet flex items-center justify-center">
                <div class="flex flex-col items-center gap-space-3">
                  <span class="text-body-sm font-medium text-canvas-fg">AFI</span>
                  <div class="bg-surface-elevated rounded-lg shadow-sm p-space-4 w-[200px]">
                    <span class="text-body-sm text-neutral-400">Formulario de login</span>
                  </div>
                  <span class="text-body-sm text-neutral-400">Aviso legal</span>
                </div>
              </div>
            </div>

            <!-- Docs shell preview -->
            <div>
              <h4 class="text-body-sm font-medium text-canvas-fg mb-space-2">docs</h4>
              <p class="text-body-sm text-neutral-500 mb-space-3">Sidebar estática + main (max 780px) + TOC rail (220px).</p>
              <div class="h-[200px] w-full border border-border-hairline rounded-md overflow-hidden">
                <div class="grid h-full" style="grid-template-columns: 160px 1fr 120px;">
                  <div class="bg-surface-quiet border-r border-border-hairline p-space-3 flex flex-col gap-space-1">
                    <span class="text-body-sm font-medium mb-space-2">Docs</span>
                    <span class="text-body-sm text-neutral-500 bg-surface-muted rounded px-space-2 py-space-1">Fundamentos</span>
                    <span class="text-body-sm text-neutral-400 px-space-2 py-space-1">Producto</span>
                    <span class="text-body-sm text-neutral-400 px-space-2 py-space-1">Recursos</span>
                  </div>
                  <div class="bg-surface-base flex flex-col">
                    <div class="border-b border-border-hairline p-space-3">
                      <span class="text-body-sm font-medium">Título del documento</span>
                    </div>
                    <div class="flex-1 p-space-3 text-body-sm text-neutral-400">Contenido del documento</div>
                  </div>
                  <div class="bg-surface-quiet border-l border-border-hairline p-space-3">
                    <span class="text-body-sm text-neutral-400">TOC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </afi-primitive-card>

        <!-- ============================================================ -->
        <!-- DATA VISUALIZATION PRIMITIVES                                 -->
        <!-- ============================================================ -->

        <header class="mt-space-10 mb-space-8 pb-space-6 border-b border-border-hairline">
          <h2 class="text-section text-canvas-fg">Visualización de datos</h2>
          <p class="text-body text-neutral-600 max-w-[640px] mt-space-2">
            Gráficos SVG dibujados a mano. Color + textura juntos, nunca solo color.
            Cada gráfico incluye tabla de datos alternativa y atajos de teclado.
          </p>
        </header>

        <!-- Bar Chart -->
        <afi-primitive-card
          name="Bar Chart"
          description="Barras verticales u horizontales. Eje Y siempre desde cero. Color + textura aplicados juntos.">
          <div class="w-full">
            <afi-chart-bar
              [data]="barData"
              title="Primas emitidas por ramo"
              subtitle="Miles de euros, 2025"
              longDescription="Gráfico de barras mostrando primas emitidas por ramo de seguro."
              height="280px" />
          </div>
        </afi-primitive-card>

        <!-- Line Chart -->
        <afi-primitive-card
          name="Line Chart"
          description="Series temporales con segmentos rectos. null = hueco. Marcadores opcionales, multi-serie con leyenda.">
          <div class="w-full">
            <afi-chart-line
              [data]="lineData"
              title="Evolución de siniestralidad"
              subtitle="Ratio combinado trimestral"
              [showMarkers]="true"
              longDescription="Gráfico de líneas con la evolución trimestral del ratio combinado."
              height="280px" />
          </div>
        </afi-primitive-card>

        <!-- Heatmap -->
        <afi-primitive-card
          name="Heatmap"
          description="Cuadrícula bidimensional con celdas coloreadas. Escala secuencial o divergente. Etiquetas de celda opcionales.">
          <div class="w-full">
            <afi-chart-heatmap
              [data]="heatmapData"
              title="Concentración de pólizas"
              subtitle="Por región y producto"
              [showCellLabels]="true"
              longDescription="Mapa de calor mostrando concentración de pólizas por región y producto."
              height="280px" />
          </div>
        </afi-primitive-card>

        <!-- Dumbbell Chart -->
        <afi-primitive-card
          name="Dumbbell Chart"
          description="Comparación de dos puntos por categoría. Línea conectora + leyenda A/B.">
          <div class="w-full">
            <afi-chart-dumbbell
              [data]="dumbbellData"
              title="Prima media: presupuesto vs. real"
              subtitle="Por línea de negocio, miles €"
              longDescription="Gráfico dumbbell comparando prima presupuestada con prima real por línea de negocio."
              height="280px" />
          </div>
        </afi-primitive-card>

      </div>
    </main>
  `,
})
export class PreviewPage {
  readonly modalOpen = signal(false);
  readonly drawerOpen = signal(false);
  readonly overlayDemo = signal(false);
  readonly tableSelected = signal<Record<string, unknown>[]>([]);

  protected toggleOverlay(): void {
    this.overlayDemo.update((v) => !v);
  }

  readonly tableColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '60px', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'estado', label: 'Estado' },
    { key: 'monto', label: 'Monto', align: 'end', sortable: true },
  ];

  readonly tableRows: Record<string, unknown>[] = [
    { id: 1, nombre: 'Póliza Auto', estado: 'Activo', monto: '$1,200' },
    { id: 2, nombre: 'Póliza Hogar', estado: 'Pendiente', monto: '$850' },
    { id: 3, nombre: 'Póliza Vida', estado: 'Vencido', monto: '$3,400' },
  ];

  readonly providerOptions: SelectOption[] = [
    { value: 'allianz', label: 'Allianz' },
    { value: 'mapfre', label: 'Mapfre' },
    { value: 'axa', label: 'AXA' },
    { value: 'zurich', label: 'Zurich' },
  ];

  readonly statusOptions: SelectOption[] = [
    { value: 'active', label: 'Activo', group: 'Vigentes' },
    { value: 'pending', label: 'Pendiente', group: 'Vigentes' },
    { value: 'expired', label: 'Vencido', group: 'Históricos' },
    { value: 'cancelled', label: 'Cancelado', group: 'Históricos' },
  ];

  // ---------------------------------------------------------------------------
  // Chart demo data
  // ---------------------------------------------------------------------------

  readonly barData: BarDatum[] = [
    { key: 'Auto', value: 4200 },
    { key: 'Hogar', value: 2800 },
    { key: 'Vida', value: 5100 },
    { key: 'Salud', value: 3600 },
    { key: 'RC', value: 1900 },
  ];

  readonly lineData: LineSeries[] = [
    {
      key: 'Auto',
      points: [
        { x: 1, y: 92 },
        { x: 2, y: 88 },
        { x: 3, y: 95 },
        { x: 4, y: 91 },
        { x: 5, y: 87 },
        { x: 6, y: 83 },
      ],
    },
    {
      key: 'Hogar',
      points: [
        { x: 1, y: 78 },
        { x: 2, y: 82 },
        { x: 3, y: null },
        { x: 4, y: 79 },
        { x: 5, y: 75 },
        { x: 6, y: 71 },
      ],
    },
  ];

  readonly heatmapData: HeatmapCell[] = [
    { x: 'Madrid', y: 'Auto', value: 420 },
    { x: 'Madrid', y: 'Hogar', value: 310 },
    { x: 'Madrid', y: 'Vida', value: 520 },
    { x: 'Barcelona', y: 'Auto', value: 380 },
    { x: 'Barcelona', y: 'Hogar', value: 290 },
    { x: 'Barcelona', y: 'Vida', value: 410 },
    { x: 'Valencia', y: 'Auto', value: 210 },
    { x: 'Valencia', y: 'Hogar', value: 180 },
    { x: 'Valencia', y: 'Vida', value: 260 },
    { x: 'Sevilla', y: 'Auto', value: 160 },
    { x: 'Sevilla', y: 'Hogar', value: 120 },
    { x: 'Sevilla', y: 'Vida', value: 190 },
  ];

  readonly dumbbellData: DumbbellDatum[] = [
    { key: 'Auto', valueA: 3800, valueB: 4200, labelA: 'Presupuesto', labelB: 'Real' },
    { key: 'Hogar', valueA: 2900, valueB: 2800, labelA: 'Presupuesto', labelB: 'Real' },
    { key: 'Vida', valueA: 4800, valueB: 5100, labelA: 'Presupuesto', labelB: 'Real' },
    { key: 'Salud', valueA: 3200, valueB: 3600, labelA: 'Presupuesto', labelB: 'Real' },
  ];
}
