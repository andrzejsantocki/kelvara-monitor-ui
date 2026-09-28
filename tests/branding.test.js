const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('Kelvara wordmark links to the public site', () => {
  assert.match(html, /<a class="wordmark" href="https:\/\/kelvara\.xyz\/?"/);
});

test('browser wallets can resolve Kelvara identity icons from app origin', () => {
  assert.match(html, /<link rel="icon" type="image\/png" href="\/icon\.png">/);
  assert.match(html, /<link rel="apple-touch-icon" href="\/icon\.png">/);
  assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/app\.kelvara\.xyz\/icon\.png">/);
  assert.match(html, /<img class="mark" src="\/assets\/kelvara\.svg"/);
  for (const relative of ['icon.png', 'favicon.ico', 'manifest.webmanifest', 'assets/kelvara.svg']) {
    assert.equal(fs.existsSync(path.join(__dirname, '..', relative)), true);
  }
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
