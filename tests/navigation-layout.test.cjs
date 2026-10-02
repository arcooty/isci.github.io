const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('all section-menu pages load stable text rows and button dimensions before paint',()=>{
  for(const file of ['help','rules','status','punishments','appeal','application','community','news','staff','players']) {
    const html=read(file+'.html');
    assert.ok(html.includes('data-section-nav="true"'),file);
    assert.ok(html.includes('navigation-layout.css?v=20261002-1'),file);
  }
  for(const file of ['store','store-compare','store-kits','store-delivery','store-skyblock','store-skyblock-compare','store-skyblock-kits']) {
    assert.ok(read(file+'.html').includes('navigation-layout.css?v=20261002-1'),file);
  }
  const css=read('navigation-layout.css');
  assert.ok(css.includes('grid-template-rows:minmax(58px,auto) minmax(48px,auto)'));
  assert.ok(css.includes('height:60px; min-height:60px'));
  assert.ok(css.includes('@media(max-width:400px)'));
});
test('store comparisons contain one heading and preserve table values and limits',()=>{
  for(const [file,game] of [['store-compare.html','Survival'],['store-skyblock-compare.html','Skyblock']]) {
    const html=read(file);
    assert.ok(html.includes(game+' paket karşılaştırması'));
    assert.ok(!html.includes('Hakları karşılaştır</h2>'));
    assert.ok(!html.includes('hakları ve kullanım sınırları.</p>'));
    assert.ok(html.includes('class="comparison-notes"'));
    assert.equal((html.match(/<table /g)||[]).length,1);
  }
  assert.ok(read('store-compare.html').includes('<td>3</td><td>5</td><td>8</td><td>12</td>'));
  assert.ok(read('store-compare.html').includes("Türkiye saati 00:00'da yenilenir"));
  assert.ok(read('store-skyblock-compare.html').includes('<td>5</td><td>10</td><td>15</td><td>20</td>'));
});
test('delivery keeps the actual delivery instructions without a duplicate intro',()=>{
  const html=read('store-delivery.html');
  assert.ok(!html.includes('Siparişin teslimatı ve desteği.'));
  assert.ok(!html.includes('<header class="game-guide-heading">'));
  assert.ok(html.includes('30 günlük rütbenin oyun içi teslimatını'));
  assert.ok(html.includes('<h2>Sipariş desteği</h2>'));
});
