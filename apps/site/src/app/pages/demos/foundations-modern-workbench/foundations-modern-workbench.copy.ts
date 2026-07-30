import type { AfiUiCopy } from '@coherence/ui';

import type { Lang } from '../../../services/language.service';

/**
 * Bilingual copy for the identity v2 workbench.
 *
 * **This file translates the workbench; it does not edit it.** The Spanish
 * values are the page's original wording, verbatim — same length, same detail,
 * same token names and Figma vocabulary. The English is a faithful full-length
 * translation of each one, not a summary. If a note should be shorter or say
 * something different, that is a copy decision to take deliberately, in both
 * languages at once — not a side effect of making the page bilingual.
 *
 * Two things are deliberately NOT translated:
 *
 * 1. **Component names.** "Button", "Select", "Table apron" are the names of the
 *    things themselves — the same word a developer types and a designer reads in
 *    Figma — so they stay English in both languages and live as literal text in
 *    the template, not as keys here. (The side index is built from the rendered
 *    group titles, so this also keeps it stable across a language switch.)
 *
 * 2. **Realistic data fixtures** — client names, Spanish provinces, amounts,
 *    order rows. A province select genuinely listing Álava and Barcelona is the
 *    point of the specimen; an "English" version would just be fake data.
 */
export interface WorkbenchCopy {
  // ── Page chrome ──────────────────────────────────────────────────────────
  navLabel: string;
  title: string;
  subtitle: string;

  // ── Shared / reused ──────────────────────────────────────────────────────
  save: string;
  cancel: string;
  confirm: string;
  discard: string;
  clear: string;
  apply: string;
  view: string;
  later: string;
  sign: string;
  edit: string;
  duplicate: string;
  remove: string;
  outcome: string;
  lastClose: string;
  statusLabel: string;
  none: string;

  // ── Button ───────────────────────────────────────────────────────────────
  buttonStatesHint: string;
  buttonSlotsTitle: string;
  btnPrimary: string;
  btnSecondary: string;
  btnGhost: string;
  btnDestructive: string;
  btnAddCompany: string;
  btnNext: string;
  btnSimulateLoading: string;
  btnContinue: string;

  // ── Icon button ──────────────────────────────────────────────────────────
  iconButtonHint: string;
  search: string;
  searchDisabled: string;

  // ── Input ────────────────────────────────────────────────────────────────
  inputHint: string;
  affixesTitle: string;
  fieldName: string;
  fieldNamePlaceholder: string;
  fieldNameHint: string;
  fieldRequiredError: string;
  fieldNotEditable: string;
  fieldReadOnly: string;
  fieldAmount: string;
  fieldAmountHint: string;
  fieldFilter: string;
  fieldFilterPlaceholder: string;
  fieldFilterHint: string;
  fieldEmail: string;
  fieldEmailPlaceholder: string;
  fieldEmailHint: string;

  // ── Menu item ────────────────────────────────────────────────────────────
  menuItemTitle: string;
  menuItemHint: string;
  menuAriaLabel: string;
  menuPinTop: string;
  menuRename: string;
  menuTagDefault: string;

  // ── Select ───────────────────────────────────────────────────────────────
  selectHint: string;
  longListTitle: string;
  fieldCompanyType: string;
  fieldCompanyTypeHint: string;
  selectAnOption: string;
  fieldProvince: string;
  fieldProvinceHint: string;
  companySl: string;
  companySa: string;
  companySlu: string;
  companyCoop: string;
  companyCivil: string;
  companyCb: string;

  // ── Toggle ───────────────────────────────────────────────────────────────
  toggleTitle: string;
  toggleHint: string;
  notifications: string;
  toggleNoLabel: string;

  // ── Segmented control ────────────────────────────────────────────────────
  segmentedTitle: string;
  segmentedHint: string;
  period: string;
  monthly: string;
  annual: string;
  viewLabel: string;
  summary: string;
  activity: string;
  settings: string;
  all: string;
  active: string;
  pending: string;
  archived: string;
  frequency: string;
  daily: string;
  weekly: string;

  // ── Checkbox ─────────────────────────────────────────────────────────────
  checkboxTitle: string;
  checkboxHint: string;
  unchecked: string;
  checked: string;
  indeterminate: string;
  disabled: string;
  checkedDisabled: string;
  indeterminateDisabled: string;
  checkboxNoLabel: string;

  // ── Radio ────────────────────────────────────────────────────────────────
  radioTitle: string;
  radioHint: string;
  riskProfile: string;
  conservative: string;
  moderate: string;
  dynamic: string;
  withDisabledOption: string;
  optionA: string;
  optionB: string;
  optionCDisabled: string;
  disabledGroup: string;
  optionX: string;
  optionY: string;
  horizontal: string;
  yes: string;
  no: string;

  // ── Tag ──────────────────────────────────────────────────────────────────
  tagTitle: string;
  tagHint: string;
  fixedIncome: string;
  imported: string;

  // ── Chip ─────────────────────────────────────────────────────────────────
  chipTitle: string;
  chipLiveTitle: string;
  chipValueTitle: string;
  chipHint: string;
  alternatives: string;
  removeMe: string;
  assetClass: string;
  equities: string;
  currency: string;

  // ── Badge ────────────────────────────────────────────────────────────────
  badgeTitle: string;
  badgeDotTitle: string;
  badgeHint: string;
  draft: string;
  overdue: string;
  inReview: string;

  // ── Tabs ─────────────────────────────────────────────────────────────────
  tabsBarTitle: string;
  tabsIconTitle: string;
  tabsHint: string;
  clientViews: string;
  reportSections: string;
  portfolio: string;
  cashFlow: string;
  documents: string;
  general: string;
  performance: string;
  risk: string;
  tabPanelSummary: string;
  tabPanelPortfolio: string;
  tabPanelCashFlow: string;
  tabPanelDocuments: string;

  // ── Card ─────────────────────────────────────────────────────────────────
  cardTitle: string;
  cardHint: string;
  cardDefaultLabel: string;
  cardHeaderFooterLabel: string;
  cardFooterOnlyLabel: string;
  cardBodyOnlyLabel: string;
  cardHeaderActionLabel: string;
  cardAllLabel: string;
  cardPortfolioHeading: string;
  cardPortfolioSupport: string;
  cardPortfolioBody: string;
  cardTransferHeading: string;
  cardTransferSupport: string;
  cardTransferBody: string;
  cardFooterOnlyBody: string;
  cardBodyOnlyBody: string;
  cardNotificationsSupport: string;
  cardNotificationsBody: string;
  cardDocumentHeading: string;
  cardDocumentSupport: string;
  cardDocumentBody: string;

