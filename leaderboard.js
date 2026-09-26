(() => {
  const tabs = [...document.querySelectorAll('[data-board-category]')];
  const filter = document.getElementById('board-job-filter');
  const job = document.getElementById('board-job');
  const panel = document.getElementById('board-panel');
  const title = document.getElementById('board-title');
  const metric = document.getElementById('board-metric');
  const status = document.getElementById('board-status');
  const list = document.getElementById('board-list');
  let category = 'ekonomi';
  let boards = null;
  let failed = false;
  const render = () => {
    const key = category === 'jobs' ? job.value : category;
    title.textContent = category === 'jobs' ? job.selectedOptions[0].textContent + ' liderliği' : category === 'ekonomi' ? 'Ekonomi liderliği' : 'Beceri liderliği';
    metric.textContent = category === 'jobs' ? 'En yüksek 10 meslek seviyesi' : category === 'ekonomi' ? 'En yüksek 10 bakiye' : 'En yüksek 10 toplam beceri seviyesi';
    filter.hidden = category !== 'jobs';
    list.replaceChildren();
    if (!boards) {
      status.textContent = failed ? 'Sıralama şu anda alınamıyor. Daha sonra tekrar dene veya oyun içi liderlik menüsünü kullan.' : 'Sıralama yükleniyor…';
      return;
    }
    const entries = Array.isArray(boards[key]) ? boards[key] : [];
    status.textContent = entries.length ? '' : 'Bu kategoride henüz sıralanacak oyuncu verisi yok.';
    entries.slice(0,10).forEach((entry,index) => {
      const row = document.createElement('li');
      const place = document.createElement('span'); place.className = 'board-place'; place.textContent = String(index + 1).padStart(2,'0');
      const skin = document.createElement('img'); skin.src = 'https://mc-heads.net/avatar/' + encodeURIComponent(entry.skin || entry.name) + '/48'; skin.alt = ''; skin.width = 40; skin.height = 40; skin.loading = 'lazy';
      const player = document.createElement('a'); player.href = 'players.html?player=' + encodeURIComponent(entry.name); player.textContent = entry.name;
      const value = document.createElement('strong'); value.textContent = entry.value;
      row.append(place,skin,player,value); list.append(row);
    });
  };
  const select = tab => {
    category = tab.dataset.boardCategory;
    tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected',String(active)); item.tabIndex = active ? 0 : -1; });
    panel.setAttribute('aria-labelledby',tab.id); render();
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[next]); tabs[next].focus();
    });
  });
  job.addEventListener('change',render);
  fetch((window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1') + '/leaderboards', {headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)})
    .then(response => { if (!response.ok) throw new Error('Leaderboard unavailable'); return response.json(); })
    .then(data => { if (!data.boards || typeof data.boards !== 'object') throw new Error('Invalid boards'); boards = data.boards; render(); })
    .catch(() => { failed = true; render(); });
})();
