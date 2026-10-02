const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const groups = [
  ['survival-crates.html', 'survival-crates-rewards.html', 'survival-crates-keys.html'],
  ['survival-commands.html', 'survival-commands-progress.html', 'survival-commands-vip.html']
];
test('crate and command pages keep compact navigation with one selected topic', () => {
  for (const group of groups) for (const file of group) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.ok(html.includes('<h1>Survival</h1>'), file);
    assert.ok(html.includes('class="game-guide-next"'), file);
    assert.ok(html.includes("Survival'a dön</a>"), file);
    if (file.startsWith('survival-crates')) assert.ok(html.includes('href="survival-commands.html">Sonraki konu: Komutlar'), file);
    else assert.ok(!html.includes('Sonraki konu:'), file);
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1, file);
    for (const sibling of group) assert.ok(html.includes('href="'+sibling+'"'), file);
    assert.ok(html.includes('survival-jobs.css?v=20261002-16'), file);
    assert.ok(!html.includes('command-copy'), file+' must let the shell create working copy buttons');
    assert.ok(fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8').includes('/'+file));
  }
});
test('command sections retain their complete original command counts', () => {
  for (const [file, count] of [['survival-commands.html',7], ['survival-commands-progress.html',7], ['survival-commands-vip.html',4]]) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.equal((html.match(/class="command"/g) || []).length, count, file);
  }
});
