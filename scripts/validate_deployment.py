#!/usr/bin/env python3
import hashlib
import sys
from pathlib import Path

if len(sys.argv) != 3:
    raise SystemExit("usage: validate_deployment.py <tree> <source>")
tree, source = map(Path, sys.argv[1:])
required = [
    ".nojekyll", "CNAME", "index.html", "app.html", "app.js", "styles.css",
    "manifest.webmanifest", "animal-identicon.js", "favicon.ico", "favicon.png",
    "favicon.svg", "icon.png", "og-image.svg", "robots.txt", "sitemap.xml",
    "vendor/solana-web3.min.js", "assets/site.css", "assets/landing.css",
    "assets/posthog.js", "assets/kelvara-icon.png", "assets/solana-logo.svg",
    "assets/kamino.svg", "assets/steakhouse-usdg.svg", "assets/tokens/solana.svg",
    "assets/tokens/usdg.png", "assets/wallets/backpack.svg",
    "assets/wallets/phantom.svg", "assets/wallets/solflare.svg",
]
for rel in required:
    assert (tree / rel).is_file(), f"missing required file: {rel}"
assert (tree / "CNAME").read_text() == "app.kelvara.xyz\n", "wrong CNAME"
for p in tree.rglob("*"):
    rel = p.relative_to(tree)
    assert not (set(rel.parts) & {"demo", "docs", "local_server.py"}), f"forbidden payload: {rel}"
    assert not p.name.startswith("test_"), f"forbidden test payload: {rel}"
expected = [x for x in required if x not in {".nojekyll", "CNAME"}]
for rel in expected:
    a = tree / rel
    source_rel = "index.deployed.html" if rel == "index.html" else rel
    b = source / source_rel
    assert b.is_file(), f"source fixture missing: {source_rel}"
    assert hashlib.sha256(a.read_bytes()).digest() == hashlib.sha256(b.read_bytes()).digest(), f"hash mismatch: {rel} vs {source_rel}"
app = (tree / "app.html").read_text()
assert '<script type="module" src="/app.js"></script>' in app, "app.html missing app.js"
js = (tree / "app.js").read_text()
assert "https://api.kelvara.xyz" in js, "production API route missing"
assert 'location.hostname==="app.kelvara.xyz"' in js, "host routing guard missing"
print(f"PASS: {len(required)} required files; {len(expected)} exact source hashes; production route; forbidden payload absent")
