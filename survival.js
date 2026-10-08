(() => {
  const initialize = ({window,document,history,fetch,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame}) => {
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
  const previous = document.getElementById('guide-prev');
  const readingOrder = [["survival.html#siralamalar", "Sıralamalar"], ["survival.html#baslangic", "İlk adımlar"], ["survival.html#arazi", "Arazi ve evler"], ["survival-jobs.html", "Meslekler"], ["survival-jobs-progress.html", "Meslek ilerlemesi"], ["survival-jobs-commands.html", "Meslek komutları"], ["survival-quests.html", "Kaybolan Atlas"], ["survival-quests-goals.html", "Uzun vadeli hedefler"], ["survival-quests-daily.html", "Günlük görevler ve beceriler"], ["survival.html#ekonomi", "Ekonomi ve ticaret"], ["survival-crates.html", "Kasalar"], ["survival-crates-rewards.html", "Ödüller ve oranlar"], ["survival-crates-keys.html", "Anahtar ve kullanım"], ["survival-commands.html", "Ulaşım ve ev komutları"], ["survival-commands-progress.html", "İlerleme komutları"], ["survival-commands-vip.html", "VIP komutları"], ["survival.html#harita", "Harita"]];
  const categoryMenu = document.getElementById('guide-category-menu');
  const toolbar = document.querySelector('.survival-topic-toolbar');
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
  const navigationTopics = [['siralamalar','Sıralamalar','trophy'], ...topics, ['harita','Harita','map']];
  navigationTopics.forEach(([id,label,icon]) => {
    const link = document.createElement('a'); link.href = topicHref(id); link.dataset.topicLink = id;
    const mark = document.createElement('i'); mark.className = 'fa-solid fa-' + icon; mark.setAttribute('aria-hidden','true');
    link.append(mark,document.createTextNode(label)); topicNav.append(link);
    if (topics.some(([topicId]) => topicId === id)) {
      const option = document.createElement('option'); option.value = id; option.textContent = label; topicSelect.append(option);
    }
  });
  function render(focus) {
    if (leaveSplitTopic()) return;
    const hash = location.hash.slice(1);
    const topic = topics.find(([id]) => id === (sectionOwners[hash] || hash));
    const view = topic ? 'rehber' : ['harita','siralamalar'].includes(hash) ? hash : 'genel';
    if (toolbar) toolbar.hidden=view==='genel';
    document.documentElement?.setAttribute?.('data-survival-view',view==='genel' ? 'home' : 'content');
    panels.forEach(panel => { panel.hidden = panel.dataset.hubPanel !== view; });
    tabs.forEach(tab => {
      if (tab.dataset.hubTab === view) tab.setAttribute('aria-current','page');
      else tab.removeAttribute('aria-current');
    });
    if (topic) {
      lastTopic = topic[0]; topicSelect.value = lastTopic; locationLabel.textContent = topic[1];
      articles.forEach(article => { article.hidden = article.dataset.guideTopic !== lastTopic; });
      topicNav.querySelectorAll('a').forEach(link => { if (link.dataset.topicLink === lastTopic) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
      const current = topicHref(topic[0]);
      const index = readingOrder.findIndex(([href]) => href === current);
      const neighbors = [readingOrder[index - 1] || ['survival.html#genel','Bütün konular'],readingOrder[index + 1] || ['survival.html#genel','Bütün konular']];
      [previous,next].forEach((link,i) => {
        link.hidden = false; link.href = neighbors[i][0];
        const text = document.createElement('span'); text.textContent = (i ? 'Sonraki: ' : 'Önceki: ') + neighbors[i][1];
        const arrow = document.createElement('i'); arrow.className = 'fa-solid fa-arrow-' + (i ? 'right' : 'left'); arrow.setAttribute('aria-hidden','true');
        link.replaceChildren(...(i ? [text,arrow] : [arrow,text]));
      });
    }
    document.querySelectorAll('[data-section-link]').forEach(link=>{
      if (link.dataset.sectionLink === hash) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    topicNav.querySelectorAll('a').forEach(link=>{ if(link.dataset.topicLink===(topic ? topic[0] : view)) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
    if (view === 'harita') { const frame = document.querySelector('iframe[data-src]'); if (!frame.src) frame.src = frame.dataset.src; }
    document.title = (topic ? topic[1] + ' · Survival' : view === 'harita' ? 'Harita · Survival' : view === 'siralamalar' ? 'Sıralamalar · Survival' : 'Survival') + ' | ArcaDe Craft';
    if (focus) {
      if (categoryMenu) categoryMenu.open = false;
      const target = topic ? document.getElementById(sectionOwners[hash] ? hash : topic[0]) : panels.find(panel => panel.dataset.hubPanel === view);
      target.tabIndex = -1; target.focus({preventScroll:true});
      const heading = view==='genel' ? document.querySelector('.hub-masthead') : toolbar;
      const top = sectionOwners[hash] ? target.getBoundingClientRect().top + window.scrollY - 152 : (heading || target).getBoundingClientRect().top + window.scrollY - 104;
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

  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('survival.js',initialize);
  else initialize({window,document,history:typeof history!=='undefined'?history:undefined,fetch:typeof fetch==='function'?fetch:undefined,setTimeout:typeof setTimeout==='function'?setTimeout:undefined,clearTimeout:typeof clearTimeout==='function'?clearTimeout:undefined,setInterval:typeof setInterval==='function'?setInterval:undefined,clearInterval:typeof clearInterval==='function'?clearInterval:undefined,requestAnimationFrame:typeof requestAnimationFrame==='function'?requestAnimationFrame:undefined});
})();