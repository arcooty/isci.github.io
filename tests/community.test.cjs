const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const route = {exports:{}};
vm.runInNewContext(read('site-map.js'),{module:route,URL});

test('three community pages have consistent compact navigation and unique selection',()=>{
  for(const file of ['community.html','news.html','staff.html']) {
    const html=read(file);
    const nav=html.match(/<nav class="chunky-nav community-navigation"[\s\S]*?<\/nav>/)[0];
    assert.equal([...nav.matchAll(/<a /g)].length,3);
    assert.equal([...nav.matchAll(/aria-current="page"/g)].length,1);
    assert.ok(nav.includes('href="'+file+'" aria-current="page"'));
    assert.ok(html.includes('community-layout.css?v=20261002-8'));
    assert.ok(read('sitemap.xml').includes('/'+file));
  }
});
test('community information and news have separate owners without losing old bookmarks',()=>{
  assert.match(read('community.html'), /id="hakkimizda"/);
  assert.doesNotMatch(read('community.html'), /class="news-journal"/);
  assert.match(read('news.html'), /<h1>Haberler<\/h1>/);
  assert.equal([...read('news.html').matchAll(/<article>/g)].length,8);
  assert.doesNotMatch(read('news.html'), /id="hakkimizda"/);
  assert.equal(route.exports.resolveHref('news.html?from=discord#hakkimizda'),'community.html?from=discord#hakkimizda');
  assert.equal(route.exports.resolveHref('about.html'),'community.html#hakkimizda');
  assert.match(read('staff.html'), /id="staff-list"/);
});

test('community overview does not contain a game-specific event promotion',()=>{
  const html=read('community.html');
  assert.doesNotMatch(html, /class="guide-feature"/);
  assert.doesNotMatch(html, /Bir sonraki köy gecesi|etkinlik saatleri kesinleştiğinde/);
  assert.match(html, /class="community-discord"/);
  assert.match(html, /id="hakkimizda"/);
});
