# Claude Design — animation prompts

Externalised motion briefs for [Claude Design](https://claude.ai), which cannot
read this repo. Each file describes one shipped motion pattern in enough detail
that an outside tool can rebuild it from scratch, in its own stack, without
seeing our SCSS.

## These are not the standard

[`docs/rules/motion-skill.md`](../rules/motion-skill.md) is the standard. It is
the catalog of named patterns, it carries the changelog, and it wins on every
conflict. These files are an **export format** of it — the same patterns,
rewritten for a reader with no repo access.

That direction matters. When a pattern changes, change it in `motion-skill.md`
first and regenerate the prompt here. Never the reverse. A prompt file that
disagrees with the catalog is stale, not a second opinion.

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
| [`search-typeahead-reveal.md`](./search-typeahead-reveal.md) | Search field + typeahead panel + result cascade | §4.7, **exception uncataloged** |
| [`tooltip-shared-morph.md`](./tooltip-shared-morph.md) | Tooltip reveal + shared morph | **proposed, uncataloged** |

Files marked **proposed** describe motion we have not built. They are inbound
references kept in the house format, and they do not describe Coherence until
they ship and get a catalog entry.

**Open gaps.** Two patterns here ship in code with no catalog entry, which makes
this folder load-bearing in a way it should not be. Cataloguing them is the fix.

1. The two-phase extrude that opens `afi-menu-v2`. `overlay-extrude-reveal.md` is
   currently its only written description.
2. The warm-transition `stagger-reveal` that `afi-table-v2` runs on every filter
   change. §4.7 prescribes a plain fade there; the exception is argued on
   `TableV2Reveal` in code and in `search-typeahead-reveal.md`, but §4.7 itself
   does not mention that an opt-in override exists.
