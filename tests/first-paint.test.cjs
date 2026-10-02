const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {test}=require('node:test');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('all rendered pages carry the shared theme and navigation before scripts run',()=>{
  for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))) {
    const html=read(file);
    if(!html.includes('site-shell.js')) continue;
    assert.match(html,/<body[^>]*class="[^"]*network-shell/,file);
    assert.match(html,/<body[^>]*data-page=/,file);
    assert.match(html,/<nav class="site-nav"/,file);
    assert.match(html,/class="site-nav-inner"/,file);
    assert.match(html,/<footer class="site-footer"/,file);
    assert.doesNotMatch(html,/cdn\.tailwindcss\.com|tailwind\.config|id="cursor-glow"/,file);
  }
});
test('help navigation is static, follows the heading and has one active page',()=>{
  for(const page of ['help','rules','status','punishments','appeal','application']) {
    const html=read(page+'.html');
    const nav=html.match(/<nav class="section-navigation chunky-nav"[\s\S]*?<\/nav>/)[0];
    assert.ok(html.indexOf(nav)>html.indexOf('</header>'));
    assert.equal((nav.match(/<a /g)||[]).length,6);
    assert.equal((nav.match(/aria-current="page"/g)||[]).length,1);
  }
  assert.match(read('polish.css'),/\.page-head \{[^}]*border-bottom:0;/);
});
test('retired forms retain field names, verification and modal visibility without utility CSS',()=>{
  for(const page of ['appeal','application']) {
    const html=read(page+'.html');
    assert.match(html,/class="support-form"/);
    assert.match(html,/data-turnstile-widget/);
    assert.match(html,/data-form-status/);
    assert.match(html,/class="support-modal hidden"/);
    assert.match(html,/form-logic\.js/);
  }
  assert.match(read('forms.css'),/html\[data-theme\] \.support-modal.hidden \{ display:none;/);
});
