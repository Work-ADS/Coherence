import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  PageHeaderComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  SectionComponent,
  SelectComponent,
  TabItemComponent,
  TabsComponent,
  ToastComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { NotificationStore } from '../../../services/notification.store';
import {
  ProductIdentityBarComponent,
  type IdentityBreadcrumbStep,
} from '../../../components/product-identity-bar';
import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import {
  VersionToggleComponent,
  type VersionOption,
} from '../shared/version-toggle.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type {
  ConyugeStatus,
  GradoDiscapacidad,
  Parentesco,
  TipoActividad,
  TipoCotizacion,
} from '../wealth-planner-2026/store';

type CardKey = 'conyuge' | 'hijos' | 'ascendientes';

/**
 * Situación Actual · Familia.
 *
 * Captures the household composition (cliente · cónyuge · hijos · ascendientes)
 * and writes to the shared `WealthPlannerStore`. The sidebar chip for
 * "Familia" derives its `empty | in-progress | complete` state from that
 * store.
 *
 * Tab 1 — Información básica · two boxed sections: Información general (alias,
 * residencia fiscal, año nacimiento, grado discapacidad) + Situación laboral
 * (tipo de actividad radio).
 *
 * Tab 2 — Miembros de la familia · three collapsible `<afi-section>` cards.
 * Cónyuge defaults expanded with an explicit ¿Tiene cónyuge? Sí/No radio (the
 * empty form ≠ "no spouse" — capture the negative answer too). Hijos /
 * Ascendientes carry count badges and grow via `+ Añadir …` inside the
 * expanded body.
 *
 * Figma references (file 888lN7vbJSc4gLYt7nP3DW):
 *   - Información básica:        `3:8291` … `3:8365`
 *   - Miembros · Pareja:         `3:8057` · expanded `3:8252`
 *   - Miembros · Hijos:          `3:8070` · expanded `3:8094`
 *   - Miembros · Ascendientes:   `3:8161` · expanded `3:8186`
 *
 * PDF: CambiosAfiWealthPlanner20260226.pdf p.1 — "Familia (= Situación familiar)".
 */
@Component({
  selector: 'site-familia-page',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    InputComponent,
    PageHeaderComponent,
    RadioGroupComponent,
    RadioGroupItemComponent,
    SectionComponent,
    SelectComponent,
    TabItemComponent,
    TabsComponent,
    ToastComponent,
    DemoShellComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    ProductIdentityBarComponent,
    VersionToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './familia.page.html',
  styleUrls: ['./familia.page.scss'],
})
export class FamiliaPage {
  readonly store = inject(WealthPlannerStore);
  private readonly notif = inject(NotificationStore);

  /** Identity-bar breadcrumb: Clientes › [cliente name] › (Familia is current). */
  readonly identityBreadcrumb = computed<IdentityBreadcrumbStep[]>(() => [
    { label: 'Clientes', route: '/clientes' },
    {
      label: this.store.cliente().alias || 'Cliente',
      route: '/listado-planificaciones',
    },
  ]);

  // ── Tabs ──────────────────────────────────────────────────────────────
  readonly activeTab = signal<number>(0);

  // ── Version-toggle (v1 only for now; v2/v3 reserved) ──────────────────
  readonly version = signal<string>('v1');
  readonly versions: VersionOption[] = [
    { key: 'v1', label: 'Versión 1' },
    { key: 'v2', label: 'Versión 2' },
    { key: 'v3', label: 'Versión 3' },
  ];
  setVersion(v: string): void {
    this.version.set(v);
  }

  // ── Tab 2 — per-card expansion state ──────────────────────────────────
  // Cónyuge defaults expanded so the user sees the binary "¿Tiene cónyuge?"
  // up front (default-effect: cheapest path is to answer rather than skip).
  readonly expanded = signal<Record<CardKey, boolean>>({
    conyuge: true,
    hijos: false,
    ascendientes: false,
  });

  setExpanded(card: CardKey, value: boolean): void {
    this.expanded.update((s) => ({ ...s, [card]: value }));
  }

