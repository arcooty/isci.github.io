const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const routeModule = {exports:{}};
vm.runInNewContext(read('site-map.js'),{module:routeModule,URL});
const model = routeModule.exports;

test('Skyblock is discoverable through games, navigation, search and sitemap', () => {
  for (const file of ['index.html','servers.html','site-shell.js','sitemap.xml']) assert.ok(read(file).includes('skyblock.html'),file);
  assert.equal(model.search('skyblock')[0].href,'skyblock.html');
  assert.equal(model.search('skyblock minyon')[0].href,'skyblock-minion.html');
  assert.equal(model.search('skyblock vip')[0].href,'skyblock-vip.html#vip');
});
test('Skyblock guide reports limited test access and remaining checks honestly', () => {
  const page=read('skyblock.html')+read('skyblock-access.html');
  assert.ok(page.includes('henüz herkese açık değil'));
  assert.ok(page.includes('beyaz listeli test erişiminde'));
  assert.ok(page.includes('Ortak ada sandığı yeni adalarda'));
  assert.ok(page.includes('son oyunculu kabul kontrolleri sürüyor'));
  assert.ok(!page.includes('yayına hazır'));
  assert.ok(read('server-data.js').includes("name:'Skyblock',state:'testing'"));
  assert.ok(read('status.html').includes('Canlı durum değil, erişim koşulu.'));
});
test('separate economies, feature limitations and actual commands are documented', () => {
  const page=model.gameGuides.skyblock.map(([file])=>read(file)).join('');
  for(const text of ['500 oyun içi TL','32 blokla','4 kişiyle','20 tek seferlik','16 kişisel','3 günlük ve 4 haftalık','5.000 TL','5</td><td>10</td><td>15</td><td>20','/skytakas','/shop','/satislimiti','/tarimminyon kaldır']) assert.ok(page.includes(text),text);
  for(const text of ['Alan yüklü değilken üretim yapmaz','otomatik bina yerleştirmez','ayrı haftalık VIP kiti tanımlı değildir','cüzdanlar ve ilan kapasiteleri ayrıdır']) assert.ok(page.includes(text),text);
  assert.ok(read('store.html').includes('href="store-skyblock.html"'));
  assert.ok(read('survival.html').includes('/takasoyuncu'));
});

test('the live minion behavior and unavailable shared storage are not misrepresented',()=>{
  const minion=read('skyblock-minion.html');
  assert.ok(minion.includes('Ada sahibinin çevrimiçi olması zorunlu değildir'));
  assert.ok(minion.includes('hasat düşüşlerinden bir tohum veya ürün ayırır'));
  assert.ok(!minion.includes('Ada sahibi çevrimiçiyken'));
  assert.ok(read('skyblock-island.html').includes('başlangıç sayfa sayısı 0'));
  assert.ok(read('skyblock-orders.html').includes('/siparis haftalik'));
  assert.ok(read('skyblock-community.html').includes('/skyshowcase vote 1'));
  assert.ok(read('skyblock-start.html').includes('dokuz hizmet NPC’si'));
});
test('Bedrock public endpoint is distinct from the internal Geyser port', () => {
  const page=read('join.html');
  assert.ok(page.includes('data-copy-address="bedrock.robsarcade.online"'));
  assert.ok(page.includes('<code>6426</code>'));
  assert.ok(!page.includes('19132'));
  assert.ok(read('site-shell.js').includes("button.dataset.copyAddress || 'oyna.robsarcade.online'"));
});
