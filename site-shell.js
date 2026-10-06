(() => {
  const initialize = ({window,document,history,fetch,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame}) => {
(() => {
  const {sections, resolveHref} = window.ARCADE_SITE;
  const discord = 'https://discord.gg/GerdDHzMWp';
  const path = location.pathname.split('/').pop() || 'index.html';
  const gamePage = /^(?:servers|(?:survival|skyblock|village|boxpvp|pillars)(?:-[a-z-]+)?)\.html$/.test(path);
  const section = sections.find(group => group.pages.some(([href]) => href.split('#')[0] === path));
  const labels = Object.fromEntries(sections.flatMap(group => group.pages).map(([href,label]) => [href.split('#')[0],label]));
  Object.assign(labels, {'skyblock.html':'Skyblock','survival.html':'Survival','community.html':'Topluluk','news.html':'Haberler','store.html':'VIP mağazası','order.html':'Sipariş durumu','sitemap.html':'Site haritası'});
  document.body.classList.add('network-shell');
  document.body.dataset.page = path.replace('.html','');
  const icon = name => '<i class="fa-solid fa-' + name + '" aria-hidden="true"></i>';
  const link = (href,text) => '<a href="' + href + '"' + (href === path ? ' aria-current="page"' : '') + '>' + text + '</a>';
  const brand = '<a class="site-brand" href="index.html" aria-label="ArcaDe Craft ana sayfa"><img src="assets/logo.png" alt="" width="42" height="42"><span>ArcaDe <strong>Craft</strong></span></a>';
  let nav = document.querySelector('body > nav');
  if (!nav) { nav = document.createElement('nav'); document.body.prepend(nav); }
  nav.className = 'site-nav'; nav.setAttribute('aria-label','Ana menü');
  if (!nav.querySelector('.site-nav-inner')) nav.innerHTML = '<div class="site-nav-inner">' + brand + '<div class="site-links" id="site-links">' + link('index.html','Ana sayfa') +
    link('servers.html','Oyunlar') +
    link('community.html','Topluluk') + link('store.html','VIP mağazası') + link('help.html','Yardım') + '<a class="nav-play" href="join.html">' + icon('play') + ' Oyuna katıl</a></div><div class="nav-tools"><button class="site-search-button" type="button" aria-label="Sitede ara" title="Sitede ara" aria-haspopup="dialog" aria-controls="site-search">' + icon('magnifying-glass') + '</button><button class="theme-toggle" type="button" aria-label="Açık temaya geç" title="Açık temaya geç">' + icon('sun') + '</button><button class="mobile-nav-button" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="site-links">' + icon('bars') + '</button></div></div>';
  const themeButton = nav.querySelector('.theme-toggle');
  let themePicker = themeButton.parentElement;
  if (!themePicker.classList.contains('theme-picker')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-picker';
    themeButton.before(wrapper);
    wrapper.append(themeButton);
    themePicker = wrapper;
  }
  const themeOptions = [
    {id:'pop', label:'Pop', note:'Tam ekran · Altın'},
    {id:'abyss', label:'Abyss', note:'Buz mavisi · Ferah'},
    {id:'cobalt', label:'Cobalt', note:'Gece vitrini · Mavi'},
    {id:'moss', label:'Moss', note:'Orman · Yeşil'},
    {id:'valley', label:'Valley', note:'Sinematik · Kehribar'}
  ];
  themeButton.setAttribute('aria-haspopup','true');
  themeButton.setAttribute('aria-expanded','false');
  themeButton.setAttribute('aria-controls','theme-picker-menu');
  themeButton.setAttribute('aria-label','Tema seç');
  themeButton.title = 'Tema seç';
  const themeMenu = document.createElement('div');
  themeMenu.className = 'theme-menu';
  themeMenu.id = 'theme-picker-menu';
  themeMenu.setAttribute('role','group');
  themeMenu.setAttribute('aria-label','Yerel site temaları');
  themeMenu.hidden = true;
  themeOptions.forEach(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-choice';
    button.dataset.themeChoice = option.id;
    button.setAttribute('aria-pressed','false');
    const swatch = document.createElement('span');
    swatch.className = 'theme-swatch';
    swatch.dataset.themeSwatch = option.id;
    swatch.setAttribute('aria-hidden','true');
    const copy = document.createElement('span');
    copy.className = 'theme-choice-copy';
    const label = document.createElement('strong');
    label.textContent = option.label;
    const note = document.createElement('small');
    note.textContent = option.note;
    copy.append(label,note);
    const check = document.createElement('i');
    check.className = 'fa-solid fa-check';
    check.setAttribute('aria-hidden','true');
    button.append(swatch,copy,check);
    themeMenu.append(button);
  });
  themePicker.append(themeMenu);
  const closeThemeMenu = () => {
    themeMenu.hidden = true;
    themeButton.setAttribute('aria-expanded','false');
  };
  themeButton.addEventListener('click',() => {
    const open = themeMenu.hidden;
    themeMenu.hidden = !open;
    themeButton.setAttribute('aria-expanded',String(open));
  });
  themeMenu.addEventListener('click',event => {
    const choice = event.target.closest?.('[data-theme-choice]');
    if (!choice) return;
    window.ARCADE_THEME.set(choice.dataset.themeChoice);
    closeThemeMenu();
    themeButton.focus();
  });
  themeMenu.addEventListener('keydown',event => {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    closeThemeMenu();
    themeButton.focus();
  });
  document.addEventListener('click',event => {
    if (!themePicker.contains(event.target)) closeThemeMenu();
  });
  const renderTheme = () => {
    const selectedTheme = window.ARCADE_THEME.get();
    const selectedOption = themeOptions.find(option => option.id === selectedTheme) || themeOptions[0];
    const mode = window.ARCADE_THEME.getMode();
    themeButton.setAttribute('aria-label',selectedOption.label + ' teması seçili. Tema seçeneklerini aç.');
    themeButton.title = selectedOption.label + ' teması';
    themeButton.innerHTML = '<span class="theme-icon" aria-hidden="true">◐</span>';
    themeMenu.querySelectorAll('[data-theme-choice]').forEach(button => {
      const selected = button.dataset.themeChoice === selectedTheme;
      button.setAttribute('aria-pressed',String(selected));
      button.classList.toggle('is-selected',selected);
    });
    const widget = document.querySelector('.discord-widget');
    if (widget) {
      const url = new URL(widget.src);
      if (url.searchParams.get('theme') !== mode) {
        url.searchParams.set('theme',mode);
        widget.src = url.href;
      }
    }
  };
  window.addEventListener('arcade-theme-change',renderTheme);
  renderTheme();
  const compatibility = window.ARCADECRAFT?.compatibility;
  document.querySelectorAll('[data-client-range]').forEach(element => {
    const range = compatibility?.[element.dataset.clientRange];
    if (range) element.textContent = range.min + ' - ' + range.max;
  });
  document.querySelectorAll('[data-client-recommended]').forEach(element => {
    const range = compatibility?.[element.dataset.clientRecommended];
    if (range) element.textContent = range.recommended;
  });
  document.querySelectorAll('[data-client-notice]').forEach(element => {
    const range = compatibility?.[element.dataset.clientNotice];
    if (!range) return;
    element.textContent = range.notice || '';
    element.hidden = !range.notice;
  });
  // Keep the primary section selected on its tools and support forms too.
  const primaryHref = section?.name === 'Topluluk' ? 'community.html' : section?.name === 'VIP mağazası' || path === 'order.html' ? 'store.html' : section?.name === 'Yardım' ? 'help.html' : null;
  if (primaryHref) nav.querySelector('.site-links > a[href="' + primaryHref + '"]')?.classList.add('is-current');
  const skip = document.createElement('a'); skip.className = 'skip-link'; skip.href = '#main-content'; skip.textContent = 'İçeriğe geç'; nav.before(skip);
  const mobile = nav.querySelector('.mobile-nav-button');
  const links = nav.querySelector('#site-links');
  const gamesLink = links.querySelector('a[href="servers.html"]');
  gamesLink.classList.toggle('is-current',gamePage);
  if (gamePage) gamesLink.setAttribute('aria-current',path === 'servers.html' ? 'page' : 'location');
  else gamesLink.removeAttribute('aria-current');
  const close = () => { links.classList.remove('open'); mobile.setAttribute('aria-expanded','false'); mobile.setAttribute('aria-label','Menüyü aç'); };
  mobile.addEventListener('click', () => { const open = links.classList.toggle('open'); mobile.setAttribute('aria-expanded',String(open)); mobile.setAttribute('aria-label',open ? 'Menüyü kapat' : 'Menüyü aç'); });
  document.addEventListener('click',event => { if (!nav.contains(event.target)) close(); });
  nav.addEventListener('keydown',event => { if (event.key === 'Escape' && links.classList.contains('open')) { close(); mobile.focus(); } });
  nav.addEventListener('focusout',() => requestAnimationFrame(() => { if (!nav.contains(document.activeElement)) close(); }));

  let content = document.querySelector('main');
  if (!content) {
    content = [...document.body.children].find(el => ['HEADER','DIV'].includes(el.tagName) && el.querySelector('h1'));
    content?.classList.add(content.tagName === 'HEADER' ? 'legacy-page-hero' : 'legacy-content-shell');
  }
  if (content) {
    content.id = 'main-content'; content.tabIndex = -1;
    skip.addEventListener('click',event=>{ event.preventDefault(); content.focus({preventScroll:true}); content.scrollIntoView({block:'start',behavior:'instant'}); });
    content.querySelector('h1')?.classList.add('craft-page-title');
    if (!['index.html','survival.html','join.html','servers.html','privacy.html','terms.html','sitemap.html'].includes(path) && !content.querySelector('.game-guide-toolbar,.game-hub-heading,.village-masthead,.chunky-nav')) {
      const parent = path === 'players.html' ? ['survival.html#siralamalar',"Survival'a dön"] : path === 'join.html' ? ['servers.html','Oyunlara dön'] : path === 'order.html' ? ['store.html','Mağazaya dön'] : section && path !== section.href ? [section.href,section.name + ' bölümüne dön'] : ['index.html','Ana sayfaya dön'];
      const trail = document.createElement('nav'); trail.className = 'page-trail'; trail.setAttribute('aria-label','Geri dönüş ve sayfa konumu');
      trail.innerHTML = '<a class="parent-return" href="' + parent[0] + '">' + icon('arrow-left') + ' ' + parent[1] + '</a><span class="trail-divider" aria-hidden="true">/</span><span aria-current="page">' + (labels[path] || 'Sayfa') + '</span>';
      content.prepend(trail);
      if (['Yardım','Topluluk'].includes(section?.name) && path !== 'join.html') {
        const local = document.createElement('nav'); local.className = 'section-navigation'; local.setAttribute('aria-label',section.name + ' bölümleri');
        local.innerHTML = section.pages.filter(([href]) => !href.includes('#') && href !== 'join.html').map(([href,label]) => link(href,label)).join('');
        const heading = content.querySelector('.page-head');
        if (heading) heading.after(local);
        else trail.after(local);
      }
    }
  }
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href.includes('discord.gg/')) a.href = discord;
    else if (href === 'servers.html#robs-village') a.href = 'village.html';
    else a.setAttribute('href',resolveHref(href));
  });
  document.querySelectorAll('form[data-form-type] label').forEach((label,index) => {
    const field = label.parentElement.querySelector('input,select,textarea');
    if (!field || label.contains(field)) return;
    field.id ||= 'form-field-' + index; label.htmlFor = field.id;
  });
  let footer = document.querySelector('footer');
  if (!footer) { footer = document.createElement('footer'); document.body.append(footer); }
  footer.className = 'site-footer';
  const groups = [
    ['Oyna',[...sections.find(group => group.name === 'Oyunlar').pages.filter(([href]) => href !== 'servers.html'),['join.html','Oyuna katıl']]],
    ['Topluluk',[['community.html','Topluluk'],['news.html','Haberler'],['staff.html','Ekibimiz']]],
    ['Yardım',[['help.html','Destek merkezi'],['rules.html','Kurallar'],['status.html','Sunucu durumu']]]
  ];
  const footerDiscord = '<a href="' + discord + '" target="_blank" rel="noopener"><i class="fa-brands fa-discord" aria-hidden="true"></i> Discord</a>';
  if (!footer.querySelector('.site-footer-inner')) footer.innerHTML = '<div class="footer-intro">' + brand + '</div><div class="site-footer-inner">' + groups.map(([title,pages]) => '<section><h2>' + title + '</h2>' + pages.map(([href,text]) => link(href,text)).join('') + (title === 'Topluluk' ? footerDiscord : '') + '</section>').join('') + '</div><div class="footer-bottom"><span>© 2026 ArcaDe Craft</span><div>' + link('sitemap.html','Site haritası') + link('privacy.html','Gizlilik') + link('terms.html','Kullanım şartları') + '</div><span>Mojang veya Microsoft ile bağlantılı değildir.</span></div>';
  const playSection = [...footer.querySelectorAll('.site-footer-inner > section')].find(group => group.querySelector('h2')?.textContent === 'Oyna');
  groups[0][1].forEach(([href,label]) => {
    if (!playSection || playSection.querySelector('a[href="' + href + '"]')) return;
    const item = document.createElement('a'); item.href = href; item.textContent = label;
    if (href === path) item.setAttribute('aria-current','page');
    playSection.insertBefore(item,playSection.querySelector('a[href="join.html"]'));
  });
  document.querySelectorAll('[data-copy-address]').forEach(button => button.addEventListener('click',async () => {
    const label = button.querySelector('span'); const original = label?.textContent;
    try { await navigator.clipboard.writeText(button.dataset.copyAddress || 'oyna.robsarcade.online'); if (label) { label.textContent = 'Adres kopyalandı'; setTimeout(() => { label.textContent = original; },1800); } }
    catch { button.title = 'Sunucu adresi: ' + (button.dataset.copyAddress || 'oyna.robsarcade.online'); }
  }));

  const searchDialog = document.createElement('dialog');
  searchDialog.id = 'site-search'; searchDialog.className = 'site-search'; searchDialog.setAttribute('aria-labelledby','site-search-title');
  searchDialog.innerHTML = '<div class="search-heading"><h2 id="site-search-title">Sitede ara</h2><button type="button" class="search-close" aria-label="Aramayı kapat" title="Kapat">'+icon('xmark')+'</button></div><form method="dialog" class="search-form"><label for="site-search-query" class="sr-only">Arama</label><div class="search-field">'+icon('magnifying-glass')+'<input id="site-search-query" type="search" placeholder="Ev, meslek, VIP…" maxlength="100" autocomplete="off" spellcheck="false"></div></form><p class="search-count" role="status" aria-live="polite"></p><nav class="search-results" aria-label="Arama sonuçları"></nav><p class="search-empty" hidden>Sonuç bulunamadı. <a href="help.html">Destek merkezine git</a></p>';
  document.body.append(searchDialog);
  const searchButton = nav.querySelector('.site-search-button');
  let searchDestinationChosen = false;
  const searchInput = searchDialog.querySelector('input');
  const searchResults = searchDialog.querySelector('.search-results');
  const searchCount = searchDialog.querySelector('.search-count');
  const renderSearch = () => {
    const results = window.ARCADE_SITE.search(searchInput.value);
    searchResults.replaceChildren();
    results.forEach(result=>{
      const a=document.createElement('a'); a.href=result.href;
      const symbol=document.createElement('i'); symbol.className='fa-solid fa-'+result.icon; symbol.setAttribute('aria-hidden','true');
      const text=document.createElement('span');
      const context=document.createElement('small'); context.textContent=result.section;
      const title=document.createElement('strong'); title.textContent=result.label;
      text.append(context,title);
      const arrow=document.createElement('i'); arrow.className='fa-solid fa-arrow-right'; arrow.setAttribute('aria-hidden','true');
      a.append(symbol,text,arrow); searchResults.append(a);
    });
    searchCount.textContent=searchInput.value.trim() ? results.length+' sonuç' : 'Başlangıç noktaları';
    searchDialog.querySelector('.search-empty').hidden=results.length>0;
  };
  searchButton.addEventListener('click',()=>{ close(); searchDestinationChosen=false; searchInput.value=''; renderSearch(); searchDialog.showModal(); searchInput.focus(); });
  searchDialog.querySelector('.search-close').addEventListener('click',()=>searchDialog.close());
  searchDialog.addEventListener('keydown',event=>{ if(event.key === 'Escape') { event.preventDefault(); searchDialog.close(); } });
  searchDialog.addEventListener('click',event=>{
    if (event.target.closest('a')) { searchDestinationChosen=true; searchDialog.close(); }
    else if (event.target === searchDialog) {
      const rect=searchDialog.getBoundingClientRect();
      if (event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) searchDialog.close();
    }
  });
  searchDialog.addEventListener('close',()=>{ if (!searchDestinationChosen) searchButton.focus({preventScroll:true}); });
  searchDialog.querySelector('form').addEventListener('submit',event=>{ event.preventDefault(); searchResults.querySelector('a')?.click(); });
  searchInput.addEventListener('input',renderSearch);
  searchInput.addEventListener('keydown',event=>{ if(event.key === 'ArrowDown') { const first=searchResults.querySelector('a'); if(first) { event.preventDefault(); first.focus(); } } });

  const copyFeedback=document.createElement('p'); copyFeedback.className='sr-only'; copyFeedback.setAttribute('role','status'); document.body.append(copyFeedback);
  document.querySelectorAll('.command').forEach(row=>{
    const command=row.querySelector('code'); if(!command) return;
    const button=document.createElement('button'); button.type='button'; button.className='command-copy';
    button.innerHTML=icon('copy'); button.setAttribute('aria-label','Komutu kopyala: '+command.textContent); button.title='Komutu kopyala'; row.append(button);
    button.addEventListener('click',async()=>{
      try { await navigator.clipboard.writeText(command.textContent.trim()); button.innerHTML=icon('check'); button.title='Kopyalandı'; copyFeedback.textContent='Komut kopyalandı: '+command.textContent; setTimeout(()=>{button.innerHTML=icon('copy');button.title='Komutu kopyala';},1800); }
      catch { button.title='Kopyalanamadı'; copyFeedback.textContent='Komut kopyalanamadı; metin seçildi.'; const selection=window.getSelection(); const range=document.createRange(); range.selectNodeContents(command); selection.removeAllRanges(); selection.addRange(range); }
    });
  });
  document.documentElement.classList.add('site-ready');
})();

  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('site-shell.js',initialize);
  else initialize({window,document,history:typeof history!=='undefined'?history:undefined,fetch:typeof fetch==='function'?fetch:undefined,setTimeout:typeof setTimeout==='function'?setTimeout:undefined,clearTimeout:typeof clearTimeout==='function'?clearTimeout:undefined,setInterval:typeof setInterval==='function'?setInterval:undefined,clearInterval:typeof clearInterval==='function'?clearInterval:undefined,requestAnimationFrame:typeof requestAnimationFrame==='function'?requestAnimationFrame:undefined});
})();
