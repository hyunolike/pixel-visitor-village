import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const origin = process.argv[2],
  out = process.argv[3],
  sourceOrigin = process.argv[4] ?? 'http://127.0.0.1:5199';
const checkPalette = process.argv[5] !== 'baseline';
if (!origin || !out)
  throw new Error(
    'Usage: node scripts/media/capture-art.mjs PAGE_ORIGIN OUT_DIRECTORY [VITE_SOURCE_ORIGIN]',
  );
await mkdir(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const errors = [];
try {
  for (const width of [1487, 390]) {
    const p = await b.newPage({
      viewport: { width, height: width === 1487 ? 1058 : 844 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(origin);
    await p.waitForFunction(() => document.querySelector('visitor-village')?.ready);
    for (const season of ['summer', 'spring', 'autumn', 'winter', 'christmas']) {
      await p.locator(`[data-home-season=${season}]`).click();
      await expect(p.locator('visitor-village')).toHaveAttribute('data-scene-season', season);
      await p.evaluate(() => document.fonts.ready);
      await p.screenshot({ path: `${out}/home-${season}-${width}.png` });
    }
    await p.goto(origin + '/install?lang=ko&season=summer');
    await p.waitForFunction(() => document.querySelector('visitor-village')?.ready);
    await expect(p.locator('visitor-village')).toHaveAttribute('data-scene-state', 'ready');
    await p.screenshot({ path: `${out}/install-${width}.png` });
    if (width === 1487) {
      await p.evaluate(() => {
        const el = document.createElement('visitor-village');
        el.id = 'native-capture';
        el.setAttribute('count', '12');
        el.setAttribute('paused', '');
        el.style.cssText = 'position:fixed;top:0;left:0;width:744px;height:422px;z-index:9999';
        document.body.append(el);
      });
      await p.waitForFunction(() => document.querySelector('#native-capture')?.ready);
      for (const season of ['spring', 'summer', 'autumn', 'winter', 'christmas']) {
        await p
          .locator('#native-capture')
          .evaluate((el, season) => el.setAttribute('season', season), season);
        await p.locator('#native-capture').screenshot({ path: `${out}/default-${season}.png` });
      }
    }
    await p.close();
  }
  const p = await b.newPage();
  await p.goto(sourceOrigin);
  const data = await p.evaluate(async (checkPalette) => {
    const c = await import('/src/characters.ts'),
      e = await import('/src/environment.ts'),
      h = await import('/src/holiday-art.ts'),
      s = await import('/src/social-art.ts'),
      art = await import('/src/art.ts');
    const allowed = checkPalette
      ? new Set((await import('/src/art-palette.ts')).ART_PALETTE.map((c) => c.join(',')))
      : null;
    const result = {},
      jobs = [];
    function record(name, pixels, w, h) {
      let opaquePaletteMisses = 0;
      if (allowed)
        for (let i = 0; i < pixels.length; i += 4)
          if (pixels[i + 3] === 255 && !allowed.has([...pixels.slice(i, i + 3)].join(',')))
            opaquePaletteMisses++;
      const alpha = Uint8Array.from({ length: w * h }, (_, i) => pixels[i * 4 + 3]);
      jobs.push(
        crypto.subtle.digest('SHA-256', alpha).then((hash) => ({
          name,
          opaquePaletteMisses,
          width: w,
          height: h,
          alphaSha256: [...new Uint8Array(hash)]
            .map((n) => n.toString(16).padStart(2, '0'))
            .join(''),
        })),
      );
    }
    function sheet(w, h) {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = '#fff0c7';
      ctx.fillRect(0, 0, w, h);
      ctx.font = '14px sans-serif';
      return { canvas, ctx };
    }
    function raw(ctx, pixels, w, h, x, y, scale) {
      const im = document.createElement('canvas');
      im.width = w;
      im.height = h;
      im.getContext('2d').putImageData(new ImageData(pixels, w, h), 0, 0);
      ctx.drawImage(im, x, y, w * scale, h * scale);
    }
    for (let st = 0; st < 8; st++)
      for (const face of c.VISITOR_FACINGS)
        for (let frame = 0; frame < 8; frame++)
          record(`visitor-${st}-${face}-${frame}`, c.visitorPixels(st, face, frame), 20, 28);
    for (const kind of ['santa', 'rudolph'])
      for (let f = 0; f < 2; f++) record(`holiday-${kind}-${f}`, h.holidayPixels(kind, f), 32, 36);
    for (const kind of s.SOCIAL_EMOTES) record('bubble-' + kind, s.socialPixels(kind), 18, 14);
    for (const [name, canvas] of [
      ['fallback-monument', art.monumentArt()],
      ['tree-glow', art.treeGlow()],
    ])
      record(
        name,
        canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data,
        canvas.width,
        canvas.height,
      );
    let a = sheet(1920, 560);
    for (let style = 0; style < 8; style++) {
      const x = (style % 4) * 480,
        y = Math.floor(style / 4) * 280;
      a.ctx.fillStyle = '#173c2c';
      a.ctx.fillText(c.VISITOR_STYLES[style].name, x + 8, y + 18);
      for (let f = 0; f < 3; f++)
        for (let frame = 0; frame < 8; frame++)
          raw(
            a.ctx,
            c.visitorPixels(style, c.VISITOR_FACINGS[f], frame),
            20,
            28,
            x + frame * 60,
            y + 24 + f * 84,
            3,
          );
    }
    result.characters = a.canvas.toDataURL();
    a = sheet(1680, 1100);
    const seasons = ['spring', 'summer', 'autumn', 'winter', 'christmas'],
      kinds = ['cottage', 'shop', 'cabin', 'lamp', 'bench', 'sign', 'fence'];
    for (let row = 0; row < 5; row++) {
      const scene = e.createVillageScene(744, 422, seasons[row], true),
        objects = scene.objects;
      record(
        'ground-' + seasons[row],
        scene.ground.getContext('2d').getImageData(0, 0, 744, 422).data,
        744,
        422,
      );
      const tree = art.seasonalTree(seasons[row]);
      record(
        'fallback-' + seasons[row],
        tree.getContext('2d').getImageData(0, 0, 180, 180).data,
        180,
        180,
      );
      for (const o of objects)
        record(
          `prop-${seasons[row]}-${o.kind}-${o.x}`,
          o.canvas.getContext('2d').getImageData(0, 0, o.canvas.width, o.canvas.height).data,
          o.canvas.width,
          o.canvas.height,
        );
      for (let col = 0; col < kinds.length; col++) {
        const o = objects.find((o) => o.kind === kinds[col]);
        if (!o) continue;
        const scale = Math.min(2.4, 220 / o.width, 180 / o.height);
        a.ctx.drawImage(
          o.canvas,
          col * 240 + 12,
          row * 220 + 28,
          o.width * scale,
          o.height * scale,
        );
        a.ctx.fillStyle = '#173c2c';
        a.ctx.fillText(seasons[row] + ' / ' + kinds[col], col * 240 + 12, row * 220 + 18);
      }
    }
    result.props = a.canvas.toDataURL();
    a = sheet(640, 250);
    for (let i = 0; i < 2; i++)
      for (let frame = 0; frame < 2; frame++)
        raw(
          a.ctx,
          h.holidayPixels(i ? 'rudolph' : 'santa', frame),
          32,
          36,
          (i * 2 + frame) * 160,
          20,
          4,
        );
    for (let i = 0; i < 3; i++)
      raw(a.ctx, s.socialPixels(s.SOCIAL_EMOTES[i]), 18, 14, i * 160 + 20, 180, 4);
    result.emotes = a.canvas.toDataURL();
    return { images: result, metrics: await Promise.all(jobs) };
  }, checkPalette);
  if (checkPalette) {
    const baseline = JSON.parse(
      await readFile(
        new URL('../../assets/concepts/cohesive-20261126/baseline-native.json', import.meta.url),
        'utf8',
      ),
    );
    const current = new Map(data.metrics.map((x) => [x.name, x]));
    if (baseline.length !== current.size) throw new Error('Native fixture count changed');
    for (const item of baseline) {
      const now = current.get(item.name);
      if (
        !now ||
        ['width', 'height', 'alphaSha256'].some((k) => now[k] !== item[k]) ||
        now.opaquePaletteMisses
      )
        throw new Error('Native art contract failed: ' + item.name);
    }
    await writeFile(
      out + '/native-check.json',
      JSON.stringify(
        { checked: current.size, exactAlphaAndDimensions: true, opaquePaletteMisses: 0 },
        null,
        2,
      ),
    );
  }
  await writeFile(out + '/native.json', JSON.stringify(data.metrics, null, 2));
  for (const [name, dataURL] of Object.entries(data.images))
    await writeFile(out + '/' + name + '.png', Buffer.from(dataURL.split(',')[1], 'base64'));
  await writeFile(out + '/errors.json', JSON.stringify(errors));
  console.log(
    'Captured 5 seasons desktop/mobile, installer, 192 character poses, props and holiday/emotes. Errors: ' +
      errors.length,
  );
  await p.close();
} finally {
  await b.close();
}
