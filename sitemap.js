(() => {
  const container = document.getElementById('sitemap-pages');
  window.ARCADE_SITE.sections.forEach(group => {
    const section = document.createElement('section');
    const title = document.createElement('h2'); title.textContent = group.name; section.append(title);
    group.pages.forEach(([href,label]) => {
      const link = document.createElement('a'); link.href = href; link.textContent = label; section.append(link);
    });
    container.append(section);
  });
})();
