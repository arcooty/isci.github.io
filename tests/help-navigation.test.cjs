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
    assert.ok(html.indexOf('help-navigation.css?v=20261002-9')>html.indexOf('polish.css?v=20261002-27'));
    assert.ok(css.includes('[data-page='+page+']'));
  }
  assert.match(css,/repeat\(6,minmax\(0,1fr\)\)/);
  assert.match(css,/repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/min-height:54px/);
  assert.match(css,/white-space:normal/);
  assert.match(css,/a\[aria-current=page\]/);
});
test('support content does not repeat destinations already in the section menu',()=>{
  const html=read('help.html');
  const list=html.match(/<section class="support-actions"[\s\S]*?<\/section>/)[0];
  assert.equal([...list.matchAll(/<a /g)].length,3);
  assert.doesNotMatch(list,/href="(?:help|rules|status|punishments|appeal|application)\.html"/);
  assert.match(list,/href="join\.html"/);
  assert.match(list,/href="store-delivery\.html"/);
  assert.equal([...html.matchAll(/<details>/g)].length,4);
});

test('rules retain every topic and bookmark without a redundant local navigation strip',()=>{
  const html=read('rules.html');
  assert.doesNotMatch(html, /class="page-index"|aria-label="Kural konuları"/);
  for(const id of ['sohbet','oyun','hesap']) assert.match(html,new RegExp('<section id="'+id+'"'));
  assert.equal([...html.matchAll(/<li>/g)].length,11);
});
