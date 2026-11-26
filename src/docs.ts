import { setupServiceHeader } from './service-header';

setupServiceHeader();
const form = document.querySelector<HTMLFormElement>('.guide-search')!;
const search = document.querySelector<HTMLInputElement>('#guide-search')!;
const reset = document.querySelector<HTMLButtonElement>('#guide-reset')!;
const empty = document.querySelector<HTMLElement>('#guide-empty')!;
const results = document.querySelector<HTMLElement>('#guide-results')!;
const sections = [...document.querySelectorAll<HTMLElement>('.docs-content > section')];
const links = [...document.querySelectorAll<HTMLAnchorElement>('.docs-toc a')];
const normalize = (text: string) =>
  text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
const text = sections.map((section) => normalize(section.textContent ?? ''));
form.hidden = false;
function filter() {
  const query = normalize(search.value);
  let count = 0;
  sections.forEach((section, index) => {
    section.hidden = Boolean(query) && !text[index].includes(query);
    if (!section.hidden) count++;
  });
  empty.hidden = count > 0;
  results.textContent = query ? `${count}개 주제에서 찾았어요.` : '';
  trackCurrent();
}
function clear() {
  search.value = '';
  filter();
}
function current(section: HTMLElement | null) {
  for (const link of links) {
    if (section && link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function hashTarget() {
  let id: string;
  try {
    id = decodeURIComponent(location.hash.slice(1));
  } catch {
    return null;
  }
  const target = document.getElementById(id);
  return target?.closest<HTMLElement>('.docs-content > section') ?? null;
}
function restoreHash() {
  const target = hashTarget();
  if (!target) return;
  clear();
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
  current(target);
  document
    .getElementById(decodeURIComponent(location.hash.slice(1)))
    ?.scrollIntoView({ block: 'start' });
}
search.addEventListener('input', filter);
search.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    clear();
  }
});
form.addEventListener('submit', (event) => event.preventDefault());
form.addEventListener('reset', (event) => {
  event.preventDefault();
  clear();
  search.focus();
});
reset.disabled = false;
for (const link of document.querySelectorAll<HTMLAnchorElement>(
  '.docs-toc a, .guide-start a[href^="#"]',
)) {
  link.addEventListener('click', () => {
    clear();
    const section = document
      .getElementById(link.hash.slice(1))
      ?.closest<HTMLElement>('.docs-content > section');
    if (section) {
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
      current(section);
    }
  });
}
window.addEventListener('hashchange', restoreHash);
function trackCurrent() {
  const visible = sections.filter((section) => !section.hidden);
  if (!visible.length) {
    current(null);
    return;
  }
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  const target = atBottom
    ? visible.at(-1)
    : visible.filter((section) => section.getBoundingClientRect().top <= 150).at(-1);
  current(target ?? null);
}
window.addEventListener('scroll', trackCurrent, { passive: true });
restoreHash();
