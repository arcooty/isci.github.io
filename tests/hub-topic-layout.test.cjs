const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('all three game hubs opt into shared topic text spacing and inherited caption colors',()=>{
  for(const page of ['survival','skyblock','village']) {
    const html=fs.readFileSync(path.join(__dirname,'../'+page+'.html'),'utf8');
    assert.match(html,/<body[^>]*class="[^"]*game-guide-page/,page);
    assert.ok(html.includes('<small>Görüntüle '),page);
  }
  const css=fs.readFileSync(path.join(__dirname,'../game-guides.css'),'utf8');
  assert.ok(css.includes('.topic-card small { display:block; margin-top:12px; color:inherit; font-size:12px; }'));
});
