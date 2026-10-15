/**
 * Escape, consumed once. Layered overlays (Tooltip over Select over Modal or
 * Drawer) must not all close on one key press: the topmost layer takes the
 * Escape and the rest never see it.
 *
 * `onOverlayEscape` registers a layer on a stack and listens once on the
 * document in the capture phase, so it runs before any element or bubble
 * handler. The newest layer handles the key and marks it `defaultPrevented`.
 * That mark also cancels the native `<dialog>` close, and it is what Modal and
 * Drawer test with `escapeConsumed` before closing themselves.
 *
 * Register only while the layer is open, and call the returned function when
 * it closes.
 */

type Layer = (event: KeyboardEvent) => void;

const layers: Layer[] = [];

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.defaultPrevented) return;
  const top = layers[layers.length - 1];
  if (!top) return;
  event.preventDefault();
  top(event);
}

/** Registers an open layer; returns the function that unregisters it. */
export function onOverlayEscape(handler: Layer): () => void {
  if (layers.length === 0) document.addEventListener('keydown', onKeydown, true);
  layers.push(handler);
  return () => {
    const i = layers.lastIndexOf(handler);
    if (i >= 0) layers.splice(i, 1);
    if (layers.length === 0) document.removeEventListener('keydown', onKeydown, true);
  };
}

/** True when a layer above this one already took the Escape. */
export function escapeConsumed(event: Event): boolean {
  return event.defaultPrevented;
}
