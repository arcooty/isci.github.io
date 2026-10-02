const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const pages = ['index','servers','survival','skyblock','village','news','staff','players','store','join','help','rules','status','punishments','appeal','application','sitemap','privacy','terms','order','404'];

test('every full page loads one shared finish after the page-specific styles',()=>{
  for (const page of pages) {
    const html = read(page+'.html');
    const styles = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(match=>match[1]);
    const game = ['survival','skyblock','village','store'].includes(page);
    if(page === 'servers') {
      assert.equal(styles.pop(),'navigation-layout.css?v=20261002-1');
      assert.ok(html.includes('data-section-nav="true"'));
    }
    assert.equal(styles.at(-1),page === 'survival' ? 'guide-navigation.css?v=20261002-24' : page === 'index' ? 'home-status.css?v=20261002-6' : ['help','rules','status','punishments','appeal','application'].includes(page) ? 'help-navigation.css?v=20261002-9' : ['news','staff','players'].includes(page) ? 'community-layout.css?v=20261002-19' : game ? 'game-guides.css?v=20261002-23' : 'polish.css?v=20261002-21',page);
    assert.equal(styles.filter(style=>style.startsWith('polish.css')).length,1,page);
    assert.ok(html.includes('craft.css?v=20261002-22'),page+' layout cache');
    assert.ok(html.includes('site-shell.js?v=20261002-26'),page+' navigation cache');
  }
});

test('home status no longer obscures the supplied hub screenshot',()=>{
  const html = read('index.html');
  const hero = html.slice(html.indexOf('<section class="craft-hero"'),html.indexOf('<section class="home-status-band"'));
  assert.ok(hero.includes('assets/hub-gameplay.png'));
  assert.ok(!hero.includes('floating-status'));
  for (const id of ['home-state','floating-player-count','home-player-max','home-capacity']) assert.ok(html.includes('id="'+id+'"'));
});

test('illustrative Skyblock artwork is disclosed in each placement',()=>{
  assert.ok(fs.existsSync(path.join(root,'assets/skyblock-island.png')));
  for (const page of ['index','servers','skyblock']) {
    const html = read(page+'.html');
    assert.ok(html.includes('assets/skyblock-island.png'),page);
    assert.ok(html.includes('Temsili görsel'),page);
  }
});

test('both themes share purposeful game colors and honor reduced motion',()=>{
  const css = read('polish.css');
  assert.ok(css.includes(':root[data-theme=dark]'));
  assert.ok(css.includes('prefers-reduced-motion:reduce'));
  for (const color of ['#83e6a3','#77ddf2','#f3a1cc','#ffd36b']) assert.ok(css.includes(color));
  assert.ok(!css.includes('radial-gradient'));
  assert.ok(css.includes('.page-index.skyblock-topics>a { color:var(--tile-ink); }'));
  for (const page of ['skyblock','village','store']) assert.ok(css.includes('body[data-page="'+page+'"]'));
});
