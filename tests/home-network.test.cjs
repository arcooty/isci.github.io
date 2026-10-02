const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('homepage replaces Survival-only features with shared player resources', () => {
  const html = read('index.html');
  const section = html.match(/<section class="player-hub-band"[\s\S]*?<\/section>/)[0];
  assert.match(section, /id="features"/);
  assert.match(section, /id="server-features"/);
  assert.match(section, /aria-labelledby="player-hub-title"/);
  assert.match(section, /<h2 id="player-hub-title">Oyuncu merkezi<\/h2>/);
  assert.equal([...section.matchAll(/<a /g)].length, 3);
  for (const target of ['join.html', 'rules.html', 'help.html']) {
    assert.match(section, new RegExp('href="' + target.replace('.', '\\.') + '"'));
    assert.ok(fs.existsSync(path.join(root, target)));
  }
  assert.doesNotMatch(section, /href="(?:survival|skyblock|village)/);
  assert.doesNotMatch(html, /Survival özellikleri|survival-discovery/);
  for (const game of ['survival', 'skyblock', 'village']) assert.match(html, new RegExp('href="' + game + '\\.html"'));
});

test('shared resources have theme-aware responsive layout and keyboard focus', () => {
  const css = read('home-network.css');
  assert.match(read('index.html'), /home-network\.css\?v=20261002-12/);
  assert.match(css, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /grid-template-columns:1fr/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /color:var\(--quiet\)/);
  assert.doesNotMatch(css, /gradient|\bvw\b/);
});
