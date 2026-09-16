# Claude Design — prompts

Externalised briefs for [Claude Design](https://claude.ai), which cannot read
this repo. Each pattern file describes one shipped pattern — its structure, its
behaviour and its motion — in enough detail that an outside tool can rebuild it
from scratch, in its own stack, without seeing our SCSS. One file is a job
rather than a pattern: [`cross-reference-and-cleanup.md`](./cross-reference-and-cleanup.md)
audits the design-system project against the others.

Colour and type are deliberately absent. The Claude Design project already
defines them; these files carry structure and interaction only.

## These are not the standard

Two documents are the standard, and they win on every conflict:

- [`docs/rules/motion-skill.md`](../rules/motion-skill.md) — the catalog of
  named motion patterns.
- [`docs/rules/page-structure-skill.md`](../rules/page-structure-skill.md) —
  page and section structure, and which pattern each page-level change uses.

These files are an **export format** of those two: the same rules, rewritten
for a reader with no repo access.

That direction matters. When a pattern changes, change the standard first and
regenerate the prompt here. Never the reverse. A prompt file that disagrees
with its standard is stale, not a second opinion.

Every token table in this folder is a **snapshot**, included only because the
external tool cannot resolve `var()`. If a token value moves, these tables are
wrong until someone updates them. Treat a mismatch as a bug in this folder.

## How to use one

1. Pick the prompt for the pattern you want.
2. Prepend [`_foundation.md`](./_foundation.md). It carries the token snapshot,
   the reduced-motion contract, and the two or three principles every pattern in
   here assumes. The individual files do not repeat it.
3. Paste both into Claude Design as a single brief.

Combining two patterns is the normal case, not the exception — a dropdown inside
a tab panel needs both. Prepend the foundation once, then append each pattern
file after it. They are written to not contradict each other.

**To audit the design-system project,** paste
[`cross-reference-and-cleanup.md`](./cross-reference-and-cleanup.md) first, then
the foundation, then `page-section-layout.md` and whichever component briefs
you want checked. It runs in four steps and stops for your approval after each
of the first three.

## When a client wants something different

Change the numbers, keep the structure. The durations and easings are the
adjustable layer. What should survive a retune:

- Phase ordering (container before contents)
- Which property carries the motion (`clip-path` over `scaleY`, and why)
- Fixed-distance follow-through over percentage-based overshoot
- The reduced-motion collapse

Those are the parts that make it read as deliberate rather than decorated. A
client who wants a slower, calmer feel needs new durations. A client who wants
the rows to appear before the panel does not want this system.

## Contents

| File | Pattern | Catalog reference |
|---|---|---|
| [`_foundation.md`](./_foundation.md) | Shared preamble — prepend to all | §3 |
| [`overlay-extrude-reveal.md`](./overlay-extrude-reveal.md) | Dropdown / menu / select open | §4.7 + uncataloged, see note |
| [`selection-slide.md`](./selection-slide.md) | Tabs + segmented control indicator | §4.12, §4.13 |
| [`selection-controls.md`](./selection-controls.md) | Checkbox, radio, switch feedback | §4.8, §4.9 |
| [`page-section-layout.md`](./page-section-layout.md) | Shell, page header, section box, and their interaction | page-structure-skill §3–§17 |
| [`search-typeahead-reveal.md`](./search-typeahead-reveal.md) | Search field + typeahead panel + result cascade | §4.7, **exception uncataloged** |
| [`filter-chip.md`](./filter-chip.md) | Filter pill — toggle, removable, applied value, exit | §4.1, §4.3, §4.6, §4.14 |
| [`multi-select-menu.md`](./multi-select-menu.md) | Pill trigger + checkbox menu | **composed, not yet a v2 primitive** |
| [`notes-dropdown-v1.md`](./notes-dropdown-v1.md) | V1 notes dropdown in the planner top bar, with what not to copy | §4.1, §4.2, §4.3, §4.14 |
| [`glass-nav-bar.md`](./glass-nav-bar.md) | Frosted top bar that content scrolls under, with the dark-content switch | **uncataloged**, see note |
| [`tooltip-shared-morph.md`](./tooltip-shared-morph.md) | Tooltip reveal + shared morph | **proposed, uncataloged** |
| [`cross-reference-and-cleanup.md`](./cross-reference-and-cleanup.md) | *Job, not a pattern:* audit and reorganise the design-system project | — |

Files marked **proposed** describe motion we have not built. They are inbound
references kept in the house format, and they do not describe Coherence until
they ship and get a catalog entry.

Sections marked **decided, not built** sit inside otherwise-shipped briefs.
They record a rule that is in the standard but not yet in code — today, the
`list-exit` pattern (§4.14) in `filter-chip.md` and `page-section-layout.md`.
Everything they describe still happens instantly in the product.

Files marked **composed** describe an assembly of shipped v2 parts that no single
primitive owns yet. Every motion in them exists in code; the combination does not.
They also record the decisions the assembly needs before it can be built — read
those before pasting.

**Open gaps.** Three patterns here ship in code with no catalog entry, which makes
this folder load-bearing in a way it should not be. Cataloguing them is the fix.

1. The two-phase extrude that opens `afi-menu-v2`. `overlay-extrude-reveal.md` is
   currently its only written description.
2. The warm-transition `stagger-reveal` that `afi-table-v2` runs on every filter
   change. §4.7 prescribes a plain fade there; the exception is argued on
   `TableV2Reveal` in code and in `search-typeahead-reveal.md`, but §4.7 itself
   does not mention that an opt-in override exists.
3. The "coherence glass" top bar — a 16px backdrop blur under a 55% surface
   tint, plus the site bar's switch to light-on-dark. It ships in
   `site-planner-navbar-v2` and `afi-top-bar` (`variant="glass"`);
   `glass-nav-bar.md` is its only written description.
