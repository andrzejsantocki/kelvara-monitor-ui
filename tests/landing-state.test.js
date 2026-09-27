const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

const demoContent = [
  '1 detected',
  'Steakhouse USDG High Yield',
  '4hKm…J6rE',
  'BoZD…3ut5',
  'Kvau…FLjd',
  'GzFg…kzkW',
  'Evidence current',
  'Steakhouse USDG',
];

test('landing page contains no fake position data', () => {
  for (const value of demoContent) assert.doesNotMatch(html, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('journey navigation starts hidden', () => {
  assert.match(html, /<nav class="journey hidden"/);
});

test('stages cannot be opened before evidence exists', () => {
  assert.match(app, /if\(name!=="connect"&&!evidence\)return/);
  assert.doesNotMatch(app, /document\.querySelectorAll\("\.journey-step"\)\.forEach\(button=>button\.onclick/);
});

test('disconnected wallet chip opens the wallet picker directly', () => {
  assert.match(app, /\$\("#wallet-chip"\)\.onclick=event=>\{event\.stopPropagation\(\);walletAddress\?toggleWalletMenu\(\):connect\(\)\}/);
});
