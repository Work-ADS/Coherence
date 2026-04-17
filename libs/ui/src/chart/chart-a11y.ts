/**
 * Accessibility helpers for chart primitives.
 *
 * Builds the sr-only descriptive-text region from the four required
 * accessibility properties (Visa PDS verbatim). All text in RAE Spanish.
 */

export interface ChartA11yTexts {
  longDescription: string;
  statisticalNotes: string;
  contextExplanation: string;
  structureNotes: string;
}

/**
 * Build the sr-only region content from the four descriptive-text properties.
 * Concatenates with line breaks for screen reader pacing.
 */
export function buildA11yRegion(texts: ChartA11yTexts): string {
  return [
    texts.longDescription,
    texts.statisticalNotes,
    texts.contextExplanation,
    texts.structureNotes,
  ]
    .filter(Boolean)
    .join('. ');
}

/** Generate a unique ID for the a11y region, scoped per chart instance. */
export function chartA11yId(chartId: number): string {
  return `afi-chart-a11y-${chartId}`;
}

/** Generate a unique ID for the chart title element. */
export function chartTitleId(chartId: number): string {
  return `afi-chart-title-${chartId}`;
}
