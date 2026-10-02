const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
test('game hubs and every guide select the Games menu before scripts run',()=>{
  let games=0;
  for(const file of fs.readdirSync(root).filter(file=>file.endsWith('.html'))) {
    const html=fs.readFileSync(path.join(root,file),'utf8');
    const button=html.match(/<a href="servers.html"[^>]*>Oyunlar<\/a>/)?.[0];
    if(!button) continue;
    const game=/^(?:servers|(?:survival|skyblock|village)(?:-[a-z-]+)?)\.html$/.test(file);
    assert.equal(button.includes('class="is-current"'),game,file);
    assert.equal(button.includes('aria-current="'+(file==='servers.html'?'page':'location')+'"'),game,file);
    assert.ok(!html.includes('games-dropdown'),file);
    if(game) games++;
  }
  assert.ok(games>=25);
});
test('existing static navigation receives the runtime Games selection too',()=>{
  const shell=fs.readFileSync(path.join(root,'site-shell.js'),'utf8');
  assert.ok(shell.includes("gamesLink.classList.toggle('is-current',gamePage)"));
  assert.ok(shell.includes("gamesLink.removeAttribute('aria-current')"));
});