  // ── Option lists (Figma-derived) ──────────────────────────────────────
  // Major Spanish cities — searchable select. List intentionally short for the
  // demo; a production list would come from the AEAT residencia-fiscal catalog.
  readonly residenciaFiscalOptions: SelectOption[] = [
    { value: 'madrid', label: 'Madrid' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'sevilla', label: 'Sevilla' },
    { value: 'zaragoza', label: 'Zaragoza' },
    { value: 'malaga', label: 'Málaga' },
    { value: 'murcia', label: 'Murcia' },
    { value: 'palma', label: 'Palma de Mallorca' },
    { value: 'las-palmas', label: 'Las Palmas' },
    { value: 'bilbao', label: 'Bilbao' },
    { value: 'alicante', label: 'Alicante' },
    { value: 'cordoba', label: 'Córdoba' },
    { value: 'valladolid', label: 'Valladolid' },
    { value: 'vigo', label: 'Vigo' },
    { value: 'gijon', label: 'Gijón' },
    { value: 'granada', label: 'Granada' },
    { value: 'a-coruna', label: 'A Coruña' },
    { value: 'vitoria', label: 'Vitoria-Gasteiz' },
    { value: 'pamplona', label: 'Pamplona' },
    { value: 'santander', label: 'Santander' },
  ];

  // Spanish IMSERSO disability scale (TODO confirm options against Figma —
  // see [[GradoDiscapacidad]] doc note in the store).
  readonly gradoDiscapacidadOptions: SelectOption[] = [
    { value: 'sin', label: 'Sin discapacidad reconocida' },
    { value: '33-64', label: 'Entre 33% y 64%' },
    { value: '65-74', label: 'Entre 65% y 74%' },
    { value: '75+', label: '75% o más' },
  ];

  readonly tipoActividadOptions: { value: TipoActividad; label: string }[] = [
    { value: 'activo', label: 'En activo' },
    { value: 'jubilado', label: 'Jubilado' },
    { value: 'inactivo', label: 'Inactivo' },
  ];

  readonly tipoCotizacionOptions: SelectOption[] = [
    { value: 'regimen-general', label: 'Régimen general' },
    { value: 'autonomo', label: 'Autónomo (RETA)' },
    { value: 'agrario', label: 'Agrario' },
    { value: 'mar', label: 'Mar' },
    { value: 'empleadas-hogar', label: 'Empleadas de hogar' },
    { value: 'otro', label: 'Otro' },
  ];

  readonly parentescoOptions: SelectOption[] = [
    { value: 'padre', label: 'Padre' },
    { value: 'madre', label: 'Madre' },
    { value: 'suegro', label: 'Suegro' },
    { value: 'suegra', label: 'Suegra' },
    { value: 'abuelo', label: 'Abuelo' },
    { value: 'abuela', label: 'Abuela' },
    { value: 'otro', label: 'Otro' },
  ];

  // ── Header decorations for Tab 2 cards ────────────────────────────────
  private readonly currentYear = new Date().getFullYear();

  readonly conyugeCount = computed<string | null>(() => {
    const status = this.store.conyugeStatus();
    if (status === 'yes' && this.store.conyuge() !== null) return '1 cónyuge';
    if (status === 'no') return 'Sin cónyuge';
    return null;
  });

  readonly hijosCount = computed<string | null>(() => {
    const n = this.store.hijos().length;
    if (n === 0) return null;
    return n === 1 ? '1 hijo' : `${n} hijos`;
  });

  readonly ascendientesCount = computed<string | null>(() => {
    const n = this.store.ascendientes().length;
    if (n === 0) return null;
    return n === 1 ? '1 ascendiente' : `${n} ascendientes`;
  });

  // Goal-gradient signals — a check next to the section title when the
  // section is "answered". Cónyuge counts as answered once the user picks
  // yes (and fills required) OR no.
  readonly conyugeAnswered = computed<boolean>(() => {
    const s = this.store.conyugeStatus();
    if (s === 'no') return true;
    if (s === 'yes') return this.store.conyugeComplete();
    return false;
  });

