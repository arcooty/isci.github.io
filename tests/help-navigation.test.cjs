const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
test('all six help pages load scoped compact navigation after shared styles',()=>{
  const css=read('help-navigation.css');
  for(const page of ['help','rules','status','punishments','appeal','application']) {
    const html=read(page+'.html');
    assert.ok(html.indexOf('help-navigation.css?v=20261002-9')>html.indexOf('polish.css?v=20261002-1'));
    assert.ok(css.includes('[data-page='+page+']'));
  }
  assert.match(css,/repeat\(6,minmax\(0,1fr\)\)/);
  assert.match(css,/repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/min-height:54px/);
  assert.match(css,/white-space:normal/);
  assert.match(css,/a\[aria-current=page\]/);
});
