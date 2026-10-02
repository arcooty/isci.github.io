(() => {
  const model = window.ARCADE_SITE;
  if (document.body.dataset.gameHub || document.body.dataset.routeHub) {
    const redirect = () => {
      const original = location.pathname.split('/').pop() + location.search + location.hash;
      const target = model.resolveHref(original);
      if (target !== original) location.replace(target);
    };
    redirect();
    window.addEventListener('hashchange',redirect);
  }
  document.querySelectorAll('.game-guide-toolbar details').forEach(menu => {
    menu.addEventListener('keydown',event => {
      if (event.key !== 'Escape' || !menu.open) return;
      event.preventDefault(); menu.open = false; menu.querySelector('summary').focus();
    });
    document.addEventListener('click',event => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
  });
})();
