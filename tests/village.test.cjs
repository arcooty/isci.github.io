const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const html = fs.readFileSync(path.join(root,'village.html'),'utf8');
const source = fs.readFileSync(path.join(root,'village.js'),'utf8');

test('role catalogue contains all 17 implemented roles with no-JS content available', () => {
  const roles = ['koylu','doktor','cadi','bulasikci','gozcu-ciragi','kumarbaz','aura-gozcusu','medyum','gardiyan','silahsor','cinci-hoca','duz-kurt','golge-kurt','kor-kurt','saman-kurt','kundakci','soytari'];
  assert.equal((html.match(/class="village-role"/g) || []).length,roles.length);
  for (const role of roles) assert.match(html,new RegExp('<details class="village-role" id="rol-'+role+'"'));
  assert.doesNotMatch(html,/<section[^>]+class="village-role-panel[^>]+hidden/);
  for (const id of ['nasil-oynanir','roller','kazanma','lobi','sorular']) {
    assert.match(html,new RegExp('href="#'+id+'"'));
    assert.match(html,new RegExp('id="'+id+'"'));
  }
});

test('role caveats reflect implemented abilities instead of older generic descriptions', () => {
  assert.match(html,/Aura Gözcüsü[\s\S]*?doğrudan rolünü öğrenirsin/);
  assert.match(html,/Hedef bir kurt veya Kundakçıysa o elenir/);
  assert.match(html,/Soytarı mevcut otomatik maç dağılımında bulunmaz/);
  assert.match(html,/diğer bütün yaşayan oyuncuların toplamına eşit veya daha fazla/);
});

function harness(hash = '',pendingFonts = false) {
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
  const aura = new Element('rol-aura-gozcusu','DETAILS'); panels[0].children.push(aura);
  const arsonist = new Element('rol-kundakci','DETAILS'); panels[2].children.push(arsonist);
  const catalogue = new Element('roller');
  const faq = new Element('sorular');
  const nav = new Element('role-tabs','NAV');
  const ids = Object.fromEntries([...panels,...tabs,aura,arsonist,catalogue,faq].map(item => [item.id,item]));
  const location = {hash};
  const changes=[];
  const history = {
    pushState(_state,_title,value) { location.hash=value; changes.push(['push',value]); },
    replaceState(_state,_title,value) { location.hash=value; changes.push(['replace',value]); }
  };
  const listeners={};
  let finishFonts;
  const document = {
    querySelectorAll() { return tabs; },
    querySelector() { return nav; },
    getElementById(id) { return ids[id] || null; },
    fonts: {status:pendingFonts ? 'loading' : 'loaded',ready:{then(fn) { finishFonts=fn; }}}
  };
  vm.runInNewContext(source,{document,location,history,window:{addEventListener(type,fn) { listeners[type]=fn; }},requestAnimationFrame:fn=>fn()});
  const click = (index,overrides = {}) => {
    const event = {preventDefault() { this.prevented=true; },...overrides};
    tabs[index].events.click(event); return event;
  };
  const key = (index,name) => tabs[index].events.keydown({key:name,preventDefault() {}});
  return {tabs,panels,aura,arsonist,catalogue,nav,location,changes,listeners,click,key,finishFonts:()=>finishFonts?.()};
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
