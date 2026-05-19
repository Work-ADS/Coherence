import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface ColorStep {
  shade: string;
  token: string;
  hex: string;
}

interface ColorRamp {
  name: string;
  role: string;
  steps: ColorStep[];
}

@Component({
  selector: 'site-color-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color.page.html',
  styleUrl: './color.page.scss',
})
export class ColorPage {
  readonly activeTab = signal<'overview' | 'primitivos' | 'semanticos'>('overview');
  readonly copiedToken = signal<string | null>(null);

  readonly brandRamps: ColorRamp[] = [
    {
      name: 'afi-azul',
      role: 'Marca primaria',
      steps: [
        { shade: '0', token: '--color-afi-azul-0', hex: '#FFFFFF' },
        { shade: '25', token: '--color-afi-azul-25', hex: '#F2FAFE' },
        { shade: '50', token: '--color-afi-azul-50', hex: '#E6F4FB' },
        { shade: '100', token: '--color-afi-azul-100', hex: '#CDE9F6' },
        { shade: '200', token: '--color-afi-azul-200', hex: '#A6D8EE' },
        { shade: '300', token: '--color-afi-azul-300', hex: '#80C6E5' },
        { shade: '400', token: '--color-afi-azul-400', hex: '#37BBF4' },
        { shade: '500', token: '--color-afi-azul-500', hex: '#0085CA' },
        { shade: '600', token: '--color-afi-azul-600', hex: '#0076B4' },
        { shade: '700', token: '--color-afi-azul-700', hex: '#00629A' },
        { shade: '800', token: '--color-afi-azul-800', hex: '#004A74' },
        { shade: '900', token: '--color-afi-azul-900', hex: '#003B5F' },
      ],
    },
    {
      name: 'afi-azul-profundo',
      role: 'Acción',
      steps: [
        { shade: '0', token: '--color-afi-azul-profundo-0', hex: '#FFFFFF' },
        { shade: '25', token: '--color-afi-azul-profundo-25', hex: '#F2F7FA' },
        { shade: '50', token: '--color-afi-azul-profundo-50', hex: '#E6EFF3' },
        { shade: '100', token: '--color-afi-azul-profundo-100', hex: '#CCDDE5' },
        { shade: '200', token: '--color-afi-azul-profundo-200', hex: '#AFC4CF' },
        { shade: '300', token: '--color-afi-azul-profundo-300', hex: '#8AA8B6' },
        { shade: '400', token: '--color-afi-azul-profundo-400', hex: '#5E8294' },
        { shade: '500', token: '--color-afi-azul-profundo-500', hex: '#062D3F' },
        { shade: '600', token: '--color-afi-azul-profundo-600', hex: '#052636' },
        { shade: '700', token: '--color-afi-azul-profundo-700', hex: '#041F2C' },
        { shade: '800', token: '--color-afi-azul-profundo-800', hex: '#031823' },
        { shade: '900', token: '--color-afi-azul-profundo-900', hex: '#020F15' },
      ],
    },
    {
      name: 'afi-gris',
      role: 'Superficies frías',
      steps: [
        { shade: '0', token: '--color-afi-gris-0', hex: '#FFFFFF' },
        { shade: '25', token: '--color-afi-gris-25', hex: '#FBFCFD' },
        { shade: '50', token: '--color-afi-gris-50', hex: '#F4F8FA' },
        { shade: '100', token: '--color-afi-gris-100', hex: '#EAF1F5' },
        { shade: '200', token: '--color-afi-gris-200', hex: '#D8E5EC' },
        { shade: '300', token: '--color-afi-gris-300', hex: '#C8DAE2' },
        { shade: '400', token: '--color-afi-gris-400', hex: '#B4C9D2' },
        { shade: '500', token: '--color-afi-gris-500', hex: '#9CB2BC' },
        { shade: '600', token: '--color-afi-gris-600', hex: '#839AA5' },
        { shade: '700', token: '--color-afi-gris-700', hex: '#6A808A' },
        { shade: '800', token: '--color-afi-gris-800', hex: '#51666F' },
        { shade: '900', token: '--color-afi-gris-900', hex: '#394C54' },
      ],
    },
    {
      name: 'afi-white',
      role: 'Canvas y superficies base',
      steps: [
        { shade: '0', token: '--color-afi-white-0', hex: '#FFFFFF' },
        { shade: '25', token: '--color-afi-white-25', hex: '#FAFAFA' },
        { shade: '50', token: '--color-afi-white-50', hex: '#F5F5F5' },
        { shade: '100', token: '--color-afi-white-100', hex: '#F1F3F5' },
        { shade: '200', token: '--color-afi-white-200', hex: '#E4E7EB' },
        { shade: '300', token: '--color-afi-white-300', hex: '#D1D6DB' },
        { shade: '400', token: '--color-afi-white-400', hex: '#B0B8C1' },
        { shade: '500', token: '--color-afi-white-500', hex: '#8A949E' },
        { shade: '600', token: '--color-afi-white-600', hex: '#6B7480' },
        { shade: '700', token: '--color-afi-white-700', hex: '#4F5761' },
        { shade: '800', token: '--color-afi-white-800', hex: '#343A40' },
        { shade: '900', token: '--color-afi-white-900', hex: '#1F2328' },
      ],
    },
    {
      name: 'afi-control',
      role: 'Neutro funcional (inputs, bordes, texto)',
      steps: [
        { shade: '0', token: '--color-afi-control-0', hex: '#FFFFFF' },
        { shade: '25', token: '--color-afi-control-25', hex: '#FCFCFD' },
        { shade: '50', token: '--color-afi-control-50', hex: '#F9FAFB' },
        { shade: '100', token: '--color-afi-control-100', hex: '#F2F4F7' },
        { shade: '200', token: '--color-afi-control-200', hex: '#E4E7EC' },
        { shade: '300', token: '--color-afi-control-300', hex: '#D0D5DD' },
        { shade: '400', token: '--color-afi-control-400', hex: '#98A2B3' },
        { shade: '500', token: '--color-afi-control-500', hex: '#667085' },
        { shade: '600', token: '--color-afi-control-600', hex: '#475467' },
        { shade: '700', token: '--color-afi-control-700', hex: '#344054' },
        { shade: '800', token: '--color-afi-control-800', hex: '#1D2939' },
        { shade: '900', token: '--color-afi-control-900', hex: '#101828' },
        { shade: '950', token: '--color-afi-control-950', hex: '#0C111D' },
      ],
    },
  ];

