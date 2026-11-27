// Small turning crystal inspired by Sprite Fusion snow via Patch pixelfx.
// MIT, Copyright (c) 2026 Hugo Duprez and Patch. See public/licenses/pixelfx.txt.
import { fit, TAU } from '../../core/index.js';
export const meta = {
  name: 'Village snow',
  desc: 'A pale crystal turns between a cross and a small diamond.',
  tags: ['village', 'winter'],
  size: [10, 10],
  origin: [5, 5],
  duration: 2,
  loop: true,
  fps: 8,
  bg: 'dark',
  options: { palette: ['#91b4ac', '#b5d0c2', '#d8e2cd', '#fff0c7'], seed: 1 },
};
export function draw(p, t, o) {
  const C = fit(o.palette, 4),
    turn = Math.cos((t / 2) * TAU) > 0;
  p.px(0, 0, C[2]);
  const axes = turn
    ? [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]
    : [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ];
  for (const [x, y] of axes) p.px(x, y, C[1]);
}
