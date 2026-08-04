// Records a component on a running site page as a share-ready MP4.
//
// It drives the real page in Chrome — no recreation — isolates one section from
// the surrounding docs chrome, overlays a synthetic cursor (CDP screencast does
// not capture the real pointer), captures frames, and encodes with ffmpeg.
//
// Currently choreographed for the workbench "Search + filter" table apron. To
// clip a different component, keep everything except the CHOREOGRAPHY block and
// rewrite that: the isolation, cursor, capture and encode stages are generic.
//
// Usage — see ./README.md. Needs a dev server already running on PORT.
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const OUT = process.env.OUT || path.join(process.cwd(), 'out');
const FRAMES = path.join(OUT, 'frames');
const URL = process.env.URL || 'http://localhost:4202/workbench';

// Prefer whatever Chrome puppeteer has cached; fall back to the system install
// so this does not break when the pinned build is upgraded or absent.
function resolveChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = path.join(os.homedir(), '.cache/puppeteer/chrome');
  if (existsSync(cache)) {
    const builds = readdirSync(cache).sort().reverse();
    for (const b of builds) {
      const p = path.join(cache, b, 'chrome-mac-arm64',
        'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
      if (existsSync(p)) return p;
    }
  }
  const system = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (existsSync(system)) return system;
  throw new Error('No Chrome found. Set CHROME_PATH to a Chrome binary.');
}
const CHROME = resolveChrome();

const VW = 1440;
const VH = 900;
const DSF = 2; // retina capture, downscaled on encode so text stays crisp
const FPS = 30;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: process.env.HEADFUL ? false : true, // new headless still composites blur + CSS anim
  defaultViewport: { width: VW, height: VH, deviceScaleFactor: DSF },
  args: [
    '--hide-scrollbars',
    '--force-device-scale-factor=' + DSF,
    '--disable-features=CalculateNativeWinOcclusion',
    `--window-size=${VW},${VH}`,
  ],
});

const page = (await browser.pages())[0];
await page.setViewport({ width: VW, height: VH, deviceScaleFactor: DSF });
await page.emulateMediaFeatures([
  { name: 'prefers-reduced-motion', value: 'no-preference' },
  { name: 'prefers-color-scheme', value: 'light' },
]);

console.log('→ loading', URL);
await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90_000 });
await sleep(1500);

// --- English copy -----------------------------------------------------------
await page.evaluate(() => {
  const en = [...document.querySelectorAll('button')].filter(
    (b) => b.textContent.trim() === 'EN',
  );
  en.forEach((b) => b.click());
});
await sleep(900);

// --- Isolate the section ----------------------------------------------------
const geom = await page.evaluate(() => {
  const sec = [...document.querySelectorAll('.workbench__section')].find((el) =>
    el.querySelector('.workbench__apron-controls'),
  );
  if (!sec) throw new Error('apron section not found');
  sec.id = 'clip-target';

  // Park the section alone in a clean viewport: hide siblings + page chrome so
  // the crop is the component, not the docs page around it.
  const keep = new Set();
  for (let n = sec; n && n !== document.documentElement; n = n.parentElement) keep.add(n);
  const walk = (node) => {
    for (const child of node.children) {
      if (child === sec) continue;
      if (keep.has(child)) walk(child);
      else child.style.display = 'none';
    }
  };
  walk(document.body);

  document.documentElement.style.background = getComputedStyle(document.body).backgroundColor;
  document.body.style.margin = '0';
  sec.style.padding = '40px 56px 44px';
  sec.style.margin = '0';
  sec.style.maxWidth = 'none';

  // Long explanatory paragraph is docs furniture, not part of the component.
  sec.querySelector('.workbench__hint')?.style.setProperty('display', 'none');

  window.scrollTo(0, 0);
  const r = sec.getBoundingClientRect();

  // The section paints on an ancestor's background — walk up for the first
  // opaque one so the letterbox matches the page instead of going black.
  let bg = [255, 255, 255];
  for (let n = sec; n; n = n.parentElement) {
    const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
    if (m && (m.length < 4 || parseFloat(m[3]) > 0)) {
      bg = m.slice(0, 3).map(Number);
      break;
    }
  }
  const hex = '0x' + bg.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
  return { x: r.x, y: r.y, w: r.width, h: r.height, bg: hex };
});
console.log('→ section geometry', geom);

