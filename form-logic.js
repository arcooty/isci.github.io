/* form-logic.js - ArcaDe Craft Form Sistemi */

// --- AYARLAR ---
const CONFIG = {
    // Webhookları ayırdık. Kendi URL'lerini buraya yapıştır.
    webhooks: {
        application: "https://discord.com/api/webhooks/1449256024874684590/eBYxK5kwZES7_dRnmY1_HfA3BQkQ96SZxTaoFJFcdGPqeQc6Qc_GPuQfrZU8CswLjxPm", // Yetkili Başvurusu için
        appeal: "https://discord.com/api/webhooks/1449241850421579874/JinFAbsIOyOFYThR_qJ9IWIfadklPqKhvZjwYtX7tS324pKLJ5tQ0wt1ohEQ0ivhGA1z"           // Ceza İtirazı için
    },
    rateLimitMinutes: 30, // Kaç dakikada bir form gönderilebilir?
    themeColor: {
        application: 9851898, // Mor (Başvuru için)
        appeal: 15158332      // Kırmızı (İtiraz için)
    }
};

// Sayfa Yüklendiğinde Captcha Üret
document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
});

// Rastgele Kod Üretici
function generateCaptcha() {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Okunması zor harfler çıkarıldı (I, 1, 0, O)
    let captchaLength = 5;
    let captchaCode = "";
    for (let i = 0; i < captchaLength; i++) {
        captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const captchaElement = document.getElementById('captcha-display');
    if(captchaElement) {
        captchaElement.innerText = captchaCode;
        // Rastgele görsel bozulma efekti (basit güvenlik)
        captchaElement.style.letterSpacing = (2 + Math.random() * 5) + 'px';
        captchaElement.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
    }
}

// Form Gönderim İşlemi
async function handleFormSubmit(event, type) {
    event.preventDefault(); // Sayfa yenilenmesini engelle

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // 1. Rate Limit (Zaman Sınırı) Kontrolü
    const lastSubmit = localStorage.getItem('lastFormSubmit_' + type);
    const now = new Date().getTime();
    
    if (lastSubmit && (now - lastSubmit) < (CONFIG.rateLimitMinutes * 60 * 1000)) {
        const remaining = Math.ceil(( (CONFIG.rateLimitMinutes * 60 * 1000) - (now - lastSubmit) ) / 60000);
        showNotification(`Çok hızlı işlem yapıyorsunuz! Lütfen ${remaining} dakika bekleyin.`, 'error');
        return;
    }

    // 2. Captcha Kontrolü
    const userCaptcha = document.getElementById('captcha-input').value.toUpperCase();
    const generatedCaptcha = document.getElementById('captcha-display').innerText;

    if (userCaptcha !== generatedCaptcha) {
        showNotification("Güvenlik kodu hatalı! Lütfen tekrar deneyin.", 'error');
        generateCaptcha(); // Kodu yenile
        document.getElementById('captcha-input').value = '';
        return;
    }

    // 3. Verileri Hazırla
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...';

    const formData = new FormData(event.target);
    const formObject = Object.fromEntries(formData.entries());

    // Discord Embed Yapısı
    const embed = {
        title: type === 'application' ? "📝 Yeni Yetkili Başvurusu" : "⚖️ Yeni Ceza İtirazı",
        color: type === 'application' ? CONFIG.themeColor.application : CONFIG.themeColor.appeal,
        fields: [],
        footer: {
            text: "ArcaDe Craft Web Sistemi • " + new Date().toLocaleString('tr-TR'),
            icon_url: "https://cdn-icons-png.flaticon.com/512/831/831308.png"
        }
    };

    // Form alanlarını embed'e ekle
    for (const [key, value] of Object.entries(formObject)) {
        if (key !== 'captcha-input') { // Captcha alanını gönderme
            // Key ismini güzelleştir (örn: oyun_ici_isim -> Oyun İçi İsim)
            let fieldName = key.replace(/_/g, ' ').toUpperCase();
            
            embed.fields.push({
                name: `**${fieldName}**`,
                value: value ? `\`${value}\`` : "Belirtilmedi",
                inline: false
            });
        }
    }

    // 4. Discord'a Gönder (Dinamik URL Seçimi)
    const targetWebhook = type === 'application' ? CONFIG.webhooks.application : CONFIG.webhooks.appeal;

    try {
        const response = await fetch(targetWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (response.ok || response.status === 204) {
            localStorage.setItem('lastFormSubmit_' + type, now); // Zamanı kaydet
            event.target.reset();
            generateCaptcha();
            
            // Başarılı Modalı Göster
            const modal = document.getElementById('successModal');
            if(modal) modal.classList.remove('hidden');
        } else {
            throw new Error('Discord API Hatası: ' + response.status);
        }
    } catch (error) {
        console.error(error);
        showNotification("Bir hata oluştu. Lütfen yetkililere bildirin.", 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Bildirim Kutusu (Toast)
function showNotification(message, type) {
    const existing = document.getElementById('custom-toast');
    if(existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = `fixed top-5 right-5 z-50 px-6 py-4 rounded-lg text-white font-bold shadow-2xl flex items-center gap-3 transform transition-all duration-300 translate-y-[-20px] opacity-0 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-triangle-exclamation' : 'fa-check-circle'}"></i> ${message}`;
    
    document.body.appendChild(toast);

    // Animasyon
    setTimeout(() => {
        toast.classList.remove('translate-y-[-20px]', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}