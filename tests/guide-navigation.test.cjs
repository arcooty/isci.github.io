const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
test('all guide footers use one final shared button stylesheet',()=>{
  let count=0;
  for(const file of fs.readdirSync(root).filter(file=>file.endsWith('.html'))) {
    const html=fs.readFileSync(path.join(root,file),'utf8');
    if(!/class="(?:guide-pagination|game-guide-next)"/.test(html)) continue;
    count++;
    const styles=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(match=>match[1]);
    assert.equal(styles.at(-1),'guide-navigation.css?v=20261002-16',file);
    assert.equal(styles.filter(style=>style.startsWith('guide-navigation.css')).length,1,file);
    const nav=html.match(/<nav class="(?:guide-pagination|game-guide-next)"[\s\S]*?<\/nav>/)[0];
    assert.ok(nav.includes('href="'),file);
    assert.ok(!nav.includes(' hidden'),file);
  }
  assert.equal(count,19);
});
test('navigation colors, sizing and hidden terminal links have one contract',()=>{
  const css=fs.readFileSync(path.join(root,'guide-navigation.css'),'utf8');
  assert.ok(css.includes(':is(.guide-pagination,.game-guide-next)>a'));
  assert.ok(css.includes('background:#83e6a3'));
  assert.ok(css.includes('background:#77ddf2'));
  assert.ok(css.includes('min-height:46px'));
  assert.ok(css.includes('>a[hidden] { display:none; }'));
});
