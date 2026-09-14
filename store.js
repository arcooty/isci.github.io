(() => {
  const api = window.ARCADE_API?.base;
  document.querySelectorAll('[data-buy-package]').forEach(button => button.addEventListener('click', async () => {
    const username = document.querySelector('#minecraft-username')?.value.trim();
    const status = document.querySelector('#store-status');
    const consent = document.querySelector('#store-consent')?.checked;
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username || '')) {
      status.textContent = 'Geçerli Minecraft kullanıcı adını yaz.';
      return;
    }
    if (!consent) {
      status.textContent = 'Devam etmek için kullanım ve satış şartlarını onayla.';
      return;
    }
    button.disabled = true; status.textContent = 'Güvenli ödeme sayfası hazırlanıyor...';
    try {
      const response = await fetch(`${api}/store/checkout`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ username, packageId:button.dataset.buyPackage }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error();
      location.assign(data.url);
    } catch { status.textContent = 'Mağaza henüz canlı ödemeye açılmadı. Daha sonra tekrar dene.'; button.disabled = false; }
  }));

  const order = document.querySelector('#order-status');
  if (order) {
    const id = new URLSearchParams(location.search).get('session_id');
    if (!id) order.textContent = 'Sipariş kimliği bulunamadı.';
    else fetch(`${api}/store/order?session_id=${encodeURIComponent(id)}`).then(r => {
      if (!r.ok) throw new Error();
      return r.json();
    }).then(data => {
      order.replaceChildren();
      const values = [data.package?.toUpperCase() || 'VIP', `Oyuncu: ${data.username || '-'}`, `Ödeme: ${data.paymentStatus === 'paid' ? 'Onaylandı' : 'Bekliyor'}`, `Teslimat: ${data.deliveryStatus === 'delivered' ? 'Tamamlandı' : 'Kuyrukta'}`];
      values.forEach((value, index) => { const element = document.createElement(index ? 'span' : 'strong'); element.textContent = value; order.appendChild(element); });
    }).catch(() => { order.textContent = 'Sipariş bilgisi şu anda alınamıyor.'; });
  }
})();
