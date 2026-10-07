import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fetch } from '../src/index.js';

const wranglerConfig = fs.readFileSync(path.join(import.meta.dirname, '..', 'wrangler.toml'), 'utf8');

test('config attaches only the www host through a classic zone route', () => {
  assert.ok(wranglerConfig.includes('pattern = "www.kelvara.xyz/*"'));
  assert.ok(wranglerConfig.includes('zone_name = "kelvara.xyz"'));
  assert.doesNotMatch(wranglerConfig, /custom_domain\\s*=\\s*true/);
  assert.doesNotMatch(wranglerConfig, /pattern = "(?:kelvara\\.xyz|app\\.kelvara\\.xyz|api\\.kelvara\\.xyz)/);
});

async function responseFor(url, method = 'GET', headers = {}) {
  return fetch(new Request(url, { method, headers }), {});
}

test('redirects www path and query to apex with permanent redirect', async () => {
  const response = await responseFor('https://www.kelvara.xyz/docs/start?utm=1');
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://kelvara.xyz/docs/start?utm=1');
});

test('redirects HEAD without losing path or query', async () => {
  const response = await responseFor('https://www.kelvara.xyz/health?check=head', 'HEAD');
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), 'https://kelvara.xyz/health?check=head');
});

test('does not reflect an arbitrary host into Location', async () => {
  const response = await responseFor('https://evil.example/secret?x=1', 'GET', { host: 'evil.example' });
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('location'), null);
});
