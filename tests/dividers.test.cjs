const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
test('heading separators suppress only redundant leading content borders',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../polish.css'),'utf8');
  assert.match(css,/\.game-guide-heading\+:is\(\.about-band,\.comparison-wrap,\.skyblock-access\)/);
  assert.match(css,/\.game-guide-heading\+\.about-section>\.comparison-wrap:first-child/);
  assert.match(css,/\.page-head\+\.page-index/);
  assert.match(css,/\.page-head\+form\[data-form-type\] \{ border-top:0!important; \}/);
});
test('command sections do not add another line beneath their final command',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../polish.css'),'utf8');
  assert.match(css,/\.game-guide-content>section:has\(>\.command:last-child,>\.command-list:last-child\)\s*\{\s*border-bottom:0;/);
});
