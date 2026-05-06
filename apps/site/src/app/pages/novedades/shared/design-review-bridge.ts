import { afterNextRender, type WritableSignal } from '@angular/core';

/**
 * Bridge a page's `version` signal to the floating design-review widget
 * configured in apps/site/src/index.html.
 *
 * - On mount, hooks `window.DesignReview.onVersionChange` to update the page
 *   signal whenever the widget's version pill changes.
 * - On mount, also reads `?version=` from the URL once and applies it, so that
 *   sharing a deep link with a version selected actually opens that version.
 *
 * Call from the constructor of any page that uses `site-version-toggle`.
 */
export function bridgeDesignReviewVersion(
  version: WritableSignal<string>,
  allowed: readonly string[] = ['v1', 'v2', 'v3']
): void {
  afterNextRender(() => {
    const dr = (window as unknown as {
      DesignReview?: { onVersionChange?: (v: string) => void };
    }).DesignReview;
    if (dr) {
      dr.onVersionChange = (v: string) => {
        if (allowed.includes(v)) version.set(v);
      };
    }
    const initial = new URLSearchParams(window.location.search).get('version');
    if (initial && allowed.includes(initial)) version.set(initial);
  });
}
