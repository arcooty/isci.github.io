(() => {
  const topics = window.ARCADE_SITE.topics;
  const panels = [...document.querySelectorAll('[data-hub-panel]')];
  const articles = [...document.querySelectorAll('[data-guide-topic]')];
  const tabs = [...document.querySelectorAll('[data-hub-tab]')];
  const topicNav = document.getElementById('guide-topics');
  const topicSelect = document.getElementById('guide-topic-select');
  const locationLabel = document.getElementById('guide-current');
  const next = document.getElementById('guide-next');
  history.scrollRestoration = 'manual';
  let lastTopic = 'baslangic';
  topics.forEach(([id,label,icon]) => {
    const link = document.createElement('a'); link.href = '#' + id; link.dataset.topicLink = id;
    const mark = document.createElement('i'); mark.className = 'fa-solid fa-' + icon; mark.setAttribute('aria-hidden','true');
    link.append(mark,document.createTextNode(label)); topicNav.append(link);
    const option = document.createElement('option'); option.value = id; option.textContent = label; topicSelect.append(option);
  });
  function render(focus) {
    const hash = location.hash.slice(1);
    const topic = topics.find(([id]) => id === hash);
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
      if (following) { next.href = '#' + following[0]; next.replaceChildren(document.createTextNode('Sonraki konu: ' + following[1] + ' ')); const arrow = document.createElement('i'); arrow.className = 'fa-solid fa-arrow-right'; arrow.setAttribute('aria-hidden','true'); next.append(arrow); }
    }
    tabs.find(tab => tab.dataset.hubTab === 'rehber').href = '#' + lastTopic;
    if (view === 'harita') { const frame = document.querySelector('iframe[data-src]'); if (!frame.src) frame.src = frame.dataset.src; }
    document.title = (topic ? topic[1] + ' · Survival' : view === 'harita' ? 'Harita · Survival' : view === 'siralamalar' ? 'Sıralamalar · Survival' : 'Survival') + ' | ArcaDe Craft';
    if (focus) {
      const target = topic ? document.getElementById(topic[0]) : panels.find(panel => panel.dataset.hubPanel === view);
      target.tabIndex = -1; target.focus({preventScroll:true});
      const masthead = document.querySelector('.hub-masthead');
      const top = masthead.getBoundingClientRect().bottom + window.scrollY - 88;
      requestAnimationFrame(() => window.scrollTo({top,behavior:'instant'}));
    }
  }
  // One URL per topic keeps reload, bookmarks and browser Back working naturally.
  document.addEventListener('click',event => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href,location.href);
    const id = url.hash.slice(1);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !['genel','harita','siralamalar',...topics.map(([key]) => key)].includes(id)) return;
    event.preventDefault();
    if (location.hash !== url.hash) history.pushState(null,'',url.hash);
    render(true);
  });
  topicSelect.addEventListener('change',() => { history.pushState(null,'','#'+topicSelect.value); render(true); });
  window.addEventListener('popstate',() => render(true));
  window.addEventListener('hashchange',() => render(true));
  render(!!location.hash);
})();
