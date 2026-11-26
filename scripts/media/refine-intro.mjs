// Adapt the preserved brag composition to the current verified product build.
import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { chromium, expect } from '@playwright/test';

const source = 'assets/concepts/refinement-20261126';
const work = resolve('brag-output/refinement-20261126/work');
const origin = process.env.MEDIA_ORIGIN ?? 'http://127.0.0.1:5208';
const stage = process.argv[2];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const exec = (command, args, capture = false) => new Promise((resolve, reject) => {
  const child = spawn(command, args, { stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit' });
  let stdout = '', stderr = '';
  if (capture) { child.stdout.on('data', d => stdout += d); child.stderr.on('data', d => stderr += d); }
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`${command} exited ${code}\n${stderr}`)));
});
const bundleHash = async () => hash(await readFile('dist/widget/visitor-village.js'));

async function prepare() {
  for (const dir of ['capture', 'compose/fonts', 'compose/art', 'frames/installer', 'logs', 'scripts', 'audio', 'stills', 'previous']) await mkdir(`${work}/${dir}`, { recursive: true });
  for (const [from, to] of [['capture.html', 'capture/index.html'], ['composition.html', 'compose/index.html'], ['capture.mjs', 'scripts/capture.mjs'], ['render.mjs', 'scripts/render.mjs']]) await copyFile(`${source}/${from}`, `${work}/${to}`);
  for (const font of ['neodgm-1.600.woff2', 'pretendard-variable-1.3.9.woff2']) await copyFile(`src/assets/fonts/${font}`, `${work}/compose/fonts/${font}`);
  await copyFile('src/assets/cozy/tree-summer.png', `${work}/compose/art/tree-summer.png`);
  const baseline = '5bea9201da858c200b0a81b4c965e3eec49edd5a';
  const audioSource = spawn('git', ['show', `${baseline}:public/media/intro.mp4`], { stdio: ['ignore', 'pipe', 'inherit'] });
  const completed = new Promise((resolve, reject) => { audioSource.on('error', reject); audioSource.on('close', code => code === 0 ? resolve() : reject(new Error('Fetch the documented media baseline commit before preparing audio.'))); });
  await Promise.all([pipeline(audioSource.stdout, createWriteStream(`${work}/audio/reference.mp4`)), completed]);
  await exec('ffmpeg', ['-y', '-v', 'error', '-i', `${work}/audio/reference.mp4`, '-vn', '-c:a', 'copy', '-map_metadata', '-1', `${work}/audio/mix.m4a`]);
  for (const path of ['public/media/intro.mp4', 'public/media/intro-poster.jpg', 'docs/assets/intro-preview.gif']) {
    const backup = `${work}/previous/${path.split('/').at(-1)}`;
    try { await access(backup); } catch { await copyFile(path, backup); }
  }
  await writeFile(`${work}/prepared.json`, JSON.stringify({ bundleSha256: await bundleHash(), audioSha256: hash(await readFile(`${work}/audio/mix.m4a`)), audioBaselineCommit: baseline, source, origin }, null, 2));
  console.log('Prepared current fonts, tree logo, composition and credited audio.');
}

async function captureInstaller() {
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 1728, height: 960 }, deviceScaleFactor: 1 });
    await page.route('https://pixel-visitor-village.pages.dev/**', async route => {
      const url = new URL(route.request().url());
      const response = await route.fetch({ url: `${origin}${url.pathname}${url.search}` });
      await route.fulfill({ response });
    });
    await page.goto('https://pixel-visitor-village.pages.dev/install.html?lang=ko');
    await page.waitForFunction(() => document.querySelector('visitor-village')?.ready);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#preview-pause').click();
    await page.evaluate(() => scrollTo(0, 0));
    const frames = [];
    for (let f = 0; f < 150; f++) {
      if (f === 20) await page.locator('input[name=season][value=summer]').check();
      if (f === 40) { await page.locator('#create-code').click(); await expect(page.locator('#install-code')).toHaveValue(/season="summer"/); await page.locator('#install-code').scrollIntoViewIfNeeded(); }
      await page.screenshot({ path: `${work}/frames/installer/${String(f).padStart(4, '0')}.png` });
      if (f % 30 === 0) frames.push({ frame: f, scrollY: await page.evaluate(() => scrollY), address: await page.locator('#blog-url').inputValue(), codeVisible: await page.locator('#install-code').isVisible() });
    }
    const code = await page.locator('#install-code').inputValue();
    if (!code.includes('[##_count_today_##]') || !code.includes('https://pixel-visitor-village.pages.dev/widget/visitor-village.js')) throw new Error('Incorrect code in captured installer');
    await writeFile(`${work}/logs/installer.json`, JSON.stringify({ frames, code, description: 'Current built installer. Blank optional address; actual season/code actions. Public origin with local build bytes.' }, null, 2));
  } finally { await browser.close(); }
}

