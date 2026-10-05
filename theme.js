(() => {
  const key = 'arcadecraft-theme-valley-20261005';
  const themes = Object.freeze({
    pop: {mode: 'dark', color: '#120f13'},
    abyss: {mode: 'light', color: '#e8f3fa'},
    cobalt: {mode: 'dark', color: '#091725'},
    moss: {mode: 'light', color: '#edf4ef'},
    valley: {mode: 'dark', color: '#110e15'}
  });
  const queryTheme = new URLSearchParams(window.location.search).get('theme');
  const normalize = value => {
    if (value === 'light') return 'abyss';
    if (value === 'dark') return 'pop';
    return Object.hasOwn(themes, value) ? value : 'valley';
  };
  let saved;
  try { saved = window.localStorage.getItem(key); } catch {}
  const hasQueryTheme = Object.hasOwn(themes, queryTheme);
  let theme = normalize(hasQueryTheme ? queryTheme : saved);
  if (hasQueryTheme) {
    try { window.localStorage.setItem(key, theme); } catch {}
  }
  const apply = value => {
    theme = normalize(value);
    const selected = themes[theme];
    document.documentElement.dataset.theme = selected.mode;
    document.documentElement.dataset.themeVariant = theme;
    document.documentElement.style.colorScheme = selected.mode;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.append(meta);
    }
    meta.content = selected.color;
    window.dispatchEvent(new CustomEvent('arcade-theme-change', {detail: {theme, mode: selected.mode}}));
  };
  const set = value => {
    apply(value);
    try { window.localStorage.setItem(key, theme); } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('theme', theme);
      window.history.replaceState(window.history.state, '', url.href);
    } catch {}
  };
  const ensureVariantStyles = () => {
    if (document.getElementById('theme-variants')) return;
    const link = document.createElement('link');
    link.id = 'theme-variants';
    link.rel = 'stylesheet';
    link.href = 'theme-variants.css?v=20261005-4';
    document.head.append(link);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureVariantStyles, {once: true});
  else ensureVariantStyles();

  apply(theme);
  window.ARCADE_THEME = Object.freeze({
    get: () => theme,
    getMode: () => themes[theme].mode,
    set,
    toggle: () => set(themes[theme].mode === 'dark' ? 'abyss' : 'pop')
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(event.newValue);
  });
})();
