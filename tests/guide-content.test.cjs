const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const guides=fs.readdirSync(root).filter(file=>/^(skyblock|survival|village).*\.html$/.test(file) && read(file).includes('guide-content.css'));

test('all game guides use scoped content styling before shared navigation and typography',()=>{
  assert.equal(guides.length,25);
  for(const file of guides){
    const html=read(file);
    assert.match(html,/<body[^>]*class="[^"]*guide-reading/,file);
    const content=html.indexOf('guide-content.css?v=20261003-2');
    assert.ok(content>0,file);
    assert.ok(html.indexOf('guide-navigation.css')>content,file);
    assert.ok(html.indexOf('game-typography.css')>content,file);
    assert.ok(!html.includes('data-pg-copy'),file);
    assert.ok(!html.includes('pg-preview-bar'),file);
  }
});

test('Survival keeps daily objectives in one section and redirects split legacy topics',()=>{
  const html=read('survival.html');
  const routeModule={exports:{}};
  vm.runInNewContext(read('site-map.js'),{module:routeModule,URL});
  const targets={meslekler:'survival-jobs.html#jobs-meslekler',kasalar:'survival-crates.html#kasalar',komutlar:'survival-commands.html#komutlar'};
  assert.equal(html.split('<h2>Günlük meslek görevleri</h2>').length-1,1);
  assert.match(html,/<body[^>]*data-game="survival"/);
  for(const id of ['meslekler','kasalar','komutlar']){
    assert.ok(!html.includes('<article id="'+id+'"'));
    assert.equal(routeModule.exports.resolveHref('survival.html#'+id),targets[id]);
  }
});

test('small-screen lists override their desktop selectors without weakening scope',()=>{
  const css=read('guide-content.css');
  assert.ok(css.includes('body.network-shell.guide-reading .pg-body :is(.pg-explained,.pg-jobs,.pg-roles-intro) { grid-template-columns:1fr; }'));
  assert.ok(css.includes('.pg-explained .pg-context { padding:0; border:0; }'));
});
