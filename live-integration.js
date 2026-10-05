(() => {
  const initialize = ({window,document,history,fetch,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame}) => {
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
        panel.innerHTML = '<div class="info-card"><h2>Canlı veri alınamadı</h2><p>Liderlik servisine şu anda ulaşılamıyor. Veriler yenilendiğinde bu bölüm otomatik olarak tekrar görüntülenecek.</p></div>';
      }));
  }
})();

  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('live-integration.js',initialize);
  else initialize({window,document,history:typeof history!=='undefined'?history:undefined,fetch:typeof fetch==='function'?fetch:undefined,setTimeout:typeof setTimeout==='function'?setTimeout:undefined,clearTimeout:typeof clearTimeout==='function'?clearTimeout:undefined,setInterval:typeof setInterval==='function'?setInterval:undefined,clearInterval:typeof clearInterval==='function'?clearInterval:undefined,requestAnimationFrame:typeof requestAnimationFrame==='function'?requestAnimationFrame:undefined});
})();