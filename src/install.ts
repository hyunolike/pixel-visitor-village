import './install.css';
import { buildInstallSnippet, InstallError, normalizeBlogUrl, type InstallErrorCode } from './install-model';
import { LOCALE_STORAGE_KEY, messages, normalizeLocale, resolveLocale, saveLocale, type TextKey } from './install-i18n';
import type { Season } from './model';
import type { VisitorVillage } from './visitor-village';

const find = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const form = find<HTMLFormElement>('#install-form');
const formAction = find<HTMLElement>('.form-action');
const createCode = find<HTMLButtonElement>('#create-code');
const address = find<HTMLInputElement>('#blog-url');
const refresh = find<HTMLInputElement>('#install-refresh');
const language = find<HTMLSelectElement>('#locale-select');
const result = find<HTMLElement>('#install-result');
const code = find<HTMLTextAreaElement>('#install-code');
const error = find<HTMLElement>('#install-error');
const copyState = find<HTMLElement>('#copy-state');
const admin = find<HTMLAnchorElement>('#admin-link');
const stage = find<HTMLElement>('#preview-stage');
const retry = find<HTMLButtonElement>('#preview-retry');
const pause = find<HTMLButtonElement>('#preview-pause');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let locale = resolveLocale(location.search, () => localStorage.getItem(LOCALE_STORAGE_KEY), navigator.languages);
let selectedSeason: Season = 'christmas';
let origin = '';
let errorCode: InstallErrorCode | 'unexpectedError' | undefined;
let copyStatus: 'copySuccess' | 'copyFallback' | undefined;
let resultGeneration = 0;
let installState: 'pristine' | 'ready' | 'dirty' = 'pristine';
let preview: VisitorVillage | undefined;
let previewState: 'loading' | 'ready' | 'failed' = 'loading';
let previewGeneration = 0;
let paused = false;

function renderResultState() {
  const t = messages[locale];
  formAction.dataset.state = installState;
  createCode.textContent = installState === 'dirty' ? t.regenerateCode : t.createCode;
  const status = find('#settings-status');
  const statusText = installState === 'dirty' ? t.settingsChanged : '';
  if (status.textContent !== statusText) status.textContent = statusText;
  find('#code-pending').textContent = installState === 'dirty' ? t.settingsChanged : t.codePending;
  find('#refresh-enabled').hidden = !refresh.checked;
  find('#refresh-warning').hidden = !refresh.checked;
  const description = refresh.checked ? 'refresh-help refresh-warning' : 'refresh-help';
  if (refresh.getAttribute('aria-describedby') !== description) refresh.setAttribute('aria-describedby', description);
}

function renderPreviewText() {
  const t = messages[locale];
  find('#preview-message').textContent = previewState === 'loading' ? t.loading : previewState === 'failed' ? t.previewError : '';
  retry.hidden = previewState !== 'failed';
  pause.disabled = previewState !== 'ready' || reducedMotion.matches;
  find('#pause-label').textContent = paused ? t.resume : t.pause;
  find('.playback-symbol').textContent = paused ? '▷' : 'Ⅱ';
  find('#preview-tip').textContent = reducedMotion.matches ? t.reducedMotion : t.previewTip;
  pause.setAttribute('aria-pressed', String(paused));
}

function renderLocale() {
  const t = messages[locale];
  document.documentElement.lang = locale;
  document.title = t.pageTitle;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.introBody);
  document.querySelector('nav')?.setAttribute('aria-label', t.brand);
  language.value = locale;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(element => {
    element.textContent = t[element.dataset.i18n as TextKey];
  });
  document.querySelectorAll<HTMLElement>('[data-season]').forEach(element => {
    element.textContent = t.seasons[element.dataset.season as Season];
  });
  result.setAttribute('aria-label', t.resultLabel);
  find('#menu-original').hidden = locale === 'ko';
  find('#normalized-blog').textContent = origin ? t.originNote(origin) : '';
  error.textContent = errorCode ? errorCode === 'unexpectedError' ? t.unexpectedError : t.errors[errorCode] : '';
  copyState.textContent = copyStatus ? t[copyStatus] : '';
  if (preview) preview.labels = t.village;
  renderResultState();
  renderPreviewText();
}

function clearResult(invalidate = false) {
  if (invalidate && installState !== 'pristine') installState = 'dirty';
  ++resultGeneration;
  origin = '';
  result.hidden = true;
  code.value = '';
  admin.hidden = true;
  admin.removeAttribute('href');
  find('#code-pending').hidden = false;
  find('#admin-pending').hidden = false;
  copyStatus = undefined;
  copyState.textContent = '';
  renderResultState();
}

