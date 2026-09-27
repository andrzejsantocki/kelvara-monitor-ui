const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'..','styles.css'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

test('all product routes use the shared page rhythm',()=>{
  assert.match(css,/--page-width:1200px/);
  assert.match(css,/\.stage:not\(\.connect-stage\)\{[^}]*padding-block:var\(--space-7\)/);
  assert.match(css,/\.intro\{[^}]*margin-bottom:var\(--space-6\)/);
});

test('monitor uses vertically separated operational panels',()=>{
  assert.match(css,/#stage-monitor\.active\{[^}]*display:grid[^}]*gap:var\(--space-6\)/);
  assert.match(css,/\.monitor-layout\{[^}]*gap:var\(--space-5\)/);
  assert.match(css,/\.protection-card\{[^}]*grid-template-columns:minmax\(0,1fr\)/);
});

test('operational metadata remains readable',()=>{
  assert.match(css,/\.row-name small,.row-value small\{[^}]*font-size:12px/);
  assert.match(css,/\.monitor-overview span\{[^}]*font-size:12px/);
  assert.match(css,/\.event time,.event small\{[^}]*font-size:12px/);
});

test('all modal toggles lock the document and modals are viewport bounded',()=>{
  assert.match(app,/function syncModalLock\(\)/);
  for(const name of ['toggleWalletSelector','toggleRevokeReview','toggleArmReview','toggleEvacuation'])assert.match(app,new RegExp(`function ${name}\\(`));
  assert.equal((app.match(/syncModalLock\(\)/g)||[]).length,5);
  assert.match(css,/\.modal-card,.wallet-selector-card\{[^}]*max-height:calc\(100svh - 48px\)[^}]*overflow:auto/);
  assert.match(css,/\.arm-review-steps\{[^}]*list-style:none/);
});

test('desktop header action remains in the trailing column',()=>{
  assert.match(css,/@media\(min-width:821px\)\{\.top-actions\{grid-column:3/);
});

test('connect diagram uses a cropped readable viewport',()=>{
  assert.match(html,/authority-flow-background\.svg\?v=20260927-layout/);
  assert.match(fs.readFileSync(path.join(__dirname,'..','assets','authority-flow-background.svg'),'utf8'),/viewBox="0 340 1600 430"/);
  assert.match(css,/\.diagram-viewport\{height:380px/);
  assert.match(css,/\.diagram-viewport \.authority-bg\{[^}]*height:100%[^}]*margin:0/);
  assert.match(html,/class="mobile-control-path"/);
  assert.match(css,/\.diagram-viewport\{display:none/);
  assert.match(css,/\.connect-stage:after\{display:none\}/);
});

test('mobile toast cannot widen the document',()=>{
  assert.match(css,/\.toast:not\(\.show\)\{display:none\}/);
  assert.match(css,/@media\(max-width:620px\)\{\.toast\.show\{left:14px;right:14px/);
  assert.match(css,/#stage-connect,.connect-grid,.connect-copy,.lookup-form,.diagram-section\{min-width:0;max-width:100%\}/);
});