  // ── Table ────────────────────────────────────────────────────────────────
  tableInteractiveTitle: string;
  tableHint: string;
  tableSelectedCount: string;
  tableLastAction: string;
  tableDensityHint: string;
  tableEmptyTitle: string;
  tableLoadingTitle: string;
  tableAriaLabel: string;
  colClient: string;
  colType: string;
  colPositions: string;
  colValue: string;
  colStatus: string;
  tableEmptyText: string;
  tableEmptyAction: string;
  apronPortfolio: string;
  apronPortfolioPlural: string;
  apronSelectedSuffix: string;

  // ── Table apron ──────────────────────────────────────────────────────────
  apronTitle: string;
  apronHint: string;
  apronSearchPlaceholder: string;
  apronSearchAria: string;
  apronFilterAria: string;
  colOrder: string;
  colTotal: string;
  ordersAria: string;
  ordersEmptyText: string;
  apronOrder: string;
  filterNew: string;
  filterLate: string;
  filterClosed: string;

  // ── Sidebar ──────────────────────────────────────────────────────────────
  sidebarTitle: string;
  sidebarEmptyTitle: string;
  navPlanning: string;
  navRecents: string;
  navEmptyRecents: string;
  navQ3Strategy: string;
  navMarketingPlan: string;

  // ── Dialog ───────────────────────────────────────────────────────────────
  sizesTitle: string;
  dialogHint: string;
  dialogTitle: string;
  dialogDescription: string;
  dialogBody: string;
  deleteTitle: string;
  deleteClient: string;
  deleteDescription: string;
  deleteBodyBefore: string;
  deleteBodyAfter: string;
  deleted: string;
  cancelled: string;

  // ── Drawer ───────────────────────────────────────────────────────────────
  drawerHint: string;
  drawerTitle: string;
  drawerDescription: string;
  drawerBody: string;
  filterPanelTitle: string;
  openFilters: string;
  filtersHeading: string;
  filtersDescription: string;
  categoryLabel: string;
  dateRangeLabel: string;
  filtersApplied: string;
  filterIncome: string;
  filterExpense: string;
  filterTransfer: string;
  filterAdjustment: string;
  filter7Days: string;
  filter30Days: string;
  filterLastQuarter: string;
  filterCustom: string;

  // ── Toast ────────────────────────────────────────────────────────────────
  toastTitle: string;
  toastHint: string;
  toastWithUndo: string;
  toastWithShortcut: string;
  toastMessageOnly: string;
  toastReportReady: string;
  toastStatusChanged: string;

  // ── Navbar ───────────────────────────────────────────────────────────────
  navbarProductTitle: string;
  navbarProductHint: string;
  navbarSiteTitle: string;
  navbarSiteHint: string;
  bpWide: string;
  bpMedium: string;
  bpNarrow: string;
  siteNavAria: string;
  languageLabel: string;
  navDesignAtAfi: string;
  navLab: string;
  navDemos: string;

  // ── Bar chart ────────────────────────────────────────────────────────────
  /** Asset classes the breakdown needs beyond the ones Tag and Chip already name. */
  realEstate: string;
  cash: string;
  chartGroupTitle: string;
  chartPatrimonioTitle: string;
  chartPatrimonioSubtitle: string;
  chartPatrimonioLongDesc: string;
  chartPatrimonioStats: string;
  chartPatrimonioStructure: string;
  chartPatrimonioAverage: string;
  chartPatrimonioHint: string;
  chartBreakdownTitle: string;
  chartBreakdownSubtitle: string;
  chartBreakdownLongDesc: string;
  chartBreakdownStats: string;
  chartBreakdownStructure: string;
  chartBreakdownHint: string;
}

