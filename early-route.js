(() => {
  const original = location.pathname.split('/').pop() + location.search + location.hash;
  const target = window.ARCADE_SITE.resolveHref(original);
  if (target !== original) {
    document.documentElement.style.visibility = 'hidden';
    location.replace(target);
  } else if (location.pathname.endsWith('/survival.html')) {
    document.documentElement.setAttribute('data-survival-loading', '');
  }
})();
