const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname, '..');
const facts = require('./fixtures/survival-release.json');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const survival = read('survival.html');

test('published reward names, quantities and chances match the installed crate configuration', () => {
  for (const [rank, expected] of Object.entries(facts.crates)) {
    const block = survival.match(new RegExp(`<article class="crate-odds tier-${rank}">([\\s\\S]*?)</article>`))[1];
    const rows = [...block.matchAll(/<div><span>(.*?)<\/span><strong>(.*?)<\/strong><\/div>/g)]
      .map(([,label,chance]) => ({label,chance}));
    assert.deepEqual(rows, expected, rank);
    const total = rows.reduce((sum, row) => sum + Number(row.chance.slice(1).replace(',', '.')), 0);
    assert.ok(Math.abs(total - 100) < 0.00001);
    assert.equal(facts.weeklyKitDelays[rank], 604800);
  }
});

test('guide and storefront describe one equal daily sell limit and its actual reset zone', () => {
  assert.equal(facts.dailyCap, 25000);
  assert.equal(facts.resetZone, 'Europe/Istanbul');
  assert.equal(facts.categories.length, 8);
  for (const file of ['survival.html', 'store.html']) {
    const html = read(file);
    assert.ok(html.includes('25.000'), file);
    assert.ok(html.includes('Türkiye saati 00:00'), file);
  }
  assert.ok(survival.includes('/satislimiti'));
  assert.ok(survival.includes('yeniden bağlanınca sıfırlanmaz'));
});

test('homes, claim scope, manual starter and real daily quests are explained without empty commands', () => {
  assert.equal(facts.claimTool, 'GOLDEN_SHOVEL');
  assert.equal(facts.claimModes.world, 'Survival');
  assert.equal(facts.claimModes.world_nether, 'Disabled');
  assert.equal(facts.claimModes.world_the_end, 'Disabled');
  assert.equal(facts.starterDelay, -1);
  assert.ok(survival.includes('/evler'));
  assert.ok(survival.includes('Nether ve End\'de claim koruması yoktur'));
  assert.ok(survival.includes('/jobs quests'));
  assert.ok(survival.includes('Ödüller → Kitler'));
  assert.ok(!survival.includes('<code>/quests</code>'));
  assert.ok(!survival.includes('/nah sell hand'));
  assert.ok(survival.includes('/gt oyuncu'));
});

test('store does not promise unavailable shops or cosmetic-only rewards', () => {
  const store = read('store-kits.html');
  assert.ok(!store.includes('pazar dükkânı'));
  assert.ok(!store.includes('<th scope="row">Pazar dükkânı'));
  assert.ok(store.includes('Kasalar yalnızca kozmetik değildir'));
  assert.ok(!survival.includes('Java’da sağ tıkla'));
  assert.ok(survival.includes('1 fiziksel anahtar'));
});

test('world resource policy matches installed borders without promising automatic resets', () => {
  assert.equal(facts.worldPolicy.enabled, true);
  assert.equal(facts.worldPolicy['nether-radius'], 10000);
  assert.equal(facts.worldPolicy['end-radius'], 20000);
  assert.ok(survival.includes('/dunyakurallari'));
  assert.ok(survival.includes('Nether sınırı merkezden 10.000, End sınırı 20.000'));
  assert.ok(survival.includes('otomatik dünya sıfırlama yoktur'));
  assert.ok(survival.includes('en az 14 gün önce'));
});

test('new commands remain discoverable through the existing navigation search', () => {
  const routeModule = {exports: {}};
  vm.runInNewContext(read('site-map.js'), {module: routeModule, URL});
  const model = routeModule.exports;
  assert.equal(model.search('/evler')[0].href, 'survival.html#arazi');
  assert.equal(model.search('/satislimiti')[0].href, 'survival.html#ekonomi');
  assert.equal(model.search('/gt')[0].href, 'survival.html#ekonomi');
});
