export type InsightCategory =
  | 'estudios'
  | 'informes'
  | 'articulos'
  | 'eventos'
  | 'media';
export type NewsletterFrequency = 'semanal' | 'mensual';
export type SubscriptionStep = 'email' | 'confirmation' | 'preferences';

export interface Author {
  readonly name: string;
  readonly role: string;
}

export interface TocSection {
  readonly id: string;
  readonly label: string;
  readonly level: 0 | 1;
}

export interface Article {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: InsightCategory;
  readonly tags: readonly string[];
  readonly authors: readonly Author[];
  readonly publishedAt: string;
  readonly readingTimeMinutes: number;
  readonly featured: boolean;
  readonly serviceBadge?: string;
}

export const CATEGORIES: { key: InsightCategory; label: string }[] = [
  { key: 'estudios', label: 'Estudios' },
  { key: 'informes', label: 'Informes y Notas' },
  { key: 'articulos', label: 'Articulos' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'media', label: 'Media' },
];

const _AUTHORS = [
  { name: 'Aitana Bryant Cano', role: 'Consultora' },
  { name: 'Aitor Milner', role: 'Socio Director' },
  { name: 'Carmen Diaz', role: 'Analista Senior' },
  { name: 'Pablo Reyes', role: 'Director de Estudios' },
] as const satisfies readonly Author[];

const A0: Author = _AUTHORS[0];
const A1: Author = _AUTHORS[1];
const A2: Author = _AUTHORS[2];
const A3: Author = _AUTHORS[3];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'claves-episodios-quality',
    title: 'Claves de los episodios de peor comportamiento relativo del estilo quality en renta variable',
    excerpt: 'Analizamos los principales factores que explican los periodos en los que el estilo quality pierde terreno frente a otras estrategias de inversion.',
    category: 'articulos',
    tags: ['Renta Variable', 'Quality', 'Inversion'],
    authors: [A0, A1],
    publishedAt: '2026-04-30',
    readingTimeMinutes: 8,
    featured: true,
    serviceBadge: 'Servicio Resilienzo',
  },
  {
    id: '2',
    slug: 'perspectivas-macro-q2-2026',
    title: 'Perspectivas macroeconomicas para el segundo trimestre de 2026',
    excerpt: 'El entorno macroeconomico global presenta senales mixtas. Revisamos las principales tendencias y su impacto en los mercados financieros.',
    category: 'estudios',
    tags: ['Macroeconomia', 'Mercados', 'Perspectivas'],
    authors: [A3],
    publishedAt: '2026-04-22',
    readingTimeMinutes: 12,
    featured: true,
  },
  {
    id: '3',
    slug: 'regulacion-sostenibilidad-2026',
    title: 'Nuevo marco regulatorio de sostenibilidad: implicaciones para el sector financiero',
    excerpt: 'La normativa europea en materia de sostenibilidad introduce cambios significativos en los requisitos de divulgacion para entidades financieras.',
    category: 'informes',
    tags: ['Regulacion', 'Sostenibilidad', 'ESG'],
    authors: [A2],
    publishedAt: '2026-04-18',
    readingTimeMinutes: 6,
    featured: false,
  },
  {
    id: '4',
    slug: 'longevidad-economia-salud',
    title: 'Longevidad y economia de salud: retos y oportunidades',
    excerpt: 'El envejecimiento de la poblacion plantea desafios fiscales sin precedentes, pero tambien abre nuevas vias de inversion en el sector salud.',
    category: 'articulos',
    tags: ['Longevidad', 'Salud', 'Demografia'],
    authors: [A0],
    publishedAt: '2026-04-12',
    readingTimeMinutes: 7,
    featured: false,
  },
  {
    id: '5',
    slug: 'jornada-mercados-emergentes',
    title: 'Jornada: Mercados emergentes en la nueva era geopolitica',
    excerpt: 'Mesa redonda con expertos internacionales sobre las dinamicas de inversion en mercados emergentes ante el nuevo orden global.',
    category: 'eventos',
    tags: ['Mercados Emergentes', 'Geopolitica', 'Presencial'],
    authors: [A1],
    publishedAt: '2026-05-15',
    readingTimeMinutes: 0,
    featured: false,
  },
  {
    id: '6',
    slug: 'informe-renta-fija-abril',
    title: 'Informe mensual de renta fija: abril 2026',
    excerpt: 'Revision de los principales movimientos en los mercados de deuda publica y corporativa durante el mes de abril.',
    category: 'informes',
    tags: ['Renta Fija', 'Deuda', 'Mensual'],
    authors: [A2, A3],
    publishedAt: '2026-05-02',
    readingTimeMinutes: 10,
    featured: false,
  },
  {
    id: '7',
    slug: 'podcast-inflacion-tipos',
    title: 'Podcast: Inflacion y tipos de interes — que esperar en 2026',
    excerpt: 'Conversacion con el equipo de macroeconomia sobre la trajectoria esperada de la inflacion y la politica monetaria.',
    category: 'media',
    tags: ['Podcast', 'Inflacion', 'Tipos'],
    authors: [A3],
    publishedAt: '2026-04-28',
    readingTimeMinutes: 25,
    featured: false,
  },
  {
    id: '8',
    slug: 'estudio-transicion-energetica',
    title: 'La transicion energetica y su impacto en la valoracion de activos',
    excerpt: 'Estudio cuantitativo sobre como los riesgos climaticos estan redefiniendo los modelos de valoracion en los mercados de renta variable y deuda.',
    category: 'estudios',
    tags: ['Transicion Energetica', 'Valoracion', 'Clima'],
    authors: [A0, A2],
    publishedAt: '2026-04-08',
    readingTimeMinutes: 15,
    featured: true,
  },
  {
    id: '9',
    slug: 'webinar-finanzas-publicas',
    title: 'Webinar: El estado de las finanzas publicas en Espana',
    excerpt: 'Analisis en directo de la situacion fiscal espanola y proyecciones para el cierre del ejercicio 2026.',
    category: 'eventos',
    tags: ['Finanzas Publicas', 'Espana', 'Online'],
    authors: [A1],
    publishedAt: '2026-05-20',
    readingTimeMinutes: 0,
    featured: false,
  },
];

export const ARTICLE_BODY_SECTIONS: TocSection[] = [
  { id: 'introduccion', label: 'Introduccion', level: 0 },
  { id: 'contexto', label: 'Contexto historico', level: 0 },
  { id: 'factores', label: 'Factores determinantes', level: 0 },
  { id: 'factor-macro', label: 'Entorno macroeconomico', level: 1 },
  { id: 'factor-valoracion', label: 'Diferencial de valoracion', level: 1 },
  { id: 'datos', label: 'Datos clave', level: 0 },
  { id: 'conclusion', label: 'Conclusion', level: 0 },
];
