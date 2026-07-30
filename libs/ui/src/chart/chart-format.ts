/**
 * es-ES number and date formatters for chart labels.
 *
 * Uses `Intl.NumberFormat` and `Intl.DateTimeFormat` — never hand-concatenates
 * format strings. Abbreviation helper for k/M/MM follows RAE forms.
 */

const numberFmt = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 2,
});

const currencyFmt = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  currencyDisplay: 'code',
  maximumFractionDigits: 2,
});

// Symbol register for headline/legend figures: "730.000 €" rather than the
// code register's "730.000,00 EUR". Whole euros — decimals are axis/tooltip
// territory, not display-figure territory.
const currencySymbolFmt = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const percentFmt = new Intl.NumberFormat('es-ES', {
  style: 'percent',
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

/**
 * Format a number for chart labels. Uses RAE abbreviations:
 * - 1.200 → `1,2 k`
 * - 3.400.000 → `3,4 M`
 * - 1.200.000.000 → `1,2 MM`
 * - Below 1000 → standard es-ES format
 */
export function formatNumber(value: number, locale = 'es-ES'): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '−' : '';

  if (abs >= 1_000_000_000) {
    const v = value / 1_000_000_000;
    return `${sign}${fmtCompact(Math.abs(v), locale)} MM`;
  }
  if (abs >= 1_000_000) {
    const v = value / 1_000_000;
    return `${sign}${fmtCompact(Math.abs(v), locale)} M`;
  }
  if (abs >= 1_000) {
    const v = value / 1_000;
    return `${sign}${fmtCompact(Math.abs(v), locale)} k`;
  }

  return localeFmt(value, locale);
}

/** Format a number with full precision (for tooltips). */
export function formatNumberFull(value: number, locale = 'es-ES'): string {
  return localeFmt(value, locale);
}

/**
 * Append a unit to an already-formatted figure: `1,8 k` → `1,8 k €`.
 *
 * The unit always follows the number after a space — RAE for the euro sign and
 * for the percent sign alike, and the same shape reads correctly for plain units
 * like "tx". This is the symbol register documented on `formatCurrency`: compact
 * display figures take `€`, while axes, tooltips and data tables take the `EUR`
 * code register.
 *
 * The space is non-breaking so a chart label can never wrap between the number
 * and its unit.
 */
export function withUnit(formatted: string, unit: string | null): string {
  if (!unit) return formatted;
  return `${formatted} ${unit}`;
}

/**
 * Format as currency (EUR).
 *
 * `display` picks the register: `'code'` (default — "730.000,00 EUR", axes,
 * tooltips, data tables) or `'symbol'` ("730.000 €", whole euros — headline
 * figures and value-bearing legends).
 */
export function formatCurrency(
  value: number,
  locale = 'es-ES',
  display: 'code' | 'symbol' = 'code',
): string {
  if (locale === 'es-ES') {
    return display === 'symbol' ? currencySymbolFmt.format(value) : currencyFmt.format(value);
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    ...(display === 'symbol'
      ? { maximumFractionDigits: 0 }
      : { currencyDisplay: 'code' as const }),
  }).format(value);
}

/** Format as percentage. Input is a ratio (0.15 → `15 %`). */
export function formatPercent(value: number, locale = 'es-ES'): string {
  if (locale === 'es-ES') return percentFmt.format(value);
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format a Date to `DD MMM YYYY` with lowercase RAE month. */
export function formatDate(date: Date, locale = 'es-ES'): string {
  if (locale === 'es-ES') return dateFmt.format(date);
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function fmtCompact(abs: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(abs);
}

function localeFmt(value: number, locale: string): string {
  if (locale === 'es-ES') return numberFmt.format(value);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}
