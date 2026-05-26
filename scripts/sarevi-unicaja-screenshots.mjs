// Capture three PNG screenshots of the Unicaja Sarevi 360 simulator
// (Datos with buscar-dirección = Sí, Medidas, Resumen) via Chrome DevTools
// Protocol over the system Chrome installation. Saves into
//   Afi brand/Unicaja sarevi mayo 2026 screenshots/
//
// Run with the project's dev server already running on port 4202:
//   node scripts/sarevi-unicaja-screenshots.mjs

import { spawn } from 'node:child_process';
import { mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEBUG_PORT = 9222;
const BASE_URL = 'http://localhost:4202/demos/sarevi-unicaja';
const OUT_DIR = path.resolve(
  process.cwd(),
  'Afi brand',
  'Unicaja sarevi mayo 2026 screenshots',
);
const WIDTH = 1440;
const HEIGHT = 900;
const SCALE = 2;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const userDataDir = await mkdtemp(path.join(os.tmpdir(), 'chrome-shot-'));

  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=${WIDTH},${HEIGHT}`,
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { detached: false, stdio: 'ignore' },
  );

  // Wait for the debugger to come up
  let targets = [];
  for (let i = 0; i < 25; i++) {
    await sleep(300);
    try {
      const res = await fetch(`http://localhost:${DEBUG_PORT}/json`);
      targets = await res.json();
      if (targets.some((t) => t.type === 'page')) break;
    } catch {
      /* ignore */
    }
  }
  const pageTarget = targets.find((t) => t.type === 'page');
  if (!pageTarget) {
    chrome.kill();
    throw new Error('Could not find a page target in headless Chrome.');
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', () => res(), { once: true });
    ws.addEventListener('error', rej, { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  });
  function send(method, params = {}) {
    const msgId = ++id;
    return new Promise((resolve, reject) => {
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  // Log everything the page tells us so we can see what's happening in
  // headless Chrome (failed navigations, console errors, etc.).
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log(
        '[console]',
        msg.params.type,
        msg.params.args?.map((a) => a.value ?? a.description).join(' '),
      );
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.log('[exception]', msg.params.exceptionDetails?.text);
    }
    if (msg.method === 'Page.lifecycleEvent') {
      // noisy but helpful
    }
  });
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: SCALE,
    mobile: false,
  });

  async function evaluate(expression) {
    return send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
  }

  async function waitForSelector(selector, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const { result } = await evaluate(
        `!!document.querySelector(${JSON.stringify(selector)})`,
      );
      if (result.value) return;
      await sleep(250);
    }
    const { result: urlResult } = await evaluate(`location.href`);
    const { result: bodyResult } = await evaluate(
      `document.body && document.body.innerText.slice(0,200)`,
    );
    throw new Error(
      `Timed out waiting for ${selector} (url=${urlResult.value}, body="${bodyResult.value}")`,
    );
  }

  async function shot(name) {
    // Let any in-flight animation settle, then capture the full document.
    await sleep(500);
    // The demo-shell uses overflow:hidden on .demo-body, so the simulator
    // scrolls internally and documentElement.scrollHeight only ever reports
    // the viewport height. Temporarily release that clipping and measure
    // the .viewport-frame's content height (its first child) so we know how
    // tall to make the emulated viewport for a full-page capture.
    const { result: heightRes } = await evaluate(`
      (() => {
        const body = document.querySelector('.demo-body');
        const frame = document.querySelector('.viewport-frame');
        if (body) body.style.overflow = 'visible';
        if (frame) {
          frame.style.overflow = 'visible';
          frame.style.height = 'auto';
          frame.style.maxHeight = 'none';
        }
        const target = document.querySelector('.demo-content') ||
                       document.querySelector('.lk-sarevi') ||
                       document.documentElement;
        return Math.max(
          target.scrollHeight,
          target.offsetHeight,
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        );
      })()
    `);
    const contentHeight = Math.min(
      Math.max(heightRes.value || HEIGHT, HEIGHT),
      8000,
    );
    await send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: contentHeight,
      deviceScaleFactor: SCALE,
      mobile: false,
    });
    await sleep(250);
    const { data } = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    // Restore the standard viewport so subsequent interactions stay sane.
    await send('Emulation.setDeviceMetricsOverride', {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: SCALE,
      mobile: false,
    });
    const file = path.join(OUT_DIR, name);
    await writeFile(file, Buffer.from(data, 'base64'));
    console.log('saved', path.relative(process.cwd(), file), `(${contentHeight}px tall)`);
  }

  // Helper — drives the Sarevi page directly via its Angular component
  // instance. The page is built with signals + public setters (setBuscarDir,
  // setCertificado, …) so the cleanest way to fill the simulator with
  // realistic data is to call them, not to click every dropdown.
  async function fillSimulationState() {
    await evaluate(`
      (() => {
        const el = document.querySelector('site-laboral-kutxa-sarevi');
        const cmp = window.ng && window.ng.getComponent
          ? window.ng.getComponent(el)
          : null;
        if (!cmp) return { ok: false, reason: 'no-component' };
        cmp.setTipoVivienda('Piso');
        cmp.setDireccion('Calle Imperial 18');
        cmp.setMunicipio('Málaga');
        cmp.setCertificado('Sí');
        cmp.setEtiqueta('E');
        cmp.setTamano('95 m²');
        cmp.setHabitantes('3 habitantes');
        cmp.setCalefaccion('Caldera de gas natural');
        cmp.setRefrigeracion('Bomba de calor (split)');
        // Selected measures — defaults are ['aero','fv']; add a couple of
        // CAE-eligible reforms to make the resumen numbers realistic.
        if (!cmp.isSelected('sate')) cmp.toggleSelected('sate');
        if (!cmp.isSelected('vent')) cmp.toggleSelected('vent');
        if (!cmp.isSelected('cubierta')) cmp.toggleSelected('cubierta');
        return { ok: true };
      })();
    `);
  }

  // The site sits behind a simple password gate. Hop onto the origin once
  // so we can write to localStorage, mark it unlocked, then navigate to
  // the simulator route for real.
  await send('Page.navigate', { url: 'http://localhost:4202/' });
  await sleep(1500);
  await evaluate(`localStorage.setItem('coherence-unlocked', '1'); 'unlocked'`);

  // ────────────────────────────────────────────────────────────────────
  // 1. Datos — address search + municipio + cert + climate filled
  // ────────────────────────────────────────────────────────────────────
  await send('Page.navigate', { url: BASE_URL });
  await waitForSelector('.choice-card');
  await evaluate(`
    Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('Edificio'))?.click();
  `);
  await waitForSelector('.datos-form-wrap');
  await fillSimulationState();
  await waitForSelector('.unicaja-address-input');
  await sleep(400);
  await shot('01-datos.png');

  // ────────────────────────────────────────────────────────────────────
  // 2. Medidas
  // ────────────────────────────────────────────────────────────────────
  await evaluate(`
    Array.from(document.querySelectorAll('.step'))
      .find(s => s.getAttribute('aria-label')?.startsWith('Medidas'))?.click();
  `);
  await waitForSelector('.medidas-layout');
  await sleep(600);
  await shot('02-medidas.png');

  // ────────────────────────────────────────────────────────────────────
  // 3. Resumen
  // ────────────────────────────────────────────────────────────────────
  await evaluate(`
    Array.from(document.querySelectorAll('.step'))
      .find(s => s.getAttribute('aria-label')?.startsWith('Resumen'))?.click();
  `);
  await waitForSelector('.unicaja-loan');
  await sleep(600);
  await shot('03-resumen.png');

  ws.close();
  chrome.kill();
  await rm(userDataDir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
