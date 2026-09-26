(() => {
  const discord = 'https://discord.gg/GerdDHzMWp';
  const path = location.pathname.split('/').pop() || 'index.html';
  const sections = [
    {name:'Oyunlar', href:'servers.html', pages:[['servers.html','Tüm oyunlar'],['survival.html','Survival'],['village.html',"Rob's Village"]]},
    {name:'Survival rehberleri', href:'wiki.html', pages:[['wiki.html','Rehber merkezi'],['survival-systems.html','Tüm özellikler'],['claims.html','Arazi koruma'],['commands.html','Komutlar'],['jobs.html','Meslekler'],['quests.html','Görevler ve beceriler'],['economy.html','Ekonomi ve ticaret'],['map.html','Dünya haritası'],['leaderboard.html','Liderlik tabloları']]},
    {name:'Topluluk', href:'news.html', pages:[['news.html','Haberler'],['players.html','Oyuncu profilleri'],['staff.html','Ekibimiz'],['about.html','Hakkımızda']]},
    {name:'VIP', href:'ranks.html', pages:[['ranks.html','VIP ve rütbeler'],['store.html','VIP mağazası'],['crates.html','Ödül kasaları'],['order.html','Sipariş durumu']]},
    {name:'Destek', href:'help.html', pages:[['help.html','Destek merkezi'],['join.html','Oyuna katılım'],['rules.html','Kurallar'],['status.html','Sunucu durumu'],['punishments.html','Ceza sorgulama'],['appeal.html','Ceza itirazı'],['application.html','Yetkili başvurusu']]},
    {name:'Site', href:'sitemap.html', pages:[['sitemap.html','Site haritası'],['privacy.html','Gizlilik'],['terms.html','Kullanım ve satış şartları']]}
  ];
  window.ARCADE_SITE = Object.freeze({sections});
  document.body.classList.add('network-shell');
  document.body.dataset.page = path.replace('.html','');
  const section = sections.find(group => group.pages.some(([href]) => href === path));
  const label = section?.pages.find(([href]) => href === path)?.[1];
  const survivalPages = sections[1].pages.map(([href]) => href).concat('survival.html','ranks.html','crates.html');
  const icon = name => '<i class="fa-solid fa-' + name + '" aria-hidden="true"></i>';
  const link = (href, text) => '<a href="' + href + '"' + (href === path ? ' aria-current="page"' : '') + '>' + text + '</a>';
  const brand = '<a class="site-brand" href="index.html" aria-label="ArcaDe Craft ana sayfa"><img src="assets/logo.png" alt="" width="42" height="42"><span>ArcaDe <strong>Craft</strong></span></a>';
  let nav = document.querySelector('body > nav');
  if (!nav) { nav = document.createElement('nav'); document.body.prepend(nav); }
  nav.className = 'site-nav';
  nav.setAttribute('aria-label','Ana gezinme');
  nav.innerHTML = '<div class="site-nav-inner">' + brand +
    '<button class="mobile-nav-button" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="site-links" id="site-menu">' + icon('bars') + '</button><div class="site-links" id="site-links">' +
    '<div class="nav-menu"><button type="button" aria-expanded="false" aria-controls="games-dropdown"' + (survivalPages.includes(path) || path === 'village.html' || path === 'servers.html' ? ' class="is-current"' : '') + '>Oyunlar ' + icon('chevron-down') + '</button><div class="nav-dropdown" id="games-dropdown">' + link('survival.html',icon('tree') + ' Survival') + link('village.html',icon('moon') + " Rob's Village") + link('servers.html','Tüm oyunları keşfet') + '</div></div>' +
    link('wiki.html','Rehberler') +
    '<div class="nav-menu"><button type="button" aria-expanded="false" aria-controls="community-dropdown"' + (section?.name === 'Topluluk' ? ' class="is-current"' : '') + '>Topluluk ' + icon('chevron-down') + '</button><div class="nav-dropdown" id="community-dropdown">' + sections[2].pages.map(([href,text]) => link(href,text)).join('') + '</div></div>' +
    link('help.html','Destek') + link('store.html','VIP Mağazası') +
    '<a class="nav-discord" href="' + discord + '" target="_blank" rel="noopener" aria-label="Discord’a katıl" title="Discord’a katıl"><i class="fa-brands fa-discord" aria-hidden="true"></i></a><a class="nav-play" href="join.html">' + icon('play') + ' Oyuna katıl</a></div></div>';
  const skip = document.createElement('a');
  skip.className = 'skip-link'; skip.href = '#main-content'; skip.textContent = 'İçeriğe geç'; nav.before(skip);
  const mobile = nav.querySelector('#site-menu');
  const links = nav.querySelector('#site-links');
  const menus = [...nav.querySelectorAll('.nav-menu')];
  const closeMenus = () => menus.forEach(menu => { menu.classList.remove('is-open'); menu.querySelector('button').setAttribute('aria-expanded','false'); });
  const closeMobile = () => { links.classList.remove('open'); mobile.setAttribute('aria-expanded','false'); mobile.setAttribute('aria-label','Menüyü aç'); };
  mobile.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    mobile.setAttribute('aria-expanded',String(open)); mobile.setAttribute('aria-label',open ? 'Menüyü kapat' : 'Menüyü aç');
    if (!open) closeMenus();
  });
  menus.forEach(menu => menu.querySelector('button').addEventListener('click', () => {
    const open = !menu.classList.contains('is-open'); closeMenus(); menu.classList.toggle('is-open',open); menu.querySelector('button').setAttribute('aria-expanded',String(open));
  }));
  document.addEventListener('click', event => { if (!nav.contains(event.target)) { closeMenus(); closeMobile(); } });
  nav.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const active = nav.querySelector('.nav-menu.is-open > button'); closeMenus();
    if (active) active.focus(); else { closeMobile(); mobile.focus(); }
  });
  nav.addEventListener('focusout', () => requestAnimationFrame(() => { if (!nav.contains(document.activeElement)) { closeMenus(); closeMobile(); } }));

  let content = document.querySelector('main');
  if (!content && path !== 'index.html') {
    content = [...document.body.children].find(el => ['HEADER','DIV'].includes(el.tagName) && el.querySelector('h1'));
    if (content?.tagName === 'HEADER') content.classList.add('legacy-page-hero');
    else content?.classList.add('legacy-content-shell');
  }
  if (content) {
    content.id = 'main-content';
    content.tabIndex = -1;
    if (path !== 'index.html' && label) {
      const trail = document.createElement('nav'); trail.className = 'page-trail'; trail.setAttribute('aria-label','Sayfa konumu');
      const gameParent = survivalPages.includes(path);
      const parentHref = gameParent ? 'survival.html' : section.href;
      const parentLabel = gameParent ? 'Survival' : section.name;
      trail.innerHTML = link('index.html','Ana sayfa') + icon('chevron-right') + (parentHref !== path ? link(parentHref,parentLabel) + icon('chevron-right') : '') + '<span aria-current="page">' + label + '</span>';
      content.prepend(trail);
      if (gameParent) {
        const localNav = document.createElement('nav'); localNav.className = 'game-nav'; localNav.setAttribute('aria-label','Survival bölümleri');
        localNav.innerHTML = link('survival.html','Survival') + link('wiki.html','Rehberler') + link('map.html','Harita') + link('leaderboard.html','Liderlik') + link('ranks.html','VIP ve rütbeler');
        trail.after(localNav);
      }
    }
  }
  content?.querySelector('h1')?.classList.add('craft-page-title');
  document.querySelectorAll('a[href*="discord.gg/"]').forEach(a => a.href = discord);
  document.querySelectorAll('a[href="servers.html#robs-village"]').forEach(a => a.href = 'village.html');
  document.querySelectorAll('.info-card').forEach(card => {
    const tags = [];
    for (const child of [...card.children].reverse()) { if (!child.classList.contains('tag')) break; tags.unshift(child); }
    if (!tags.length) return;
    const meta = document.createElement('div'); meta.className = 'info-card-meta'; tags.forEach(tag => meta.append(tag)); card.append(meta);
  });
  // Associate legacy form labels without changing the submitted field names.
  document.querySelectorAll('form[data-form-type] label').forEach((labelEl,index) => {
    const field = labelEl.parentElement.querySelector('input,select,textarea');
    if (!field || labelEl.contains(field)) return;
    field.id ||= 'form-field-' + index; labelEl.htmlFor = field.id;
  });
  let footer = document.querySelector('footer');
  if (!footer) { footer = document.createElement('footer'); document.body.append(footer); }
  footer.className = 'site-footer';
  const footerGroups = [
    ['Oyunlar',[['servers.html','Tüm oyunlar'],['survival.html','Survival'],['village.html',"Rob's Village"],['join.html','Oyuna katılım'],['map.html','Dünya haritası']]],
    ['Keşfet',[['wiki.html','Survival rehberleri'],['leaderboard.html','Liderlik'],['players.html','Oyuncu profilleri'],['news.html','Haberler'],['about.html','Hakkımızda']]],
    ['VIP',[['ranks.html','VIP ve rütbeler'],['store.html','VIP mağazası'],['crates.html','Ödül kasaları'],['order.html','Sipariş durumu']]],
    ['Yardım',[['help.html','Destek merkezi'],['rules.html','Kurallar'],['punishments.html','Ceza sorgulama'],['appeal.html','Ceza itirazı'],['application.html','Yetkili başvurusu'],['staff.html','Ekibimiz'],['status.html','Sunucu durumu']]]
  ];
  footer.innerHTML = '<div class="footer-intro">' + brand + '<p>Bir dünya, bir köy, bir topluluk.</p><a href="' + discord + '" target="_blank" rel="noopener"><i class="fa-brands fa-discord" aria-hidden="true"></i> Discord</a></div><div class="site-footer-inner">' + footerGroups.map(([title,pages]) => '<section><h2>' + title + '</h2>' + pages.map(([href,text]) => link(href,text)).join('') + '</section>').join('') + '</div><div class="footer-bottom"><span>© 2026 ArcaDe Craft</span><div>' + link('sitemap.html','Site haritası') + link('privacy.html','Gizlilik') + link('terms.html','Kullanım şartları') + '</div><span>Mojang veya Microsoft ile bağlantılı değildir.</span></div>';
  document.querySelectorAll('[data-copy-address]').forEach(button => button.addEventListener('click', async () => {
    const labelEl = button.querySelector('span'); const original = labelEl?.textContent;
    try {
      await navigator.clipboard.writeText('oyna.robsarcade.online');
      if (labelEl) { labelEl.textContent = 'Adres kopyalandı'; setTimeout(() => { labelEl.textContent = original; },1800); }
    } catch {
      if (labelEl) labelEl.textContent = 'oyna.robsarcade.online';
      button.title = 'Sunucu adresi: oyna.robsarcade.online';
    }
  }));
  const related = {
    'jobs.html':[['quests.html','Görevler ve beceriler'],['leaderboard.html','Meslek liderliği']],
    'quests.html':[['jobs.html','Meslek seçimi'],['survival-systems.html#ilerleme','İlerleme özellikleri']],
    'claims.html':[['commands.html','Komutlar'],['map.html','Dünya haritası']],
    'economy.html':[['jobs.html','Meslek kazançları'],['leaderboard.html','Ekonomi liderliği']],
    'crates.html':[['ranks.html','VIP hakları'],['store.html','VIP mağazası']],
    'ranks.html':[['store.html','VIP mağazası'],['crates.html','Kasa ödülleri ve oranları']],
    'commands.html':[['claims.html','Arazi koruma'],['economy.html','Ekonomi ve ticaret']],
    'players.html':[['leaderboard.html','Liderlik tabloları'],['staff.html','Ekibimiz']],
    'store.html':[['ranks.html','Bütün VIP hakları'],['crates.html','Kasa ödülleri'],['terms.html','Satış şartları']],
    'punishments.html':[['appeal.html','Ceza itirazı'],['rules.html','Kurallar']],
    'appeal.html':[['punishments.html','Ceza sorgulama'],['help.html','Destek merkezi']],
    'application.html':[['staff.html','Ekibimiz'],['help.html','Destek merkezi']]
  };
  if (related[path]) {
    const relatedNav = document.createElement('nav'); relatedNav.className = 'related-nav'; relatedNav.setAttribute('aria-label','İlgili sayfalar');
    relatedNav.innerHTML = '<span>Devamını keşfet</span><div>' + related[path].map(([href,text]) => link(href,text + ' ' + icon('arrow-right'))).join('') + '</div>';
    if (content?.tagName === 'MAIN') content.append(relatedNav); else { relatedNav.classList.add('legacy-related'); footer.before(relatedNav); }
  }
  document.documentElement.classList.add('site-ready');
})();
