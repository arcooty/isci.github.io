(() => {
  let turnstileReady;
  function loadTurnstile() {
    if (window.turnstile?.render) return Promise.resolve(window.turnstile);
    if (turnstileReady) return turnstileReady;
    turnstileReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      const timer = window.setTimeout(() => { script.remove(); reject(new Error('verification_unavailable')); }, 20000);
      script.onload = () => {
        window.clearTimeout(timer);
        if (window.turnstile?.ready) window.turnstile.ready(() => resolve(window.turnstile));
        else reject(new Error('verification_unavailable'));
      };
      script.onerror = () => { window.clearTimeout(timer); script.remove(); reject(new Error('verification_unavailable')); };
      document.head.append(script);
    }).catch(error => { turnstileReady = undefined; throw error; });
    return turnstileReady;
  }
  const initialize = ({window,document,fetch}) => {
    const FORM_API = window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1';
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form[data-form-type]');
      if (!form || form.dataset.formInitialized) return;
      form.dataset.formInitialized = 'true';
      const type = form.dataset.formType;
      const submit = form.querySelector('button[type="submit"]');
      const widget = form.querySelector('[data-turnstile-widget]');
      const status = form.querySelector('[data-form-status]');
      const verificationStatus = form.querySelector('[data-verification-status]');
      const retry = form.querySelector('[data-verification-retry]');
      const help = form.querySelector('[data-verification-help]');
      const originalLabel = submit.innerHTML;
      const mode = () => window.ARCADE_THEME?.getMode?.() || (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
      let widgetId, widgetMode, config, loading = false, sending = false;
      submit.disabled = true;
      function show(message, failed = false) {
        status.textContent = message;
        status.dataset.state = failed ? 'error' : 'info';
      }
      function verification(message, failed = false) {
        if (!form.isConnected) return;
        verificationStatus.textContent = message;
        verificationStatus.dataset.state = failed ? 'error' : 'info';
        retry.hidden = !failed;
        help.hidden = !failed;
      }
      function renderWidget() {
        if (!form.isConnected) return;
        if (widgetId !== undefined) window.turnstile.remove(widgetId);
        widgetId = undefined;
        submit.disabled = true;
        widget.hidden = false;
        widgetMode = mode();
        verification('Güvenlik doğrulamasını tamamla.');
        widgetId = window.turnstile.render(widget, {
          sitekey: config.siteKey, action: type, theme: widgetMode, size: 'flexible',
          callback: () => {
            if (!form.isConnected) return;
            submit.disabled = sending;
            verification('Güvenlik doğrulaması tamamlandı.');
          },
          'expired-callback': () => { submit.disabled = true; verification('Doğrulamanın süresi doldu. Yeniden doğrula.', true); },
          'error-callback': () => { submit.disabled = true; verification('Doğrulama yüklenemedi. Yeniden dene.', true); },
          'timeout-callback': () => { submit.disabled = true; verification('Doğrulama zaman aşımına uğradı. Yeniden dene.', true); }
        });
      }
      async function startVerification() {
        if (loading || sending || !form.isConnected) return;
        loading = true;
        if (widgetId !== undefined) {
          try { window.turnstile.remove(widgetId); } catch {}
          widgetId = undefined;
        }
        submit.disabled = true;
        retry.disabled = true;
        submit.type = 'submit';
        submit.onclick = null;
        submit.innerHTML = originalLabel;
        verification('Güvenlik doğrulaması yükleniyor...');
        show('');
        try {
          const response = await fetch(`${FORM_API}/forms/config`, {cache: 'no-store', signal: AbortSignal.timeout(15000)});
          if (!response.ok) throw new Error('config_unavailable');
          config = await response.json();
          if (!config.enabled || !config.siteKey) throw new Error('verification_unavailable');
          await loadTurnstile();
          renderWidget();
        } catch {
          if (!form.isConnected) return;
          submit.type = 'button';
          submit.disabled = false;
          submit.textContent = "Discord'da Devam Et";
          submit.onclick = () => window.open('https://discord.gg/GerdDHzMWp', '_blank', 'noopener');
          verification('Güvenlik doğrulamasına bağlanılamadı. Yeniden dene; yazdıkların korunuyor.', true);
          show('Web formu şu anda gönderilemiyor. Yeniden deneyebilir veya başvuru ve itirazını Discord üzerinden iletebilirsin.');
        } finally {
          loading = false;
          retry.disabled = false;
        }
      }
      retry.addEventListener('click', startVerification);
      window.addEventListener('arcade-theme-change', () => {
        if (!sending && !loading && widgetId !== undefined && widgetMode !== mode()) {
          try { renderWidget(); } catch { verification('Doğrulama yüklenemedi. Yeniden dene.', true); }
        }
      });
      const observer = new MutationObserver(() => {
        if (form.isConnected) return;
        observer.disconnect();
        if (widgetId !== undefined && window.turnstile) {
          try { window.turnstile.remove(widgetId); } catch {}
          widgetId = undefined;
        }
      });
      observer.observe(document.body, {childList:true});
      form.addEventListener('submit', async event => {
        event.preventDefault();
        if (sending) return;
        const token = widgetId === undefined ? '' : window.turnstile.getResponse(widgetId);
        if (!token) return show('Güvenlik doğrulamasını tamamla.', true);
        sending = true;
        submit.disabled = true;
        submit.textContent = 'Gönderiliyor...';
        show('');
        try {
          const payload = Object.fromEntries(new FormData(form).entries());
          payload.turnstileToken = token;
          const response = await fetch(`${FORM_API}/forms/${type}`, {
            method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(payload)
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok || result.accepted !== true) {
            if (result.error === 'turnstile_failed') throw new Error('Güvenlik doğrulaması geçersiz veya süresi dolmuş. Yeniden doğrula.');
            if (result.error === 'invalid_form') throw new Error('Form alanlarını kontrol et ve eksik bilgileri tamamla.');
            throw new Error('Form gönderilemedi. Bilgilerin korunuyor; biraz sonra tekrar dene.');
          }
          if (!form.isConnected) return;
          form.reset();
          show('Form alındı. Yanıt için Discord hesabını takip et.');
          document.getElementById('successModal')?.classList.remove('hidden');
        } catch (error) {
          if (form.isConnected) show(error instanceof TypeError ? 'Bağlantı kurulamadı. Bilgilerin korunuyor; yeniden dene.' : error.message, true);
        } finally {
          sending = false;
          if (form.isConnected) {
            submit.innerHTML = originalLabel;
            submit.disabled = true;
            try { renderWidget(); } catch { verification('Doğrulama yüklenemedi. Yeniden dene.', true); }
          }
        }
      });
      startVerification();
    });
  };
  if (window.ARCADE_NAVIGATION) window.ARCADE_NAVIGATION.register('form-logic.js', initialize);
  else initialize({window,document,fetch:window.fetch.bind(window)});
})();
