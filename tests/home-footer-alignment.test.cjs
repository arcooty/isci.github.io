const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
test('updates align to the right and footer legal links have visible current state',()=>{
  assert.ok(read('home-network.css').includes('.community-editorial { justify-items:end; text-align:right; }'));
  assert.ok(read('polish.css').includes('.footer-bottom a[aria-current=page] { color:var(--accent);'));
  assert.ok(read('polish.css').includes('.footer-bottom a[aria-current=page] { color:var(--accent); font-weight:700; text-decoration:none; }'));
  for(const page of ['privacy','terms','sitemap']) {
    const footer=read(page+'.html').split('class="footer-bottom"')[1];
    assert.ok(footer.includes('href="'+page+'.html" aria-current="page"'),page);
  }
});
