(() => {
  const API = window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1';
  const setText = (selector, value) => document.querySelectorAll(selector).forEach(el => el.textContent = value);
  setText('#server-ip', window.ARCADECRAFT?.address || 'oyna.robsarcade.online');

  const donation = [...document.querySelectorAll('p')].find(el => el.textContent.includes('Son Bağışlar'));
  if (donation) donation.parentElement.style.display = 'none';

  if (location.pathname.endsWith('leaderboard.html')) {
    fetch(`${API}/leaderboards`, {headers:{Accept:'application/json'}})
      .then(r => { if (!r.ok) throw new Error('API unavailable'); return r.json(); })
      .then(data => window.renderArcadeLeaderboards?.(data))
      .catch(() => document.querySelectorAll('.lb-panel').forEach(panel => {
        panel.innerHTML = '<div class="info-card"><h2>Canlı veri hazırlanıyor</h2><p>Liderlik tablosu yalnızca imzalı web API devreye alındığında gerçek oyuncu verisi gösterecek. Örnek oyuncu ve bakiye gösterimi kaldırıldı.</p></div>';
      }));
  }
})();
