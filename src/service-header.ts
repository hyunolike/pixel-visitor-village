/** Progressive enhancement: static guide links remain usable without JavaScript. */
export function setupServiceHeader() {
  const header = document.querySelector<HTMLElement>('.service-header');
  const navigation = header?.querySelector<HTMLElement>('#project-navigation');
  const toggle = header?.querySelector<HTMLButtonElement>('#navigation-toggle');
  if (!header || !navigation || !toggle) return;
  const compact = matchMedia('(max-width: 700px)');
  let open = false;

  function render() {
    toggle!.hidden = !compact.matches;
    navigation!.hidden = compact.matches && !open;
    toggle!.setAttribute('aria-expanded', String(compact.matches && open));
  }
  header.dataset.menuEnhanced = 'true';
  render();
  toggle.addEventListener('click', () => {
    open = !open;
    render();
    if (open) navigation.querySelector<HTMLAnchorElement>('a')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !compact.matches || !open) return;
    open = false;
    render();
    toggle.focus();
  });
  navigation.addEventListener('click', event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a');
    if (!link || !compact.matches || !open) return;
    const destination = new URL(link.href);
    if (destination.origin !== location.origin || destination.pathname !== location.pathname || !destination.hash) return;
    open = false;
    render();
    document.getElementById(decodeURIComponent(destination.hash.slice(1)))?.focus({ preventScroll: true });
  });
  compact.addEventListener('change', () => {
    const focusedInMenu = navigation.contains(document.activeElement);
    const focusedToggle = document.activeElement === toggle;
    open = false;
    render();
    if (compact.matches && focusedInMenu) toggle.focus();
    else if (!compact.matches && focusedToggle) navigation.querySelector<HTMLAnchorElement>('a')?.focus();
  });
}
