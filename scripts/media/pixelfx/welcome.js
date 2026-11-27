// Curving star pickup technique adapted from Sprite Fusion pickup via Patch pixelfx.
// MIT, Copyright (c) 2026 Hugo Duprez and Patch. See public/licenses/pixelfx.txt.
import { fit, rand, ease, TAU } from '../../core/index.js';
export const meta = {
  name: 'Village welcome',
  desc: 'Six warm glints gather by the well, rise, and wink out.',
  tags: ['village', 'arrival'],
  size: [64, 64],
  origin: [32, 40],
  duration: 1.5,
  loop: false,
  fps: 16,
  bg: 'ground',
  options: { palette: ['#88613c', '#bb8a47', '#e2b66b', '#f5d48c', '#fff0c7'], seed: 3 },
};
export function draw(p, t, o) {
  if (t <= 0 || t >= 1.5) return;
  const C = fit(o.palette, 5),
    attack = Math.min(1, t / 0.16),
    fade = Math.min(1, (1.5 - t) / 0.5);
  for (let i = 0; i < 6; i++) {
    const delay = rand(o.seed, i, 1) * 0.22,
      a = Math.max(0, t - delay),
      u = Math.min(1, a / 1.15),
      ang = (i / 6) * TAU + 0.3;
    const r = 3 + ease.outCubic(u) * 14,
      x = Math.cos(ang) * r,
      y = -7 + Math.sin(ang) * r * 0.55 - u * 8;
    const tw = 0.5 + 0.5 * Math.sin(a * 13 + i),
      alpha = attack * fade * Math.min(1, a * 12);
    p.dot(x, y, C[3], alpha);
    if (tw > 0.55 && u < 0.8) {
      p.dot(x - 1, y, C[2], alpha);
      p.dot(x + 1, y, C[4], alpha);
      p.dot(x, y - 1, C[4], alpha);
      p.dot(x, y + 1, C[2], alpha);
    }
    p.glow(x, y, 3, C[3], alpha * 0.12);
  }
}
