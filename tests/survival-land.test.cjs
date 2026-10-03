const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('land guide separates home and claim commands into two accessible tables',()=>{
  const article=read('survival.html').match(/<article id="arazi"[\s\S]*?<\/article>/)[0];
  const tables=[...article.matchAll(/<table class="pg-table pg-command-table"[^>]*>([\s\S]*?)<\/table>/g)].map(match=>match[1]);
  assert.equal(tables.length,2);
  assert.match(tables[0],/Ev komutları/);
  assert.match(tables[1],/Claim komutları/);
  assert.equal((tables[0].match(/scope="row"/g)||[]).length,4);
  assert.equal((tables[1].match(/scope="row"/g)||[]).length,6);
  for(const table of tables) assert.equal((table.match(/scope="col"/g)||[]).length,2);
  for(const command of ['/evler','/sethome ev','/home ev','/delhome ev','/claimslist','/trust oyuncu','/containertrust oyuncu','/accesstrust oyuncu','/untrust oyuncu','/abandonclaim','/dunyakurallari']) {
    assert.equal(article.split('<code>'+command+'</code>').length-1,1,command);
  }
  assert.ok(article.includes('Ev noktası koruma sağlamaz.'));
  assert.match(article, /<th scope="row">Nether<\/th><td>Yok · PvP açık<\/td><td>Merkezden 10\.000 blok<\/td>/);
  const world=article.slice(article.indexOf('<h2>Dünyalar ve koruma kuralları</h2>'));
  assert.ok(world.includes('/dunyakurallari'));
  assert.ok(world.includes('en az 14 gün önce'));
});

test('land command tables stack below tablet width and retain compatible copy containers',()=>{
  const css=read('guide-content.css');
  assert.ok(css.includes('.pg-two-tables { display:grid;'));
  assert.ok(css.includes('@media(max-width:850px)'));
  assert.ok(css.includes('.pg-two-tables { grid-template-columns:1fr;'));
  assert.ok(css.includes('.pg-command-table .command { padding:0;'));
  assert.ok(read('survival.html').includes('guide-content.css?v=20261003-2'));
});
