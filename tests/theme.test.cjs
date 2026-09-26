const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const script = fs.readFileSync(path.join(root,'theme.js'),'utf8');
function boot(saved,blocked=false) {
  const rootElement = {dataset:{},style:{}};
  const meta = [];
  const events = [];
  const listeners = {};
  const values = new Map(saved === undefined ? [] : [['arcadecraft-theme',saved]]);
  const storage = {
    getItem(key) { if(blocked) throw new Error('Storage unavailable'); return values.get(key) ?? null; },
    setItem(key,value) { if(blocked) throw new Error('Storage unavailable'); values.set(key,value); }
  };
  const window = {localStorage:storage,dispatchEvent:event=>events.push(event),addEventListener:(type,handler)=>listeners[type]=handler};
  const document = {documentElement:rootElement,querySelector:()=>meta[0] ?? null,createElement:()=>({}),head:{append:element=>meta.push(element)}};
  vm.runInNewContext(script,{window,document,CustomEvent:class { constructor(type,options) { this.type=type; this.detail=options.detail; } }});
  return {api:window.ARCADE_THEME,rootElement,meta,events,listeners,values};
}
test('first visit defaults to dark without following the operating system',()=>{
  const {api,rootElement,meta,values}=boot();
  assert.equal(api.get(),'dark');
  assert.equal(rootElement.dataset.theme,'dark');
  assert.equal(rootElement.style.colorScheme,'dark');
  assert.equal(meta[0].content,'#151619');
  assert.equal(values.size,0);
});
test('explicit light and dark preferences are restored before the page renders',()=>{
  for(const theme of ['light','dark']) assert.equal(boot(theme).api.get(),theme);
  for(const invalid of [null,'','system','undefined','other']) assert.equal(boot(invalid).api.get(),'dark');
});
test('toggle persists both directions across navigation and refresh',()=>{
  const page=boot();
  page.api.toggle();
  assert.equal(page.rootElement.dataset.theme,'light');
  assert.equal(page.rootElement.style.colorScheme,'light');
  assert.equal(page.meta[0].content,'#f7f8fc');
  assert.equal(page.values.get('arcadecraft-theme'),'light');
  const next=boot(page.values.get('arcadecraft-theme'));
  assert.equal(next.api.get(),'light');
  next.api.toggle();
  assert.equal(boot(next.values.get('arcadecraft-theme')).api.get(),'dark');
  assert.equal(page.meta.length,1);
});
test('blocked storage never breaks rendering or theme switching',()=>{
  const page=boot(undefined,true);
  assert.equal(page.api.get(),'dark');
  page.api.toggle();
  assert.equal(page.api.get(),'light');
  page.api.toggle();
  assert.equal(page.api.get(),'dark');
});
test('cross-tab changes update theme and controls without rewriting storage',()=>{
  const page=boot('dark');
  page.listeners.storage({key:'unrelated',newValue:'light'});
  assert.equal(page.api.get(),'dark');
  page.listeners.storage({key:'arcadecraft-theme',newValue:'light'});
  assert.equal(page.api.get(),'light');
  assert.equal(page.events.at(-1).type,'arcade-theme-change');
  assert.equal(page.events.at(-1).detail.theme,'light');
  assert.equal(page.values.get('arcadecraft-theme'),'dark');
  page.listeners.storage({key:'arcadecraft-theme',newValue:null});
  assert.equal(page.api.get(),'dark');
  page.api.set('light');
  page.listeners.storage({key:null,newValue:null});
  assert.equal(page.api.get(),'dark');
});
test('every full page loads the theme before CSS and preserves no-JS dark fallback',()=>{
  const pages=fs.readdirSync(root).filter(name=>name.endsWith('.html') && fs.readFileSync(path.join(root,name),'utf8').includes('craft.css'));
  assert.ok(pages.length>0);
  for(const name of pages) {
    const html=fs.readFileSync(path.join(root,name),'utf8');
    assert.match(html,/<html[^>]*data-theme="dark"/);
    const themeScripts=html.match(/src="theme.js\?v=[0-9-]+"/g) || [];
    assert.equal(themeScripts.length,1,name);
    assert.ok(html.indexOf('theme.js') < html.indexOf('rel="stylesheet"'),name);
    assert.ok(html.indexOf('theme.css') > html.indexOf('craft.css'),name);
    const version=themeScripts[0].match(/\?v=([0-9-]+)/)[1];
    assert.ok(html.includes('theme.css?v='+version),name);
  }
});
