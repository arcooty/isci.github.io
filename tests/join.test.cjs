const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {test} = require('node:test');
function harness(hash='') {
  const events={};const panels={'join-java':{},'join-bedrock':{}};
  const tabs=Object.keys(panels).map(id=>({attrs:{'aria-controls':id},events:{},getAttribute(key){return this.attrs[key];},setAttribute(key,value){this.attrs[key]=value;},addEventListener(type,handler){this.events[type]=handler;},focus(){this.focused=true;}}));
  const location={hash}; const history={pushes:0,pushState(_state,_title,value){this.pushes++;location.hash=value;},replaceState(_state,_title,value){location.hash=value;}};
  const document={querySelectorAll:()=>tabs,getElementById:id=>panels[id]};
  const window={addEventListener:(type,handler)=>events[type]=handler};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../join.js'),'utf8'),{document,window,history,location});
  return {events,tabs,panels,location,history};
}
test('Bedrock deep links and unknown hashes select the correct initial panel',()=>{
  const h=harness('#join-bedrock');
  assert.equal(h.panels['join-bedrock'].hidden,false);
  assert.equal(h.panels['join-java'].hidden,true);
  assert.equal(h.tabs[1].attrs['aria-selected'],'true');
  assert.equal(harness('#unknown').panels['join-java'].hidden,false);
});
test('clicks, refresh and browser history retain the selected platform without duplicate entries',()=>{
  const h=harness();h.tabs[1].events.click();h.tabs[1].events.click();
  assert.equal(h.history.pushes,1);assert.equal(h.location.hash,'#join-bedrock');
  h.location.hash='#join-java';h.events.popstate();
  assert.equal(h.panels['join-java'].hidden,false);
  h.location.hash='#join-bedrock';h.events.hashchange();
  assert.equal(h.panels['join-bedrock'].hidden,false);
});
test('arrow navigation updates the bookmark and keeps roving focus',()=>{
  const h=harness();let prevented=false;
  h.tabs[0].events.keydown({key:'ArrowRight',preventDefault:()=>{prevented=true;}});
  assert.equal(prevented,true);assert.equal(h.tabs[1].focused,true);
  assert.equal(h.location.hash,'#join-bedrock');assert.equal(h.tabs[0].tabIndex,-1);
});
