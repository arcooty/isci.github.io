const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function harness(reduced=false) {
  const element=()=>({textContent:'',attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this.events[k]=v;},animate(){this.animations=(this.animations||0)+1;}});
  const copy=element(),toggle=element(),address=element(),caption=element(),feedback=element(),copyIcon=element(),platformIcon=element();
  copy.querySelector=()=>copyIcon;toggle.querySelector=()=>platformIcon;
  const copied=[];
  const document={querySelector:s=>s==='[data-hero-copy]'?copy:s==='.hero-platform-toggle'?toggle:feedback,getElementById:s=>s==='hero-address'?address:caption};
  vm.runInNewContext(read('home-connection.js'),{document,window:{matchMedia:()=>({matches:reduced})},navigator:{clipboard:{writeText:async text=>copied.push(text)}},clearTimeout(){},setTimeout(){return 1;}});
  return {copy,toggle,address,caption,feedback,copyIcon,platformIcon,copied};
}
test('hero switches addresses, destination icons and Bedrock port without changing layout',()=>{
  const h=harness();
  assert.equal(h.address.textContent,'oyna.robsarcade.online');
  assert.equal(h.toggle.attrs['aria-label'],'Bedrock adresini göster');
  h.toggle.events.click();
  assert.equal(h.address.textContent,'bedrock.robsarcade.online');
  assert.ok(h.caption.textContent.includes('6426'));
  assert.equal(h.platformIcon.className,'fa-solid fa-desktop');
  assert.equal(h.toggle.attrs['aria-pressed'],'true');
  assert.equal(h.address.animations,1);
  h.toggle.events.click();
  assert.equal(h.address.textContent,'oyna.robsarcade.online');
  assert.equal(h.platformIcon.className,'fa-solid fa-mobile-screen-button');
});
test('copy uses the visible platform and does not restore an outdated address after switching',async()=>{
  const h=harness();
  h.toggle.events.click();
  await h.copy.events.click();
  assert.deepEqual(h.copied,['bedrock.robsarcade.online']);
  assert.equal(h.copyIcon.className,'fa-solid fa-check');
  const pending=h.copy.events.click();
  h.toggle.events.click();
  await pending;
  assert.equal(h.address.textContent,'oyna.robsarcade.online');
  assert.equal(h.copyIcon.className,'fa-regular fa-copy');
});
test('reduced motion skips animations and the hero copy control has only one owner',()=>{
  const h=harness(true);h.toggle.events.click();
  assert.equal(h.address.animations,undefined);
  const html=read('index.html');
  assert.ok(html.includes('data-hero-copy'));
  assert.ok(!html.includes('data-copy-address'));
  assert.ok(read('home-connection.css').includes('grid-template-columns:auto 300px 46px'));
});
