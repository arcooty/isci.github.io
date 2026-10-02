const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
test('split hub routing runs in the head before any old body content',()=>{
  for(const file of ['survival.html','skyblock.html','village.html','news.html']) {
    const html=read(file);
    assert.ok(html.indexOf('site-map.js')<html.indexOf('early-route.js'));
    assert.ok(html.indexOf('early-route.js')<html.indexOf('</head>'));
    assert.equal((html.match(/site-map\.js/g)||[]).length,1);
  }
});
test('early redirects hide only the outgoing page and retain query parameters',()=>{
  const module={exports:{}};
  vm.runInNewContext(read('site-map.js'),{module,URL});
  const document={documentElement:{style:{},setAttribute:()=>{}}};
  const location={pathname:'/survival.html',search:'?from=test',hash:'#meslekler',replace:target=>location.target=target};
  vm.runInNewContext(read('early-route.js'),{document,location,window:{ARCADE_SITE:module.exports}});
  assert.equal(document.documentElement.style.visibility,'hidden');
  assert.equal(location.target,'survival-jobs.html?from=test#jobs-meslekler');
  location.hash='#arazi'; delete location.target; document.documentElement.style={};
  vm.runInNewContext(read('early-route.js'),{document,location,window:{ARCADE_SITE:module.exports}});
  assert.equal(location.target,undefined);
  assert.equal(document.documentElement.style.visibility,undefined);
});
