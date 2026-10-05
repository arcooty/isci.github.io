const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const vm=require('node:vm');
const routeModule={exports:{}};
vm.runInNewContext(read('site-map.js'),{module:routeModule,URL});
const model=routeModule.exports;
const facts=require('./fixtures/survival-journey.json');
const pages=['survival-quests.html','survival-quests-goals.html','survival-quests-daily.html'];

test('published chapter objectives, gates and rewards match the installed Survival journey',()=>{
  const story=read(pages[0]);
  const blocks=[...story.matchAll(/<details class="atlas-chapter"[^>]*data-chapter="(\d+)"[^>]*data-reward="(\d+)"[\s\S]*?<\/details>/g)];
  assert.equal(blocks.length,12);
  assert.equal(blocks.reduce((sum,b)=>sum+Number(b[2]),0),3000);
  for(const chapter of facts.chapters){
    const block=blocks.find(b=>Number(b[1])===chapter.chapter);
    assert.equal(Number(block[2]),chapter.money);
    assert.ok(block[0].includes(chapter.name));
    for(const objective of chapter.objectives)assert.ok(block[0].includes(objective),objective);
    if(chapter.job)assert.ok(block[0].includes('Meslek '+chapter.job));
    if(chapter.skill)assert.ok(block[0].includes('Beceri '+chapter.skill));
    if(chapter.biomes)assert.ok(block[0].includes(chapter.biomes+' biyom'));
    assert.ok(block[0].includes('/yolculuk bolum '+chapter.chapter));
  }
  assert.ok(story.includes('Hesap başına bir kez'));
  assert.ok(story.includes('günlük görevlerden ayrıdır'));
});

test('all six milestones preserve their actual combined requirements and cosmetic scope',()=>{
  const goals=read(pages[1]);
  const blocks=[...goals.matchAll(/<article class="atlas-milestone"[^>]*>[\s\S]*?<\/article>/g)];
  assert.equal(blocks.length,6);
  facts.milestones.forEach((m,i)=>{
    const block=blocks[i][0];
    assert.ok(block.includes('<h2>'+m.name+'</h2>'));
    assert.ok(block.includes('<dd>'+m.chapters+' / 12</dd>'));
    assert.ok(block.includes('<dt>Meslek seviyesi</dt><dd>'+m.job+'</dd>'));
    assert.ok(block.includes('<dt>Beceri seviyesi</dt><dd>'+m.skill+'</dd>'));
    assert.ok(block.includes('<dt>Farklı biyom</dt><dd>'+(m.biomes||'Şart yok')+'</dd>'));
  });
  assert.ok(goals.includes('VIP rütbesi vermez'));
  assert.ok(goals.includes('ek para ödülü yoktur'));
  assert.ok(goals.includes('20 blok yatay yürüyüş'));
  assert.ok(goals.includes('Nether ve End'));
});

test('daily and once-only rewards remain distinct across story, economy and command guides',()=>{
  const daily=read(pages[2]);
  assert.ok(daily.includes('2 görev ve toplam 600 oyun içi TL'));
  assert.ok(daily.includes("Türkiye saati 04:00"));
  assert.ok(daily.includes('hesap başına tek seferlik'));
  const commands=read('survival-commands-progress.html');
  for(const cmd of ['/yolculuk','/yolculuk bolum 1','/yolculuk durum','/gunluk'])assert.ok(commands.includes('<code>'+cmd+'</code>'));
  const survival=read('survival.html');
  assert.ok(survival.includes('id="atlas-ekonomi"'));
  assert.ok(survival.includes('class="topic-card" href="survival-quests.html"'));
  assert.doesNotMatch(survival,/Ayrı bir hikâye görev sistemi şu anda sunulmuyor/);
});

test('old bookmarks, search, canonical URLs and shared navigation lead to real journey content',()=>{
  assert.equal(model.resolveHref('quests.html?theme=valley'),'survival-quests.html?theme=valley#gorevler');
  assert.equal(model.resolveHref('survival.html#gorevler'),'survival-quests.html#gorevler');
  assert.equal(model.resolveHref('survival.html#atlas-hedefler'),'survival-quests-goals.html#atlas-hedefler');
  assert.ok(model.search('/yolculuk').some(e=>e.href==='survival-quests.html#gorevler'));
  assert.equal(model.search('uzun vadeli hedef')[0].href,'survival-quests-goals.html#atlas-hedefler');
  assert.equal(model.search('/gunluk')[0].href,'survival-quests-daily.html#atlas-gunluk');
  for(const file of pages){
    const h=read(file);
    assert.ok(h.includes('https://robsarcade.online/'+file));
    assert.ok(h.includes('page-navigation.js'));
    assert.ok(h.includes('survival-journey.css'));
    const nav=h.match(/<nav class="chunky-nav atlas-nav"[\s\S]*?<\/nav>/)[0];
    assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
    for(const destination of pages)assert.ok(nav.includes('href="'+destination+'"'));
    assert.ok(read('sitemap.xml').includes('/'+file+'</loc>'));
  }
});
