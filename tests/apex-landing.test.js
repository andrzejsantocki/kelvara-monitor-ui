const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const htmlFiles = ['index.html', 'demo/index.html', 'docs/index.html'];
const localReferencePattern = /(?:href|src)="(\/[^"#?]+|\.\.\/[^"#?]+|\.\/[^"#?]+)"/g;

function resolveReference(file, reference) {
  const clean = reference.split('?')[0];
  if (clean.startsWith('/')) return path.join(root, clean);
  return path.resolve(path.dirname(path.join(root, file)), clean);
}

test('apex release declares the intended custom domain', () => {
  assert.equal(fs.readFileSync(path.join(root, 'CNAME'), 'utf8'), 'kelvara.xyz\n');
});

test('every local HTML asset reference exists in the release tree', () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of html.matchAll(localReferencePattern)) {
      const reference = match[1];
      assert.equal(fs.existsSync(resolveReference(file, reference)), true, `${file}: missing ${reference}`);
    }
  }
});
