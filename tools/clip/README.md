# Component clip recorder

Records a component from a running site page as a share-ready MP4 — for social
posts, changelog entries, or anything that needs the component *moving*.

It drives the real page in headless Chrome. Nothing is recreated or faked, so
what lands in the video is whatever the primitives actually do today.

## Run it

```bash
npm i -D puppeteer-core && npm start & sleep 40 && node tools/clip/record.mjs
```

Needs `ffmpeg` on PATH (`brew install ffmpeg`) and a dev server already serving
the page. `puppeteer-core` is deliberately not a repo dependency — this is an
occasional authoring tool, not part of the build.

Output lands in `./out/filter-demo.mp4`. Videos are gitignored by design
(`.gitignore` — screen recordings stay out of history); treat the MP4 as a
build artefact and re-run the script when the component changes.

| Env var | Default | Purpose |
| --- | --- | --- |
| `URL` | `http://localhost:4202/workbench` | Page to record |
| `CHROME_PATH` | auto-resolved | Chrome binary, if detection fails |
| `HEADFUL` | unset | Set to any value to watch it drive the page |
| `OUT` | `./out` | Output directory |

## What it does

1. Loads the page, switches copy to EN, hides the docs chrome so only the target
   section remains — sidebar, page title and hint paragraph go.
2. Overlays a synthetic cursor with a click pulse. CDP screencast does not
   capture the real pointer, so without this the typing looks self-driven.
3. Runs the choreography, capturing frames on paint.
4. Encodes to 1280×720, H.264 High, limited-range `yuv420p`, 30fps, `+faststart`,
   with a silent AAC track — the combination Twitter and LinkedIn both accept.

Frames arrive only when Chrome paints, so static holds emit almost nothing. The
encoder uses per-frame durations via ffmpeg's concat demuxer rather than assuming
a constant capture rate.

## Recording a different component

Everything except the `CHOREOGRAPHY` block is generic. To clip something else,
point `URL` at the page, change the section finder in the isolation step to
match your target, and rewrite the choreography using the `moveTo` / `clickAt` /
`typeText` helpers.

Two things worth keeping when you do:

- **Arm the capture after isolating.** The first screencast frames can be a stale
  surface showing the un-isolated page.
- **Measure the crop at rest.** Sizing the frame to the component's resting state
  keeps the composition stable while content filters in and out.
