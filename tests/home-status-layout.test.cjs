const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
test('status presentation is scoped to the homepage and loads after shared styles',()=>{
  const html=read('index.html');
  assert.ok(html.indexOf('home-status.css?v=20261002-7')>html.indexOf('polish.css?v=20261002-27'));
  assert.ok(html.includes('id="sunucu-durumu"'));
  const css=read('home-status.css');
  assert.ok(css.includes('body.home-page .home-status-band'));
  assert.ok(css.includes('color:var(--quiet)'));
  assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
  assert.ok(css.includes('overflow-wrap:anywhere'));
  assert.ok(css.includes(':is(.floating-status-head,.floating-status-players,.status-facts>div)'));
  assert.ok(css.includes('grid-template-rows:minmax(24px,auto) minmax(30px,auto)'));
  assert.ok(!css.includes('vw'));
});
test('compact status retains the live renderer targets and connection data',()=>{
  const html=read('index.html');
  for(const id of ['home-state','floating-player-count','home-player-max','home-capacity']) {
    assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  }
  for(const client of ['java','bedrock']) assert.ok(html.includes('data-client-range="'+client+'"'));
  assert.ok(html.includes('href="status.html" class="status-detail craft-button primary"'));
  assert.ok(html.includes('data-client-notice="java" hidden'));
});
