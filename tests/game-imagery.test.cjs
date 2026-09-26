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

test('survival posters and overview use the real server screenshot', () => {
  for (const page of ['index.html','servers.html','survival.html']) {
    const html = fs.readFileSync(path.join(root,page),'utf8');
    assert.match(html,/<img src="assets\/survival-gameplay\.webp"[^>]*width="1504" height="940"/);
    assert.doesNotMatch(html,/mode-survival-v1\.webp/);
  }
  assert.ok(fs.existsSync(path.join(root,'assets/survival-gameplay.webp')));
});

test('survival sharing previews also use real gameplay', () => {
  for (const page of ['index.html','survival.html']) {
    const html = fs.readFileSync(path.join(root,page),'utf8');
    assert.match(html,/<meta property="og:image" content="https:\/\/robsarcade\.online\/assets\/survival-gameplay\.webp">/);
  }
  assert.doesNotMatch(fs.readFileSync(path.join(root,'survival.html'),'utf8'),/temsili/i);
});

test('survival overview image keeps a responsive height rather than its pixel height attribute', () => {
  const css = fs.readFileSync(path.join(root,'craft.css'),'utf8');
  assert.match(css,/\.survival-intro img\s*\{[^}]*height:auto;[^}]*aspect-ratio:16\/10;/);
});
