const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {test}=require('node:test');
const root=path.join(__dirname,'..');
const window={};
vm.runInNewContext(fs.readFileSync(path.join(root,'server-data.js'),'utf8'),{window});
const ranges=window.ARCADECRAFT.compatibility;
test('published ranges reflect the deployed 26.3 fix without changing the backend version',()=>{
  assert.equal(ranges.java.min,'1.9');
  assert.equal(ranges.java.max,'26.3');
  assert.equal(ranges.java.recommended,'26.3');
  assert.equal(ranges.java.notice,'');
  assert.equal(ranges.java.verifiedAt,'2026-09-30');
  assert.equal(window.ARCADECRAFT.version,'26.2');
  assert.equal(ranges.bedrock.min,'26.30');
  assert.equal(ranges.bedrock.max,'26.51');
  assert.equal(ranges.bedrock.versions[0],ranges.bedrock.min);
  assert.equal(ranges.bedrock.versions.at(-1),ranges.bedrock.max);
  assert.ok(ranges.bedrock.versions.includes('26.45'));
  assert.ok(Object.isFrozen(ranges.bedrock.versions));
});
test('status card, connection help and status page share one version source',()=>{
  for(const file of ['index.html','join.html','status.html']) {
    const source=fs.readFileSync(path.join(root,file),'utf8');
    assert.ok(source.indexOf('server-data.js')<source.indexOf('site-shell.js'),file);
    assert.ok(source.includes('data-client-notice="java"'),file);
    assert.ok(source.includes('data-client-notice="java" hidden></p>'),file);
    assert.ok(!source.includes('Şimdilik 26.2'),file);
    for(const edition of ['java','bedrock']) {
      assert.ok(source.includes('data-client-range="'+edition+'"'),file);
      assert.ok(source.includes(ranges[edition].min+' - '+ranges[edition].max),file);
    }
  }
});
test('Games navigation links directly to the all-games page without dropdown behavior',()=>{
  const shell=fs.readFileSync(path.join(root,'site-shell.js'),'utf8');
  assert.ok(shell.includes("link('servers.html','Oyunlar')"));
  assert.ok(!shell.includes('games-dropdown'));
  assert.ok(!shell.includes('gameButton.addEventListener'));
});
