const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

test('initial connect stage preserves a clean root URL', () => {
  assert.match(
    source,
    /if\(name!==["']connect["']\|\|location\.hash\)location\.hash=name/,
    'setStage must not add #connect when the root URL has no hash',
  );
});
