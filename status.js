(() => {
  const initialize = ({window,document,history,fetch,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame}) => {
(() => {
  const state = document.getElementById('network-state');
  const players = document.getElementById('player-state');
  const time = document.getElementById('status-time');
  const serviceLabels = {
    lobby: document.getElementById('lobby-state'),
    survival: document.getElementById('survival-state'),
    event: document.getElementById('event-state'),
    map: document.getElementById('map-state')
  };
  const API = window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1';
  fetch(`${API}/status`, { headers: { Accept: 'application/json' } })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      if (data.services?.velocity) {
        state.textContent = 'Çevrimiçi ve bağlantı kabul ediyor.';
        players.textContent = 'Lobi ve oyun sunucularının durumu canlı API üzerinden doğrulandı.';
      } else {
        state.textContent = 'Şu anda çevrimdışı veya bakımda.';
        players.textContent = 'Servis doğrulaması alınamadı.';
      }
      Object.entries(serviceLabels).forEach(([name, element]) => {
        if (name === 'event' && !data.services?.[name]) {
          element.textContent = 'Şu anda kapalı veya dönem dışında.';
        } else {
          element.textContent = data.services?.[name] ? 'Çevrimiçi.' : 'Çevrimdışı veya bakımda.';
        }
      });
    })
    .catch(() => {
      state.textContent = 'Durum servisine ulaşılamadı.';
      players.textContent = 'Servis doğrulaması alınamadı.';
      Object.values(serviceLabels).forEach(element => { element.textContent = 'Durum alınamadı.'; });
    })
    .finally(() => { time.textContent = `Son kontrol: ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })} GMT+3`; });
})();

  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('status.js',initialize);
  else initialize({window,document,history:typeof history!=='undefined'?history:undefined,fetch:typeof fetch==='function'?fetch:undefined,setTimeout:typeof setTimeout==='function'?setTimeout:undefined,clearTimeout:typeof clearTimeout==='function'?clearTimeout:undefined,setInterval:typeof setInterval==='function'?setInterval:undefined,clearInterval:typeof clearInterval==='function'?clearInterval:undefined,requestAnimationFrame:typeof requestAnimationFrame==='function'?requestAnimationFrame:undefined});
})();