async function capture() {
  const before = JSON.parse(await readFile(`${work}/prepared.json`, 'utf8'));
  if (await bundleHash() !== before.bundleSha256) throw new Error('Build changed since prepare');
  for (const job of ['christmas', 'spring', 'summer', 'autumn', 'winter', 'outro']) await exec(process.execPath, [`${work}/scripts/capture.mjs`, job]);
  await captureInstaller();
  if (await bundleHash() !== before.bundleSha256) throw new Error('Build changed during capture');
}

async function stills() {
  await exec(process.execPath, [`${work}/scripts/render.mjs`, 'stills', '0,90,98,180,202,264,270,299,333,360,367,400,435,510,525,585,599']);
  await mkdir('docs/assets/refinement', { recursive: true });
  const frameNumbers = [90, 180, 270, 360, 435, 585];
  const inputs = frameNumbers.flatMap(f => ['-i', `${work}/stills/f${String(f).padStart(4, '0')}.png`]);
  const filters = frameNumbers.map((_, i) => `[${i}:v]scale=640:360[s${i}]`).join(';') + ';[s0][s1][s2]hstack=inputs=3[top];[s3][s4][s5]hstack=inputs=3[bottom];[top][bottom]vstack=inputs=2[out]';
  await exec('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', filters, '-map', '[out]', '-frames:v', '1', 'docs/assets/refinement/video-contact.png']);
}

async function finalize() {
  const poster = `${work}/stills/f0585.png`;
  await exec('ffmpeg', ['-y', '-v', 'error', '-i', `${work}/video-only.mp4`, '-loop', '1', '-framerate', '30', '-i', poster, '-i', `${work}/audio/mix.m4a`, '-filter_complex', "[0:v][1:v]overlay=enable='eq(n,0)':format=auto,format=yuv420p[v]", '-map', '[v]', '-map', '2:a:0', '-t', '20', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'copy', '-movflags', '+faststart', `${work}/intro-final.mp4`]);
  await copyFile(`${work}/intro-final.mp4`, 'public/media/intro.mp4');
  await exec('ffmpeg', ['-y', '-v', 'error', '-i', poster, '-frames:v', '1', '-q:v', '2', 'public/media/intro-poster.jpg']);
  await exec('ffmpeg', ['-y', '-v', 'error', '-ss', '0.066667', '-i', 'public/media/intro.mp4', '-t', '7', '-filter_complex', '[0:v]fps=12,scale=720:405:flags=neighbor,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a', '-loop', '0', 'docs/assets/intro-preview.gif']);
}

async function verify() {
  const probe = JSON.parse((await exec('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', 'public/media/intro.mp4'], true)).stdout);
  const video = probe.streams.find(s => s.codec_type === 'video');
  if (video.width !== 1920 || video.height !== 1080 || video.r_frame_rate !== '30/1' || video.nb_frames !== '600' || video.codec_name !== 'h264' || !probe.streams.some(s => s.codec_name === 'aac') || Math.abs(Number(probe.format.duration) - 20) > 1 / 30) throw new Error('Unexpected final media format');
  const black = await exec('ffmpeg', ['-hide_banner', '-i', 'public/media/intro.mp4', '-vf', 'blackdetect=d=0.1:pix_th=0.1:pic_th=0.98', '-an', '-f', 'null', '-'], true);
  if (/black_start:/.test(black.stderr)) throw new Error('Unexpected black segment in final video');
  for (const time of [0, 3, 6, 9, 12, 14.5, 17, 19.5]) await exec('ffmpeg', ['-y', '-v', 'error', '-ss', String(time), '-i', 'public/media/intro.mp4', '-frames:v', '1', `${work}/stills/decoded-${time}.png`]);
  const files = {};
  for (const path of ['public/media/intro.mp4', 'public/media/intro-poster.jpg', 'docs/assets/intro-preview.gif']) { const bytes = await readFile(path); files[path] = { bytes: bytes.length, sha256: hash(bytes) }; }
  const prepared = JSON.parse(await readFile(`${work}/prepared.json`, 'utf8'));
  await writeFile('docs/features/visitor-village/reviews/refinement-media.json', JSON.stringify({ description: 'Codex adaptation of preserved brag-slim sources; no new Claude Code invocation.', prepared, probe, files, blackSegments: [], decodedFrames: [0, 3, 6, 9, 12, 14.5, 17, 19.5], music: 'Sascha Ende — Happy Beats (Business Moves Vol.10), CC BY4.0; existing mixed audio reused.' }, null, 2));
  console.log(JSON.stringify(files));
}

if (stage === 'prepare') await prepare();
else if (stage === 'capture') await capture();
else if (stage === 'stills') await stills();
else if (stage === 'render') await exec(process.execPath, [`${work}/scripts/render.mjs`, 'full']);
else if (stage === 'finalize') await finalize();
else if (stage === 'verify') await verify();
else throw new Error('Choose prepare, capture, stills, render, finalize, or verify');
