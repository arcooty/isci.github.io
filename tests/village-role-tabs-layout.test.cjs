const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('role team buttons share a compact equal-width layout at desktop and mobile sizes',()=>{
  const css=read('village-navigation.css');
  assert.ok(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'));
  assert.ok(css.includes('gap:8px; width:100%; max-width:640px'));
  assert.ok(css.includes('height:70px; min-height:70px'));
  assert.ok(css.includes('height:64px; min-height:64px'));
  assert.ok(css.includes('align-items:center; justify-content:center; gap:4px'));
  assert.ok(css.includes('.village-team-tabs a[aria-selected=true]'));
});

test('Skyblock start no longer duplicates the connection guide disclosure',()=>{
  const html=read('skyblock-start.html');
  assert.ok(!html.includes('Sürüm ve bağlantı bilgileri'));
  assert.ok(html.includes('Survival bakiyen bu dünyaya taşınmaz'));
});
