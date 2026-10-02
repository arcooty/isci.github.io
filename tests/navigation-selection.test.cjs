const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('selected section buttons use an inset pressed bevel instead of brightness filtering',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../polish.css'),'utf8');
  assert.ok(css.includes('.chunky-nav>a[aria-current=page]:hover {'));
  assert.ok(css.includes('filter:none;'));
  assert.ok(css.includes('inset 0 4px #00000040,inset 0 -1px #ffffff20,inset 0 0 0 100vmax #00000020!important'));
  assert.ok(!css.includes('filter:brightness(.88)'));
});
