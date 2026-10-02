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
