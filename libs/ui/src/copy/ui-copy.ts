import { InjectionToken, Signal } from '@angular/core';

/**
 * Chrome strings the primitives render themselves.
 *
 * These are the words a component says on its own behalf — "Cerrar", "Cargando…",
 * the accessible name of a × button — as opposed to content, which always comes
 * from the consumer. They are Spanish by default because this DS is Spanish-first;
 * this token is how a non-Spanish surface changes all of them at once.
 *
 * Deliberately small and chrome-only. A string that describes the CONTENT (a
 * table's `emptyText`, a search's `emptyMessage`, an apron's `noun`) stays a
 * per-instance `input()` — it differs per table, not per language, so hoisting it
 * here would be wrong.
 */
export interface AfiUiCopy {
  /** Announced while a control or surface is loading. */
  loading: string;
  /** Accessible name of a header/overlay close (×) button. */
  close: string;
  /** Verb prefixed to a label on a dismiss ×, e.g. "Quitar Renta fija". */
  remove: string;
  /** Verb prefixed to a label on a clear-value ×, e.g. "Borrar Renta fija". */
  clear: string;
  /** Accessible name of a search field's clear button. */
  clearSearch: string;
  /** Accessible name of the apron's clear-selection ×. */
  clearSelection: string;
  /** Accessible name of a table's header select-all checkbox. */
  selectAllRows: string;
  /** Accessible name of a table's per-row select checkbox (row name appended). */
  selectRow: string;
  /** Accessible name of an overflow (⋯) trigger. */
  moreActions: string;
  /** Accessible name of a table row's overflow menu panel. */
  rowActions: string;
  /** Accessible name / placeholder of a search control. */
  search: string;
  /** Accessible name of a help control. */
  help: string;
  /** Accessible name of a notifications control. */
  notifications: string;
  /** Accessible name of the control that opens the nav drawer. */
  openNav: string;
  /** Accessible name of the sidebar's expand toggle. */
  expandSidebar: string;
  /** Accessible name of the top navigation landmark. */
  topNav: string;
  /** Accessible name of the main (side) navigation landmark. */
  mainNav: string;
}

/**
 * A SIGNAL, not a plain object — the strings have to follow a language switch
 * that happens after the injector is built. Providing a frozen object would
 * pin the UI to whichever language was active at bootstrap.
 */
export type AfiUiCopySource = Signal<Partial<AfiUiCopy>>;

/**
 * Optional. Every primitive falls back to its Spanish default when nothing is
 * provided, so existing consumers are unaffected and this stays opt-in.
 *
 * Resolution order, widest to narrowest: **Spanish default → this token →
 * per-instance `input()`**. An input always wins, so a one-off override still
 * works on a page that also provides the token.
 */
export const AFI_UI_COPY = new InjectionToken<AfiUiCopySource>('AFI_UI_COPY');

/**
 * Provide the chrome copy for a route or an app.
 *
 * Takes a FACTORY, not a signal, so the body runs inside an injection context —
 * the copy almost always derives from a language service, and `inject()` is only
 * legal there. Passing a pre-built signal would force the caller to obtain that
 * service some other way.
 *
 * ```ts
 * providers: [
 *   provideAfiUiCopy(() => {
 *     const language = inject(LanguageService);
 *     return computed(() => MY_CHROME[language.lang()]);
 *   }),
 * ]
 * ```
 */
export function provideAfiUiCopy(factory: () => AfiUiCopySource) {
  return { provide: AFI_UI_COPY, useFactory: factory };
}
