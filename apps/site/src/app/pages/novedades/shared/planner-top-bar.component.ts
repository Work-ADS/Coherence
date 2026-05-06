import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { DrawerComponent } from '@coherence/ui';

import { ActionToastComponent } from './action-toast.component';

type PlanState = 'borrador' | 'cumplimentada' | 'descargada' | 'entregada';

/**
 * Top bar for the Wealth Planner proposal pages.
 *
 * White canvas background (matches the main column), three editable
 * affordances on the left — plan picker, inline rename, state picker — and
 * a lucide-based icon action set on the right.
 */
@Component({
  selector: 'site-planner-top-bar',
  standalone: true,
  imports: [RouterLink, ActionToastComponent, DrawerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    /* Tooltip — same pattern as afi-nav-item's collapsed-mode tooltip: dark pill,
       absolute under the trigger, fades in on hover/focus, unclickable. */
    .tt-pop {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 6px;
      padding: 4px 8px;
      font-size: 11px;
      line-height: 16px;
      color: #ffffff;
      background: #0f172a;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 120ms ease-out;
      z-index: 60;
    }
    .group\\/tt:hover .tt-pop,
    .group\\/tt:focus-within .tt-pop {
      opacity: 1;
    }
  `,
  template: `
    <div
      class="flex items-center justify-between border-b border-border-hairline px-space-4 h-10 bg-canvas-base shrink-0"
    >
      <!-- Left cluster: plan switcher · ID · rename · state -->
      <div class="flex items-center gap-space-3 text-body-sm text-canvas-fg">
        <!-- Combined nav button (chevron-left + list) — opens planifications dropdown -->
        <div class="relative">
          <span class="relative inline-flex group/tt">
            <button
              type="button"
              (click)="plansOpen.set(!plansOpen())"
              class="inline-flex items-center gap-[3px] h-7 px-space-2 rounded hover:bg-surface-muted text-neutral-600 hover:text-canvas-fg transition-colors"
              aria-haspopup="menu"
              [attr.aria-expanded]="plansOpen()"
              aria-label="Cambiar planificación"
            >
              <!-- lucide: chevron-left -->
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <!-- lucide: list -->
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12h.01" />
                <path d="M3 18h.01" />
                <path d="M3 6h.01" />
                <path d="M8 12h13" />
                <path d="M8 18h13" />
                <path d="M8 6h13" />
              </svg>
            </button>
            @if (!plansOpen()) {
              <span role="tooltip" class="tt-pop">Cambiar planificación</span>
            }
          </span>
          @if (plansOpen()) {
            <div class="fixed inset-0 z-40" (click)="plansOpen.set(false)" aria-hidden="true"></div>
            <div
              role="menu"
              class="absolute left-0 top-full mt-1 z-50 min-w-[260px] p-space-2 bg-canvas-base border border-border-hairline rounded-md shadow-lg"
            >
              <!-- Back to listado -->
              <a
                [routerLink]="listadoRoute()"
                role="menuitem"
                (click)="plansOpen.set(false)"
                class="w-full flex items-center gap-space-2 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
              >
                <!-- lucide: arrow-left -->
                <svg
                  class="w-4 h-4 text-neutral-500 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                <span class="font-medium">Ir al listado</span>
              </a>
              <div class="h-px bg-border-hairline my-space-1 -mx-space-2"></div>
              <p
                class="px-space-2 pt-space-1 pb-space-2 text-caption uppercase tracking-wider text-neutral-500"
              >
                Planificaciones
              </p>
              @for (p of plans; track p.id) {
                <button
                  type="button"
                  role="menuitem"
                  (click)="selectPlan(p.id)"
                  class="w-full flex items-center justify-between gap-space-3 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted text-body-sm text-canvas-fg"
                >
                  <span class="flex flex-col">
                    <span class="font-medium">{{ p.name }}</span>
                    <span class="text-caption text-neutral-500 font-mono">{{ p.id }}</span>
                  </span>
                  @if (p.id === simId()) {
                    <svg
                      class="w-4 h-4 text-action shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                </button>
              }
            </div>
          }
        </div>

        <!-- Client + ID — display or edit. The simId + pencil sit in their own
             tight sub-flex so the pencil reads as the verb on the noun next to
             it, not as a sibling control floating in the parent gap. -->
        @if (!renaming()) {
          <span class="text-neutral-500">{{ clientName() }} planificación:</span>
          <span class="inline-flex items-center gap-space-1">
            <span class="font-medium text-canvas-fg">{{ simId() }}</span>
            <span class="relative inline-flex group/tt">
              <button
                type="button"
                (click)="startRename()"
                class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-muted text-neutral-600 hover:text-canvas-fg transition-colors"
                aria-label="Renombrar planificación"
              >
                <!-- lucide: pencil -->
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
              <span role="tooltip" class="tt-pop">Renombrar planificación</span>
            </span>
          </span>
        } @else {
          <span class="text-neutral-500">{{ clientName() }} planificación:</span>
          <span class="inline-flex items-center gap-space-1">
            <input
              #renameInput
              type="text"
              class="h-6 w-[170px] px-space-2 text-body-sm font-medium rounded border border-border-focus bg-canvas-base text-canvas-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              [value]="simIdDraft()"
              (input)="simIdDraft.set(inputValue($event))"
              (keydown.enter)="commitRename()"
              (keydown.escape)="cancelRename()"
              aria-label="Nuevo identificador"
            />
            <span class="relative inline-flex group/tt">
              <button
                type="button"
                (click)="commitRename()"
                class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-muted text-system-success transition-colors"
                aria-label="Guardar nombre"
              >
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <span role="tooltip" class="tt-pop">Guardar (Enter)</span>
            </span>
            <span class="relative inline-flex group/tt">
              <button
                type="button"
                (click)="cancelRename()"
                class="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-surface-muted text-neutral-600 hover:text-canvas-fg transition-colors"
                aria-label="Cancelar"
              >
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
              <span role="tooltip" class="tt-pop">Cancelar (Esc)</span>
            </span>
          </span>
        }

        <!-- State chip (dropdown trigger) -->
        <div class="relative">
          <span class="relative inline-flex group/tt">
            <button
              type="button"
              (click)="stateOpen.set(!stateOpen())"
              class="inline-flex items-center gap-[4px] h-5 px-space-2 rounded-full text-body-sm font-medium transition-colors"
              [style]="stateStyleFor(currentState())"
              aria-haspopup="menu"
              [attr.aria-expanded]="stateOpen()"
              [attr.aria-label]="'Cambiar estado — actual: ' + stateLabelFor(currentState())"
            >
              <span>{{ stateLabelFor(currentState()) }}</span>
              <svg
                class="w-3 h-3 opacity-70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            @if (!stateOpen()) {
              <span role="tooltip" class="tt-pop">Cambiar estado</span>
            }
          </span>
          @if (stateOpen()) {
            <div class="fixed inset-0 z-40" (click)="stateOpen.set(false)" aria-hidden="true"></div>
            <div
              role="menu"
              class="absolute left-0 top-full mt-1 z-50 min-w-[220px] p-space-2 bg-canvas-base border border-border-hairline rounded-md shadow-lg"
            >
              <p
                class="px-space-2 pt-space-1 pb-space-2 text-caption uppercase tracking-wider text-neutral-500"
              >
                Estado
              </p>
              @for (s of states; track s.value) {
                <button
                  type="button"
                  role="menuitem"
                  (click)="setState(s.value)"
                  class="w-full flex items-center justify-between gap-space-3 text-left px-space-2 py-space-2 rounded hover:bg-surface-muted"
                >
                  <span
                    class="inline-flex items-center h-5 px-space-2 rounded-full text-body-sm font-medium"
                    [style]="stateStyleFor(s.value)"
                  >
                    {{ s.label }}
                  </span>
                  @if (s.value === currentState()) {
                    <svg
                      class="w-4 h-4 text-action shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  }
                </button>
              }
            </div>
          }
        </div>
      </div>

      <!-- Right cluster: Notes + configuration. Decisions link is intentionally
           removed from the product chrome; it belongs to the review harness. -->
      <div class="flex items-center gap-[2px]">
        <span class="relative inline-flex group/tt">
          <button
            type="button"
            (click)="notesOpen.set(true)"
            class="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-surface-muted text-neutral-600 hover:text-canvas-fg transition-colors"
            aria-label="Notas"
          >
            <!-- lucide: sticky-note -->
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
              <path d="M15 3v5h5" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
          </button>
          <span role="tooltip" class="tt-pop">Notas</span>
        </span>
        <span class="relative inline-flex group/tt">
          <button
            type="button"
            (click)="configOpen.set(true)"
            class="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-surface-muted text-neutral-600 hover:text-canvas-fg transition-colors"
            aria-label="Ajustes de la simulación"
          >
            <!-- lucide: settings -->
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <span role="tooltip" class="tt-pop">Ajustes de la simulación</span>
        </span>
      </div>
    </div>

    <!-- Notes drawer — client/session notes, separate from the review decisions page. -->
    <afi-drawer size="md" title="Notas" [open]="notesOpen()" (openChange)="notesOpen.set($event)">
      <div class="flex flex-col gap-space-4">
        <p class="text-body-sm text-neutral-600">
          Notas internas de la planificación. Se mantienen junto a la simulación y no cambian los
          cálculos.
        </p>
        <textarea
          class="min-h-[180px] w-full rounded-md border border-border-hairline bg-canvas-base p-space-3 text-body-sm text-canvas-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          placeholder="Añade una nota para esta planificación..."
          [value]="notes()"
          (input)="notes.set(inputValue($event))"
          aria-label="Notas de la planificación"
        ></textarea>
      </div>
    </afi-drawer>

    <!-- Configuración drawer — non-blocking right panel for global simulation
         settings. Stub content for now: moneda, redondeo, perfil de riesgo,
         supuestos de inflación. Final content lands when product specs it. -->
    <afi-drawer
      size="md"
      title="Ajustes de la simulación"
      [open]="configOpen()"
      (openChange)="configOpen.set($event)"
    >
      <div class="flex flex-col gap-space-5">
        <p class="text-body-sm text-neutral-600">
          Ajustes globales que se aplican a toda la simulación. Los cambios se recalculan
          automáticamente y se reflejan en todas las pestañas.
        </p>
        <section class="flex flex-col gap-space-2">
          <p class="text-caption uppercase tracking-wider text-neutral-500">Moneda y redondeo</p>
          <div
            class="flex items-center justify-between gap-space-3 py-space-2 border-b border-border-hairline"
          >
            <span class="text-body-sm text-canvas-fg">Moneda principal</span>
            <span class="text-body-sm text-neutral-600">EUR (€)</span>
          </div>
          <div
            class="flex items-center justify-between gap-space-3 py-space-2 border-b border-border-hairline"
          >
            <span class="text-body-sm text-canvas-fg">Redondeo</span>
            <span class="text-body-sm text-neutral-600">Miles (k €)</span>
          </div>
        </section>
        <section class="flex flex-col gap-space-2">
          <p class="text-caption uppercase tracking-wider text-neutral-500">Asunciones</p>
          <div
            class="flex items-center justify-between gap-space-3 py-space-2 border-b border-border-hairline"
          >
            <span class="text-body-sm text-canvas-fg">Inflación esperada</span>
            <span class="text-body-sm text-neutral-600">2,1 % anual</span>
          </div>
          <div
            class="flex items-center justify-between gap-space-3 py-space-2 border-b border-border-hairline"
          >
            <span class="text-body-sm text-canvas-fg">Perfil de riesgo</span>
            <span class="text-body-sm text-neutral-600">Moderado</span>
          </div>
          <div
            class="flex items-center justify-between gap-space-3 py-space-2 border-b border-border-hairline"
          >
            <span class="text-body-sm text-canvas-fg">Esperanza de vida</span>
            <span class="text-body-sm text-neutral-600">88 años</span>
          </div>
        </section>
        <p class="text-caption text-neutral-500">
          Los valores son provisionales — el formulario de edición se conecta cuando product defina
          alcance.
        </p>
      </div>
    </afi-drawer>

    <site-action-toast
      [visible]="toastVisible()"
      [message]="toastMessage()"
      (undo)="onToastUndo()"
      (dismissed)="hideToast()"
    />
  `,
})
export class PlannerTopBarComponent {
  readonly decisionesRoute = input.required<string>();
  readonly listadoRoute = input<string>('/novedades');
  readonly clientName = input<string>('Ricard Vazquez Fajardo');

  readonly plansOpen = signal(false);
  readonly stateOpen = signal(false);
  readonly renaming = signal(false);
  readonly notesOpen = signal(false);
  readonly configOpen = signal(false);
  readonly notes = signal('');

  readonly simId = signal('SIM-2025-0011');
  readonly simIdDraft = signal('SIM-2025-0011');
  readonly currentState = signal<PlanState>('borrador');

  // Toast state
  readonly toastVisible = signal(false);
  readonly toastMessage = signal<string>('');
  private undoAction: (() => void) | null = null;
  private toastTimer?: ReturnType<typeof setTimeout>;

  readonly renameInput = viewChild<ElementRef<HTMLInputElement>>('renameInput');

  readonly plans = [
    { id: 'SIM-2025-0011', name: 'Plan 1 — Familia Torres' },
    { id: 'SIM-2025-0010', name: 'Plan 2 — Escenario conservador' },
    { id: 'SIM-2025-0009', name: 'Plan 3 — Pre-jubilación' },
    { id: 'SIM-2025-0008', name: 'Plan 4 — Legado familiar' },
  ];

  readonly states: { value: PlanState; label: string; bg: string; fg: string }[] = [
    { value: 'borrador', label: 'Borrador', bg: '#EEEEEE', fg: '#525252' },
    { value: 'cumplimentada', label: 'Cumplimentada', bg: '#DFF0FF', fg: '#0066AE' },
    { value: 'descargada', label: 'Descargada', bg: '#EFE6FE', fg: '#6B3BD6' },
    { value: 'entregada', label: 'Entregada al cliente', bg: '#DDF4E6', fg: '#187A47' },
  ];

  stateLabelFor(v: PlanState): string {
    return this.states.find((s) => s.value === v)?.label ?? '';
  }

  stateStyleFor(v: PlanState): string {
    const s = this.states.find((x) => x.value === v);
    if (!s) return '';
    return `background:${s.bg}; color:${s.fg};`;
  }

  selectPlan(id: string): void {
    const previous = this.simId();
    if (id === previous) {
      this.plansOpen.set(false);
      return;
    }
    const picked = this.plans.find((p) => p.id === id);
    this.simId.set(id);
    this.plansOpen.set(false);
    this.showToast(`Planificación cambiada a ${picked?.name ?? id}`, () =>
      this.simId.set(previous),
    );
  }

  setState(v: PlanState): void {
    const previous = this.currentState();
    if (v === previous) {
      this.stateOpen.set(false);
      return;
    }
    this.currentState.set(v);
    this.stateOpen.set(false);
    this.showToast(`Estado cambiado a ${this.stateLabelFor(v)}`, () =>
      this.currentState.set(previous),
    );
  }

  startRename(): void {
    this.simIdDraft.set(this.simId());
    this.renaming.set(true);
    queueMicrotask(() => this.renameInput()?.nativeElement?.focus());
  }

  commitRename(): void {
    const v = this.simIdDraft().trim();
    const previous = this.simId();
    if (v && v !== previous) {
      this.simId.set(v);
      this.showToast(`Nombre actualizado a "${v}"`, () => this.simId.set(previous));
    }
    this.renaming.set(false);
  }

  cancelRename(): void {
    this.renaming.set(false);
  }

  inputValue(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.plansOpen()) this.plansOpen.set(false);
    if (this.stateOpen()) this.stateOpen.set(false);
    if (this.renaming()) this.cancelRename();
  }

  private showToast(message: string, undo: () => void): void {
    this.toastMessage.set(message);
    this.undoAction = undo;
    this.toastVisible.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 5000);
  }

  hideToast(): void {
    this.toastVisible.set(false);
    clearTimeout(this.toastTimer);
    this.undoAction = null;
  }

  onToastUndo(): void {
    this.undoAction?.();
    this.hideToast();
  }
}
