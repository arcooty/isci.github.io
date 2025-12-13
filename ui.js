/* ui.js - ArcaDe Craft Görsel Efektler ve Menü Mantığı */

document.addEventListener('DOMContentLoaded', () => {
    initGlowEffect();
    initServerStatus(); // Canlı sunucu istatistiği
    
    // ScrollSpy sadece anasayfada (hero id'si varsa) çalışsın
    if (document.getElementById('hero')) {
        window.addEventListener('scroll', updateScrollSpy); 
        updateScrollSpy();
    }
});

// --- 0. CANLI SUNUCU İSTATİSTİĞİ (API) ---
function initServerStatus() {
    const playerCountElement = document.getElementById('floating-player-count');
    // Eğer element yoksa (örn: wiki sayfasındayız) fonksiyonu durdur
    if (!playerCountElement) return;

    // Sunucu IP'nizi buraya yazın
    const SERVER_IP = "oyna.robsarcade.online";

    fetch(`https://api.mcsrvstat.us/2/${SERVER_IP}`)
        .then(response => response.json())
        .then(data => {
            if(data.online) {
                // DÜZELTME: Sadece online sayısını değil, MAX sayıyı da güncelliyoruz.
                // Mevcut HTML yapısı: <span> <span id="...">10</span> / 5000 </span>
                // Bu yüzden parentElement (üst element) içeriğini değiştiriyoruz.
                
                const onlineCount = data.players.online.toLocaleString();
                const maxCount = data.players.max.toLocaleString();

                playerCountElement.parentElement.innerHTML = 
                    `<span id="floating-player-count">${onlineCount}</span> / ${maxCount}`;
                
                // PING DÜZELTMESİ: Ping sayısal değilse veya hatalıysa "Online" yazdırıyoruz
                // Eğer ping elementin varsa ID'sini buraya ekleyebilirsin
                /* const pingElement = document.getElementById('server-ping'); 
                if(pingElement) {
                    pingElement.innerText = "Online";
                    pingElement.classList.add('text-green-500'); // Yeşil renk
                }
                */

            } else {
                // Sunucu kapalıysa
                playerCountElement.parentElement.innerHTML = 
                    `<span id="floating-player-count">0</span> / -`;
            }
        })
        .catch(err => {
            console.error("API Hatası:", err);
            playerCountElement.parentElement.innerHTML = 
                    `<span id="floating-player-count">-</span> / -`;
        });
}


// --- 1. MOBİL MENÜ AÇMA/KAPAMA ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// --- 2. IP KOPYALAMA SİSTEMİ ---
function copyIP() {
    const ipElement = document.getElementById('server-ip');
    const tooltip = document.getElementById('copy-tooltip');
    
    if (!ipElement) return;

    const ipText = ipElement.innerText;

    navigator.clipboard.writeText(ipText).then(() => {
        if(tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translate(-50%, 0)';
            }, 2000);
        }
    }).catch(err => {
        console.error('Kopyalama başarısız:', err);
    });
}

// --- 3. MOUSE GLOW EFEKTİ ---
function initGlowEffect() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let isMouseMoving = false;
    let glowTimeout;

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        
        if (!isMouseMoving) {
            glow.style.opacity = '1';
            isMouseMoving = true;
        }
        
        clearTimeout(glowTimeout);
        glowTimeout = setTimeout(() => {
            glow.style.opacity = '0.4';
            isMouseMoving = false;
        }, 500);
    });
}

// --- 4. SCROLL SPY (Sadece Index için) ---
function updateScrollSpy() {
    const sections = document.querySelectorAll('section');
    const dots = document.querySelectorAll('.scroll-dot');
    const lines = document.querySelectorAll('.scroll-line');
    
    if(dots.length === 0) return;

    let current = '';
    const scrollPosition = window.scrollY + (window.innerHeight / 2);

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
            current = section.getAttribute('id');
        }
    });

    if (window.scrollY < 100) current = 'hero';

    let activeIndex = 0;
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-target') === current) {
            dot.classList.add('active');
            activeIndex = index;
        }
    });
    
    lines.forEach((line, index) => {
        if (index < activeIndex) line.classList.add('active');
        else line.classList.remove('active');
    });
}