const ES: WorkbenchCopy = {
  navLabel: 'Índice de componentes',
  title: 'Identidad v2 — workbench',
  subtitle:
    'Primitivas foundations-modern · IBM Plex Sans · tokens scoped [data-foundation="modern"]',

  save: 'Guardar',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  discard: 'Descartar',
  clear: 'Limpiar',
  apply: 'Aplicar',
  view: 'Ver',
  later: 'Más tarde',
  sign: 'Firmar',
  edit: 'Editar',
  duplicate: 'Duplicar',
  remove: 'Eliminar',
  outcome: 'Resultado',
  lastClose: 'Último cierre',
  statusLabel: 'Estado',
  none: '—',

  buttonStatesHint:
    'Interactúe para ver el resto de estados: pase el cursor (hover), mantenga pulsado (pressed) y navegue con Tab (focus).',
  buttonSlotsTitle: 'Slots de icono · ancho completo · carga interactiva',
  btnPrimary: 'Guardar',
  btnSecondary: 'Cancelar',
  btnGhost: 'Ver detalle',
  btnDestructive: 'Eliminar',
  btnAddCompany: 'Añadir sociedad',
  btnNext: 'Siguiente',
  btnSimulateLoading: 'Simular carga',
  btnContinue: 'Continuar',

  iconButtonHint:
    'Botón cuadrado, solo icono. Pase el cursor (hover), mantenga pulsado (pressed) y navegue con Tab (focus) para ver el resto de estados. SM usa icono de 16; MD y LG, 20.',
  search: 'Buscar',
  searchDisabled: 'Buscar (deshabilitado)',

  inputHint:
    'Interactúe para ver el resto de estados: pase el cursor (hover) y navegue con Tab (focus).',
  affixesTitle: 'Adornos · prefijo, sufijo e iconos',
  fieldName: 'Nombre',
  fieldNamePlaceholder: 'Escriba su nombre',
  fieldNameHint: 'Tal como aparece en su DNI.',
  fieldRequiredError: 'Este campo es obligatorio.',
  fieldNotEditable: 'No editable en este contexto.',
  fieldReadOnly: 'Solo lectura.',
  fieldAmount: 'Importe',
  fieldAmountHint: 'Importe en euros.',
  fieldFilter: 'Filtrar',
  fieldFilterPlaceholder: 'Nombre o NIF',
  fieldFilterHint:
    'Filtra las filas de la tabla. No hay lista desplegable: el resultado se aplica sobre lo que ya está en pantalla.',
  fieldEmail: 'Correo electrónico',
  fieldEmailPlaceholder: 'nombre@dominio.com',
  fieldEmailHint: 'Le enviaremos la confirmación aquí.',

  menuItemTitle: '6 estados · en el panel afi-menu-v2 con separador',
  menuItemHint:
    'Interactúe para ver hover y foco: pase el cursor y navegue con Tab. La fila destructiva tiñe con la superficie de peligro; la seleccionada muestra la marca de verificación.',
  menuAriaLabel: 'Acciones del documento',
  menuPinTop: 'Fijar arriba',
  menuRename: 'Renombrar',
  menuTagDefault: 'por defecto · icono',

  selectHint:
    'Estados: por defecto (marcador) · con valor · error · deshabilitado. Abra con clic o con Enter / Flecha abajo; navegue con las flechas, escriba para buscar, Intro para elegir, Esc para cerrar. El desplegable reutiliza afi-menu-v2 (role="listbox") con filas afi-menu-item-v2 (role="option").',
  longListTitle: 'Lista larga · se desplaza pasadas 8 opciones',
  fieldCompanyType: 'Tipo de sociedad',
  fieldCompanyTypeHint: 'Elija la forma jurídica.',
  selectAnOption: 'Seleccione una opción.',
  fieldProvince: 'Provincia',
  fieldProvinceHint: 'Más de 8 opciones: el panel limita a 8 filas y se desplaza.',
  companySl: 'Sociedad limitada',
  companySa: 'Sociedad anónima',
  companySlu: 'Sociedad limitada unipersonal',
  companyCoop: 'Sociedad cooperativa',
  companyCivil: 'Sociedad civil',
  companyCb: 'Comunidad de bienes',

  toggleTitle: '2 valores × 4 estados · tamaño fijo',
  toggleHint:
    'Aplica al instante (sin Guardar). La etiqueta va a la izquierda del control (convención de fila de ajustes). El pulgar se desliza 150 ms; en Deshabilitado la sombra del pulgar se aplana. Actívelo con clic, Intro o Espacio.',
  notifications: 'Notificaciones',
  toggleNoLabel: 'Activar sin etiqueta',

  segmentedTitle: '2–4 segmentos · una opción siempre activa · tamaño fijo',
  segmentedHint:
    'Cambia un modo o ajuste de la vista actual; la navegación entre vistas son las pestañas. La píldora se desliza al segmento activo (200 ms) y se detiene al instante con «reduced motion». Muévase con las flechas, Inicio y Fin; los segmentos deshabilitados se omiten.',
  period: 'Periodo',
  monthly: 'Mensual',
  annual: 'Anual',
  viewLabel: 'Vista',
  summary: 'Resumen',
  activity: 'Actividad',
  settings: 'Ajustes',
  all: 'Todos',
  active: 'Activo',
  pending: 'Pendiente',
  archived: 'Archivado',
  frequency: 'Frecuencia',
  daily: 'Diario',
  weekly: 'Semanal',

  checkboxTitle: '3 valores × 4 estados · tamaño fijo',
  checkboxHint:
    'Control de formulario: el valor se recoge al Guardar, no se aplica al instante. La etiqueta va a la derecha del control. Estados Hover y Focus en vivo (Tab para el aro de foco). Indeterminado es un tercer estado que gobierna el padre —el clic solo pasa a Marcado—. Actívelo con clic o Espacio.',
  unchecked: 'Sin marcar',
  checked: 'Marcado',
  indeterminate: 'Indeterminado',
  disabled: 'Deshabilitado',
  checkedDisabled: 'Marcado · deshab.',
  indeterminateDisabled: 'Indet. · deshab.',
  checkboxNoLabel: 'Marcar sin etiqueta',

  radioTitle: 'Selección única · 2 valores × 5 estados · tamaño fijo',
  radioHint:
    'Control de formulario de selección única: el valor se recoge al Guardar, no se aplica al instante. La etiqueta va a la derecha del aro y el punto interior entra con un muelle al seleccionar. Tab entra en el grupo por la opción marcada; las flechas mueven foco y selección entre opciones habilitadas (con vuelta al principio) y Espacio selecciona. Las opciones deshabilitadas no reciben foco.',
  riskProfile: 'Perfil de riesgo',
  conservative: 'Conservador',
  moderate: 'Moderado',
  dynamic: 'Dinámico',
  withDisabledOption: 'Con opción deshabilitada',
  optionA: 'Opción A',
  optionB: 'Opción B',
  optionCDisabled: 'Opción C (deshab.)',
  disabledGroup: 'Grupo deshabilitado',
  optionX: 'Opción X',
  optionY: 'Opción Y',
  horizontal: 'En horizontal',
  yes: 'Sí',
  no: 'No',

  tagTitle: '2 tipos × icono no/sí · tamaño fijo',
  tagHint:
    'Metadatos pasivos: clasifican; no seleccionan ni accionan. «Category» (relleno neutro, texto primario) para clases de activo —Renta fija, Alternativos—; «System» (borde discontinuo, texto secundario) para el origen en la plataforma —Beta, Importado—. Sin estados de interacción: ni hover, ni foco, ni deshabilitado. El icono es decorativo. Para selección use Chip; para estado use Badge.',
  fixedIncome: 'Renta fija',
  imported: 'Importado',

  chipTitle: '2 selecciones × icono no/sí · quitable · tamaño fijo',
  chipLiveTitle: 'Estado en vivo · clic o Espacio para alternar · Tab para el aro de foco',
  chipValueTitle: 'Con valor aplicado · «×» borra el valor y vuelve al chip vacío',
  chipHint:
    'Control interactivo de filtro/selección. El cuerpo alterna Seleccionado (aria-pressed); la «×» es una acción aparte que descarta el chip (removed). Con un valor aplicado y el chip seleccionado aparece el segmento de valor —separador, valor en content/tertiary y una «×» que borra el valor (cleared) y deja de nuevo el chip vacío—. Hover, foco y pulsado son estados CSS en vivo —pase el ratón o use Tab—. El icono va en content/secondary; deshabilitado sale del orden de tabulación. Para metadatos pasivos use Tag; para estado, Badge.',
  alternatives: 'Alternativos',
  removeMe: 'Quítame',
  assetClass: 'Clase',
  equities: 'Renta variable',
  currency: 'Divisa',

  badgeTitle: '5 tonos · sin punto · tamaño fijo',
  badgeDotTitle: '5 tonos · con punto de estado',
  badgeHint:
    'Estado no interactivo: comunica la situación de un objeto —Borrador, Activo, Pendiente, Vencido, En revisión—. La etiqueta lleva el significado por sí sola; el punto es una pista visual redundante (aria-hidden), nunca el único indicador. «Critical» usa el rol error/*; solo «Neutral» tiene borde, el resto son rellenos tintados sin borde. Sin estados de interacción. Todas las parejas texto/fondo cumplen WCAG AA 4.5:1 (warning usa warning/900). Para clasificación pasiva use Tag; para selección, Chip.',
  draft: 'Borrador',
  overdue: 'Vencido',
  inReview: 'En revisión',

  tabsBarTitle: 'Barra interactiva · seleccionada / no seleccionada / contador / deshabilitada',
  tabsIconTitle: 'Icono inicial · contador suplementario',
  tabsHint:
    'Navegación entre vistas hermanas del mismo contexto: cada pestaña revela un panel distinto; no cambia un ajuste ni filtra (para eso, Segmented control). Siempre hay exactamente una seleccionada —la primera activa por defecto—. La etiqueta seleccionada sube a content/primary, el subrayado se desliza bajo ella con un pequeño rebote al llegar y el panel entra con un desplazamiento lateral y un desenfoque leve, en el sentido del movimiento (200 ms); hover y foco son estados en vivo (pase el ratón o use Tab). Las flechas ←/→ y Inicio/Fin mueven foco y selección a la vez, saltando las deshabilitadas. El contador es cantidad, no estado; el icono de encabezado es decorativo y nunca sustituye a la etiqueta.',
  clientViews: 'Vistas del cliente',
  reportSections: 'Secciones del informe',
  portfolio: 'Cartera',
  cashFlow: 'Flujo de caja',
  documents: 'Documentos',
  general: 'General',
  performance: 'Rendimiento',
  risk: 'Riesgo',
  tabPanelSummary: 'Patrimonio total, rentabilidad YTD y asignación por clase de activo.',
  tabPanelPortfolio: 'Detalle de posiciones: renta fija, renta variable y alternativos.',
  tabPanelCashFlow: 'Entradas y salidas previstas para los próximos doce meses.',
  tabPanelDocuments: 'Contratos, informes y documentación fiscal del cliente.',

  cardTitle: 'Matriz de estados · Header × Footer × acción',
  cardHint:
    'La tarjeta es una superficie de agrupación, no una interacción: sin role, sin tabindex y sin evento de click en el contenedor. Las acciones viven en los hijos proyectados —el botón de icono del encabezado y los botones del pie— que conservan su propio foco. Header (por defecto activo) y Footer (por defecto inactivo) se controlan con showHeader / showFooter, reflejo de los booleanos de Figma. La acción de encabezado no tiene efecto si el header está oculto. El cuerpo ocupa el ancho que le da el padre y nunca recorta ni desplaza su contenido.',
  cardDefaultLabel: 'Default (header, sin footer)',
  cardHeaderFooterLabel: 'Header + Footer',
  cardFooterOnlyLabel: 'Footer only (sin header)',
  cardBodyOnlyLabel: 'Body only',
  cardHeaderActionLabel: 'Header + acción',
  cardAllLabel: 'Header + Footer + acción',
  cardPortfolioHeading: 'Resumen de cartera',
  cardPortfolioSupport: 'Rendimiento acumulado del trimestre',
  cardPortfolioBody:
    'Contenido libre del cuerpo: texto, KPI, formulario o gráfico. La tarjeta aporta solo la superficie y el ritmo; el contenido gestiona su propio alto.',
  cardTransferHeading: 'Confirmar traspaso',
  cardTransferSupport: 'Revisa los datos antes de continuar',
  cardTransferBody: 'Se moverán 12.500 € del fondo A al fondo B.',
  cardFooterOnlyBody: 'Sin encabezado: el cuerpo abre la tarjeta y el pie la cierra con acciones.',
  cardBodyOnlyBody:
    'Solo cuerpo: contenedor mínimo para envolver contenido a medida (KPI, media, gráfico) sin encabezado ni pie.',
  cardNotificationsSupport: '3 sin leer',
  cardNotificationsBody:
    'La acción del encabezado es un afi-button-v2 proyectado, con foco propio e independiente de la superficie de la tarjeta.',
  cardDocumentHeading: 'Documento pendiente',
  cardDocumentSupport: 'Vence en 2 días',
  cardDocumentBody: 'Firma el contrato para completar el alta.',

  tableInteractiveTitle: 'Interactiva · selección + orden + acciones',
  tableHint:
    'Pase el cursor sobre una fila: la casilla y las acciones aparecen (en reposo están ocultas). La casilla de la cabecera siempre es visible y pasa a indeterminada con selección parcial. Ordene por Cliente, Posiciones o Valor (ciclo ninguno → asc → desc); pase el cursor por una cabecera ordenable para ver la pista de orden. Esta tabla ordena en el consumidor (patrón headless, reacciona a «sortChange»). «Editar» (primaria) es una acción en línea; el menú ⋯ ofrece «Duplicar» y «Eliminar».',
  tableSelectedCount: 'Seleccionadas',
  tableLastAction: 'Última acción',
  tableDensityHint:
    'Las tablas por densidad usan «autoSort»: la propia tabla ordena sus filas al pulsar una cabecera —texto por orden alfabético; numérico y monetario por valor— sin escuchar «sortChange».',
  tableEmptyTitle: 'Estado vacío · con acción',
  tableLoadingTitle: 'Estado de carga · filas atenuadas + spinner',
  tableAriaLabel: 'Carteras de clientes',
  colClient: 'Cliente',
  colType: 'Tipo',
  colPositions: 'Posiciones',
  colValue: 'Valor',
  colStatus: 'Estado',
  tableEmptyText: 'No hay carteras que mostrar',
  tableEmptyAction: 'Añadir cartera',
  apronPortfolio: 'cartera',
  apronPortfolioPlural: 'carteras',
  apronSelectedSuffix: 'seleccionadas',

  apronTitle: 'Buscar + filtrar · recuento en vivo con tokens',
  apronHint:
    'La página filtra; la tabla solo pinta las filas resueltas y reproduce la cascada (blur + desvanecido) en cada cambio de filtro vía revealKey. El apron (recuento en vivo role="status" + tokens de filtro retirables) flota sobre el borde inferior. Filtre por estado, escriba en la búsqueda y retire un token con su ×. Excepción de motion deliberada: la cascada se reproduce en transiciones «calientes»; colapsa a un desvanecido breve con prefers-reduced-motion.',
  apronSearchPlaceholder: 'Buscar por cliente o pedido',
  apronSearchAria: 'Buscar pedidos',
  apronFilterAria: 'Filtrar pedidos por estado',
  colOrder: 'Pedido',
  colTotal: 'Total',
  ordersAria: 'Pedidos',
  ordersEmptyText: 'No hay pedidos que coincidan con la búsqueda',
  apronOrder: 'pedido',
  filterNew: 'Nuevos',
  filterLate: 'Atrasados',
  filterClosed: 'Cerrados',

  sidebarTitle: 'Expandido ↔ colapsado · grupo estático + dinámico · seleccione y contraiga',
  sidebarEmptyTitle: 'Grupo dinámico vacío · estado sin elementos',
  navPlanning: 'Planificación',
  navRecents: 'Recientes',
  navEmptyRecents: 'No hay elementos recientes',
  navQ3Strategy: 'Estrategia Q3',
  navMarketingPlan: 'Plan de marketing',

  sizesTitle: 'Tamaños · plantilla de contenido',
  dialogHint:
    'Base template: cabecera (título + descripción + cerrar), cuerpo proyectado y footer de acciones.',
  dialogTitle: 'Título del diálogo',
  dialogDescription: 'Texto de descripción opcional que aporta contexto adicional.',
  dialogBody:
    'El contenido del cuerpo va aquí. Esta área admite cualquier contenido proyectado a través del slot por defecto, permitiendo composiciones flexibles sin modificar el componente base.',
  deleteTitle: 'Confirmación destructiva · eliminar',
  deleteClient: 'Eliminar cliente',
  deleteDescription:
    'Esta acción no se puede deshacer. Se eliminarán la ficha del cliente y todas sus posiciones asociadas.',
  deleteBodyBefore: '¿Seguro que quieres eliminar a',
  deleteBodyAfter: '? No podrás recuperar sus datos una vez confirmada la eliminación.',
  deleted: 'Eliminado',
  cancelled: 'Cancelado',

  drawerHint:
    'Panel anclado a la derecha, altura completa: cabecera fija (título + descripción + cerrar), cuerpo con scroll independiente y footer de acciones.',
  drawerTitle: 'Título del panel',
  drawerDescription: 'Texto de descripción opcional que aporta contexto adicional.',
  drawerBody:
    'El contenido del cuerpo va aquí. Esta área admite cualquier contenido proyectado a través del slot por defecto y hace scroll de forma independiente cuando supera la altura del viewport, mientras la cabecera y el footer permanecen fijos.',
  filterPanelTitle: 'Panel de filtros · contenido proyectado',
  openFilters: 'Abrir filtros',
  filtersHeading: 'Filtros',
  filtersDescription: 'Ajusta los criterios para acotar los resultados.',
  categoryLabel: 'Categoría',
  dateRangeLabel: 'Rango de fechas',
  filtersApplied: 'Filtros aplicados',
  filterIncome: 'Ingreso',
  filterExpense: 'Gasto',
  filterTransfer: 'Transferencia',
  filterAdjustment: 'Ajuste',
  filter7Days: '7 días',
  filter30Days: '30 días',
  filterLastQuarter: 'Último trimestre',
  filterCustom: 'Personalizado',

  toastTitle: 'Aviso con deshacer · atajo · sin acción',
  toastHint:
    'El componente no gestiona su propio temporizador: la visibilidad y el autocierre son del consumidor.',
  toastWithUndo: 'Con deshacer',
  toastWithShortcut: 'Con atajo',
  toastMessageOnly: 'Solo mensaje',
  toastReportReady: 'Informe generado',
  toastStatusChanged: 'Estado cambiado a Aprobada',

  navbarProductTitle: 'Navbar de producto · Wealth Planner',
  navbarProductHint:
    'Cada marco declara el contenedor `viewport`, así que la barra responde al ancho del marco y no al de la ventana: los tres puntos de ruptura se ven a la vez.',
  navbarSiteTitle: 'Navbar de sitio · design.afi.es',
  navbarSiteHint:
    'La barra del sitio tal y como se compone hoy en `app.component.html`: afi-top-bar en cristal, logo, destinos con navbar-item-v2 y el selector de idioma.',
  bpWide: 'ancho · > 64rem',
  bpMedium: 'intermedio · 48–64rem',
  bpNarrow: 'estrecho · < 48rem',
  siteNavAria: 'Destinos del sitio',
  languageLabel: 'Idioma',
  navDesignAtAfi: 'Diseño en Afi',
  navLab: 'Workbench',
  navDemos: 'Demos',

  // ── Bar chart ────────────────────────────────────────────────────────────
  realEstate: 'Inmobiliario',
  cash: 'Liquidez',
  chartGroupTitle: 'Bar chart',
  chartPatrimonioTitle: 'Patrimonio neto por ejercicio',
  chartPatrimonioSubtitle: 'Variación anual, 2019-2025. Miles de euros.',
  chartPatrimonioLongDesc:
    'Gráfico de barras verticales con la variación del patrimonio neto por ejercicio entre 2019 y 2025. Tres ejercicios cierran por debajo de cero.',
  chartPatrimonioStats:
    '2020 y 2022 son los dos ejercicios en negativo más acusados; 2025 acumula el mayor avance de la serie. La caída de 2020 se recupera en dos ejercicios.',
  chartPatrimonioStructure:
    'Orden cronológico. Las barras bajo cero se pintan en rojo plano y la regla del cero marca el cruce.',
  chartPatrimonioAverage: 'Media del periodo',
  chartPatrimonioHint:
    'La serie cruza el cero, así que la regla del cero se mantiene: es la única referencia que no se puede deducir de una etiqueta directa. Cada barra va etiquetada, por lo que el eje vertical no hace falta.',
  chartBreakdownTitle: 'Composición del patrimonio',
  chartBreakdownSubtitle: 'Por clase de activo, a 30 jun 2025.',
  chartBreakdownLongDesc:
    'Gráfico de barras horizontales con el reparto del patrimonio por clase de activo a 30 de junio de 2025.',
  chartBreakdownStats:
    'Renta variable concentra el mayor peso, por delante de inmobiliario. Liquidez y alternativos quedan por debajo del diez por ciento cada uno.',
  chartBreakdownStructure:
    'Ordenado de mayor a menor peso. Orientación horizontal para que los nombres de cada clase se lean completos.',
  chartBreakdownHint:
    'Horizontal porque las categorías no son una serie temporal y los nombres son largos. Ordenado por valor: el ranking es la pregunta que responde.',
};

