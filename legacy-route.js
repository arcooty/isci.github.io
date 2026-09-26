(() => {
  const page = location.pathname.split('/').pop();
  const target = window.ARCADE_SITE.resolveHref(page + location.search + location.hash);
  if (target !== page + location.search + location.hash) location.replace(target);
})();
