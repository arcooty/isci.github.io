document.addEventListener('DOMContentLoaded', () => {
  initGlowEffect();
  initServerStatus();
  if (document.getElementById('hero')) {
    window.addEventListener('scroll', updateScrollSpy, {passive:true});
    updateScrollSpy();
  }
});

function initServerStatus() {
  const counter = document.getElementById('floating-player-count');
  if (!counter) return;
  fetch('https://api.mcsrvstat.us/2/oyna.robsarcade.online')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      counter.parentElement.innerHTML = data.online
        ? `<span id="floating-player-count">${Number(data.players?.online || 0).toLocaleString('tr-TR')}</span> / ${Number(data.players?.max || 0).toLocaleString('tr-TR')}`
        : '<span id="floating-player-count">0</span> / -';
    })
    .catch(() => { counter.parentElement.innerHTML = '<span id="floating-player-count">-</span> / -'; });
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('hidden');
}

function copyIP() {
  const ip = document.getElementById('server-ip')?.textContent?.trim();
  const tooltip = document.getElementById('copy-tooltip');
  if (!ip) return;
  navigator.clipboard.writeText(ip).then(() => {
    if (!tooltip) return;
    tooltip.style.opacity = '1';
    setTimeout(() => { tooltip.style.opacity = '0'; }, 1800);
  });
}

function initGlowEffect() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || matchMedia('(pointer:coarse)').matches) return;
  document.addEventListener('mousemove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, {passive:true});
}

function updateScrollSpy() {
  const dots = [...document.querySelectorAll('.scroll-dot')];
  const sections = dots.map(dot => document.getElementById(dot.dataset.target)).filter(Boolean);
  let active = 0;
  sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= innerHeight * .45) active = index; });
  dots.forEach((dot, index) => dot.classList.toggle('active', index === active));
  document.querySelectorAll('.scroll-line').forEach((line, index) => line.classList.toggle('active', index < active));
}
