const FORM_API = window.ARCADE_API?.base || 'https://api.robsarcade.online/api/v1';
const DISCORD_URL = 'https://discord.gg/GerdDHzMWp';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('form[data-form-type]');
  if (!form) return;
  const type = form.dataset.formType;
  const submit = form.querySelector('button[type="submit"]');
  const widget = form.querySelector('[data-turnstile-widget]');
  const status = form.querySelector('[data-form-status]');
  const originalLabel = submit.innerHTML;
  let widgetId;
  submit.disabled = true;

  function show(message, failed = false) {
    status.textContent = message;
    status.className = `mt-4 text-sm ${failed ? 'text-red-300' : 'text-gray-300'}`;
  }
  function fallback() {
    widget.hidden = true;
    submit.type = 'button';
    submit.disabled = false;
    submit.textContent = "Discord'da Devam Et";
    submit.onclick = () => window.open(DISCORD_URL, '_blank', 'noopener');
    show('Web formu şu anda kullanılamıyor. Başvuru veya itirazını Discord üzerinden ilet.');
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (widgetId === undefined) return fallback();
    const token = window.turnstile.getResponse(widgetId);
    if (!token) return show('Güvenlik doğrulamasını tamamla.', true);
    submit.disabled = true;
    submit.textContent = 'Gönderiliyor...';
    try {
      const payload = Object.fromEntries(new FormData(form).entries());
      payload.turnstileToken = token;
      const response = await fetch(`${FORM_API}/forms/${type}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Form gönderilemedi. Biraz sonra tekrar dene veya Discord üzerinden ilet.');
      form.reset();
      show('Form alındı. Yanıt için Discord hesabını takip et.');
      document.getElementById('successModal')?.classList.remove('hidden');
    } catch (error) {
      show(error.message, true);
    } finally {
      window.turnstile.reset(widgetId);
      submit.disabled = false;
      submit.innerHTML = originalLabel;
    }
  });

  try {
    const response = await fetch(`${FORM_API}/forms/config`);
    if (!response.ok) throw new Error('config_unavailable');
    const config = await response.json();
    if (!config.enabled || !config.siteKey) return fallback();
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      try {
        widgetId = window.turnstile.render(widget, { sitekey: config.siteKey, action: type, theme: 'dark' });
        submit.disabled = false;
      } catch { fallback(); }
    };
    script.onerror = fallback;
    document.head.append(script);
  } catch {
    fallback();
  }
});
