# ArcadeCraft Web Entegrasyon Plani

## Su an bagli

- Minecraft ag ve servis durumu: genel durum API'si uzerinden salt okunur.
- Discord daveti: ana topluluk sunucusu `1448892369146609867`.
- Survival bilgi mimarisi: sistemler, meslekler, gorevler, claim, ekonomi, komutlar, rutbeler ve liderlik.
- Web basvuru ve itiraz formlari Turnstile dogrulamali API uzerinden ilgili Discord kanallarina iletilir; servis kullanilamazsa Discord'a yonlendirir.
- Herkese acik ceza sorgulama, oyuncu profilleri, yetkili listesi ve liderlik tablolari canli API'ye baglidir.
- VIP magaza katalogu yayindadir; urunler fiyatlandirma ve odeme etkinlestirilene kadar satin almaya kapalidir.

## Guvenle baglanabilecek veriler

- `GET /api/v1/status`: Velocity, lobi, Survival, etkinlik ve harita saglik durumu.
- `GET /api/v1/leaderboards`: izinli ekonomi, Jobs ve AuraSkills liderlikleri.
- `GET /api/v1/economy/summary`: gunluk para girisi/cikisi ve kaynak kategorileri; oyuncu bazli hassas islem gecmisi olmadan.
- `GET /api/v1/events`: etkinlik takvimi ve bakim duyurulari.
- `GET /api/v1/news`: Discord duyurularinin web kopyasi veya yonetim panelinden yayinlanan haberler.
- `GET /api/v1/punishments/public`: yalnizca kamuya acik ceza durumu; IP, cihaz ve personel notlari haric.
- Discord OAuth2: web hesabi ile Discord hesabi baglama. Minecraft UUID eslemesi sunucu tarafinda dogrulanmali.
- Magaza webhooks: odeme saglayicisindan imzali istek, kuyruk tabanli teslimat ve tekrar-isleme korumasi.

## Mimari sinirlar

- GitHub Pages veritabanina veya MariaDB'ye dogrudan baglanmaz.
- Discord webhook tokenleri, bot tokenleri ve veritabani parolalari HTML/JavaScript icine yazilmaz.
- MariaDB `3306` internete acilmaz; API mini PC'de localhost/LAN uzerinden salt okunur servis hesabi kullanir.
- Genel API, Cloudflare Tunnel veya ters proxy arkasinda yalniz HTTPS ile yayinlanir.
- API ciktilari UUID/oyuncu adi disinda IP, e-posta, Discord tokeni, auth hash'i, webhook URL'si ve yonetim logu icermez.
- Yazma islemleri ayri kimlik dogrulama, CSRF korumasi, hiz limiti, audit log ve imzali webhook gerektirir.

## Web sozlesmesi

Statik site canli liderlik icin `/api/v1/leaderboards` adresini kullanir. API gecici olarak kullanilamazsa sahte oyuncu gostermek yerine erisim hatasi gosterir ve sonraki sayfa yuklemesinde yeniden dener.
