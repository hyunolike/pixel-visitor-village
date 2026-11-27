import type { Season } from './model';
import { hash } from './pixel-art';

export type AmbientKind = 'petal' | 'leaf' | 'firefly' | 'snow';
export interface AmbientParticle {
  kind: AmbientKind;
  x: number;
  y: number;
  age: number;
  alpha: number;
  scale: number;
}

export function shouldCelebrateArrival(reading: {
  delta: number;
  day: string;
  today: string;
  fresh: boolean;
}): boolean {
  return (
    reading.fresh &&
    Number.isFinite(reading.delta) &&
    reading.delta > 0 &&
    reading.day === reading.today
  );
}
export function effectFrame(age: number, fps: number, count: number, loop: boolean): number {
  const frame = Math.floor((Number.isFinite(age) ? Math.max(0, age) : 0) * fps);
  return loop ? frame % count : Math.min(count - 1, frame);
}

export class VillageEffects {
  elapsed = 0;
  burstAge: number | null = null;
  private enabled = true;
  private reduced = false;
  private season: Season = 'christmas';
  get active() {
    return this.enabled && !this.reduced;
  }
  setSeason(season: Season) {
    if (this.season !== season) {
      this.season = season;
      this.elapsed = 0;
      this.clearBurst();
    }
  }
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) this.clearBurst();
  }
  setReduced(reduced: boolean) {
    this.reduced = reduced;
    if (reduced) this.clearBurst();
  }
  clearBurst() {
    this.burstAge = null;
  }
  celebrate(): boolean {
    if (!this.active || this.burstAge !== null) return false;
    this.burstAge = 0;
    return true;
  }
  step(dt: number) {
    if (!this.active || !Number.isFinite(dt) || dt <= 0) return;
    dt = Math.min(dt, 0.1);
    this.elapsed += dt;
    if (this.burstAge !== null) {
      this.burstAge += dt;
      if (this.burstAge >= 1.5) this.clearBurst();
    }
  }
}

/** Native canvas coordinates; particle counts depend on viewport, never visitor count. */
export function ambientParticles(
  season: Season,
  width: number,
  height: number,
  elapsed: number,
): AmbientParticle[] {
  width = Math.max(1, width);
  height = Math.max(1, height);
  const narrow = width <= 210,
    kind: AmbientKind =
      season === 'spring'
        ? 'petal'
        : season === 'autumn'
          ? 'leaf'
          : season === 'summer'
            ? 'firefly'
            : 'snow';
  const count =
    kind === 'snow'
      ? narrow
        ? 14
        : 26
      : kind === 'firefly'
        ? narrow
          ? 5
          : 8
        : kind === 'leaf'
          ? narrow
            ? 6
            : 10
          : narrow
            ? 8
            : 12;
  const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0;
  return Array.from({ length: count }, (_, i) => {
    const seed = i + 37,
      phase = (hash(seed) + time / (14 + hash(seed + 7) * 10)) % 1;
    const x =
      (((hash(seed + 21) * width + Math.sin(time * 0.35 + i) * Math.min(6, width * 0.04)) % width) +
        width) %
      width;
    const y =
      kind === 'firefly'
        ? height * (0.26 + hash(seed + 44) * 0.48) +
          Math.sin(time * 0.6 + i) * Math.min(4, height * 0.03)
        : phase * height;
    return {
      kind,
      x: Math.min(width - 1, Math.round(x)),
      y: Math.max(0, Math.min(height - 1, Math.round(y))),
      age: time + hash(seed + 83) * 6,
      alpha: kind === 'firefly' ? 0.8 : Math.min(1, phase * 12, (1 - phase) * 12) * 0.8,
      scale:
        kind === 'leaf'
          ? 0.6
          : kind === 'petal'
            ? 0.7
            : kind === 'snow'
              ? i % 4 === 0
                ? 1
                : 0.5
              : 1,
    };
  });
}
