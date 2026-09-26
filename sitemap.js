(() => {
  const container = document.getElementById('sitemap-pages');
  const {sections,topics} = window.ARCADE_SITE;
  const makeLink = (href,label) => { const a=document.createElement('a'); a.href=href; a.textContent=label; return a; };
  container.before(makeLink('index.html','Ana sayfa'));
  sections.filter(group=>group.name !== 'Survival').forEach(group => {
    const section = document.createElement('section');
    const title = document.createElement('h2'); title.textContent = group.name; section.append(title);
    group.pages.forEach(([href,label]) => {
      const link = makeLink(href,label); section.append(link);
      if (href === 'survival.html') {
        const branches = document.createElement('div'); branches.className='sitemap-branches';
        branches.append(makeLink('survival.html#genel','Genel bakış'));
        const guide = document.createElement('details');
        const summary = document.createElement('summary'); summary.textContent='Oyun rehberi'; guide.append(summary);
        topics.forEach(([id,label])=>guide.append(makeLink('survival.html#'+id,label)));
        branches.append(guide,makeLink('survival.html#harita','Harita'),makeLink('survival.html#siralamalar','Sıralamalar'),makeLink('players.html','Oyuncu profilleri'));
        section.append(branches);
      }
    });
    container.append(section);
  });
})();
