# Design review iterations

Snapshots of design-review feedback, exported from the floating review widget.

Each file is one review session: project + version + date. Filename pattern:

```
iteration-{project}-{version}-{YYYY-MM-DD}.md
```

For example: `iteration-coherence-novedades-v2-2026-04-30.md`.

## How to add a new iteration

1. Open any page that has the floating review widget (e.g. `/novedades/patrimonial`).
2. Press `Alt+D` to open the drawer, then switch to the **Changelog** tab.
3. Click **Save iteration (.md)** — the browser downloads a markdown file.
4. Move the downloaded file into this folder.
5. Commit alongside the design changes it relates to.

## How to plan from these files (with AI)

Once a few iterations have accumulated, ask an AI assistant in this repo:

> "Read everything in `docs/archive/design-review-iterations/` and group the open feedback by theme. For each theme, propose a 1–2 sentence iteration goal and which files should change."

Or:

> "Compare the last two iterations of `coherence-novedades`. What got resolved, what's still open, and what should the next sprint focus on?"

The markdown is intentionally simple — bullet per comment with status, author, page URL, body — so any AI can read it without context.

## Why this folder, not a database

We don't yet have a backend for the review widget. Comments live in `localStorage` per device. This folder is the stitching layer: download from the widget when a session ends, commit, and the iterations are now versioned alongside the design code.

When we eventually add the Cloudflare Worker + D1 backend (see [design-review-widget README](../../design-review-widget/README.md)), the widget can write straight to the server and email notifications fire — but for now, this folder is enough.
