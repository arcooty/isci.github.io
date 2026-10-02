const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('jobs subsections are separate pages with shared compact navigation',()=>{
  const pages=['survival-jobs.html','survival-jobs-progress.html','survival-jobs-commands.html'];
  for(const file of pages) {
    const html=read(file);
    assert.match(html,/<h1>Survival<\/h1>/);
    assert.match(html,/<nav class="game-guide-next" aria-label="Rehber gezinmesi">/);
    assert.ok(html.includes('Bütün konular</a>'));
    assert.ok(html.includes('href="survival.html#gorevler">Görevler ve beceriler'));
    assert.ok(html.includes('game-guide-toolbar survival-topic-toolbar'));
    assert.match(html,/survival-jobs\.css\?v=20261002-16/);
    const nav=html.match(/<nav class="chunky-nav "[\s\S]*?<\/nav>/)[0];
    assert.equal([...nav.matchAll(/aria-current="page"/g)].length,1);
    for(const page of pages) assert.ok(nav.includes('href="'+page+'"'));
  }
  assert.equal([...read(pages[0]).matchAll(/class="info-card"/g)].length,12);
  assert.doesNotMatch(read(pages[1]),/id="jobs-meslekler"|id="jobs-komutlar"/);
  assert.equal([...read(pages[2]).matchAll(/class="command"/g)].length,6);
  assert.doesNotMatch(read(pages[2]),/class="command-copy"/);
});
