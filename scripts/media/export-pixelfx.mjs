import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const repo = fileURLToPath(new URL('../..', import.meta.url));
const checkout = resolve(process.argv[2] ?? '');
const commit = '5294518ce7c72e48b6100a744596e0acf57f2826';
if (
  !process.argv[2] ||
  execFileSync('git', ['rev-parse', 'HEAD'], { cwd: checkout, encoding: 'utf8' }).trim() !== commit
)
  throw new Error('Pass the pinned pixelfx checkout');
const kinds = ['petal', 'leaf', 'firefly', 'snow', 'welcome'];
const target = join(checkout, 'src/fx/village');
mkdirSync(target, { recursive: true });
for (const kind of kinds)
  copyFileSync(join(repo, 'scripts/media/pixelfx', kind + '.js'), join(target, kind + '.js'));
const { loadEffect, renderFrames, contactSheet } = await import(
  pathToFileURL(join(checkout, 'tools/lib/fxlib.mjs'))
);
const { encodePNG } = await import(pathToFileURL(join(checkout, 'tools/lib/png.mjs')));
const rendered = [];
let height = 0;
const evidence = join(repo, 'docs/assets/pixelfx', process.argv[3] ?? 'final');
mkdirSync(evidence, { recursive: true });
for (const kind of kinds) {
  const fx = await loadEffect('village/' + kind),
    r = renderFrames(fx, { bg: kind === 'welcome' ? 'ground' : 'dark' });
  rendered.push({ kind, fx, r, y: height });
  height += Math.ceil(r.n / 8) * r.h;
  writeFileSync(
    join(evidence, kind + '.png'),
    contactSheet(fx, r, { max: 12, zoom: kind === 'welcome' ? 2 : 5 }),
  );
}
const width = 512,
  rgba = new Uint8Array(width * height * 4),
  effects = {};
for (const { kind, fx, r, y } of rendered) {
  const frames = [];
  r.frames.forEach((f, i) => {
    const x = (i % 8) * r.w,
      top = y + Math.floor(i / 8) * r.h;
    for (let row = 0; row < r.h; row++)
      rgba.set(f.clear.subarray(row * r.w * 4, (row + 1) * r.w * 4), ((top + row) * width + x) * 4);
    frames.push({ x, y: top, w: r.w, h: r.h });
  });
  effects[kind] = {
    fps: r.fps,
    duration: fx.meta.duration,
    loop: fx.meta.loop,
    pivot: fx.meta.origin,
    frames,
  };
}
const png = encodePNG(width, height, rgba);
if (png.length > 65536 || width * height * 4 > 2097152)
  throw new Error('Widget effects budget exceeded');
const out = join(repo, 'src/assets/effects');
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'village-fx.png'), png);
writeFileSync(
  join(out, 'village-fx.json'),
  JSON.stringify({ width, height, effects }, null, 2) + '\n',
);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const report = {
  upstream: 'patch-gg/pixelfx',
  commit,
  width,
  height,
  pngBytes: png.length,
  decodedBytes: rgba.length,
  sha256: sha(png),
  sources: Object.fromEntries(kinds.map((k) => [k, sha(readFileSync(join(target, k + '.js')))])),
};
writeFileSync(join(evidence, 'export.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