const EN: WorkbenchCopy = {
  navLabel: 'Component index',
  title: 'Identity v2 — workbench',
  subtitle:
    'foundations-modern primitives · IBM Plex Sans · tokens scoped [data-foundation="modern"]',

  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  discard: 'Discard',
  clear: 'Clear',
  apply: 'Apply',
  view: 'View',
  later: 'Later',
  sign: 'Sign',
  edit: 'Edit',
  duplicate: 'Duplicate',
  remove: 'Delete',
  outcome: 'Outcome',
  lastClose: 'Last close',
  statusLabel: 'Status',
  none: '—',

  buttonStatesHint:
    'Interact to see the remaining states: move the cursor over it (hover), hold it down (pressed) and navigate with Tab (focus).',
  buttonSlotsTitle: 'Icon slots · full width · interactive loading',
  btnPrimary: 'Save',
  btnSecondary: 'Cancel',
  btnGhost: 'View detail',
  btnDestructive: 'Delete',
  btnAddCompany: 'Add company',
  btnNext: 'Next',
  btnSimulateLoading: 'Simulate loading',
  btnContinue: 'Continue',

  iconButtonHint:
    'A square, icon-only button. Move the cursor over it (hover), hold it down (pressed) and navigate with Tab (focus) to see the remaining states. SM uses a 16 icon; MD and LG, 20.',
  search: 'Search',
  searchDisabled: 'Search (disabled)',

  inputHint:
    'Interact to see the remaining states: move the cursor over it (hover) and navigate with Tab (focus).',
  affixesTitle: 'Affixes · prefix, suffix and icons',
  fieldName: 'Name',
  fieldNamePlaceholder: 'Type your name',
  fieldNameHint: 'As it appears on your ID document.',
  fieldRequiredError: 'This field is required.',
  fieldNotEditable: 'Not editable in this context.',
  fieldReadOnly: 'Read only.',
  fieldAmount: 'Amount',
  fieldAmountHint: 'Amount in euros.',
  fieldFilter: 'Filter',
  fieldFilterPlaceholder: 'Name or tax ID',
  fieldFilterHint:
    'Filters the rows of the table. There is no dropdown list: the result applies to whatever is already on screen.',
  fieldEmail: 'Email',
  fieldEmailPlaceholder: 'name@domain.com',
  fieldEmailHint: 'We will send the confirmation here.',

  menuItemTitle: '6 states · in the afi-menu-v2 panel with a divider',
  menuItemHint:
    'Interact to see hover and focus: move the cursor over it and navigate with Tab. The destructive row tints with the danger surface; the selected one shows the check mark.',
  menuAriaLabel: 'Document actions',
  menuPinTop: 'Pin to top',
  menuRename: 'Rename',
  menuTagDefault: 'default · icon',

  selectHint:
    'States: default (placeholder) · with a value · error · disabled. Open with a click or with Enter / Down arrow; navigate with the arrows, type to search, Enter to choose, Esc to close. The dropdown reuses afi-menu-v2 (role="listbox") with afi-menu-item-v2 rows (role="option").',
  longListTitle: 'Long list · scrolls past 8 options',
  fieldCompanyType: 'Company type',
  fieldCompanyTypeHint: 'Choose the legal form.',
  selectAnOption: 'Select an option.',
  fieldProvince: 'Province',
  fieldProvinceHint: 'More than 8 options: the panel caps at 8 rows and scrolls.',
  companySl: 'Private limited company',
  companySa: 'Public limited company',
  companySlu: 'Sole-shareholder limited company',
  companyCoop: 'Cooperative',
  companyCivil: 'Civil partnership',
  companyCb: 'Joint property entity',

  toggleTitle: '2 values × 4 states · fixed size',
  toggleHint:
    'Applies instantly (no Save). The label goes to the left of the control (settings-row convention). The thumb slides in 150 ms; when Disabled the thumb shadow flattens. Turn it on with a click, Enter or Space.',
  notifications: 'Notifications',
  toggleNoLabel: 'Turn on, no label',

  segmentedTitle: '2–4 segments · one option always active · fixed size',
  segmentedHint:
    'Changes a mode or setting of the current view; navigating between views is what tabs are for. The pill slides to the active segment (200 ms) and stops instantly under "reduced motion". Move with the arrows, Home and End; disabled segments are skipped.',
  period: 'Period',
  monthly: 'Monthly',
  annual: 'Annual',
  viewLabel: 'View',
  summary: 'Summary',
  activity: 'Activity',
  settings: 'Settings',
  all: 'All',
  active: 'Active',
  pending: 'Pending',
  archived: 'Archived',
  frequency: 'Frequency',
  daily: 'Daily',
  weekly: 'Weekly',

  checkboxTitle: '3 values × 4 states · fixed size',
  checkboxHint:
    'A form control: the value is collected on Save, it does not apply instantly. The label goes to the right of the control. Hover and Focus are live states (Tab for the focus ring). Indeterminate is a third state that governs the parent — a click only ever moves to Checked. Turn it on with a click or Space.',
  unchecked: 'Unchecked',
  checked: 'Checked',
  indeterminate: 'Indeterminate',
  disabled: 'Disabled',
  checkedDisabled: 'Checked · disabled',
  indeterminateDisabled: 'Indet. · disabled',
  checkboxNoLabel: 'Tick, no label',

  radioTitle: 'Single choice · 2 values × 5 states · fixed size',
  radioHint:
    'A single-choice form control: the value is collected on Save, it does not apply instantly. The label goes to the right of the ring and the inner dot springs in on selection. Tab enters the group on the checked option; the arrows move focus and selection between enabled options (wrapping around) and Space selects. Disabled options never take focus.',
  riskProfile: 'Risk profile',
  conservative: 'Conservative',
  moderate: 'Moderate',
  dynamic: 'Dynamic',
  withDisabledOption: 'With a disabled option',
  optionA: 'Option A',
  optionB: 'Option B',
  optionCDisabled: 'Option C (disabled)',
  disabledGroup: 'Disabled group',
  optionX: 'Option X',
  optionY: 'Option Y',
  horizontal: 'Horizontal',
  yes: 'Yes',
  no: 'No',

  tagTitle: '2 kinds × without/with icon · fixed size',
  tagHint:
    'Passive metadata: it classifies; it neither selects nor acts. "Category" (neutral fill, primary text) for asset classes — Fixed income, Alternatives; "System" (dashed border, secondary text) for the origin in the platform — Beta, Imported. No interaction states: no hover, no focus, no disabled. The icon is decorative. For selection use Chip; for status use Badge.',
  fixedIncome: 'Fixed income',
  imported: 'Imported',

  chipTitle: '2 selections × without/with icon · removable · fixed size',
  chipLiveTitle: 'Live state · click or Space to toggle · Tab for the focus ring',
  chipValueTitle: 'With an applied value · the "×" clears the value and returns to the empty chip',
  chipHint:
    'An interactive filter/selection control. The body toggles Selected (aria-pressed); the "×" is a separate action that dismisses the chip (removed). With an applied value and the chip selected, the value segment appears — a divider, the value in content/tertiary and a "×" that clears the value (cleared) and leaves the chip empty again. Hover, focus and pressed are live CSS states — use the mouse or Tab. The icon sits in content/secondary; disabled leaves the tab order. For passive metadata use Tag; for status, Badge.',
  alternatives: 'Alternatives',
  removeMe: 'Remove me',
  assetClass: 'Class',
  equities: 'Equities',
  currency: 'Currency',

  badgeTitle: '5 tones · no dot · fixed size',
  badgeDotTitle: '5 tones · with a status dot',
  badgeHint:
    'A non-interactive status: it communicates the situation of an object — Draft, Active, Pending, Overdue, In review. The label carries the meaning on its own; the dot is a redundant visual cue (aria-hidden), never the only indicator. "Critical" uses the error/* role; only "Neutral" has a border, the rest are tinted fills with no border. No interaction states. Every text/background pair meets WCAG AA 4.5:1 (warning uses warning/900). For passive classification use Tag; for selection, Chip.',
  draft: 'Draft',
  overdue: 'Overdue',
  inReview: 'In review',

  tabsBarTitle: 'Interactive bar · selected / unselected / count / disabled',
  tabsIconTitle: 'Leading icon · supplementary count',
  tabsHint:
    'Navigation between sibling views of the same context: each tab reveals a different panel; it does not change a setting or filter (that is what Segmented control is for). There is always exactly one selected — the first enabled one by default. The selected label lifts to content/primary, the underline slides beneath it with a small bounce as it arrives, and the panel enters with a lateral shift and a light blur, in the direction of travel (200 ms); hover and focus are live states (use the mouse or Tab). The ←/→ arrows and Home/End move focus and selection together, skipping the disabled ones. The count is a quantity, not a status; the leading icon is decorative and never replaces the label.',
  clientViews: 'Client views',
  reportSections: 'Report sections',
  portfolio: 'Portfolio',
  cashFlow: 'Cash flow',
  documents: 'Documents',
  general: 'General',
  performance: 'Performance',
  risk: 'Risk',
  tabPanelSummary: 'Total wealth, YTD return and allocation by asset class.',
  tabPanelPortfolio: 'Holdings in detail: fixed income, equities and alternatives.',
  tabPanelCashFlow: 'Money in and out expected over the next twelve months.',
  tabPanelDocuments: 'Contracts, reports and the client tax paperwork.',

  cardTitle: 'State matrix · Header × Footer × action',
  cardHint:
    'The card is a grouping surface, not an interaction: no role, no tabindex and no click event on the container. The actions live in the projected children — the header icon button and the footer buttons — which keep their own focus. Header (on by default) and Footer (off by default) are controlled with showHeader / showFooter, mirroring the Figma booleans. The header action has no effect if the header is hidden. The body takes the width its parent gives it and never clips or scrolls its content.',
  cardDefaultLabel: 'Default (header, no footer)',
  cardHeaderFooterLabel: 'Header + Footer',
  cardFooterOnlyLabel: 'Footer only (no header)',
  cardBodyOnlyLabel: 'Body only',
  cardHeaderActionLabel: 'Header + action',
  cardAllLabel: 'Header + Footer + action',
  cardPortfolioHeading: 'Portfolio summary',
  cardPortfolioSupport: 'Cumulative return for the quarter',
  cardPortfolioBody:
    'Free body content: text, a KPI, a form or a chart. The card provides only the surface and the rhythm; the content manages its own height.',
  cardTransferHeading: 'Confirm transfer',
  cardTransferSupport: 'Check the details before continuing',
  cardTransferBody: '€12,500 will move from fund A to fund B.',
  cardFooterOnlyBody: 'No header: the body opens the card and the footer closes it with actions.',
  cardBodyOnlyBody:
    'Body only: a minimal container to wrap custom content (KPI, media, chart) with no header or footer.',
  cardNotificationsSupport: '3 unread',
  cardNotificationsBody:
    'The header action is a projected afi-button-v2, with its own focus and independent of the card surface.',
  cardDocumentHeading: 'Document pending',
  cardDocumentSupport: 'Due in 2 days',
  cardDocumentBody: 'Sign the contract to complete the sign-up.',

  tableInteractiveTitle: 'Interactive · selection + sorting + actions',
  tableHint:
    'Move the cursor over a row: the checkbox and the actions appear (at rest they are hidden). The header checkbox is always visible and turns indeterminate on a partial selection. Sort by Client, Holdings or Value (cycling none → asc → desc); hover a sortable header to see the sort hint. This table sorts in the consumer (headless pattern, reacting to "sortChange"). "Edit" (primary) is an inline action; the ⋯ menu offers "Duplicate" and "Delete".',
  tableSelectedCount: 'Selected',
  tableLastAction: 'Last action',
  tableDensityHint:
    'The density tables use "autoSort": the table itself sorts its rows when you click a header — text alphabetically; numeric and monetary by value — without listening to "sortChange".',
  tableEmptyTitle: 'Empty state · with an action',
  tableLoadingTitle: 'Loading state · dimmed rows + spinner',
  tableAriaLabel: 'Client portfolios',
  colClient: 'Client',
  colType: 'Type',
  colPositions: 'Holdings',
  colValue: 'Value',
  colStatus: 'Status',
  tableEmptyText: 'No portfolios to show',
  tableEmptyAction: 'Add portfolio',
  apronPortfolio: 'portfolio',
  apronPortfolioPlural: 'portfolios',
  apronSelectedSuffix: 'selected',

  apronTitle: 'Search + filter · live count with tokens',
  apronHint:
    'The page filters; the table only paints the resolved rows and replays the cascade (blur + fade) on every filter change via revealKey. The apron (live count role="status" + removable filter tokens) floats over the bottom edge. Filter by status, type in the search and remove a token with its ×. A deliberate motion exception: the cascade replays on "warm" transitions; it collapses to a brief fade under prefers-reduced-motion.',
  apronSearchPlaceholder: 'Search by client or order',
  apronSearchAria: 'Search orders',
  apronFilterAria: 'Filter orders by status',
  colOrder: 'Order',
  colTotal: 'Total',
  ordersAria: 'Orders',
  ordersEmptyText: 'No orders match the search',
  apronOrder: 'order',
  filterNew: 'New',
  filterLate: 'Late',
  filterClosed: 'Closed',

  sidebarTitle: 'Expanded ↔ collapsed · static + dynamic group · select and collapse',
  sidebarEmptyTitle: 'Empty dynamic group · no-items state',
  navPlanning: 'Planning',
  navRecents: 'Recent',
  navEmptyRecents: 'Nothing recent yet',
  navQ3Strategy: 'Q3 strategy',
  navMarketingPlan: 'Marketing plan',

  sizesTitle: 'Sizes · content template',
  dialogHint:
    'Base template: header (title + description + close), projected body and a footer of actions.',
  dialogTitle: 'Dialog title',
  dialogDescription: 'Optional description text that adds further context.',
  dialogBody:
    'The body content goes here. This area takes any content projected through the default slot, allowing flexible compositions without modifying the base component.',
  deleteTitle: 'Destructive confirmation · delete',
  deleteClient: 'Delete client',
  deleteDescription:
    'This action cannot be undone. The client record and all their associated holdings will be deleted.',
  deleteBodyBefore: 'Are you sure you want to delete',
  deleteBodyAfter: '? You will not be able to recover their data once the deletion is confirmed.',
  deleted: 'Deleted',
  cancelled: 'Cancelled',

  drawerHint:
    'A panel anchored to the right, full height: fixed header (title + description + close), a body that scrolls independently and a footer of actions.',
  drawerTitle: 'Panel title',
  drawerDescription: 'Optional description text that adds further context.',
  drawerBody:
    'The body content goes here. This area takes any content projected through the default slot and scrolls independently when it exceeds the viewport height, while the header and the footer stay fixed.',
  filterPanelTitle: 'Filter panel · projected content',
  openFilters: 'Open filters',
  filtersHeading: 'Filters',
  filtersDescription: 'Adjust the criteria to narrow the results.',
  categoryLabel: 'Category',
  dateRangeLabel: 'Date range',
  filtersApplied: 'Filters applied',
  filterIncome: 'Income',
  filterExpense: 'Expense',
  filterTransfer: 'Transfer',
  filterAdjustment: 'Adjustment',
  filter7Days: '7 days',
  filter30Days: '30 days',
  filterLastQuarter: 'Last quarter',
  filterCustom: 'Custom',

  toastTitle: 'Notice with undo · shortcut · no action',
  toastHint:
    'The component does not manage its own timer: visibility and auto-close belong to the consumer.',
  toastWithUndo: 'With undo',
  toastWithShortcut: 'With a shortcut',
  toastMessageOnly: 'Message only',
  toastReportReady: 'Report created',
  toastStatusChanged: 'Status changed to Approved',

  navbarProductTitle: 'Product navbar · Wealth Planner',
  navbarProductHint:
    'Each frame declares the `viewport` container, so the bar responds to the width of the frame and not that of the window: all three breakpoints are visible at once.',
  navbarSiteTitle: 'Site navbar · design.afi.es',
  navbarSiteHint:
    'The site bar exactly as it is composed today in `app.component.html`: afi-top-bar in glass, the logo, destinations with navbar-item-v2 and the language picker.',
  bpWide: 'wide · > 64rem',
  bpMedium: 'medium · 48–64rem',
  bpNarrow: 'narrow · < 48rem',
  siteNavAria: 'Site destinations',
  languageLabel: 'Language',
  navDesignAtAfi: 'Design at Afi',
  navLab: 'Lab',
  navDemos: 'Demos',

  // ── Bar chart ────────────────────────────────────────────────────────────
  realEstate: 'Real estate',
  cash: 'Cash',
  chartGroupTitle: 'Bar chart',
  chartPatrimonioTitle: 'Net worth by year',
  chartPatrimonioSubtitle: 'Annual change, 2019-2025. Thousands of euros.',
  chartPatrimonioLongDesc:
    'Vertical bar chart of the annual change in net worth between 2019 and 2025. Three years close below zero.',
  chartPatrimonioStats:
    '2020 and 2022 are the two sharpest negative years; 2025 posts the largest gain in the series. The 2020 drop is recovered within two years.',
  chartPatrimonioStructure:
    'Chronological order. Bars below zero are painted flat red and the zero rule marks the crossing.',
  chartPatrimonioAverage: 'Period average',
  chartPatrimonioHint:
    'The series crosses zero, so the zero rule stays: it is the one reference a reader cannot infer from a direct label. Every bar is labelled, so the vertical axis is not needed.',
  chartBreakdownTitle: 'Wealth breakdown',
  chartBreakdownSubtitle: 'By asset class, at 30 Jun 2025.',
  chartBreakdownLongDesc:
    'Horizontal bar chart of how wealth is split across asset classes at 30 June 2025.',
  chartBreakdownStats:
    'Equities carry the largest weight, ahead of real estate. Cash and alternatives each sit below ten per cent.',
  chartBreakdownStructure:
    'Sorted from largest to smallest weight. Horizontal so each class name reads in full.',
  chartBreakdownHint:
    'Horizontal because the categories are not a time series and the names are long. Sorted by value: ranking is the question it answers.',
};

