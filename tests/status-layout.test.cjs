const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('status page uses compact service rows and preserves every live target',()=>{
  const html=read('status.html');
  assert.ok(!html.includes('class="info-grid"'));
  assert.ok(!html.includes('class="info-card"'));
  assert.equal((html.match(/class="status-service"/g)||[]).length,5);
  for(const id of ['network-state','player-state','lobby-state','survival-state','event-state','map-state','status-time']) {
    assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  }
  assert.ok(html.includes('data-client-range="java"'));
  assert.ok(html.includes('data-client-range="bedrock"'));
  assert.ok(html.includes('Canlı durum değil, erişim koşulu.'));
  assert.ok(read('status-layout.css').includes('@media(max-width:500px)'));
  assert.ok(!html.includes('network-dot'));
  const summary=html.match(/<section class="status-summary"[\s\S]*?<\/section>/)[0];
  assert.ok(!summary.includes('href="join.html"'));
});
test('homepage actions use real links with the shared button style',()=>{
  const html=read('index.html');
  assert.ok(html.includes('class="status-detail craft-button primary"'));
  assert.ok(html.includes('class="craft-button primary" href="servers.html">Tüm oyunları gör'));
  assert.ok(html.includes('class="craft-button primary" href="join.html">Bağlantı bilgileri'));
});
