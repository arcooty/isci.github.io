(() => {
  const state = document.getElementById('network-state');
  const players = document.getElementById('player-state');
  const dot = document.getElementById('network-dot');
  const time = document.getElementById('status-time');
  fetch('https://api.mcsrvstat.us/2/oyna.robsarcade.online')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      if (data.online) {
        state.textContent = 'Çevrimiçi ve bağlantı kabul ediyor.';
        players.textContent = `${Number(data.players?.online || 0).toLocaleString('tr-TR')} / ${Number(data.players?.max || 0).toLocaleString('tr-TR')} oyuncu çevrimiçi.`;
      } else {
        state.textContent = 'Şu anda çevrimdışı veya bakımda.';
        players.textContent = 'Oyuncu bilgisi alınamadı.';
        dot.style.background = '#e05252';
      }
    })
    .catch(() => {
      state.textContent = 'Durum servisine ulaşılamadı.';
      players.textContent = 'Oyuncu bilgisi alınamadı.';
      dot.style.background = '#d6a33f';
    })
    .finally(() => { time.textContent = `Son kontrol: ${new Date().toLocaleString('tr-TR')}`; });
})();
