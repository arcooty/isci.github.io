const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const pages = Object.fromEntries(['village','village-play','village-roles','village-win','village-lobby','village-faq'].map(name => [name,fs.readFileSync(path.join(root,name+'.html'),'utf8')]));
const html = pages['village-roles'];
const play = pages['village-play'];
const win = pages['village-win'];
const lobby = pages['village-lobby'];
const faq = pages['village-faq'];
const source = fs.readFileSync(path.join(root,'village.js'),'utf8');

test('every individual role hash opens its role and selects its owning team', () => {
  for (const [index,role] of verifiedRoleDescriptions.entries()) {
    const page = harness('#'+role.id);
    const selected = index < 11 ? 0 : index < 15 ? 1 : 2;
    assert.deepEqual(page.panels.map(panel => panel.hidden),page.panels.map((_,i) => i !== selected),role.id);
    assert.equal(page.roleElements[index].open,true,role.id);
    assert.equal(page.roleElements[index].scrolled,1,role.id);
  }
});

test('legacy tab IDs select their associated team and align to the catalogue', () => {
  for (const [index,id] of ['tab-koy','tab-kurt','tab-bagimsiz'].entries()) {
    const page = harness('#'+id);
    assert.equal(page.panels[index].hidden,false);
    assert.equal(page.tabs[index].attrs['aria-selected'],'true');
    assert.equal(page.catalogue.scrolled,1);
  }
});

test('role panels retain the verified 11 village, 4 wolf and 2 independent roles', () => {
  for (const [id,count] of [['rol-koy',11],['rol-kurt',4],['rol-bagimsiz',2]]) {
    const start = html.indexOf('id="'+id+'"');
    const panel = html.slice(start,html.indexOf('</section>',start));
    assert.equal((panel.match(/class="village-role"/g) || []).length,count,id);
  }
});

test('all local Village links point to existing files and anchors', () => {
  for (const page of Object.values(pages)) {
    for (const [,href] of page.matchAll(/<a[^>]+href="([^"]+)"/g)) {
      if (href.startsWith('https:')) continue;
      const [file,hash] = href.split('#');
      const target = file ? fs.readFileSync(path.join(root,file),'utf8') : page;
      if (hash) assert.ok(target.includes('id="'+hash+'"'),href);
    }
  }
});

