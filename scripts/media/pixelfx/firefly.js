// Breathing lantern technique adapted from Sprite Fusion fireflies via Patch pixelfx.
// MIT, Copyright (c) 2026 Hugo Duprez and Patch. See public/licenses/pixelfx.txt.
import { fit, TAU } from '../../core/index.js';
export const meta = {
  name: 'Village firefly',
  desc: 'A tiny olive lantern breathes with a low warm halo.',
  tags: ['village', 'summer'],
  size: [16, 16],
  origin: [8, 8],
  duration: 3,
  loop: true,
  fps: 8,
  bg: 'dark',
  options: { palette: ['#52623e', '#879252', '#b8b873', '#e2cf88', '#fff0c7'], seed: 1 },
};
export function draw(p, t, o) {
  const C = fit(o.palette, 5),
    g = (1 - Math.cos((t / 3) * TAU)) * 0.5;
  p.px(0, 0, C[0]);
  if (g < 0.15) return;
  p.px(-1, 0, g > 0.7 ? C[4] : C[2]);
  p.px(0, -1, C[1]);
  p.glow(-0.5, 0.5, 5, C[3], g * 0.28);
  if (g > 0.8) {
    p.dot(-2, 0, C[3], (g - 0.8) * 3);
    p.dot(-1, -1, C[3], (g - 0.8) * 3);
  }
}
