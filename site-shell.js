(() => {
  const {sections, resolveHref} = window.ARCADE_SITE;
  const discord = 'https://discord.gg/GerdDHzMWp';
  const path = location.pathname.split('/').pop() || 'index.html';
  const section = sections.find(group => group.pages.some(([href]) => href.split('#')[0] === path));
  const labels = Object.fromEntries(sections.flatMap(group => group.pages).map(([href,label]) => [href.split('#')[0],label]));
  Object.assign(labels, {'survival.html':'Survival','news.html':'Topluluk','store.html':'VIP mağazası','order.html':'Sipariş durumu','sitemap.html':'Site haritası'});
  document.body.classList.add('network-shell');
  document.body.dataset.page = path.replace('.html','');
  const icon = name => '<i class="fa-solid fa-' + name + '" aria-hidden="true"></i>';
  const link = (href,text) => '<a href="' + href + '"' + (href === path ? ' aria-current="page"' : '') + '>' + text + '</a>';
  const brand = '<a class="site-brand" href="index.html" aria-label="ArcaDe Craft ana sayfa"><img src="assets/logo.png" alt="" width="42" height="42"><span>ArcaDe <strong>Craft</strong></span></a>';
  let nav = document.querySelector('body > nav');
  if (!nav) { nav = document.createElement('nav'); document.body.prepend(nav); }
  nav.className = 'site-nav'; nav.setAttribute('aria-label','Ana menü');
  nav.innerHTML = '<div class="site-nav-inner">' + brand + '<div class="site-links" id="site-links">' + link('index.html','Ana sayfa') +
    '<div class="nav-menu"><button type="button" aria-expanded="false" aria-controls="games-dropdown"' + (['Oyunlar','Survival'].includes(section?.name) ? ' class="is-current"' : '') + '>Oyunlar ' + icon('chevron-down') + '</button><div class="nav-dropdown" id="games-dropdown">' + link('survival.html',icon('tree') + ' Survival') + link('village.html',icon('moon') + " Rob's Village") + link('servers.html','Bütün oyunlar') + '</div></div>' +
    link('news.html','Topluluk') + link('store.html','VIP mağazası') + link('help.html','Yardım') + '<a class="nav-play" href="join.html">' + icon('play') + ' Oyuna katıl</a></div><div class="nav-tools"><button class="site-search-button" type="button" aria-label="Sitede ara" title="Sitede ara" aria-haspopup="dialog" aria-controls="site-search">' + icon('magnifying-glass') + '</button><button class="mobile-nav-button" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="site-links">' + icon('bars') + '</button></div></div>';
  // Keep the primary section selected on its tools and support forms too.
  const primaryHref = section?.name === 'Topluluk' ? 'news.html' : section?.name === 'VIP mağazası' || path === 'order.html' ? 'store.html' : section?.name === 'Yardım' ? 'help.html' : null;
  if (primaryHref) nav.querySelector('.site-links > a[href="' + primaryHref + '"]')?.classList.add('is-current');
  if (path === 'players.html') nav.querySelector('.nav-menu > button').classList.add('is-current');
  const skip = document.createElement('a'); skip.className = 'skip-link'; skip.href = '#main-content'; skip.textContent = 'İçeriğe geç'; nav.before(skip);
  const mobile = nav.querySelector('.mobile-nav-button');
  const links = nav.querySelector('#site-links');
  const gameMenu = nav.querySelector('.nav-menu');
  const gameButton = gameMenu.querySelector('button');
  const close = () => { gameMenu.classList.remove('is-open'); gameButton.setAttribute('aria-expanded','false'); links.classList.remove('open'); mobile.setAttribute('aria-expanded','false'); mobile.setAttribute('aria-label','Menüyü aç'); };
  mobile.addEventListener('click', () => { const open = links.classList.toggle('open'); mobile.setAttribute('aria-expanded',String(open)); mobile.setAttribute('aria-label',open ? 'Menüyü kapat' : 'Menüyü aç'); });
  gameButton.addEventListener('click', () => { const open = gameMenu.classList.toggle('is-open'); gameButton.setAttribute('aria-expanded',String(open)); });
  document.addEventListener('click',event => { if (!nav.contains(event.target)) close(); });
  nav.addEventListener('keydown',event => { if (event.key === 'Escape') { const focus = gameMenu.classList.contains('is-open') ? gameButton : mobile; close(); focus.focus(); } });
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
    if (path !== 'index.html' && path !== 'survival.html') {
      const parent = path === 'players.html' ? ['survival.html#siralamalar',"Survival'a dön"] : path === 'join.html' ? ['servers.html','Oyunlara dön'] : path === 'order.html' ? ['store.html','Mağazaya dön'] : section && path !== section.href ? [section.href,section.name + ' bölümüne dön'] : ['index.html','Ana sayfaya dön'];
      const trail = document.createElement('nav'); trail.className = 'page-trail'; trail.setAttribute('aria-label','Geri dönüş ve sayfa konumu');
      trail.innerHTML = '<a class="parent-return" href="' + parent[0] + '">' + icon('arrow-left') + ' ' + parent[1] + '</a><span class="trail-divider" aria-hidden="true">/</span><span aria-current="page">' + (labels[path] || 'Sayfa') + '</span>';
      content.prepend(trail);
      if (['Yardım','Topluluk'].includes(section?.name) && path !== 'join.html') {
        const local = document.createElement('nav'); local.className = 'section-navigation'; local.setAttribute('aria-label',section.name + ' bölümleri');
        local.innerHTML = section.pages.filter(([href]) => !href.includes('#') && href !== 'join.html').map(([href,label]) => link(href,label)).join('');
        trail.after(local);
      }
      if (path === 'store.html') {
        const local = document.createElement('nav'); local.className = 'section-navigation section-navigation-sticky'; local.setAttribute('aria-label','VIP mağazası bölümleri');
        local.innerHTML = [['paketler','VIP paketleri'],['karsilastirma','Karşılaştır'],['kitler','Kitler ve kasalar'],['teslimat','Teslimat']].map(([id,label]) => link('#'+id,label)).join('');
        trail.after(local);
        const anchors = [...local.querySelectorAll('a')];
        const selectSection = selected => {
          anchors.forEach(a=>a === selected ? a.setAttribute('aria-current','location') : a.removeAttribute('aria-current'));
        };
        const updateSection = () => selectSection(anchors.find(a=>a.getAttribute('href') === location.hash) || anchors[0]);
        window.addEventListener('hashchange',updateSection); updateSection();
        let scrollPending = false;
        window.addEventListener('scroll',()=>{
          if (scrollPending) return;
          scrollPending=true;
          requestAnimationFrame(()=>{
            const boundary=local.getBoundingClientRect().bottom+140;
            const passed=anchors.filter(a=>document.querySelector(a.getAttribute('href')).getBoundingClientRect().top <= boundary);
            selectSection(passed.at(-1) || anchors[0]); scrollPending=false;
          });
        },{passive:true});
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
    ['Oyna',[['survival.html','Survival'],['village.html',"Rob's Village"],['join.html','Oyuna katıl']]],
    ['Topluluk',[['news.html','Haberler ve topluluk'],['staff.html','Ekibimiz'],['store.html','VIP mağazası']]],
    ['Yardım',[['help.html','Destek merkezi'],['rules.html','Kurallar'],['status.html','Sunucu durumu']]]
  ];
  footer.innerHTML = '<div class="footer-intro">' + brand + '<p>Bir dünya, bir köy, bir topluluk.</p><a href="' + discord + '" target="_blank" rel="noopener"><i class="fa-brands fa-discord" aria-hidden="true"></i> Discord</a></div><div class="site-footer-inner">' + groups.map(([title,pages]) => '<section><h2>' + title + '</h2>' + pages.map(([href,text]) => link(href,text)).join('') + '</section>').join('') + '</div><div class="footer-bottom"><span>© 2026 ArcaDe Craft</span><div>' + link('sitemap.html','Site haritası') + link('privacy.html','Gizlilik') + link('terms.html','Kullanım şartları') + '</div><span>Mojang veya Microsoft ile bağlantılı değildir.</span></div>';
  document.querySelectorAll('[data-copy-address]').forEach(button => button.addEventListener('click',async () => {
    const label = button.querySelector('span'); const original = label?.textContent;
    try { await navigator.clipboard.writeText('oyna.robsarcade.online'); if (label) { label.textContent = 'Adres kopyalandı'; setTimeout(() => { label.textContent = original; },1800); } }
    catch { button.title = 'Sunucu adresi: oyna.robsarcade.online'; }
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
