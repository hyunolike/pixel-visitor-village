// Turning petal technique adapted from Sprite Fusion falling-leaves via Patch pixelfx.
// MIT, Copyright (c) 2026 Hugo Duprez and Patch. See public/licenses/pixelfx.txt.
import { fit, TAU } from '../../core/index.js';
export const meta = {
  name: 'Village petal',
  desc: 'A small notched petal turns in the breeze.',
  tags: ['village', 'spring'],
  size: [12, 12],
  origin: [6, 6],
  duration: 2,
  loop: true,
  fps: 8,
  bg: 'light',
  options: { palette: ['#96545b', '#c47c7d', '#e5a1a0', '#f4c5b5', '#fff0c7'], seed: 1 },
};
export function draw(p, t, o) {
  const C = fit(o.palette, 5),
    phase = (t / 2) * TAU,
    angle = 0.5 * Math.sin(phase),
    c = Math.cos(angle),
    s = Math.sin(angle),
    flip = 0.3 + 0.7 * Math.abs(Math.cos(phase));
  p.shade(-4, -4, 4, 4, (x, y, out) => {
    const u = (x * c + y * s) / 3,
      v = (-x * s + y * c) / (2 * flip);
    if (Math.abs(u) >= 1 || v * v > (1 - u * u) * 0.6 || (u > 0.55 && Math.abs(v) < 0.2)) return;
    out.c = u < -0.5 ? C[0] : v < -0.25 ? C[3] : v > 0.35 ? C[1] : C[2];
  });
}
