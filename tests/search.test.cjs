const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const routeModule = {exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'site-map.js'),'utf8'),{module:routeModule,URL});
const model = routeModule.exports;
test('search normalizes Turkish letters and ASCII spellings',()=>{
  assert.equal(model.search('GİZLİLİK')[0].href,'privacy.html');
  assert.equal(model.search('gizlilik')[0].href,'privacy.html');
  assert.equal(model.search('ceza itirazı')[0].href,'appeal.html');
  assert.equal(model.search('ceza itirazi')[0].href,'appeal.html');
});
test('command search opens the relevant topic or subsection',()=>{
  assert.equal(model.search('vip')[0].href,'store.html#paketler');
  assert.equal(model.search('komut')[0].href,'survival.html#komutlar');
  assert.equal(model.search('/sethome')[0].href,'survival.html#arazi');
  assert.equal(model.search('jobs stats')[0].href,'survival.html#jobs-komutlar');
  assert.equal(model.search('VIP kit')[0].href,'store.html#kitler');
  assert.equal(model.search('kasa oran')[0].href,'survival.html#crate-odds');
});
test('platform-specific searches open the correct connection panel',()=>{
  assert.equal(model.search('bedrock')[0].href,'join.html#join-bedrock');
  assert.equal(model.search('mobil')[0].href,'join.html#join-bedrock');
  assert.equal(model.search('java')[0].href,'join.html#join-java');
});
test('every search result is public, unique and targets existing content',()=>{
  const urls=new Set();
  for(const entry of model.searchEntries) {
    assert.ok(!urls.has(entry.href));urls.add(entry.href);
    const [file,id]=entry.href.split('#');
    assert.ok(!model.legacy[file]);
    assert.notEqual(file,'order.html');
    assert.ok(fs.existsSync(path.join(root,file)));
    if(id) assert.match(fs.readFileSync(path.join(root,file),'utf8'),new RegExp('id="'+id+'"'));
  }
});
test('empty search gives useful defaults; unrelated or unsafe-looking queries have no results',()=>{
  assert.ok(model.search('').length>0);
  assert.equal(model.search('   ').length,model.search('').length);
  assert.equal(model.search('doesnotexist123').length,0);
  assert.equal(model.search('<script>alert(1)</script>').length,0);
  assert.equal(model.search('vip',2).length,2);
});