export const WORKBENCH_COPY: Record<Lang, WorkbenchCopy> = { es: ES, en: EN };

/**
 * The chrome strings `libs/ui` primitives render themselves — the × on a chip,
 * "Cargando…", a table's select-all. Provided once through AFI_UI_COPY rather
 * than bound per instance: the workbench has 32 primitive instances that would
 * otherwise need ~50 attributes, and every missed one ships a Spanish
 * aria-label into the English page.
 */
export const WORKBENCH_UI_CHROME: Record<Lang, Partial<AfiUiCopy>> = {
  es: {
    loading: 'Cargando\u2026',
    close: 'Cerrar',
    remove: 'Quitar',
    clear: 'Borrar',
    clearSearch: 'Borrar búsqueda',
    clearSelection: 'Quitar selección',
    selectAllRows: 'Seleccionar todas las filas',
    selectRow: 'Seleccionar fila',
    moreActions: 'Más acciones',
    rowActions: 'Acciones de fila',
    search: 'Buscar',
    help: 'Ayuda',
    notifications: 'Notificaciones',
    openNav: 'Abrir menú de navegación',
    expandSidebar: 'Expandir barra lateral',
    topNav: 'Navegación superior',
    mainNav: 'Navegación principal',
  },
  en: {
    loading: 'Loading\u2026',
    close: 'Close',
    remove: 'Remove',
    clear: 'Clear',
    clearSearch: 'Clear search',
    clearSelection: 'Clear selection',
    selectAllRows: 'Select all rows',
    selectRow: 'Select row',
    moreActions: 'More actions',
    rowActions: 'Row actions',
    search: 'Search',
    help: 'Help',
    notifications: 'Notifications',
    openNav: 'Open navigation menu',
    expandSidebar: 'Expand sidebar',
    topNav: 'Top navigation',
    mainNav: 'Main navigation',
  },
};

