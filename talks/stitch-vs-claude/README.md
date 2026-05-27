# Stitch vs Claude — talk assets (2026-05-28)

Asset folder for the department talk comparing Google Stitch and Claude / Claude Code. Branch: `docs/talk-stitch-vs-claude`. Brief: [`docs/session-briefs/2026-05-27-talk-stitch-vs-claude.md`](../../docs/session-briefs/2026-05-27-talk-stitch-vs-claude.md). Plan: [`~/.claude/plans/okay-um-i-guess-binary-kitten.md`](../../../.claude/plans/okay-um-i-guess-binary-kitten.md).

## Contents

```
talks/stitch-vs-claude/
├── README.md                       ← this file
├── prompt.md                       ← locked prompt + attachment matrix
├── reference/
│   └── mutualidad-jubilacion.png   ← Mutualidad Figma screenshot (you add tonight)
└── outputs/
    ├── 01-stitch-mastercard-url.png        (you add tonight)
    ├── 02-claude-mastercard-url.png        (you add tonight)
    ├── 03-stitch-mastercard-designmd.png   (you add tonight)
    ├── 04-claude-mastercard-designmd.png   (you add tonight)
    ├── 05-claude-code-coherence-repo.png   (you add tonight)
    └── links.md                            (live URLs for each run)
```

## External resources (live, do not try to mirror locally)

- **Mutualidad Figma reference** — https://www.figma.com/design/hgiafEy0VfIC8vPwDgu4wL/Mutualidad-Planificador-de-jubilaci%C3%B3n-DEV?node-id=402-11750
- **Mastercard design.md** (getdesign.md) — https://getdesign.md/mastercard/design-md
- **Mastercard URL** — https://www.mastercard.com/es/es.html
The Mastercard `design.md` is rendered client-side on getdesign.md — there is no raw-markdown download endpoint. Use the live URL directly when prompting Stitch and Claude.

## You-owned tasks tonight

1. Screenshot the two Mutualidad frames from Figma → save as `reference/mutualidad-jubilacion.png` (one image, two screens side-by-side if possible; otherwise just the inputs frame).
2. Run the 5 demos per [`prompt.md`](prompt.md). Screenshot each result into `outputs/0N-*.png`.
3. Save the live artifact URLs (Stitch project URL, Claude artifact URL) in `outputs/links.md`.
4. Re-open `apps/site` dev server. Confirm `/talks/stitch-vs-claude` shows your output screenshots on the right slides.
5. Rehearse end-to-end with stopwatch. Target ≤ 18 min.
