const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {test}=require('node:test');
const root=path.join(__dirname,'..');
const window={};
vm.runInNewContext(fs.readFileSync(path.join(root,'server-data.js'),'utf8'),{window});
const ranges=window.ARCADECRAFT.compatibility;
test('published ranges reflect the installed server compatibility versions',()=>{
  assert.equal(ranges.java.min,'1.9');
  assert.equal(ranges.java.max,'26.2');
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
    for(const edition of ['java','bedrock']) {
      assert.ok(source.includes('data-client-range="'+edition+'"'),file);
      assert.ok(source.includes(ranges[edition].min+' - '+ranges[edition].max),file);
    }
  }
});
test('game dropdown has three equally aligned text-only destinations',()=>{
  const shell=fs.readFileSync(path.join(root,'site-shell.js'),'utf8');
  const dropdown=shell.split('id="games-dropdown">')[1].split('</div></div>')[0];
  assert.equal((dropdown.match(/link\(/g)||[]).length,3);
  assert.ok(!dropdown.includes('icon('));
  assert.ok(dropdown.includes('survival.html') && dropdown.includes('village.html') && dropdown.includes('servers.html'));
});
