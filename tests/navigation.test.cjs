const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const routeModule = {exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'site-map.js'),'utf8'),{module:routeModule,URL});
const model = routeModule.exports;

test('13 compatibility routes resolve to existing content, not another redirect', () => {
  assert.equal(Object.keys(model.legacy).length,13);
  for (const [old,destination] of Object.entries(model.legacy)) {
    const [file,id] = destination.split('#');
    assert.ok(!model.legacy[file]);
    assert.match(fs.readFileSync(path.join(root,file),'utf8'),new RegExp('id="'+id+'"'));
    assert.equal(model.resolveHref(old),destination);
    assert.match(fs.readFileSync(path.join(root,old),'utf8'),/legacy-route.js/);
  }
});
test('package selection and old feature anchors survive redirects', () => {
  assert.equal(model.resolveHref('ranks.html?package=uvip'),'store.html?package=uvip#paketler');
  assert.equal(model.resolveHref('survival-systems.html#ekonomi'),'survival.html#ekonomi');
  assert.equal(model.resolveHref('survival-systems.html#koruma'),'survival.html#arazi');
  assert.equal(model.resolveHref('https://example.com/jobs.html'),'https://example.com/jobs.html');
  assert.equal(model.resolveHref('#meslekler'),'#meslekler');
});
test('public registry never links to a compatibility endpoint', () => {
  for (const group of model.sections) for (const [href] of group.pages) {
    assert.ok(!model.legacy[href.split('#')[0]]);
    assert.ok(fs.existsSync(path.join(root,href.split('#')[0])));
  }
});

function harness(hash = '', realRoutes = false) {
  class Element {
    constructor(dataset = {}) { this.dataset=dataset; this.attrs={}; this.hidden=false; this.children=[]; this.value=''; this.textContent=''; this.src=''; }
    setAttribute(key,value) { this.attrs[key]=value; }
    removeAttribute(key) { delete this.attrs[key]; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children=children; }
    querySelectorAll() { return this.children; }
    addEventListener(type,handler) { (this.events ||= {})[type]=handler; }
    focus() { this.focused=true; this.focusCount=(this.focusCount||0)+1; }
    getBoundingClientRect() { return {top:240,bottom:270}; }
  }
  const topics = Array.from(model.topics,([id]) => new Element({guideTopic:id}));
  const panels = ['genel','rehber','harita','siralamalar'].map(id => new Element({hubPanel:id}));
  const tabs = ['genel','rehber','harita','siralamalar'].map(id => new Element({hubTab:id}));
  const sectionLinks = Object.values(model.topicSections).flatMap(items=>Array.from(items,([id])=>new Element({sectionLink:id})));
  const ids = Object.fromEntries(['guide-topics','guide-topic-select','guide-current','guide-next','guide-category-menu'].map(id=>[id,new Element()]));
  model.topics.forEach(([id],i)=>ids[id]=topics[i]);
  sectionLinks.forEach(link=>ids[link.dataset.sectionLink]=new Element());
  const frame = new Element({src:'https://map.robsarcade.online/'});
  const events = {};
  const location = {hash,origin:'https://robsarcade.online',pathname:'/survival.html',href:'https://robsarcade.online/survival.html'+hash};
  if (realRoutes) location.replace = target => { location.replaced = target; };
  const history = {pushState:(_state,_title,hash)=>{location.hash=hash;}};
  const document = {
    querySelectorAll:selector=>selector.includes('hub-panel')?panels:selector.includes('guide-topic')?topics:selector.includes('section-link')?sectionLinks:tabs,
    querySelector:selector=>selector.includes('iframe')?frame:new Element(),
    getElementById:id=>ids[id] || new Element(),
    createElement:()=>new Element(),createTextNode:text=>text,
    addEventListener:(type,handler)=>events[type]=handler,
    fonts:{ready:{then:handler=>events.fontsReady=handler}}
  };
  const window = {ARCADE_SITE:model,scrollY:0,scrollTo:()=>{},addEventListener:(type,handler)=>events[type]=handler};
  vm.runInNewContext(fs.readFileSync(path.join(root,'survival.js'),'utf8'),{window,document,location,history,requestAnimationFrame:fn=>fn(),URL});
  return {topics,panels,tabs,ids,frame,events,history,location,document,sectionLinks};
}
test('deep link selects precisely one guide topic and leaves the map unloaded', () => {
  const h=harness('#ekonomi');
  assert.deepEqual(h.panels.filter(p=>!p.hidden).map(p=>p.dataset.hubPanel),['rehber']);
  assert.deepEqual(h.topics.filter(p=>!p.hidden).map(p=>p.dataset.guideTopic),['ekonomi']);
  assert.equal(h.ids['guide-current'].textContent,'Ekonomi ve ticaret');
  assert.equal(h.ids['guide-topic-select'].value,'ekonomi');
  assert.equal(h.frame.src,'');
});

test('all seven large guide tiles use the canonical topic labels and destinations', () => {
  const html=fs.readFileSync(path.join(root,'survival.html'),'utf8');
  const tiles=[...html.matchAll(/<a class="topic-card" href="([^"]+)"><span><strong>([^<]+)<\/strong>/g)];
  assert.equal(tiles.length,model.topics.length);
  assert.deepEqual(tiles.map(([,href,label])=>[href,label]),Array.from(model.topics,([id,label])=>[model.gameRoutes['survival.html'][id]?.split('#')[0] || '#'+id,label]));
});