// --- 5. WIKI MODAL SİSTEMİ ---
// Wiki içeriklerini burada tutuyoruz. HTML formatında yazabilirsin.
const wikiContent = {
    'commands': {
        title: '<i class="fa-solid fa-keyboard text-blue-500"></i> Temel Komutlar',
        body: `
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-white/10 text-mc-main">
                        <th class="py-2">Komut</th>
                        <th class="py-2">Açıklama</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    <tr class="border-b border-white/5"><td class="py-2 font-mono text-yellow-400">/spawn</td><td class="py-2">Başlangıç noktasına ışınlanırsınız.</td></tr>
                    <tr class="border-b border-white/5"><td class="py-2 font-mono text-yellow-400">/tpa [oyuncu]</td><td class="py-2">Bir oyuncuya ışınlanma isteği gönderirsiniz.</td></tr>
                    <tr class="border-b border-white/5"><td class="py-2 font-mono text-yellow-400">/sethome [isim]</td><td class="py-2">Bulunduğunuz yeri ev olarak kaydedersiniz.</td></tr>
                    <tr class="border-b border-white/5"><td class="py-2 font-mono text-yellow-400">/home [isim]</td><td class="py-2">Kaydettiğiniz eve ışınlanırsınız.</td></tr>
                    <tr class="border-b border-white/5"><td class="py-2 font-mono text-yellow-400">/warp</td><td class="py-2">Sunucudaki bölgeler menüsünü açar.</td></tr>
                    <tr class="border-b border-white/5"><td class="py-2 font-mono text-yellow-400">/rtp</td><td class="py-2">Rastgele bir yere ışınlanarak macera ararsınız.</td></tr>
                </tbody>
            </table>
        `
    },
    'claim': {
        title: '<i class="fa-solid fa-cubes-stacked text-green-500"></i> Claim Sistemi',
        body: `
            <p class="mb-4">Evinizi ve eşyalarınızı diğer oyunculardan korumak için <strong>Claim</strong> atmanız gerekmektedir.</p>
            <ul class="list-disc list-inside space-y-2 mb-4">
                <li>Başlangıçta size <strong>Altın Kürek</strong> verilir.</li>
                <li>Kürek ile bir köşeye sağ tıklayın, sonra çapraz köşeye gidip tekrar sağ tıklayın.</li>
                <li>Oluşan alan sizin korumalı bölgenizdir.</li>
            </ul>
            <div class="bg-white/5 p-3 rounded border-l-4 border-green-500">
                <strong>İpucu:</strong> Arkadaşınızı claiminize eklemek için <code class="text-yellow-400">/trust [oyuncu]</code> komutunu kullanın.
            </div>
        `
    },
    'economy': {
        title: '<i class="fa-solid fa-coins text-yellow-500"></i> Ekonomi & Para',
        body: `
            <p class="mb-4">Sunucuda para kazanmanın birçok yolu vardır:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-black/40 p-3 rounded">
                    <h4 class="font-bold text-yellow-400 mb-1">Meslekler</h4>
                    <p class="text-xs">/jobs browse yazarak Oduncu, Madenci gibi mesleklere girip çalışarak para kazanabilirsiniz.</p>
                </div>
                <div class="bg-black/40 p-3 rounded">
                    <h4 class="font-bold text-yellow-400 mb-1">Pazar Yeri</h4>
                    <p class="text-xs">/ah yazarak eşyalarınızı diğer oyunculara satabilir veya onlardan eşya alabilirsiniz.</p>
                </div>
            </div>
        `
    },
    'dungeons': {
        title: '<i class="fa-solid fa-dungeon text-red-500"></i> Zindanlar',
        body: `
            <p>Zindanlar, /warp zindan komutuyla gidilebilen tehlikeli bölgelerdir. Burada özel canavarlar ve Boss'lar bulunur.</p>
            <br>
            <h4 class="text-red-400 font-bold">Boss Çıkma Süreleri:</h4>
            <ul class="list-disc list-inside mt-2">
                <li><strong>İskelet Kral:</strong> Her 2 saatte bir</li>
                <li><strong>Ejderha Muhafızı:</strong> Her 6 saatte bir</li>
            </ul>
        `
    },
    'ranks': {
        title: '<i class="fa-solid fa-gem text-purple-500"></i> Rütbeler',
        body: `
            <p>Oyun içinde görevleri tamamlayarak veya oyun parasıyla rütbe atlayabilirsiniz.</p>
            <p class="mt-2 text-sm text-gray-400">Rütbe atlamak için: <code class="text-white">/rankup</code></p>
            <br>
            <table class="w-full text-sm">
                <tr class="text-mc-main font-bold"><td class="pb-2">Rütbe</td><td class="pb-2">Gereksinim</td></tr>
                <tr><td>Acemi</td><td>Başlangıç</td></tr>
                <tr><td>Oyuncu</td><td>10.000 Para</td></tr>
                <tr><td>Usta</td><td>50.000 Para + 24 Saat Oyun Süresi</td></tr>
                <tr><td>Efsane</td><td>250.000 Para + 1000 Mob Öldürme</td></tr>
            </table>
        `
    },
    'faq': {
        title: '<i class="fa-solid fa-triangle-exclamation text-orange-500"></i> SSS',
        body: `
            <div class="space-y-4">
                <div>
                    <h5 class="font-bold text-white">Lag sorunu yaşıyorum?</h5>
                    <p class="text-sm">Ayarlar > Video Ayarları kısmından grafiklerinizi düşürmeyi deneyin veya Optifine kullanın.</p>
                </div>
                <div>
                    <h5 class="font-bold text-white">VIP aldım ne zaman gelir?</h5>
                    <p class="text-sm">Ödeme yaptıktan sonra genellikle 1-5 dakika içinde hesabınıza tanımlanır. Gelmezse Discord üzerinden ticket açın.</p>
                </div>
            </div>
        `
    }
};

function openWikiModal(key) {
    const modal = document.getElementById('wiki-modal');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const contentBox = document.getElementById('wiki-modal-content');

    if (wikiContent[key]) {
        titleEl.innerHTML = wikiContent[key].title;
        bodyEl.innerHTML = wikiContent[key].body;
        
        // Modalı göster
        modal.classList.remove('hidden');
        // Animasyon için frame bekle
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            contentBox.classList.remove('scale-95');
            contentBox.classList.add('scale-100');
        });
    }
}

function closeWikiModal() {
    const modal = document.getElementById('wiki-modal');
    const contentBox = document.getElementById('wiki-modal-content');

    // Animasyonla kapat
    modal.classList.add('opacity-0');
    contentBox.classList.remove('scale-100');
    contentBox.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Transition süresi kadar bekle
}

// Modal dışına tıklayınca kapatma
document.getElementById('wiki-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'wiki-modal') {
        closeWikiModal();
    }
});