  // Sanity hint for año de nacimiento — flags clearly wrong values.
  anoHint(year: number | null): string | null {
    if (year === null) return null;
    if (year < 1900) return 'Año demasiado antiguo · revisa el valor';
    if (year > this.currentYear) return 'Año futuro · revisa el valor';
    return null;
  }

  // ── Per-item delete confirm (loss aversion) ───────────────────────────
  // When the user clicks "borrar" on a row that already has data, we don't
  // destroy it on the first click — we show an inline "¿Borrar?" confirm.
  // Empty rows skip the confirm.
  readonly pendingDelete = signal<Set<string>>(new Set());

  isPendingDelete(id: string): boolean {
    return this.pendingDelete().has(id);
  }

  private setPendingDelete(id: string, pending: boolean): void {
    this.pendingDelete.update((set) => {
      const next = new Set(set);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────
  private toStr(v: string | number | null): string {
    return v === null ? '' : String(v);
  }

  private toYear(v: string | number | null): number | null {
    if (v === null || v === '') return null;
    const n = typeof v === 'number' ? v : parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }

  // ── Cliente field handlers ────────────────────────────────────────────
  // Each setter calls markChanged so the debounced save toast fires for
  // actual edits and stays silent when nothing changes.
  private markCliente(): void {
    this.markChanged(this.store.cliente().alias.trim() || 'Cliente');
  }

  setClienteAlias(v: string | number | null): void {
    this.store.setCliente({ alias: this.toStr(v) });
    this.markCliente();
  }
  setClienteResidenciaFiscal(v: string | number | null): void {
    this.store.setCliente({ residenciaFiscal: this.toStr(v) });
    this.markCliente();
  }
  setClienteAnoNacimiento(v: string | number | null): void {
    this.store.setCliente({ anoNacimiento: this.toYear(v) });
    this.markCliente();
  }
  setClienteGradoDiscapacidad(v: string | number | null): void {
    this.store.setCliente({ gradoDiscapacidad: (this.toStr(v) || null) as GradoDiscapacidad | null });
    this.markCliente();
  }
  setClienteTipoActividad(v: string | null): void {
    this.store.setCliente({ tipoActividad: (v as TipoActividad | null) ?? null });
    this.markCliente();
  }
  setClienteAnoJubilacion(v: string | number | null): void {
    this.store.setCliente({ anoJubilacion: this.toYear(v) });
    this.markCliente();
  }
  setClienteAnosCotizados(v: string | number | null): void {
    this.store.setCliente({ anosCotizados: this.toYear(v) });
    this.markCliente();
  }
  setClienteAnoDejoCotizar(v: string | number | null): void {
    this.store.setCliente({ anoDejoCotizar: this.toYear(v) });
    this.markCliente();
  }
  setClienteTipoCotizacion(v: string | number | null): void {
    this.store.setCliente({ tipoCotizacion: (this.toStr(v) || null) as TipoCotizacion | null });
    this.markCliente();
  }

  // ── Cónyuge handlers ──────────────────────────────────────────────────
  private markConyuge(): void {
    this.markChanged(this.conyugeLabel());
  }

  setConyugeStatus(status: ConyugeStatus | string): void {
    const next = status === 'yes' ? 'yes' : status === 'no' ? 'no' : 'unanswered';
    this.store.setConyugeStatus(next);
    this.markChanged(next === 'no' ? 'Sin cónyuge' : 'Cónyuge');
  }
  setConyugeAlias(v: string | number | null): void {
    this.store.setConyuge({ alias: this.toStr(v) });
    this.markConyuge();
  }
  setConyugeResidenciaFiscal(v: string | number | null): void {
    this.store.setConyuge({ residenciaFiscal: this.toStr(v) });
    this.markConyuge();
  }
  setConyugeAnoNacimiento(v: string | number | null): void {
    this.store.setConyuge({ anoNacimiento: this.toYear(v) });
    this.markConyuge();
  }
  setConyugeGradoDiscapacidad(v: string | number | null): void {
    this.store.setConyuge({ gradoDiscapacidad: (this.toStr(v) || null) as GradoDiscapacidad | null });
    this.markConyuge();
  }
  setConyugeTipoActividad(v: string | null): void {
    this.store.setConyuge({ tipoActividad: (v as TipoActividad | null) ?? null });
    this.markConyuge();
  }
  setConyugeAnoJubilacion(v: string | number | null): void {
    this.store.setConyuge({ anoJubilacion: this.toYear(v) });
    this.markConyuge();
  }
  setConyugeAnosCotizados(v: string | number | null): void {
    this.store.setConyuge({ anosCotizados: this.toYear(v) });
    this.markConyuge();
  }
  setConyugeAnoDejoCotizar(v: string | number | null): void {
    this.store.setConyuge({ anoDejoCotizar: this.toYear(v) });
    this.markConyuge();
  }
  setConyugeTipoCotizacion(v: string | number | null): void {
    this.store.setConyuge({ tipoCotizacion: (this.toStr(v) || null) as TipoCotizacion | null });
    this.markConyuge();
  }

  // ── Hijos handlers ────────────────────────────────────────────────────
  addHijo(): void {
    this.store.addHijo();
    this.setExpanded('hijos', true);
    const newest = this.store.hijos()[this.store.hijos().length - 1];
    if (newest) this.markChanged(this.hijoLabel(newest.id));
  }
  private hijoHasData(id: string): boolean {
    const h = this.store.hijos().find((x) => x.id === id);
    if (!h) return false;
    return (
      h.alias.trim() !== '' ||
      h.anoNacimiento !== null ||
      h.gradoDiscapacidad !== null ||
      !h.delCliente
    );
  }
  requestRemoveHijo(id: string): void {
    if (this.hijoHasData(id)) this.setPendingDelete(id, true);
    else this.store.removeHijo(id);
  }
  confirmRemoveHijo(id: string): void {
    const label = this.hijoLabel(id);
    this.setPendingDelete(id, false);
    this.store.removeHijo(id);
    this.markChanged(`${label} borrado`);
  }
  cancelRemove(id: string): void {
    this.setPendingDelete(id, false);
  }
  setHijoAlias(id: string, v: string | number | null): void {
    this.store.updateHijo(id, { alias: this.toStr(v) });
    this.markChanged(this.hijoLabel(id));
  }
  setHijoAnoNacimiento(id: string, v: string | number | null): void {
    this.store.updateHijo(id, { anoNacimiento: this.toYear(v) });
    this.markChanged(this.hijoLabel(id));
  }
  setHijoGradoDiscapacidad(id: string, v: string | number | null): void {
    this.store.updateHijo(id, {
      gradoDiscapacidad: (this.toStr(v) || null) as GradoDiscapacidad | null,
    });
    this.markChanged(this.hijoLabel(id));
  }
  setHijoDelCliente(id: string, checked: boolean): void {
    this.store.updateHijo(id, { delCliente: checked });
    this.markChanged(this.hijoLabel(id));
  }

  // ── Ascendientes handlers ─────────────────────────────────────────────
  addAscendiente(): void {
    this.store.addAscendiente();
    this.setExpanded('ascendientes', true);
    const newest = this.store.ascendientes()[this.store.ascendientes().length - 1];
    if (newest) this.markChanged(this.ascendienteLabel(newest.id));
  }
  private ascendienteHasData(id: string): boolean {
    const a = this.store.ascendientes().find((x) => x.id === id);
    if (!a) return false;
    return (
      a.alias.trim() !== '' ||
      a.anoNacimiento !== null ||
      a.parentesco !== null ||
      a.gradoDiscapacidad !== null ||
      a.delCliente
    );
  }
  requestRemoveAscendiente(id: string): void {
    if (this.ascendienteHasData(id)) this.setPendingDelete(id, true);
    else this.store.removeAscendiente(id);
  }
  confirmRemoveAscendiente(id: string): void {
    const label = this.ascendienteLabel(id);
    this.setPendingDelete(id, false);
    this.store.removeAscendiente(id);
    this.markChanged(`${label} borrado`);
  }
  setAscendienteAlias(id: string, v: string | number | null): void {
    this.store.updateAscendiente(id, { alias: this.toStr(v) });
    this.markChanged(this.ascendienteLabel(id));
  }
  setAscendienteParentesco(id: string, v: string | number | null): void {
    this.store.updateAscendiente(id, {
      parentesco: (v as Parentesco | null) ?? null,
    });
    this.markChanged(this.ascendienteLabel(id));
  }
  setAscendienteAnoNacimiento(id: string, v: string | number | null): void {
    this.store.updateAscendiente(id, { anoNacimiento: this.toYear(v) });
    this.markChanged(this.ascendienteLabel(id));
  }
  setAscendienteGradoDiscapacidad(id: string, v: string | number | null): void {
    this.store.updateAscendiente(id, {
      gradoDiscapacidad: (this.toStr(v) || null) as GradoDiscapacidad | null,
    });
    this.markChanged(this.ascendienteLabel(id));
  }
  setAscendienteDelCliente(id: string, checked: boolean): void {
    this.store.updateAscendiente(id, { delCliente: checked });
    this.markChanged(this.ascendienteLabel(id));
  }

  // ── Save indicator (toast) ────────────────────────────────────────────
  // Every field already auto-persists into the store on change; the Guardar
  // button is a UX reassurance — it surfaces a transient toast so the gestor
  // sees that the latest edits are captured before walking away.
  readonly toastMessage = signal<string>('');
  readonly toastVisible = signal<boolean>(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Constructor placed AFTER toast field initializers so the consume +
    // showInfo path can safely call this.toastMessage / this.toastVisible.
    // Picks up any cross-route notice queued by the caller (e.g. listado's
    // Nueva planificación → "Información del cliente prerellenada").
    const pending = this.notif.consume();
    if (pending !== null) {
      this.showInfo(pending);
    }
  }

  private showSaved(label: string): void {
    this.toastMessage.set(`Cambios guardados · ${label}`);
    this.toastVisible.set(true);
    if (this.toastTimer !== null) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastVisible.set(false);
    }, 2500);
  }

  /**
   * One-shot informational toast (e.g. cross-route notices). Longer dwell
   * than showSaved because it conveys context the gestor likely hasn't seen
   * before, not a routine save acknowledgment.
   */
  private showInfo(message: string): void {
    this.toastMessage.set(message);
    this.toastVisible.set(true);
    if (this.toastTimer !== null) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastVisible.set(false);
    }, 5000);
  }

  dismissToast(): void {
    this.toastVisible.set(false);
    if (this.toastTimer !== null) clearTimeout(this.toastTimer);
  }

  // ── Change-driven save toast ──────────────────────────────────────────
  // The toast is a continuous-feedback signal: every actual change to a
  // familia field (cliente, cónyuge, hijo, ascendiente) marks the page
  // dirty and, after a short debounce, surfaces a "Cambios guardados ·
  // <who>" toast. If nothing changes, the toast never fires — there's no
  // setter call to register it. This replaces the older focusout-on-row
  // pattern, which fired even when the user just tabbed through without
  // touching anything.
  private markChangedTimer: ReturnType<typeof setTimeout> | null = null;
  private lastChangedLabel = '';

  private markChanged(label: string): void {
    this.lastChangedLabel = label;
    if (this.markChangedTimer !== null) clearTimeout(this.markChangedTimer);
    this.markChangedTimer = setTimeout(() => {
      this.showSaved(this.lastChangedLabel);
      this.markChangedTimer = null;
    }, 800);
  }

  private hijoLabel(id: string): string {
    const idx = this.store.hijos().findIndex((x) => x.id === id);
    const h = idx >= 0 ? this.store.hijos()[idx] : null;
    return h?.alias.trim() || `Hijo ${idx + 1}`;
  }

  private ascendienteLabel(id: string): string {
    const idx = this.store.ascendientes().findIndex((x) => x.id === id);
    const a = idx >= 0 ? this.store.ascendientes()[idx] : null;
    return a?.alias.trim() || `Ascendiente ${idx + 1}`;
  }

  private conyugeLabel(): string {
    return this.store.conyuge()?.alias.trim() || 'Cónyuge';
  }
}
