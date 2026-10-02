const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
test('rules suppress only the first section divider',()=>{
  assert.ok(read('help-navigation.css').includes('[data-page=rules] .rules-list>section:first-child { border-top:0; }'));
});
test('updates align to the right and footer legal links have visible current state',()=>{
  assert.ok(read('home-network.css').includes('.community-editorial { justify-items:end; text-align:right; }'));
  assert.ok(read('polish.css').includes('.footer-bottom a[aria-current=page] { color:var(--accent);'));
  assert.ok(read('polish.css').includes('.footer-bottom a[aria-current=page] { color:var(--accent); font-weight:700; text-decoration:none; }'));
  for(const page of ['privacy','terms','sitemap']) {
    const footer=read(page+'.html').split('class="footer-bottom"')[1];
    assert.ok(footer.includes('href="'+page+'.html" aria-current="page"'),page);
  }
});
test('mobile status design four uses compact rows and a full-width action',()=>{
  const css=read('home-status.css');
  assert.ok(css.includes('@media(max-width:900px)'));
  assert.ok(css.includes('grid-template-columns:minmax(0,1fr) auto; grid-template-rows:auto;'));
  assert.ok(css.includes('width:100%; justify-self:stretch; background:#ffd573;'));
});
test('tablet homepage uses a compact hero without hiding its heading',()=>{
  const css=read('home-network.css');
  assert.ok(css.includes('@media(min-width:601px) and (max-width:900px)'));
  assert.ok(css.includes('height:560px; min-height:500px; max-height:600px;'));
});
test('mobile community blocks center and footer tracks can shrink',()=>{
  assert.ok(read('home-network.css').includes(':is(.community-invitation,.community-editorial) { justify-items:center; text-align:center; }'));
  assert.ok(read('home-network.css').includes('.craft-button { justify-self:center; }'));
  assert.ok(read('polish.css').includes('grid-template-columns:minmax(0,1fr); padding:32px 22px 24px;'));
  assert.ok(read('polish.css').includes('.footer-bottom>*) { min-width:0; max-width:100%; overflow-wrap:anywhere; }'));
  assert.ok(read('polish.css').includes('flex-direction:column; flex-wrap:nowrap;'));
  assert.ok(read('polish.css').includes('.footer-bottom>span:last-child { flex-basis:auto; width:100%; }'));
  assert.ok(read('home-network.css').includes('.games-section .section-heading>.craft-button { justify-self:end; }'));
  assert.ok(read('home-network.css').includes('grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:12px;'));
});
