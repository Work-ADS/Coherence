/**
 * Shared registry of AWM showcase features. Used by `awm.page.ts` to render
 * one Coherence-style card per entry; each card opens the live AWM showcase
 * in a new tab.
 *
 * AWM is an independent Angular + PrimeNG app that lives in its own repo
 * (AfiDesigner/Afi-AWM). Coherence doesn't host AWM — it just links into it.
 *
 * URL CONFIGURATION
 * -----------------
 * `externalUrl` currently points at `http://localhost:4200/<route>` — the
 * default port for AWM when you run `ng serve` inside `AWM/showcase/`.
 * Clicking a card only works while AWM is running locally on that port.
 *
 * Once AWM has a public deploy, swap each `externalUrl` to the production
 * URL (or extract the base into an environment variable so dev / prod
 * switch automatically).
 */
export interface AwmFeature {
  slug: string;
  title: string;
  intro: string;
  status?: string;
  externalUrl: string;
}

export const AWM_FEATURES: readonly AwmFeature[] = [
  {
    slug: 'propuestas',
    title: 'Propuestas',
    intro:
      'Listado, creación y detalle de propuestas de inversión. Tres flujos por tenant (A · B · C).',
    status: 'Flow C',
    externalUrl: 'http://localhost:4200/propuestas',
  },
  {
    slug: 'sistema-de-importacion',
    title: 'Sistema de importación',
    intro:
      'Un solo proyecto con 4 sub-pantallas en el tab strip: Datos entrantes, Historial, Ejecuciones y Reglas.',
    status: '4 sub-pantallas',
    externalUrl: 'http://localhost:4200/importacion',
  },
  {
    slug: 'busqueda',
    title: 'Búsqueda',
    intro:
      'Dos buscadores reutilizables: activos con filtro de mercado embebido + modo avanzado, y multientidad con atajo ⌘K.',
    status: '⌘K',
    externalUrl: 'http://localhost:4200/busqueda',
  },
  {
    slug: 'vista-cliente',
    title: 'Vista cliente',
    intro:
      'Port 1:1 del informe del cliente final. 4 tabs · KPIs · evolución · heatmap · posiciones desplegables · 3 donuts.',
    status: 'Read-only',
    externalUrl: 'http://localhost:4200/vista-cliente',
  },
] as const;
