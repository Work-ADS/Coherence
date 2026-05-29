/**
 * Shared registry of AWM showcase features. Consumed by:
 *   - awm.page.ts (overview)  — renders one Coherence-style card per entry.
 *   - awm-feature.page.ts (sub-route) — looks up meta by :feature param,
 *     applies data-brand="awm", embeds the iframe.
 *
 * Add new features here and they appear on both surfaces. The iframe URL
 * points at the deployed AWM showcase (demo-afiwm.es) — AWM lives in its
 * own repo (AfiDesigner/Afi-AWM); Coherence is just the window.
 */
export interface AwmFeature {
  slug: string;
  title: string;
  intro: string;
  status?: string;
  iframeUrl: string;
}

export const AWM_FEATURES: readonly AwmFeature[] = [
  {
    slug: 'propuestas',
    title: 'Propuestas',
    intro:
      'Listado, creación y detalle de propuestas de inversión. Tres flujos por tenant (A · B · C).',
    status: 'Flow C',
    iframeUrl: 'https://demo-afiwm.es/propuestas',
  },
  {
    slug: 'sistema-de-importacion',
    title: 'Sistema de importación',
    intro:
      'Un solo proyecto con 4 sub-pantallas en el tab strip: Datos entrantes, Historial, Ejecuciones y Reglas.',
    status: '4 sub-pantallas',
    iframeUrl: 'https://demo-afiwm.es/importacion',
  },
  {
    slug: 'busqueda',
    title: 'Búsqueda',
    intro:
      'Dos buscadores reutilizables: activos con filtro de mercado embebido + modo avanzado, y multientidad con atajo ⌘K.',
    status: '⌘K',
    iframeUrl: 'https://demo-afiwm.es/busqueda',
  },
  {
    slug: 'vista-cliente',
    title: 'Vista cliente',
    intro:
      'Port 1:1 del informe del cliente final (demo-afiwm.es). 4 tabs · KPIs · evolución · heatmap · posiciones desplegables · 3 donuts.',
    status: 'Read-only',
    iframeUrl: 'https://demo-afiwm.es/vista-cliente',
  },
] as const;

export function findAwmFeature(slug: string | null | undefined): AwmFeature | null {
  if (!slug) return null;
  return AWM_FEATURES.find((f) => f.slug === slug) ?? null;
}
