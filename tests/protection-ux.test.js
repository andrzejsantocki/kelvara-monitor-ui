const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

test('entering Monitor remains read-only and never requests wallet authentication', () => {
  const body = app.match(/function activateMonitoring\([^]*?\nfunction toggleEvacuation/)?.[0] || '';
  assert.doesNotMatch(body, /loadProtection|authenticateProtection|signMessage|armProtection/);
  assert.match(html, /Monitoring is read-only/);
});

test('arming protection starts with an explicit review before any signature', () => {
  assert.match(html, /id="arm-review-modal"/);
  assert.match(html, /id="confirm-arm-protection"/);
  assert.match(html, /Authentication signature/);
  assert.match(html, /Nonce setup transaction/);
  assert.match(html, /Three evacuation signatures/);
  assert.match(app, /\$\("#arm-protection"\)\.onclick=\(\)=>toggleArmReview\(true\)/);
  assert.match(app, /\$\("#confirm-arm-protection"\)\.onclick=async\(\)=>/);
  assert.doesNotMatch(app, /\$\("#arm-protection"\)\.onclick=armProtection/);
});

test('immediate evacuation stays separate from armed protection', () => {
  assert.match(html, /id="prepare-evacuation"[^>]*>Evacuate now</);
  assert.doesNotMatch(html, />Prepare protection transaction</);
  assert.doesNotMatch(html, /IMMEDIATE WITHDRAWAL/);
});
