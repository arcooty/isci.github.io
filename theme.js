(() => {
  const key = 'arcadecraft-theme';
  const normalize = value => value === 'light' ? 'light' : 'dark';
  let saved;
  try { saved = window.localStorage.getItem(key); } catch {}
  let theme = normalize(saved);
  const apply = value => {
    theme = normalize(value);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.append(meta);
    }
    meta.content = theme === 'dark' ? '#151619' : '#f7f8fc';
    window.dispatchEvent(new CustomEvent('arcade-theme-change', {detail: {theme}}));
  };
  const set = value => {
    apply(value);
    try { window.localStorage.setItem(key, theme); } catch {}
  };
  apply(theme);
  window.ARCADE_THEME = Object.freeze({get: () => theme, set, toggle: () => set(theme === 'dark' ? 'light' : 'dark')});
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(event.newValue);
  });
})();
