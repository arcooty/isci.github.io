(() => {
  const discord = 'https://discord.gg/GerdDHzMWp';
  const path = location.pathname.split('/').pop() || 'index.html';
  document.body.classList.add('network-shell');
  const survivalPages = ['survival.html','survival-systems.html','jobs.html','claims.html','economy.html','quests.html','commands.html','crates.html','ranks.html','leaderboard.html','wiki.html'];
  const networkPages = ['about.html','servers.html','status.html'];
  const communityPages = ['news.html','rules.html','staff.html','application.html','appeal.html'];
  const current = name => path === name ||
    (name === 'survival.html' && survivalPages.includes(path)) ||
    (name === 'store.html' && path === 'order.html') ? ' aria-current="page"' : '';
  const groupCurrent = pages => pages.includes(path) ? ' aria-current="page"' : '';
  const nav = document.querySelector('nav');
  if (nav) {
    nav.className = 'site-nav';
    nav.innerHTML = `<div class="site-nav-inner">
      <a class="site-brand" href="index.html"><img src="assets/logo.png" alt="ArcaDe Craft Network logosu"><span>ArcaDe Craft <strong>Network</strong></span></a>
      <button class="mobile-nav-button" type="button" aria-label="Menüyü aç" id="site-menu"><i class="fa-solid fa-bars"></i></button>
      <div class="site-links" id="site-links">
        <a href="index.html"${current('index.html')}>ANASAYFA</a>
        <div class="nav-menu network-menu"><button type="button" aria-haspopup="true" aria-expanded="false"${groupCurrent(networkPages)}>AĞ <i class="fa-solid fa-chevron-down"></i></button><div class="nav-dropdown compact-dropdown">
          <section class="nav-menu-group"><span>ArcaDe Craft</span><a href="about.html">Hakkında</a><a href="servers.html">Sunucular</a><a href="status.html">Sunucu Durumu</a></section>
        </div></div>
        <div class="nav-menu survival-menu"><button type="button" aria-haspopup="true" aria-expanded="false"${current('survival.html')}>SURVIVAL <i class="fa-solid fa-chevron-down"></i></button><div class="nav-dropdown survival-dropdown">
          <section class="survival-menu-group"><span>Başlangıç</span><a href="survival.html">Genel Bakış</a><a href="survival-systems.html">Tüm Özellikler</a><a href="wiki.html">Bilgi Bankası</a><a href="commands.html">Komutlar</a></section>
          <section class="survival-menu-group"><span>İlerleme</span><a href="jobs.html">Meslekler</a><a href="quests.html">Görevler</a><a href="leaderboard.html">Liderlik</a></section>
          <section class="survival-menu-group"><span>Ekonomi ve Haklar</span><a href="economy.html">Ekonomi</a><a href="claims.html">Claim Rehberi</a><a href="crates.html">Ödül Kasaları</a><a href="ranks.html">VIP ve Rütbeler</a></section>
        </div></div>
        <div class="nav-menu community-menu"><button type="button" aria-haspopup="true" aria-expanded="false"${groupCurrent(communityPages)}>TOPLULUK <i class="fa-solid fa-chevron-down"></i></button><div class="nav-dropdown compact-dropdown">
          <section class="nav-menu-group"><span>Topluluk</span><a href="news.html">Haberler</a><a href="rules.html">Kurallar</a><a href="staff.html">Yetkili Kadroları</a><a href="application.html">Yetkili Başvurusu</a><a href="appeal.html">Ceza İtirazı</a></section>
        </div></div>
        <a href="store.html"${current('store.html')}>MAĞAZA</a><a class="site-discord" href="${discord}" target="_blank" rel="noopener">DISCORD</a>
      </div></div>`;
    document.getElementById('site-menu')?.addEventListener('click', () => document.getElementById('site-links')?.classList.toggle('open'));
    const navMenus = [...nav.querySelectorAll('.nav-menu')];
    navMenus.forEach(menu => menu.querySelector('button')?.addEventListener('click', event => {
      event.stopPropagation();
      const willOpen = !menu.classList.contains('is-open');
      navMenus.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      menu.classList.toggle('is-open', willOpen);
      menu.querySelector('button')?.setAttribute('aria-expanded', String(willOpen));
    }));
    document.addEventListener('click', event => {
      if (navMenus.some(menu => menu.contains(event.target))) return;
      navMenus.forEach(menu => {
        menu.classList.remove('is-open');
        menu.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
    });
    nav.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const openMenu = nav.querySelector('.nav-menu.is-open');
      openMenu?.classList.remove('is-open');
      openMenu?.querySelector('button')?.setAttribute('aria-expanded', 'false');
      openMenu?.querySelector('button')?.focus();
    });
    nav.querySelectorAll('a[href]').forEach(link => {
      const targetPath = new URL(link.getAttribute('href'), location.href).pathname.split('/').pop();
      if (targetPath === path) link.setAttribute('aria-current', 'page');
    });
  }
  const pageLabels = {
    'about.html': ['Ağ', 'Hakkında'],
    'servers.html': ['Ağ', 'Sunucular'],
    'status.html': ['Ağ', 'Sunucu Durumu'],
    'news.html': ['Ağ', 'Haberler'],
    'rules.html': ['Topluluk', 'Kurallar'],
    'survival.html': ['Survival', 'Genel Bakış'],
    'survival-systems.html': ['Survival', 'Tüm Özellikler'],
    'jobs.html': ['Survival', 'Meslekler'],
    'quests.html': ['Survival', 'Görevler'],
    'claims.html': ['Survival', 'Claim Rehberi'],
    'economy.html': ['Survival', 'Ekonomi'],
    'crates.html': ['Survival', 'Ödül Kasaları'],
    'ranks.html': ['Survival', 'VIP ve Rütbeler'],
    'leaderboard.html': ['Survival', 'Liderlik'],
    'commands.html': ['Survival', 'Komutlar'],
    'wiki.html': ['Survival', 'Bilgi Bankası'],
    'store.html': ['Mağaza', 'VIP Mağazası'],
    'order.html': ['Mağaza', 'Sipariş Durumu'],
    'application.html': ['Topluluk', 'Yetkili Başvurusu'],
    'appeal.html': ['Topluluk', 'Ceza İtirazı'],
    'staff.html': ['Topluluk', 'Yetkili Kadroları'],
    'privacy.html': ['Yasal', 'Gizlilik'],
    'terms.html': ['Yasal', 'Kullanım Şartları']
  };
  const sectionTargets = { Survival: 'survival.html', Mağaza: 'store.html', Ağ: 'about.html', Topluluk: 'news.html', Yasal: 'terms.html' };
  const createPageTrail = () => {
    if (path === 'index.html' || !pageLabels[path]) return null;
    const [section, label] = pageLabels[path];
    const trail = document.createElement('nav');
    trail.className = 'page-trail';
    trail.setAttribute('aria-label', 'Sayfa konumu');
    trail.innerHTML = `<a href="index.html">Ana Sayfa</a><i class="fa-solid fa-chevron-right"></i><a href="${sectionTargets[section]}">${section}</a><i class="fa-solid fa-chevron-right"></i><span aria-current="page">${label}</span>`;
    return trail;
  };
  const main = document.querySelector('main');
  const mainTrail = createPageTrail();
  if (main && mainTrail) main.prepend(mainTrail);
  let legacyContent = null;
  if (path !== 'index.html' && !document.querySelector('main')) {
    legacyContent = [...document.body.children].find(element =>
      element !== nav && element.tagName !== 'SCRIPT' && element.tagName !== 'FOOTER' &&
      (element.tagName === 'HEADER' || (element.tagName === 'DIV' && element.querySelector('h1')))
    );
    if (legacyContent?.tagName === 'HEADER') legacyContent.classList.add('legacy-page-hero');
    if (legacyContent?.tagName === 'DIV') legacyContent.classList.add('legacy-content-shell');
    const legacyTrail = createPageTrail();
    if (legacyContent && legacyTrail) legacyContent.prepend(legacyTrail);
    const eyebrowLabels = {
      'appeal.html': 'Topluluk desteği',
      'application.html': 'Ekibe katıl',
      'leaderboard.html': 'Survival rekabeti',
      'privacy.html': 'Veri güvenliği',
      'rules.html': 'Topluluk düzeni',
      'terms.html': 'Kullanım koşulları'
    };
    const heading = legacyContent?.querySelector('h1');
    if (heading && eyebrowLabels[path]) {
      const eyebrow = document.createElement('span');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = eyebrowLabels[path];
      heading.before(eyebrow);
      heading.classList.add('legacy-heading-title');
      if (heading.nextElementSibling?.tagName === 'P') heading.nextElementSibling.classList.add('legacy-heading-copy');
    }
  }
  document.querySelectorAll('a[href*="discord.gg/"]').forEach(a => a.href = discord);
  document.querySelectorAll('.info-card').forEach(card => {
    const children = [...card.children];
    const trailingTags = [];
    for (let index = children.length - 1; index >= 0 && children[index].classList.contains('tag'); index -= 1) {
      trailingTags.unshift(children[index]);
    }
    if (!trailingTags.length) return;
    const meta = document.createElement('div');
    meta.className = 'info-card-meta';
    trailingTags.forEach(tag => meta.appendChild(tag));
    card.appendChild(meta);
  });
  const footer = document.querySelector('footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `<div class="site-footer-inner">
      <section class="footer-brand"><a class="site-brand" href="index.html"><img src="assets/logo.png" alt="ArcaDe Craft Network logosu"><span>ArcaDe Craft <strong>Network</strong></span></a><p>Güvenli lobi, dengeli Survival ve dönemsel etkinlikleri tek ağda buluşturan Türkçe Minecraft topluluğu.</p><button class="footer-address" type="button" data-copy-address title="Sunucu adresini kopyala"><i class="fa-regular fa-copy"></i><span>oyna.robsarcade.online</span></button></section>
      <section><h2>Ağ</h2><a href="about.html">Hakkında</a><a href="servers.html">Sunucular</a><a href="status.html">Sunucu Durumu</a></section>
      <section><h2>Survival</h2><a href="survival.html">Genel Bakış</a><a href="survival-systems.html">Tüm Özellikler</a><a href="jobs.html">Meslekler</a><a href="quests.html">Görevler</a><a href="claims.html">Claim Rehberi</a><a href="economy.html">Ekonomi</a><a href="crates.html">Ödül Kasaları</a><a href="ranks.html">VIP ve Rütbeler</a></section>
      <section><h2>Topluluk</h2><a href="news.html">Haberler</a><a href="leaderboard.html">Liderlik</a><a href="wiki.html">Bilgi Bankası</a><a href="commands.html">Komutlar</a><a href="rules.html">Kurallar</a><a href="staff.html">Yetkili Kadroları</a><a href="${discord}" target="_blank" rel="noopener">Discord’a Katıl</a><a href="application.html">Yetkili Başvurusu</a><a href="appeal.html">Ceza İtirazı</a></section>
    </div><div class="footer-bottom"><span>© 2026 ArcaDe Craft Network</span><span><a href="privacy.html">Gizlilik</a><a href="terms.html">Kullanım Şartları</a></span><span>Mojang Studios veya Microsoft ile bağlantılı değildir.</span></div>`;
    footer.querySelectorAll('a[href]').forEach(link => {
      const targetPath = new URL(link.getAttribute('href'), location.href).pathname.split('/').pop();
      if (targetPath === path) link.setAttribute('aria-current', 'page');
    });
    footer.querySelector('[data-copy-address]')?.addEventListener('click', event => {
      navigator.clipboard.writeText('oyna.robsarcade.online').then(() => {
        const label = event.currentTarget.querySelector('span');
        label.textContent = 'Adres kopyalandı';
        setTimeout(() => { label.textContent = 'oyna.robsarcade.online'; }, 1600);
      });
    });
  }
  const relatedPages = {
    'survival.html': [['survival-systems.html','Tüm özellikler'],['wiki.html','Bilgi bankası'],['ranks.html','VIP ve rütbeler']],
    'survival-systems.html': [['jobs.html','Meslekler'],['economy.html','Ekonomi'],['claims.html','Claim rehberi']],
    'jobs.html': [['quests.html','Görevler'],['leaderboard.html','Liderlik'],['commands.html','Komutlar']],
    'quests.html': [['jobs.html','Meslekler'],['survival-systems.html#ilerleme','İlerleme sistemleri'],['commands.html','Komutlar']],
    'claims.html': [['commands.html','Claim komutları'],['rules.html','Sunucu kuralları'],['wiki.html','Bilgi bankası']],
    'economy.html': [['jobs.html','Kazanç sağlayan meslekler'],['leaderboard.html','Liderlik'],['commands.html','Ekonomi komutları']],
    'crates.html': [['ranks.html','VIP hakları'],['store.html','VIP mağazası'],['wiki.html','Bilgi bankası']],
    'ranks.html': [['store.html','VIP mağazası'],['crates.html','Kasa oranları'],['rules.html','Satın alma ve oyun kuralları']],
    'leaderboard.html': [['jobs.html','Meslekler'],['economy.html','Ekonomi'],['ranks.html','Rütbeler']],
    'commands.html': [['wiki.html','Bilgi bankası'],['claims.html','Claim rehberi'],['economy.html','Ekonomi']],
    'wiki.html': [['survival.html','Survival merkezi'],['commands.html','Komutlar'],['rules.html','Kurallar']],
    'store.html': [['ranks.html','Paketleri karşılaştır'],['crates.html','Kasa oranları'],['terms.html','Satış şartları']],
    'staff.html': [['application.html','Yetkili başvurusu'],['rules.html','Topluluk kuralları'],['about.html','Ağ yaklaşımı']]
  };
  if (relatedPages[path] && !document.querySelector('.related-nav')) {
    const related = document.createElement('nav');
    related.className = 'related-nav';
    related.setAttribute('aria-label', 'İlgili sayfalar');
    related.innerHTML = `<span>İlgili bölümler</span><div>${relatedPages[path].map(([href,label]) => `<a href="${href}">${label}<i class="fa-solid fa-arrow-right"></i></a>`).join('')}</div>`;
    if (main) main.append(related);
    else if (footer) {
      related.classList.add('legacy-related');
      footer.before(related);
    }
  }
  if (path === 'index.html') {
    const indicator = document.getElementById('section-indicator');
    const updateIndicator = () => {
      if (!indicator || !footer) return;
      const indicatorRect = indicator.getBoundingClientRect();
      const indicatorZone = {
        left: (innerWidth - indicatorRect.width) / 2,
        right: (innerWidth + indicatorRect.width) / 2,
        top: innerHeight - indicatorRect.height - 32,
        bottom: innerHeight - 32
      };
      const overlapsAction = [...document.querySelectorAll('main a, main button, section a, section button')].some(action => {
        const rect = action.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.right > indicatorZone.left &&
          rect.left < indicatorZone.right && rect.bottom > indicatorZone.top && rect.top < indicatorZone.bottom;
      });
      indicator.classList.toggle('is-hidden', footer.getBoundingClientRect().top < innerHeight - 16 || overlapsAction);
    };
    addEventListener('scroll', updateIndicator, { passive: true });
    addEventListener('resize', updateIndicator, { passive: true });
    requestAnimationFrame(updateIndicator);
  }
  const reveal = () => requestAnimationFrame(() => document.documentElement.classList.add('site-ready'));
  const fontReady = document.fonts?.ready || Promise.resolve();
  const heroReady = path === 'index.html' ? new Promise(resolve => {
    const heroImage = new Image();
    heroImage.onload = resolve;
    heroImage.onerror = resolve;
    heroImage.src = 'assets/hero-bg.png';
  }) : Promise.resolve();
  Promise.race([
    Promise.all([fontReady, heroReady]),
    new Promise(resolve => setTimeout(resolve, 1200))
  ]).then(reveal);
})();
