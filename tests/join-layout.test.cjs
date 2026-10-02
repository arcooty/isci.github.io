const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('connection page retains accessible platform selection and distinct copy addresses',()=>{
  const html=read('join.html');
  assert.ok(html.includes('join-layout.css?v=20261002-1'));
  for(const platform of ['java','bedrock']) {
    assert.equal((html.match(new RegExp('id="join-'+platform+'-tab"','g'))||[]).length,1);
    assert.ok(html.includes('aria-controls="join-'+platform+'"'));
    assert.ok(html.includes('role="tabpanel" aria-labelledby="join-'+platform+'-tab"'));
  }
  assert.ok(html.includes('data-copy-address="bedrock.robsarcade.online"'));
  assert.ok(html.includes('<code>6426</code>'));
  assert.ok(read('join-layout.css').includes('counter-reset:step'));
  assert.ok(read('join-layout.css').includes('@media(max-width:700px)'));
});
test('status lists both endpoints and the common shell omits redundant connection/game trails',()=>{
  const html=read('status.html');
  assert.ok(html.includes('<code>bedrock.robsarcade.online</code><span>Port: 6426</span>'));
  assert.ok(html.includes('<dt>Java adresi</dt>'));
  assert.ok(html.includes('<dt>Bedrock adresi</dt>'));
  assert.ok(read('site-shell.js').includes("!['index.html','survival.html','join.html','servers.html'].includes(path)"));
});
