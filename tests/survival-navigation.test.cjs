const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
test('every split Survival page shares the game toolbar, menu and footer',()=>{
  const files=fs.readdirSync(root).filter(file=>/^survival-(jobs|crates|commands)(-\w+)?\.html$/.test(file));
  assert.equal(files.length,9);
  for(const file of files) {
    const html=read(file);
    assert.ok(!html.includes('jobs-masthead'),file);
    assert.ok(html.includes('survival-navigation.css?v=20261002-1'),file);
    assert.ok(html.includes('game-guide.js?v=20261002-3'),file);
    const toolbar=html.match(/<nav class="game-guide-toolbar survival-topic-toolbar"[\s\S]*?<\/details><\/nav>/)[0];
    assert.equal((toolbar.match(/<a /g)||[]).length,10,file);
    assert.equal((toolbar.match(/aria-current="page"/g)||[]).length,1,file);
    assert.ok(toolbar.includes('<h1>Survival</h1>'),file);
    assert.ok(html.includes('Bütün konular</a>'),file);
  }
});
test('Survival changes the visible shell before displaying a selected topic',()=>{
  const html=read('survival.html'),css=read('survival-navigation.css'),js=read('survival.js');
  assert.ok(html.indexOf('dataset.survivalView')<html.indexOf('<body'));
  assert.ok(css.includes('html[data-survival-view=content] body.survival-hub .hub-masthead { display:none; }'));
  assert.ok(css.includes('.survival-topic-toolbar[hidden] { display:none; }'));
  assert.ok(js.includes("toolbar.hidden=view==='genel'"));
  assert.ok(js.includes("link.dataset.topicLink===(topic ? topic[0] : view)"));
});
test('home community blocks share heading, description and action spacing',()=>{
  const css=read('home-network.css');
  assert.ok(css.includes(':is(.community-invitation,.community-editorial)'));
  assert.ok(css.includes('row-gap:22px'));
  assert.ok(css.includes('.community-section :is(h2,h3) { margin:0; font:700 34px/1.2'));
  assert.ok(css.includes('.community-section p { margin:0;'));
});
