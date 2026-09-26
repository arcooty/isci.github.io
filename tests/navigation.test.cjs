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

function harness(hash = '') {
  class Element {
    constructor(dataset = {}) { this.dataset=dataset; this.attrs={}; this.hidden=false; this.children=[]; this.value=''; this.textContent=''; this.src=''; }
    setAttribute(key,value) { this.attrs[key]=value; }
    removeAttribute(key) { delete this.attrs[key]; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children=children; }
    querySelectorAll() { return this.children; }
    addEventListener(type,handler) { (this.events ||= {})[type]=handler; }
    focus() { this.focused=true; }
    getBoundingClientRect() { return {top:240,bottom:270}; }
  }
  const topics = Array.from(model.topics,([id]) => new Element({guideTopic:id}));
  const panels = ['genel','rehber','harita','siralamalar'].map(id => new Element({hubPanel:id}));
  const tabs = ['genel','rehber','harita','siralamalar'].map(id => new Element({hubTab:id}));
  const ids = Object.fromEntries(['guide-topics','guide-topic-select','guide-current','guide-next'].map(id=>[id,new Element()]));
  model.topics.forEach(([id],i)=>ids[id]=topics[i]);
  const frame = new Element({src:'https://map.robsarcade.online/'});
  const events = {};
  const location = {hash,pathname:'/survival.html',href:'https://robsarcade.online/survival.html'+hash};
  const history = {pushState:(_state,_title,hash)=>{location.hash=hash;}};
  const document = {
    querySelectorAll:selector=>selector.includes('hub-panel')?panels:selector.includes('guide-topic')?topics:tabs,
    querySelector:selector=>selector.includes('iframe')?frame:new Element(),
    getElementById:id=>ids[id] || new Element(),
    createElement:()=>new Element(),createTextNode:text=>text,
    addEventListener:(type,handler)=>events[type]=handler
  };
  const window = {ARCADE_SITE:model,scrollY:0,scrollTo:()=>{},addEventListener:(type,handler)=>events[type]=handler};
  vm.runInNewContext(fs.readFileSync(path.join(root,'survival.js'),'utf8'),{window,document,location,history,requestAnimationFrame:fn=>fn(),URL});
  return {topics,panels,tabs,ids,frame,events,history,location,document};
}
test('deep link selects precisely one guide topic and leaves the map unloaded', () => {
  const h=harness('#ekonomi');
  assert.deepEqual(h.panels.filter(p=>!p.hidden).map(p=>p.dataset.hubPanel),['rehber']);
  assert.deepEqual(h.topics.filter(p=>!p.hidden).map(p=>p.dataset.guideTopic),['ekonomi']);
  assert.equal(h.ids['guide-current'].textContent,'Ekonomi ve ticaret');
  assert.equal(h.ids['guide-topic-select'].value,'ekonomi');
  assert.equal(h.frame.src,'');
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
