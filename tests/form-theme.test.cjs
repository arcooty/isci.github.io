const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const script=fs.readFileSync(path.join(__dirname,'..','form-logic.js'),'utf8');
async function boot(theme='dark',enabled=true) {
  const documentEvents={},windowEvents={},renders=[],removed=[],scripts=[];
  const button={innerHTML:'Gönder',disabled:false,type:'submit'};
  const widget={hidden:false};
  const status={};
  const form={dataset:{formType:'application'},querySelector:selector=>selector.includes('button')?button:selector.includes('widget')?widget:status,addEventListener(){},reset(){throw new Error('Theme change must not clear form fields');}};
  const window={ARCADE_THEME:{get:()=>theme},addEventListener:(name,listener)=>windowEvents[name]=listener,turnstile:{render:(node,options)=>{renders.push({node,options});return 'widget-'+renders.length;},remove:id=>removed.push(id)}};
  const document={querySelector:()=>form,addEventListener:(name,listener)=>documentEvents[name]=listener,createElement:()=>({}),head:{append:node=>scripts.push(node)}};
  vm.runInNewContext(script,{window,document,fetch:async()=>({ok:true,json:async()=>({enabled,siteKey:'test-public-key'})})});
  await documentEvents.DOMContentLoaded();
  if(scripts[0]) scripts[0].onload();
  return {renders,removed,button,widget,status,change:next=>{theme=next;windowEvents['arcade-theme-change']?.();}};
}
test('security widget initially uses the saved site theme and a responsive width',async()=>{
  for(const theme of ['dark','light']) {
    const page=await boot(theme);
    assert.equal(page.renders[0].options.theme,theme);
    assert.equal(page.renders[0].options.size,'flexible');
    assert.equal(page.renders[0].options.action,'application');
    assert.equal(page.button.disabled,false);
  }
});
test('theme switches replace only the security widget, preserving form fields',async()=>{
  const page=await boot();
  page.change('light');
  assert.deepEqual(page.removed,['widget-1']);
  assert.equal(page.renders[1].options.theme,'light');
  page.change('dark');
  assert.deepEqual(page.removed,['widget-1','widget-2']);
  assert.equal(page.renders[2].options.theme,'dark');
});
test('disabled web forms keep their Discord fallback when the theme changes',async()=>{
  const page=await boot('dark',false);
  page.change('light');
  assert.equal(page.renders.length,0);
  assert.equal(page.widget.hidden,true);
  assert.equal(page.button.type,'button');
  assert.equal(page.button.textContent,"Discord'da Devam Et");
});
test('theme changes never replace a verification while the form is submitting',async()=>{
  const page=await boot();
  page.button.disabled=true;
  page.change('light');
  assert.equal(page.renders.length,1);
  assert.equal(page.removed.length,0);
  page.button.disabled=false;
  page.change('light');
  assert.equal(page.renders[1].options.theme,'light');
  page.change('light');
  assert.equal(page.renders.length,2);
});
