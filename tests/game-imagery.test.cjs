const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const root = path.join(__dirname,'..');

test('village posters and cover use the real gameplay screenshot', () => {
  for (const page of ['index.html','servers.html','village.html']) {
    const html = fs.readFileSync(path.join(root,page),'utf8');
    assert.match(html,/<img src="assets\/robs-village-gameplay\.webp"[^>]*width="1536" height="960"/);
    assert.doesNotMatch(html,/mode-event-v1\.webp/);
  }
  assert.ok(fs.existsSync(path.join(root,'assets/robs-village-gameplay.webp')));
});

test('village cover has a wide desktop crop and an accurate caption', () => {
  const html = fs.readFileSync(path.join(root,'village.html'),'utf8');
  assert.match(html,/<source media="\(min-width:681px\)" srcset="assets\/robs-village-gameplay-wide\.webp" width="1920" height="620">/);
  assert.match(html,/<figcaption>Rob's Village · Oyun içinden<\/figcaption>/);
  assert.doesNotMatch(html,/temsili/i);
  assert.ok(fs.existsSync(path.join(root,'assets/robs-village-gameplay-wide.webp')));
});
