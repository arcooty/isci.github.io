const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
test('mobile game hub actions follow descriptions without changing desktop markup',()=>{
  const root=path.join(__dirname,'..');
  const css=fs.readFileSync(path.join(root,'game-hub-buttons.css'),'utf8');
  assert.ok(css.includes('@media(max-width:600px)'));
  assert.ok(css.includes('.hub-masthead { flex-direction:column; align-items:flex-start; gap:16px; }'));
  assert.ok(css.includes('.hub-masthead > .craft-button { margin-top:0; }'));
  assert.ok(css.includes('.village-masthead-row { display:contents; }'));
  assert.ok(css.includes('.village-masthead > p { grid-row:3; }'));
  assert.ok(css.includes('.village-masthead-row > .craft-button { grid-row:4; justify-self:start; margin-top:16px; }'));
  for(const page of ['survival','village','skyblock']) assert.ok(fs.readFileSync(path.join(root,page+'.html'),'utf8').includes('game-hub-buttons.css?v=20261002-2'));
});
