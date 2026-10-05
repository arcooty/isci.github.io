(() => {
  const initialize = ({window,document,history,fetch,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame}) => {
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

  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('game-guide.js',initialize);
  else initialize({window,document,history:typeof history!=='undefined'?history:undefined,fetch:typeof fetch==='function'?fetch:undefined,setTimeout:typeof setTimeout==='function'?setTimeout:undefined,clearTimeout:typeof clearTimeout==='function'?clearTimeout:undefined,setInterval:typeof setInterval==='function'?setInterval:undefined,clearInterval:typeof clearInterval==='function'?clearInterval:undefined,requestAnimationFrame:typeof requestAnimationFrame==='function'?requestAnimationFrame:undefined});
})();