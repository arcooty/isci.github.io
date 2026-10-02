const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {test}=require('node:test');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const route={exports:{}};
vm.runInNewContext(read('site-map.js'),{module:route,URL});
const model=route.exports;
const pages=['store.html','store-compare.html','store-kits.html','store-skyblock.html','store-skyblock-compare.html','store-skyblock-kits.html','store-delivery.html'];

test('store topics are real pages with four compact buttons and one active topic',()=>{
  for(const file of pages) {
    const html=read(file);
    const nav=html.match(/<nav class="chunky-nav "[^>]*>([\s\S]*?)<\/nav>/)[1];
    assert.equal((nav.match(/<a /g)||[]).length,4,file);
    assert.equal((nav.match(/aria-current="page"/g)||[]).length,1,file);
    assert.ok(nav.includes('href="'+file+'" aria-current="page"'),file);
    assert.ok(html.includes('https://robsarcade.online/'+file));
    assert.ok(read('sitemap.xml').includes('/'+file));
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    assert.ok(html.includes('game-guides.css?v=20261002-23'));
  }
  assert.ok(!read('store.html').includes('id="karsilastirma"'));
  assert.ok(!read('store.html').includes('id="kitler"'));
  assert.ok(!read('store.html').includes('id="teslimat"'));
});

test('all store pages place a shared masthead above compact sections',()=>{
  for(const file of pages) {
    const html=read(file);
    assert.ok(html.includes('store-layout.css?v=20261002-20'));
    assert.ok(html.indexOf('<h1>VIP mağazası</h1>')<html.indexOf('class="chunky-nav '));
    assert.doesNotMatch(html, /<a class="text-link" href="servers.html">/);
    if(['store.html','store-skyblock.html','store-delivery.html'].includes(file)) {
      assert.doesNotMatch(html, /<header class="game-guide-heading">|hakları ve kullanım sınırları\.<\/p>/);
    } else assert.match(html, /<header class="game-guide-heading"><h2>/);
  }
  const css=read('store-layout.css');
  assert.match(css, /min-height:54px/);
  assert.match(css, /min-height:44px/);
  assert.match(css, /flex-direction:row/);
});
test('Survival and Skyblock advantages stay separate without creating different checkout products',()=>{
  const survival=read('store.html'),sky=read('store-skyblock.html');
  assert.ok(survival.includes('5 ev noktası'));
  assert.ok(!sky.includes('5 ev noktası'));
  for(const n of [10,15,20]) assert.ok(sky.includes(n+' açık artırma ilanı'));
  assert.ok(sky.includes('VIP almak test erişimi sağlamaz'));
  assert.ok(read('store-skyblock-kits.html').includes('haftalık VIP, MVIP veya UVIP kiti tanımlı değildir'));
  for(const html of [survival,sky]) {
    assert.deepEqual([...html.matchAll(/data-buy-package="([^"]+)"/g)].map(m=>m[1]),['vip','mvip','uvip']);
    assert.ok(html.includes('store-consent'));
    assert.ok(html.includes('minecraft-username'));
    assert.ok(html.includes('store.js?v=20260926-5'));
  }
  for(const file of pages.filter(f=>!f.includes('delivery'))) {
    const nav=read(file).match(/<nav class="chunky-nav mode-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
    assert.equal((nav.match(/aria-current="page"/g)||[]).length,1,file);
  }
});
test('old store and Village links preserve their anchors and package query',()=>{
  assert.equal(model.resolveHref('store.html?package=uvip#kitler'),'store-kits.html?package=uvip#kitler');
  assert.equal(model.resolveHref('store.html#karsilastirma'),'store-compare.html#karsilastirma');
  assert.equal(model.resolveHref('store.html#teslimat'),'store-delivery.html#teslimat');
  assert.equal(model.resolveHref('village-play.html#kazanma'),'village-win.html#kazanma');
  assert.equal(model.resolveHref('village-lobby.html#sorular'),'village-faq.html#sorular');
});
test('Survival uses hub tiles, a shared toolbar and matching map/ranking footers',()=>{
  const html=read('survival.html');
  assert.ok(!html.includes('class="hub-tabs"'));
  assert.ok(html.includes('class="game-guide-toolbar survival-topic-toolbar"'));
  assert.ok(!html.includes('class="chunky-nav survival-sections"'));
  for(const view of ['rehber','harita','siralamalar']) assert.ok(html.includes('data-hub-tab="'+view+'"'));
  for(const id of ['harita','siralamalar']) {
    const panel=html.slice(html.indexOf('<section id="'+id+'"'));
    assert.ok(panel.includes('class="game-guide-next"'));
    assert.ok(panel.includes('Bütün konular'));
  }
});
