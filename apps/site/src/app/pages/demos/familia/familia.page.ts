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
  SelectComponent,
  SwitchComponent,
  TabItemComponent,
  TabsComponent,
} from '@coherence/ui';
import type { SelectOption } from '@coherence/ui';

import { DemoShellComponent } from '../demo-shell/demo-shell.component';
import { PlannerSidebarComponent } from '../shared/planner-sidebar.component';
import { PlannerTopBarComponent } from '../shared/planner-top-bar.component';
import {
  VersionToggleComponent,
  type VersionOption,
} from '../shared/version-toggle.component';
import { WealthPlannerStore } from '../wealth-planner-2026/store';
import type {
  EstadoCivil,
  Parentesco,
  RegimenEconomico,
  Sexo,
} from '../wealth-planner-2026/store';

/**
 * Situación Actual · Familia.
 *
 * First of five Situación Actual pages. Captures the household composition
 * (cliente datos básicos · pareja · hijos · ascendientes) and writes to the
 * shared `WealthPlannerStore`. The sidebar chip for "Familia" derives its
 * `empty | in-progress | complete` state from that store.
 *
 * Figma references:
 *   - Información básica:     `3:8291` … `3:8365`
 *   - Miembros · Pareja:      `3:8057` (and variants)
 *   - Miembros · Hijos:       `3:8070` (and variants)
 *   - Miembros · Ascendientes: `3:8161` (and variants)
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
    SelectComponent,
    SwitchComponent,
    TabItemComponent,
    TabsComponent,
    DemoShellComponent,
    PlannerSidebarComponent,
    PlannerTopBarComponent,
    VersionToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './familia.page.html',
  styleUrls: ['./familia.page.scss'],
})
export class FamiliaPage {
  readonly store = inject(WealthPlannerStore);

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

  // ── Option lists ──────────────────────────────────────────────────────
  readonly sexoOptions: SelectOption[] = [
    { value: 'femenino', label: 'Femenino' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'otro', label: 'Otro / Prefiero no decirlo' },
  ];

  readonly estadoCivilOptions: SelectOption[] = [
    { value: 'soltero', label: 'Soltero/a' },
    { value: 'casado', label: 'Casado/a' },
    { value: 'pareja-de-hecho', label: 'Pareja de hecho' },
    { value: 'divorciado', label: 'Divorciado/a' },
    { value: 'viudo', label: 'Viudo/a' },
  ];

  readonly regimenOptions: SelectOption[] = [
    { value: 'gananciales', label: 'Sociedad de gananciales' },
    { value: 'separacion-de-bienes', label: 'Separación de bienes' },
    { value: 'participacion', label: 'Participación' },
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

  // ── Régimen económico is only relevant when casado / pareja de hecho ──
  readonly showsRegimen = computed<boolean>(() => {
    const ec = this.store.cliente().estadoCivil;
    return ec === 'casado' || ec === 'pareja-de-hecho';
  });

  // ── Cliente field handlers ────────────────────────────────────────────
  private toStr(v: string | number | null): string {
    return v === null ? '' : String(v);
  }

  setClienteNombre(v: string | number | null): void {
    this.store.setCliente({ nombre: this.toStr(v) });
  }
  setClienteApellidos(v: string | number | null): void {
    this.store.setCliente({ apellidos: this.toStr(v) });
  }
  setClienteFechaNacimiento(v: string | number | null): void {
    this.store.setCliente({ fechaNacimiento: this.toStr(v) });
  }
  setClienteSexo(v: string | number | null): void {
    this.store.setCliente({ sexo: (v as Sexo | null) ?? null });
  }
  setClienteEstadoCivil(v: string | number | null): void {
    const next = (v as EstadoCivil | null) ?? null;
    this.store.setCliente({
      estadoCivil: next,
      // Reset regimen if we leave the casado/pareja branch.
      regimenEconomico:
        next === 'casado' || next === 'pareja-de-hecho'
          ? this.store.cliente().regimenEconomico
          : null,
    });
  }
  setClienteRegimen(v: string | number | null): void {
    this.store.setCliente({
      regimenEconomico: (v as RegimenEconomico | null) ?? null,
    });
  }
  setClienteNacionalidad(v: string | number | null): void {
    this.store.setCliente({ nacionalidad: this.toStr(v) });
  }
  setClienteResidenciaFiscal(v: string | number | null): void {
    this.store.setCliente({ residenciaFiscal: this.toStr(v) });
  }
  setClienteNif(v: string | number | null): void {
    this.store.setCliente({ nif: this.toStr(v) });
  }

  // ── Pareja handlers ───────────────────────────────────────────────────
  setTienePareja(value: boolean): void {
    this.store.setTienePareja(value);
  }

  setConyugeNombre(v: string | number | null): void {
    this.store.setConyuge({ nombre: this.toStr(v) });
  }
  setConyugeApellidos(v: string | number | null): void {
    this.store.setConyuge({ apellidos: this.toStr(v) });
  }
  setConyugeFechaNacimiento(v: string | number | null): void {
    this.store.setConyuge({ fechaNacimiento: this.toStr(v) });
  }
  setConyugeSexo(v: string | number | null): void {
    this.store.setConyuge({ sexo: (v as Sexo | null) ?? null });
  }
  setConyugeNacionalidad(v: string | number | null): void {
    this.store.setConyuge({ nacionalidad: this.toStr(v) });
  }

  // ── Hijos handlers ────────────────────────────────────────────────────
  addHijo(): void {
    this.store.addHijo();
  }
  removeHijo(id: string): void {
    this.store.removeHijo(id);
  }
  setHijoNombre(id: string, v: string | number | null): void {
    this.store.updateHijo(id, { nombre: this.toStr(v) });
  }
  setHijoFechaNacimiento(id: string, v: string | number | null): void {
    this.store.updateHijo(id, { fechaNacimiento: this.toStr(v) });
  }
  setHijoACargo(id: string, checked: boolean): void {
    this.store.updateHijo(id, { aCargo: checked });
  }

  // ── Ascendientes handlers ─────────────────────────────────────────────
  addAscendiente(): void {
    this.store.addAscendiente();
  }
  removeAscendiente(id: string): void {
    this.store.removeAscendiente(id);
  }
  setAscendienteNombre(id: string, v: string | number | null): void {
    this.store.updateAscendiente(id, { nombre: this.toStr(v) });
  }
  setAscendienteParentesco(
    id: string,
    v: string | number | null,
  ): void {
    this.store.updateAscendiente(id, {
      parentesco: (v as Parentesco | null) ?? null,
    });
  }
  setAscendienteFechaNacimiento(
    id: string,
    v: string | number | null,
  ): void {
    this.store.updateAscendiente(id, { fechaNacimiento: this.toStr(v) });
  }
  setAscendienteACargo(id: string, checked: boolean): void {
    this.store.updateAscendiente(id, { aCargo: checked });
  }
}
