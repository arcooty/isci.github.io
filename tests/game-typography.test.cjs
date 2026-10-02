const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const files=fs.readdirSync(root).filter(file=>/^(survival|skyblock|village)(-.*)?\.html$/.test(file)&&fs.readFileSync(path.join(root,file),'utf8').includes('game-guide-page'));

test('all 27 game pages load the common type scale after their existing styles',()=>{
  assert.equal(files.length,27);
  for(const file of files) {
    const html=fs.readFileSync(path.join(root,file),'utf8');
    const styles=[...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)];
    assert.equal(styles.at(-1)[1],'game-typography.css?v=20261003-1',file);
    if(file.includes('-')) {
      assert.equal((html.match(/<h1>/g)||[]).length,1,file);
      assert.match(html,/<header class="game-guide-heading"><h1>/,file);
      const toolbar=html.match(/<nav class="game-guide-toolbar[^>]*>[\s\S]*?<\/details><\/nav>/)[0];
      assert.doesNotMatch(toolbar,/<h1>/,file);
    }
  }
});

test('game typography defines shared desktop and mobile roles without changing unrelated pages',()=>{
  const css=fs.readFileSync(path.join(root,'game-typography.css'),'utf8');
  for(const value of ['--game-hub-size:52px','--game-hub-size:40px','--game-page-size:42px','--game-page-size:34px','--game-intro-size:15px','--game-intro-size:14px']) assert.ok(css.includes(value),value);
  assert.match(css,/\.topic-card strong\s*\{\s*font:700 18px\/1\.4 Inter,sans-serif/);
  assert.match(css,/\.game-guide-content > \.game-section:first-child/);
  assert.match(css,/height:60px/);
  for(const file of ['index.html','help.html','store.html']) assert.ok(!fs.readFileSync(path.join(root,file),'utf8').includes('game-typography.css'),file);
});
