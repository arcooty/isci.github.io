(() => {
  const topics = window.ARCADE_SITE.topics;
  const sections = window.ARCADE_SITE.topicSections;
  const sectionOwners = Object.fromEntries(Object.entries(sections).flatMap(([topic,items])=>items.map(([id])=>[id,topic])));
  const panels = [...document.querySelectorAll('[data-hub-panel]')];
  const articles = [...document.querySelectorAll('[data-guide-topic]')];
  const tabs = [...document.querySelectorAll('[data-hub-tab]')];
  const topicNav = document.getElementById('guide-topics');
  const topicSelect = document.getElementById('guide-topic-select');
  const locationLabel = document.getElementById('guide-current');
  const next = document.getElementById('guide-next');
  const categoryMenu = document.getElementById('guide-category-menu');
  categoryMenu?.addEventListener('keydown',event => {
    if (event.key !== 'Escape' || !categoryMenu.open) return;
    categoryMenu.open = false;
    categoryMenu.querySelector('summary').focus();
  });
  history.scrollRestoration = 'manual';
  let lastTopic = 'baslangic';
  const topicHref = id => window.ARCADE_SITE.resolveHref('survival.html#' + id);
  const leaveSplitTopic = () => {
    const original = 'survival.html' + (location.search || '') + location.hash;
    const target = window.ARCADE_SITE.resolveHref(original);
    if (target === original || typeof location.replace !== 'function') return false;
    location.replace(target);
    return true;
  };
  topics.forEach(([id,label,icon]) => {
    const link = document.createElement('a'); link.href = topicHref(id); link.dataset.topicLink = id;
    const mark = document.createElement('i'); mark.className = 'fa-solid fa-' + icon; mark.setAttribute('aria-hidden','true');
    link.append(mark,document.createTextNode(label)); topicNav.append(link);
    const option = document.createElement('option'); option.value = id; option.textContent = label; topicSelect.append(option);
  });
  function render(focus) {
    if (leaveSplitTopic()) return;
    const hash = location.hash.slice(1);
    const topic = topics.find(([id]) => id === (sectionOwners[hash] || hash));
    const view = topic ? 'rehber' : ['harita','siralamalar'].includes(hash) ? hash : 'genel';
    panels.forEach(panel => { panel.hidden = panel.dataset.hubPanel !== view; });
    tabs.forEach(tab => {
      if (tab.dataset.hubTab === view) tab.setAttribute('aria-current','page');
      else tab.removeAttribute('aria-current');
    });
    if (topic) {
      lastTopic = topic[0]; topicSelect.value = lastTopic; locationLabel.textContent = topic[1];
      articles.forEach(article => { article.hidden = article.dataset.guideTopic !== lastTopic; });
      topicNav.querySelectorAll('a').forEach(link => { if (link.dataset.topicLink === lastTopic) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
      const index = topics.indexOf(topic);
      const following = topics[index + 1];
      next.hidden = !following;
      if (following) { next.href = topicHref(following[0]); next.replaceChildren(document.createTextNode('Sonraki konu: ' + following[1] + ' ')); const arrow = document.createElement('i'); arrow.className = 'fa-solid fa-arrow-right'; arrow.setAttribute('aria-hidden','true'); next.append(arrow); }
    }
    document.querySelectorAll('[data-section-link]').forEach(link=>{
      if (link.dataset.sectionLink === hash) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    tabs.find(tab => tab.dataset.hubTab === 'rehber').href = '#' + lastTopic;
    if (view === 'harita') { const frame = document.querySelector('iframe[data-src]'); if (!frame.src) frame.src = frame.dataset.src; }
    document.title = (topic ? topic[1] + ' · Survival' : view === 'harita' ? 'Harita · Survival' : view === 'siralamalar' ? 'Sıralamalar · Survival' : 'Survival') + ' | ArcaDe Craft';
    if (focus) {
      if (categoryMenu) categoryMenu.open = false;
      const target = topic ? document.getElementById(sectionOwners[hash] ? hash : topic[0]) : panels.find(panel => panel.dataset.hubPanel === view);
      target.tabIndex = -1; target.focus({preventScroll:true});
      const masthead = document.querySelector('.hub-masthead');
      const top = sectionOwners[hash] ? target.getBoundingClientRect().top + window.scrollY - 152 : masthead.getBoundingClientRect().bottom + window.scrollY - 88;
      requestAnimationFrame(() => window.scrollTo({top,behavior:'instant'}));
    }
  }
  // One URL per topic keeps reload, bookmarks and browser Back working naturally.
  document.addEventListener('click',event => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href,location.href);
    const id = url.hash.slice(1);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !['genel','harita','siralamalar',...topics.map(([key]) => key),...Object.keys(sectionOwners)].includes(id)) return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null,'',url.hash);
    render(true);
  });
  topicSelect.addEventListener('change',() => { history.pushState(null,'','#'+topicSelect.value); render(true); });
  window.addEventListener('popstate',() => render(true));
  window.addEventListener('pageshow',() => render(false));
  window.addEventListener('hashchange',() => render(true));
  const initialHash=location.hash;
  render(!!initialHash);
  document.documentElement?.removeAttribute('data-survival-loading');
  // Font loading can move a deep section after the first layout pass.
  if (initialHash) {
    let interacted=false;
    document.addEventListener('pointerdown',()=>interacted=true,{once:true});
    document.addEventListener('keydown',()=>interacted=true,{once:true});
    window.addEventListener('wheel',()=>interacted=true,{once:true,passive:true});
    document.fonts?.ready.then(()=>{ if(!interacted && location.hash === initialHash) render(true); });
  }
})();
