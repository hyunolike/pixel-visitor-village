import direction from './art-direction.json' with { type: 'json' };

const ramps = direction.ramps as Record<string, string[]>;
const hexes = [...new Set(direction.objectRamps.flatMap((name) => ramps[name]))];
export const ART_PALETTE: readonly (readonly number[])[] = hexes.map((hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)),
);
const mapped = new Map<number, readonly number[]>();

/** Source/atlas construction only. Preserve animation silhouettes and contact-shadow alpha. */
export function fitArtPixels(pixels: Uint8ClampedArray): Uint8ClampedArray {
  const out = new Uint8ClampedArray(pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    if (!alpha) continue;
    const red = pixels[i],
      green = pixels[i + 1],
      blue = pixels[i + 2];
    const key = red * 65536 + green * 256 + blue;
    let nearest = mapped.get(key);
    if (!nearest) {
      let distance = Infinity;
      nearest = ART_PALETTE[0];
      for (const color of ART_PALETTE) {
        const d = (red - color[0]) ** 2 + (green - color[1]) ** 2 + (blue - color[2]) ** 2;
        if (d < distance) {
          distance = d;
          nearest = color;
        }
      }
      mapped.set(key, nearest);
    }
    out.set(nearest, i);
    out[i + 3] = alpha;
  }
  return out;
}

export function finishArtCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d')!;
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  image.data.set(fitArtPixels(image.data));
  ctx.putImageData(image, 0, 0);
  return canvas;
}