const verifiedRoleDescriptions = [
  {
    "id": "rol-koylu",
    "paragraphs": [
      "Özel bir yeteneğin yok; ama oyunun en önemli araçlarına sahipsin: gözlem, konuşma ve oy. Çelişkileri yakala, bilgi veren rolleri dinle ve köyün doğru kişiyi elemesine yardımcı ol.",
      "<strong>Unutma:</strong> Gece evinde kalırsın. Sessiz bir oyuncu olmak masum olduğun anlamına gelmez."
    ]
  },
  {
    "id": "rol-doktor",
    "paragraphs": [
      "Her gece bir oyuncuyu korumaya alırsın. Koruman kurt saldırısını engelleyebilir ve gecenin sonunda uygulanan zehir saldırısına karşı da işe yarar.",
      "<strong>Sınır:</strong> Koruma, her ölüm türüne karşı dokunulmazlık vermez. Kundakçının ateşi korumayı aşar."
    ]
  },
  {
    "id": "rol-cadi",
    "paragraphs": [
      "Bir koruma, bir öldürme iksirin vardır. Koruma iksiri seçtiğin oyuncuya yönelen kurt saldırısını engeller; öldürme iksiriyle bir hedefi zehirlersin.",
      "<strong>Sınır:</strong> İlk gece öldürme iksiri kullanılamaz. İksir haklarını dikkatli harca; koruma hedefi saldırıya uğramazsa koruma iksiri geri verilir."
    ]
  },
  {
    "id": "rol-bulasikci",
    "paragraphs": [
      "Gece bir oyuncuyu ziyaret edip onun evinde kalabilirsin. Kurtlar konakladığın eve saldırırsa ev sahibiyle birlikte hedef olursun; ilk kime vurulduğu sonucu değiştirmez. Doktor ve cadı koruması her oyuncu için ayrı değerlendirilir.",
      "<strong>Risk:</strong> Bir kurdun veya Kundakçının evini ziyaret etmek ölümcüldür. Ev sahibinin gece elenmesi seni de tehlikeye sokar; koruma olmadan elenebilirsin."
    ]
  },
  {
    "id": "rol-gozcu-ciragi",
    "paragraphs": [
      "Aura Gözcüsü, Kumarbaz veya Medyum ölünce onun rolünü ve topladığı bilgileri devralırsın. O zamana kadar Köylü gibi tartışmaya ve oylamaya katılırsın.",
      "<strong>Dikkat:</strong> Devraldığın rolün yetenek ve sınırları senin için de geçerlidir. Her ölen oyuncunun rolünü alamazsın."
    ]
  },
  {
    "id": "rol-kumarbaz",
    "paragraphs": [
      "Bir oyuncu seçip köy, kurt veya bağımsız takımından hangisinde olduğunu tahmin edersin. Sonucu sabah öğrenirsin; yanlış tahminde hedefin gerçek takımı da gösterilir.",
      "<strong>Sınır:</strong> Oyun boyunca yalnızca iki kez köy takımı tahmini yapabilirsin. Her gece tek bir seçim hakkın vardır."
    ]
  },
  {
    "id": "rol-aura-gozcusu",
    "paragraphs": [
      "Her gece bir oyuncuyu inceleyip doğrudan rolünü öğrenirsin. Elde ettiğin bilgi, köyün iddiaları doğrulamasına ve gizlenen tehlikeleri bulmasına yardımcı olur.",
      "<strong>Sınır:</strong> Gecede tek bir oyuncuyu araştırırsın. Bilgini ne zaman açıklayacağını seç; kendini açık hedef hâline getirme."
    ]
  },
  {
    "id": "rol-medyum",
    "paragraphs": [
      "Gece ölü oyuncularla konuşabilir, geride kalan bilgileri dinleyebilirsin. Oyun boyunca bir kez ölmüş bir köy oyuncusunu gecenin sonunda canlandırabilirsin.",
      "<strong>Sınır:</strong> Canlandırma tek kullanımlıktır ve yalnızca köy takımına uygulanır."
    ]
  },
  {
    "id": "rol-gardiyan",
    "paragraphs": [
      "Gündüz bir oyuncuyu hapse alırsın. Gece mahkûmla özel olarak konuşabilir veya infaz hakkını kullanabilirsin. Hapishane, mahkûmu kurt saldırısından korur.",
      "<strong>Sınır:</strong> Bir infaz hakkın vardır. Hapiste olmak bütün ölüm türlerine karşı dokunulmazlık sağlamaz."
    ]
  },
  {
    "id": "rol-silahsor",
    "paragraphs": [
      "İki merminle şüphelendiğin oyuncuları doğrudan eleyebilirsin. İlk atışından sonra rolün bütün köye açıklanır.",
      "<strong>Sınır:</strong> İlk gün ateş edemezsin ve aynı gün en fazla bir atış yapabilirsin. Yanlış hedef seçmek köyün gücünü azaltır."
    ]
  },
  {
    "id": "rol-cinci-hoca",
    "paragraphs": [
      "Zemzem suyunu bir oyuncu üzerinde kullanırsın. Hedef bir kurt veya Kundakçıysa o elenir; başka bir rol seçersen sen elenirsin.",
      "<strong>Risk:</strong> Tek hakkın vardır. Bu yetenek güvenli bir araştırma değil, sonucu ölümcül olabilen bir karardır."
    ]
  },
  {
    "id": "rol-duz-kurt",
    "paragraphs": [
      "Kurtların gece saldırısında hedef seçer ve avlanırsın. Diğer kurtlarla aynı hedefte buluşmak takımının planını güçlendirir.",
      "<strong>Dikkat:</strong> Doktor, Cadı veya hapishane koruması saldırıyı engelleyebilir. Her oyuncu kurtların serbest hedefi değildir."
    ]
  },
  {
    "id": "rol-golge-kurt",
    "paragraphs": [
      "Gece avına katılırsın. Gündüz gölge yeteneğini kullanarak o turun oylarını gizler ve kurt oylarını iki kat değerli hâle getirirsin.",
      "<strong>Sınır:</strong> Gölge yeteneği oyun boyunca yalnızca bir kez kullanılabilir. Zamanlaman oylamanın sonucunu değiştirebilir."
    ]
  },
  {
    "id": "rol-kor-kurt",
    "paragraphs": [
      "Her gece iki farklı oyuncuyu seçip rol kategorilerini öğrenirsin. Tam rol yerine koruma, bilgi veya katil gibi kategoriler üzerinden takımına yol gösterirsin.",
      "<strong>Dönüşüm:</strong> Hayatta kalan son kurt olduğunda Düz Kurt'a dönüşür ve avlanma görevini üstlenirsin."
    ]
  },
  {
    "id": "rol-saman-kurt",
    "paragraphs": [
      "Her gece bir oyuncunun tam rolünü öğrenirsin. Köyün güçlü rollerini bulup kurt takımının sonraki hamlesini planlamasına yardımcı olursun.",
      "<strong>Dönüşüm:</strong> Hayatta kalan son kurt olduğunda Düz Kurt'a dönüşürsün."
    ]
  },
  {
    "id": "rol-kundakci",
    "paragraphs": [
      "Gece ya bir oyuncuya benzin döker ya da daha önce benzin döktüğün oyuncuları yakarsın. Amacın diğer bütün oyuncuları eleyip tek başına hayatta kalmaktır.",
      "<strong>Özelliği:</strong> Yakma saldırısı gece korumalarını aşar. Benzin dökmek ve yakmak aynı hamle değildir; doğru geceyi bekle."
    ]
  },
  {
    "id": "rol-soytari",
    "paragraphs": [
      "Hedefin hayatta kalmak değil, köyün seni oylamayla idam etmesini sağlamaktır. İdam edilirsen oyun senin galibiyetinle sona erer; başka şekilde ölmek aynı sonucu vermez.",
      "<strong>Katılım:</strong> Soytarı mevcut otomatik maç dağılımında bulunmaz; özel rol dağılımı kullanılan maçların rolüdür."
    ]
  }
];

