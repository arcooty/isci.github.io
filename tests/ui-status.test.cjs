const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'ui.js'), 'utf8');
const runStatus = async (services, ping) => {
  const elements = Object.fromEntries(['home-state','floating-player-count','home-player-max','home-capacity'].map(id => [id,{textContent:'',dataset:{},style:{}}]));
  const context = {
    document:{getElementById:id => elements[id],hidden:false},
    window:{ARCADE_API:{base:'https://example.test/api/v1'}},
    AbortSignal, setInterval:() => {},
    fetch:async url => {
      const value = url.includes('mcsrvstat') ? ping : services;
      if (value instanceof Error) throw value;
      return {ok:true,json:async () => value};
    }
  };
  vm.runInNewContext(source,context);
  await new Promise(resolve => setImmediate(resolve));
  return elements;
};

test('uses public player count with the currently deployed services-only API', async () => {
  const el = await runStatus({services:{velocity:true}}, {online:true,players:{online:4,max:200}});
  assert.equal(el['home-state'].textContent,'Aktif');
  assert.equal(el['floating-player-count'].textContent,'4');
  assert.equal(el['home-player-max'].textContent,'200');
  assert.equal(el['home-capacity'].style.width,'2%');
});
test('prefers the API player summary when present', async () => {
  const el = await runStatus({services:{velocity:true},players:{online:3,max:100}}, {online:true,players:{online:2,max:200}});
  assert.equal(el['floating-player-count'].textContent,'3');
  assert.equal(el['home-capacity'].style.width,'3%');
});
test('does not report active when public connections are offline', async () => {
  const el = await runStatus({services:{velocity:true}}, {online:false});
  assert.equal(el['home-state'].dataset.state,'offline');
  assert.equal(el['floating-player-count'].textContent,'0');
});
test('can use the public ping if the API is unreachable', async () => {
  const el = await runStatus(new Error('Unavailable'), {online:true,players:{online:0,max:200}});
  assert.equal(el['home-state'].dataset.state,'online');
  assert.equal(el['floating-player-count'].textContent,'0');
});
test('keeps unavailable counts unknown instead of manufacturing player data', async () => {
  const el = await runStatus({services:{velocity:true}},new Error('Unavailable'));
  assert.equal(el['home-state'].dataset.state,'online');
  assert.equal(el['floating-player-count'].textContent,'—');
  assert.equal(el['home-player-max'].textContent,'—');
});
test('reports unknown when neither source is usable', async () => {
  const el = await runStatus(new Error('Unavailable'),new Error('Unavailable'));
  assert.equal(el['home-state'].dataset.state,'unknown');
  assert.equal(el['home-state'].textContent,'Bilgi alınamadı');
});
test('bounds the occupancy bar when cached capacity differs', async () => {
  const el = await runStatus({services:{velocity:true},players:{online:205,max:200}}, {online:true});
  assert.equal(el['home-capacity'].style.width,'100%');
});