address.addEventListener('input', () => {
  clearResult(true);
  errorCode = undefined;
  error.textContent = '';
  address.removeAttribute('aria-invalid');
});
// A focus-driven layout change must wait until the pointer's click has been dispatched.
let pointerActive = false;
function syncActionFocus() {
  if (pointerActive) return;
  if (document.activeElement === address) formAction.dataset.editing = 'true';
  else if (document.activeElement !== createCode) delete formAction.dataset.editing;
}
document.addEventListener('pointerdown', () => { pointerActive = true; }, true);
const finishPointer = () => {
  pointerActive = false;
  requestAnimationFrame(syncActionFocus);
};
document.addEventListener('pointerup', finishPointer, true);
document.addEventListener('pointercancel', finishPointer, true);
document.addEventListener('focusin', syncActionFocus);
form.addEventListener('focusout', () => { requestAnimationFrame(syncActionFocus); });
form.addEventListener('change', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.name === 'season') {
    selectedSeason = input.value as Season;
    preview?.setAttribute('season', selectedSeason);
    clearResult(true);
  } else if (input === refresh) clearResult(true);
});

language.addEventListener('change', () => {
  locale = normalizeLocale(language.value) ?? 'ko';
  saveLocale(locale, value => localStorage.setItem(LOCALE_STORAGE_KEY, value));
  const url = new URL(location.href);
  url.searchParams.set('lang', locale);
  history.replaceState(history.state, '', url);
  renderLocale();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  clearResult();
  try {
    const blog = normalizeBlogUrl(address.value);
    const moduleUrl = new URL('./widget/visitor-village.js', location.href).href;
    code.value = buildInstallSnippet(moduleUrl, selectedSeason, refresh.checked);
    origin = blog.origin;
    admin.href = blog.adminUrl;
    admin.hidden = false;
    result.hidden = false;
    installState = 'ready';
    find('#code-pending').hidden = true;
    find('#admin-pending').hidden = true;
    errorCode = undefined;
    address.removeAttribute('aria-invalid');
    renderLocale();
    find('#copy-title').focus();
  } catch (reason) {
    errorCode = reason instanceof InstallError ? reason.code : 'unexpectedError';
    address.setAttribute('aria-invalid', 'true');
    renderLocale();
    address.focus();
  }
});

find('#copy-code').addEventListener('click', async () => {
  const generation = resultGeneration;
  const snippet = code.value;
  try {
    await navigator.clipboard.writeText(snippet);
    if (generation !== resultGeneration || result.hidden) return;
    copyStatus = 'copySuccess';
  } catch {
    if (generation !== resultGeneration || result.hidden) return;
    code.focus();
    code.select();
    copyStatus = 'copyFallback';
  }
  copyState.textContent = messages[locale][copyStatus];
});

async function loadPreview() {
  const generation = ++previewGeneration;
  previewState = 'loading';
  preview?.remove();
  preview = undefined;
  stage.replaceChildren();
  stage.removeAttribute('data-failed');
  stage.setAttribute('aria-busy', 'true');
  renderPreviewText();
  const failed = () => {
    if (generation !== previewGeneration) return;
    previewState = 'failed';
    stage.dataset.failed = 'true';
    stage.setAttribute('aria-busy', 'false');
    renderPreviewText();
  };
  try {
    // Keep the installer usable if the graphics module or WebGL cannot load.
    await import('./visitor-village');
    if (generation !== previewGeneration) return;
    preview = document.createElement('visitor-village');
    preview.id = 'preview-village';
    preview.labels = messages[locale].village;
    preview.setAttribute('count', '24');
    preview.setAttribute('season', selectedSeason);
    preview.setAttribute('repository-link', 'badge');
    preview.toggleAttribute('paused', paused);
    preview.addEventListener('village-ready', () => {
      if (generation !== previewGeneration) return;
      previewState = 'ready';
      stage.setAttribute('aria-busy', 'false');
      renderPreviewText();
    });
    preview.addEventListener('village-error', event => {
      if ((event as CustomEvent<{attribute: string}>).detail.attribute === 'renderer') failed();
    });
    stage.append(preview);
  } catch { failed(); }
}

pause.addEventListener('click', () => {
  paused = !paused;
  preview?.toggleAttribute('paused', paused);
  renderPreviewText();
});
retry.addEventListener('click', () => { void loadPreview(); });
reducedMotion.addEventListener('change', renderPreviewText);
renderLocale();
void loadPreview();
