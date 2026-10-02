const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('help FAQ keeps native accessible disclosure and all four answers',()=>{
  const html=fs.readFileSync(path.join(__dirname,'../help.html'),'utf8');
  assert.equal((html.match(/<details>/g)||[]).length,4);
  assert.equal((html.match(/<summary>/g)||[]).length,4);
  assert.ok(html.includes('Kart numarası, parola'));
  const css=fs.readFileSync(path.join(__dirname,'../polish.css'),'utf8');
  assert.ok(css.includes('.faq-list summary:focus-visible'));
  assert.ok(css.includes('.faq-list details[open] summary::after'));
  assert.ok(css.includes('.footer-bottom>div { margin-left:0;'));
  assert.ok(css.includes('.site-footer-inner section:last-child { grid-column:1/-1; }'));
});

test('Village FAQ shares the help disclosure styling without the retired event section',()=>{
  const html=fs.readFileSync(path.join(__dirname,'../village-faq.html'),'utf8');
  const list=html.match(/<div class="faq-list">([\s\S]*?)<\/div>/)[1];
  assert.equal((list.match(/<details>/g)||[]).length,6);
  assert.equal((list.match(/<summary>/g)||[]).length,6);
  assert.ok(!html.includes('Etkinlik saatleri'));
  assert.ok(html.includes('polish.css?v=20261003-1'));
  const css=fs.readFileSync(path.join(__dirname,'../polish.css'),'utf8');
  const rules=css.split('\n').filter(line=>line.includes('.faq-list')&&line.includes('[data-page=help]'));
  assert.equal(rules.length,9);
  assert.ok(rules.every(rule=>rule.includes('[data-page=village-faq]')));
});
