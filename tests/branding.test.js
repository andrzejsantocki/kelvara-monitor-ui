const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('Kelvara wordmark links to the public site', () => {
  assert.match(html, /<a class="wordmark" href="https:\/\/kelvara\.xyz\/?"/);
});

test('favicon and wordmark use the PNG brand icon', () => {
  assert.match(html, /<link rel="icon" href="\/assets\/kelvara-icon\.png" type="image\/png">/);
  assert.match(html, /<img class="mark" src="\/assets\/kelvara-icon\.png"/);
  assert.doesNotMatch(html, /kelvara\.svg/);
});

test('wallet picker uses branded SVG wallet icons', () => {
  for (const wallet of ['phantom', 'solflare', 'backpack']) {
    assert.match(html, new RegExp(`/assets/wallets/${wallet}\\.svg`));
  }
  assert.doesNotMatch(html, /class="wallet-logo">[PSB]</);
});
