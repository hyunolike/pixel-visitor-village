import { describe, expect, it } from 'vitest';
import { ART_PALETTE, fitArtPixels } from './art-palette';
import { visitorPixels } from './characters';
import { themes } from './themes';
import { blend } from './pixel-art';

describe('shared pixel art finish', () => {
  it('keeps all three actual visitor facial tones distinct', () => {
    const faces = [0, 1, 2].map((style) =>
      [...visitorPixels(style, 'front', 0).slice((12 * 20 + 10) * 4, (12 * 20 + 10) * 4 + 3)].join(
        ',',
      ),
    );
    expect(new Set(faces).size).toBe(3);
  });
  it('keeps exposed back hair highlights brighter than each hair base', () => {
    const light = (p: Uint8ClampedArray, x: number) => {
      const i = (10 * 20 + x) * 4;
      return p[i] * 0.2126 + p[i + 1] * 0.7152 + p[i + 2] * 0.0722;
    };
    for (const style of [0, 1, 3, 4, 5, 7]) {
      const p = visitorPixels(style, 'back', 0);
      expect(light(p, 7)).toBeGreaterThan(light(p, 10));
    }
  });
  it('retains the actual default sky, hills and rear forest as distinct layers', () => {
    const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    for (const t of Object.values(themes)) {
      const p = fitArtPixels(
        Uint8ClampedArray.from(
          [t.sky, blend(t.haze, t.sky, 0.45), blend(t.pine, t.haze, 0.62)].flatMap((c) => [
            ...rgb(c),
            255,
          ]),
        ),
      );
      expect(new Set([0, 4, 8].map((i) => [...p.slice(i, i + 3)].join(','))).size).toBe(3);
    }
  });
  it('keeps masonry neutral and dark hair brown instead of tinting them violet or green', () => {
    const output = fitArtPixels(new Uint8ClampedArray([124, 111, 100, 255, 71, 59, 64, 255]));
    expect([...output]).toEqual([108, 117, 103, 255, 76, 60, 51, 255]);
  });
  it('preserves every alpha byte and clears invisible RGB', () => {
    const input = new Uint8ClampedArray([255, 123, 67, 0, 30, 66, 40, 72, 243, 225, 186, 255]);
    const before = input.slice();
    const output = fitArtPixels(input);
    expect([...output].filter((_, i) => i % 4 === 3)).toEqual([0, 72, 255]);
    expect([...output.slice(0, 4)]).toEqual([0, 0, 0, 0]);
    expect(input).toEqual(before);
  });
  it('is idempotent and contains only the authored palette for visible RGB', () => {
    const input = Uint8ClampedArray.from(
      Array.from({ length: 512 }, (_, i) => (i % 4 === 3 ? 255 : (i * 79) % 256)),
    );
    const finished = fitArtPixels(input);
    const colors = new Set(ART_PALETTE.map((rgb) => rgb.join(',')));
    for (let i = 0; i < finished.length; i += 4)
      expect(colors.has([...finished.slice(i, i + 3)].join(','))).toBe(true);
    expect(fitArtPixels(finished)).toEqual(finished);
  });
  it('preserves brand red and cream and keeps distinct skin shades', () => {
    const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const colors = ['#ff5a3e', '#fff0c7', '#a86c55', '#c88b65', '#edc29a'];
    const input = Uint8ClampedArray.from(colors.flatMap((c) => [...rgb(c), 255]));
    const output = fitArtPixels(input);
    expect([...output.slice(0, 8)]).toEqual([...input.slice(0, 8)]);
    expect(new Set([8, 12, 16].map((i) => [...output.slice(i, i + 3)].join(','))).size).toBe(3);
  });
});
