const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('home and Survival use factual headings instead of promotional slogans', () => {
  const home = read('index.html');
  const survival = read('survival.html');
  assert.match(home, /<h2 id="community-title">Discord<\/h2>/);
  assert.match(home, /<h2>VIP Paketleri<\/h2>/);
  assert.match(survival, /<h2 id="overview-title">Survival özellikleri<\/h2>/);
  for (const html of [home, survival, read('servers.html'), read('store.html')]) {
    assert.doesNotMatch(html, /class="(?:eyebrow|game-category)"/);
    assert.doesNotMatch(html, /Biraz daha alan|Biraz daha sen|Bir evden çok daha fazlası|Oyunun dışında da buluşalım|Kendi hızında/);
  }
});

test('removing decorative labels preserves access and VIP limitations', () => {
  assert.match(read('index.html'), /Sınırlı test erişiminde/);
  assert.match(read('skyblock.html'), /beyaz listeli test erişiminde/);
  assert.match(read('store.html'), /tablosu Survival’a aittir/);
  assert.match(read('index.html'), /Para veya meslek kazancı çarpanı verilmez/);
});

test('home preloads and displays the user-selected lobby screenshot', () => {
  const home = read('index.html');
  assert.match(home, /<link rel="preload" href="assets\/hub-gameplay\.png" as="image">/);
  assert.match(home, /class="craft-hero-image" src="assets\/hub-gameplay\.png"/);
  assert.ok(fs.existsSync(path.join(root, 'assets/hub-gameplay.png')));
});
