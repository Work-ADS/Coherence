/**
 * Reading `--motion-*` token VALUES into JavaScript.
 *
 * Most motion in this DS is pure CSS, where tokens are consumed by `var()` and
 * this file is irrelevant. It exists for the patterns that CANNOT be expressed
 * as a CSS transition or keyframe — a per-character blur band, a follow-through
 * whose distance must stay constant however far the element travels — and which
 * therefore drive the Web Animations API and need the numbers, not the `var()`.
 *
 * The rule those patterns follow: read the token, and if it does not resolve,
 * do not animate. Never substitute a hardcoded number — a host outside the
 * `[data-foundation="modern"]` scope has no motion tokens, and silently
 * inventing values there is how a brand swap stops working.
 *
 * Not exported from the package barrel: internal to the tabs-v2 folder. Promote
 * it to a shared `libs/ui` utility if a primitive outside this folder needs it.
 * (`apps/site`'s `hyper-text.directive.ts` carries its own copy of the same
 * parse; a library cannot import from an app, so that one stays where it is.)
 */

/**
 * Read a CSS time custom property as milliseconds, UNIT-AWARE.
 *
 * This is not paranoia about units: the production CSS optimizer rewrites
 * `200ms` to the equivalent `.2s`, and `parseFloat` is unit-naive
 * (`parseFloat('.2s') === 0.2`). Without the conversion, every animation driven
 * by a token runs for a fraction of a millisecond in a production build and
 * looks like nothing happened — while working perfectly in dev.
 *
 * @returns milliseconds, or NaN when the property is unset or unparseable.
 */
export function readMotionMs(value: string): number {
  const raw = value.trim();
  const parsed = parseFloat(raw);
  if (Number.isNaN(parsed)) return NaN;
  if (raw.endsWith('ms')) return parsed;
  if (raw.endsWith('s')) return parsed * 1000;
  return parsed;
}
