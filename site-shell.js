(() => {
  const discord = 'https://discord.gg/GerdDHzMWp';
  const path = location.pathname.split('/').pop() || 'index.html';
  document.body.classList.add('network-shell');
  const survivalPages = ['survival.html','survival-systems.html','jobs.html','claims.html','economy.html','quests.html','commands.html','ranks.html','leaderboard.html'];
  const current = name => path === name || (name === 'survival.html' && survivalPages.includes(path)) ? ' aria-current="page"' : '';
  const nav = document.querySelector('nav');
  if (nav) {
    nav.className = 'site-nav';
    nav.innerHTML = `<div class="site-nav-inner">
      <a class="site-brand" href="index.html"><img src="assets/logo.png" alt="ArcaDe Craft Network logosu"><span>ArcaDe Craft <strong>Network</strong></span></a>
      <button class="mobile-nav-button" type="button" aria-label="Menüyü aç" id="site-menu"><i class="fa-solid fa-bars"></i></button>
      <div class="site-links" id="site-links">
        <a href="index.html"${current('index.html')}>ANASAYFA</a><a href="about.html"${current('about.html')}>HAKKINDA</a><a href="servers.html"${current('servers.html')}>SUNUCULAR</a><a href="status.html"${current('status.html')}>DURUM</a>
        <div class="survival-menu"><button type="button" aria-haspopup="true" aria-expanded="false"${current('survival.html')}>SURVIVAL <i class="fa-solid fa-chevron-down"></i></button><div class="survival-dropdown">
          <a href="survival.html">Genel Bakış</a><a href="survival-systems.html">Özellikler</a><a href="jobs.html">Meslekler</a><a href="quests.html">Görevler</a><a href="claims.html">Claim</a><a href="economy.html">Ekonomi</a><a href="commands.html">Komutlar</a><a href="ranks.html">Rütbeler</a><a href="leaderboard.html">Liderlik</a><a href="wiki.html">Bilgi Bankası</a>
        </div></div>
        <a href="news.html"${current('news.html')}>HABERLER</a><a href="rules.html"${current('rules.html')}>KURALLAR</a><a class="site-discord" href="${discord}" target="_blank" rel="noopener">DISCORD</a>
      </div></div>`;
    document.getElementById('site-menu')?.addEventListener('click', () => document.getElementById('site-links')?.classList.toggle('open'));
    const survivalMenu = nav.querySelector('.survival-menu');
    const survivalButton = survivalMenu?.querySelector('button');
    survivalButton?.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = survivalMenu.classList.toggle('is-open');
      survivalButton.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', event => {
      if (!survivalMenu?.contains(event.target)) {
        survivalMenu?.classList.remove('is-open');
        survivalButton?.setAttribute('aria-expanded', 'false');
      }
    });
    survivalMenu?.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      survivalMenu.classList.remove('is-open');
      survivalButton?.setAttribute('aria-expanded', 'false');
      survivalButton?.focus();
    });
  }
  if (path !== 'index.html' && !document.querySelector('main')) {
    const topLevelContent = [...document.body.children].find(element =>
      element !== nav && element.tagName !== 'SCRIPT' && element.tagName !== 'FOOTER' &&
      (element.tagName === 'HEADER' || (element.tagName === 'DIV' && element.querySelector('h1')))
    );
    if (topLevelContent?.tagName === 'HEADER') topLevelContent.classList.add('legacy-page-hero');
    if (topLevelContent?.tagName === 'DIV') topLevelContent.classList.add('legacy-content-shell');
    const eyebrowLabels = {
      'appeal.html': 'Topluluk desteği',
      'application.html': 'Ekibe katıl',
      'leaderboard.html': 'Survival rekabeti',
      'privacy.html': 'Veri güvenliği',
      'rules.html': 'Topluluk düzeni',
      'terms.html': 'Kullanım koşulları'
    };
    const heading = topLevelContent?.querySelector('h1');
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
      <section><h2>Ağ</h2><a href="about.html">Hakkında</a><a href="servers.html">Sunucular</a><a href="status.html">Sunucu Durumu</a><a href="news.html">Haberler</a><a href="rules.html">Kurallar</a></section>
      <section><h2>Survival</h2><a href="survival.html">Genel Bakış</a><a href="survival-systems.html">Özellikler</a><a href="jobs.html">Meslekler</a><a href="claims.html">Claim Rehberi</a><a href="economy.html">Ekonomi</a><a href="commands.html">Komutlar</a></section>
      <section><h2>Topluluk</h2><a href="${discord}" target="_blank" rel="noopener">Discord’a Katıl</a><a href="wiki.html">Bilgi Bankası</a><a href="application.html">Yetkili Başvurusu</a><a href="appeal.html">Ceza İtirazı</a></section>
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
