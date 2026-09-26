(() => {
  const tabs = [...document.querySelectorAll('.platform-select [role="tab"]')];
  const select = tab => tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  const restore = () => select(tabs.find(tab=>'#'+tab.getAttribute('aria-controls') === location.hash) || tabs[0]);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { const hash='#'+tab.getAttribute('aria-controls'); if(location.hash !== hash) history.pushState(null,'',hash); select(tab); });
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      history.replaceState(null,'','#'+tabs[next].getAttribute('aria-controls')); select(tabs[next]); tabs[next].focus();
    });
  });
  window.addEventListener('popstate',restore); window.addEventListener('hashchange',restore); restore();
})();
