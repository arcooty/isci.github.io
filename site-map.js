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
  const legacy = {
    'wiki.html': 'survival.html#baslangic',
    'features.html': 'survival.html#baslangic',
    'survival-systems.html': 'survival.html#baslangic',
    'claims.html': 'survival.html#arazi',
    'jobs.html': 'survival.html#meslekler',
    'quests.html': 'survival.html#gorevler',
    'economy.html': 'survival.html#ekonomi',
    'commands.html': 'survival.html#komutlar',
    'crates.html': 'survival.html#kasalar',
    'map.html': 'survival.html#harita',
    'leaderboard.html': 'survival.html#siralamalar',
    'ranks.html': 'store.html#paketler',
    'about.html': 'news.html#hakkimizda'
  };
  const sections = [
    {name:'Oyunlar', href:'servers.html', pages:[['servers.html','Oyunlarımız'],['survival.html','Survival'],['village.html',"Rob's Village"]]},
    {name:'Survival', href:'survival.html', pages:[['survival.html#baslangic','Oyun rehberi'],['survival.html#harita','Dünya haritası'],['survival.html#siralamalar','Sıralamalar'],['players.html','Oyuncu profilleri']]},
    {name:'Topluluk', href:'news.html', pages:[['news.html','Topluluk ve haberler'],['news.html#hakkimizda','Hakkımızda'],['staff.html','Ekibimiz']]},
    {name:'VIP mağazası', href:'store.html', pages:[['store.html','VIP paketleri'],['store.html#karsilastirma','Hakları karşılaştır'],['store.html#kitler','Haftalık kitler']]},
    {name:'Yardım', href:'help.html', pages:[['help.html','Destek merkezi'],['join.html','Oyuna katıl'],['rules.html','Kurallar'],['status.html','Sunucu durumu'],['punishments.html','Ceza sorgulama'],['appeal.html','Ceza itirazı'],['application.html','Yetkili başvurusu']]},
    {name:'Yasal', href:'help.html', pages:[['privacy.html','Gizlilik'],['terms.html','Kullanım ve satış şartları']]}
  ];
  function resolveHref(href) {
    if (!href || href.startsWith('#') || /^(?:[a-z]+:|\/\/)/i.test(href)) return href;
    const url = new URL(href, 'https://robsarcade.online/');
    const page = url.pathname.split('/').pop();
    if (!legacy[page]) return href;
    const target = new URL(legacy[page], url.origin);
    target.search = url.search;
    if (page === 'survival-systems.html') {
      const anchors = {ekonomi:'ekonomi',ilerleme:'meslekler',koruma:'arazi',icerik:'kasalar',kalite:'baslangic'};
      target.hash = anchors[url.hash.slice(1)] || 'baslangic';
    }
    return target.pathname.slice(1) + target.search + target.hash;
  }
  const model = Object.freeze({topics, legacy, sections, resolveHref});
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  else root.ARCADE_SITE = model;
})(typeof window === 'undefined' ? {} : window);
