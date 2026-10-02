const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const root = path.join(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const routeModule = {exports:{}};
vm.runInNewContext(read('site-map.js'),{module:routeModule,URL});
const model = routeModule.exports;

test('all split game guides have canonical pages, topic navigation and shared styles',()=>{
  for (const [game,pages] of Object.entries(model.gameGuides)) for (const [file,label] of pages) {
    const html=read(file);
    assert.ok(html.includes('https://robsarcade.online/'+file),file+' canonical');
    const heading = 'h1';
    if(['village-play.html','village-win.html','village-faq.html'].includes(file)) {
      assert.match(html, /<header class="game-guide-heading"><h1>/);
    } else assert.match(html,new RegExp('<'+heading+'[^>]*>'+label+'</'+heading+'>'),file+' title');
    assert.ok(html.includes('class="game-guide-toolbar"'),file+' navigation');
    assert.ok(html.includes('game-guides.css?v=20261002-23'),file+' styles');
    assert.ok(html.includes('data-game="'+game+'"'),file+' palette');
    for (const [destination] of pages) assert.ok(html.includes('href="'+destination+'"'),file+' category '+destination);
    assert.ok(read('sitemap.xml').includes('/'+file),file+' sitemap');
  }
});

test('legacy game bookmarks retain their topic and query without redirect loops',()=>{
  for (const [hub,routes] of Object.entries(model.gameRoutes)) for (const [hash,destination] of Object.entries(routes)) {
    const result=model.resolveHref(hub+'?from=discord#'+hash);
    const url=new URL(result,'https://robsarcade.online/');
    assert.equal(url.search,'?from=discord');
    assert.equal(url.pathname.slice(1),destination.split('#')[0]);
    assert.ok(read(url.pathname.slice(1)).includes('id="'+url.hash.slice(1)+'"'),result);
    assert.equal(model.resolveHref(result),result);
  }
  assert.equal(model.resolveHref('village.html#rol-doktor'),'village-roles.html#rol-doktor');
  assert.equal(model.resolveHref('skyblock.html#unknown'),'skyblock.html#unknown');
});

test('the Skyblock overview is a category hub, not the previous long guide',()=>{
  const html=read('skyblock.html');
  assert.equal((html.match(/class="topic-card"/g)||[]).length,model.gameGuides.skyblock.length-1);
  assert.ok(html.includes('class="sky-action" href="skyblock-leaderboard.html"'));
  assert.ok(!html.includes('class="skyblock-section"'));
  for (const [file] of model.gameGuides.skyblock) assert.ok(html.includes('href="'+file+'"'));
});

test('the hub redirects known fragments and category menus support Escape',()=>{
  let replacement;
  let keydown;
  let focused=false;
  const menu={open:true,addEventListener:(type,handler)=>{if(type==='keydown')keydown=handler;},querySelector:()=>({focus:()=>focused=true}),contains:()=>false};
  const document={body:{dataset:{gameHub:'skyblock'}},querySelectorAll:()=>[menu],addEventListener:()=>{}};
  const location={pathname:'/skyblock.html',search:'?ref=test',hash:'#ada',replace:value=>replacement=value};
  const window={ARCADE_SITE:model,addEventListener:()=>{}};
  vm.runInNewContext(read('game-guide.js'),{document,location,window});
  assert.equal(replacement,'skyblock-island.html?ref=test#island');
  let prevented=false;
  keydown({key:'Escape',preventDefault:()=>prevented=true});
  assert.equal(menu.open,false); assert.ok(focused); assert.ok(prevented);
});
