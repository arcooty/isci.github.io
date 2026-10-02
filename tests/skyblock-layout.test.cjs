const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
test('Skyblock articles separate reading, commands and essential limits', () => {
  for (const file of fs.readdirSync(root).filter(file => /^skyblock(?:-[a-z-]+)?\.html$/.test(file))) {
    const html = read(file);
    assert.ok(html.includes('skyblock-content.css?v=20261002-1'),file);
    assert.ok(html.includes('href="skyblock-leaderboard.html"'),file);
  }
  for (const file of ['start','island','orders','minion','trade','community','vip']) assert.ok(read('skyblock-'+file+'.html').includes('sky-command-panel'),file);
  assert.ok(read('skyblock-progress.html').includes('sky-topic-panels'));
  assert.ok(!read('skyblock-orders.html').includes('class="vip-comparison"'));
  assert.ok(read('skyblock-orders.html').includes('Teslim edilen eşyalar tüketilir'));
  assert.ok(read('skyblock-vip.html').includes('Tüm oyuncularda aynı kalanlar'));
  assert.ok(read('skyblock-content.css').includes('grid-template-columns:minmax(0,1fr);'));
});
test('Skyblock rankings use their own API and are discoverable', () => {
  assert.ok(read('skyblock-leaderboard.js').includes("'/skyblock/leaderboards'"));
  assert.ok(read('skyblock-leaderboard.js').includes("next.game !== 'skyblock'"));
  assert.ok(!read('skyblock-leaderboard.js').includes('players.html?player='));
  assert.ok(read('sitemap.xml').includes('/skyblock-leaderboard.html'));
  assert.ok(read('site-map.js').includes("siralamalar:'skyblock-leaderboard.html#rankings'"));
});
function harness(fetch) {
  class Element {
    constructor() { this.children=[]; this.handlers={}; this.dataset={}; this.attrs={}; this.hidden=false; }
    addEventListener(type,handler) { this.handlers[type]=handler; }
    setAttribute(name,value) { this.attrs[name]=value; }
    append(...children) { this.children.push(...children); }
    replaceChildren() { this.children=[]; }
    focus() { this.focused=true; }
  }
  const ids=Object.fromEntries(['panel','title','metric','status','list','refresh','updated'].map(name=>['sky-board-'+name,new Element()]));
  const tabs=['economy','bank','missions','rating'].map(category=>Object.assign(new Element(),{id:'sky-tab-'+category,dataset:{skyBoard:category}}));
  const events={};
  const location={hash:'#missions'};
  vm.runInNewContext(read('skyblock-leaderboard.js'),{
    document:{querySelectorAll:()=>tabs,getElementById:id=>ids[id],createElement:()=>new Element()},
    window:{ARCADE_API:{base:'https://api.example.test/api/v1'},addEventListener:(name,handler)=>events[name]=handler},
    location,history:{replaceState:(_,__,hash)=>location.hash=hash},fetch,AbortSignal,Date
  });
  return {ids,tabs,events,location};
}
const flush = () => new Promise(resolve=>setImmediate(resolve));
const data={game:'skyblock',generatedAt:'2026-10-02T12:00:00Z',boards:{economy:[{name:'Tester',value:'500 TL'}],bank:[{name:'Tester',island:'Ada',value:'20 TL'}],missions:[],rating:[]}};
test('rankings render genuine empty categories, keyboard tabs and keep data on refresh failure',async()=>{
  let fail=false;
  const calls=[];
  const app=harness(async url=>{calls.push(url); if(fail) throw new Error('offline'); return {ok:true,json:async()=>data};});
  await flush();
  assert.equal(app.tabs[2].attrs['aria-selected'],'true');
  assert.equal(app.ids['sky-board-list'].children.length,0);
  assert.match(app.ids['sky-board-status'].textContent,/henüz/);
  app.tabs[0].handlers.click();
  assert.equal(app.ids['sky-board-list'].children.length,1);
  assert.equal(app.ids['sky-board-status'].hidden,true);
  app.tabs[0].handlers.keydown({key:'ArrowRight',preventDefault(){}});
  assert.equal(app.tabs[1].focused,true);
  assert.equal(app.location.hash,'#bank');
  fail=true; await app.ids['sky-board-refresh'].handlers.click();
  assert.equal(app.ids['sky-board-list'].children.length,1);
  assert.match(app.ids['sky-board-status'].textContent,/Son alınan/);
  assert.equal(app.ids['sky-board-refresh'].disabled,false);
  assert.ok(calls.every(url=>url.endsWith('/skyblock/leaderboards')));
});
test('rankings reject Survival data and expose retry without invented entries',async()=>{
  const app=harness(async()=>({ok:true,json:async()=>({...data,game:'survival'})}));
  await flush();
  assert.equal(app.ids['sky-board-list'].children.length,0);
  assert.match(app.ids['sky-board-status'].textContent,/alınamıyor/);
  assert.equal(app.ids['sky-board-refresh'].disabled,false);
});
