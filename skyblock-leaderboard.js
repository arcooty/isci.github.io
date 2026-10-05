(() => {
  const initialize = ({window,document,history,fetch,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame}) => {
(() => {
  const tabs = [...document.querySelectorAll('[data-sky-board]')];
  const panel = document.getElementById('sky-board-panel');
  if (!tabs.length || !panel) return;
  const title = document.getElementById('sky-board-title');
  const metric = document.getElementById('sky-board-metric');
  const status = document.getElementById('sky-board-status');
  const list = document.getElementById('sky-board-list');
  const refresh = document.getElementById('sky-board-refresh');
  const updated = document.getElementById('sky-board-updated');
  const categories = {
    economy: ['Ekonomi sıralaması', 'En yüksek 10 Skyblock cüzdan bakiyesi.'],
    bank: ['Ada bankası sıralaması', 'En yüksek 10 ortak ada bakiyesi.'],
    missions: ['Ada görev sıralaması', 'En çok görev tamamlayan 10 ada.'],
    rating: ['Ada değerlendirmeleri', 'Oyuncu değerlendirmelerine göre ilk 10 ada.']
  };
  let category = 'economy';
  let data = null;
  let loading = false;
  let failed = false;
  const render = () => {
    [title.textContent, metric.textContent] = categories[category];
    panel.setAttribute('aria-busy', String(loading));
    refresh.disabled = loading;
    list.replaceChildren();
    updated.hidden = true;
    if (!data) {
      status.hidden = false;
      status.textContent = failed ? 'Sıralama şu anda alınamıyor. Yeniden dene veya oyun içinde /is top kullan.' : 'Sıralama yükleniyor...';
      return;
    }
    const entries = data.boards[category].filter(entry => entry && /^[.]?[A-Za-z0-9_]{3,16}$/.test(entry.name) && typeof entry.value === 'string' && entry.value.length <= 64).slice(0,10);
    status.hidden = !failed && entries.length > 0;
    status.textContent = failed ? 'Yenileme başarısız. Son alınan sıralama gösteriliyor; yeniden deneyebilirsin.' : 'Bu kategoride henüz sıralanacak veri yok.';
    entries.forEach((entry,index) => {
      const row = document.createElement('li');
      const place = document.createElement('span'); place.className = 'board-place'; place.textContent = String(index + 1).padStart(2,'0');
      const avatar = document.createElement('span'); avatar.className = 'sky-board-avatar';
      const skin = document.createElement('img'); skin.src = 'https://mc-heads.net/avatar/' + encodeURIComponent(entry.name) + '/40'; skin.alt = ''; skin.width = 40; skin.height = 40; skin.loading = 'lazy'; skin.addEventListener('error', () => skin.remove(), {once:true}); avatar.append(skin);
      const name = document.createElement('span'); name.className = 'sky-board-name'; name.textContent = entry.name;
      if (category !== 'economy') { const island = document.createElement('small'); island.textContent = typeof entry.island === 'string' && entry.island.trim() ? entry.island.slice(0,64) : 'Ada sahibi'; name.append(island); }
      const value = document.createElement('strong'); value.textContent = entry.value;
      row.append(place,avatar,name,value); list.append(row);
    });
    const time = new Date(data.generatedAt);
    if (Number.isFinite(time.getTime())) {
      updated.dateTime = time.toISOString(); updated.textContent = 'Son güncelleme: ' + time.toLocaleString('tr-TR', {timeZone:'Europe/Istanbul'}); updated.hidden = false;
    }
  };
  const select = tab => {
    category = tab.dataset.skyBoard;
    tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
    panel.setAttribute('aria-labelledby',tab.id);
    render();
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => { select(tab); history.replaceState(null,'','#'+category); });
    tab.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[next]); tabs[next].focus(); history.replaceState(null,'','#'+category);
    });
  });
  const load = async () => {
    if (loading) return;
    loading = true; failed = false; render();
    try {
      const response = await fetch((window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1') + '/skyblock/leaderboards', {headers:{Accept:'application/json'}, signal:AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error('Unavailable');
      const next = await response.json();
      if (next.game !== 'skyblock' || !next.boards || Object.keys(categories).some(key => !Array.isArray(next.boards[key]))) throw new Error('Invalid boards');
      data = next;
    } catch { failed = true; }
    finally { loading = false; render(); }
  };
  const readHash = () => select(tabs.find(tab => tab.dataset.skyBoard === location.hash.slice(1)) || tabs[0]);
  window.addEventListener('hashchange',readHash);
  refresh.addEventListener('click',load);
  readHash(); load();
})();

  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('skyblock-leaderboard.js',initialize);
  else initialize({window,document,history:typeof history!=='undefined'?history:undefined,fetch:typeof fetch==='function'?fetch:undefined,setTimeout:typeof setTimeout==='function'?setTimeout:undefined,clearTimeout:typeof clearTimeout==='function'?clearTimeout:undefined,setInterval:typeof setInterval==='function'?setInterval:undefined,clearInterval:typeof clearInterval==='function'?clearInterval:undefined,requestAnimationFrame:typeof requestAnimationFrame==='function'?requestAnimationFrame:undefined});
})();