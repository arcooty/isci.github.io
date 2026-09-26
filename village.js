(() => {
  const tabs = [...document.querySelectorAll('.village-team-tabs a')];
  if (!tabs.length) return;
  const catalogue = document.getElementById('roller');
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('href').slice(1)));
  document.querySelector('.village-team-tabs').setAttribute('role','tablist');
  tabs.forEach((tab,index) => {
    tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls',panels[index].id);
    panels[index].setAttribute('role','tabpanel');
    panels[index].setAttribute('aria-labelledby',tab.id);
  });
  const select = tab => tabs.forEach((item,index) => {
    const active = item === tab;
    item.setAttribute('aria-selected',String(active));
    item.tabIndex = active ? 0 : -1;
    panels[index].hidden = !active;
  });
  const restore = (align = false) => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
    const destination = document.getElementById(id);
    const index = destination ? panels.findIndex(panel => panel === destination || panel.contains(destination)) : -1;
    const initial = !destination || id === 'roller';
    select(index >= 0 ? tabs[index] : initial ? tabs[0] : tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);
    if (index < 0) return;
    if (destination.tagName === 'DETAILS') destination.open = true;
    if (align) requestAnimationFrame(() => {
      const target = panels[index] === destination ? catalogue : destination;
      target.scrollIntoView({block:'start',behavior:'instant'});
    });
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const hash = tab.getAttribute('href');
      if (location.hash !== hash) history.pushState(null,'',hash);
      select(tab);
    });
    tab.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      history.replaceState(null,'',tabs[next].getAttribute('href'));
      select(tabs[next]); tabs[next].focus();
    });
  });
  window.addEventListener('popstate',() => restore(true));
  window.addEventListener('hashchange',() => restore(true));
  restore(Boolean(location.hash));
  // A role link must still land correctly when the page font finishes loading.
  if (document.fonts?.status !== 'loaded') {
    const initialHash = location.hash;
    let interacted = false;
    ['wheel','touchstart','pointerdown','keydown'].forEach(type => window.addEventListener(type,() => { interacted = true; },{once:true,passive:true}));
    document.fonts?.ready.then(() => { if (!interacted && location.hash === initialHash) restore(true); });
  }
})();
