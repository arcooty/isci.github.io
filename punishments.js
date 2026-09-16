(() => {
  const API = window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1';
  const form = document.getElementById('punishment-search');
  const input = document.getElementById('punishment-player');
  const status = document.getElementById('punishment-status');
  const results = document.getElementById('punishment-results');
  const labels = { BAN: 'Yasaklama', MUTE: 'Susturma', WARN: 'Uyarı', KICK: 'Uzaklaştırma' };
  const date = value => value ? new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Istanbul' }).format(new Date(value)) : 'Kalıcı';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = 'Kayıtlar sorgulanıyor...';
    results.hidden = true;
    results.replaceChildren();
    try {
      const response = await fetch(`${API}/punishments/public?username=${encodeURIComponent(input.value.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 503 ? 'Ceza verileri geçici olarak kullanılamıyor.' : 'Sorgulama tamamlanamadı.');
      if (!data.records.length) {
        status.textContent = `${data.username} için herkese açık ceza kaydı bulunamadı.`;
        return;
      }
      const heading = document.createElement('div');
      heading.className = 'punishment-summary';
      heading.innerHTML = `<div><span>Oyuncu</span><strong></strong></div><div><span>Kayıt</span><strong>${data.records.length}</strong></div>`;
      heading.querySelector('strong').textContent = data.username;
      results.append(heading);
      data.records.forEach(record => {
        const article = document.createElement('article');
        article.className = `punishment-entry${record.active ? ' is-active' : ''}`;
        const title = document.createElement('h2');
        title.textContent = labels[record.type] || 'Ceza';
        const badge = document.createElement('span');
        badge.textContent = record.active ? 'Aktif' : 'Sona erdi';
        const reason = document.createElement('p');
        reason.textContent = record.reason || 'Sebep belirtilmedi';
        const meta = document.createElement('div');
        meta.className = 'punishment-meta';
        meta.innerHTML = `<span>Başlangıç: <strong>${date(record.start)}</strong></span><span>Bitiş: <strong>${date(record.end)}</strong></span>`;
        article.append(title, badge, reason, meta);
        results.append(article);
      });
      results.hidden = false;
      status.textContent = 'Yalnızca herkese açık kayıtlar gösteriliyor.';
    } catch (error) {
      status.textContent = error.message;
    }
  });
})();
