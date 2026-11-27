import url from './assets/effects/village-fx.png';
import { surface } from './pixel-art';
let source: HTMLCanvasElement | undefined;
let pending: Promise<HTMLCanvasElement> | undefined;

/** Cache source pixels, not disposable textures. Failed optional loads can be retried. */
export function loadEffectArt(): Promise<HTMLCanvasElement> {
  if (source) return Promise.resolve(source);
  if (pending) return pending;
  pending = new Promise<HTMLCanvasElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const { canvas, ctx } = surface(image.naturalWidth, image.naturalHeight);
        ctx.drawImage(image, 0, 0);
        source = canvas;
        resolve(canvas);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => reject(new Error('Optional village effects unavailable'));
    image.src = url;
  }).finally(() => {
    pending = undefined;
  });
  return pending;
}