  readonly signalRamps: ColorRamp[] = [
    {
      name: 'info', role: 'Información',
      steps: [
        { shade: '25', token: '--color-info-25', hex: '#F8FBFF' },
        { shade: '50', token: '--color-info-50', hex: '#F0F6FF' },
        { shade: '100', token: '--color-info-100', hex: '#E0EDFF' },
        { shade: '200', token: '--color-info-200', hex: '#C7DBFF' },
        { shade: '300', token: '--color-info-300', hex: '#9EC5FE' },
        { shade: '500', token: '--color-info-500', hex: '#4C8DFF' },
        { shade: '700', token: '--color-info-700', hex: '#2F5FCC' },
        { shade: '900', token: '--color-info-900', hex: '#1C3A80' },
      ],
    },
    {
      name: 'success', role: 'Éxito',
      steps: [
        { shade: '25', token: '--color-success-25', hex: '#F8FDF9' },
        { shade: '50', token: '--color-success-50', hex: '#F2FBF5' },
        { shade: '100', token: '--color-success-100', hex: '#E3F6E8' },
        { shade: '200', token: '--color-success-200', hex: '#C1E9CD' },
        { shade: '300', token: '--color-success-300', hex: '#97D7AD' },
        { shade: '500', token: '--color-success-500', hex: '#3FAE6A' },
        { shade: '700', token: '--color-success-700', hex: '#2C7A4A' },
        { shade: '900', token: '--color-success-900', hex: '#1A4A2D' },
      ],
    },
    {
      name: 'warning', role: 'Advertencia',
      steps: [
        { shade: '25', token: '--color-warning-25', hex: '#FFFEF5' },
        { shade: '50', token: '--color-warning-50', hex: '#FFFBEA' },
        { shade: '100', token: '--color-warning-100', hex: '#FFF5CC' },
        { shade: '200', token: '--color-warning-200', hex: '#FFE9A3' },
        { shade: '300', token: '--color-warning-300', hex: '#FFD666' },
        { shade: '500', token: '--color-warning-500', hex: '#FFC107' },
        { shade: '700', token: '--color-warning-700', hex: '#B28704' },
        { shade: '900', token: '--color-warning-900', hex: '#6D5300' },
      ],
    },
    {
      name: 'error', role: 'Error',
      steps: [
        { shade: '25', token: '--color-error-25', hex: '#FFF8F8' },
        { shade: '50', token: '--color-error-50', hex: '#FEF3F2' },
        { shade: '100', token: '--color-error-100', hex: '#FDECEC' },
        { shade: '200', token: '--color-error-200', hex: '#F9D3D3' },
        { shade: '300', token: '--color-error-300', hex: '#F5A3A3' },
        { shade: '500', token: '--color-error-500', hex: '#E54848' },
        { shade: '700', token: '--color-error-700', hex: '#B53030' },
        { shade: '900', token: '--color-error-900', hex: '#6E1D1D' },
      ],
    },
  ];

  readonly semanticGroups = [
    {
      name: 'Canvas',
      desc: 'Fondos a nivel página.',
      tokens: [
        { token: '--canvas-primary', role: 'Fondo principal de ruta.' },
        { token: '--canvas-secondary', role: 'Banda recesada.' },
      ],
    },
    {
      name: 'Surface',
      desc: 'Contenedores.',
      tokens: [
        { token: '--surface-default', role: 'Card, panel.' },
        { token: '--surface-subtle', role: 'Panel secundario.' },
        { token: '--surface-raised', role: 'Modal, popover (+ sombra).' },
        { token: '--surface-selected', role: 'Fila activa.' },
      ],
    },
    {
      name: 'Brand Primary',
      desc: 'CTA principal.',
      tokens: [
        { token: '--brand-primary-background-default', role: 'Fondo botón primario.' },
        { token: '--brand-primary-background-hover', role: 'Hover.' },
        { token: '--brand-primary-background-active', role: 'Press.' },
        { token: '--brand-primary-foreground-default', role: 'Texto sobre primario.' },
      ],
    },
    {
      name: 'Feedback',
      desc: 'Estados del sistema.',
      tokens: [
        { token: '--feedback-success-background', role: 'Éxito.' },
        { token: '--feedback-error-background', role: 'Error.' },
        { token: '--feedback-warning-background', role: 'Aviso.' },
        { token: '--feedback-info-background', role: 'Info.' },
      ],
    },
    {
      name: 'Disabled',
      desc: 'Universal.',
      tokens: [
        { token: '--disabled-background', role: 'Fondo.' },
        { token: '--disabled-foreground', role: 'Texto.' },
        { token: '--disabled-border', role: 'Borde.' },
      ],
    },
  ];

  copyToken(token: string): void {
    navigator.clipboard.writeText(`var(${token})`);
    this.copiedToken.set(token);
    setTimeout(() => this.copiedToken.set(null), 1500);
  }
}
