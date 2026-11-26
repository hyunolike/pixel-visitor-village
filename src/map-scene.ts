import type { VisitorVillage } from './visitor-village';
import type { Season } from './model';
import { getVillageLayout } from './environment-layout';
import spring from './assets/map/landscape-spring.webp';
import summer from './assets/map/landscape-summer.webp';
import autumn from './assets/map/landscape-autumn.webp';
import winter from './assets/map/landscape-winter.webp';
import christmas from './assets/map/landscape-christmas.webp';

const sources: Record<Season, string> = { spring, summer, autumn, winter, christmas };
const images = new Map<Season, Promise<HTMLImageElement>>();
function load(season: Season): Promise<HTMLImageElement> {
  const cached = images.get(season);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Scene image unavailable'));
    image.src = sources[season];
  });
  images.set(season, promise);
  void promise.catch(() => {
    if (images.get(season) === promise) images.delete(season);
  });
  return promise;
}

/** Component-owned illustrated scenery; sources are shared, disposable textures are per widget. */
export function setupMapScene(widget: VisitorVillage): () => void {
  let generation = 0;
  let requested: Season | undefined;
  let disposed = false;
  const optedIn = () => widget.hasAttribute('illustrated') || widget.hasAttribute('data-map-scene');
  function sync(force = false) {
    if (disposed) return;
    if (!optedIn()) {
      generation++;
      requested = undefined;
      widget.setSceneBackdrop(null);
      widget.dataset.sceneState = 'default';
      delete widget.dataset.sceneSeason;
      return;
    }
    const season = widget.season;
    if (!force && requested === season) return;
    requested = season;
    const current = ++generation;
    widget.setSceneBackdrop(null);
    widget.dataset.sceneState = 'loading';
    delete widget.dataset.sceneSeason;
    void load(season)
      .then((image) => {
        if (
          disposed ||
          current !== generation ||
          !widget.isConnected ||
          !optedIn() ||
          widget.season !== season
        )
          return;
        widget.setSceneBackdrop(image);
        widget.dataset.sceneState = 'ready';
        widget.dataset.sceneSeason = season;
      })
      .catch(() => {
        if (
          disposed ||
          current !== generation ||
          !widget.isConnected ||
          !optedIn() ||
          widget.season !== season
        )
          return;
        widget.dataset.sceneState = 'fallback';
      });
  }
  const change = () => sync();
  const ready = () => sync(true);
  const observer = new MutationObserver(() => sync(true));
  observer.observe(widget, {
    attributes: true,
    attributeFilter: ['illustrated', 'data-map-scene'],
  });
  widget.addEventListener('village-change', change);
  widget.addEventListener('village-ready', ready);
  sync();
  return () => {
    disposed = true;
    generation++;
    observer.disconnect();
    widget.removeEventListener('village-change', change);
    widget.removeEventListener('village-ready', ready);
    widget.setSceneBackdrop(null);
    widget.dataset.sceneState = 'default';
    delete widget.dataset.sceneSeason;
  };
}

/** Anchor UI signs above the real cottage/shop in the renderer's half-resolution coordinates. */
export function setupMapLandmarks(
  widget: VisitorVillage,
  install: HTMLElement,
  guide: HTMLElement,
): () => void {
  const resize = () => {
    const width = Math.max(1, Math.round(widget.clientWidth / 2));
    const height = Math.max(1, Math.round(widget.clientHeight / 2));
    const layout = getVillageLayout(width, height, widget.dataset.sceneState === 'ready');
    for (const [kind, sign] of [
      ['cottage', install],
      ['shop', guide],
    ] as const) {
      const house = layout.find((item) => item.kind === kind)!;
      const houseCenter = house.x * 2;
      const labelCenter = Math.max(76, Math.min(widget.clientWidth - 76, houseCenter));
      const left = Math.min(houseCenter - house.width, labelCenter - 72);
      const right = Math.max(houseCenter + house.width, labelCenter + 72);
      sign.style.left = `${left}px`;
      sign.style.top = `${house.y * 2}px`;
      sign.style.width = `${right - left}px`;
      sign.style.height = `${house.height * 2 + 64}px`;
      sign.style.setProperty('--sign-center', `${labelCenter - left}px`);
      sign.style.setProperty('--house-center', `${houseCenter - left}px`);
      sign.style.setProperty('--house-width', `${house.width * 2}px`);
      sign.style.setProperty('--house-height', `${house.height * 2}px`);
    }
  };
  const observer = new ResizeObserver(resize);
  observer.observe(widget);
  const state = new MutationObserver(resize);
  state.observe(widget, { attributes: true, attributeFilter: ['data-scene-state'] });
  resize();
  return () => {
    observer.disconnect();
    state.disconnect();
  };
}
