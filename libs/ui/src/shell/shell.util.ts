import { inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';

import type { ShellType } from './shell.variants';
import { coerceShellType } from './shell.variants';

/**
 * Reads the current route's `data.shell` and returns a reactive ShellType.
 *
 * Usage in app.component.ts:
 * ```ts
 * readonly shellType$ = shellTypeFromRoute();
 * ```
 */
export function shellTypeFromRoute(): Observable<ShellType> {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  return router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    startWith(null),
    map(() => {
      let child = route.snapshot;
      while (child.firstChild) {
        child = child.firstChild;
      }
      return coerceShellType(child.data['shell'] as string | undefined);
    }),
  );
}
