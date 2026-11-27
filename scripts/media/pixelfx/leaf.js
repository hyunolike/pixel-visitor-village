// Pendulum/turning leaf technique adapted from Sprite Fusion falling-leaves via Patch pixelfx.
// MIT, Copyright (c) 2026 Hugo Duprez and Patch. See public/licenses/pixelfx.txt.
import { fit, TAU } from '../../core/index.js';
export const meta = {
  name: 'Village leaf',
  desc: 'An ochre leaf rolls to reveal a pale face and a dark vein.',
  tags: ['village', 'autumn'],
  size: [14, 14],
  origin: [7, 7],
  duration: 2,
  loop: true,
  fps: 8,
  bg: 'light',
  options: { palette: ['#6a4930', '#9b653d', '#c78d4b', '#e2b66b', '#fff0c7'], seed: 1 },
};
export function draw(p, t, o) {
  const C = fit(o.palette, 5),
    phase = (t / 2) * TAU,
    angle = 0.35 + 0.8 * Math.sin(phase),
    c = Math.cos(angle),
    s = Math.sin(angle),
    flip = 0.35 + 0.65 * Math.abs(Math.cos(phase));
  p.shade(-5, -5, 5, 5, (x, y, out) => {
    const u = (x * c + y * s) / 4,
      v = (-x * s + y * c) / (2.2 * flip);
    if (Math.abs(u) >= 1 || v * v > (1 - u * u) * (1 + 0.32 * Math.cos(u * 10))) return;
    out.c = Math.abs(v) < 0.24 ? C[0] : v < -0.2 ? C[3] : v > 0.5 ? C[1] : C[2];
  });
  p.line(-4 * c, -4 * s, -2 * c, -2 * s, C[0]);
}
