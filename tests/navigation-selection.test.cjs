const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('selected section buttons stay twelve percent darker including on hover',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../polish.css'),'utf8');
  assert.ok(css.includes('.chunky-nav>a[aria-current=page] { filter:brightness(.88); }'));
  assert.ok(css.includes('.chunky-nav>a[aria-current=page]:hover { filter:brightness(.88); }'));
});
