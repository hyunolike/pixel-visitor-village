import { describe, expect, it } from 'vitest';
import {
  VillageEffects,
  ambientParticles,
  effectFrame,
  shouldCelebrateArrival,
} from './village-effects';

describe('village effects timing and count truth', () => {
  it('celebrates only a fresh positive reading on the current Korean day', () => {
    const base = { delta: 1, day: '2026-11-27', today: '2026-11-27', fresh: true };
    expect(shouldCelebrateArrival(base)).toBe(true);
    for (const change of [
      { delta: 0 },
      { delta: -1 },
      { delta: NaN },
      { day: '2026-11-26' },
      { fresh: false },
    ])
      expect(shouldCelebrateArrival({ ...base, ...change })).toBe(false);
  });
  it('keeps one 1.5 second burst, ignores repeats and ends without a queued burst', () => {
    const fx = new VillageEffects();
    expect(fx.burstAge).toBeNull();
    expect(fx.celebrate()).toBe(true);
    fx.step(0.1);
    expect(fx.celebrate()).toBe(false);
    expect(fx.burstAge).toBeCloseTo(0.1);
    for (let i = 0; i < 15; i++) fx.step(0.1);
    expect(fx.burstAge).toBeNull();
    expect(fx.celebrate()).toBe(true);
  });
  it('ignores invalid time and caps a delayed frame to 0.1 seconds', () => {
    const fx = new VillageEffects();
    fx.celebrate();
    for (const dt of [-1, NaN, Infinity]) fx.step(dt);
    expect(fx.elapsed).toBe(0);
    expect(fx.burstAge).toBe(0);
    fx.step(80);
    expect(fx.elapsed).toBe(0.1);
    expect(fx.burstAge).toBe(0.1);
  });
  it('clears disabled and reduced bursts without replay and resets season state', () => {
    const fx = new VillageEffects();
    fx.celebrate();
    fx.setReduced(true);
    expect(fx.burstAge).toBeNull();
    expect(fx.celebrate()).toBe(false);
    fx.step(0.1);
    expect(fx.elapsed).toBe(0);
    fx.setReduced(false);
    expect(fx.burstAge).toBeNull();
    fx.celebrate();
    fx.setEnabled(false);
    expect(fx.celebrate()).toBe(false);
    fx.setEnabled(true);
    expect(fx.burstAge).toBeNull();
    fx.celebrate();
    fx.setSeason('summer');
    expect(fx.burstAge).toBeNull();
    expect(fx.elapsed).toBe(0);
  });
  it('selects bounded frames and clamps one-shots to an empty last frame', () => {
    expect(effectFrame(-1, 8, 16, true)).toBe(0);
    expect(effectFrame(Infinity, 8, 16, true)).toBe(0);
    expect(effectFrame(2, 8, 16, true)).toBe(0);
    expect(effectFrame(2, 16, 25, false)).toBe(24);
  });
});

describe('responsive ambient placement', () => {
  for (const season of ['spring', 'summer', 'autumn', 'winter', 'christmas'] as const) {
    it(`keeps ${season} particles deterministic and bounded at narrow/short sizes`, () => {
      for (const [width, height] of [
        [1, 1],
        [160, 60],
        [210, 210],
        [211, 210],
        [744, 422],
      ]) {
        for (const time of [0, 1, 40, 99999]) {
          const particles = ambientParticles(season, width, height, time);
          expect(particles.length).toBeLessThanOrEqual(width <= 210 ? 14 : 26);
          expect(particles).toEqual(ambientParticles(season, width, height, time));
          for (const p of particles) {
            expect(p.x).toBeGreaterThanOrEqual(0);
            expect(p.x).toBeLessThan(width);
            expect(p.y).toBeGreaterThanOrEqual(0);
            expect(p.y).toBeLessThan(height);
            expect(p.alpha).toBeGreaterThanOrEqual(0);
            expect(p.alpha).toBeLessThanOrEqual(1);
          }
        }
      }
    });
  }
});
