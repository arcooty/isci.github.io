(() => {
  const api = window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1';
  const status = document.getElementById('staff-status');
  const list = document.getElementById('staff-list');
  const roles = { owner: 'Kurucu', admin: 'Admin', mod: 'Moderatör', helper: 'Rehber' };

  fetch(`${api}/staff`, { headers: { Accept: 'application/json' } })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      const members = Array.isArray(data.staff) ? data.staff : [];
      if (!members.length) {
        status.textContent = 'Aktif kadro verisi henüz yayınlanmıyor.';
        return;
      }
      const fragment = document.createDocumentFragment();
      members.forEach(member => {
        const card = document.createElement('article');
        card.className = 'staff-card';
        const avatar = document.createElement('img');
        avatar.src = `https://mc-heads.net/avatar/${encodeURIComponent(member.username)}/72`;
        avatar.alt = '';
        const copy = document.createElement('div');
        const role = document.createElement('span');
        role.textContent = roles[member.role] || member.role;
        const name = document.createElement('h3');
        name.textContent = member.username;
        copy.append(role, name);
        card.append(avatar, copy);
        fragment.append(card);
      });
      list.replaceChildren(fragment);
      list.hidden = false;
      status.textContent = '';
    })
    .catch(() => { status.textContent = 'Yetkili listesine şu anda ulaşılamıyor.'; });
})();
