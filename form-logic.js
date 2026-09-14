/* Form submissions require a server-side endpoint. Never place Discord webhook tokens in browser code. */
const FORM_API = Object.freeze({
  application: '/api/v1/forms/application',
  appeal: '/api/v1/forms/appeal',
  enabled: false
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(form => {
    const banner = document.createElement('div');
    banner.className = 'mb-6 p-4 border border-[#5865F2]/40 bg-[#5865F2]/10 rounded text-sm text-gray-200';
    banner.innerHTML = '<strong>Başvurular Discord üzerinden alınıyor.</strong><br>Web formu, güvenli sunucu API’si tamamlanana kadar veri göndermez.';
    form.prepend(banner);
    const submit = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submit) {
      submit.type = 'button';
      submit.textContent = 'Discord’da Devam Et';
      submit.addEventListener('click', () => window.open('https://discord.gg/GerdDHzMWp', '_blank', 'noopener'));
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      form.querySelector('[data-form-status]')?.remove();
      const notice = document.createElement('div');
      notice.dataset.formStatus = 'true';
      notice.className = 'mt-5 p-4 border border-[#5865F2]/40 bg-[#5865F2]/10 rounded text-sm text-gray-200';
      notice.innerHTML = 'Web formu güvenli API devreye alınana kadar kapalıdır. Başvurunu veya itirazını <a class="text-[#8ea1ff] font-bold underline" href="https://discord.gg/GerdDHzMWp" target="_blank" rel="noopener">ArcadeCraft Discord</a> üzerinden ilet.';
      form.appendChild(notice);
    });
  });
});
