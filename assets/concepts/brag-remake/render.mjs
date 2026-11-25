// Renders compose/index.html frame by frame.
//   node render.mjs stills 0,50,101   -> work/stills/fNNNN.png
//   node render.mjs full              -> work/video-only.mp4 (600 frames, 30fps, lossless-ish x264 crf 12)
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const WORK = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [mode, list] = process.argv.slice(2);
const counts = JSON.parse(fs.readFileSync(path.join(WORK, 'logs', 'christmas.json'), 'utf8'))
  .map(r => Number((/오늘 방문 (\d+)/.exec(r.notice) || [0, 24])[1]));

const browser = await chromium.launch({ channel: 'chrome', args: ['--allow-file-access-from-files', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('console', m => { if (m.type() === 'error') console.error('console', m.text()); });
await page.goto('file://' + path.join(WORK, 'compose', 'index.html'));
await page.evaluate(c => window.setCounts(c), counts);
await page.evaluate(() => document.fonts.ready);

async function shot(f) {
  await page.evaluate(f => window.renderFrame(f), f);
  return page.screenshot({ type: 'png' });
}

if (mode === 'stills') {
  const dir = path.join(WORK, 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const f of list.split(',').map(Number)) fs.writeFileSync(path.join(dir, `f${String(f).padStart(4, '0')}.png`), await shot(f));
  console.log('stills', list);
} else if (mode === 'full') {
  const out = path.join(WORK, 'video-only.mp4');
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < 600; f++) {
    const buf = await shot(f);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 60 === 0) console.log('frame', f);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', c => c === 0 ? r() : j(new Error('ffmpeg ' + c))));
  console.log('wrote', out);
}
await browser.close();