// --- Synthetic cursor -------------------------------------------------------
await page.evaluate(() => {
  const c = document.createElement('div');
  c.id = '__cursor';
  c.innerHTML = `<svg width="26" height="30" viewBox="0 0 26 30" fill="none">
    <path d="M4 2.5 L4 23 L9.2 18.2 L12.6 26.5 L16.4 24.9 L13 16.8 L20 16.4 Z"
      fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  Object.assign(c.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    zIndex: '2147483647',
    pointerEvents: 'none',
    transform: 'translate(-100px,-100px)',
    transition: 'transform 480ms cubic-bezier(.33,.9,.28,1)',
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,.28))',
    willChange: 'transform',
  });
  const ring = document.createElement('div');
  ring.id = '__cursor_ring';
  Object.assign(ring.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '34px',
    height: '34px',
    marginLeft: '-17px',
    marginTop: '-17px',
    borderRadius: '50%',
    background: 'rgba(17,17,17,.16)',
    zIndex: '2147483646',
    pointerEvents: 'none',
    opacity: '0',
    transform: 'translate(-100px,-100px) scale(.3)',
    willChange: 'transform,opacity',
  });
  // CDP screencast emits a frame only when Chrome paints, so a page sitting
  // still produces nothing and a "hold" silently collapses to zero frames.
  // This ticker keeps the compositor busy. It sits in the bottom-right corner,
  // outside the crop region, so it never reaches the video.
  const ticker = document.createElement('div');
  Object.assign(ticker.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '4px',
    height: '4px',
    background: 'rgba(0,0,0,.01)',
    zIndex: '2147483645',
    pointerEvents: 'none',
    animation: '__tick 400ms linear infinite',
  });
  const kf = document.createElement('style');
  kf.textContent = '@keyframes __tick{0%{opacity:.01}50%{opacity:.02}100%{opacity:.01}}';
  document.head.append(kf);

  document.body.append(c, ring, ticker);
  window.__cur = { x: -100, y: -100 };
  window.__moveCursor = (x, y, ms = 480) => {
    c.style.transitionDuration = ms + 'ms';
    c.style.transform = `translate(${x}px,${y}px)`;
    window.__cur = { x, y };
  };
  window.__clickPulse = () => {
    const { x, y } = window.__cur;
    ring.style.transition = 'none';
    ring.style.transform = `translate(${x}px,${y}px) scale(.3)`;
    ring.style.opacity = '.9';
    requestAnimationFrame(() => {
      ring.style.transition = 'transform 420ms ease-out, opacity 420ms ease-out';
      ring.style.transform = `translate(${x}px,${y}px) scale(1.5)`;
      ring.style.opacity = '0';
    });
  };
});

// --- Screencast -------------------------------------------------------------
const client = await page.createCDPSession();
const frames = [];
let t0 = 0;
let armed = false;
client.on('Page.screencastFrame', async ({ data, sessionId, metadata }) => {
  try {
    await client.send('Page.screencastFrameAck', { sessionId });
  } catch {}
  // The first frames after startScreencast can be a stale surface from before
  // the section was isolated — drop everything until we explicitly arm.
  if (!armed) return;
  const ts = metadata.timestamp ? metadata.timestamp * 1000 : Date.now();
  if (!t0) t0 = ts;
  frames.push({ t: ts - t0, data });
});

// Helpers that keep the cursor and the real input in sync.
const boxOf = (sel, nth = 0) =>
  page.evaluate(
    ([s, n]) => {
      const el = document.querySelectorAll(s)[n];
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    },
    [sel, nth],
  );

async function moveTo(sel, nth = 0, ms = 520) {
  const p = await boxOf(sel, nth);
  await page.evaluate(([x, y, m]) => window.__moveCursor(x, y, m), [p.x, p.y, ms]);
  await sleep(ms + 90);
  return p;
}
async function clickAt(p) {
  await page.evaluate(() => window.__clickPulse());
  await page.mouse.click(p.x, p.y);
}
async function typeText(text, perChar = 115) {
  for (const ch of text) {
    await page.keyboard.type(ch);
    await sleep(perChar);
  }
}

const SEARCH_INPUT = '#clip-target afi-search-v2 input';
const CHIP = '#clip-target afi-chip-v2';

console.log('→ recording');
await client.send('Page.startScreencast', {
  format: 'jpeg',
  quality: 92,
  maxWidth: Math.ceil(VW * DSF),
  maxHeight: Math.ceil(VH * DSF),
  everyNthFrame: 1,
});

// --- CHOREOGRAPHY (component-specific — rewrite this block for another clip) --
//
// Cut as a seamless loop: the clip opens and closes on the identical state —
// All selected, search empty, 12/12 rows, cursor parked on the All chip. So it
// is placed there before capture starts rather than flying in from off-screen,
// and the clip ends the moment that state is restored. No dead air at either
// end, because in a loop the tail and the head play back to back.
const allChip = await boxOf(CHIP, 0);
await page.evaluate(([x, y]) => window.__moveCursor(x, y, 0), [allChip.x, allChip.y]);
// Park the *real* pointer there too. The clip ends with it hovering this chip,
// so without this the opening frame lacks the hover fill and the loop pops.
await page.mouse.move(allChip.x, allChip.y);
await sleep(600);

armed = true;
await sleep(350);

// 1 — type a client name
const sp = await moveTo(SEARCH_INPUT, 0, 500);
await clickAt(sp);
await sleep(200);
await typeText('Tessa', 100);
await sleep(450); // typeahead reads for a beat...
await page.keyboard.press('Escape'); // ...then gets out of the table's way
await sleep(1150); // filter + apron token land

// 2 — compound with a status chip
const chip = await moveTo(CHIP, 3, 500); // Closed
await clickAt(chip);
await sleep(1250);

// 3 — clear the search, rows cascade back in (the beat worth the most room)
const clearBtn = await page.evaluate(() => {
  const el = document.querySelector('#clip-target afi-search-v2 button');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
if (clearBtn) {
  await page.evaluate(([x, y]) => window.__moveCursor(x, y, 480), [clearBtn.x, clearBtn.y]);
  await sleep(570);
  await clickAt(clearBtn);
} else {
  const p = await moveTo(SEARCH_INPUT, 0, 480);
  await clickAt(p);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Backspace');
    await sleep(95);
  }
}
await sleep(1450);

// 4 — back to All, landing exactly on the opening frame
await moveTo(CHIP, 0, 500);
await clickAt(allChip);
await sleep(1250);

await client.send('Page.stopScreencast');
console.log(`→ captured ${frames.length} frames over ${(frames.at(-1).t / 1000).toFixed(1)}s`);
await browser.close();

// --- Encode -----------------------------------------------------------------
const list = [];
frames.forEach((f, i) => {
  const name = `f${String(i).padStart(5, '0')}.jpg`;
  writeFileSync(path.join(FRAMES, name), Buffer.from(f.data, 'base64'));
  const next = frames[i + 1];
  const dur = next ? Math.max((next.t - f.t) / 1000, 1 / 240) : 1 / FPS;
  list.push(`file '${name}'\nduration ${dur.toFixed(5)}`);
});
list.push(`file 'f${String(frames.length - 1).padStart(5, '0')}.jpg'`);
writeFileSync(path.join(FRAMES, 'list.txt'), list.join('\n'));

// Crop to the section, on the device-pixel grid, rounded to even numbers.
const cx = Math.round(geom.x * DSF);
const cy = Math.round(geom.y * DSF);
const cw = Math.floor((geom.w * DSF) / 2) * 2;
const ch = Math.floor((geom.h * DSF) / 2) * 2;

// Letterbox the section into a true 16:9 frame on the page's own background,
// so nothing is cut and Twitter gets the aspect it lays out best.
const W = 1280;
const H = 720;
const mp4 = path.join(OUT, 'filter-demo.mp4');

execFileSync(
  'ffmpeg',
  [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', path.join(FRAMES, 'list.txt'),
    '-f', 'lavfi',
    '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-vf',
    [
      `crop=${cw}:${ch}:${cx}:${cy}`,
      // MJPEG frames are full-range; convert to limited so players don't shift contrast.
      `scale=${W}:${H}:force_original_aspect_ratio=decrease:flags=lanczos:in_range=full:out_range=limited`,
      `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:${geom.bg}`,
      `fps=${FPS}`,
      'format=yuv420p',
    ].join(','),
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level', '4.0',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'slow',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-shortest',
    '-movflags', '+faststart',
    mp4,
  ],
  { stdio: 'inherit' },
);
console.log('✓', mp4);
