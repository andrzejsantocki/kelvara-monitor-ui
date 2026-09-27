const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

function section(id) {
  return html.match(new RegExp(`<section id="${id}"[^]*?(?=<section id=|</main>)`))?.[0] || '';
}

test('completed setup hides the numbered journey and returns to Positions', () => {
  const body = app.match(/function activateMonitoring\([^]*?\nfunction toggleArmReview/)?.[0] || '';
  assert.match(body, /monitoringActive=true/);
  assert.match(body, /\.journey[^;]*classList\.add\("hidden"\)/);
  assert.match(body, /setStage\("position"\)/);
  assert.doesNotMatch(body, /setStage\("monitor"\)/);
});

test('monitored position exposes live state and opens its monitor', () => {
  assert.match(html, /id="position-monitor-state"[^>]*>Not monitoring</);
  assert.match(html, /id="open-position-monitor"/);
  assert.match(app, /position-monitor-state/);
  assert.match(app, /\$\("#open-position-monitor"\)\.onclick=\(\)=>setStage\("monitor"\)/);
});

test('evacuation stays hidden until backend verifies three stored transactions', () => {
  const position = section('stage-position');
  const monitor = section('stage-monitor');
  assert.match(position, /POSITION ACTIONS/);
  assert.match(position, /id="prepare-evacuation" class="danger-button hidden">Evacuate now</);
  assert.doesNotMatch(monitor, /IMMEDIATE WITHDRAWAL|prepare-evacuation|Evacuate now/);
  const render = app.match(/function renderProtection\([^]*?\nasync function loadProtection/)?.[0] || '';
  assert.match(render, /status\.armed&&status\.armedCount===3&&status\.variants\?\.length===3/);
  assert.match(render, /#prepare-evacuation/);
});

test('journey remains hidden in established app mode', () => {
  const body = app.match(/function setStage\([^]*?\nasync function request/)?.[0] || '';
  assert.match(body, /monitoringActive\|\|name==="connect"/);
});

test('refresh restores only a provider-trusted matching wallet session', () => {
  assert.match(app, /connect\(\{onlyIfTrusted:true\}\)/);
  assert.match(app, /localStorage\.getItem\("kelvara_prod_wallet"\)/);
  assert.match(app, /current!==savedAddress/);
  assert.match(app, /await restoreTrustedWallet\(\)/);
});
