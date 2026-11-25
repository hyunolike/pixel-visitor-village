// Drives the real <visitor-village> widget frame by frame and saves PNG frames.
// Usage: node capture.mjs <job> [--dry]
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = 'http://127.0.0.1:5291/brag-output/claude-brag-remake-20261125/work/capture/index.html';
const [job, flag] = process.argv.slice(2);
const dry = flag === '--dry';

// Video timing (30fps). Beat = 60/88.25s.
const jobs = {
  // Hook + greeting + cameo: one continuous Christmas take, count climbs 0 -> 24.
  christmas: {
    // Count ramp frames 8..78 (ease-out), 0 -> 24.
    query: 'season=christmas&count=0&seed=11', frames: 266, warm: 0, ramp: [8, 78],
    cameoAt: 150,
  },
  spring: { query: 'season=spring&count=24&seed=5', frames: 164, warm: 120 },
  summer: { query: 'season=summer&count=24&seed=5', frames: 164, warm: 120 },
  autumn: { query: 'season=autumn&count=24&seed=5', frames: 164, warm: 120 },
  winter: { query: 'season=winter&count=24&seed=5', frames: 164, warm: 120 },
  outro: { query: 'season=christmas&count=24&seed=23', frames: 92, warm: 150 },
};
const spec = jobs[job];
if (!spec) { console.error('unknown job', job); process.exit(1); }

const out = path.join(ROOT, 'frames', job);
if (!dry) fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('pageerror', e.message));
await page.goto(`${BASE}?${spec.query}`);
await page.waitForFunction(() => window.cap);
await page.evaluate(() => window.cap.ready());
await page.waitForTimeout(300);
if (spec.warm) await page.evaluate(n => window.cap.step(n), spec.warm);
const log = [];
for (let f = 0; f < spec.frames; f++) {
  if (spec.ramp) {
    const [a, b] = spec.ramp;
    if (f >= a && f <= b) { const p = (f - a) / (b - a); const c = Math.round(24 * (1 - Math.pow(1 - p, 2.2))); await page.evaluate(c => window.cap.setCount(c), c); }
  }
  if (spec.cameoAt === f) await page.evaluate(() => window.cap.spawnCameo());
  await page.evaluate(() => window.cap.step(1));
  const st = await page.evaluate(() => window.cap.state());
  log.push({ f, ...st });
  if (!dry) await page.screenshot({ path: path.join(out, `${String(f).padStart(4, '0')}.png`), type: 'png' });
}
fs.mkdirSync(path.join(ROOT, 'logs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'logs', `${job}${dry ? '-dry' : ''}.json`), JSON.stringify(log));
await browser.close();
console.log(job, dry ? 'dry' : 'captured', spec.frames, 'frames');
