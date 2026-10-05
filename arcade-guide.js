(() => {
  const initialize = ({window,document,requestAnimationFrame}) => {
    const menu = document.querySelector('.arcade-game-guide .game-guide-toolbar details');
    if (!menu) return;
    const links = menu.querySelectorAll('a[href^="#"]');
    const initialHash = window.location.hash;
    let interacted = false;
    const currentSection = () => {
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return null; }
      const section = id ? document.getElementById(id) : null;
      return section?.matches('.game-guide-content > section') ? section : null;
    };
    const selectSection = () => {
      const section = currentSection();
      links.forEach(link => {
        if (section && link.getAttribute('href') === '#' + section.id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    };
    // Restore first-load deep links after the shared router takes scroll ownership.
    const alignInitial = () => {
      if (interacted || window.location.hash !== initialHash) return;
      const section = currentSection();
      if (!section) return;
      section.scrollIntoView({block:'start',behavior:'instant'});
      section.tabIndex = -1;
      section.focus({preventScroll:true});
    };
    ['wheel','touchstart','pointerdown','keydown'].forEach(type => window.addEventListener(type,() => { interacted = true; },{passive:true,once:true}));
    links.forEach(link => link.addEventListener('click',() => { menu.open = false; }));
    window.addEventListener('hashchange',selectSection);
    selectSection();
    if (document.readyState === 'complete') requestAnimationFrame(alignInitial);
    else window.addEventListener('load',() => requestAnimationFrame(alignInitial),{once:true});
    document.fonts?.ready.then(() => requestAnimationFrame(alignInitial));
  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('arcade-guide.js',initialize);
  else initialize({window,document,requestAnimationFrame});
})();
