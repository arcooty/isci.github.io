(function (root) {
  const topics = [
    ['baslangic', 'İlk adımlar', 'compass'],
    ['arazi', 'Arazi ve evler', 'house'],
    ['meslekler', 'Meslekler', 'hammer'],
    ['gorevler', 'Görevler ve beceriler', 'star'],
    ['ekonomi', 'Ekonomi ve ticaret', 'store'],
    ['kasalar', 'Kitler ve kasalar', 'box-open'],
    ['komutlar', 'Komutlar', 'terminal']
  ];
  const topicSections = {
    meslekler: [['jobs-meslekler','Meslekler'],['jobs-sistem','İlerleme'],['jobs-komutlar','Meslek komutları']],
    kasalar: [['crate-havuzlar','Kasalar'],['crate-odds','Ödüller ve oranlar'],['crate-kullanim','Anahtar ve kullanım']],
    komutlar: [['commands-travel','Ulaşım ve ev'],['commands-progress','İlerleme'],['commands-vip','VIP komutları']]
  };
  const legacy = {
    'wiki.html': 'survival.html#baslangic',
    'features.html': 'survival.html#baslangic',
    'survival-systems.html': 'survival.html#baslangic',
    'claims.html': 'survival.html#arazi',
    'jobs.html': 'survival-jobs.html#jobs-meslekler',
    'quests.html': 'survival.html#gorevler',
    'economy.html': 'survival.html#ekonomi',
    'commands.html': 'survival.html#komutlar',
    'crates.html': 'survival.html#kasalar',
    'map.html': 'survival.html#harita',
    'leaderboard.html': 'survival.html#siralamalar',
    'ranks.html': 'store.html#paketler',
    'about.html': 'community.html#hakkimizda'
  };
  const gameGuides = {
    skyblock: [
      ['skyblock-start.html','Başlangıç','compass'],['skyblock-island.html','Ada ve takım','house'],
      ['skyblock-progress.html','Görevler ve koleksiyonlar','star'],['skyblock-orders.html','Siparişler ve projeler','clipboard-list'],
      ['skyblock-minion.html','Tarım minyonu','seedling'],['skyblock-trade.html','Ekonomi ve ticaret','store'],
      ['skyblock-community.html','Topluluk','users'],['skyblock-vip.html','VIP hakları','gem'],['skyblock-access.html','Test erişimi','flask']
    ],
    village: [['village-play.html','Oynanış','moon'],['village-roles.html','Roller','users'],['village-win.html','Kazanma','trophy'],['village-lobby.html','Lobi ve komutlar','compass'],['village-faq.html','Sorular','circle-question']]
  };
  const gameRoutes = {
    'survival.html': {meslekler:'survival-jobs.html#jobs-meslekler', 'jobs-meslekler':'survival-jobs.html#jobs-meslekler', 'jobs-sistem':'survival-jobs-progress.html#jobs-sistem', 'jobs-komutlar':'survival-jobs-commands.html#jobs-komutlar'},
    'news.html': {hakkimizda:'community.html#hakkimizda'},
    'skyblock.html': {baslangic:'skyblock-start.html#start',ada:'skyblock-island.html#island',gelisim:'skyblock-progress.html#progress',ticaret:'skyblock-trade.html#trade',topluluk:'skyblock-community.html#community',vip:'skyblock-vip.html#vip',test:'skyblock-access.html#access'},
    'village.html': {'nasil-oynanir':'village-play.html#nasil-oynanir',roller:'village-roles.html#roller',kazanma:'village-win.html#kazanma',lobi:'village-lobby.html#lobi',sorular:'village-faq.html#sorular'},
    'village-play.html': {kazanma:'village-win.html#kazanma'},
    'village-lobby.html': {sorular:'village-faq.html#sorular'},
    'store.html': {karsilastirma:'store-compare.html#karsilastirma',kitler:'store-kits.html#kitler',teslimat:'store-delivery.html#teslimat'}
  };
  for (const id of ['roles-title','tab-koy','tab-kurt','tab-bagimsiz','team-village-title','team-wolf-title','team-solo-title']) gameRoutes['village.html'][id] = 'village-roles.html#'+id;
  gameRoutes['village.html']['countdown-title'] = 'village-lobby.html#countdown-title';
  const sections = [
    {name:'Oyunlar', href:'servers.html', pages:[['servers.html','Oyunlarımız'],['survival.html','Survival'],['skyblock.html','Skyblock'],['village.html',"Rob's Village"]]},
    {name:'Skyblock', href:'skyblock.html', pages:gameGuides.skyblock.map(([href,label])=>[href,label])},
    {name:"Rob's Village", href:'village.html', pages:gameGuides.village.map(([href,label])=>[href,label])},
    {name:'Survival', href:'survival.html', pages:[['survival.html#baslangic','Oyun rehberi'],['survival.html#harita','Dünya haritası'],['survival.html#siralamalar','Sıralamalar'],['players.html','Oyuncu profilleri']]},
    {name:'Topluluk', href:'community.html', pages:[['community.html','Topluluk'],['news.html','Haberler'],['staff.html','Ekibimiz']]},
    {name:'VIP mağazası', href:'store.html', pages:[['store.html','Survival VIP paketleri'],['store-compare.html','Survival karşılaştırma'],['store-kits.html','Survival kitleri ve kasaları'],['store-skyblock.html','Skyblock VIP paketleri'],['store-skyblock-compare.html','Skyblock karşılaştırma'],['store-skyblock-kits.html','Skyblock kit durumu'],['store-delivery.html','Teslimat']]},
    {name:'Yardım', href:'help.html', pages:[['help.html','Destek merkezi'],['join.html','Oyuna katıl'],['rules.html','Kurallar'],['status.html','Sunucu durumu'],['punishments.html','Ceza sorgulama'],['appeal.html','Ceza itirazı'],['application.html','Yetkili başvurusu']]},
    {name:'Yasal', href:'help.html', pages:[['privacy.html','Gizlilik'],['terms.html','Kullanım ve satış şartları']]}
  ];
  function resolveHref(href) {
    if (!href || href.startsWith('#') || /^(?:[a-z]+:|\/\/)/i.test(href)) return href;
    const url = new URL(href, 'https://robsarcade.online/');
    const page = url.pathname.split('/').pop();
    const hash = url.hash.slice(1);
    const gameTarget = gameRoutes[page]?.[hash] || (page === 'village.html' && hash.startsWith('rol-') ? 'village-roles.html#'+hash : null);
    if (gameTarget) {
      const target = new URL(gameTarget,url.origin); target.search = url.search;
      return target.pathname.slice(1) + target.search + target.hash;
    }
    if (!legacy[page]) return href;
    const target = new URL(legacy[page], url.origin);
    target.search = url.search;
    if (page === 'survival-systems.html') {
      const anchors = {ekonomi:'ekonomi',ilerleme:'meslekler',koruma:'arazi',icerik:'kasalar',kalite:'baslangic'};
      target.hash = anchors[url.hash.slice(1)] || 'baslangic';
    }
    return target.pathname.slice(1) + target.search + target.hash;
  }
  const searchEntries = [
    ['skyblock.html','Skyblock','Oyunlar','cubes','skyblock ada adalar test beyaz liste'],
    ['skyblock.html#ada','Ada yönetimi','Skyblock','house','skyblock banka takım davet ziyaret ada yarıçap kapasite'],
    ['skyblock.html#gelisim','Ada gelişimi','Skyblock','seedling','skyblock görev koleksiyon sipariş minyon proje ticaret puanı'],
    ['skyblock.html#ticaret','Skyblock ticareti','Skyblock','store','skyblock market pazar takas 5000 satislimiti skytakas'],
    ['skyblock.html#vip','Skyblock VIP hakları','Skyblock','gem','skyblock vip mvip uvip ilan kozmetik iş istasyonu'],
    ['skyblock.html#test','Skyblock test erişimi','Skyblock','flask','skyblock whitelist beyaz liste kapalı açılış test'],
    ['survival.html#baslangic','İlk adımlar','Survival','compass','başlangıç ilk giriş oyun menü rtp'],
    ['survival.html#arazi','Arazi ve evler','Survival','house','claim koruma altın kürek sethome home evler evlerim delhome trust ev kaydet nether end'],
    ['survival.html#meslekler','Meslekler','Survival','hammer','jobs madenci oduncu çiftçi avcı balıkçı inşaatçı zanaatkar efsuncu silahşör kazıcı iksirci kaşif para kazanmak'],
    ['survival.html#jobs-komutlar','Meslek komutları','Survival','terminal','jobs browse join leave stats quests meslek komut'],
    ['survival.html#gorevler','Görevler ve beceriler','Survival','star','quest günlük görev yetenek skills auraskills seviye'],
    ['survival.html#ekonomi','Ekonomi ve ticaret','Survival','store','market pazar açık artırma auction takas trade gt para bakiye balance nah ilan satislimiti satış limiti sell sellgui 25000 dükkân'],
    ['survival.html#crate-odds','Kasa ödülleri ve oranları','Survival','box-open','kasalar olasılık anahtar vip mvip uvip şans ödül'],
    ['survival.html#komutlar','Oyun komutları','Survival','terminal','komut komutlar bütün liste'],
    ['survival.html#commands-travel','Ulaşım ve ev komutları','Survival','house','spawn rtp sethome home tpa ışınlanma ev konum'],
    ['survival.html#commands-progress','İlerleme komutları','Survival','star','balance discord jobs browse skills quests kasalar bakiye meslek beceri görev hesap bağlantı'],
    ['survival.html#commands-vip','VIP komutları','Survival','gem','vip vipkitler vipkolaylik vipekstra rütbe kolaylık'],
    ['store.html#paketler','VIP paketleri','VIP mağazası','gem','rütbe rank vip mvip uvip satın al fiyat ender sandığı rgb sohbet takma ad'],
    ['store.html#karsilastirma','VIP haklarını karşılaştır','VIP mağazası','table-columns','vip mvip uvip rütbe fark kapasite ev depo ilan satış limit'],
    ['store.html#kitler','Haftalık VIP kitleri','VIP mağazası','gift','vip mvip uvip kit anahtar kasa haftalık'],
    ['store.html#teslimat','Teslimat ve sipariş desteği','VIP mağazası','bag-shopping','sipariş ödeme satın alma teslimat destek stripe'],
    ['join.html','Oyuna katıl','Oyunlar','gamepad','bağlan java bedrock mobil iphone android adres ip port kayıt giriş login register'],
    ['join.html#join-java','Java bağlantısı','Oyunlar','desktop','java edition bilgisayar pc adres ip katıl sunucu'],
    ['join.html#join-bedrock','Bedrock ve mobil bağlantısı','Oyunlar','mobile-screen','bedrock mobil iphone android telefon windows port katıl sunucu'],
    ['servers.html','Oyunlarımız','Oyunlar','dice','oyun lobi sunucu survival village kurt köylü'],
    ['village.html','Rob’s Village','Oyunlar','moon','kurt köylü etkinlik rol oylama maç gece gündüz wolvesville'],
    ['village.html#rol-koy','Rob’s Village köy rolleri','Rob’s Village','house','doktor cadı bulaşıkçı gözcü çırağı kumarbaz aura gözcüsü medyum gardiyan silahşör cinci hoca köylü yetenek'],
    ['village.html#rol-kurt','Rob’s Village kurt rolleri','Rob’s Village','paw','düz kurt gölge kör şaman avlanma yetenek'],
    ['village.html#rol-bagimsiz','Rob’s Village bağımsız rolleri','Rob’s Village','fire','kundakçı soytarı solo benzin ateş idam yetenek'],
    ['village.html#lobi','Rob’s Village lobisi','Rob’s Village','compass','geri sayım harita oylaması kuyruk seyirci pusula rv'],
    ['survival.html#harita','Survival haritası','Survival','map','bluemap dynmap dünya yerleşim'],
    ['survival.html#siralamalar','Liderlik tabloları','Survival','trophy','sıralama leaderboard ekonomi jobs beceriler meslek en iyi oyuncu'],
    ['players.html','Oyuncu profilleri','Survival','user','oyuncu ara skin rütbe oynama süresi profil istatistik'],
    ['community.html','Topluluk','Topluluk','users','discord oyuncu sohbet etkinlik hakkımızda'],
    ['news.html','Haberler','Topluluk','newspaper','haber duyuru güncelleme'],
    ['staff.html','Ekibimiz','Topluluk','users','personel yetkili admin moderatör helper ekip'],
    ['help.html','Destek merkezi','Yardım','life-ring','yardım destek hesap şifre sorun talep ticket'],
    ['status.html','Sunucu durumu','Yardım','signal','sunucu çevrimiçi kapalı bakım bağlantı durum'],
    ['rules.html','Sunucu kuralları','Yardım','shield-halved','kural hile sohbet ceza hesap güvenlik'],
    ['punishments.html','Ceza sorgulama','Yardım','magnifying-glass','ban mute ceza sorgu oyuncu kayıt yasak'],
    ['appeal.html','Ceza itirazı','Yardım','scale-balanced','ban yasak itiraz başvuru kanıt'],
    ['application.html','Yetkili başvurusu','Yardım','handshake','ekip helper moderatör başvuru yaş deneyim'],
    ['privacy.html','Gizlilik','Yasal','lock','kişisel veri gizlilik çerez'],
    ['terms.html','Kullanım ve satış şartları','Yasal','file-lines','şart sözleşme satış iade ödeme'],
    ['skyblock-orders.html','Siparişler ve projeler','Skyblock','clipboard-list','skyblock siparis sipariş günlük haftalık proje meydan sera iskele ticaret puanı rozet'],
    ['skyblock-minion.html','Tarım minyonu','Skyblock','seedling','skyblock tarimminyon minyon tohum hasat varil üretim'],
    ['skyblock-community.html','Ada vitrini ve ziyaretler','Skyblock','users','skyblock skyshowcase vitrin oy aday ziyaret topluluk']
  ].map(([href,label,section,icon,keywords])=>({href:resolveHref(href),label,section,icon,keywords}));
  const normalize = value => String(value).toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,' ').trim();
  function search(query,limit = 10) {
    const text = normalize(query).slice(0,100);
    if (!text) return searchEntries.filter(entry=>['survival.html#baslangic','survival.html#arazi','survival.html#meslekler','store.html#paketler','join.html','help.html'].includes(entry.href)).slice(0,limit);
    const tokens = text.split(/\s+/);
    return searchEntries.map((entry,index)=>{
      const label = normalize(entry.label);
      const words = normalize(entry.label+' '+entry.section+' '+entry.keywords).split(' ');
      if (!tokens.every(token=>words.some(word=>word.startsWith(token)))) return null;
      const primary = ['survival.html#arazi','survival.html#meslekler','survival.html#komutlar','survival.html#ekonomi','store.html#paketler','join.html','help.html'].includes(entry.href) ? 5 : 0;
      const score = (label === text ? 100 : label.startsWith(text) ? 40 : 0) + primary + tokens.reduce((sum,token)=>sum+(label.split(' ').some(word=>word.startsWith(token)) ? 10 : 1),0);
      return {entry,score,index};
    }).filter(Boolean).sort((a,b)=>b.score-a.score || a.index-b.index).slice(0,limit).map(({entry})=>entry);
  }
  const model = Object.freeze({topics, topicSections, legacy, gameGuides, gameRoutes, sections, resolveHref, searchEntries, search});
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  else root.ARCADE_SITE = model;
})(typeof window === 'undefined' ? {} : window);
