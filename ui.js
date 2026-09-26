(() => {
  const state = document.getElementById('home-state');
  if (!state) return;
  const count = document.getElementById('floating-player-count');
  const max = document.getElementById('home-player-max');
  const meter = document.getElementById('home-capacity');
  const read = async url => {
    const response = await fetch(url, {headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error('Status unavailable');
    return response.json();
  };
  const refresh = async () => {
    try {
      const [serviceResult, publicResult] = await Promise.allSettled([
        read(`${window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1'}/status`),
        read('https://api.mcsrvstat.us/2/oyna.robsarcade.online')
      ]);
      const data = serviceResult.status === 'fulfilled' ? serviceResult.value : null;
      const ping = publicResult.status === 'fulfilled' ? publicResult.value : null;
      const serviceOnline = data?.services?.velocity;
      const publicOnline = ping?.online;
      if (typeof serviceOnline !== 'boolean' && typeof publicOnline !== 'boolean') throw new Error('Missing network state');
      const online = typeof publicOnline === 'boolean' ? publicOnline && serviceOnline !== false : serviceOnline;
      const players = data?.players || (publicOnline ? ping.players : null);
      state.dataset.state = online ? 'online' : 'offline';
      state.textContent = online ? 'Aktif' : 'Çevrimdışı';
      count.textContent = online ? players ? Number(players.online).toLocaleString('tr-TR') : '—' : '0';
      const capacity = Number(players?.max || 0);
      max.textContent = capacity ? capacity.toLocaleString('tr-TR') : '—';
      meter.style.width = `${capacity && online ? Math.min(100, Math.max(0, Number(players.online) / capacity * 100)) : 0}%`;
    } catch {
      state.textContent = 'Bilgi alınamadı'; state.dataset.state = 'unknown';
      count.textContent = '—'; max.textContent = '—'; meter.style.width = '0%';
    }
  };
  refresh();
  setInterval(() => { if (!document.hidden) refresh(); },60000);
})();
