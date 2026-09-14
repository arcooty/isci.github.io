(() => {
  const api = window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1';
  const form = document.getElementById('player-search');
  const input = document.getElementById('player-name');
  const status = document.getElementById('player-status');
  const profile = document.getElementById('player-profile');
  const labels = { default: 'Oyuncu', vip: 'VIP', mvip: 'MVIP', uvip: 'UVIP', helper: 'Rehber', mod: 'Moderatör', admin: 'Admin', owner: 'Kurucu' };

  const makeList = (title, values, empty) => {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = title;
    section.append(heading);
    if (!values?.length) {
      const text = document.createElement('p');
      text.textContent = empty;
      section.append(text);
      return section;
    }
    const list = document.createElement('div');
    list.className = 'player-stat-list';
    values.forEach(value => {
      const row = document.createElement('div');
      const name = document.createElement('span');
      const level = document.createElement('strong');
      name.textContent = value.name;
      level.textContent = `Seviye ${Number(value.level).toLocaleString('tr-TR')}`;
      row.append(name, level);
      list.append(row);
    });
    section.append(list);
    return section;
  };

  const render = data => {
    profile.replaceChildren();
    const identity = document.createElement('header');
    identity.className = 'player-identity';
    const image = document.createElement('img');
    image.src = `https://mc-heads.net/avatar/${encodeURIComponent(data.username)}/96`;
    image.alt = `${data.username} Minecraft kafası`;
    const copy = document.createElement('div');
    const kicker = document.createElement('span');
    kicker.textContent = labels[data.rank] || data.rank;
    const title = document.createElement('h2');
    title.textContent = data.username;
    const playtime = document.createElement('p');
    playtime.textContent = `${Math.floor(Number(data.playTimeSeconds || 0) / 3600).toLocaleString('tr-TR')} saat oynama süresi`;
    copy.append(kicker, title, playtime);
    identity.append(image, copy);
    const details = document.createElement('div');
    details.className = 'player-profile-grid';
    details.append(makeList('Meslekler', data.jobs, 'Aktif meslek bulunmuyor.'), makeList('Beceriler', data.skills, 'Beceri verisi bulunmuyor.'));
    profile.append(identity, details);
    profile.hidden = false;
  };

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const name = input.value.trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return;
    status.textContent = 'Profil aranıyor...';
    profile.hidden = true;
    try {
      const response = await fetch(`${api}/players/${encodeURIComponent(name)}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error();
      render(await response.json());
      status.textContent = '';
    } catch { status.textContent = 'Oyuncu bulunamadı veya profil servisine şu anda ulaşılamıyor.'; }
  });
})();