test('split topics redirect on selection and history without rendering the old article', () => {
  const h=harness('#baslangic',true);
  const oldLabel=h.ids['guide-current'].textContent;
  h.ids['guide-topic-select'].value='meslekler';
  h.ids['guide-topic-select'].events.change();
  assert.equal(h.location.replaced,'survival-jobs.html#jobs-meslekler');
  assert.equal(h.ids['guide-current'].textContent,oldLabel);
  h.location.hash='#kasalar'; h.events.popstate();
  assert.equal(h.location.replaced,'survival-crates.html#kasalar');
  h.location.hash='#komutlar'; h.events.hashchange();
  assert.equal(h.location.replaced,'survival-commands.html#komutlar');
});

test('choosing another topic closes the category menu without losing the active topic', () => {
  const h=harness('#baslangic');
  h.ids['guide-category-menu'].open=true;
  h.ids['guide-topic-select'].value='ekonomi';
  h.ids['guide-topic-select'].events.change();
  assert.equal(h.ids['guide-category-menu'].open,false);
  assert.equal(h.ids['guide-current'].textContent,'Ekonomi ve ticaret');
  assert.equal(h.topics.filter(t=>!t.hidden).length,1);
});
test('topic selection and Back/Forward popstate restore the correct view', () => {
  const h=harness('#ekonomi');
  h.ids['guide-topic-select'].value='meslekler';
  h.ids['guide-topic-select'].events.change();
  assert.equal(h.location.hash,'#meslekler');
  assert.equal(h.ids['guide-current'].textContent,'Meslekler');
  h.location.hash='#ekonomi'; h.events.popstate();
  assert.equal(h.ids['guide-current'].textContent,'Ekonomi ve ticaret');
  h.location.hash='#genel'; h.events.popstate();
  assert.deepEqual(h.panels.filter(p=>!p.hidden).map(p=>p.dataset.hubPanel),['genel']);
  h.location.hash='#meslekler'; h.events.popstate();
  assert.equal(h.ids['guide-current'].textContent,'Meslekler');
});
test('the map initializes only on map selection, and guide links remember their topic', () => {
  const h=harness('#kasalar');
  assert.equal(h.frame.src,'');
  h.location.hash='#harita';h.events.popstate();
  assert.equal(h.frame.src,'https://map.robsarcade.online/');
  assert.equal(h.tabs.find(t=>t.dataset.hubTab==='rehber').href,'#kasalar');
});
test('unknown or malformed hashes return safely to the overview', () => {
  const h=harness('#%broken');
  assert.deepEqual(h.panels.filter(p=>!p.hidden).map(p=>p.dataset.hubPanel),['genel']);
});

test('returning from page history restores the next-topic visibility', () => {
  const h=harness('#gorevler');
  h.ids['guide-next'].hidden=true;
  h.events.pageshow();
  assert.equal(h.ids['guide-next'].hidden,false);
  assert.equal(h.ids['guide-next'].href,'survival.html#ekonomi');
});

test('old crates, commands and systems links go directly to final guide pages', () => {
  for (const [old,target] of [['crates.html?from=discord','survival-crates.html?from=discord#kasalar'],['commands.html','survival-commands.html#komutlar'],['survival-systems.html#ilerleme','survival-jobs.html#jobs-meslekler'],['survival-systems.html#icerik','survival-crates.html#kasalar']]) {
    assert.equal(model.resolveHref(old),target);
    assert.equal(model.resolveHref(target),target);
  }
});
test('subsection deep links open their owner topic, focus the section and preserve context',()=>{
  for(const [topic,items] of Object.entries(model.topicSections)) for(const [id] of items) {
    const h=harness('#'+id);
    assert.deepEqual(h.topics.filter(p=>!p.hidden).map(p=>p.dataset.guideTopic),[topic]);
    assert.equal(h.ids[id].focused,true);
    assert.equal(h.ids['guide-topic-select'].value,topic);
    assert.equal(h.tabs.find(t=>t.dataset.hubTab==='rehber').attrs['aria-current'],'page');
    assert.equal(h.sectionLinks.find(link=>link.dataset.sectionLink===id).attrs['aria-current'],'location');
    assert.equal(h.frame.src,'');
  }
});
test('in-page subsection clicks do not fall back to the overview',()=>{
  const h=harness('#meslekler');
  const link={href:'https://robsarcade.online/survival.html#jobs-komutlar'};
  let prevented=false;
  h.events.click({target:{closest:()=>link},button:0,preventDefault:()=>{prevented=true;}});
  assert.equal(prevented,true);
  assert.equal(h.location.hash,'#jobs-komutlar');
  assert.equal(h.ids['guide-current'].textContent,'Meslekler');
  h.location.hash='#meslekler';h.events.popstate();
  assert.equal(h.ids['guide-current'].textContent,'Meslekler');
});
test('font completion realigns a deep link without overriding user navigation',()=>{
  const h=harness('#jobs-komutlar');
  assert.equal(h.ids['jobs-komutlar'].focusCount,1);
  h.events.fontsReady();assert.equal(h.ids['jobs-komutlar'].focusCount,2);
  const interacted=harness('#jobs-komutlar');interacted.events.wheel();interacted.events.fontsReady();
  assert.equal(interacted.ids['jobs-komutlar'].focusCount,1);
  const moved=harness('#jobs-komutlar');moved.location.hash='#ekonomi';moved.events.popstate();moved.events.fontsReady();
  assert.equal(moved.ids['guide-current'].textContent,'Ekonomi ve ticaret');
  assert.equal(moved.ids['ekonomi'].focusCount,1);
});