test('all verified role descriptions and limits survive the split unchanged', () => {
  const entries = [...html.matchAll(/<details class="village-role" id="([^"]+)"[\s\S]*?<\/details>/g)];
  const actual = entries.map(role => ({
    id:role[1],
    paragraphs:[...role[0].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(paragraph => paragraph[1])
  }));
  assert.deepEqual(actual,verifiedRoleDescriptions);
});

test('Village hub exposes five Skyblock-style topics, gameplay imagery and legacy routing hook', () => {
  const hub = pages.village;
  assert.match(hub,/<h1>Rob's Village<\/h1>/);
  assert.match(hub,/data-game-hub="village"/);
  assert.match(hub,/class="topic-grid"/);
  assert.equal((hub.match(/class="topic-card"/g) || []).length,5);
  assert.doesNotMatch(hub,/class="chunky-nav /);
  for (const page of ['village-play','village-roles','village-win','village-lobby','village-faq']) {
    assert.match(hub,new RegExp('href="'+page+'\\.html"'));
  }
  assert.match(hub,/robs-village-gameplay-wide\.webp" width="1920" height="620"/);
  assert.match(hub,/<img src="assets\/robs-village-gameplay\.webp"[^>]*width="1536" height="960"/);
  assert.doesNotMatch(hub,/class="village-role"|class="faq-list"/);
  assert.match(hub,/id="village-top"/);
});

test('Village topic pages share the Skyblock toolbar and footer navigation', () => {
  for (const [name,page] of Object.entries(pages)) {
    assert.match(page, /village-navigation\.css\?v=20261002-24/);
    if(name==='village') continue;
    assert.match(page, /class="game-guide-toolbar"/);
    assert.match(page, /<h1>Rob's Village<\/h1>/);
    assert.match(page, /class="game-guide-next"/);
    assert.match(page, /Bütün konular/);
    assert.doesNotMatch(page, /class="chunky-nav /);
    const menu=page.match(/<nav aria-label="Rehber konuları">[\s\S]*?<\/nav>/)[0];
    assert.equal((menu.match(/aria-current="page"/g)||[]).length,1);
  }
  const css = fs.readFileSync(path.join(root,'village-navigation.css'),'utf8');
  assert.match(css, /\.game-guide-toolbar>h1/);
  assert.match(css, /\.game-guide-content \.journey \{ border-bottom:0; margin-bottom:0; padding-bottom:0;/);
});

test('guides share standard shell, themes, category menus and literal headings', () => {
  assert.equal((pages['village-roles'].match(/class="village-role-column"/g)||[]).length,6);
  for (const [name,page] of Object.entries(pages)) {
    assert.match(page,/<body class="network-shell game-guide-page[^"]*" data-game="village"/);
    assert.match(page,/theme\.js\?v=20261002-22/);
    for (const css of ['network','craft','theme','village']) assert.match(page,new RegExp(css+'\\.css\\?v='));
    assert.match(page,/polish\.css\?v=20261002-24"[\s\S]*?game-guides\.css\?v=20261002-23"/);
    for (const script of ['site-map','site-shell','game-guide']) assert.match(page,new RegExp(script+'\\.js\\?v='));
    assert.match(page,/game-guide\.js\?v=20261002-3/);
    assert.match(page,new RegExp('rel="canonical" href="https://robsarcade.online/'+name+'\\.html"'));
    assert.equal((page.match(/<h1>/g) || []).length,1);
    assert.doesNotMatch(page,/class="eyebrow"/);
    if (name === 'village') continue;
    assert.match(page,/class="game-guide-toolbar"[\s\S]*?href="village\.html"/);
    if(['village-play','village-win','village-faq'].includes(name)) assert.doesNotMatch(page,/class="game-guide-heading"/);
    else assert.match(page,/class="game-guide-heading"/);
    assert.match(page,/class="game-guide-content"/);
    for (const guide of ['village-play','village-roles','village-win','village-lobby','village-faq']) assert.match(page,new RegExp('href="'+guide+'\\.html"'));
    assert.match(page,new RegExp('href="'+name+'\\.html" aria-current="page"'));
  }
});

test('win conditions retain village, wolf, arsonist and special jester rules', () => {
  assert.doesNotMatch(play,/class="game-guide-cover"/);
  assert.match(win,/Kurtlar ve bağımsız oyuncular elendiğinde köy takımı kazanır/);
  assert.match(win,/diğer bütün yaşayan oyuncuların toplamına eşit veya daha fazla/);
  assert.match(win,/Kundakçı herkes elendikten sonra tek başına kalırsa kazanır/);
  assert.match(win,/Soytarının yer aldığı özel maçlarda ise oylamayla idam edilmesi/);
});

test('lobby preserves countdown, map voting, reconnect, fair play and command semantics', () => {
  assert.match(lobby,/En az 6 oyuncu olduğunda geri sayım başlar/);
  assert.match(lobby,/6'nın altına düşerse başlangıç iptal edilir/);
  for (const [players,seconds] of [['6–7',60],['8–9',45],['10–11',30],['12+',20]]) {
    assert.ok(lobby.includes('<dt>'+players+' oyuncu</dt><dd>'+seconds+' saniye</dd>'));
  }
  assert.match(lobby,/10 saniyelik harita oylaması/);
  assert.match(lobby,/Oy verilmezse hazır haritalardan biri rastgele seçilir/);
  assert.match(lobby,/haritalar eşitse aralarından rastgele seçim/);
  assert.match(lobby,/oyuncu sayısına uygun ve kurulumu tamamlanmış haritalar/);
  assert.match(faq,/geri dönmek için 90 saniyelik süresi vardır/);
  assert.match(faq,/yeniden bağlanamazsan oyundan elenirsin; çıkış yapmak maçı durdurmaz/);
  assert.match(faq,/Devam eden maça oyuncu olarak eklenmezsin/);
  assert.match(lobby,/Discord veya özel mesajlarla rolleri ifşa etme/);
  assert.match(lobby,/Medyumun ölülerle konuşma yeteneği/);
  const commands = {menu:'Lobide oyun menüsünü açar.',maps:'Harita kataloğunu açar.',vote:'Aktif gündüz oyuncu oylamasını açar.',spectate:'Lobide oyuncu ve seyirci durumunu değiştirir.'};
  for (const [command,description] of Object.entries(commands)) {
    assert.ok(lobby.includes('<code>/rv '+command+'</code><span>'+description+'</span>'));
  }
});

test('role enhancement is harmless on pages without a complete catalogue', () => {
  for (const missing of ['tabs','nav','roller','rol-kurt']) {
    const page = harness('',false,missing);
    assert.deepEqual(page.panels.map(panel => panel.hidden),[false,false,false]);
    assert.equal(page.tabs[0].attrs.role,undefined);
  }
});

test('tab and panel relationships remain complete for assistive technology', () => {
  const page = harness();
  for (let index = 0; index < page.tabs.length; index++) {
    assert.equal(page.tabs[index].attrs.role,'tab');
    assert.equal(page.tabs[index].attrs['aria-controls'],page.panels[index].id);
    assert.equal(page.panels[index].attrs.role,'tabpanel');
    assert.equal(page.panels[index].attrs['aria-labelledby'],page.tabs[index].id);
  }
  page.key(0,'ArrowRight');
  assert.equal(page.tabs[1].focused,true);
  assert.equal(page.tabs[1].attrs['aria-selected'],'true');
  for (const modifier of ['ctrlKey','metaKey','shiftKey','altKey']) {
    assert.equal(page.click(2,{[modifier]:true}).prevented,undefined);
  }
});

test('font completion does not restore a role after the user changes the hash', () => {
  const page = harness('#rol-aura-gozcusu',true);
  page.location.hash='#rol-bagimsiz';
  page.finishFonts();
  assert.equal(page.aura.scrolled,1);
});

test('role catalogue contains all 17 implemented roles with no-JS content available', () => {
  const roles = ['koylu','doktor','cadi','bulasikci','gozcu-ciragi','kumarbaz','aura-gozcusu','medyum','gardiyan','silahsor','cinci-hoca','duz-kurt','golge-kurt','kor-kurt','saman-kurt','kundakci','soytari'];
  assert.equal((html.match(/class="village-role"/g) || []).length,roles.length);
  for (const role of roles) assert.match(html,new RegExp('<details class="village-role" id="rol-'+role+'"'));
  assert.doesNotMatch(html,/<section[^>]+class="village-role-panel[^>]+hidden/);
  for (const [page,ids] of [[play,['nasil-oynanir']],[win,['kazanma']],[html,['roller']],[lobby,['lobi','komutlar']],[faq,['sorular']]]) {
    for (const id of ids) {
      assert.match(page,new RegExp('id="'+id+'"'));
    }
  }
});

test('role caveats reflect implemented abilities instead of older generic descriptions', () => {
  assert.match(html,/Aura Gözcüsü[\s\S]*?doğrudan rolünü öğrenirsin/);
  assert.match(html,/Hedef bir kurt veya Kundakçıysa o elenir/);
  assert.match(html,/Soytarı mevcut otomatik maç dağılımında bulunmaz/);
  assert.match(win,/diğer bütün yaşayan oyuncuların toplamına eşit veya daha fazla/);
});

function harness(hash = '',pendingFonts = false,missing = null) {
  class Element {
    constructor(id,tagName = 'SECTION') { this.id=id; this.tagName=tagName; this.attrs={}; this.events={}; this.children=[]; this.hidden=false; this.open=false; this.scrolled=0; }
    setAttribute(key,value) { this.attrs[key]=value; }
    getAttribute(key) { return this.attrs[key] ?? null; }
    contains(element) { return this.children.includes(element); }
    addEventListener(type,fn) { this.events[type]=fn; }
    scrollIntoView() { this.scrolled++; }
    focus() { this.focused=true; }
  }
  const panels = ['rol-koy','rol-kurt','rol-bagimsiz'].map(id => new Element(id));
  const tabs = ['tab-koy','tab-kurt','tab-bagimsiz'].map((id,index) => {
    const tab = new Element(id,'A'); tab.attrs.href='#'+panels[index].id; return tab;
  });
  const roleElements = verifiedRoleDescriptions.map((role,index) => {
    const element = new Element(role.id,'DETAILS');
    panels[index < 11 ? 0 : index < 15 ? 1 : 2].children.push(element);
    return element;
  });
  const aura = roleElements.find(role => role.id === 'rol-aura-gozcusu');
  const arsonist = roleElements.find(role => role.id === 'rol-kundakci');
  const catalogue = new Element('roller');
  const faq = new Element('sorular');
  const nav = new Element('role-tabs','NAV');
  const ids = Object.fromEntries([...panels,...tabs,...roleElements,catalogue,faq].map(item => [item.id,item]));
  const location = {hash};
  const changes=[];
  const history = {
    pushState(_state,_title,value) { location.hash=value; changes.push(['push',value]); },
    replaceState(_state,_title,value) { location.hash=value; changes.push(['replace',value]); }
  };
  const listeners={};
  let finishFonts;
  const document = {
    querySelectorAll() { return missing === 'tabs' ? [] : tabs; },
    querySelector() { return missing === 'nav' ? null : nav; },
    getElementById(id) { return id === missing ? null : ids[id] || null; },
    fonts: {status:pendingFonts ? 'loading' : 'loaded',ready:{then(fn) { finishFonts=fn; }}}
  };
  vm.runInNewContext(source,{document,location,history,window:{addEventListener(type,fn) { listeners[type]=fn; }},requestAnimationFrame:fn=>fn()});
  const click = (index,overrides = {}) => {
    const event = {preventDefault() { this.prevented=true; },...overrides};
    tabs[index].events.click(event); return event;
  };
  const key = (index,name) => tabs[index].events.keydown({key:name,preventDefault() {}});
  return {tabs,panels,roleElements,aura,arsonist,catalogue,nav,location,changes,listeners,click,key,finishFonts:()=>finishFonts?.()};
}

test('role tabs start with the village team and expose proper selection semantics', () => {
  const page = harness();
  assert.equal(page.nav.attrs.role,'tablist');
  assert.deepEqual(page.panels.map(panel=>panel.hidden),[false,true,true]);
  assert.deepEqual(page.tabs.map(tab=>tab.tabIndex),[0,-1,-1]);
  assert.equal(page.tabs[0].attrs['aria-selected'],'true');
  assert.equal(page.panels[0].attrs['aria-labelledby'],'tab-koy');
});

test('direct team and individual role links reveal the correct content', () => {
  const wolves = harness('#rol-kurt');
  assert.deepEqual(wolves.panels.map(panel=>panel.hidden),[true,false,true]);
  assert.equal(wolves.catalogue.scrolled,1);
  const solo = harness('#rol-kundakci');
  assert.deepEqual(solo.panels.map(panel=>panel.hidden),[true,true,false]);
  assert.equal(solo.arsonist.open,true);
  assert.equal(solo.arsonist.scrolled,1);
  assert.doesNotThrow(()=>harness('#%invalid'));
});

test('clicks and browser history preserve the team without duplicating history', () => {
  const page = harness();
  page.click(1); page.click(1);
  assert.deepEqual(page.changes,[['push','#rol-kurt']]);
  assert.deepEqual(page.panels.map(panel=>panel.hidden),[true,false,true]);
  page.location.hash='#rol-bagimsiz'; page.listeners.popstate();
  assert.deepEqual(page.panels.map(panel=>panel.hidden),[true,true,false]);
  page.location.hash='#sorular'; page.listeners.hashchange();
  assert.deepEqual(page.panels.map(panel=>panel.hidden),[true,true,false]);
  page.location.hash=''; page.listeners.popstate();
  assert.deepEqual(page.panels.map(panel=>panel.hidden),[false,true,true]);
  page.click(1); page.location.hash='#roller'; page.listeners.popstate();
  assert.deepEqual(page.panels.map(panel=>panel.hidden),[false,true,true]);
  assert.equal(page.click(0,{ctrlKey:true}).prevented,undefined);
});

test('keyboard navigation wraps teams and maintains roving focus', () => {
  const page = harness();
  page.key(0,'ArrowLeft');
  assert.equal(page.location.hash,'#rol-bagimsiz');
  assert.equal(page.tabs[2].focused,true);
  page.key(2,'Home');
  assert.equal(page.tabs[0].attrs['aria-selected'],'true');
  page.key(0,'End');
  assert.deepEqual(page.tabs.map(tab=>tab.tabIndex),[-1,-1,0]);
});

test('font completion realigns a role link without overriding user interaction', () => {
  const page = harness('#rol-aura-gozcusu',true);
  page.finishFonts();
  assert.equal(page.aura.scrolled,2);
  const moved = harness('#rol-aura-gozcusu',true);
  moved.listeners.wheel(); moved.finishFonts();
  assert.equal(moved.aura.scrolled,1);
});
