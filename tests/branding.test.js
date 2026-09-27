const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('Kelvara wordmark links to the public site', () => {
  assert.match(html, /<a class="wordmark" href="https:\/\/kelvara\.xyz\/?"/);
});

test('favicon and wordmark reference an existing Kelvara SVG', () => {
  assert.match(html, /<link rel="icon" href="\/assets\/kelvara\.svg" type="image\/svg\+xml">/);
  assert.match(html, /<img class="mark" src="\/assets\/kelvara\.svg"/);
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'assets', 'kelvara.svg')), true);
  assert.doesNotMatch(html, /kelvara-icon\.png/);
});

test('wallet picker uses square local SVG wallet marks', () => {
  for (const wallet of ['phantom', 'solflare', 'backpack']) {
    const relative = `/assets/wallets/${wallet}.svg`;
    assert.match(html, new RegExp(relative.replaceAll('/', '\\/')));
    assert.equal(fs.existsSync(path.join(__dirname, '..', relative)), true);
  }
  const backpack = fs.readFileSync(path.join(__dirname, '..', 'assets', 'wallets', 'backpack.svg'), 'utf8');
  assert.match(backpack, /viewBox="0 0 24 24"/);
  assert.doesNotMatch(backpack, /fill="white"/);
  assert.doesNotMatch(html, /class="wallet-logo">[PSB]</);
});

test('header actions occupy the rightmost grid column', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
  assert.match(css, /\.top-actions\{[^}]*grid-column:3/);
});
